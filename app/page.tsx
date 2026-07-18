"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { t, CATEGORIES, FEATURED_SHOPS, type Lang } from "./lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const savedTheme = (localStorage.getItem("warsha-theme") as "dark" | "light") || "light";
    const savedLang = (localStorage.getItem("warsha-lang") as Lang) || "ar";
    setTheme(savedTheme); setLang(savedLang); setMounted(true);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("lang", savedLang);
    document.documentElement.setAttribute("dir", savedLang === "ar" ? "rtl" : "ltr");
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

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,115,10";
}

const PROBLEM_MAP: { keywords: string[]; cat: string }[] = [
  { keywords: ["ac","a/c","air con","not cooling","تكييف","فريون","كمبروسور","حار جوه","مش بيبرد"], cat: "car_ac" },
  { keywords: ["overheat","engine","oil","محرك","زيت","بيسخن","يحرق","won't start","مش بيشتغل"], cat: "mechanical" },
  { keywords: ["tyre","tire","flat","wheel","rim","إطار","عجل","جنط","ثقب"], cat: "tires" },
  { keywords: ["glass","windscreen","crack","زجاج","شرخ","كسر","ونيت"], cat: "glass_repair" },
  { keywords: ["wrap","paint","dent","scratch","دهان","تغليف","خدش","بوية"], cat: "paint_wrap" },
  { keywords: ["ceramic","ppf","tint","سيراميك","تظليل","حماية"], cat: "car_protection" },
  { keywords: ["wash","detail","polish","غسيل","تلميع","تفصيل"], cat: "car_wash" },
  { keywords: ["battery","electric","wiring","كهرباء","بطارية","أسلاك"], cat: "auto_electric" },
  { keywords: ["diagnos","scan","fault","code","check engine","دياجنوستيك","فحص","كود","لمبة"], cat: "diagnostics" },
  { keywords: ["speaker","screen","audio","sound","شاشة","صوت","سبيكر"], cat: "interior" },
  { keywords: ["spoiler","body kit","سبويلر","بودي كيت"], cat: "exterior" },
  { keywords: ["turbo","ecu","exhaust","performance","تيونينج","شكمان"], cat: "performance" },
];
const PROBLEM_WORDS = ["not","won't","doesn't","broken","noise","leak","overheating","grinding","dead","مش","بيسخن","مش شغال","صوت","مشكلة","تسريب"];

function handleSearch(query: string) {
  const q = query.trim();
  if (!q) { window.location.href = "/workshops"; return; }
  const lower = q.toLowerCase();
  const looksLikeProblem = q.split(" ").length > 2 || PROBLEM_WORDS.some(w => lower.includes(w));
  if (looksLikeProblem) { window.location.href = `/diagnose?q=${encodeURIComponent(q)}`; return; }
  const match = PROBLEM_MAP.find(p => p.keywords.some(k => lower.includes(k)));
  window.location.href = match ? `/workshops?cat=${match.cat}&q=${encodeURIComponent(q)}` : `/workshops?q=${encodeURIComponent(q)}`;
}

// Warsha Logo SVG inline — gear + wrench
function WarshaLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="#E8730A" strokeWidth="4" fill="none"/>
      <circle cx="50" cy="50" r="40" stroke="#E8730A" strokeWidth="2" fill="none" strokeDasharray="8 4"/>
      {/* Gear */}
      <path d="M50 28a22 22 0 1 0 0 44 22 22 0 0 0 0-44zm0 8a14 14 0 1 1 0 28 14 14 0 0 1 0-28z" fill="#E8730A"/>
      {/* Gear teeth */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 50 + 23 * Math.sin(rad);
        const y = 50 - 23 * Math.cos(rad);
        return <rect key={i} x={x-3} y={y-5} width="6" height="10" rx="2" fill="#E8730A" transform={`rotate(${deg},${x},${y})`}/>;
      })}
      {/* Wrench */}
      <path d="M44 44l-8 8 2 2 8-8M56 56l8-8-2-2-8 8" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="5" fill="#fff"/>
    </svg>
  );
}

export default function HomePage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
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

  const isDark = theme === "dark";

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 60,
        background: isDark ? "rgba(10,10,9,0.92)" : "rgba(255,255,255,0.92)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
        backdropFilter: "blur(24px) saturate(200%)",
        boxShadow: isDark ? "0 1px 20px rgba(0,0,0,.4)" : "0 1px 20px rgba(0,0,0,.06)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <WarshaLogo size={38} />
          <div style={{ lineHeight: 1.15 }}>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>
              <span style={{ color: "var(--text-primary)" }}>{lang === "ar" ? "وَرشة" : "Warsha"}</span>
              <span style={{ color: "#E8730A" }}>{lang === "ar" ? ".eg" : ".eg"}</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {lang === "ar" ? "دليل الورش" : "Workshop Directory"}
            </div>
          </div>
        </Link>

        {/* Center nav */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {([
            { label: lang === "ar" ? "الرئيسية" : "Home",    href: "/" },
            { label: tr.navShops,                              href: "/workshops" },
            { label: tr.navMap,                                href: "/map" },
            { label: lang === "ar" ? "تشخيص" : "Diagnose",   href: "/diagnose" },
            { label: tr.navAbout,                              href: "/about" },
          ] as const).map(item => (
            <Link key={item.href} href={item.href} style={{
              padding: "6px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500,
              color: "var(--text-secondary)", textDecoration: "none",
              transition: "all .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
            >{item.label}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggleLang} style={{ height: 36, padding: "0 12px", borderRadius: 8, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"}`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "inherit" }}>
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"}`, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link href="/auth/login" style={{ height: 36, padding: "0 14px", borderRadius: 8, background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.12)"}`, display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
          <Link href="/list-shop" style={{
            height: 36, padding: "0 18px", borderRadius: 8,
            background: "#E8730A", color: "#fff",
            display: "flex", alignItems: "center",
            fontSize: 13, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 2px 12px rgba(232,115,10,.35)",
            transition: "all .15s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
          >
            {tr.navRegisterCta}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden" }}>

        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url('/Warsha_Theme.png')",
          backgroundSize: "cover", backgroundPosition: "center 25%",
          filter: isDark ? "brightness(0.35)" : "brightness(0.92) saturate(0.8)",
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: isDark
            ? "linear-gradient(to bottom, rgba(5,5,4,0.3) 0%, rgba(5,5,4,0.1) 50%, rgba(5,5,4,0.7) 100%)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.7) 100%)",
        }} />

        {/* Orange glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 700, height: 400, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(232,115,10,0.15) 0%, transparent 65%)",
          filter: "blur(60px)", zIndex: 1, pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, padding: "0 24px", width: "100%" }}>

          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px",
            borderRadius: 99, marginBottom: 28,
            background: isDark ? "rgba(232,115,10,.15)" : "rgba(232,115,10,.1)",
            border: "1px solid rgba(232,115,10,.35)", color: "#E8730A",
            fontSize: 13, fontWeight: 600,
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8730A", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            {tr.eyebrow}
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            fontWeight: 900, lineHeight: 1.12, letterSpacing: "-0.03em",
            color: isDark ? "#fff" : "#1a1a18",
            marginBottom: 18,
            textShadow: isDark ? "0 2px 20px rgba(0,0,0,.5)" : "0 2px 20px rgba(255,255,255,.8)",
          }}>
            {tr.h1Line1}<br />
            <span style={{ color: "#E8730A" }}>{tr.h1Line2}</span>
          </h1>

          <p style={{
            fontSize: 16, lineHeight: 1.75,
            color: isDark ? "rgba(255,255,255,.75)" : "rgba(30,30,25,.7)",
            maxWidth: 520, margin: "0 auto 40px",
            textShadow: isDark ? "0 1px 8px rgba(0,0,0,.4)" : "none",
          }}>
            {tr.heroBod}
          </p>

          {/* Search bar */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
              background: isDark ? "rgba(20,20,18,0.85)" : "rgba(255,255,255,0.92)",
              borderRadius: 16,
              border: focused ? "2px solid #E8730A" : `2px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.1)"}`,
              boxShadow: focused
                ? "0 0 0 4px rgba(232,115,10,.15), 0 8px 32px rgba(0,0,0,.2)"
                : "0 8px 32px rgba(0,0,0,.15)",
              backdropFilter: "blur(20px)",
              transition: "border-color .25s, box-shadow .25s",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={focused ? "#E8730A" : "rgba(150,150,140,.6)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => { setFocused(true); setShowSugg(true); }}
                onBlur={() => setFocused(false)}
                onKeyDown={e => { if (e.key === "Enter") { setShowSugg(false); handleSearch(query); } }}
                placeholder={tr.searchPlaceholder}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: isDark ? "#fff" : "#1a1a18",
                  fontSize: 15, fontFamily: "inherit",
                  textAlign: dir === "rtl" ? "right" : "left", direction: dir,
                }}
              />
              <button
                style={{
                  flexShrink: 0, padding: "10px 24px", borderRadius: 10,
                  background: "#E8730A", color: "#fff", border: "none",
                  cursor: "pointer", fontSize: 14, fontWeight: 700,
                  fontFamily: "inherit",
                  boxShadow: "0 2px 10px rgba(232,115,10,.4)",
                  transition: "all .15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#C85E00"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#E8730A"}
                onClick={() => { setShowSugg(false); handleSearch(query); }}
              >
                {tr.searchBtn}
              </button>
            </div>

            {/* Suggestions */}
            {showSugg && filteredSugg.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
                background: isDark ? "rgba(20,20,18,.95)" : "rgba(255,255,255,.97)",
                border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 16px 48px rgba(0,0,0,.2)",
                backdropFilter: "blur(20px)",
              }}>
                {filteredSugg.map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); setShowSugg(false); handleSearch(s); }}
                    style={{
                      width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir,
                      padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
                      background: "transparent", border: "none",
                      borderBottom: i < filteredSugg.length - 1 ? `1px solid ${isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"}` : "none",
                      color: isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(232,115,10,.08)" : "rgba(232,115,10,.06)"; (e.currentTarget as HTMLButtonElement).style.color = "#E8730A"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = isDark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.65)"; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 48 }}>
            {[
              { val: tr.stat1Val, lbl: tr.stat1Lbl },
              { val: tr.stat2Val, lbl: tr.stat2Lbl },
              { val: tr.stat3Val, lbl: tr.stat3Lbl },
            ].map(s => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em",
                  color: isDark ? "#fff" : "#1a1a18",
                  textShadow: isDark ? "0 2px 12px rgba(0,0,0,.5)" : "0 2px 8px rgba(255,255,255,.8)",
                }}>{s.val}</div>
                <div style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)", marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "60px 32px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
              {lang === "ar" ? "التخصصات" : "SPECIALISATIONS"}
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>{tr.catHeading}</h2>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(195px, 1fr))" }}>
            {CATEGORIES.map(cat => {
              const rgb = hexRgb(cat.accent);
              return (
                <Link key={cat.id} href={`/category/${cat.id}`} style={{
                  padding: "20px 18px 16px", borderRadius: 16,
                  textAlign: dir === "rtl" ? "right" : "left", direction: dir,
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  transition: "all .2s", textDecoration: "none",
                  display: "flex", flexDirection: "column", gap: 10, minHeight: 150,
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `rgba(${rgb},.07)`;
                    el.style.borderColor = `rgba(${rgb},.35)`;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = `0 12px 32px rgba(${rgb},.14)`;
                    const arrow = el.querySelector(".cat-arrow") as HTMLElement | null;
                    if (arrow) arrow.style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = "var(--bg-card)";
                    el.style.borderColor = "var(--border)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    const arrow = el.querySelector(".cat-arrow") as HTMLElement | null;
                    if (arrow) arrow.style.opacity = "0";
                  }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `rgba(${rgb},.12)`, border: `1px solid rgba(${rgb},.28)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>{lang === "ar" ? cat.ar : cat.en}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.6 }}>{cat.description[lang]}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.accent }}>{cat.count[lang]} {tr.shopUnit}</span>
                    <span className="cat-arrow" style={{ fontSize: 14, color: cat.accent, opacity: 0, transition: "opacity .2s" }}>{dir === "rtl" ? "←" : "→"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: "0 32px 64px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", paddingTop: 56 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>{lang === "ar" ? "مختارة بعناية" : "HAND PICKED"}</p>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>{tr.featuredHeading}</h2>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E8730A")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >{tr.viewAll} {dir === "rtl" ? "←" : "→"}</Link>
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {FEATURED_SHOPS.map(shop => (
              <div key={shop.id} className="warsha-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, direction: dir }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>📍 {shop.area[lang]}</div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(232,115,10,.1)", border: "1px solid rgba(232,115,10,.2)", flexShrink: 0 }}>
                    <WarshaLogo size={26} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, direction: dir }}>
                  {"★★★★★".slice(0, Math.round(shop.rating)).split("").map((s, i) => (
                    <span key={i} style={{ color: "#F59E0B", fontSize: 14 }}>★</span>
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                  {shop.reviews > 0 && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18, direction: dir }}>
                  {shop.tags[lang].map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/chat?shop=${shop.id}`} className="warsha-btn-primary"
                    style={{ flex: 1, padding: "10px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                    💬 {lang === "ar" ? "تواصل" : "Message"}
                  </Link>
                  <Link href={`/shop/${shop.id}`} className="warsha-btn-ghost"
                    style={{ flex: 1, padding: "10px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                    {tr.btnView}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "64px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#E8730A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{lang === "ar" ? "كيف يعمل؟" : "HOW IT WORKS"}</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.02em" }}>{tr.howHeading}</h2>
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
      <section style={{ padding: "72px 32px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <WarshaLogo size={56} />
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)", marginBottom: 14, letterSpacing: "-0.02em" }}>{tr.footerCtaH}</h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 36 }}>{tr.footerCtaBody}</p>
          <Link href="/list-shop" style={{
            display: "inline-block", padding: "16px 40px",
            background: "#E8730A", color: "#fff",
            borderRadius: 14, fontSize: 15, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(232,115,10,.35)",
            transition: "all .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >{tr.footerCtaBtn}</Link>
        </div>
      </section>

      <footer style={{ padding: "22px 32px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{tr.footerCopy}</span>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/about" style={{ color: "var(--text-tertiary)", textDecoration: "none", fontSize: 12 }}>{tr.navAbout}</Link>
          <Link href="/list-shop" style={{ color: "var(--text-tertiary)", textDecoration: "none", fontSize: 12 }}>{tr.navRegisterCta}</Link>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.15)} }
      `}</style>
    </div>
  );
}
