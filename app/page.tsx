"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { t, CATEGORIES, FEATURED_SHOPS, type Lang } from "./lib/translations";
import Navbar from "./components/Navbar";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const th = (localStorage.getItem("warsha-theme") as "dark" | "light") || "light";
    const ln = (localStorage.getItem("warsha-lang") as Lang) || "ar";
    setTheme(th); setLang(ln); setMounted(true);
    document.documentElement.setAttribute("data-theme", th);
    document.documentElement.setAttribute("lang", ln);
    document.documentElement.setAttribute("dir", ln === "ar" ? "rtl" : "ltr");
  }, []);
  const toggleTheme = useCallback(() => {
    const n = theme === "dark" ? "light" : "dark";
    setTheme(n); localStorage.setItem("warsha-theme", n);
    document.documentElement.setAttribute("data-theme", n);
  }, [theme]);
  const toggleLang = useCallback(() => {
    const n: Lang = lang === "ar" ? "en" : "ar";
    setLang(n); localStorage.setItem("warsha-lang", n);
    document.documentElement.setAttribute("lang", n);
    document.documentElement.setAttribute("dir", n === "ar" ? "rtl" : "ltr");
  }, [lang]);
  return { theme, lang, toggleTheme, toggleLang, mounted };
}

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,115,10";
}

const PROBLEM_MAP: { keywords: string[]; cat: string }[] = [
  { keywords: ["ac","a/c","air con","not cooling","تكييف","فريون","مش بيبرد"], cat: "car_ac" },
  { keywords: ["overheat","engine","oil","محرك","زيت","بيسخن","won't start","مش بيشتغل"], cat: "mechanical" },
  { keywords: ["tyre","tire","flat","wheel","rim","إطار","عجل","جنط"], cat: "tires" },
  { keywords: ["glass","windscreen","crack","زجاج","شرخ","كسر"], cat: "glass_repair" },
  { keywords: ["wrap","paint","dent","scratch","دهان","تغليف","خدش"], cat: "paint_wrap" },
  { keywords: ["ceramic","ppf","tint","سيراميك","تظليل","حماية"], cat: "car_protection" },
  { keywords: ["wash","detail","polish","غسيل","تلميع","تفصيل"], cat: "car_wash" },
  { keywords: ["battery","electric","wiring","كهرباء","بطارية","أسلاك"], cat: "auto_electric" },
  { keywords: ["diagnos","scan","fault","code","check engine","دياجنوستيك","فحص"], cat: "diagnostics" },
  { keywords: ["speaker","screen","audio","sound","شاشة","صوت","سبيكر"], cat: "interior" },
  { keywords: ["spoiler","body kit","سبويلر","بودي كيت"], cat: "exterior" },
  { keywords: ["turbo","ecu","exhaust","performance","تيونينج","شكمان"], cat: "performance" },
];
const PROBLEM_WORDS = ["not","won't","broken","noise","leak","overheating","grinding","مش","بيسخن","صوت","مشكلة"];

function handleSearch(query: string) {
  const q = query.trim();
  if (!q) { window.location.href = "/workshops"; return; }
  const lower = q.toLowerCase();
  const looksLikeProblem = q.split(" ").length > 2 || PROBLEM_WORDS.some(w => lower.includes(w));
  if (looksLikeProblem) { window.location.href = `/diagnose?q=${encodeURIComponent(q)}`; return; }
  const match = PROBLEM_MAP.find(p => p.keywords.some(k => lower.includes(k)));
  window.location.href = match ? `/workshops?cat=${match.cat}&q=${encodeURIComponent(q)}` : `/workshops?q=${encodeURIComponent(q)}`;
}

export default function HomePage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? "#0f0f0e" : "#ffffff";
  const bgSecondary = isDark ? "#161614" : "#f7f7f5";
  const textPrimary = isDark ? "#ffffff" : "#111110";
  const textSecondary = isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)";
  const textTertiary = isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)";
  const borderColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const cardBg = isDark ? "#1a1a18" : "#ffffff";

  if (!mounted) return null;

  const filteredSugg = tr.suggestions.filter(s => query.length > 0 ? s.toLowerCase().includes(query.toLowerCase()) : true);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── HERO ── */}
      <section style={{ padding: "56px 20px 48px", textAlign: "center", background: isDark ? "linear-gradient(180deg, #1a1410 0%, #0f0f0e 100%)" : "linear-gradient(180deg, #fff8f3 0%, #ffffff 100%)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* Pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, background: "rgba(232,115,10,.1)", border: "1px solid rgba(232,115,10,.2)", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8730A", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#E8730A" }}>
              {lang === "ar" ? "٦٧+ ورشة معتمدة في القاهرة الجديدة" : "67+ verified workshops in New Cairo"}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 800, color: textPrimary, margin: "0 0 14px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            {lang === "ar" ? (
              <>ورشتك الصح،<br /><span style={{ color: "#E8730A" }}>قريبة منك</span></>
            ) : (
              <>Find the right workshop,<br /><span style={{ color: "#E8730A" }}>near you</span></>
            )}
          </h1>
          <p style={{ fontSize: 16, color: textSecondary, margin: "0 0 36px", lineHeight: 1.7 }}>
            {lang === "ar" ? "دليل شامل لورش السيارات في مدينتي، الشروق، القاهرة الجديدة" : "The complete guide to car workshops in Madinaty, Sherouk & New Cairo"}
          </p>

          {/* Search bar */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: 520, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px",
              background: cardBg,
              borderRadius: 16,
              border: focused ? "2px solid #E8730A" : `2px solid ${borderColor}`,
              boxShadow: focused ? "0 0 0 4px rgba(232,115,10,.12), 0 8px 32px rgba(0,0,0,.1)" : "0 4px 24px rgba(0,0,0,.08)",
              transition: "all .2s",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused ? "#E8730A" : textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "stroke .2s" }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={e => e.key === "Enter" && handleSearch(query)}
                placeholder={lang === "ar" ? "ابحث عن ورشة أو خدمة..." : "Search for a workshop or service..."}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 15, color: textPrimary, fontFamily: "inherit",
                  direction: dir, textAlign: dir === "rtl" ? "right" : "left",
                }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: textTertiary, fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
              )}
              <button
                onClick={() => handleSearch(query)}
                style={{
                  padding: "8px 18px", borderRadius: 10, background: "#E8730A", color: "#fff",
                  border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  fontFamily: "inherit", flexShrink: 0, whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(232,115,10,.3)",
                }}
              >
                {lang === "ar" ? "بحث" : "Search"}
              </button>
            </div>

            {/* Suggestions dropdown */}
            {focused && filteredSugg.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
                background: cardBg, border: `1px solid ${borderColor}`,
                borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,.15)",
                overflow: "hidden",
              }}>
                {filteredSugg.slice(0, 6).map(s => (
                  <button key={s} onMouseDown={() => { setQuery(s); handleSearch(s); }}
                    style={{
                      width: "100%", padding: "11px 18px", background: "transparent", border: "none",
                      cursor: "pointer", fontSize: 13, color: textSecondary, fontFamily: "inherit",
                      textAlign: dir === "rtl" ? "right" : "left", display: "flex", alignItems: "center", gap: 10,
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(232,115,10,.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.4 }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick suggestion pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 }}>
            {(lang === "ar" ? ["غسيل سيارة", "تكييف", "فحص شامل", "إطارات"] : ["Car wash", "AC repair", "Full checkup", "Tires"]).map(s => (
              <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                style={{
                  padding: "6px 14px", borderRadius: 99, background: "transparent",
                  border: `1px solid ${borderColor}`, cursor: "pointer",
                  fontSize: 12, color: textSecondary, fontFamily: "inherit",
                  transition: "all .15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLButtonElement).style.color = "#E8730A"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = borderColor; (e.currentTarget as HTMLButtonElement).style.color = textSecondary; }}
              >{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: isDark ? "#141412" : "#f2f2f0", borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, padding: "14px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", justifyContent: "center", gap: "clamp(24px, 6vw, 64px)", flexWrap: "wrap" }}>
          {[
            { val: "67+", label: lang === "ar" ? "ورشة معتمدة" : "Verified workshops" },
            { val: "4",   label: lang === "ar" ? "مناطق" : "Areas covered" },
            { val: "12",  label: lang === "ar" ? "تخصص" : "Specialisations" },
            { val: "٣٠ ث", label: lang === "ar" ? "وقت البحث" : "Avg. search time" },
          ].map(s => (
            <div key={s.val} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#E8730A", letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: textTertiary, marginTop: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "48px 20px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                {lang === "ar" ? "التخصصات" : "SPECIALISATIONS"}
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: textPrimary, margin: 0, letterSpacing: "-0.01em" }}>{tr.catHeading}</h2>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "#E8730A", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              {lang === "ar" ? "كل التخصصات" : "All categories"}
              <span style={{ fontSize: 16 }}>{dir === "rtl" ? "←" : "→"}</span>
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
            className="warsha-cat-grid">
            {CATEGORIES.map(cat => {
              const rgb = hexRgb(cat.accent);
              return (
                <Link key={cat.id} href={`/workshops?cat=${cat.id}`}
                  style={{
                    display: "flex", flexDirection: "column", gap: 10,
                    padding: "18px 16px", borderRadius: 16,
                    background: cardBg,
                    border: `1px solid ${borderColor}`,
                    textDecoration: "none", transition: "all .18s",
                    minHeight: 130,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `rgba(${rgb},.06)`;
                    el.style.borderColor = `rgba(${rgb},.3)`;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 8px 24px rgba(${rgb},.12)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = cardBg;
                    el.style.borderColor = borderColor;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 3 }}>
                      {lang === "ar" ? cat.ar : cat.en}
                    </div>
                    <div style={{ fontSize: 11, color: textTertiary }}>
                      {cat.count[lang]} {tr.shopUnit}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED SHOPS ── */}
      <section style={{ padding: "0 20px 56px", background: bgSecondary, paddingTop: 48, borderTop: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
                {lang === "ar" ? "مختارة بعناية" : "HAND PICKED"}
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: textPrimary, margin: 0, letterSpacing: "-0.01em" }}>{tr.featuredHeading}</h2>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "#E8730A", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              {tr.viewAll} <span style={{ fontSize: 16 }}>{dir === "rtl" ? "←" : "→"}</span>
            </Link>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
            {FEATURED_SHOPS.map(shop => {
              const cat = CATEGORIES.find(c => c.id === shop.category);
              const rgb = hexRgb(cat?.accent ?? "#E8730A");
              return (
                <div key={shop.id} style={{
                  background: cardBg, borderRadius: 18, border: `1px solid ${borderColor}`,
                  padding: 20, transition: "all .18s", cursor: "pointer",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, direction: dir }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: textTertiary }}>📍 {shop.area[lang]}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, marginInlineStart: 12 }}>
                      {cat?.icon ?? "🔧"}
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < Math.round(shop.rating) ? "#F59E0B" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 12 }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>{shop.rating}</span>
                    {shop.reviews > 0 && <span style={{ fontSize: 12, color: textTertiary }}>({shop.reviews})</span>}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                    {shop.tags[lang].slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", color: textSecondary, border: `1px solid ${borderColor}` }}>{tag}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/chat?shop=${shop.id}`} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, background: "#E8730A", color: "#fff",
                      fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center",
                      display: "block", transition: "background .15s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
                    >
                      💬 {lang === "ar" ? "تواصل" : "Message"}
                    </Link>
                    <Link href={`/shop/${shop.id}`} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10,
                      background: "transparent", color: textSecondary,
                      border: `1px solid ${borderColor}`,
                      fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center",
                      display: "block", transition: "all .15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = borderColor; (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; }}
                    >
                      {tr.btnView}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "56px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
            {lang === "ar" ? "كيف يعمل؟" : "HOW IT WORKS"}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: textPrimary, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{tr.howHeading}</h2>
          <p style={{ fontSize: 14, color: textSecondary, marginBottom: 44, lineHeight: 1.7 }}>{tr.howSubhead}</p>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {tr.steps.map((item, i) => (
              <div key={item.step} style={{
                padding: "28px 20px", borderRadius: 18,
                background: cardBg, border: `1px solid ${borderColor}`,
                textAlign: "center", position: "relative",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(232,115,10,.1)", border: "1px solid rgba(232,115,10,.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "#E8730A",
                  margin: "0 auto 16px",
                }}>{i + 1}</div>
                <div style={{ fontSize: 30, marginBottom: 14 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "56px 20px", background: isDark ? "#1a1410" : "#fff8f3", borderTop: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(232,115,10,.1)", border: "1px solid rgba(232,115,10,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 20px" }}>🏪</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: textPrimary, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{tr.footerCtaH}</h2>
          <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.8, margin: "0 0 32px" }}>{tr.footerCtaBody}</p>
          <Link href="/list-shop" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 36px", background: "#E8730A", color: "#fff",
            borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(232,115,10,.3)",
            transition: "all .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 28px rgba(232,115,10,.35)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(232,115,10,.3)"; }}
          >
            {tr.footerCtaBtn}
            <span style={{ fontSize: 18 }}>{dir === "rtl" ? "←" : "→"}</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "24px 20px", borderTop: `1px solid ${borderColor}`, background: bg }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, color: textTertiary }}>{tr.footerCopy}</span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/about" style={{ color: textTertiary, textDecoration: "none", fontSize: 12 }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = textTertiary}
            >{tr.navAbout}</Link>
            <Link href="/list-shop" style={{ color: textTertiary, textDecoration: "none", fontSize: 12 }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = textTertiary}
            >{tr.navRegisterCta}</Link>
            <Link href="/map" style={{ color: textTertiary, textDecoration: "none", fontSize: 12 }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = textTertiary}
            >{tr.navMap}</Link>
          </div>
        </div>
      </footer>

      {/* ── MOBILE BOTTOM NAV ── */}
      <style>{`
        @media (max-width: 768px) {
          .warsha-mobile-nav {
            display: flex !important;
          }
          .warsha-desktop-nav {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .warsha-mobile-nav {
            display: none !important;
          }
        }
        @supports (-webkit-touch-callout: none) {
          .warsha-mobile-nav {
            padding-bottom: env(safe-area-inset-bottom, 16px) !important;
          }
        }
      `}</style>

      <div className="warsha-mobile-nav" style={{
        display: "none",
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: isDark ? "rgba(15,15,14,.97)" : "rgba(255,255,255,.97)",
        borderTop: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px)",
        padding: "10px 0 16px",
        gap: 0,
      }}>
        {[
          { icon: "🏠", label: lang === "ar" ? "الرئيسية" : "Home",     href: "/" },
          { icon: "🔍", label: lang === "ar" ? "الورش" : "Workshops",   href: "/workshops" },
          { icon: "🗺️", label: lang === "ar" ? "الخريطة" : "Map",       href: "/map" },
          { icon: "🔧", label: lang === "ar" ? "تشخيص" : "Diagnose",    href: "/diagnose" },
          { icon: "👤", label: lang === "ar" ? "حسابي" : "Account",     href: "/dashboard" },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            textDecoration: "none", padding: "4px 0",
            color: textTertiary,
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Bottom nav spacer on mobile */}
      <div className="warsha-mobile-nav" style={{ display: "none", height: 72 }} />
    </div>
  );
}