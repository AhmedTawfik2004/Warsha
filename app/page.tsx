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

  if (looksLikeProblem) {
    window.location.href = `/diagnose?q=${encodeURIComponent(q)}`;
    return;
  }

  const match = PROBLEM_MAP.find(p => p.keywords.some(k => lower.includes(k)));
  if (match) {
    window.location.href = `/workshops?cat=${match.cat}&q=${encodeURIComponent(q)}`;
  } else {
    window.location.href = `/workshops?q=${encodeURIComponent(q)}`;
  }
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
        background: "var(--bg)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>W</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{tr.appName}</span>
        </Link>

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
            >
              {item.label}
            </Link>
          ))}
        </div>

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
      <section style={{ position: "relative", padding: "72px 24px 60px", textAlign: "center", overflow: "hidden" }}>
        {theme === "dark" && (
          <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 640, height: 360, borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(232,115,10,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} aria-hidden="true" />
        )}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: "56px 56px", opacity: theme === "dark" ? 0.7 : 0.4 }} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, marginBottom: 22, background: "var(--accent-muted)", border: "1px solid var(--accent-border)", color: "var(--accent)", fontSize: 13 }}>
            <span className="eyebrow-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} aria-hidden="true" />
            {tr.eyebrow}
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5.5vw, 3.2rem)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.22, letterSpacing: "-0.02em", marginBottom: 16 }}>
            {tr.h1Line1}<br />
            <span style={{ color: "var(--accent)" }}>{tr.h1Line2}</span>
          </h1>

          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, maxWidth: 520, margin: "0 auto 36px" }}>
            {tr.heroBod}
          </p>

          {/* Search Bar */}
          <div ref={searchRef} style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
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
                aria-label={tr.searchPlaceholder}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", textAlign: dir === "rtl" ? "right" : "left", direction: dir, color: "var(--text-primary)", fontSize: 14, fontFamily: "inherit", caretColor: "var(--accent)" }}
              />

              <button className="warsha-btn-primary"
                style={{ flexShrink: 0, padding: "8px 20px", fontSize: 13, fontFamily: "inherit" }}
                onClick={() => { setShowSugg(false); handleSearch(query); }}
                aria-label={tr.searchBtn}>
                {tr.searchBtn}
              </button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSugg.length > 0 && (
              <div role="listbox" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
                {filteredSugg.map((s, i) => (
                  <button key={i} role="option" aria-selected={false}
                    onClick={() => { setQuery(s); setShowSugg(false); handleSearch(s); }}
                    style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir, padding: "11px 18px", display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", borderBottom: i < filteredSugg.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text-secondary)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-muted)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, flexShrink: 0 }} aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 36 }}>
            {[{ val: tr.stat1Val, lbl: tr.stat1Lbl }, { val: tr.stat2Val, lbl: tr.stat2Lbl }, { val: tr.stat3Val, lbl: tr.stat3Lbl }].map(s => (
              <div key={s.lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "0 24px 52px" }} aria-label={tr.catHeading}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{tr.catHeading}</h2>
          </div>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }} role="list">
            {CATEGORIES.map(cat => {
              const rgb = hexRgb(cat.accent);
              return (
                <Link key={cat.id} href={`/category/${cat.id}`} role="listitem" style={{ padding: 18, borderRadius: "var(--radius-lg)", textAlign: dir === "rtl" ? "right" : "left", cursor: "pointer", fontFamily: "inherit", direction: dir, background: "var(--bg-card)", border: "1px solid var(--border)", transition: "all .2s", position: "relative", textDecoration: "none", display: "flex", flexDirection: "column", gap: 12, minHeight: 148 }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `rgba(${rgb},.06)`; el.style.borderColor = `rgba(${rgb},.28)`; el.style.transform = "translateY(-2px)"; const arrow = el.querySelector(".cat-arrow") as HTMLElement | null; if (arrow) arrow.style.opacity = "1"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "var(--bg-card)"; el.style.borderColor = "var(--border)"; el.style.transform = "translateY(0)"; const arrow = el.querySelector(".cat-arrow") as HTMLElement | null; if (arrow) arrow.style.opacity = "0"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: `rgba(${rgb},.12)`, border: `1px solid rgba(${rgb},.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }} aria-hidden="true">
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{lang === "ar" ? cat.ar : cat.en}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.6 }}>{cat.description[lang]}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <span className="cat-arrow" style={{ fontSize: 14, color: cat.accent, opacity: 0, transition: "opacity .2s" }} aria-hidden="true">
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
      <section style={{ padding: "0 24px 56px" }} aria-label={tr.featuredHeading}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{tr.featuredHeading}</h2>
              <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>{tr.featuredSubhead}</p>
            </div>
            <Link href="/workshops" style={{ fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              {tr.viewAll} {dir === "rtl" ? "←" : "→"}
            </Link>
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
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, direction: dir }}>
                  <span style={{ color: "var(--accent)" }}>★</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, direction: dir }}>
                  {shop.tags[lang].map(tag => (
                    <span key={tag} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{tag}</span>
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
      <section style={{ padding: "56px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} aria-label={tr.howHeading}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", marginBottom: 6 }}>{tr.howHeading}</h2>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 40 }}>{tr.howSubhead}</p>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {tr.steps.map(item => (
              <div key={item.step} style={{ padding: "24px 20px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 14 }} aria-hidden="true">{item.icon}</div>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, marginBottom: 10, background: "var(--accent-muted)", color: "var(--accent)" }}>{item.step}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ padding: "60px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", marginBottom: 12 }}>{tr.footerCtaH}</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 32 }}>{tr.footerCtaBody}</p>
          <Link href="/list-shop" className="warsha-btn-primary"
            style={{ padding: "14px 32px", fontSize: 15, borderRadius: "var(--radius-lg)", fontFamily: "inherit", textDecoration: "none", display: "inline-block" }}>
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