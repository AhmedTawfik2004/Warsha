"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const th = (localStorage.getItem("warsha-theme") as "dark" | "light") || "light";
    const ln = (localStorage.getItem("warsha-lang") as Lang) || "ar";
    setTheme(th); setLang(ln); setMounted(true);
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

function WorkshopsInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  const bg = isDark ? "#0f0f0e" : "#ffffff";
  const bgSecondary = isDark ? "#161614" : "#f7f7f5";
  const textPrimary = isDark ? "#ffffff" : "#111110";
  const textSecondary = isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)";
  const textTertiary = isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)";
  const borderColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const cardBg = isDark ? "#1a1a18" : "#ffffff";

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("cat");
    if (q) setSearch(q);
    if (cat) setActiveCat(cat);
  }, [searchParams]);

  const filtered = useMemo(() => SHOPS.filter(s => {
    const matchCat = activeCat === "all" || s.category === activeCat;
    const q = search.toLowerCase();
    const matchSearch = !q
      || s.name.toLowerCase().includes(q)
      || s.area[lang].toLowerCase().includes(q)
      || s.tags[lang].some(tag => tag.toLowerCase().includes(q));
    return matchCat && matchSearch;
  }), [search, activeCat, lang]);

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "32px 20px 24px", background: bgSecondary, borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: textTertiary, textDecoration: "none", marginBottom: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E8730A")}
            onMouseLeave={e => (e.currentTarget.style.color = textTertiary)}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: textPrimary, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{tr.workshopsTitle}</h1>
          <p style={{ fontSize: 14, color: textSecondary, margin: "0 0 20px" }}>{tr.workshopsSubtitle}</p>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
            background: cardBg, borderRadius: 14,
            border: `1.5px solid ${borderColor}`, maxWidth: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,.06)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tr.workshopsSearch}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: textPrimary, fontSize: 14, fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left", direction: dir }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: textTertiary, fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
          {search && (
            <p style={{ fontSize: 12, color: "#E8730A", marginTop: 8, fontWeight: 500 }}>
              {lang === "ar" ? `نتائج البحث عن: "${search}"` : `Results for: "${search}"`}
            </p>
          )}
        </div>
      </section>

      {/* Category pills — horizontally scrollable on mobile */}
      <div style={{ borderBottom: `1px solid ${borderColor}`, background: bg }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "12px 20px", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none" }}>
          <button onClick={() => setActiveCat("all")} style={{
            padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
            background: activeCat === "all" ? "#E8730A" : cardBg,
            color: activeCat === "all" ? "#fff" : textSecondary,
            border: activeCat === "all" ? "1.5px solid #E8730A" : `1px solid ${borderColor}`,
            transition: "all .15s",
          }}>
            {tr.allCategories}
          </button>
          {CATEGORIES.map(cat => {
            const isActive = activeCat === cat.id;
            const rgb = hexRgb(cat.accent);
            return (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
                whiteSpace: "nowrap", flexShrink: 0,
                background: isActive ? `rgba(${rgb},.1)` : cardBg,
                color: isActive ? cat.accent : textSecondary,
                border: isActive ? `1.5px solid rgba(${rgb},.35)` : `1px solid ${borderColor}`,
                transition: "all .15s",
              }}>
                <span>{cat.icon}</span>
                {lang === "ar" ? cat.ar : cat.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shop list */}
      <section style={{ padding: "20px 20px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: textTertiary, marginBottom: 16, fontWeight: 500 }}>
            {filtered.length} {tr.shopUnit}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: textTertiary, fontSize: 14 }}>
              {tr.noResults}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {filtered.map(shop => {
                const cat = CATEGORIES.find(c => c.id === shop.category);
                const rgb = hexRgb(cat?.accent ?? "#E8730A");
                return (
                  <div key={shop.id} style={{
                    background: cardBg, borderRadius: 16,
                    border: `1px solid ${borderColor}`, padding: 18,
                    transition: "all .18s", cursor: "pointer",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,.09)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    {/* Category badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, flexShrink: 0 }}>
                        {cat?.icon}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: cat?.accent }}>
                        {lang === "ar" ? cat?.ar : cat?.en}
                      </span>
                      {shop.rating >= 4.8 && (
                        <span style={{ marginInlineStart: "auto", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(232,115,10,.1)", color: "#E8730A", border: "1px solid rgba(232,115,10,.2)" }}>
                          {tr.topRated}
                        </span>
                      )}
                    </div>

                    {/* Name + area */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 2 }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: textTertiary }}>📍 {shop.area[lang]}</div>
                    </div>

                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 1 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < Math.round(shop.rating) ? "#F59E0B" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 11 }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>{shop.rating}</span>
                      {shop.reviews > 0 && <span style={{ fontSize: 12, color: textTertiary }}>({shop.reviews})</span>}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {shop.tags[lang].slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", color: textSecondary, border: `1px solid ${borderColor}` }}>{tag}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/chat?shop=${shop.id}`} style={{
                        flex: 1, padding: "10px 0", borderRadius: 10, background: "#E8730A", color: "#fff",
                        fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
                      >
                        💬 {lang === "ar" ? "تواصل" : "Message"}
                      </Link>
                      <Link href={`/shop/${shop.id}`} style={{
                        flex: 1, padding: "10px 0", borderRadius: 10, background: "transparent",
                        border: `1px solid ${borderColor}`, color: textSecondary,
                        fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block",
                        transition: "all .15s",
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
          )}
        </div>
      </section>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: textTertiary, borderTop: `1px solid ${borderColor}` }}>
        {tr.footerCopy}
      </footer>

      {/* Mobile bottom nav spacer */}
      <div className="warsha-mobile-nav" style={{ display: "none", height: 72 }} />
      <style>{`
        @media (max-width: 768px) { .warsha-mobile-nav { display: block !important; } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function WorkshopsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <WorkshopsInner />
    </Suspense>
  );
}