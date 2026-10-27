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
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "33,78,79";
}

// Per-shop photo galleries + sample reviews
const SHOP_EXTRAS: Record<number, {
  photos: string[];
  reviews: Array<{ name: string; nameAr: string; rating: number; date: string; text: string; textAr: string }>;
  hours: string;
  hoursAr: string;
  about: string;
  aboutAr: string;
}> = {
  1: {
    photos: [
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80",
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=900&q=80",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80",
    ],
    reviews: [
      { name: "Ahmed M.", nameAr: "أحمد م.", rating: 5, date: "Oct 2024", text: "Best mechanic I've been to in the area. Fast, honest, and fair prices.", textAr: "أفضل ميكانيكي في المنطقة. سريع وأمين وأسعاره معقولة." },
      { name: "Sara K.", nameAr: "سارة ك.", rating: 5, date: "Sep 2024", text: "Fixed my brakes same day. Very professional team.", textAr: "صلّح الفرامل في نفس اليوم. فريق محترف جداً." },
      { name: "Omar T.", nameAr: "عمر ت.", rating: 4, date: "Aug 2024", text: "Good service, slightly long wait but definitely worth it.", textAr: "خدمة كويسة، الانتظار شوية طويل بس يستاهل." },
    ],
    hours: "Sat–Thu 8am–8pm", hoursAr: "السبت–الخميس ٨ص–٨م",
    about: "Specialist mechanical workshop with over 15 years of experience. Expert in Japanese and European cars.",
    aboutAr: "ورشة ميكانيكا متخصصة بأكثر من ١٥ سنة خبرة. متخصصين في السيارات اليابانية والأوروبية.",
  },
  2: {
    photos: [
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=80",
      "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=900&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80",
    ],
    reviews: [
      { name: "Karim H.", nameAr: "كريم ح.", rating: 5, date: "Oct 2024", text: "Spotless detailing work. My car looks brand new!", textAr: "تفصيل ممتاز. عربيتي بدت زي الجديدة تماماً!" },
      { name: "Nada F.", nameAr: "ندى ف.", rating: 5, date: "Sep 2024", text: "Nano coating done perfectly. Great attention to detail.", textAr: "طبّقوا الـ nano coating باحترافية. اهتمام ممتاز بالتفاصيل." },
      { name: "Youssef B.", nameAr: "يوسف ب.", rating: 4, date: "Jul 2024", text: "Professional team, reasonable prices for the quality.", textAr: "فريق محترف وأسعار معقولة مقارنة بالجودة." },
    ],
    hours: "Daily 9am–9pm", hoursAr: "يومياً ٩ص–٩م",
    about: "Premium detailing and paint protection specialists. Certified nano coating applicators.",
    aboutAr: "متخصصون في التفصيل الاحترافي وحماية الطلاء. معتمدون في تطبيق طبقات النانو.",
  },
  3: {
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=900&q=80",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=900&q=80",
    ],
    reviews: [
      { name: "Hossam A.", nameAr: "حسام أ.", rating: 5, date: "Oct 2024", text: "Best A/C service around. Fixed the problem others couldn't.", textAr: "أفضل خدمة تكييف في المنطقة. صلّح المشكلة اللي ناس كتير عجزوا." },
      { name: "Mona S.", nameAr: "منى س.", rating: 5, date: "Sep 2024", text: "Quick diagnosis and repair. Very honest about pricing.", textAr: "تشخيص وإصلاح سريع. صريح جداً في الأسعار." },
    ],
    hours: "Sat–Thu 9am–7pm", hoursAr: "السبت–الخميس ٩ص–٧م",
    about: "Specialised in car A/C systems — refrigerant recharge, compressor repair, and full AC overhaul.",
    aboutAr: "متخصصون في أنظمة تكييف السيارات — شحن فريون، إصلاح كمبريسور، وأوفرهول كامل للتكييف.",
  },
  4: {
    photos: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=900&q=80",
    ],
    reviews: [
      { name: "Tarek M.", nameAr: "طارق م.", rating: 5, date: "Oct 2024", text: "Top wrapping job. PPF film applied perfectly with no bubbles.", textAr: "تغليف ممتاز. ركّبوا فيلم PPF بشكل مثالي من غير فقاعات." },
      { name: "Rania G.", nameAr: "رانيا ج.", rating: 5, date: "Aug 2024", text: "Changed the colour of my car completely. Looks factory finish.", textAr: "غيّروا لون عربيتي بالكامل. طلعت زي طلاء المصنع." },
    ],
    hours: "Sat–Thu 10am–8pm", hoursAr: "السبت–الخميس ١٠ص–٨م",
    about: "Cairo's leading car wrapping studio. PPF, colour changes, chrome delete, and custom liveries.",
    aboutAr: "أبرز ستوديو تغليف سيارات. PPF، تغيير اللون، وإزالة الكروم.",
  },
  5: {
    photos: [
      "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=900&q=80",
      "https://images.unsplash.com/photo-1582560469781-1f4a7a1e0f5f?w=900&q=80",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=80",
    ],
    reviews: [
      { name: "Sherif N.", nameAr: "شريف ن.", rating: 5, date: "Oct 2024", text: "Windscreen replaced in under an hour. Perfect seal.", textAr: "غيّروا الزجاج الأمامي في أقل من ساعة. إحكام مثالي." },
      { name: "Layla Z.", nameAr: "ليلى ز.", rating: 4, date: "Sep 2024", text: "Good quality glass used. Fair price.", textAr: "زجاج جودة كويسة. السعر معقول." },
    ],
    hours: "Daily 8am–10pm", hoursAr: "يومياً ٨ص–١٠م",
    about: "Specialist car glass workshop. Windscreen replacement, side windows, sun roofs, and glass tinting.",
    aboutAr: "ورشة متخصصة في زجاج السيارات. تغيير الزجاج الأمامي، النوافذ الجانبية، فتحات السقف، والتظليل.",
  },
};

const DEFAULT_EXTRAS = {
  photos: [
    "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80",
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=900&q=80",
  ],
  reviews: [
    { name: "Ahmed K.", nameAr: "أحمد ك.", rating: 5, date: "Oct 2024", text: "Excellent service and fair pricing. Highly recommended.", textAr: "خدمة ممتازة وأسعار معقولة. أنصح بيهم بشدة." },
    { name: "Mona R.", nameAr: "منى ر.", rating: 4, date: "Sep 2024", text: "Professional team, got the job done quickly.", textAr: "فريق محترف وشغل سريع." },
  ],
  hours: "Sat–Thu 9am–7pm", hoursAr: "السبت–الخميس ٩ص–٧م",
  about: "Trusted local workshop serving the community with quality automotive services.",
  aboutAr: "ورشة محلية موثوقة تخدم المجتمع بخدمات سيارات عالية الجودة.",
};

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = Number(params?.id);
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const tr = t[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const [activePhoto, setActivePhoto] = useState(0);

  // Teal design tokens
  const bg          = isDark ? "#0F1414" : "#FAF7F2";
  const bgSecondary = isDark ? "#141D1E" : "#F0EBE1";
  const surface     = isDark ? "#1F2A2E" : "#ffffff";
  const textPri     = isDark ? "#EAECE9" : "#231F1A";
  const textSec     = isDark ? "rgba(234,236,233,.55)" : "rgba(35,31,26,.55)";
  const textTer     = isDark ? "rgba(234,236,233,.35)" : "rgba(35,31,26,.35)";
  const border      = isDark ? "rgba(234,236,233,.08)" : "rgba(214,208,196,.72)";
  const accent      = isDark ? "#6E7F77" : "#214E4F";
  const accentMuted = isDark ? "rgba(110,127,119,.13)" : "rgba(33,78,79,.08)";
  const accentBorder= isDark ? "rgba(110,127,119,.3)"  : "rgba(33,78,79,.2)";
  const accentHover = isDark ? "rgba(110,127,119,.22)" : "rgba(33,78,79,.13)";

  if (!mounted) return null;

  const shop = SHOPS.find(s => s.id === shopId);
  if (!shop) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: textPri, marginBottom: 12 }}>
            {lang === "ar" ? "الورشة غير موجودة" : "Shop not found"}
          </p>
          <Link href="/workshops" style={{ display: "inline-block", padding: "10px 20px", background: accent, color: "#fff", borderRadius: 10, fontSize: 13, textDecoration: "none", fontWeight: 700 }}>
            {lang === "ar" ? "تصفح الورش" : "Browse workshops"}
          </Link>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === shop.category);
  const rgb = hexRgb(cat?.accent ?? "#214E4F");
  const extras = SHOP_EXTRAS[shopId] ?? DEFAULT_EXTRAS;

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPri, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Photo gallery ── */}
      <div style={{ position: "relative", background: "#000", height: 300, overflow: "hidden" }}>
        <img
          key={activePhoto}
          src={extras.photos[activePhoto]}
          alt={shop.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.82, transition: "opacity .25s" }}
          onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80"; }}
        />
        {/* Gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,.25) 0%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />

        {/* Back button */}
        <Link href="/workshops" style={{
          position: "absolute", top: 14, insetInlineStart: 16,
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(0,0,0,.45)", backdropFilter: "blur(10px)",
          color: "#fff", padding: "7px 14px", borderRadius: 99,
          fontSize: 12, fontWeight: 600, textDecoration: "none",
          border: "1px solid rgba(255,255,255,.15)",
        }}>
          {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "كل الورش" : "All workshops"}
        </Link>

        {/* Photo dots */}
        {extras.photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
            {extras.photos.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} style={{
                width: i === activePhoto ? 22 : 7, height: 7, borderRadius: 99,
                background: i === activePhoto ? "#fff" : "rgba(255,255,255,.45)",
                border: "none", cursor: "pointer", transition: "all .2s", padding: 0,
              }} />
            ))}
          </div>
        )}

        {/* Photo count chip */}
        <div style={{ position: "absolute", bottom: 14, insetInlineEnd: 16, background: "rgba(0,0,0,.5)", backdropFilter: "blur(10px)", color: "#fff", padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,.15)" }}>
          📷 {extras.photos.length}
        </div>
      </div>

      {/* ── Shop header ── */}
      <section style={{ background: bgSecondary, borderBottom: `1px solid ${border}`, padding: "22px 20px 18px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {/* Icon */}
            <div style={{
              width: 62, height: 62, borderRadius: 18, flexShrink: 0,
              background: `rgba(${rgb},.1)`, border: `1.5px solid rgba(${rgb},.22)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginTop: -6,
              boxShadow: `0 4px 18px rgba(${rgb},.18)`,
            }}>
              {cat?.icon ?? "🔧"}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                <h1 style={{ fontSize: 21, fontWeight: 900, color: textPri, margin: 0, letterSpacing: "-0.02em" }}>{shop.name}</h1>
                {shop.rating >= 4.8 && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: accentMuted, color: accent, border: `1px solid ${accentBorder}` }}>
                    ⭐ {lang === "ar" ? "الأعلى تقييماً" : "Top Rated"}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: textSec, marginBottom: 9 }}>📍 {shop.area[lang]}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < Math.round(shop.rating) ? "#6E7F77" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.13)"), fontSize: 14 }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: textPri }}>{shop.rating}</span>
                {shop.reviews > 0 && <span style={{ fontSize: 12, color: textTer }}>({shop.reviews} {tr.reviewUnit})</span>}
                <span style={{ fontSize: 11, color: cat?.accent, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: `rgba(${rgb},.08)`, border: `1px solid rgba(${rgb},.18)` }}>
                  {lang === "ar" ? cat?.ar : cat?.en}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section style={{ padding: "20px 20px 130px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 12 }}>

          {/* About */}
          <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "18px 20px" }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: textTer, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: ".07em" }}>
              {lang === "ar" ? "عن الورشة" : "About"}
            </h2>
            <p style={{ fontSize: 14, color: textSec, lineHeight: 1.72, margin: 0 }}>
              {lang === "ar" ? extras.aboutAr : extras.about}
            </p>
          </div>

          {/* Services */}
          <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "18px 20px" }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: textTer, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".07em" }}>
              {lang === "ar" ? "الخدمات" : "Services"}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {shop.tags[lang].map(tag => (
                <span key={tag} style={{
                  fontSize: 13, padding: "6px 14px", borderRadius: 99,
                  background: accentMuted, color: accent,
                  border: `1px solid ${accentBorder}`, fontWeight: 500,
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "18px 20px" }}>
            <h2 style={{ fontSize: 11, fontWeight: 700, color: textTer, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: ".07em" }}>
              {lang === "ar" ? "معلومات" : "Info"}
            </h2>
            <div style={{ display: "grid", gap: 11 }}>
              {[
                { icon: "📍", label: lang === "ar" ? "المنطقة"         : "Area",     val: shop.area[lang] },
                { icon: "🕐", label: lang === "ar" ? "مواعيد العمل"    : "Hours",    val: lang === "ar" ? extras.hoursAr : extras.hours },
                { icon: "🏷️", label: lang === "ar" ? "التخصص"          : "Category", val: lang === "ar" ? cat?.ar : cat?.en },
                { icon: "⭐", label: lang === "ar" ? "التقييم"          : "Rating",   val: `${shop.rating} / 5` },
                ...(shop.reviews > 0 ? [{ icon: "💬", label: lang === "ar" ? "عدد التقييمات" : "Reviews", val: String(shop.reviews) }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: accentMuted, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{row.icon}</div>
                  <span style={{ fontSize: 13, color: textSec, width: 108, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: textPri, fontWeight: 600 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: textTer, margin: 0, textTransform: "uppercase", letterSpacing: ".07em" }}>
                {lang === "ar" ? "آراء العملاء" : "Customer Reviews"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: textPri }}>{shop.rating}</span>
                <div>
                  <div style={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < Math.round(shop.rating) ? "#6E7F77" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 11 }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: textTer }}>{shop.reviews} {tr.reviewUnit}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {extras.reviews.map((rev, i) => (
                <div key={i} style={{ paddingBottom: i < extras.reviews.length - 1 ? 14 : 0, borderBottom: i < extras.reviews.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: accentMuted, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: accent, flexShrink: 0 }}>
                      {(lang === "ar" ? rev.nameAr : rev.name)[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: textPri }}>{lang === "ar" ? rev.nameAr : rev.name}</div>
                      <div style={{ display: "flex", gap: 3, alignItems: "center", marginTop: 2 }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span key={j} style={{ color: j < rev.rating ? "#6E7F77" : (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)"), fontSize: 10 }}>★</span>
                        ))}
                        <span style={{ fontSize: 11, color: textTer, marginInlineStart: 4 }}>{rev.date}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: textSec, lineHeight: 1.68, margin: 0, paddingInlineStart: 44 }}>
                    {lang === "ar" ? rev.textAr : rev.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar shops */}
          {SHOPS.filter(s => s.category === shop.category && s.id !== shop.id).length > 0 && (
            <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "18px 20px" }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: textTer, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: ".07em" }}>
                {lang === "ar" ? "ورش مشابهة" : "Similar Workshops"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {SHOPS.filter(s => s.category === shop.category && s.id !== shop.id).slice(0, 3).map(s => {
                  const sc = CATEGORIES.find(c => c.id === s.category);
                  const sRgb = hexRgb(sc?.accent ?? "#214E4F");
                  return (
                    <Link key={s.id} href={`/shop/${s.id}`} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "11px 13px",
                      borderRadius: 12, border: `1px solid ${border}`, textDecoration: "none",
                      transition: "all .15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accentBorder; (e.currentTarget as HTMLAnchorElement).style.background = accentHover; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = border; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: `rgba(${sRgb},.1)`, border: `1px solid rgba(${sRgb},.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                        {sc?.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: textPri, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: textTer }}>📍 {s.area[lang]}</div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: accent, flexShrink: 0 }}>★ {s.rating}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── Sticky CTA bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: isDark ? "rgba(15,20,20,.97)" : "rgba(250,247,242,.97)",
        borderTop: `1px solid ${border}`,
        backdropFilter: "blur(20px)",
        padding: "12px 20px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 10 }}>
          {/* Message button */}
          <Link href={`/chat?shop=${shop.id}`} style={{
            flex: 1, padding: "13px 0", borderRadius: 12,
            background: accent, color: "#fff",
            fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "block",
            boxShadow: `0 4px 18px rgba(33,78,79,.28)`,
            transition: "opacity .15s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.87"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
          >
            💬 {lang === "ar" ? "تواصل مع الورشة" : "Message this shop"}
          </Link>

          {/* Send photos — native <a> so mailto works reliably */}
          <a
            href={`mailto:Warsha.Finder@gmail.com?subject=${encodeURIComponent(`Shop Photos — ${shop.name}`)}&body=${encodeURIComponent(lang === "ar" ? `السلام عليكم،\n\nأريد إرسال صور ورشتي:\n\nاسم الورشة: ${shop.name}\nالمنطقة: ${shop.area.ar}\n\nبرجاء إضافة الصور لصفحة الورشة على وَرْشة.\n\nشكراً` : `Hello,\n\nI'd like to send photos for my workshop:\n\nShop name: ${shop.name}\nArea: ${shop.area.en}\n\nPlease add them to the shop page on Warsha.\n\nThank you`)}`}
            style={{
              padding: "13px 16px", borderRadius: 12, flexShrink: 0,
              background: "transparent", border: `1px solid ${border}`,
              color: textSec, fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
              transition: "all .15s", whiteSpace: "nowrap",
              textDecoration: "none",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accentBorder; (e.currentTarget as HTMLAnchorElement).style.color = accent; (e.currentTarget as HTMLAnchorElement).style.background = accentMuted; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = border; (e.currentTarget as HTMLAnchorElement).style.color = textSec; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            📷 {lang === "ar" ? "إرسال صور" : "Send photos"}
          </a>
        </div>
      </div>

      <footer style={{ padding: "20px", textAlign: "center", fontSize: 12, color: textTer, borderTop: `1px solid ${border}` }}>
        {tr.footerCopy}
      </footer>

      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
