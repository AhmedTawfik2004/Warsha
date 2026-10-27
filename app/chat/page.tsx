"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { t, SHOPS, type Lang } from "../lib/translations";
import { createClient, getCurrentUser } from "../lib/supabase";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang]   = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const savedTheme = (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";
    const savedLang  = (localStorage.getItem("warsha-lang")  as Lang) || "ar";
    setTheme(savedTheme); setLang(savedLang); setMounted(true);
  }, []);
  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next); localStorage.setItem("warsha-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }, [theme]);
  const toggleLang = useCallback(() => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next); localStorage.setItem("warsha-lang", next);
    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
  }, [lang]);
  return { theme, lang, toggleTheme, toggleLang, mounted };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender_name?: string;
}

interface Conversation {
  id: string;
  shop_id: string;
  user_id: string;
  shop_name: string;
  last_message?: string;
  last_at?: string;
  unread?: number;
}

function ChatPageInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser]                     = useState<any>(null);
  const [conversations, setConversations]   = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId]     = useState<string | null>(null);
  const [messages, setMessages]             = useState<Message[]>([]);
  const [newMsg, setNewMsg]                 = useState("");
  const [sending, setSending]               = useState(false);
  const [loadingConvs, setLoadingConvs]     = useState(true);
  const [loadingMsgs, setLoadingMsgs]       = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const bg         = isDark ? "#0F1414" : "#FAF7F2";
  const surface    = isDark ? "#1F2A2E" : "#ffffff";
  const border     = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const textPri    = isDark ? "#EAECE9" : "#111110";
  const textSec    = isDark ? "rgba(234,236,233,.5)" : "rgba(0,0,0,.45)";
  const accent     = isDark ? "#6E7F77" : "#214E4F";

  // Load user
  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  // If ?shop= param passed, start or open that conversation
  useEffect(() => {
    if (!user) return;
    const shopId = searchParams.get("shop");
    if (!shopId) return;

    async function openOrCreate() {
      const sb = createClient();
      const shopInfo = SHOPS.find(s => String(s.id) === shopId);
      const shopName = shopInfo?.name ?? "Workshop";

      const { data: existing } = await sb
        .from("conversations")
        .select("id")
        .eq("shop_id", shopId)
        .eq("user_id", user.id)
        .single();

      if (existing) {
        setActiveConvId(existing.id);
      } else {
        const { data: created } = await sb
          .from("conversations")
          .insert({ shop_id: shopId, user_id: user.id, shop_name: shopName })
          .select("id")
          .single();
        if (created) setActiveConvId(created.id);
      }
    }
    openOrCreate();
  }, [user, searchParams]);

  // Load conversations list
  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoadingConvs(true);
      const sb = createClient();
      const { data } = await sb
        .from("conversations")
        .select("*")
        .or(`user_id.eq.${user.id},shop_owner_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });
      setConversations(data ?? []);
      setLoadingConvs(false);
    }
    load();
  }, [user, activeConvId]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    setLoadingMsgs(true);
    const sb = createClient();

    sb.from("messages")
      .select("*")
      .eq("conversation_id", activeConvId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? []);
        setLoadingMsgs(false);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });

    const channel = sb
      .channel(`msgs-${activeConvId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConvId}` },
        payload => {
          setMessages(prev => [...prev, payload.new as Message]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }
      )
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, [activeConvId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || !user || !activeConvId) return;
    setSending(true);
    const sb = createClient();
    await sb.from("messages").insert({
      conversation_id: activeConvId,
      sender_id: user.id,
      body: newMsg.trim(),
    });
    await sb.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConvId);
    setNewMsg("");
    setSending(false);
  }

  if (!mounted) return null;

  if (!user) {
    return (
      <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPri }}>
        <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 24 }}>
          <div style={{ fontSize: 40 }}>💬</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: textPri }}>{lang === "ar" ? "سجّل دخولك للتواصل" : "Sign in to message workshops"}</h2>
          <p style={{ fontSize: 14, color: textSec, textAlign: "center", maxWidth: 300 }}>
            {lang === "ar" ? "تحتاج لحساب علشان تقدر تتواصل مع الورش" : "You need an account to message workshops"}
          </p>
          <Link href="/auth/login" style={{ padding: "12px 28px", borderRadius: 12, background: accent, color: "#fff", fontWeight: 700, fontSize: 14 }}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </div>
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPri, display: "flex", flexDirection: "column" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      <div style={{ flex: 1, display: "flex", maxWidth: 1000, margin: "0 auto", width: "100%", padding: "20px 16px 80px", gap: 16, alignItems: "flex-start" }}>

        {/* Sidebar — conversation list */}
        <div style={{
          width: 280, flexShrink: 0,
          background: surface, border: `1px solid ${border}`,
          borderRadius: 16, overflow: "hidden",
          display: "flex", flexDirection: "column",
          maxHeight: "calc(100vh - 120px)",
        }}>
          <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${border}`, fontWeight: 700, fontSize: 15, color: textPri }}>
            {lang === "ar" ? "المحادثات" : "Conversations"}
          </div>

          {loadingConvs ? (
            <div style={{ padding: 24, color: textSec, fontSize: 13, textAlign: "center" }}>
              {lang === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 24, color: textSec, fontSize: 13, textAlign: "center", lineHeight: 1.7 }}>
              {lang === "ar" ? "لا توجد محادثات بعد.\nتصفح الورش وابدأ محادثة!" : "No conversations yet.\nBrowse workshops to start one!"}
              <br />
              <Link href="/workshops" style={{ display: "inline-block", marginTop: 12, padding: "8px 18px", borderRadius: 8, background: accent, color: "#fff", fontSize: 12, fontWeight: 700 }}>
                {lang === "ar" ? "تصفح الورش" : "Browse workshops"}
              </Link>
            </div>
          ) : (
            <div style={{ overflowY: "auto", flex: 1 }}>
              {conversations.map(conv => (
                <button key={conv.id} onClick={() => setActiveConvId(conv.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", background: conv.id === activeConvId ? (isDark ? "rgba(33,78,79,.2)" : "rgba(33,78,79,.07)") : "transparent",
                    border: "none", borderBottom: `1px solid ${border}`,
                    cursor: "pointer", fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left",
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔧</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: textPri, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.shop_name}</div>
                    <div style={{ fontSize: 11, color: textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.last_message ?? (lang === "ar" ? "ابدأ المحادثة" : "Start chatting")}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, background: surface, border: `1px solid ${border}`,
          borderRadius: 16, overflow: "hidden",
          display: "flex", flexDirection: "column",
          maxHeight: "calc(100vh - 120px)", minHeight: 400,
        }}>
          {!activeConvId ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: textSec, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 40 }}>💬</div>
              <p style={{ fontSize: 14, maxWidth: 260, lineHeight: 1.7 }}>
                {lang === "ar" ? "اختار محادثة من القائمة أو تصفح الورش وابدأ محادثة جديدة" : "Select a conversation or browse workshops to start a new one"}
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔧</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPri }}>{activeConv?.shop_name ?? "Workshop"}</div>
                  <div style={{ fontSize: 11, color: textSec }}>{lang === "ar" ? "ورشة" : "Workshop"}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                {loadingMsgs ? (
                  <div style={{ color: textSec, fontSize: 13, textAlign: "center", paddingTop: 20 }}>
                    {lang === "ar" ? "جاري التحميل..." : "Loading messages..."}
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ color: textSec, fontSize: 13, textAlign: "center", paddingTop: 20 }}>
                    {lang === "ar" ? "ابدأ المحادثة 👋" : "Start the conversation 👋"}
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? (dir === "rtl" ? "flex-start" : "flex-end") : (dir === "rtl" ? "flex-end" : "flex-start") }}>
                        <div style={{
                          maxWidth: "72%", padding: "9px 14px",
                          borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: isMe ? accent : (isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.05)"),
                          color: isMe ? "#fff" : textPri,
                          fontSize: 13, lineHeight: 1.55,
                        }}>
                          {msg.body}
                          <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: dir === "rtl" ? "left" : "right" }}>
                            {new Date(msg.created_at).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={{ padding: "12px 16px", borderTop: `1px solid ${border}`, display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type a message..."}
                  style={{
                    flex: 1, padding: "10px 14px",
                    background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)",
                    border: `1px solid ${border}`,
                    borderRadius: 12, color: textPri,
                    fontSize: 13, fontFamily: "inherit",
                    outline: "none", direction: dir,
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = accent}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = border}
                />
                <button type="submit" disabled={!newMsg.trim() || sending}
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: newMsg.trim() ? accent : (isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"),
                    border: "none", cursor: newMsg.trim() ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, transition: "all .15s", flexShrink: 0,
                  }}>
                  {sending ? "⏳" : dir === "rtl" ? "⬅️" : "➡️"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
