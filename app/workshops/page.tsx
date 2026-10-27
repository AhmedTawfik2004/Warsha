"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const th = (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";
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
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "33,78,79";
}

function WorkshopsInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");

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
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "32px 20px 24px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{tr.workshopsTitle}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 20px" }}>{tr.workshopsSubtitle}</p>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
            background: "var(--bg-card)", borderRadius: 14,
            border: "1.5px solid var(--border)", maxWidth: 500,
            boxShadow: "var(--shadow-sm)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tr.workshopsSearch}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 14, fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left", direction: dir }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
          {search && (
            <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 8, fontWeight: 500 }}>
              {lang === "ar" ? `نتائج البحث عن: "${search}"` : `Results for: "${search}"`}
            </p>
          )}
        </div>
      </section>

      {/* Category pills */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "12px 20px", overflowX: "auto", display: "flex", gap: 8, scrollbarWidth: "none" }}>
          <button onClick={() => setActiveCat("all")} style={{
            padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
            background: activeCat === "all" ? "var(--accent)" : "var(--bg-card)",
            color: activeCat === "all" ? "#fff" : "var(--text-secondary)",
            border: activeCat === "all" ? "1.5px solid var(--accent)" : "1px solid var(--border)",
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
                cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 0,
                whiteSpace: "nowrap", flexShrink: 0,
                background: isActive ? `rgba(${rgb},.12)` : "var(--bg-card)",
                color: isActive ? cat.accent : "var(--text-secondary)",
                border: isActive ? `1.5px solid rgba(${rgb},.35)` : "1px solid var(--border)",
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
      <section style={{ padding: "20px 20px 100px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16, fontWeight: 500 }}>
            {filtered.length} {tr.shopUnit}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-tertiary)", fontSize: 14 }}>
              {tr.noResults}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {filtered.map(shop => {
                const cat = CATEGORIES.find(c => c.id === shop.category);
                const rgb = hexRgb(cat?.accent ?? "#214E4F");
                return (
                  <div key={shop.id} style={{
                    background: "var(--bg-card)", borderRadius: 16,
                    border: "1px solid var(--border)", padding: 18,
                    transition: "all .18s", cursor: "pointer",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-border)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
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
                        <span style={{ marginInlineStart: "auto", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
                          {tr.topRated}
                        </span>
                      )}
                    </div>

                    {/* Name + area */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>📍 {shop.area[lang]}</div>
                    </div>

                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 1 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ color: i < Math.round(shop.rating) ? "#F59E0B" : "var(--border-strong)", fontSize: 11 }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                      {shop.reviews > 0 && <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews})</span>}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {shop.tags[lang].slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{tag}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href={`/chat?shop=${shop.id}`} style={{
                        flex: 1, padding: "10px 0", borderRadius: 10,
                        background: "var(--accent)", color: "#fff",
                        fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block",
                        transition: "opacity .15s",
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                      >
                        {lang === "ar" ? "تواصل" : "Message"}
                      </Link>
                      <Link href={`/shop/${shop.id}`} style={{
                        flex: 1, padding: "10px 0", borderRadius: 10,
                        background: "transparent", border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block",
                        transition: "all .15s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
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

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
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