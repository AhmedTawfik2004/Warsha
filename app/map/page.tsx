"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const savedTheme = (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";
    const savedLang = (localStorage.getItem("warsha-lang") as Lang) || "ar";
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
    <div style={{ height: "100%", width: "100%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", fontSize: 13, gap: 10 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
      Loading map...
    </div>
  ),
});

export default function MapPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false); // mobile: toggle list vs map

  const accentColor = isDark ? "#4A9FA5" : "#2D6A6F";
  const textPrimary = isDark ? "#EAECE9" : "#231F1A";
  const textSecondary = isDark ? "#8A9E9A" : "#5C5650";
  const textTertiary = isDark ? "rgba(234,236,233,.35)" : "rgba(35,31,26,.35)";
  const borderColor = isDark ? "rgba(110,127,119,.15)" : "rgba(35,31,26,.10)";
  const cardBg = isDark ? "#1C2B2C" : "#FFFFFF";
  const bgSecondary = isDark ? "#162020" : "#F0ECE4";

  const mapShops = useMemo(() => SHOPS.map(s => ({
    id: s.id, name: s.name, area: s.area, rating: s.rating, reviews: s.reviews,
    lat: s.lat, lng: s.lng, accent: CATEGORIES.find(c => c.id === s.category)?.accent ?? "#2D6A6F",
    category: s.category, phone: s.phone,
  })), []);

  const filteredShops = useMemo(() => {
    if (!search) return mapShops;
    const q = search.toLowerCase();
    return mapShops.filter(s => s.name.toLowerCase().includes(q) || s.area[lang].toLowerCase().includes(q));
  }, [search, mapShops, lang]);

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ height: "100dvh", background: "var(--bg)", color: textPrimary, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Compact header */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${borderColor}`, background: bgSecondary, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <Link href="/" style={{ fontSize: 12, color: textTertiary, textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}
          onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.color = textTertiary)}
        >
          {dir === "rtl" ? "→" : "←"} {tr.backToHome}
        </Link>

        {/* Search */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن ورشة..." : "Search workshops..."}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: textPrimary, fontSize: 13, fontFamily: "inherit", direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: textTertiary, fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setShowList(l => !l)} className="warsha-mobile-nav"
          style={{ display: "none", padding: "8px 12px", borderRadius: 10, border: `1px solid ${borderColor}`, background: showList ? accentColor : cardBg, color: showList ? "#fff" : textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
          {showList ? (lang === "ar" ? "الخريطة" : "Map") : (lang === "ar" ? "القائمة" : "List")}
        </button>
      </div>

      {/* Main area — map + sidebar */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* Sidebar — hidden on mobile unless showList */}
        <div style={{
          width: 280, flexShrink: 0,
          background: cardBg, borderInlineEnd: `1px solid ${borderColor}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
          // Mobile: absolute overlay
        }} className="warsha-map-sidebar">
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, background: bgSecondary, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: textSecondary }}>{tr.mapListHeading}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: accentColor }}>{filteredShops.length}</span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredShops.map(shop => {
              const cat = CATEGORIES.find(c => c.id === shop.category);
              const isSelected = selectedId === shop.id;
              return (
                <button key={shop.id} onClick={() => { setSelectedId(shop.id); setShowList(false); }}
                  style={{
                    width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir,
                    display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                    cursor: "pointer", fontFamily: "inherit",
                    background: isSelected ? "rgba(45,106,111,.1)" : "transparent",
                    border: "none", borderBottom: `1px solid ${borderColor}`,
                    borderInlineStart: isSelected ? `3px solid ${accentColor}` : "3px solid transparent",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,.03)" : "rgba(35,31,26,.03)"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: cat?.accent ?? accentColor }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? accentColor : textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shop.name}</div>
                    <div style={{ fontSize: 11, color: textTertiary, marginTop: 1 }}>{shop.area[lang]} · {lang === "ar" ? cat?.ar : cat?.en}</div>
                  </div>
                  <div style={{ fontSize: 12, color: textSecondary, flexShrink: 0, display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ color: "#F59E0B" }}>★</span>
                    <span style={{ fontWeight: 700 }}>{shop.rating}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <CairoMap shops={filteredShops} theme={theme} lang={lang} selectedId={selectedId} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Mobile: sidebar hidden, map full screen by default */
        @media (max-width: 768px) {
          .warsha-map-sidebar {
            position: absolute !important;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100% !important;
            z-index: 10;
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile: show list as overlay when toggled */}
      {showList && (
        <div style={{
          position: "fixed", top: "calc(var(--nav-h) + 52px)", left: 0, right: 0, bottom: 0, zIndex: 20,
          background: cardBg, overflowY: "auto", direction: dir,
        }}>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, background: bgSecondary, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: textSecondary }}>{filteredShops.length} {lang === "ar" ? "ورشة" : "workshops"}</span>
          </div>
          {filteredShops.map(shop => {
            const cat = CATEGORIES.find(c => c.id === shop.category);
            return (
              <button key={shop.id} onClick={() => { setSelectedId(shop.id); setShowList(false); }}
                style={{ width: "100%", textAlign: dir === "rtl" ? "right" : "left", direction: dir, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", background: "transparent", border: "none", borderBottom: `1px solid ${borderColor}` }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: cat?.accent ?? accentColor }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shop.name}</div>
                  <div style={{ fontSize: 12, color: textTertiary, marginTop: 2 }}>{shop.area[lang]} · {lang === "ar" ? cat?.ar : cat?.en}</div>
                </div>
                <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>★ {shop.rating}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}