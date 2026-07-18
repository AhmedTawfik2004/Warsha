"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../../lib/translations";

// ─── Theme & Lang hook (same as homepage) ──────────────────────────────────

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
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 36, height: 36, borderRadius: 10,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, transition: "background .2s",
        color: "var(--text-secondary)",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}

function LangToggle({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle language"
      style={{
        height: 36, padding: "0 12px", borderRadius: 10,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        fontSize: 12, fontWeight: 600,
        color: "var(--text-secondary)",
        transition: "background .2s, color .2s",
        fontFamily: "inherit",
      }}
    >
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!mounted) return null;

  const category = CATEGORIES.find(c => c.id === categoryId);

  // ── Category not found ──
  if (!category) {
    return (
      <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            {lang === "ar" ? "القسم غير موجود" : "Category not found"}
          </p>
          <Link href="/" className="warsha-btn-primary" style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, textDecoration: "none", fontFamily: "inherit" }}>
            {tr.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  const rgb = hexRgb(category.accent);

  // Show all shops in this category — no subcategory filtering
  const filteredShops = SHOPS.filter(s => s.category === category.id);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: "var(--nav-h)",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--accent)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 14,
          }}>
            W
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>
            {tr.appName}
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LangToggle  lang={lang}   onToggle={toggleLang} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <section style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none",
            marginBottom: 20,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, direction: dir }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-lg)", fontSize: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.28)`,
              flexShrink: 0,
            }} aria-hidden="true">
              {category.icon}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                {lang === "ar" ? category.ar : category.en}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "2px 0 0" }}>
                {filteredShops.length} {tr.shopsFoundSuffix} · {category.description[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SHOP LIST
      ════════════════════════════════════════ */}
      <section style={{ padding: "28px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {filteredShops.length === 0 ? (
            <div style={{
              padding: "40px 24px", textAlign: "center",
              borderRadius: "var(--radius-lg)", background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)", fontSize: 13,
            }}>
              {tr.noShopsYet}
            </div>
          ) : (
            <div style={{
              display: "grid", gap: 14,
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}>
              {filteredShops.map(shop => (
                <div
                  key={shop.id}
                  className="warsha-card"
                  style={{ padding: 20, position: "relative", cursor: "pointer" }}
                >
                  

                  <div style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    marginBottom: 10, direction: dir,
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{shop.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 3 }}>
                        {shop.area[lang]}
                      </div>
                    </div>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, fontSize: 16,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--accent-muted)", border: "1px solid var(--accent-border)",
                      flexShrink: 0,
                    }} aria-hidden="true">🔧</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, direction: dir }}>
                    <span style={{ color: "var(--accent)" }}>★</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{shop.rating}</span>
                    <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                      ({shop.reviews} {tr.reviewUnit})
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, direction: dir }}>
                    {shop.tags[lang].map(tag => (
                      <span key={tag} style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 99,
                        background: "var(--bg-secondary)", color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/chat?shop=${shop.id}`}
                      className="warsha-btn-primary"
                      style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center", display: "block" }}
                    >
                      💬 {lang === "ar" ? "تواصل" : "Message"}
                    </Link>
                    <Link
                      href={`/shop/${shop.id}`}
                      className="warsha-btn-ghost"
                      style={{ flex: 1, padding: "9px 0", fontSize: 13, fontFamily: "inherit", textDecoration: "none", textAlign: "center", display: "block" }}
                      aria-label={`${tr.btnView} — ${shop.name}`}
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

      {/* Footer */}
      <footer style={{
        padding: "20px 24px", textAlign: "center",
        fontSize: 12, color: "var(--text-tertiary)",
        borderTop: "1px solid var(--border)",
      }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}
