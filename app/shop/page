"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../../lib/translations";

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

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = Number(params?.id);
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";

  const bg = isDark ? "#0f0f0e" : "#ffffff";
  const bgSecondary = isDark ? "#161614" : "#f7f7f5";
  const textPrimary = isDark ? "#ffffff" : "#111110";
  const textSecondary = isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)";
  const textTertiary = isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)";
  const borderColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const cardBg = isDark ? "#1a1a18" : "#ffffff";

  if (!mounted) return null;

  const shop = SHOPS.find(s => s.id === shopId);
  if (!shop) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: textPrimary, marginBottom: 12 }}>
            {lang === "ar" ? "الورشة غير موجودة" : "Shop not found"}
          </p>
          <Link href="/workshops" style={{ display: "inline-block", padding: "10px 20px", background: "#E8730A", color: "#fff", borderRadius: 10, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
            {lang === "ar" ? "تصفح الورش" : "Browse workshops"}
          </Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === shop.category);
  const rgb = hexRgb(cat?.accent ?? "#E8730A");

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Hero section */}
      <section style={{ background: bgSecondary, borderBottom: `1px solid ${borderColor}`, padding: "32px 20px 28px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/workshops" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: textTertiary, textDecoration: "none", marginBottom: 20, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E8730A")}
            onMouseLeave={e => (e.currentTarget.style.color = textTertiary)}
          >
            {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "كل الورش" : "All workshops"}
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
            {/* Shop icon */}
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0 }}>
              {cat?.icon ?? "🔧"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: textPrimary, margin: 0, letterSpacing: "-0.01em" }}>{shop.name}</h1>
                {shop.rating >= 4.8 && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: "rgba(232,115,10,.1)", color: "#E8730A", border: "1px solid rgba(232,115,10,.2)" }}>
                    {tr.topRated}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: textSecondary, marginBottom: 12 }}>📍 {shop.area[lang]}</div>

              {/* Rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(shop.rating) ? "#F59E0B" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 15 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: textPrimary }}>{shop.rating}</span>
                {shop.reviews > 0 && <span style={{ fontSize: 13, color: textTertiary }}>({shop.reviews} {tr.reviewUnit})</span>}
                <span style={{ fontSize: 12, color: cat?.accent, fontWeight: 600, padding: "2px 10px", borderRadius: 99, background: `rgba(${rgb},.08)`, border: `1px solid rgba(${rgb},.18)` }}>
                  {lang === "ar" ? cat?.ar : cat?.en}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: "28px 20px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 16 }}>

          {/* Tags */}
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${borderColor}`, padding: "20px 20px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: "0 0 14px" }}>
              {lang === "ar" ? "الخدمات" : "Services"}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {shop.tags[lang].map(tag => (
                <span key={tag} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 99, background: `rgba(${rgb},.08)`, color: cat?.accent ?? "#E8730A", border: `1px solid rgba(${rgb},.18)`, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${borderColor}`, padding: "20px 20px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: "0 0 14px" }}>
              {lang === "ar" ? "معلومات الورشة" : "Shop info"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "📍", label: lang === "ar" ? "المنطقة" : "Area", val: shop.area[lang] },
                { icon: "🏷️", label: lang === "ar" ? "التخصص" : "Category", val: lang === "ar" ? cat?.ar : cat?.en },
                { icon: "⭐", label: lang === "ar" ? "التقييم" : "Rating", val: `${shop.rating} / 5` },
                ...(shop.reviews > 0 ? [{ icon: "💬", label: lang === "ar" ? "عدد التقييمات" : "Reviews", val: String(shop.reviews) }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{row.icon}</span>
                  <span style={{ fontSize: 13, color: textSecondary, width: 100, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: textPrimary, fontWeight: 600 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Similar shops */}
          {SHOPS.filter(s => s.category === shop.category && s.id !== shop.id).length > 0 && (
            <div style={{ background: cardBg, borderRadius: 16, border: `1px solid ${borderColor}`, padding: "20px 20px" }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: textPrimary, margin: "0 0 14px" }}>
                {lang === "ar" ? "ورش مشابهة" : "Similar workshops"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SHOPS.filter(s => s.category === shop.category && s.id !== shop.id).slice(0, 3).map(s => (
                  <Link key={s.id} href={`/shop/${s.id}`} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    borderRadius: 12, border: `1px solid ${borderColor}`, textDecoration: "none",
                    transition: "all .15s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,115,10,.04)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = borderColor; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {cat?.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: textTertiary }}>📍 {s.area[lang]}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", flexShrink: 0 }}>★ {s.rating}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA bar at bottom */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: isDark ? "rgba(15,15,14,.97)" : "rgba(255,255,255,.97)",
        borderTop: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px)",
        padding: "12px 20px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 10 }}>
          <Link href={`/chat?shop=${shop.id}`} style={{
            flex: 1, padding: "13px 0", borderRadius: 12, background: "#E8730A", color: "#fff",
            fontSize: 15, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block",
            boxShadow: "0 4px 16px rgba(232,115,10,.3)",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
          >
            💬 {lang === "ar" ? "تواصل مع الورشة" : "Message this shop"}
          </Link>
          <Link href="/workshops" style={{
            padding: "13px 20px", borderRadius: 12, background: "transparent",
            border: `1px solid ${borderColor}`, color: textSecondary,
            fontSize: 15, fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block",
            transition: "all .15s", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = borderColor; (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; }}
          >
            {lang === "ar" ? "ورش أخرى" : "Other shops"}
          </Link>
        </div>
      </div>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: textTertiary, borderTop: `1px solid ${borderColor}` }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}