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

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;
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

  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: textPrimary, marginBottom: 12 }}>
            {lang === "ar" ? "القسم غير موجود" : "Category not found"}
          </p>
          <Link href="/" style={{ display: "inline-block", padding: "10px 20px", background: "#E8730A", color: "#fff", borderRadius: 10, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
            {tr.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  const rgb = hexRgb(category.accent);
  const filteredShops = SHOPS.filter(s => s.category === category.id);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "32px 20px 24px", background: bgSecondary, borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <Link href="/workshops" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: textTertiary, textDecoration: "none", marginBottom: 14, fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E8730A")}
            onMouseLeave={e => (e.currentTarget.style.color = textTertiary)}
          >
            {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "كل الورش" : "All workshops"}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, flexShrink: 0 }}>
              {category.icon}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: textPrimary, margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                {lang === "ar" ? category.ar : category.en}
              </h1>
              <p style={{ fontSize: 13, color: textSecondary, margin: 0 }}>
                {filteredShops.length} {tr.shopsFoundSuffix} · {category.description[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop list */}
      <section style={{ padding: "20px 20px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          {filteredShops.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", borderRadius: 16, background: cardBg, border: `1px solid ${borderColor}`, color: textTertiary, fontSize: 14 }}>
              {tr.noShopsYet}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {filteredShops.map(shop => (
                <div key={shop.id} style={{
                  background: cardBg, borderRadius: 16, border: `1px solid ${borderColor}`,
                  padding: 18, transition: "all .18s", position: "relative",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(0,0,0,.09)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                >
                  {shop.rating >= 4.8 && (
                    <span style={{ position: "absolute", top: 14, [dir === "rtl" ? "left" : "right"]: 14, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(232,115,10,.1)", color: "#E8730A", border: "1px solid rgba(232,115,10,.2)" }}>
                      {tr.topRated}
                    </span>
                  )}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: textPrimary, marginBottom: 2 }}>{shop.name}</div>
                    <div style={{ fontSize: 12, color: textTertiary }}>📍 {shop.area[lang]}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 1 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < Math.round(shop.rating) ? "#F59E0B" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 11 }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>{shop.rating}</span>
                    <span style={{ fontSize: 12, color: textTertiary }}>({shop.reviews} {tr.reviewUnit})</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                    {shop.tags[lang].slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", color: textSecondary, border: `1px solid ${borderColor}` }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/chat?shop=${shop.id}`} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "#E8730A", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
                    >
                      💬 {lang === "ar" ? "تواصل" : "Message"}
                    </Link>
                    <Link href={`/shop/${shop.id}`} style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "transparent", border: `1px solid ${borderColor}`, color: textSecondary, fontSize: 13, fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block", transition: "all .15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = borderColor; (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; }}
                    >
                      {tr.btnView}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: textTertiary, borderTop: `1px solid ${borderColor}` }}>
        {tr.footerCopy}
      </footer>
      <div className="warsha-mobile-nav" style={{ display: "none", height: 72 }} />
      <style>{`@media (max-width: 768px) { .warsha-mobile-nav { display: block !important; } }`}</style>
    </div>
  );
}