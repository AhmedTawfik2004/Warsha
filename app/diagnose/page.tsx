"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { CATEGORIES, SHOPS, type Lang } from "../lib/translations";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTheme((localStorage.getItem("warsha-theme") as any) || "dark");
    setLang((localStorage.getItem("warsha-lang") as any) || "ar");
    setMounted(true);
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

type DiagResult = {
  category: string;
  urgency: "safe" | "caution" | "stop";
  diagnosis_ar: string;
  diagnosis_en: string;
  cost_ar: string;
  cost_en: string;
};

const PROBLEM_MAP: { keywords_ar: string[]; keywords_en: string[]; result: DiagResult }[] = [
  {
    keywords_en: ["ac", "a/c", "air con", "not cooling", "hot inside", "no cold", "air conditioning"],
    keywords_ar: ["تكييف", "مش بيبرد", "حار جوه", "فريون", "كمبروسور", "مفيش تبريد", "سخن جوه"],
    result: { category: "car_ac", urgency: "safe",
      diagnosis_ar: "على الأرجح مشكلة في شحن الفريون أو الكمبروسور. ممكن يكون فيه تسريب في دائرة التكييف أو الكمبروسور محتاج صيانة.",
      diagnosis_en: "Most likely a refrigerant (freon) recharge issue or a faulty compressor. There may be a leak in the A/C circuit.",
      cost_ar: "تكلفة متوقعة: ٤٠٠ – ١٢٠٠ جنيه", cost_en: "Estimated cost: 400 – 1,200 EGP" },
  },
  {
    keywords_en: ["overheat", "temperature", "hot engine", "smoke", "steam", "boiling", "coolant"],
    keywords_ar: ["سخن المحرك", "درجة حرارة", "دخان", "بخار", "تبريد", "راديتير", "ماية سخنة", "بيسخن"],
    result: { category: "mechanical", urgency: "stop",
      diagnosis_ar: "تحذير: المحرك يسخن — ايقف السيارة فوراً. السبب على الأرجح تسريب في سائل التبريد أو الراديتير أو التيرموستات.",
      diagnosis_en: "Warning: Engine overheating — stop the car immediately. Likely cause is a coolant leak, faulty radiator, or thermostat issue.",
      cost_ar: "تكلفة متوقعة: ٨٠٠ – ٣٠٠٠ جنيه حسب السبب", cost_en: "Estimated cost: 800 – 3,000 EGP depending on cause" },
  },
  {
    keywords_en: ["tyre", "tire", "flat", "puncture", "wheel", "rim", "alignment", "balance"],
    keywords_ar: ["إطار", "عجلة", "واطي", "ثقب", "جنط", "ضبط زوايا", "موازنة", "بالون"],
    result: { category: "tires", urgency: "caution",
      diagnosis_ar: "مشكلة في الإطارات — ممكن ثقب أو إطار بالي أو محتاج ضبط زوايا وموازنة.",
      diagnosis_en: "Tyre issue — possible puncture, worn tyre, or wheel alignment and balancing needed.",
      cost_ar: "تكلفة متوقعة: ٥٠ – ٢٥٠٠ جنيه حسب الخدمة", cost_en: "Estimated cost: 50 – 2,500 EGP depending on service" },
  },
  {
    keywords_en: ["brake", "grinding", "squeaking", "stopping", "brake pad", "abs"],
    keywords_ar: ["فرامل", "صوت عند الوقوف", "مش بتوقف", "طقطقة في الفرامل", "abs", "كاليبر"],
    result: { category: "mechanical", urgency: "stop",
      diagnosis_ar: "تحذير: مشكلة في الفرامل خطيرة. صوت الطحن يعني تآكل تيل الفرامل. اتجه للورشة فوراً.",
      diagnosis_en: "Warning: Brake issue is dangerous. Grinding noise means worn brake pads. Go to a workshop immediately.",
      cost_ar: "تكلفة متوقعة: ٦٠٠ – ٢٠٠٠ جنيه", cost_en: "Estimated cost: 600 – 2,000 EGP" },
  },
  {
    keywords_en: ["battery", "won't start", "dead", "electric", "wiring", "lights not working", "starter"],
    keywords_ar: ["بطارية", "مش بيشتغل", "كهرباء", "أسلاك", "ضوء مش شغال", "استارتر", "مش بتشتعل"],
    result: { category: "auto_electric", urgency: "caution",
      diagnosis_ar: "على الأرجح مشكلة في البطارية أو الكهرباء. ممكن البطارية فاضت أو فيه مشكلة في الاستارتر أو الأسلاك.",
      diagnosis_en: "Likely a battery or electrical issue. The battery may be dead or there's a fault in the starter or wiring.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ١٨٠٠ جنيه", cost_en: "Estimated cost: 300 – 1,800 EGP" },
  },
  {
    keywords_en: ["glass", "windscreen", "windshield", "crack", "chip", "broken window"],
    keywords_ar: ["زجاج", "شرخ", "كسر", "ونيت", "شبورة", "زجاجة"],
    result: { category: "glass_repair", urgency: "caution",
      diagnosis_ar: "شرخ في الزجاج الأمامي. لو صغير ممكن يتصلح بدون استبدال. لو كبير لازم تغيير.",
      diagnosis_en: "Windscreen crack. If small it may be repairable without replacement. Large cracks require full replacement.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ٤٠٠٠ جنيه حسب الحجم", cost_en: "Estimated cost: 300 – 4,000 EGP depending on size" },
  },
  {
    keywords_en: ["oil", "oil change", "oil leak", "engine oil", "filter"],
    keywords_ar: ["زيت", "تغيير زيت", "تسريب زيت", "زيت المحرك", "فلتر"],
    result: { category: "mechanical", urgency: "caution",
      diagnosis_ar: "محتاج تغيير زيت أو فيه تسريب. زيت المحرك المتسخ أو المنخفض ممكن يتلف المحرك على المدى الطويل.",
      diagnosis_en: "Needs an oil change or there's an oil leak. Dirty or low engine oil can damage the engine long-term.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ٨٠٠ جنيه", cost_en: "Estimated cost: 300 – 800 EGP" },
  },
  {
    keywords_en: ["scratch", "dent", "paint", "body", "bumper", "respray", "wrap"],
    keywords_ar: ["خدش", "دهان", "بوية", "تغليف", "شنبر", "هيكل", "كبوت"],
    result: { category: "paint_wrap", urgency: "safe",
      diagnosis_ar: "ضرر في هيكل السيارة أو الطلاء. ممكن يكون خدش سطحي أو دهان أو تغليف حسب الحالة.",
      diagnosis_en: "Body or paint damage. Could be a surface scratch, full repaint, or wrap job depending on severity.",
      cost_ar: "تكلفة متوقعة: ٢٠٠ – ٢٠٠٠٠ جنيه حسب الخدمة", cost_en: "Estimated cost: 200 – 20,000 EGP depending on service" },
  },
  {
    keywords_en: ["check engine", "warning light", "fault code", "obd", "scan", "diagnostic"],
    keywords_ar: ["لمبة", "ضوء أحمر", "فحص", "كود خطأ", "دياجنوستيك", "obd", "تشيك"],
    result: { category: "diagnostics", urgency: "caution",
      diagnosis_ar: "ضوء تحذير مضيء — محتاج فحص كمبيوتر لمعرفة كود الخطأ. ممكن مشكلة بسيطة أو تحتاج انتباه.",
      diagnosis_en: "Warning light is on — needs a computer diagnostic scan to read the fault code. Could be minor or need attention.",
      cost_ar: "تكلفة متوقعة: ٢٠٠ – ٥٠٠ جنيه للفحص", cost_en: "Estimated cost: 200 – 500 EGP for diagnostic scan" },
  },
];

function diagnose(input: string, lang: Lang): DiagResult | null {
  const q = input.toLowerCase();
  for (const entry of PROBLEM_MAP) {
    const keywords = lang === "ar"
      ? [...entry.keywords_ar, ...entry.keywords_en]
      : [...entry.keywords_en, ...entry.keywords_ar];
    if (keywords.some(k => q.includes(k))) return entry.result;
  }
  return null;
}

function DiagnoseInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const searchParams = useSearchParams();

  const [input, setInput] = useState("");
  const [result, setResult] = useState<DiagResult | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setInput(q);
  }, [searchParams]);

  if (!mounted) return null;

  function handleDiagnose() {
    if (!input.trim()) return;
    setResult(diagnose(input, lang));
    setSearched(true);
  }

  const suggestions = lang === "ar"
    ? ["التكييف مش بيبرد", "المحرك بيسخن", "صوت في الفرامل", "البطارية ماتت", "شرخ في الزجاج", "لمبة تحذير اضاءت", "محتاج تغيير زيت"]
    : ["AC not cooling", "Engine overheating", "Grinding brakes", "Battery dead", "Cracked windscreen", "Check engine light", "Need oil change"];

  const urgencyConfig = {
    safe:    { color: "#10B981", icon: "✅", ar: "آمن للقيادة",      en: "Safe to drive" },
    caution: { color: "#F59E0B", icon: "⚠️", ar: "تعامل بحذر",       en: "Drive with caution" },
    stop:    { color: "#EF4444", icon: "🛑", ar: "لا تقود السيارة", en: "Do not drive" },
  };

  const matchedCat = result ? CATEGORIES.find(c => c.id === result.category) : null;
  const matchedShops = result ? SHOPS.filter(s => s.category === result.category).slice(0, 3) : [];

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-primary)" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* Header */}
      <section style={{ padding: "32px 24px 28px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)", textDecoration: "none", marginBottom: 16 }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
          >
            {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🔍</div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                {lang === "ar" ? "تشخيص مشكلة سيارتك" : "Diagnose your car problem"}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>
                {lang === "ar" ? "اوصف المشكلة وهنحدد الورشة المناسبة والتكلفة المتوقعة" : "Describe the problem and we'll find the right workshop and estimated cost"}
              </p>
            </div>
          </div>

          {/* Search input */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", border: "1.5px solid var(--border-strong)" }}>
              <input
                type="text" value={input}
                onChange={e => { setInput(e.target.value); setSearched(false); }}
                onKeyDown={e => e.key === "Enter" && handleDiagnose()}
                placeholder={lang === "ar" ? "مثلاً: التكييف مش بيبرد، المحرك بيسخن..." : "e.g. AC not cooling, engine overheating..."}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 14, fontFamily: "inherit", direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}
              />
            </div>
            <button onClick={handleDiagnose} className="warsha-btn-primary"
              style={{ padding: "0 24px", fontSize: 14, fontFamily: "inherit", flexShrink: 0 }}>
              {lang === "ar" ? "تشخيص" : "Diagnose"}
            </button>
          </div>

          {/* Suggestion pills */}
          {!searched && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); setSearched(false); }} style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 12,
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  cursor: "pointer", fontFamily: "inherit", color: "var(--text-secondary)", transition: "all .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
                >{s}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: "28px 24px 60px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* No match */}
          {searched && !result && (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                {lang === "ar" ? "مش قادرين نتعرف على المشكلة" : "Couldn't identify the problem"}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "0 0 20px" }}>
                {lang === "ar" ? "جرب تكتب أكتر تفاصيل أو تصفح الورش مباشرة" : "Try adding more details or browse workshops directly"}
              </p>
              <Link href="/workshops" className="warsha-btn-primary" style={{ display: "inline-block", padding: "10px 24px", fontSize: 13, textDecoration: "none", fontFamily: "inherit" }}>
                {lang === "ar" ? "تصفح كل الورش" : "Browse all workshops"}
              </Link>
            </div>
          )}

          {/* Match found */}
          {result && matchedCat && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Diagnosis card */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", background: `${matchedCat.accent}12`, borderBottom: `1px solid ${matchedCat.accent}25`, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: `${matchedCat.accent}20`, border: `1px solid ${matchedCat.accent}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {matchedCat.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                      {lang === "ar" ? "التخصص المطلوب" : "Specialist needed"}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: matchedCat.accent, margin: 0 }}>
                      {lang === "ar" ? matchedCat.ar : matchedCat.en}
                    </p>
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  {(() => {
                    const u = urgencyConfig[result.urgency];
                    return (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, marginBottom: 16, background: `${u.color}12`, border: `1px solid ${u.color}30` }}>
                        <span>{u.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: u.color }}>{lang === "ar" ? u.ar : u.en}</span>
                      </div>
                    );
                  })()}

                  <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.75, margin: "0 0 16px" }}>
                    {lang === "ar" ? result.diagnosis_ar : result.diagnosis_en}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 20 }}>💰</span>
                    <div>
                      <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: "0 0 2px" }}>{lang === "ar" ? "تكلفة إصلاح متوقعة" : "Estimated repair cost"}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                        {lang === "ar" ? result.cost_ar : result.cost_en}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended shops */}
              {matchedShops.length > 0 && (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                    {lang === "ar" ? "ورش متخصصة قريبة منك" : "Specialist workshops near you"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {matchedShops.map(shop => {
                      const rgb = hexRgb(matchedCat.accent);
                      return (
                        <Link key={shop.id} href={`/shop/${shop.id}`} style={{
                          display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                          borderRadius: "var(--radius-lg)", background: "var(--bg-card)",
                          border: "1px solid var(--border)", textDecoration: "none", transition: "all .15s",
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(${rgb},.4)`; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
                        >
                          <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.22)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                            {matchedCat.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{shop.name}</div>
                            <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>📍 {shop.area[lang]}</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                              <span style={{ color: "#F59E0B" }}>★</span> {shop.rating}
                            </div>
                            {shop.phone && (
                              <button onClick={e => { e.preventDefault(); window.open(`https://wa.me/${shop.phone!.replace(/\D/g,"")}`, "_blank"); }}
                                style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#25D36618", border: "1px solid #25D36640", color: "#25D366", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                                WhatsApp
                              </button>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link href={`/workshops?cat=${result.category}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                    {lang === "ar" ? "عرض كل الورش المتخصصة ←" : "View all specialist workshops →"}
                  </Link>
                </div>
              )}

              <p style={{ fontSize: 11, color: "var(--text-tertiary)", textAlign: "center", padding: "8px 0" }}>
                {lang === "ar" ? "⚠️ هذا تشخيص تقريبي — استشر متخصص قبل أي إصلاح" : "⚠️ This is an approximate diagnosis — consult a specialist before any repair"}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!searched && (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-tertiary)" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🚗</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                {lang === "ar" ? "إيه المشكلة اللي بتواجهها؟" : "What problem are you facing?"}
              </p>
              <p style={{ fontSize: 13, margin: 0 }}>
                {lang === "ar" ? "اختار من الاقتراحات فوق أو اكتب المشكلة بكلامك" : "Pick from the suggestions above or describe the problem in your own words"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <DiagnoseInner />
    </Suspense>
  );
}