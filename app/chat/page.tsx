"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  getCurrentUser, getOrCreateConversation, getConversations,
  getMessages, sendMessage, subscribeToMessages
} from "../lib/supabase";
import { SHOPS, CATEGORIES, type Lang } from "../lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark"|"light">("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTheme((localStorage.getItem("warsha-theme") as any) || "light");
    setLang((localStorage.getItem("warsha-lang") as any) || "ar");
    setMounted(true);
  }, []);
  const toggleTheme = useCallback(() => {
    const n = theme==="dark"?"light":"dark";
    setTheme(n); localStorage.setItem("warsha-theme",n);
    document.documentElement.setAttribute("data-theme",n);
  }, [theme]);
  const toggleLang = useCallback(() => {
    const n:Lang=lang==="ar"?"en":"ar";
    setLang(n); localStorage.setItem("warsha-lang",n);
    document.documentElement.setAttribute("lang",n);
    document.documentElement.setAttribute("dir",n==="ar"?"rtl":"ltr");
  }, [lang]);
  return { theme, lang, toggleTheme, toggleLang, mounted };
}

function ChatInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const searchParams = useSearchParams();
  const shopIdParam = searchParams.get("shop");

  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUser().then(async u => {
      if (!u) { window.location.href = "/auth/login"; return; }
      setUser(u);
      const convs = await getConversations(u.id);
      setConversations(convs);
      if (shopIdParam) {
        const conv = await getOrCreateConversation(u.id, Number(shopIdParam));
        if (conv) {
          setActiveConvId(conv.id);
          setConversations(prev => prev.find(c => c.id === conv.id) ? prev : [conv, ...prev]);
        }
      } else if (convs.length > 0) {
        setActiveConvId(convs[0].id);
      }
      setLoading(false);
    });
  }, [shopIdParam]);

  useEffect(() => {
    if (!activeConvId) return;
    getMessages(activeConvId).then(setMessages);
    inputRef.current?.focus();
  }, [activeConvId]);

  useEffect(() => {
    if (!activeConvId) return;
    const unsub = subscribeToMessages(activeConvId, msg => {
      setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
    });
    return unsub;
  }, [activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || !user || !activeConvId || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, sender_id: user.id, content, created_at: new Date().toISOString(), temp: true }]);
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, last_message: content, last_message_at: new Date().toISOString() } : c));
    await sendMessage(activeConvId, user.id, content);
    setSending(false);
    inputRef.current?.focus();
  }

  if (!mounted || loading) return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #E8730A", borderTopColor:"transparent", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeShop = activeConv ? SHOPS.find(s => s.id === activeConv.shop_id) : null;
  const activeShopCat = activeShop ? CATEGORIES.find(c => c.id === activeShop.category) : null;

  return (
    <div dir={dir} style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)", color:"var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* ── Sidebar ── */}
        <div style={{
          width:300, flexShrink:0, display:"flex", flexDirection:"column",
          borderInlineEnd:"1px solid var(--border)",
          background:"var(--bg-card)",
        }}>
          {/* Header */}
          <div style={{ padding:"18px 18px 14px", borderBottom:"1px solid var(--border)" }}>
            <h2 style={{ fontSize:16, fontWeight:800, color:"var(--text-primary)", margin:0 }}>
              {lang==="ar" ? "رسائلي" : "Messages"}
            </h2>
            <p style={{ fontSize:11, color:"var(--text-tertiary)", margin:"4px 0 0" }}>
              {conversations.length} {lang==="ar" ? "محادثة" : "conversations"}
            </p>
          </div>

          {/* Conversation list */}
          <div style={{ flex:1, overflowY:"auto" }}>
            {conversations.length === 0 ? (
              <div style={{ padding:"36px 20px", textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
                <p style={{ fontSize:13, color:"var(--text-tertiary)", margin:"0 0 16px" }}>
                  {lang==="ar" ? "مفيش محادثات لسه" : "No conversations yet"}
                </p>
                <Link href="/workshops" style={{ fontSize:13, color:"#E8730A", textDecoration:"none", fontWeight:600 }}>
                  {lang==="ar" ? "تصفح الورش ←" : "Browse workshops →"}
                </Link>
              </div>
            ) : conversations.map(conv => {
              const shop = SHOPS.find(s => s.id === conv.shop_id);
              const cat = shop ? CATEGORIES.find(c => c.id === shop.category) : null;
              const isActive = conv.id === activeConvId;
              return (
                <button key={conv.id} onClick={() => setActiveConvId(conv.id)} style={{
                  width:"100%", textAlign:dir==="rtl"?"right":"left", direction:dir,
                  padding:"14px 18px",
                  background:isActive?"rgba(232,115,10,.07)":"transparent",
                  border:"none", borderBottom:"1px solid var(--border)",
                  borderInlineStart:isActive?"3px solid #E8730A":"3px solid transparent",
                  cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:12,
                  transition:"background .15s",
                }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`rgba(232,115,10,.1)`, border:"1px solid rgba(232,115,10,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {cat?.icon ?? "🔧"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:isActive?"#E8730A":"var(--text-primary)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {shop?.name ?? `Shop #${conv.shop_id}`}
                    </div>
                    <div style={{ fontSize:11, color:"var(--text-tertiary)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginTop:2 }}>
                      {conv.last_message || (lang==="ar" ? "ابدأ المحادثة" : "Start conversation")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {activeConvId && activeShop ? (
            <>
              {/* Chat header */}
              <div style={{ padding:"14px 22px", borderBottom:"1px solid var(--border)", background:"var(--bg-card)", display:"flex", alignItems:"center", gap:14, direction:dir }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`rgba(232,115,10,.1)`, border:"1px solid rgba(232,115,10,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {activeShopCat?.icon ?? "🔧"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"var(--text-primary)" }}>{activeShop.name}</div>
                  <div style={{ fontSize:11, color:"var(--text-tertiary)", marginTop:2 }}>
                    📍 {activeShop.area[lang]}
                    {activeShopCat && <span style={{ marginInlineStart:8, color:"#E8730A", fontWeight:600 }}>· {lang==="ar" ? activeShopCat.ar : activeShopCat.en}</span>}
                  </div>
                </div>
                <Link href={`/shop/${activeShop.id}`} style={{ fontSize:12, color:"#E8730A", textDecoration:"none", fontWeight:600, flexShrink:0, padding:"6px 12px", borderRadius:8, border:"1px solid rgba(232,115,10,.3)", background:"rgba(232,115,10,.06)" }}>
                  {lang==="ar" ? "عرض الورشة" : "View shop"}
                </Link>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:"24px 22px 8px" }}>
                {messages.length === 0 && (
                  <div style={{ textAlign:"center", padding:"60px 0" }}>
                    <div style={{ fontSize:48, marginBottom:14 }}>👋</div>
                    <p style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)", margin:"0 0 6px" }}>
                      {lang==="ar" ? `ابدأ محادثة مع ${activeShop.name}` : `Start a conversation with ${activeShop.name}`}
                    </p>
                    <p style={{ fontSize:13, color:"var(--text-tertiary)", margin:0 }}>
                      {lang==="ar" ? "اسأل عن الخدمات أو حدد موعد" : "Ask about services or schedule an appointment"}
                    </p>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    const showTime = i === 0 || new Date(messages[i-1].created_at).getMinutes() !== new Date(msg.created_at).getMinutes();
                    return (
                      <div key={msg.id ?? i}>
                        {showTime && (
                          <div style={{ textAlign:"center", fontSize:10, color:"var(--text-tertiary)", margin:"8px 0 4px" }}>
                            {new Date(msg.created_at).toLocaleTimeString(lang==="ar"?"ar-EG":"en-GB", { hour:"2-digit", minute:"2-digit" })}
                          </div>
                        )}
                        <div style={{ display:"flex", justifyContent:isMe?(dir==="rtl"?"flex-start":"flex-end"):(dir==="rtl"?"flex-end":"flex-start") }}>
                          <div style={{
                            maxWidth:"72%", padding:"11px 15px", borderRadius:18,
                            borderBottomRightRadius: isMe && dir!=="rtl" ? 4 : 18,
                            borderBottomLeftRadius: isMe && dir==="rtl" ? 4 : 18,
                            background: isMe ? "#E8730A" : "var(--bg-card)",
                            color: isMe ? "#fff" : "var(--text-primary)",
                            border: isMe ? "none" : "1px solid var(--border)",
                            fontSize:14, lineHeight:1.6,
                            opacity: msg.temp ? 0.7 : 1,
                            boxShadow: isMe ? "0 2px 8px rgba(232,115,10,.25)" : "0 1px 4px rgba(0,0,0,.06)",
                          }}>
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div ref={bottomRef} style={{ height:4 }} />
              </div>

              {/* Input */}
              <div style={{ padding:"14px 22px 18px", borderTop:"1px solid var(--border)", background:"var(--bg-card)" }}>
                <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                  <div style={{
                    flex:1, display:"flex", alignItems:"center",
                    padding:"12px 16px", borderRadius:14,
                    background:"var(--bg-secondary)",
                    border:"1.5px solid var(--border-strong)",
                    transition:"border-color .2s",
                  }}
                    onFocus={() => {}}
                  >
                    <input
                      ref={inputRef}
                      type="text" value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && !e.shiftKey && handleSend()}
                      placeholder={lang==="ar" ? "اكتب رسالتك هنا..." : "Type your message..."}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"var(--text-primary)", fontSize:14, fontFamily:"inherit", direction:dir, textAlign:dir==="rtl"?"right":"left" }}
                    />
                  </div>
                  <button onClick={handleSend} disabled={!input.trim() || sending}
                    style={{
                      width:48, height:48, borderRadius:14, flexShrink:0,
                      background: input.trim() && !sending ? "#E8730A" : "var(--bg-secondary)",
                      border:"none", cursor:input.trim()&&!sending?"pointer":"not-allowed",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all .15s",
                      boxShadow: input.trim() && !sending ? "0 2px 10px rgba(232,115,10,.3)" : "none",
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim()&&!sending?"#fff":"var(--text-tertiary)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {dir==="rtl"
                        ? <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        : <path d="M2 2l20 7-9 4-4 9-7-20zM22 2L11 13"/>
                      }
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize:10, color:"var(--text-tertiary)", margin:"8px 0 0", textAlign:"center" }}>
                  {lang==="ar" ? "رسائلك محمية ومشفرة داخل المنصة" : "Your messages are encrypted and secure within the platform"}
                </p>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, padding:24 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(232,115,10,.08)", border:"1px solid rgba(232,115,10,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>💬</div>
              <p style={{ fontSize:16, fontWeight:700, color:"var(--text-primary)", margin:0 }}>
                {lang==="ar" ? "اختار محادثة" : "Select a conversation"}
              </p>
              <p style={{ fontSize:13, color:"var(--text-tertiary)", margin:0, textAlign:"center" }}>
                {lang==="ar" ? "أو تصفح الورش وابدأ محادثة جديدة" : "Or browse workshops to start a new conversation"}
              </p>
              <Link href="/workshops" style={{ padding:"10px 24px", borderRadius:10, background:"#E8730A", color:"#fff", fontSize:13, fontWeight:700, textDecoration:"none", fontFamily:"inherit", marginTop:4 }}>
                {lang==="ar" ? "تصفح الورش" : "Browse workshops"}
              </Link>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"var(--bg)" }} />}>
      <ChatInner />
    </Suspense>
  );
}
