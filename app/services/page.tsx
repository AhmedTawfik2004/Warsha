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

const SERVICES = [
  {
    id: 1,
    icon: "🔧",
    accent: "#E8730A",
    ar: { title: "باقات الصيانة الدورية", body: "صيانة شاملة لسيارتك على فترات منتظمة — تغيير زيت، فلاتر، فرامل، إطارات، وفحص كامل لنظام التكييف والتعليق. اختار الورشة المناسبة وابدأ خطة صيانة منتظمة.", items: ["تغيير زيت ومرشحات", "فحص وتغيير فرامل", "فحص نظام التعليق", "فحص وصيانة تكييف السيارة", "فحص البطارية وكهرباء السيارة"], categories: ["mechanical", "car_ac"] },
    en: { title: "Routine Maintenance Packages", body: "Comprehensive scheduled maintenance for your car — oil changes, filters, brakes, tyres, and full checks for your A/C and suspension. Pick the right shop and start a regular maintenance plan.", items: ["Oil & filter changes", "Brake inspection & replacement", "Suspension system check", "A/C service & maintenance", "Battery & electrical checks"], categories: ["mechanical", "car_ac"] },
  },
  {
    id: 2,
    icon: "🛠️",
    accent: "#EF4444",
    ar: { title: "خدمات الإصلاح المتخصصة", body: "إصلاح دقيق للأعطال الصعبة — موتور، جير، تعليق، شكمان، زجاج، وأكتر. ورش متخصصة بتعرف سيارتك أحسن ما بتعرفها.", items: ["إصلاح المحرك وتيونينج", "إصلاح ناقل الحركة", "إصلاح وتغيير الزجاج", "إصلاح الهيكل والبودي", "تغيير وإصلاح الشكمان"], categories: ["mechanical", "glass_repair", "wrapping", "performance"] },
    en: { title: "Specialized Repair Services", body: "Precise repairs for complex faults — engine, gearbox, suspension, exhaust, glass, and more. Specialist workshops who know your car better than anyone.", items: ["Engine repair & tuning", "Gearbox repair", "Glass replacement & repair", "Bodywork & panel repair", "Exhaust replacement & repair"], categories: ["mechanical", "glass_repair", "wrapping", "performance"] },
  },
  {
    id: 3,
    icon: "🧽",
    accent: "#14B8A6",
    ar: { title: "التنظيف والتفصيل", body: "اجعل سيارتك نظيفة زي الأول من الداخل والخارج — غسيل فوم، تلميع، شفط داخلي، حماية الطلاء، وتجديد الكشافات. خدمات تفصيل احترافية في مناطق مختلفة.", items: ["غسيل فوم خارجي كامل", "تلميع وحماية الطلاء", "شفط وتنظيف داخلي عميق", "تنظيف غرفة المحرك", "تجديد وتلميع الكشافات"], categories: ["car_wash", "car_detailing", "car_protection"] },
    en: { title: "Cleaning & Detailing", body: "Get your car looking brand new inside and out — foam wash, polishing, interior vacuum, paint protection, and headlight restoration. Professional detailing services across Cairo.", items: ["Full foam exterior wash", "Paint polish & protection", "Deep interior vacuum & cleaning", "Engine bay cleaning", "Headlight restoration & polish"], categories: ["car_wash", "car_detailing", "car_protection"] },
  },
  {
    id: 4,
    icon: "💻",
    accent: "#06B6D4",
    ar: { title: "خدمات الفحص والدياجنوستيك", body: "اكتشف مشكلة عربيتك قبل ما تتفاقم — فحص كمبيوتر، مسح أكواد الأعطال، فحص أنظمة ABS والإيرباق، وتقرير مفصل عن حالة السيارة.", items: ["فحص كمبيوتر شامل", "مسح أكواد الأعطال OBD", "فحص نظام ABS والفرامل", "فحص نظام الإيرباق", "تقرير فحص كامل للسيارة"], categories: ["diagnostics", "mechanical"] },
    en: { title: "Diagnostic & Inspection Services", body: "Catch problems before they become expensive — computer diagnostics, fault code scanning, ABS and airbag system checks, and a full vehicle health report.", items: ["Full computer diagnostics", "OBD fault code scanning", "ABS & brake system check", "Airbag system inspection", "Complete vehicle inspection report"], categories: ["diagnostics", "mechanical"] },
  },
  {
    id: 5,
    icon: "📍",
    accent: "#8B5CF6",
    ar: { title: "خدمات الموبايل والطلب أون ديماند", body: "مش قادر تجيب عربيتك للورشة؟ بعض الورش بتيجي عندك في البيت أو الشغل — تغيير زيت، فحص، وتغيير إطارات في مكانك.", items: ["تغيير زيت في موقعك", "فحص سريع في مكانك", "تغيير إطارات في مكانك", "مساعدة طوارئ على الطريق", "تشخيص أعطال في موقعك"], categories: ["mechanical", "tires"] },
    en: { title: "Mobile & On-Demand Services", body: "Can't bring your car to the shop? Some workshops come to you — at home or at work — for oil changes, inspections, and tyre changes wherever you are.", items: ["On-site oil change", "Quick inspection at your location", "Tyre change at your location", "Roadside emergency assistance", "On-site fault diagnosis"], categories: ["mechanical", "tires"] },
  },
];

export default function ServicesPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  if (!mounted) return null;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Header ── */}
      <section style={{ padding: "40px 24px 28px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 16 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {tr.backToHome}
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 6px" }}>
            {tr.servicesTitle}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-tertiary)", margin: 0 }}>
            {tr.servicesSubtitle}
          </p>
        </div>
      </section>

      {/* ── Service cards ── */}
      <section style={{ padding: "32px 24px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {SERVICES.map((svc, i) => {
            const data = svc[lang];
            const num = `0${i + 1}`;
            return (
              <div key={svc.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)", padding: "28px 28px",
                display: "flex", gap: 28, alignItems: "flex-start",
                direction: dir,
                transition: "border-color .2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${svc.accent}44`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
              >
                {/* Number + icon */}
                <div style={{ flexShrink: 0, textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "var(--radius-lg)",
                    background: `${svc.accent}18`, border: `1px solid ${svc.accent}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, marginBottom: 6,
                  }} aria-hidden="true">{svc.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: svc.accent, letterSpacing: ".05em" }}>{num}</div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
                    {data.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 16px" }}>
                    {data.body}
                  </p>

                  {/* Items list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                    {data.items.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, direction: dir }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: svc.accent, flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Find shops CTA — single button going to /workshops */}
                  <div>
                    <Link href="/workshops"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "9px 18px", borderRadius: 99, fontSize: 13, fontWeight: 700,
                        background: `${svc.accent}12`, color: svc.accent,
                        border: `1.5px solid ${svc.accent}30`, textDecoration: "none",
                        transition: "background .15s",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = `${svc.accent}22`}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = `${svc.accent}12`}
                    >
                      {lang === "ar" ? "اعثر على ورشة ←" : "Find shops →"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}