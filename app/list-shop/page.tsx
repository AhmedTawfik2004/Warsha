"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { t, CATEGORIES, SHOPS, type Lang } from "../lib/translations";
import { createClient } from "../lib/supabase";

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

function hexRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "45,106,111";
}

const BENEFITS = {
  ar: [
    { title: "ظهور أمام آلاف العملاء", body: "عملاء بيدوروا على نفس خدمتك كل يوم — سهّل عليهم يلاقوك." },
    { title: "ظهور على الخريطة",       body: "ورشتك هتبان على الخريطة التفاعلية عند البحث في منطقتك." },
    { title: "نظام تقييمات حقيقي",    body: "العملاء يقدروا يقيّموا ورشتك — اللي بيعمل كويس بيتميز." },
    { title: "تواصل مباشر",           body: "العملاء يتواصلوا معاك مباشرة من غير وسيط." },
    { title: "مجاناً خلال البيتا",   body: "الانضمام مجاني خلال الفترة التجريبية." },
  ],
  en: [
    { title: "Visibility to thousands", body: "Customers searching for your service every day — make it easy for them to find you." },
    { title: "On the map",              body: "Your shop appears on the interactive map when people search your area." },
    { title: "Real ratings system",     body: "Customers can rate your shop — the best ones stand out." },
    { title: "Direct messaging",        body: "Customers contact you directly through the platform." },
    { title: "Free during beta",        body: "Joining is free during the beta period — no payment needed now." },
  ],
};

const RECENT_SHOPS = SHOPS.slice(-4);

export default function ListShopPage() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";

  const [form, setForm] = useState({ name: "", owner: "", phone: "", area: "", category: "", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const s = createClient();
      const { error: dbError } = await s.from("shop_requests").insert({
        name: form.name, owner: form.owner, phone: form.phone,
        area: form.area, category: form.category, description: form.desc, status: "pending",
      });
      if (dbError) throw dbError;
      fetch("/api/notify-shop-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, owner: form.owner, phone: form.phone, area: form.area, category: form.category, description: form.desc }),
      }).catch(() => {});
      setSubmitted(true);
    } catch {
      setError(lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "var(--bg-secondary)", border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-md)", color: "var(--text-primary)",
    fontSize: 14, fontFamily: "inherit", outline: "none",
    direction: dir, textAlign: dir === "rtl" ? "right" : "left",
    transition: "border-color .2s",
    WebkitAppearance: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "var(--text-secondary)", marginBottom: 6,
  };

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Hero */}
      <section style={{ padding: "40px 20px 32px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 99, marginBottom: 16, background: "var(--accent-muted)", border: "1px solid var(--accent-border)", color: "var(--accent)", fontSize: 12, fontWeight: 600 }}>
            {tr.formNote}
          </span>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{tr.listShopTitle}</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{tr.listShopSubtitle}</p>
        </div>
      </section>

      {/* Benefits — horizontal scroll on mobile */}
      <section style={{ padding: "24px 0", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 12, padding: "0 20px", minWidth: "max-content" }}>
          {BENEFITS[lang].map((b, i) => (
            <div key={i} style={{ padding: "16px 18px", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", minWidth: 180, maxWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{b.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content — stacked on mobile */}
      <section style={{ padding: "28px 20px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)" }} className="warsha-list-grid">

            {/* Form */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px 20px" }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 20px" }}>{tr.listShopFormTitle}</h2>

              {submitted ? (
                <div style={{ padding: "28px 16px", borderRadius: 14, textAlign: "center", background: "var(--accent-muted)", border: "1px solid var(--accent-border)" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", margin: "0 0 8px" }}>{tr.formSuccess}</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.6 }}>
                    {lang === "ar"
                      ? "استلمنا طلبك! ابعتلنا صور الورشة على الإيميل علشان نراجع الطلب."
                      : "We received your request! Please send us photos of your shop so we can review it."}
                  </p>
                  
                    href={`mailto:Warsha.Finder@gmail.com?subject=Shop photos — ${form.name}&body=Hi, I just submitted a listing request for ${form.name}. Please find attached photos of my shop.`}
                    style={{ display: "inline-block", padding: "11px 24px", background: "var(--accent)", color: "#fff", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
                  >
                    {lang === "ar" ? "ابعت صور الورشة" : "Send shop photos"}
                  </a>
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: "12px 0 0" }}>Warsha.Finder@gmail.com</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {error && (
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", color: "#EF4444", fontSize: 13 }}>
                      {error}
                    </div>
                  )}
                  {[
                    { field: "name",  label: tr.formName,  placeholder: lang === "ar" ? "مثلاً: كراج أحمد الميكانيكي" : "e.g. Ahmed's Garage", type: "text" },
                    { field: "owner", label: tr.formOwner, placeholder: lang === "ar" ? "اسمك الكامل" : "Your full name", type: "text" },
                    { field: "phone", label: tr.formPhone, placeholder: "01xxxxxxxxx", type: "tel" },
                    { field: "area",  label: tr.formArea,  placeholder: lang === "ar" ? "مثلاً: مدينتي" : "e.g. Madinaty", type: "text" },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={labelStyle}>{f.label} *</label>
                      <input required type={f.type} value={(form as any)[f.field]} onChange={e => handleChange(f.field, e.target.value)}
                        placeholder={f.placeholder}
                        style={{ ...inputStyle, direction: f.field === "phone" ? "ltr" : dir, textAlign: f.field === "phone" ? "left" : (dir === "rtl" ? "right" : "left") }}
                        onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
                        onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>{tr.formCategory} *</label>
                    <select required value={form.category} onChange={e => handleChange("category", e.target.value)}
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">{lang === "ar" ? "اختار التخصص" : "Select category"}</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{lang === "ar" ? cat.ar : cat.en}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{tr.formDesc}</label>
                    <textarea value={form.desc} onChange={e => handleChange("desc", e.target.value)}
                      placeholder={lang === "ar" ? "اوصف خدماتك باختصار..." : "Briefly describe your services..."}
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)"}
                      onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)"}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="warsha-btn-primary"
                    style={{ padding: "14px 0", fontSize: 15, fontFamily: "inherit", width: "100%", opacity: submitting ? 0.6 : 1, marginTop: 4, borderRadius: 12 }}>
                    {submitting ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...") : tr.formSubmit}
                  </button>
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "center", margin: 0 }}>
                    {lang === "ar" ? "سيتم مراجعة الطلب والتواصل معك خلال ٢٤ ساعة" : "We'll review your request and contact you within 24 hours"}
                  </p>
                </form>
              )}
            </div>

            {/* Recent listings */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 6px" }}>{tr.listingsTitle}</h2>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "0 0 16px" }}>{tr.listingsSubtitle}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {RECENT_SHOPS.map(shop => {
                  const cat = CATEGORIES.find(c => c.id === (shop as any).category);
                  const rgb = hexRgb(cat?.accent ?? "#2D6A6F");
                  return (
                    <Link key={shop.id} href={`/shop/${shop.id}`} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                      borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)",
                      textDecoration: "none", transition: "all .15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(${rgb},.4)`; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                        {cat?.icon ?? "🔧"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shop.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{shop.area[lang]}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", flexShrink: 0 }}>★ {shop.rating}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)" }}>
        {tr.footerCopy}
      </footer>

      {/* Mobile bottom spacer */}
      <div className="warsha-mobile-nav" style={{ display: "none", height: 72 }} />

      <style>{`
        /* Stack form and listings on mobile */
        @media (max-width: 680px) {
          .warsha-list-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .warsha-mobile-nav { display: block !important; }
        }
      `}</style>
    </div>
  );
}