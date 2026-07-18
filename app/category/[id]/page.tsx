"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../../lib/translations";

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

export default function CategoryPage() {
  const params = useParams();
  const catId = params?.id as string;
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const category = CATEGORIES.find(c => c.id === catId);
  const shops = useMemo(() => SHOPS.filter(s => s.category === catId), [catId]);

  if (!mounted) return null;

  if (!category) {
    return (
      <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>Category not found</p>
          <Link href="/" className="warsha-btn-primary" style={{ padding: "10px 20px", textDecoration: "none", fontFamily: "inherit", fontSize: 13 }}>{tr.backToHome}</Link>
        </div>
      </div>
    );
  }

  const rgb = hexRgb(category.accent);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "28px 24px 24px", background: `rgba(${rgb},.04)`, borderBottom: `1px solid rgba(${rgb},.15)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 14 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14, direction: dir }}>
            <div style={{ width: 52, height: 52, borderRadius: "var(--radius-lg)", background: `rgba(${rgb},.12)`, border: `1px solid rgba(${rgb},.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {category.icon}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                {lang === "ar" ? category.ar : category.en}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "3px 0 0" }}>
                {shops.length} {tr.shopsFoundSuffix} · {category.description[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shops */}
      <section style={{ padding: "28px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {shops.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-tertiary)", fontSize: 13 }}>
              {tr.noShopsYet}
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {shops.map(shop => (
                <div key={shop.id} className="warsha-card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, direction: dir }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>📍 {shop.area[lang]}</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: 10, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, flexShrink: 0 }}>
                      {category.icon}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, direction: dir }}>
                    <span style={{ color: "#F59E0B" }}>★</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                    {shop.reviews > 0 && (
                      <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14, direction: dir }}>
                    {shop.tags[lang].map(tag => (
                      <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/shop/${shop.id}`} className="warsha-btn-primary"
                      style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center" }}>
                      {tr.btnView}
                    </Link>
                    <button className="warsha-btn-ghost"
                      style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit" }}
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, "_blank")}>
                      {tr.getDirections}
                    </button>
                  </div>
                </div>
              ))}
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
