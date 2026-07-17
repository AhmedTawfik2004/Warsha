"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { t, CATEGORIES, FEATURED_SHOPS, type Lang } from "./lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang]   = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";
    const savedLang  = (localStorage.getItem("warsha-lang")  as Lang) || "ar";
    setTheme(savedTheme);
    setLang(savedLang);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("warsha-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }, [theme]);

  const toggleLang = useCallback(() => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("warsha-lang", next);
    document.documentElement.setAttribute("lang", next);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
  }, [lang]);

  return { theme, lang, toggleTheme, toggleLang, mounted };
}

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,115,10";
}

function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-secondary)" }}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="Toggle language"
      style={{ height: 36, padding: "0 12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "inherit" }}>
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}

const PROBLEM_MAP: { keywords: string[]; cat: string }[] = [
  { keywords: ["ac", "a/c", "air con", "not cooling", "تكييف", "فريون", "كمبروسور", "حار جوه", "مش بيبرد"], cat: "car_ac" },
  { keywords: ["overheat", "engine", "oil", "محرك", "زيت", "بيسخن", "يحرق", "won't start", "مش بيشتغل الصبح"], cat: "mechanical" },
  { keywords: ["tyre", "tire", "flat", "wheel", "rim", "إطار", "عجل", "جنط", "ثقب"], cat: "tires" },
  { keywords: ["glass", "windscreen", "crack", "زجاج", "شرخ", "كسر", "ونيت"], cat: "glass_repair" },
  { keywords: ["wrap", "paint", "dent", "scratch", "دهان", "تغليف", "خدش", "بوية"], cat: "paint_wrap" },
  { keywords: ["ceramic", "ppf", "tint", "سيراميك", "تظليل", "حماية"], cat: "car_protection" },
  { keywords: ["wash", "detail", "polish", "غسيل", "تلميع", "تفصيل"], cat: "car_wash" },
  { keywords: ["battery", "electric", "wiring", "كهرباء", "بطارية", "أسلاك", "ضوء مش شغال"], cat: "auto_electric" },
  { keywords: ["diagnos", "scan", "fault", "code", "check engine", "دياجنوستيك", "فحص", "كود", "لمبة"], cat: "diagnostics" },
  { keywords: ["speaker", "screen", "audio", "sound", "شاشة", "صوت", "سبيكر"], cat: "interior" },
  { keywords: ["spoiler", "body kit", "سبويلر", "بودي كيت"], cat: "exterior" },
  { keywords: ["turbo", "ecu", "exhaust", "performance", "تيونينج", "شكمان"], cat: "performance" },
];

const PROBLEM_WORDS = ["not", "won't", "doesn't", "broken", "noise", "leak", "overheating", "grinding", "squeaking", "dead", "مش", "بيسخن", "مش شغال", "صوت", "مشكلة", "تسريب", "ميت", "واقف"];

function handleSearch(query: string) {
  const q = query.trim();
  if (!q) { window.location.href = "/workshops"; return; }
  const lower = q.toLowerCase();
  const looksLikeProblem = q.split(" ").length > 2 || PROBLEM_WORDS.some(w => lower.includes(w));
  if (looksLikeProblem) { window.location.href = `/diagnose?q=${encodeURIComponent(q)}`; return; }
  const match = PROBLEM_MAP.find(p => p.keywords.some(k => lower.includes(k)));
  if (match) { window.location.href = `/workshops?cat=${match.cat}&q=${encodeURIComponent(q)}`; }
  else { window.location.href = `/workshops?q=${encodeURIComponent(q)}`; }
}

export default function HomePage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [query, setQuery]              = useState("");
  const [showSuggestions, setShowSugg] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSugg(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSugg = tr.suggestions.filter(s =>
    query.length > 0 ? s.toLowerCase().includes(query.toLowerCase()) : true
  );

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "var(--nav-h)",
        background: "var(--bg-overlay)", borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 16, boxShadow: "var(--shadow-accent)",
          }}>W</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontWeight: 900, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {lang === "ar" ? "وَرشة" : "Warsha"}
              <span style={{ color: "var(--accent)" }}>{lang === "ar" ? " فايندر" : "Finder"}</span>
            </span>
            <span style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {lang === "ar" ? "دليل الورش" : "Workshop Directory"}
            </span>
          </div>
        </Link>

        {/* Centre links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {([
            { label: tr.navShops,    href: "/workshops" },
            { label: tr.navServices, href: "/services"  },
            { label: tr.navMap,      href: "/map"       },
            { label: lang === "ar" ? "تشخيص" : "Diagnose", href: "/diagnose" },
            { label: tr.navAbout,    href: "/about"     },
          ] as const).map(item => (
            <Link key={item.href} href={item.href} style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >{item.label}</Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangToggle lang={lang} onToggle={toggleLang} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Link href="/list-shop" className="warsha-btn-primary"
            style={{ padding: "8px 16px", fontSize: 13, fontFamily: "inherit", textDecoration: "none" }}>
            {tr.navRegisterCta}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", padding: "80px 24px 68px", textAlign: "center", overflow: "hidden" }}>

        {/* Automotive background pattern — gear/wrench SVG tiled */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: theme === "dark" ? 0.04 : 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23E8730A'%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3Ccircle cx='40' cy='40' r='14' fill='none' stroke='%23E8730A' stroke-width='2'/%3E%3Crect x='37' y='10' width='6' height='14' rx='2'/%3E%3Crect x='37' y='56' width='6' height='14' rx='2'/%3E%3Crect x='10' y='37' width='14' height='6' rx='2'/%3E%3Crect x='56' y='37' width='14' height='6' rx='2'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }} aria-hidden="true" />

        {/* Gradient overlay on top of pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: theme === "dark"
            ? "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(240,120,35,0.08) 0%, transparent 65%), linear-gradient(to bottom, transparent 60%, var(--bg) 100%)"
            : "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(240,120,35,0.05) 0%, transparent 65%), linear-gradient(to bottom, transparent 60%, var(--bg) 100%)",
        }} aria-hidden="true" />

        {/* Horizontal accent line at top */}
        <div style={{
          position: "absolute", top: 0, left: "10%", right: "10%", height: "2px",
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.5, pointerEvents: "none", zIndex: 2,
        }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 680, margin: "0 auto" }}>

          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 99, marginBottom: 24,
            background: "var(--accent-muted)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: 13, fontWeight: 600,
          }}>
            <span className="eyebrow-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} aria-hidden="true" />
            {tr.eyebrow}
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2.1rem, 5.5vw, 3.4rem)",
            fontWeight: 900, color: "var(--text-primary)",
            lineHeight: 1.18, letterSpacing: "-0.025em", marginBottom: 18,
          }}>
            {tr.h1Line1}
            <br />
            <span style={{ color: "var(--accent)" }}>{tr.h1Line2}</span>
          </h1>

          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 40px" }}>
            {tr.heroBod}
          </p>

          {/* Search */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "13px 16px",
              background: "var(--bg-card)", borderRadius: "var(--radius-xl)",
              border: searchFocused ? "1.5px solid var(--accent)" : "1.5px solid var(--border-strong)",
              boxShadow: searchFocused ? "0 0 0 4px var(--accent-muted), var(--shadow-lg)" : "var(--shadow-md)",
              transition: "border-color .25s, box-shadow .25s",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={searchFocused ? "var(--accent)" : "var(--text-tertiary)"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }} aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>

              <input
                type="text" value={query}
                onChange={e => { setQuery(e.target.value); setShowSugg(true); }}
                onFocus={() => { setSearchFocused(true); setShowSugg(true); }}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={e => { if (e.key === "Enter") { setShowSugg(false); handleSearch(query); } }}
                placeholder={tr.searchPlaceholder}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", textAlign: dir === "rtl" ? "right" : "left", direction: dir, color: "var(--text-primary)", fontSize: 14, fontFamily: "inherit", caretColor: "var(--accent)" }}
              />

              <button className="warsha-btn-primary"
                style={{ flexShrink: 0, padding: "9px 22px", fontSize: 13, fontFamily: "inherit" }}
                onClick={() => { setShowSugg(false); handleSearch(query); }}>
                {tr.searchBtn}
              </button>
            </div>

            {/* Suggestions */}
            {showSuggestions && filteredSugg.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50,
                background: "var(--bg-card)", border: "1px solid var(--border-strong)",
                borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-lg)",
              }}>
                {filteredSugg.map((s, i) => (
                  <button key={i}
                    onClick={() => { setQuery(s); setShowSugg(false); handleSearch(s); }}
                    style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir, padding: "11px 18px", display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", borderBottom: i < filteredSugg.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }} aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 52, marginTop: 40 }}>
            {[
              { val: tr.stat1Val, lbl: tr.stat1Lbl },
              { val: tr.stat2Val, lbl: tr.stat2Lbl },
              { val: tr.stat3Val, lbl: tr.stat3Lbl },
            ].map(s => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)", letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "0 24px 56px" }} aria-label={tr.catHeading}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                {lang === "ar" ? "التخصصات" : "SPECIALISATIONS"}
              </p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{tr.catHeading}</h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {CATEGORIES.map(cat => {
              const rgb = hexRgb(cat.accent);
              return (
                <Link key={cat.id} href={`/category/${cat.id}`} style={{
                  padding: "18px 18px 14px", borderRadius: "var(--radius-lg)",
                  textAlign: dir === "rtl" ? "right" : "left", direction: dir,
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  transition: "all .2s", position: "relative", textDecoration: "none",
                  display: "flex", flexDirection: "column", gap: 10, minHeight: 148,
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.background = `rgba(${rgb},.06)`;
                    el.style.borderColor = `rgba(${rgb},.3)`;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = `0 8px 24px rgba(${rgb},.12)`;
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
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `rgba(${rgb},.12)`, border: `1px solid rgba(${rgb},.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }} aria-hidden="true">
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{lang === "ar" ? cat.ar : cat.en}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.65 }}>{cat.description[lang]}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cat.accent }}>{cat.count[lang]} {tr.shopUnit}</span>
                    <span className="cat-arrow" style={{ fontSize: 13, color: cat.accent, opacity: 0, transition: "opacity .2s" }} aria-hidden="true">
                      {dir === "rtl" ? "←" : "→"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED SHOPS */}
      <section style={{ padding: "0 24px 60px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", paddingTop: 48 }} aria-label={tr.featuredHeading}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                {lang === "ar" ? "مختارة بعناية" : "HAND PICKED"}
              </p>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{tr.featuredHeading}</h2>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{tr.featuredSubhead}</p>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >{tr.viewAll} {dir === "rtl" ? "←" : "→"}</Link>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {FEATURED_SHOPS.map(shop => (
              <div key={shop.id} className="warsha-card" style={{ padding: 20, position: "relative", cursor: "pointer" }}>
                {shop.badge && (
                  <div style={{ position: "absolute", top: 14, [dir === "rtl" ? "left" : "right"]: 14, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                    {tr.topRated}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, direction: dir }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>{shop.area[lang]}</div>
                  </div>
                  <div style={{ width: 38, height: 38, borderRadius: 10, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-muted)", border: "1px solid var(--accent-border)", flexShrink: 0 }} aria-hidden="true">🔧</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, direction: dir }}>
                  <span style={{ color: "#F59E0B" }}>★★★★★</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16, direction: dir }}>
                  {shop.tags[lang].map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href={`/shop/${shop.id}`} className="warsha-btn-primary"
                    style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                    {tr.btnView}
                  </Link>
                  <button className="warsha-btn-ghost"
                    style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit" }}
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.id}`, "_blank")}>
                    {tr.getDirections}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid var(--border)" }} aria-label={tr.howHeading}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            {lang === "ar" ? "كيف يعمل؟" : "HOW IT WORKS"}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", marginBottom: 8 }}>{tr.howHeading}</h2>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 44 }}>{tr.howSubhead}</p>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {tr.steps.map((item, i) => (
              <div key={item.step} style={{ padding: "28px 22px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 16, [dir === "rtl" ? "right" : "left"]: 16, width: 24, height: 24, borderRadius: "50%", background: "var(--accent-muted)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--accent)" }}>{i+1}</div>
                <div style={{ fontSize: 30, marginBottom: 16 }} aria-hidden="true">{item.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: "64px 24px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔧</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>{tr.footerCtaH}</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 32 }}>{tr.footerCtaBody}</p>
          <Link href="/list-shop" className="warsha-btn-primary"
            style={{ padding: "14px 36px", fontSize: 15, borderRadius: "var(--radius-lg)", fontFamily: "inherit", textDecoration: "none", display: "inline-block" }}>
            {tr.footerCtaBtn}
          </Link>
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}
