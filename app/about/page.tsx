"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { t, type Lang } from "../lib/translations";

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

const VALUES = {
  ar: [
    { icon: "🔍", title: "شفافية كاملة",    body: "عرض التقييمات والأسعار والتفاصيل بشكل واضح — بدون مفاجآت." },
    { icon: "🛡️", title: "ورش موثوقة",      body: "كل ورشة على المنصة بتمر بعملية مراجعة قبل ما تتضاف." },
    { icon: "📍", title: "سهولة الوصول",    body: "خريطة تفاعلية وبحث ذكي بيخلي لقاء الورشة المناسبة سهل." },
    { icon: "💬", title: "تواصل مباشر",     body: "من غير وسيط — كلم الورشة على واتساب أو اتصل بيها فوراً." },
  ],
  en: [
    { icon: "🔍", title: "Full transparency",  body: "Ratings, prices, and details displayed clearly — no surprises." },
    { icon: "🛡️", title: "Verified shops",     body: "Every shop on the platform goes through a review before being listed." },
    { icon: "📍", title: "Easy to reach",      body: "Interactive map and smart search make finding the right shop simple." },
    { icon: "💬", title: "Direct contact",     body: "No middleman — message the shop on WhatsApp or call directly." },
  ],
};

const HOW = {
  ar: [
    { step: "١", title: "ابحث", body: "ابحث بنوع الخدمة اللي محتاجها — ميكانيكا، تشطيب، تيونينج، وأكتر." },
    { step: "٢", title: "قارن", body: "شوف التقييمات، المنطقة، والخدمات لكل ورشة واختار المناسب." },
    { step: "٣", title: "تواصل", body: "كلم الورشة مباشرة على واتساب أو احصل على الاتجاهات." },
  ],
  en: [
    { step: "1", title: "Search",  body: "Search by service type — mechanical, interior, tuning, and more." },
    { step: "2", title: "Compare", body: "See ratings, areas, and services for each shop and choose the right one." },
    { step: "3", title: "Contact", body: "Message the shop directly on WhatsApp or get directions." },
  ],
};

export default function AboutPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!mounted) return null;

  const values = VALUES[lang];
  const how    = HOW[lang];

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Hero ── */}
      <section style={{
        padding: "60px 24px",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "var(--radius-lg)",
            background: "var(--accent)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 28, margin: "0 auto 20px",
          }} aria-hidden="true">W</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px" }}>
            {tr.aboutTitle}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, margin: 0 }}>
            {tr.aboutMissionBody}
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding: "48px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 24px", textAlign: "center" }}>
            {lang === "ar" ? "قيمنا" : "Our values"}
          </h2>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {values.map((v, i) => (
              <div key={i} style={{
                padding: 22, borderRadius: "var(--radius-lg)",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden="true">{v.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "48px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
            {tr.aboutHowTitle}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 32 }}>
            {lang === "ar" ? "٣ خطوات بس" : "Three simple steps"}
          </p>
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(3, 1fr)" }}>
            {how.map((h, i) => (
              <div key={i} style={{
                padding: 22, borderRadius: "var(--radius-lg)",
                background: "var(--bg-card)", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--accent-muted)", color: "var(--accent)",
                  fontWeight: 900, fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }} aria-hidden="true">{h.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{h.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "40px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", textAlign: "center" }}>
            {[
              { v: lang === "ar" ? "٦٠٠+" : "600+", l: lang === "ar" ? "ورشة مضافة" : "Workshops listed" },
              { v: lang === "ar" ? "١٣" : "13",     l: lang === "ar" ? "تخصص" : "Specialisations" },
              { v: lang === "ar" ? "٢٠٢٦" : "2026", l: lang === "ar" ? "سنة التأسيس" : "Founded" },
              { v: lang === "ar" ? "مجاناً" : "Free", l: lang === "ar" ? "خلال البيتا" : "During beta" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "var(--accent)" }}>{s.v}</div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section style={{ padding: "48px 24px 60px" }}>
        <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 10px" }}>
            {tr.aboutContact}
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 24px", lineHeight: 1.75 }}>
            {tr.aboutContactBody}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <a href="mailto:Warsha.Finder@gmail.com" style={{
              fontSize: 14, fontWeight: 600, color: "var(--accent)", textDecoration: "none",
            }}>📧 Warsha.Finder@gmail.com</a>

          </div>
          <div style={{ marginTop: 32 }}>
            <Link href="/list-shop" className="warsha-btn-primary"
              style={{ padding: "12px 28px", fontSize: 14, textDecoration: "none", fontFamily: "inherit" }}
            >
              {lang === "ar" ? "سجّل ورشتك مجاناً ←" : "List your shop free →"}
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}
