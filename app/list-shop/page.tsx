"use client";

import { useState, useEffect, useCallback } from "react";
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

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "232,115,10";
}

const BENEFITS = {
  ar: [
    { icon: "👁️", title: "ظهور أمام آلاف العملاء", body: "عملاء بيدوروا على نفس خدمتك كل يوم — سهّل عليهم يلاقوك." },
    { icon: "📍", title: "ظهور على الخريطة",       body: "ورشتك هتبان على الخريطة التفاعلية عند البحث في منطقتك." },
    { icon: "⭐", title: "نظام تقييمات حقيقي",    body: "العملاء يقدروا يقيّموا ورشتك — اللي بيعمل كويس بيتميز." },
    { icon: "💬", title: "تواصل مباشر واتساب",    body: "العملاء يتواصلوا معاك مباشرة من غير وسيط." },
    { icon: "🆓", title: "مجاناً خلال البيتا",   body: "الانضمام مجاني خلال الفترة التجريبية — مش هتدفع حاجة دلوقتي." },
  ],
  en: [
    { icon: "👁️", title: "Reach thousands of customers", body: "Customers searching for your exact service every day — make it easy for them to find you." },
    { icon: "📍", title: "Appear on the map",             body: "Your shop shows up on the interactive map when people search in your area." },
    { icon: "⭐", title: "Real review system",            body: "Customers can rate your shop — quality work gets recognised." },
    { icon: "💬", title: "Direct WhatsApp contact",       body: "Customers reach you directly with no middleman." },
    { icon: "🆓", title: "Free during beta",              body: "Joining is completely free during the beta period — no fees right now." },
  ],
};

// Show the last 6 real shops as recently listed providers
const RECENT_SHOPS = SHOPS.slice(-6);

export default function ListShopPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const [form, setForm] = useState({
    name: "", owner: "", phone: "", area: "", category: "", desc: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this will call Supabase — for now just show success
    setSubmitted(true);
  }

  if (!mounted) return null;

  const benefits = BENEFITS[lang];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-secondary)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)", color: "var(--text-primary)",
    fontSize: 13, fontFamily: "inherit",
    outline: "none", direction: dir,
    textAlign: dir === "rtl" ? "right" : "left",
    transition: "border-color .2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "var(--text-secondary)", marginBottom: 6,
  };

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Hero ── */}
      <section style={{
        padding: "52px 24px 36px",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 99, marginBottom: 18,
            background: "var(--accent-muted)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: 13,
          }}>
            🆓 {tr.formNote}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 10px" }}>
            {tr.listShopTitle}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.8 }}>
            {tr.listShopSubtitle}
          </p>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ padding: "40px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 20px", textAlign: "center" }}>
            {tr.listShopBenefits}
          </h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                padding: 18, borderRadius: "var(--radius-lg)",
                background: "var(--bg-card)", border: "1px solid var(--border)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 10 }} aria-hidden="true">{b.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.65 }}>{b.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration form + listings (side by side on desktop) ── */}
      <section style={{ padding: "40px 24px 60px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 28, gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)" }}>

          {/* ── Form ── */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)", padding: "28px 28px",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 22px" }}>
              {tr.listShopFormTitle}
            </h2>

            {submitted ? (
              <div style={{
                padding: "24px 20px", borderRadius: "var(--radius-lg)", textAlign: "center",
                background: "var(--accent-muted)", border: "1px solid var(--accent-border)",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)", margin: 0 }}>{tr.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>{tr.formName} *</label>
                  <input required value={form.name} onChange={e => handleChange("name", e.target.value)}
                    placeholder={lang === "ar" ? "مثلاً: كراج أحمد الميكانيكي" : "e.g. Ahmed's Garage"}
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{tr.formOwner} *</label>
                  <input required value={form.owner} onChange={e => handleChange("owner", e.target.value)}
                    placeholder={lang === "ar" ? "اسمك الكامل" : "Your full name"}
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{tr.formPhone} *</label>
                  <input required type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)}
                    placeholder="01xxxxxxxxx"
                    style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>{tr.formArea} *</label>
                    <input required value={form.area} onChange={e => handleChange("area", e.target.value)}
                      placeholder={lang === "ar" ? "مثلاً: مدينتي" : "e.g. Madinaty"}
                      style={inputStyle}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{tr.formCategory} *</label>
                    <select required value={form.category} onChange={e => handleChange("category", e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "var(--accent)"}
                      onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--border)"}
                    >
                      <option value="">{lang === "ar" ? "اختار..." : "Choose..."}</option>
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{lang === "ar" ? c.ar : c.en}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{tr.formDesc}</label>
                  <textarea value={form.desc} onChange={e => handleChange("desc", e.target.value)}
                    rows={3}
                    placeholder={lang === "ar" ? "وصف مختصر عن الورشة وخدماتها..." : "Brief description of your shop and services..."}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)"}
                    onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"}
                  />
                </div>
                <button type="submit" className="warsha-btn-primary"
                  style={{ padding: "12px 0", fontSize: 14, fontFamily: "inherit", width: "100%", marginTop: 4 }}>
                  {tr.formSubmit}
                </button>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "center", margin: 0 }}>
                  {tr.formNote}
                </p>
              </form>
            )}
          </div>

          {/* ── Recently listed shops ── */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px" }}>
              {tr.listingsTitle}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "0 0 16px" }}>
              {tr.listingsSubtitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RECENT_SHOPS.map(shop => {
                const cat = CATEGORIES.find(c => c.id === shop.category);
                const rgb = hexRgb(cat?.accent ?? "#888");
                return (
                  <Link key={shop.id} href={`/shop/${shop.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px", borderRadius: "var(--radius-md)",
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      textDecoration: "none", direction: dir,
                      transition: "border-color .2s, transform .15s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(${rgb},.3)`;
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(" + (dir === "rtl" ? "-2px" : "2px") + ")";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, fontSize: 16, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.22)`,
                    }} aria-hidden="true">{cat?.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {shop.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>
                        {shop.area[lang]} · {lang === "ar" ? cat?.ar : cat?.en}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", flexShrink: 0 }}>
                      <span style={{ color: "var(--accent)" }}>★</span> {shop.rating}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/workshops" style={{
                fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600,
              }}>
                {lang === "ar" ? "عرض كل الورش ←" : "View all workshops →"}
              </Link>
            </div>
          </div>

        </div>
      </section>

      <footer style={{ padding: "20px 24px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>
    </div>
  );
}
