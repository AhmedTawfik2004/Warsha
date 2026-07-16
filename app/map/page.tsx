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

const CairoMap = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "100%", width: "100%", borderRadius: "var(--radius-lg)",
      background: "var(--bg-secondary)", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-tertiary)", fontSize: 13,
    }}>
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const mapShops = useMemo(() => SHOPS.map(s => ({
    id: s.id,
    name: s.name,
    area: s.area,
    rating: s.rating,
    reviews: s.reviews,
    lat: s.lat,
    lng: s.lng,
    accent: CATEGORIES.find(c => c.id === s.category)?.accent ?? "#888780",
    category: s.category,
    phone: s.phone,
  })), []);

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "28px 24px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 16,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
            {tr.mapPageTitle}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>
            {tr.mapPageSubtitle}
          </p>
        </div>
      </section>

      {/* Sidebar + Map */}
      <section style={{ padding: "20px 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 16 }}>

          {/* Sidebar */}
          <div style={{
            flex: "1 1 300px", maxWidth: 360,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", height: 560, overflowY: "auto",
          }}>
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid var(--border)",
              fontSize: 12, fontWeight: 700, color: "var(--text-secondary)",
              position: "sticky", top: 0, background: "var(--bg-card)",
            }}>
              {tr.mapListHeading} ({mapShops.length})
            </div>

            {mapShops.map(shop => {
              const cat = CATEGORIES.find(c => c.id === shop.category);
              const isSelected = selectedId === shop.id;
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedId(shop.id)}
                  style={{
                    width: "100%", textAlign: dir === "rtl" ? "right" : "left",
                    direction: dir, display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", cursor: "pointer", fontFamily: "inherit",
                    background: isSelected ? "var(--accent-muted)" : "transparent",
                    border: "none", borderBottom: "1px solid var(--border)",
                    borderRight: dir === "ltr" && isSelected ? "3px solid var(--accent)" : "3px solid transparent",
                    borderLeft:  dir === "rtl" && isSelected ? "3px solid var(--accent)" : "3px solid transparent",
                    transition: "background .15s",
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: cat?.accent ?? "var(--text-tertiary)" }} aria-hidden="true" />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {shop.name}
                    </span>
                    <span style={{ display: "block", fontSize: 11, color: "var(--text-tertiary)" }}>
                      {shop.area[lang]}
                    </span>
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flexShrink: 0 }}>
                    <span style={{ color: "var(--accent)" }}>★</span> {shop.rating}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map */}
          <div style={{ flex: "2 1 480px", height: 560 }}>
            <CairoMap shops={mapShops} theme={theme} lang={lang} selectedId={selectedId} />
          </div>
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}