"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { t, CATEGORIES, SHOPS, type Lang } from "./lib/translations";

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
      style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background .2s", color: "var(--text-secondary)" }}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button onClick={onToggle} aria-label="Toggle language"
      style={{ height: 36, padding: "0 12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", transition: "background .2s, color .2s", fontFamily: "inherit" }}>
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}

export default function ShopPage() {
  const params = useParams();
  const shopId = Number(params?.id);

  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!mounted) return null;

  const shop = SHOPS.find(s => s.id === shopId);

  if (!shop) {
    return (
      <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{tr.shopNotFound}</p>
          <Link href="/" className="warsha-btn-primary" style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, textDecoration: "none", fontFamily: "inherit" }}>
            {tr.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === shop.category)!;
  const subcat = category.subcategories.find(s => s.id === shop.subcategory);
  const rgb = hexRgb(category.accent);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "var(--nav-h)", background: "var(--bg)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>W</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{tr.appName}</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangToggle lang={lang} onToggle={toggleLang} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href={`/category/${category.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 20 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToCategory} {lang === "ar" ? category.ar : category.en}
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 8, direction: dir }}>
            <div style={{ width: 56, height: 56, borderRadius: "var(--radius-lg)", fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.28)`, flexShrink: 0 }} aria-hidden="true">
              {category.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>{shop.name}</h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>{shop.area[lang]}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span style={{ color: "var(--accent)" }}>★</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>({shop.reviews} {tr.reviewUnit})</span>
                {subcat && (
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: `rgba(${rgb},.12)`, color: category.accent, marginInlineStart: 4 }}>
                    {subcat.icon} {lang === "ar" ? subcat.ar : subcat.en}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <section style={{ padding: "20px 24px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {shop.phone && (
            <button className="warsha-btn-primary" style={{ flex: "1 1 160px", padding: "12px 20px", fontSize: 14, fontFamily: "inherit" }}
              onClick={() => window.open(`https://wa.me/${shop.phone!.replace(/\D/g,"")}`, "_blank")}>
              {tr.btnWhatsApp}
            </button>
          )}
          {shop.phone && (
            <button className="warsha-btn-ghost" style={{ flex: "1 1 160px", padding: "12px 20px", fontSize: 14, fontFamily: "inherit" }}
              onClick={() => window.open(`tel:${shop.phone}`, "_blank")}>
              📞 {shop.phone}
            </button>
          )}
          <button className="warsha-btn-ghost" style={{ flex: "1 1 160px", padding: "12px 20px", fontSize: 14, fontFamily: "inherit" }}
            onClick={() => window.open(directionsUrl, "_blank")}>
            {tr.getDirections}
          </button>
        </div>
        {!shop.phone && (
          <div style={{ maxWidth: 760, margin: "10px auto 0" }}>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              {lang === "ar" ? "📍 رقم التواصل غير متاح حالياً — استخدم الاتجاهات للوصول للورشة" : "📍 Contact number not listed yet — use directions to find the shop"}
            </p>
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section style={{ padding: "28px 24px 0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10 }}>{tr.servicesOffered}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, direction: dir }}>
            {shop.tags[lang].map(tag => (
              <span key={tag} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 99, background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding: "24px 24px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ padding: 20, borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>{tr.aboutShop}</p>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.8, margin: 0 }}>{tr.aboutShopBody}</p>
          </div>
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}