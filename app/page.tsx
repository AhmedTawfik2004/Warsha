"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { t, CATEGORIES, FEATURED_SHOPS, type Lang } from "./lib/translations";

// Circular logo — real PNG like Careem/Talabat
function WarshaLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0,
      border: "2px solid rgba(232,115,10,0.5)",
      background: "#2b2b28",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img src="/Warsha_Logo.png" alt="Warsha" width={size} height={size} style={{ objectFit: "cover", display: "block" }} />
    </div>
  );
}

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = (localStorage.getItem("warsha-theme") as "dark" | "light") || "light";
    const l = (localStorage.getItem("warsha-lang") as Lang) || "ar";
    setTheme(t); setLang(l); setMounted(true);
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("lang", l);
    document.documentElement.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
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
  const [showSugg, setShowSugg] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSugg(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filteredSugg = tr.suggestions.filter(s => query.length > 0 ? s.toLowerCase().includes(query.toLowerCase()) : true);
  if (!mounted) return null;

  const border = `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
        background: isDark ? "rgba(10,10,9,0.96)" : "rgba(255,255,255,0.96)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
        backdropFilter: "blur(24px) saturate(200%)",
        boxShadow: isDark ? "0 1px 24px rgba(0,0,0,.5)" : "0 1px 12px rgba(0,0,0,.07)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <WarshaLogo size={36} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>
              <span style={{ color: isDark ? "#fff" : "#1a1a18" }}>{lang === "ar" ? "وَرشة" : "Warsha"}</span>
              <span style={{ color: "#E8730A" }}>.eg</span>
            </div>
            <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {lang === "ar" ? "دليل الورش" : "Workshop Directory"}
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 4 }}>
          {([
            { label: lang === "ar" ? "الرئيسية" : "Home", href: "/" },
            { label: tr.navShops, href: "/workshops" },
            { label: tr.navMap, href: "/map" },
            { label: lang === "ar" ? "تشخيص" : "Diagnose", href: "/diagnose" },
            { label: tr.navAbout, href: "/about" },
          ] as const).map(item => (
            <Link key={item.href} href={item.href} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, color: isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "#fff" : "#1a1a18"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)"; }}
            >{item.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggleLang} style={{ height: 34, padding: "0 12px", borderRadius: 8, background: "transparent", border, cursor: "pointer", fontSize: 12, fontWeight: 600, color: isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)", fontFamily: "inherit" }}>
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button onClick={toggleTheme} style={{ width: 34, height: 34, borderRadius: 8, background: "transparent", border, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link href="/auth/login" style={{ height: 34, padding: "0 14px", borderRadius: 8, background: "transparent", border, fontSize: 13, fontWeight: 600, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)", textDecoration: "none", display: "flex", alignItems: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)"; }}
          >{lang === "ar" ? "تسجيل الدخول" : "Sign in"}</Link>
          <Link href="/list-shop" style={{ height: 34, padding: "0 16px", borderRadius: 8, background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
          >{tr.navRegisterCta}</Link>
        </div>
      </nav>

      {/* ── HERO — background more faded in dark mode ── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" }}>

        {/* bg image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/Warsha_Theme.png')", backgroundSize: "cover", backgroundPosition: "center 20%" }} />

        {/* overlay — dark mode is now 82% black so image is barely there but text pops */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: isDark
            ? "rgba(6,5,4,0.82)"           // dark: very dark, image barely visible
            : "rgba(252,250,247,0.80)",     // light: cream 80%, image subtly visible
        }} />

        {/* content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 680, padding: "0 24px", width: "100%" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, marginBottom: 28, background: "rgba(232,115,10,.12)", border: "1px solid rgba(232,115,10,.35)", color: "#E8730A", fontSize: 13, fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8730A", display: "inline-block" }} />
            {tr.eyebrow}
          </div>

          <h1 style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.03em", color: isDark ? "#ffffff" : "#1a1a18", marginBottom: 18 }}>
            {tr.h1Line1}<br />
            <span style={{ color: "#E8730A" }}>{tr.h1Line2}</span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.75, color: isDark ? "rgba(255,255,255,.8)" : "rgba(25,25,20,.72)", maxWidth: 500, margin: "0 auto 40px" }}>
            {tr.heroBod}
          </p>

          {/* Search */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "13px 16px",
              background: isDark ? "rgba(15,15,13,0.94)" : "rgba(255,255,255,0.98)",
              borderRadius: 16,
              border: focused ? "2px solid #E8730A" : `2px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.08)"}`,
              boxShadow: focused ? "0 0 0 4px rgba(232,115,10,.15), 0 8px 32px rgba(0,0,0,.15)" : "0 8px 32px rgba(0,0,0,.12)",
              transition: "all .25s",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused ? "#E8730A" : "rgba(150,150,140,.5)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => { setFocused(true); setShowSugg(true); }}
                onBlur={() => setFocused(false)}
                onKeyDown={e => { if (e.key === "Enter") { setShowSugg(false); handleSearch(query); } }}
                placeholder={tr.searchPlaceholder}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: isDark ? "#fff" : "#1a1a18", fontSize: 14, fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left", direction: dir }}
              />
              <button style={{ flexShrink: 0, padding: "9px 22px", borderRadius: 10, background: "#E8730A", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#C85E00"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#E8730A"}
                onClick={() => { setShowSugg(false); handleSearch(query); }}>
                {tr.searchBtn}
              </button>
            </div>
            {showSugg && filteredSugg.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, background: isDark ? "rgba(18,18,16,.97)" : "rgba(255,255,255,.98)", border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`, borderRadius: 14, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,.15)", backdropFilter: "blur(20px)" }}>
                {filteredSugg.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); setShowSugg(false); handleSearch(s); }}
                    style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", borderBottom: i < filteredSugg.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"}` : "none", color: isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,115,10,.07)"; (e.currentTarget as HTMLButtonElement).style.color = "#E8730A"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 52, marginTop: 48 }}>
            {[{ val: tr.stat1Val, lbl: tr.stat1Lbl }, { val: tr.stat2Val, lbl: tr.stat2Lbl }, { val: tr.stat3Val, lbl: tr.stat3Lbl }].map(s => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", color: isDark ? "#fff" : "#1a1a18" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.45)", marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "60px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{lang === "ar" ? "التخصصات" : "SPECIALISATIONS"}</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 28px" }}>{tr.catHeading}</h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))" }}>
            {CATEGORIES.map(cat => {
              const rgb = hexRgb(cat.accent);
              return (
                <Link key={cat.id} href={`/category/${cat.id}`} style={{ padding: "20px 18px 16px", borderRadius: 16, textAlign: dir === "rtl" ? "right" : "left", direction: dir, background: "var(--bg-card)", border: "1px solid var(--border)", transition: "all .2s", textDecoration: "none", display: "flex", flexDirection: "column", gap: 10, minHeight: 150 }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `rgba(${rgb},.07)`; el.style.borderColor = `rgba(${rgb},.35)`; el.style.transform = "translateY(-4px)"; el.style.boxShadow = `0 12px 32px rgba(${rgb},.14)`; const a = el.querySelector(".ca") as HTMLElement|null; if (a) a.style.opacity = "1"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--bg-card)"; el.style.borderColor = "var(--border)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; const a = el.querySelector(".ca") as HTMLElement|null; if (a) a.style.opacity = "0"; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `rgba(${rgb},.12)`, border: `1px solid rgba(${rgb},.28)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>{lang === "ar" ? cat.ar : cat.en}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.6 }}>{cat.description[lang]}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.accent }}>{cat.count[lang]} {tr.shopUnit}</span>
                    <span className="ca" style={{ fontSize: 14, color: cat.accent, opacity: 0, transition: "opacity .2s" }}>{dir === "rtl" ? "←" : "→"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: "0 28px 64px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", paddingTop: 56 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{lang === "ar" ? "مختارة بعناية" : "HAND PICKED"}</p>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>{tr.featuredHeading}</h2>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#E8730A")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}>{tr.viewAll} {dir === "rtl" ? "←" : "→"}</Link>
          </div>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {FEATURED_SHOPS.map(shop => (
              <div key={shop.id} className="warsha-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, direction: dir }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>📍 {shop.area[lang]}</div>
                  </div>
                  <WarshaLogo size={34} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, direction: dir }}>
                  {Array.from({ length: Math.round(shop.rating) }).map((_, i) => <span key={i} style={{ color: "#F59E0B", fontSize: 13 }}>★</span>)}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                  {shop.reviews > 0 && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16, direction: dir }}>
                  {shop.tags[lang].map(tag => <span key={tag} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{tag}</span>)}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/chat?shop=${shop.id}`} className="warsha-btn-primary" style={{ flex: 1, padding: "10px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                    💬 {lang === "ar" ? "تواصل" : "Message"}
                  </Link>
                  <Link href={`/shop/${shop.id}`} className="warsha-btn-ghost" style={{ flex: 1, padding: "10px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                    {tr.btnView}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "64px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{lang === "ar" ? "كيف يعمل؟" : "HOW IT WORKS"}</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 10 }}>{tr.howHeading}</h2>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)", marginBottom: 48 }}>{tr.howSubhead}</p>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {tr.steps.map((item, i) => (
              <div key={item.step} style={{ padding: "30px 24px", borderRadius: 18, background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 18, [dir === "rtl" ? "right" : "left"]: 18, width: 26, height: 26, borderRadius: "50%", background: "rgba(232,115,10,.12)", border: "1px solid rgba(232,115,10,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#E8730A" }}>{i+1}</div>
                <div style={{ fontSize: 32, marginBottom: 18 }}>{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ padding: "72px 28px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><WarshaLogo size={56} /></div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)", marginBottom: 14 }}>{tr.footerCtaH}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 36 }}>{tr.footerCtaBody}</p>
          <Link href="/list-shop" style={{ display: "inline-block", padding: "16px 40px", background: "#E8730A", color: "#fff", borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(232,115,10,.35)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >{tr.footerCtaBtn}</Link>
        </div>
      </section>

      <footer style={{ padding: "22px 28px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{tr.footerCopy}</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/about" style={{ color: "var(--text-tertiary)", textDecoration: "none", fontSize: 12 }}>{tr.navAbout}</Link>
          <Link href="/list-shop" style={{ color: "var(--text-tertiary)", textDecoration: "none", fontSize: 12 }}>{tr.navRegisterCta}</Link>
        </div>
      </footer>
    </div>
  );
}
