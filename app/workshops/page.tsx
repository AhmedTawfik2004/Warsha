"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../lib/translations";

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

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,115,10";
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
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "40px 24px 28px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 16 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 6px" }}>{tr.workshopsTitle}</h1>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)", margin: "0 0 20px" }}>{tr.workshopsSubtitle}</p>

          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-strong)", maxWidth: 480 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tr.workshopsSearch}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", textAlign: dir === "rtl" ? "right" : "left", direction: dir }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>

          {search && (
            <p style={{ fontSize: 12, color: "var(--accent)", marginTop: 8 }}>
              {lang === "ar" ? `نتائج البحث عن: "${search}"` : `Search results for: "${search}"`}
            </p>
          )}
        </div>
      </section>

      {/* Category filter pills */}
      <section style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button onClick={() => setActiveCat("all")} style={{
              padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              background: activeCat === "all" ? "var(--accent)" : "var(--bg-card)",
              color: activeCat === "all" ? "#fff" : "var(--text-secondary)",
              border: activeCat === "all" ? "1.5px solid var(--accent)" : "1px solid var(--border)",
            }}>
              {tr.allCategories}
            </button>
            {CATEGORIES.map(cat => {
              const isActive = activeCat === cat.id;
              const rgb = hexRgb(cat.accent);
              return (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                  padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
                  background: isActive ? `rgba(${rgb},.12)` : "var(--bg-card)",
                  color: isActive ? cat.accent : "var(--text-secondary)",
                  border: isActive ? `1.5px solid rgba(${rgb},.4)` : "1px solid var(--border)",
                }}>
                  <span>{cat.icon}</span>
                  {lang === "ar" ? cat.ar : cat.en}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shop list */}
      <section style={{ padding: "24px 24px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>
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
                const subcat = cat?.subcategories.find(s => s.id === shop.subcategory);
                const rgb = hexRgb(cat?.accent ?? "#888");
                return (
                  <div key={shop.id} className="warsha-card" style={{ padding: 18 }}>

                    {/* Category badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, direction: dir }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.22)`, flexShrink: 0 }}>
                        {cat?.icon}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: cat?.accent }}>
                        {lang === "ar" ? cat?.ar : cat?.en}
                        {subcat && ` · ${lang === "ar" ? subcat.ar : subcat.en}`}
                      </span>
                    </div>

                    {/* Name + area */}
                    <div style={{ direction: dir, marginBottom: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>📍 {shop.area[lang]}</div>
                    </div>

                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, direction: dir }}>
                      <span style={{ color: "#F59E0B" }}>★</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                      {shop.reviews > 0 && (
                        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>
                      )}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14, direction: dir }}>
                      {shop.tags[lang].slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 7 }}>
                      <Link href={`/chat?shop=${shop.id}`} className="warsha-btn-primary"
                        style={{ flex: 1, padding: "8px 0", fontSize: 12, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                        💬 {lang === "ar" ? "تواصل" : "Message"}
                      </Link>
                      <Link href={`/shop/${shop.id}`} className="warsha-btn-ghost"
                        style={{ flex: 1, padding: "8px 0", fontSize: 12, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
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

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
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
