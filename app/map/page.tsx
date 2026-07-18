"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
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

const CairoMap = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100%", width: "100%", borderRadius: "var(--radius-lg)",
      background: "var(--bg-secondary)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-tertiary)", fontSize: 13, gap: 10,
    }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
      {`Loading map...`}
    </div>
  ),
});

export default function MapPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const mapShops = useMemo(() => SHOPS.map(s => ({
    id: s.id,
    name: s.name,
    area: s.area,
    rating: s.rating,
    reviews: s.reviews,
    lat: s.lat,
    lng: s.lng,
    accent: CATEGORIES.find(c => c.id === s.category)?.accent ?? "#E8730A",
    category: s.category,
    phone: s.phone,
  })), []);

  const filteredShops = useMemo(() => {
    if (!search) return mapShops;
    const q = search.toLowerCase();
    return mapShops.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.area[lang].toLowerCase().includes(q)
    );
  }, [search, mapShops, lang]);

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 6 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
            >
              {dir === "rtl" ? "→" : "←"} {tr.backToHome}
            </Link>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{tr.mapPageTitle}</h1>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", margin: "3px 0 0" }}>{tr.mapPageSubtitle}</p>
          </div>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 14px",
            background: "var(--bg-card)", border: "1.5px solid var(--border-strong)",
            borderRadius: "var(--radius-md)", minWidth: 240,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن ورشة..." : "Search workshops..."}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", width: "100%", direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
        </div>
      </section>

      {/* Map + Sidebar — full height */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", maxWidth: "100%", padding: "16px 24px 24px", gap: 16, maxHeight: "calc(100vh - 160px)" }}>

        {/* Sidebar */}
        <div style={{
          width: 300, flexShrink: 0,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid var(--border)",
            fontSize: 12, fontWeight: 700, color: "var(--text-secondary)",
            background: "var(--bg-secondary)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span>{tr.mapListHeading}</span>
            <span style={{ color: "var(--accent)", fontWeight: 800 }}>{filteredShops.length}</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredShops.map(shop => {
              const cat = CATEGORIES.find(c => c.id === shop.category);
              const isSelected = selectedId === shop.id;
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedId(shop.id)}
                  style={{
                    width: "100%", textAlign: dir === "rtl" ? "right" : "left",
                    direction: dir, display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 14px", cursor: "pointer", fontFamily: "inherit",
                    background: isSelected ? "var(--accent-muted)" : "transparent",
                    border: "none", borderBottom: "1px solid var(--border)",
                    borderInlineStart: isSelected ? `3px solid var(--accent)` : "3px solid transparent",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-secondary)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {/* Color dot */}
                  <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: cat?.accent ?? "#888", boxShadow: `0 0 0 2px ${cat?.accent ?? "#888"}30` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "var(--accent)" : "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {shop.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 1, display: "flex", gap: 6 }}>
                      <span>{shop.area[lang]}</span>
                      <span>·</span>
                      <span>{lang === "ar" ? cat?.ar : cat?.en}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", flexShrink: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ color: "#F59E0B" }}>★</span>
                    <span style={{ fontWeight: 700 }}>{shop.rating}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map — takes remaining space */}
        <div style={{ flex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)", minHeight: 400 }}>
          <CairoMap shops={filteredShops} theme={theme} lang={lang} selectedId={selectedId} />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
