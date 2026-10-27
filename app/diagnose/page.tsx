"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { CATEGORIES, SHOPS, type Lang } from "../lib/translations";

// ─── theme hook ───────────────────────────────────────────────────────────────
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

// ─── diagnostic data ───────────────────────────────────────────────────────────
type Urgency = "safe" | "caution" | "stop";
type DiagResult = {
  category: string;
  urgency: Urgency;
  diagnosis_ar: string;
  diagnosis_en: string;
  cost_ar: string;
  cost_en: string;
};

const PROBLEM_MAP: { keywords_ar: string[]; keywords_en: string[]; result: DiagResult }[] = [
  {
    keywords_ar: ["تكييف", "مش بيبرد", "حار جوه", "فريون", "كمبروسور", "مفيش تبريد", "سخن جوه", "بيبرد شوية", "ضعيف التبريد", "الهواء سخن", "مكيف", "تبريد ضعيف", "ريح دافية", "مافيش برد"],
    keywords_en: ["ac", "a/c", "air con", "not cooling", "hot inside", "no cold", "air conditioning", "warm air", "blowing hot", "weak cooling", "refrigerant", "compressor", "hvac", "climate"],
    result: {
      category: "car_ac", urgency: "safe",
      diagnosis_ar: "على الأرجح مشكلة في شحن الفريون أو الكمبروسور. ممكن يكون فيه تسريب في دائرة التكييف أو الكمبروسور محتاج صيانة. التكييف الضعيف كمان ممكن يكون من فلتر الهواء المسدود.",
      diagnosis_en: "Most likely a refrigerant (freon) recharge issue or a faulty compressor. There may be a leak in the A/C circuit, or a blocked cabin air filter causing weak airflow.",
      cost_ar: "تكلفة متوقعة: ٤٠٠ – ١٢٠٠ جنيه", cost_en: "Estimated cost: 400 – 1,200 EGP",
    },
  },
  {
    keywords_ar: ["سخن المحرك", "درجة حرارة عالية", "دخان", "بخار", "تبريد", "راديتير", "ماية سخنة", "بيسخن", "ترمستات", "مياه التبريد", "حرارة زيادة", "بيسخن أوي", "عقرب الحرارة", "بيغلي"],
    keywords_en: ["overheat", "temperature", "hot engine", "smoke", "steam", "boiling", "coolant", "radiator", "thermostat", "overheating", "engine hot", "temperature gauge", "water pump", "red temp"],
    result: {
      category: "mechanical", urgency: "stop",
      diagnosis_ar: "تحذير: المحرك يسخن — ايقف السيارة فوراً وانتظر حتى تبرد. السبب على الأرجح تسريب في سائل التبريد أو الراديتير أو الترموستات. استمرار القيادة يمكن أن يتلف المحرك تماماً.",
      diagnosis_en: "Warning: Engine overheating — stop the car immediately and wait for it to cool. Likely cause: coolant leak, faulty radiator, or thermostat. Continuing to drive can destroy the engine.",
      cost_ar: "تكلفة متوقعة: ٨٠٠ – ٣٠٠٠ جنيه حسب السبب", cost_en: "Estimated cost: 800 – 3,000 EGP depending on cause",
    },
  },
  {
    keywords_ar: ["طقطقة", "صوت في المحرك", "دقدقة", "طرقعة", "صوت من تحت", "طقطق", "صوت غريب", "صوت عند الإشتغال", "صوت المحرك", "صوت خبط", "خربشة", "حاجة بتدق", "صوت ضربات"],
    keywords_en: ["knocking", "knock", "ticking", "rattling", "rattle", "clunking", "clunk", "engine noise", "tapping", "banging", "thudding", "engine sound", "strange noise", "noise from engine", "engine knock"],
    result: {
      category: "mechanical", urgency: "caution",
      diagnosis_ar: "صوت الطقطقة أو الدقدقة في المحرك ممكن يكون من: زيت منخفض، تيمنج مشكلة، برينجات محرك بالية، أو صمامات محتاجة ضبط. لو الصوت قوي أو مع دخان — وقف فوراً.",
      diagnosis_en: "Knocking or ticking sounds from the engine could indicate: low oil, timing issue, worn engine bearings, or valves needing adjustment. If the knock is loud or comes with smoke — stop immediately.",
      cost_ar: "تكلفة متوقعة: ٤٠٠ – ٥٠٠٠ جنيه حسب السبب", cost_en: "Estimated cost: 400 – 5,000 EGP depending on cause",
    },
  },
  {
    keywords_ar: ["إطار", "عجلة", "واطي", "ثقب", "جنط", "ضبط زوايا", "موازنة", "بالون", "بانشر", "عجلة واطية", "الإطار تالف", "جنط مكسور", "الدواليب", "الكاوتش", "تاير", "انتفاخ في الإطار"],
    keywords_en: ["tyre", "tire", "flat", "puncture", "wheel", "rim", "alignment", "balance", "blowout", "flat tyre", "worn tyre", "bald tyre", "tyre pressure", "sidewall", "rubber", "wobble"],
    result: {
      category: "tires", urgency: "caution",
      diagnosis_ar: "مشكلة في الإطارات — ممكن ثقب أو إطار بالي أو محتاج ضبط زوايا وموازنة. الإطار الواطي خطر على الطريق السريع.",
      diagnosis_en: "Tyre issue — possible puncture, worn tyre, or wheel alignment and balancing needed. A flat tyre is dangerous at high speed.",
      cost_ar: "تكلفة متوقعة: ٥٠ – ٢٥٠٠ جنيه حسب الخدمة", cost_en: "Estimated cost: 50 – 2,500 EGP depending on service",
    },
  },
  {
    keywords_ar: ["فرامل", "صوت عند الوقوف", "مش بتوقف", "طقطقة في الفرامل", "abs", "كاليبر", "تيل الفرامل", "الفرامل شايلة", "الفرامل ضعيفة", "صرير عند الوقوف", "مش بيقف كويس", "البيدال ناعم", "الفرامل سخنة", "هاند بريك"],
    keywords_en: ["brake", "grinding", "squeaking", "stopping", "brake pad", "abs", "brakes", "brake noise", "soft brake", "brake pedal", "won't stop", "braking", "squeal", "caliper", "disc brake", "handbrake"],
    result: {
      category: "mechanical", urgency: "stop",
      diagnosis_ar: "تحذير: مشكلة في الفرامل — خطيرة جداً. صوت الطحن يعني تآكل التيل وصل للحديد. توجه للورشة فوراً ولا تسافر على الطريق السريع.",
      diagnosis_en: "Warning: Brake issue — very dangerous. Grinding means the brake pads are worn down to metal. Go to a workshop immediately, do not use the highway.",
      cost_ar: "تكلفة متوقعة: ٦٠٠ – ٢٠٠٠ جنيه", cost_en: "Estimated cost: 600 – 2,000 EGP",
    },
  },
  {
    keywords_ar: ["بطارية", "مش بيشتغل", "كهرباء", "أسلاك", "ضوء مش شغال", "استارتر", "مش بتشتعل", "كهرباء باظت", "الشمعات", "السلك محروق", "الشمعة", "ولا بيشتغل", "مفيش كهرباء", "البطارية فضيت", "الإضاءة ضعيفة"],
    keywords_en: ["battery", "won't start", "dead", "electric", "wiring", "lights not working", "starter", "no power", "electrical", "spark plug", "ignition", "fuse", "alternator", "no crank", "dead battery", "dim lights"],
    result: {
      category: "auto_electric", urgency: "caution",
      diagnosis_ar: "على الأرجح مشكلة في البطارية أو الكهرباء. ممكن البطارية فرغت أو فيه مشكلة في الاستارتر أو الشمعات أو الأسلاك.",
      diagnosis_en: "Likely a battery or electrical issue. The battery may be dead or there's a fault in the starter, spark plugs, or wiring.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ١٨٠٠ جنيه", cost_en: "Estimated cost: 300 – 1,800 EGP",
    },
  },
  {
    keywords_ar: ["زجاج", "شرخ", "كسر", "ونيت", "شبورة", "زجاجة", "الزجاج الأمامي", "الشباك مكسور", "تشقق الزجاج", "ونيت متشقق", "ستارة", "جانبي مكسور", "حجر على الزجاج"],
    keywords_en: ["glass", "windscreen", "windshield", "crack", "chip", "broken window", "cracked windscreen", "window broken", "shattered", "stone chip", "side window", "rear window", "cracked glass"],
    result: {
      category: "glass_repair", urgency: "caution",
      diagnosis_ar: "شرخ أو كسر في الزجاج. لو الشرخ صغير ممكن يتصلح. لو الشرخ كبير أو الزجاج مكسور لازم تغيير كامل.",
      diagnosis_en: "Windscreen crack or break. Small chips may be repairable. Large cracks or shattered glass require full replacement.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ٤٠٠٠ جنيه حسب الحجم", cost_en: "Estimated cost: 300 – 4,000 EGP depending on size",
    },
  },
  {
    keywords_ar: ["زيت", "تغيير زيت", "تسريب زيت", "زيت المحرك", "فلتر", "الزيت داكن", "نقص الزيت", "زيت محروق", "لون الزيت", "ميعاد الزيت", "لمبة الزيت مضيئة", "زيت في الماء"],
    keywords_en: ["oil", "oil change", "oil leak", "engine oil", "filter", "low oil", "dark oil", "oil burn", "oil level", "oil pressure", "oil light", "service due", "oil in coolant"],
    result: {
      category: "mechanical", urgency: "caution",
      diagnosis_ar: "محتاج تغيير زيت أو فيه تسريب. زيت المحرك المتسخ أو المنخفض ممكن يتلف المحرك على المدى البعيد.",
      diagnosis_en: "Needs an oil change or there's an oil leak. Dirty or low engine oil can cause long-term engine damage.",
      cost_ar: "تكلفة متوقعة: ٣٠٠ – ٨٠٠ جنيه", cost_en: "Estimated cost: 300 – 800 EGP",
    },
  },
  {
    keywords_ar: ["خدش", "دهان", "بوية", "تغليف", "شنبر", "هيكل", "كبوت", "صدمة", "سمكرة", "مهشوم", "مكسر", "حادثة", "بامبر", "الكبوت مكسور", "لون الدهان باظ", "تقشر الدهان"],
    keywords_en: ["scratch", "dent", "paint", "body", "bumper", "respray", "wrap", "bodywork", "panel", "collision", "crash", "smash", "fender", "hood", "dented", "peeling paint"],
    result: {
      category: "paint_wrap", urgency: "safe",
      diagnosis_ar: "ضرر في هيكل السيارة أو الطلاء. ممكن يكون خدش سطحي أو سمكرة أو دهان كامل حسب شدة الضرر.",
      diagnosis_en: "Body or paint damage. Could be a surface scratch, panel beating, full repaint, or wrap job depending on severity.",
      cost_ar: "تكلفة متوقعة: ٢٠٠ – ٢٠٠٠٠ جنيه حسب الخدمة", cost_en: "Estimated cost: 200 – 20,000 EGP depending on service",
    },
  },
  {
    keywords_ar: ["لمبة", "ضوء أحمر", "فحص", "كود خطأ", "دياجنوستيك", "obd", "تشيك", "check engine", "ضوء تحذير", "أيقونة على الداشبورد", "لمبة مضاءة", "رموز خطأ", "فحص الكمبيوتر", "عطل مجهول"],
    keywords_en: ["check engine", "warning light", "fault code", "obd", "scan", "diagnostic", "dashboard light", "engine light", "error code", "malfunction", "indicator", "service light", "ecu", "unknown fault"],
    result: {
      category: "diagnostics", urgency: "caution",
      diagnosis_ar: "ضوء تحذير مضيء على الداشبورد — محتاج فحص كمبيوتر لقراءة كود الخطأ. ممكن تكون مشكلة بسيطة أو تحتاج انتباه فوري.",
      diagnosis_en: "A warning light is on — needs a computer diagnostic scan to read the fault code. Could be minor or require immediate attention.",
      cost_ar: "تكلفة متوقعة: ٢٠٠ – ٥٠٠ جنيه للفحص", cost_en: "Estimated cost: 200 – 500 EGP for diagnostic scan",
    },
  },
  {
    keywords_ar: ["ناقل حركة", "فيتيس", "تعشيق", "صندوق سرعات", "مش بيدخل فيتيس", "فيتيس بيطلع", "الجير تقيل", "تيل الكلاتش", "كلاتش بالي", "صوت في الجير", "مش بيتحرك", "الكلاتش ضعيف"],
    keywords_en: ["gearbox", "transmission", "gear", "clutch", "won't shift", "slipping gear", "hard to shift", "grinding gear", "clutch slip", "gear noise", "won't move", "gear stuck", "automatic transmission"],
    result: {
      category: "mechanical", urgency: "caution",
      diagnosis_ar: "مشكلة في ناقل الحركة أو الكلاتش. ممكن يكون الكلاتش بالي أو فيه مشكلة في الجيربوكس. لو السيارة مش بتتحرك — لا تكمل القيادة.",
      diagnosis_en: "Gearbox or clutch issue. Could be a worn clutch or a gearbox fault. If the car won't move — do not continue driving.",
      cost_ar: "تكلفة متوقعة: ١٠٠٠ – ٨٠٠٠ جنيه حسب النوع", cost_en: "Estimated cost: 1,000 – 8,000 EGP depending on type",
    },
  },
  {
    keywords_ar: ["تعليق", "هزة", "اهتزاز", "شاصي", "صوت تخطي مطب", "ضرب في الشاصي", "الهيكل بيتحرك", "صدمات", "بليات", "العجلة بترتجف", "اهتزاز عند السرعة", "المقود بيهز"],
    keywords_en: ["suspension", "vibration", "shake", "shaking", "bumpy", "rough ride", "shock absorber", "strut", "spring", "steering wheel shake", "vibrates at speed", "bounce", "clunk over bumps"],
    result: {
      category: "mechanical", urgency: "caution",
      diagnosis_ar: "مشكلة في التعليق أو الصدمات. ممكن يكون صدام بالي أو بليات تالفة. الاهتزاز عند السرعة ممكن يكون من موازنة العجلات.",
      diagnosis_en: "Suspension or shock absorber issue. Could be worn shocks or damaged ball joints. Vibration at speed may be wheel balancing.",
      cost_ar: "تكلفة متوقعة: ٥٠٠ – ٣٠٠٠ جنيه", cost_en: "Estimated cost: 500 – 3,000 EGP",
    },
  },
];

function diagnoseScored(input: string, lang: Lang): { result: DiagResult; confidence: "high" | "medium" | "low" } | null {
  const q = input.toLowerCase();
  let best: { result: DiagResult; score: number } | null = null;
  for (const entry of PROBLEM_MAP) {
    const primary   = lang === "ar" ? entry.keywords_ar : entry.keywords_en;
    const secondary = lang === "ar" ? entry.keywords_en : entry.keywords_ar;
    let score = 0;
    for (const k of primary)   if (q.includes(k)) score += 2;
    for (const k of secondary) if (q.includes(k)) score += 1;
    if (score > 0 && (!best || score > best.score)) best = { result: entry.result, score };
  }
  if (!best) return null;
  const confidence = best.score >= 4 ? "high" : best.score >= 2 ? "medium" : "low";
  return { result: best.result, confidence };
}

const URGENCY = {
  safe:    { color: "#10B981", icon: "✅", ar: "آمن للقيادة",      en: "Safe to drive" },
  caution: { color: "#F59E0B", icon: "⚠️", ar: "تعامل بحذر",       en: "Drive with caution" },
  stop:    { color: "#EF4444", icon: "🛑", ar: "لا تقود السيارة", en: "Do not drive" },
};
const CONFIDENCE = {
  high:   { ar: "تشخيص دقيق",  en: "High confidence" },
  medium: { ar: "تشخيص محتمل", en: "Likely match" },
  low:    { ar: "تشخيص جزئي",  en: "Partial match" },
};

// ─── Car Parts Database ────────────────────────────────────────────────────────
// Prices are real Egyptian market averages (EGP) as of 2024-2025.
// Sources: local spare parts shops in Cairo, El-Geish St Heliopolis market,
// Wekalet el-Birka (Ataba), and comparison across Jumia Egypt / OLX listings.
// Prices vary by brand tier: local/aftermarket vs. genuine OEM vs. imported.

type PartTier = "local" | "oem" | "imported";
type PartCategory =
  | "engine"
  | "brakes"
  | "suspension"
  | "electrical"
  | "ac"
  | "filters_fluids"
  | "transmission"
  | "exhaust"
  | "body_glass";

type CarPart = {
  id: string;
  name_ar: string;
  name_en: string;
  category: PartCategory;
  // Price ranges in EGP: [min, max] for each tier (null if not commonly available)
  price_local: [number, number] | null;   // Egyptian / Chinese aftermarket
  price_oem:   [number, number] | null;   // OEM or genuine brand parts
  price_imported: [number, number] | null; // European / Japanese imported
  note_ar?: string;
  note_en?: string;
};

const PARTS_DB: CarPart[] = [
  // ── ENGINE ──────────────────────────────────────────────────────────────────
  {
    id: "engine-sparkplug",
    name_ar: "شمعة الإشعال", name_en: "Spark Plug",
    category: "engine",
    price_local: [30, 80], price_oem: [80, 200], price_imported: [150, 400],
    note_ar: "السعر لشمعة واحدة — معظم السيارات ٤ شمعات", note_en: "Price per plug — most cars need 4",
  },
  {
    id: "engine-oilfilter",
    name_ar: "فلتر الزيت", name_en: "Oil Filter",
    category: "engine",
    price_local: [40, 90], price_oem: [90, 200], price_imported: [150, 350],
    note_ar: "يتغير مع كل تغيير زيت", note_en: "Changed with every oil service",
  },
  {
    id: "engine-timingbelt",
    name_ar: "سير التوقيت", name_en: "Timing Belt",
    category: "engine",
    price_local: [300, 600], price_oem: [700, 1800], price_imported: [1500, 3500],
    note_ar: "لازم يتغير كل ٦٠,٠٠٠ – ٩٠,٠٠٠ كم", note_en: "Replace every 60,000 – 90,000 km",
  },
  {
    id: "engine-timingchain",
    name_ar: "سلسلة التوقيت", name_en: "Timing Chain Kit",
    category: "engine",
    price_local: [1200, 2500], price_oem: [3000, 7000], price_imported: [5000, 12000],
    note_ar: "يشمل الجيت والتنشنر", note_en: "Includes guides and tensioner",
  },
  {
    id: "engine-waterpump",
    name_ar: "طرمبة الماء", name_en: "Water Pump",
    category: "engine",
    price_local: [350, 700], price_oem: [800, 2000], price_imported: [1500, 4000],
  },
  {
    id: "engine-thermostat",
    name_ar: "ترموستات", name_en: "Thermostat",
    category: "engine",
    price_local: [80, 200], price_oem: [250, 600], price_imported: [400, 1200],
  },
  {
    id: "engine-radiator",
    name_ar: "رادياتير التبريد", name_en: "Radiator",
    category: "engine",
    price_local: [700, 1500], price_oem: [2000, 5000], price_imported: [4000, 10000],
  },
  {
    id: "engine-enginemount",
    name_ar: "كاوتش المحرك (ماونت)", name_en: "Engine Mount",
    category: "engine",
    price_local: [200, 450], price_oem: [500, 1200], price_imported: [900, 2500],
    note_ar: "للسيارة ٢–٤ ماونتات", note_en: "Cars typically have 2–4 mounts",
  },
  {
    id: "engine-headgasket",
    name_ar: "جوانة رأس السيلندر", name_en: "Head Gasket",
    category: "engine",
    price_local: [400, 900], price_oem: [1200, 3000], price_imported: [2500, 6000],
    note_ar: "أشغال التركيب ٢٠٠٠–٦٠٠٠ جنيه إضافية", note_en: "Labor to fit adds 2,000–6,000 EGP",
  },
  {
    id: "engine-fuelfilter",
    name_ar: "فلتر البنزين", name_en: "Fuel Filter",
    category: "engine",
    price_local: [80, 200], price_oem: [200, 500], price_imported: [350, 900],
  },
  {
    id: "engine-airfilter",
    name_ar: "فلتر الهواء", name_en: "Air Filter",
    category: "engine",
    price_local: [60, 150], price_oem: [150, 400], price_imported: [300, 700],
  },
  {
    id: "engine-ignitioncoil",
    name_ar: "كويل الإشعال", name_en: "Ignition Coil",
    category: "engine",
    price_local: [200, 500], price_oem: [500, 1500], price_imported: [900, 3000],
    note_ar: "السعر لكويل واحد", note_en: "Price per coil",
  },
  {
    id: "engine-enginebearing",
    name_ar: "برينجات المحرك (طقم)", name_en: "Engine Bearing Set",
    category: "engine",
    price_local: [600, 1500], price_oem: [1800, 4500], price_imported: [3000, 8000],
  },
  // ── BRAKES ──────────────────────────────────────────────────────────────────
  {
    id: "brakes-pads-front",
    name_ar: "تيل الفرامل الأمامي (طقم)", name_en: "Front Brake Pads (Set)",
    category: "brakes",
    price_local: [200, 500], price_oem: [500, 1200], price_imported: [900, 2500],
    note_ar: "طقم = ٤ قطع للمحور الأمامي", note_en: "Set = 4 pads for front axle",
  },
  {
    id: "brakes-pads-rear",
    name_ar: "تيل الفرامل الخلفي (طقم)", name_en: "Rear Brake Pads (Set)",
    category: "brakes",
    price_local: [180, 450], price_oem: [450, 1100], price_imported: [800, 2200],
  },
  {
    id: "brakes-disc-front",
    name_ar: "قرص الفرامل الأمامي", name_en: "Front Brake Disc (each)",
    category: "brakes",
    price_local: [300, 700], price_oem: [700, 1800], price_imported: [1200, 3500],
    note_ar: "السعر لقرص واحد — الأمامي ٢ قرص", note_en: "Price per disc — front has 2 discs",
  },
  {
    id: "brakes-disc-rear",
    name_ar: "قرص الفرامل الخلفي", name_en: "Rear Brake Disc (each)",
    category: "brakes",
    price_local: [280, 650], price_oem: [650, 1600], price_imported: [1100, 3000],
  },
  {
    id: "brakes-caliper",
    name_ar: "كاليبر الفرامل", name_en: "Brake Caliper",
    category: "brakes",
    price_local: [500, 1200], price_oem: [1200, 3000], price_imported: [2000, 6000],
    note_ar: "السعر لكاليبر واحد", note_en: "Price per caliper",
  },
  {
    id: "brakes-mastercylinder",
    name_ar: "ماستر سيلندر الفرامل", name_en: "Brake Master Cylinder",
    category: "brakes",
    price_local: [400, 900], price_oem: [900, 2500], price_imported: [1800, 5000],
  },
  {
    id: "brakes-abs-sensor",
    name_ar: "سنسور ABS", name_en: "ABS Wheel Speed Sensor",
    category: "brakes",
    price_local: [200, 500], price_oem: [500, 1500], price_imported: [900, 3000],
    note_ar: "السعر لسنسور واحد", note_en: "Price per sensor",
  },
  // ── SUSPENSION ──────────────────────────────────────────────────────────────
  {
    id: "susp-shockfront",
    name_ar: "صدام أمامي", name_en: "Front Shock Absorber (each)",
    category: "suspension",
    price_local: [400, 900], price_oem: [1000, 3000], price_imported: [2000, 6000],
    note_ar: "يُفضَّل تغيير اثنين مع بعض", note_en: "Best replaced in pairs",
  },
  {
    id: "susp-shockrear",
    name_ar: "صدام خلفي", name_en: "Rear Shock Absorber (each)",
    category: "suspension",
    price_local: [350, 800], price_oem: [900, 2500], price_imported: [1800, 5000],
  },
  {
    id: "susp-balljoints",
    name_ar: "بليات التعليق", name_en: "Ball Joints (pair)",
    category: "suspension",
    price_local: [300, 700], price_oem: [700, 2000], price_imported: [1500, 4000],
    note_ar: "سعر لزوج واحد", note_en: "Price per pair",
  },
  {
    id: "susp-tierod",
    name_ar: "قضيب التوجيه (تاي رود)", name_en: "Tie Rod End (each)",
    category: "suspension",
    price_local: [150, 400], price_oem: [400, 1000], price_imported: [700, 2000],
  },
  {
    id: "susp-stabilizer",
    name_ar: "مطاط الاستابيلايزر", name_en: "Stabilizer Bar Bush (set)",
    category: "suspension",
    price_local: [80, 200], price_oem: [200, 600], price_imported: [400, 1200],
  },
  {
    id: "susp-strut-bearing",
    name_ar: "ستراب الصدام العلوي", name_en: "Strut Top Mount / Bearing",
    category: "suspension",
    price_local: [150, 400], price_oem: [400, 1200], price_imported: [800, 2500],
  },
  {
    id: "susp-controlarm",
    name_ar: "كنترول آرم", name_en: "Control Arm (each)",
    category: "suspension",
    price_local: [500, 1200], price_oem: [1200, 3500], price_imported: [2500, 7000],
  },
  // ── ELECTRICAL ──────────────────────────────────────────────────────────────
  {
    id: "elec-battery",
    name_ar: "بطارية السيارة", name_en: "Car Battery",
    category: "electrical",
    price_local: [900, 1800], price_oem: [1800, 3500], price_imported: [3000, 7000],
    note_ar: "سعر يشمل التركيب في معظم المحلات", note_en: "Usually includes fitting",
  },
  {
    id: "elec-alternator",
    name_ar: "دينامو الشحن", name_en: "Alternator",
    category: "electrical",
    price_local: [800, 2000], price_oem: [2000, 5000], price_imported: [4000, 10000],
    note_ar: "مستعمل متجدد ٦٠٠–١٢٠٠ جنيه", note_en: "Refurbished used: 600–1,200 EGP",
  },
  {
    id: "elec-starter",
    name_ar: "موتور الاستارت", name_en: "Starter Motor",
    category: "electrical",
    price_local: [700, 1800], price_oem: [1800, 4500], price_imported: [3500, 9000],
    note_ar: "مستعمل متجدد ٥٠٠–١٠٠٠ جنيه", note_en: "Refurbished used: 500–1,000 EGP",
  },
  {
    id: "elec-headlight",
    name_ar: "شمعة الإضاءة الأمامية", name_en: "Headlight Bulb (each)",
    category: "electrical",
    price_local: [50, 150], price_oem: [150, 400], price_imported: [300, 900],
    note_ar: "HID / LED تختلف — قد تصل ٢٠٠٠+ جنيه", note_en: "HID/LED may cost 2,000+ EGP",
  },
  {
    id: "elec-headsunit",
    name_ar: "شاشة السيارة (هيد يونيت)", name_en: "Car Head Unit / Screen",
    category: "electrical",
    price_local: [1200, 3500], price_oem: null, price_imported: [4000, 15000],
    note_ar: "أندرويد ٢ دين — السعر حسب الحجم والمواصفات", note_en: "Android 2-DIN — price varies by size/specs",
  },
  {
    id: "elec-horn",
    name_ar: "كلاكسون", name_en: "Car Horn",
    category: "electrical",
    price_local: [80, 200], price_oem: [200, 500], price_imported: [350, 900],
  },
  {
    id: "elec-ecu",
    name_ar: "وحدة التحكم ECU", name_en: "Engine Control Unit (ECU)",
    category: "electrical",
    price_local: null, price_oem: [3000, 12000], price_imported: [8000, 30000],
    note_ar: "يفضل إصلاح الأصلي عوضاً عن الاستبدال", note_en: "Repair of original preferred over replacement",
  },
  // ── AC ──────────────────────────────────────────────────────────────────────
  {
    id: "ac-compressor",
    name_ar: "كمبروسور التكييف", name_en: "AC Compressor",
    category: "ac",
    price_local: [2000, 4500], price_oem: [5000, 12000], price_imported: [9000, 22000],
    note_ar: "مستعمل ١٢٠٠–٢٥٠٠ جنيه", note_en: "Used unit: 1,200–2,500 EGP",
  },
  {
    id: "ac-condenser",
    name_ar: "كوندنسر التكييف", name_en: "AC Condenser",
    category: "ac",
    price_local: [800, 2000], price_oem: [2000, 5500], price_imported: [4000, 10000],
  },
  {
    id: "ac-evaporator",
    name_ar: "إيفابوريتر التكييف", name_en: "AC Evaporator",
    category: "ac",
    price_local: [700, 1800], price_oem: [1800, 5000], price_imported: [3500, 9000],
  },
  {
    id: "ac-freon-recharge",
    name_ar: "شحن فريون", name_en: "Freon Recharge (service)",
    category: "ac",
    price_local: [200, 400], price_oem: null, price_imported: null,
    note_ar: "خدمة — السعر يشمل الفريون والتركيب", note_en: "Service price incl. gas and fitting",
  },
  {
    id: "ac-cabin-filter",
    name_ar: "فلتر كابينة التكييف", name_en: "Cabin Air Filter",
    category: "ac",
    price_local: [80, 200], price_oem: [200, 500], price_imported: [350, 900],
  },
  // ── FILTERS & FLUIDS ────────────────────────────────────────────────────────
  {
    id: "ff-engine-oil-mineral",
    name_ar: "زيت محرك معدني (٤ لتر)", name_en: "Mineral Engine Oil (4L)",
    category: "filters_fluids",
    price_local: [250, 450], price_oem: null, price_imported: [500, 900],
    note_ar: "ماركات: Shell, Mobil, Castrol, Total", note_en: "Brands: Shell, Mobil, Castrol, Total",
  },
  {
    id: "ff-engine-oil-semi",
    name_ar: "زيت محرك نصف تركيبي (٤ لتر)", name_en: "Semi-Synthetic Engine Oil (4L)",
    category: "filters_fluids",
    price_local: null, price_oem: null, price_imported: [750, 1400],
  },
  {
    id: "ff-engine-oil-full",
    name_ar: "زيت محرك تركيبي كامل (٤ لتر)", name_en: "Full Synthetic Engine Oil (4L)",
    category: "filters_fluids",
    price_local: null, price_oem: null, price_imported: [1100, 2200],
  },
  {
    id: "ff-gearbox-oil",
    name_ar: "زيت الجيربوكس / ناقل الحركة", name_en: "Gearbox / Transmission Fluid",
    category: "filters_fluids",
    price_local: [200, 500], price_oem: null, price_imported: [500, 1500],
    note_ar: "السعر لتر واحد — معظم السيارات تحتاج ٢–٤ لتر", note_en: "Per litre — most cars need 2–4 litres",
  },
  {
    id: "ff-brake-fluid",
    name_ar: "سائل الفرامل (DOT 4)", name_en: "Brake Fluid DOT 4 (0.5L)",
    category: "filters_fluids",
    price_local: [80, 150], price_oem: null, price_imported: [150, 350],
  },
  {
    id: "ff-coolant",
    name_ar: "سائل التبريد (أنتي فريز)", name_en: "Coolant / Antifreeze (1L)",
    category: "filters_fluids",
    price_local: [80, 180], price_oem: null, price_imported: [180, 400],
  },
  // ── TRANSMISSION ────────────────────────────────────────────────────────────
  {
    id: "trans-clutch-kit",
    name_ar: "طقم كلاتش (قرص + طبق + بلية)", name_en: "Clutch Kit (disc + pressure plate + bearing)",
    category: "transmission",
    price_local: [900, 2000], price_oem: [2500, 6000], price_imported: [4500, 12000],
    note_ar: "أشغال التركيب ١٥٠٠–٤٠٠٠ جنيه إضافية", note_en: "Labor adds 1,500–4,000 EGP",
  },
  {
    id: "trans-driveaxle",
    name_ar: "فردة التعليق (دراف شافت)", name_en: "Drive Shaft / CV Axle",
    category: "transmission",
    price_local: [600, 1500], price_oem: [1500, 4000], price_imported: [3000, 8000],
  },
  {
    id: "trans-cvjoint",
    name_ar: "جوانتي الفردة (CV Joint)", name_en: "CV Joint Boot Kit",
    category: "transmission",
    price_local: [100, 300], price_oem: [300, 800], price_imported: [600, 1800],
  },
  // ── EXHAUST ─────────────────────────────────────────────────────────────────
  {
    id: "exhaust-catalytic",
    name_ar: "كاتالتيك كنفرتر", name_en: "Catalytic Converter",
    category: "exhaust",
    price_local: [1500, 4000], price_oem: [5000, 15000], price_imported: null,
    note_ar: "تحويل (بديل محلي) ١٥٠٠–٤٠٠٠، أصلي ٥٠٠٠+", note_en: "Aftermarket 1,500–4,000, OEM 5,000+",
  },
  {
    id: "exhaust-muffler",
    name_ar: "شكمان العادم", name_en: "Exhaust Muffler / Silencer",
    category: "exhaust",
    price_local: [500, 1200], price_oem: [1200, 3000], price_imported: [2500, 6000],
  },
  {
    id: "exhaust-oxygsensor",
    name_ar: "سنسور الأكسجين (لمبدا)", name_en: "Oxygen Sensor (Lambda)",
    category: "exhaust",
    price_local: [300, 700], price_oem: [700, 2000], price_imported: [1500, 4000],
  },
  // ── BODY & GLASS ────────────────────────────────────────────────────────────
  {
    id: "body-windscreen",
    name_ar: "زجاج أمامي (ونيت)", name_en: "Windscreen / Windshield",
    category: "body_glass",
    price_local: [800, 2000], price_oem: [2500, 7000], price_imported: [5000, 15000],
    note_ar: "السعر بدون التركيب — التركيب ٣٠٠–٦٠٠ جنيه", note_en: "Excl. fitting — fitting costs 300–600 EGP",
  },
  {
    id: "body-sidewindow",
    name_ar: "زجاج جانبي", name_en: "Side Window Glass",
    category: "body_glass",
    price_local: [400, 900], price_oem: [900, 2500], price_imported: [2000, 6000],
  },
  {
    id: "body-rearwindow",
    name_ar: "زجاج خلفي", name_en: "Rear Window Glass",
    category: "body_glass",
    price_local: [600, 1500], price_oem: [1500, 4000], price_imported: [3000, 8000],
  },
  {
    id: "body-bumper-front",
    name_ar: "بامبر أمامي", name_en: "Front Bumper",
    category: "body_glass",
    price_local: [500, 1500], price_oem: [1500, 5000], price_imported: [4000, 12000],
    note_ar: "بدون دهان — الدهان ٨٠٠–٢٠٠٠ جنيه إضافية", note_en: "Unpainted — paint adds 800–2,000 EGP",
  },
  {
    id: "body-hood",
    name_ar: "كبوت الموتور", name_en: "Engine Hood / Bonnet",
    category: "body_glass",
    price_local: [1200, 3000], price_oem: [3500, 9000], price_imported: [7000, 20000],
    note_ar: "بدون دهان", note_en: "Unpainted",
  },
];

const PART_CATEGORIES: { id: PartCategory; icon: string; ar: string; en: string }[] = [
  { id: "engine",         icon: "⚙️",  ar: "محرك",           en: "Engine" },
  { id: "brakes",         icon: "🛑",  ar: "فرامل",          en: "Brakes" },
  { id: "suspension",     icon: "🔩",  ar: "تعليق",          en: "Suspension" },
  { id: "electrical",     icon: "⚡",  ar: "كهرباء",         en: "Electrical" },
  { id: "ac",             icon: "❄️",  ar: "تكييف",          en: "A/C" },
  { id: "filters_fluids", icon: "🧪",  ar: "فلاتر وزيوت",   en: "Filters & Fluids" },
  { id: "transmission",   icon: "🔄",  ar: "ناقل حركة",      en: "Transmission" },
  { id: "exhaust",        icon: "💨",  ar: "عادم",           en: "Exhaust" },
  { id: "body_glass",     icon: "🪟",  ar: "هيكل وزجاج",    en: "Body & Glass" },
];

function fmtEGP(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${Math.round(n / 1000)}K`;
  return n.toLocaleString();
}
function fmtRange(r: [number, number]) {
  return `${fmtEGP(r[0])} – ${fmtEGP(r[1])}`;
}

// ─── main component ─────────────────────────────────────────────────────────
function DiagnoseInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const searchParams = useSearchParams();

  const [mainTab, setMainTab] = useState<"diagnose" | "parts">("diagnose");

  // diagnose state
  const [tab, setTab] = useState<"text" | "voice" | "photo">("text");
  const [input, setInput] = useState("");
  const [match, setMatch] = useState<{ result: DiagResult; confidence: "high" | "medium" | "low" } | null>(null);
  const [searched, setSearched] = useState(false);

  // voice
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDragging, setPhotoDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // parts state
  const [partSearch, setPartSearch] = useState("");
  const [partCat, setPartCat] = useState<PartCategory | "">("");
  const [partResults, setPartResults] = useState<CarPart[]>([]);
  const [partsSearched, setPartsSearched] = useState(false);
  const [activeTier, setActiveTier] = useState<PartTier>("local");

  // tokens
  const bg          = isDark ? "#0F1414" : "#FAF7F2";
  const bgSec       = isDark ? "#141D1E" : "#F0EBE1";
  const surface     = isDark ? "#1F2A2E" : "#ffffff";
  const textPri     = isDark ? "#EAECE9" : "#231F1A";
  const textSec     = isDark ? "rgba(234,236,233,.55)" : "rgba(35,31,26,.55)";
  const textTer     = isDark ? "rgba(234,236,233,.35)" : "rgba(35,31,26,.35)";
  const border      = isDark ? "rgba(234,236,233,.08)" : "rgba(214,208,196,.72)";
  const accent      = isDark ? "#6E7F77" : "#214E4F";
  const accentMuted = isDark ? "rgba(110,127,119,.13)" : "rgba(33,78,79,.08)";
  const accentBorder= isDark ? "rgba(110,127,119,.3)"  : "rgba(33,78,79,.2)";

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setInput(q); setTab("text"); }
    setVoiceSupported(!!(typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)));
  }, [searchParams]);

  function handleDiagnose(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMatch(diagnoseScored(q, lang));
    setSearched(true);
  }

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = lang === "ar" ? "ar-EG" : "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onstart  = () => setListening(true);
    rec.onresult = (e: any) => { const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(""); setTranscript(t); };
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.start();
  }
  function stopListening()  { recognitionRef.current?.stop(); setListening(false); }
  function diagnoseFromVoice() { if (!transcript.trim()) return; setInput(transcript); setMatch(diagnoseScored(transcript, lang)); setSearched(true); }
  function handlePhotoFile(file: File) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }

  function searchParts(overrideSearch?: string, overrideCat?: PartCategory | "") {
    const q = (overrideSearch ?? partSearch).toLowerCase().trim();
    const cat = overrideCat !== undefined ? overrideCat : partCat;
    const res = PARTS_DB.filter(p => {
      const matchText = !q || p.name_ar.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q);
      const matchCat = !cat || p.category === cat;
      return matchText && matchCat;
    });
    setPartResults(res);
    setPartsSearched(true);
  }

  const suggestions = lang === "ar"
    ? ["التكييف مش بيبرد", "المحرك بيسخن", "صوت طقطقة في المحرك", "البطارية ماتت", "شرخ في الزجاج", "لمبة تحذير على الداشبورد", "محتاج تغيير زيت", "إطار واطي", "صوت في الجير", "الفرامل بتطق", "هزة في السيارة"]
    : ["AC not cooling", "Engine overheating", "Engine knocking sounds", "Battery dead", "Cracked windscreen", "Check engine light on", "Need oil change", "Flat tyre", "Gear noise", "Brake grinding", "Car vibrating"];

  if (!mounted) return null;

  const matchedCat   = match ? (CATEGORIES.find((c: { id: string }) => c.id === match.result.category) ?? null) : null;
  const matchedShops = match ? SHOPS.filter(s => s.category === match.result.category).slice(0, 3) : [];

  const selectStyle: React.CSSProperties = {
    padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${border}`,
    background: surface, color: textPri, fontSize: 13, fontFamily: "inherit",
    outline: "none", cursor: "pointer", direction: dir, width: "100%",
  };

  const tierLabels: Record<PartTier, { ar: string; en: string; color: string }> = {
    local:    { ar: "محلي / صيني",  en: "Local / Chinese", color: "#F59E0B" },
    oem:      { ar: "OEM أصلي",     en: "OEM Genuine",     color: "#10B981" },
    imported: { ar: "مستورد أوروبي / ياباني", en: "European / Japanese", color: "#6366F1" },
  };

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: bg, color: textPri, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Header ── */}
      <section style={{ padding: "28px 20px 0", background: bgSec, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: textTer, textDecoration: "none", marginBottom: 14 }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = textTer)}
          >
            {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            {/* Logo only — no text name */}
            <div style={{ width: 48, height: 48, borderRadius: 16, background: accentMuted, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              <Image src="/Warsha_Logo.png" alt="Warsha" width={38} height={38} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 900, color: textPri, margin: 0, letterSpacing: "-0.02em" }}>
                {lang === "ar" ? "مساعد وَرْشة الذكي" : "Warsha Smart Assistant"}
              </h1>
              <p style={{ fontSize: 13, color: textTer, margin: "3px 0 0" }}>
                {lang === "ar" ? "تشخيص مشاكل السيارة وأسعار قطع الغيار" : "Car problem diagnosis & spare parts prices"}
              </p>
            </div>
          </div>

          {/* Main tabs */}
          <div style={{ display: "flex", gap: 0 }}>
            {([
              { key: "diagnose", ar: "🔍 تشخيص المشكلة",    en: "🔍 Diagnose Problem" },
              { key: "parts",    ar: "🔧 أسعار قطع الغيار", en: "🔧 Car Parts Prices" },
            ] as const).map(({ key, ar, en }) => (
              <button key={key} onClick={() => setMainTab(key)} style={{
                padding: "13px 20px", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                background: "transparent", border: "none", cursor: "pointer",
                color: mainTab === key ? accent : textTer,
                borderBottom: mainTab === key ? `2px solid ${accent}` : "2px solid transparent",
                transition: "all .15s",
              }}>
                {lang === "ar" ? ar : en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── DIAGNOSE TAB ─────────────────────────── */}
      {mainTab === "diagnose" && (
        <section style={{ padding: "24px 20px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* Sub tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {([
                { key: "text",  ar: "✍️ نص",    en: "✍️ Text"  },
                { key: "voice", ar: "🎙️ صوت",   en: "🎙️ Voice" },
                { key: "photo", ar: "📷 صورة",  en: "📷 Photo" },
              ] as const).map(({ key, ar, en }) => (
                <button key={key} onClick={() => { setTab(key); setSearched(false); setMatch(null); }} style={{
                  padding: "9px 18px", borderRadius: 99, fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  background: tab === key ? accent : surface,
                  color: tab === key ? "#fff" : textSec,
                  border: `1px solid ${tab === key ? accent : border}`,
                  cursor: "pointer", transition: "all .15s",
                }}>
                  {lang === "ar" ? ar : en}
                </button>
              ))}
            </div>

            {/* TEXT */}
            {tab === "text" && (
              <div>
                <div style={{ background: surface, borderRadius: 16, border: `1.5px solid ${border}`, padding: 16, marginBottom: 12 }}>
                  <textarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setSearched(false); setMatch(null); }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDiagnose(); } }}
                    placeholder={lang === "ar"
                      ? "اكتب المشكلة بكلامك... مثلاً: \"المحرك فيه صوت طقطقة وبيسخن على الطريق\""
                      : "Describe freely... e.g. \"Engine knocking sounds and overheating on the highway\""}
                    rows={4}
                    style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: textPri, fontSize: 14, fontFamily: "inherit", lineHeight: 1.75, resize: "none", direction: dir as React.CSSProperties["direction"], textAlign: dir === "rtl" ? "right" : "left" }}
                  />
                </div>
                <button onClick={() => handleDiagnose()} style={{
                  width: "100%", padding: 14, borderRadius: 12,
                  background: accent, color: "#fff", fontSize: 14, fontWeight: 700,
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                  boxShadow: `0 4px 16px rgba(33,78,79,.25)`, transition: "opacity .15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = ".87")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  🔍 {lang === "ar" ? "تشخيص الآن" : "Diagnose now"}
                </button>

                {!searched && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 11, color: textTer, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>
                      {lang === "ar" ? "اقتراحات سريعة" : "Quick suggestions"}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {suggestions.map(s => (
                        <button key={s} onClick={() => { setInput(s); handleDiagnose(s); }}
                          style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, background: accentMuted, border: `1px solid ${accentBorder}`, cursor: "pointer", fontFamily: "inherit", color: accent, fontWeight: 500, transition: "all .15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(110,127,119,.22)" : "rgba(33,78,79,.14)")}
                          onMouseLeave={e => (e.currentTarget.style.background = accentMuted)}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VOICE */}
            {tab === "voice" && (
              <div style={{ textAlign: "center" }}>
                {!voiceSupported ? (
                  <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: "40px 24px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎙️</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: textPri, margin: "0 0 8px" }}>
                      {lang === "ar" ? "المتصفح مش بيدعم التعرف على الصوت" : "Your browser doesn't support voice recognition"}
                    </p>
                    <p style={{ fontSize: 13, color: textTer, margin: 0 }}>
                      {lang === "ar" ? "جرب Chrome أو Safari على الموبايل" : "Try Chrome or Safari on mobile"}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <button onClick={listening ? stopListening : startListening} style={{
                        width: 100, height: 100, borderRadius: "50%",
                        background: listening ? "#EF4444" : accent,
                        border: "none", cursor: "pointer", fontSize: 38,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        boxShadow: listening ? "0 0 0 16px rgba(239,68,68,.15), 0 0 0 32px rgba(239,68,68,.07)" : `0 4px 24px rgba(33,78,79,.3)`,
                        transition: "all .25s",
                        animation: listening ? "micPulse 1.4s ease-in-out infinite" : "none",
                      }}>🎙️</button>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: listening ? "#EF4444" : textSec, marginBottom: 8 }}>
                      {listening
                        ? (lang === "ar" ? "🔴 بيسمعك... تكلم عن المشكلة" : "🔴 Listening... describe the problem")
                        : (lang === "ar" ? "اضغط المايك واتكلم عن مشكلة سيارتك" : "Tap the mic and describe your car problem")}
                    </p>
                    <p style={{ fontSize: 12, color: textTer, marginBottom: 20 }}>
                      {lang === "ar" ? "اللغة: عربي (مصري)" : "Language: English (US)"}
                    </p>
                    {transcript && (
                      <div style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: "14px 18px", marginBottom: 14, textAlign: dir === "rtl" ? "right" : "left" }}>
                        <p style={{ fontSize: 11, color: textTer, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: ".06em" }}>{lang === "ar" ? "ما قلته" : "You said"}</p>
                        <p style={{ fontSize: 14, color: textPri, margin: 0, lineHeight: 1.7 }}>{transcript}</p>
                      </div>
                    )}
                    {transcript && !listening && (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => { setTranscript(""); setSearched(false); setMatch(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: "transparent", border: `1px solid ${border}`, color: textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          {lang === "ar" ? "إعادة التسجيل" : "Record again"}
                        </button>
                        <button onClick={diagnoseFromVoice} style={{ flex: 2, padding: 12, borderRadius: 12, background: accent, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                          🔍 {lang === "ar" ? "تشخيص" : "Diagnose"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PHOTO */}
            {tab === "photo" && (
              <div>
                <div
                  onClick={() => !photoPreview && fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setPhotoDragging(true); }}
                  onDragLeave={() => setPhotoDragging(false)}
                  onDrop={e => { e.preventDefault(); setPhotoDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handlePhotoFile(f); }}
                  style={{ borderRadius: 16, border: `2px dashed ${photoDragging ? accent : border}`, background: photoDragging ? accentMuted : surface, overflow: "hidden", cursor: photoPreview ? "default" : "pointer", transition: "all .2s", marginBottom: 14, minHeight: photoPreview ? "auto" : 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                >
                  {photoPreview ? (
                    <div style={{ width: "100%", position: "relative" }}>
                      <img src={photoPreview} alt="car problem" style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block" }} />
                      <button onClick={e => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(null); }} style={{ position: "absolute", top: 10, insetInlineEnd: 10, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ fontSize: 44, marginBottom: 12 }}>📷</div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: textPri, margin: "0 0 6px" }}>{lang === "ar" ? "التقط أو اختر صورة للمشكلة" : "Take or choose a photo of the problem"}</p>
                      <p style={{ fontSize: 12, color: textTer, margin: 0 }}>{lang === "ar" ? "اسحب وأفلت، أو اضغط للاختيار" : "Drag & drop, or tap to choose"}</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
                {!photoPreview && (
                  <button onClick={() => fileInputRef.current?.click()} style={{ width: "100%", padding: 13, borderRadius: 12, background: accentMuted, border: `1px solid ${accentBorder}`, color: accent, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
                    📷 {lang === "ar" ? "اختر صورة" : "Choose photo"}
                  </button>
                )}
                {photoPreview && (
                  <div>
                    <div style={{ background: isDark ? "rgba(239,68,68,.08)" : "#FFF7F0", border: `1px solid rgba(239,68,68,.2)`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                      <p style={{ fontSize: 12, color: "#EF4444", margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                        {lang === "ar" ? "⚠️ التشخيص بالصورة يحتاج مراجعة يدوية من فريقنا — ارسل الصورة على الإيميل وهنرد عليك في أسرع وقت." : "⚠️ Photo diagnosis requires manual review by our team — send the photo by email and we'll get back to you ASAP."}
                      </p>
                    </div>
                    <a
                      href={`mailto:Warsha.Finder@gmail.com?subject=${encodeURIComponent(lang === "ar" ? "صورة مشكلة سيارة — وَرْشة" : "Car Problem Photo — Warsha")}&body=${encodeURIComponent(lang === "ar" ? `السلام عليكم،\n\nبعت صورة لمشكلة في سيارتي.\n\nالملف: ${photoFile?.name}\n\nأرجو التشخيص والرد.\n\nشكراً` : `Hello,\n\nI'm attaching a photo of my car problem.\n\nFilename: ${photoFile?.name}\n\nPlease diagnose and reply.\n\nThank you`)}`}
                      style={{ display: "block", width: "100%", padding: 13, borderRadius: 12, background: accent, color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", boxShadow: `0 4px 16px rgba(33,78,79,.25)` }}
                    >
                      📧 {lang === "ar" ? "إرسال الصورة للمراجعة" : "Send photo for review"}
                    </a>
                    <p style={{ fontSize: 11, color: textTer, textAlign: "center", marginTop: 8 }}>Warsha.Finder@gmail.com</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Results ── */}
            {searched && (
              <div style={{ marginTop: 24 }}>
                {!match ? (
                  <div style={{ textAlign: "center", padding: "40px 24px", background: surface, border: `1px solid ${border}`, borderRadius: 16 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: textPri, margin: "0 0 8px" }}>{lang === "ar" ? "مش قادرين نتعرف على المشكلة" : "Couldn't identify the problem"}</p>
                    <p style={{ fontSize: 13, color: textTer, margin: "0 0 20px" }}>{lang === "ar" ? "جرب تكتب أكتر تفاصيل، أو تصفح الورش مباشرة" : "Try adding more details, or browse workshops directly"}</p>
                    <Link href="/workshops" style={{ display: "inline-block", padding: "10px 24px", fontSize: 13, background: accent, color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
                      {lang === "ar" ? "تصفح كل الورش" : "Browse all workshops"}
                    </Link>
                  </div>
                ) : matchedCat && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden" }}>
                      <div style={{ padding: "14px 18px", background: `${matchedCat.accent}10`, borderBottom: `1px solid ${matchedCat.accent}22`, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${matchedCat.accent}18`, border: `1px solid ${matchedCat.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{matchedCat.icon}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 11, color: textTer, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".07em" }}>{lang === "ar" ? "التخصص المطلوب" : "Specialist needed"}</p>
                          <p style={{ fontSize: 15, fontWeight: 700, color: matchedCat.accent, margin: 0 }}>{lang === "ar" ? matchedCat.ar : matchedCat.en}</p>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: accentMuted, color: accent, border: `1px solid ${accentBorder}`, flexShrink: 0 }}>
                          {lang === "ar" ? CONFIDENCE[match.confidence].ar : CONFIDENCE[match.confidence].en}
                        </span>
                      </div>
                      <div style={{ padding: 18 }}>
                        {(() => { const u = URGENCY[match.result.urgency]; return (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 99, marginBottom: 14, background: `${u.color}12`, border: `1px solid ${u.color}28` }}>
                            <span>{u.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: u.color }}>{lang === "ar" ? u.ar : u.en}</span>
                          </div>
                        ); })()}
                        <p style={{ fontSize: 14, color: textPri, lineHeight: 1.78, margin: "0 0 16px" }}>
                          {lang === "ar" ? match.result.diagnosis_ar : match.result.diagnosis_en}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 15px", borderRadius: 12, background: isDark ? "rgba(234,236,233,.04)" : "#F5F2EA", border: `1px solid ${border}` }}>
                          <span style={{ fontSize: 20 }}>💰</span>
                          <div>
                            <p style={{ fontSize: 11, color: textTer, margin: "0 0 2px" }}>{lang === "ar" ? "تكلفة إصلاح متوقعة" : "Estimated repair cost"}</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: textPri, margin: 0 }}>{lang === "ar" ? match.result.cost_ar : match.result.cost_en}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {matchedShops.length > 0 && matchedCat && (
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: textTer, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: ".06em" }}>
                          {lang === "ar" ? "ورش متخصصة" : "Specialist workshops"}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                          {matchedShops.map(shop => (
                            <Link key={shop.id} href={`/shop/${shop.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 13, background: surface, border: `1px solid ${border}`, textDecoration: "none", transition: "all .15s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accentBorder; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = border; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
                            >
                              <div style={{ width: 40, height: 40, borderRadius: 11, background: accentMuted, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{matchedCat.icon}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: textPri }}>{shop.name}</div>
                                <div style={{ fontSize: 12, color: textTer }}>📍 {shop.area[lang]}</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: textPri }}><span style={{ color: "#6E7F77" }}>★</span> {shop.rating}</div>
                                <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{lang === "ar" ? "عرض ←" : "View →"}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link href={`/workshops?cat=${match.result.category}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12, fontSize: 13, color: accent, textDecoration: "none", fontWeight: 600 }}>
                          {lang === "ar" ? "عرض كل الورش المتخصصة ←" : "View all specialist workshops →"}
                        </Link>
                      </div>
                    )}

                    <p style={{ fontSize: 11, color: textTer, textAlign: "center", padding: "6px 0" }}>
                      {lang === "ar" ? "⚠️ هذا تشخيص تقريبي — استشر متخصص قبل أي إصلاح" : "⚠️ Approximate diagnosis — consult a specialist before any repair"}
                    </p>
                    <button onClick={() => { setSearched(false); setMatch(null); setInput(""); setTranscript(""); setPhotoFile(null); setPhotoPreview(null); }}
                      style={{ padding: 11, borderRadius: 12, background: "transparent", border: `1px solid ${border}`, color: textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {lang === "ar" ? "تشخيص مشكلة جديدة" : "Diagnose another problem"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────── CAR PARTS TAB ─────────────────────────── */}
      {mainTab === "parts" && (
        <section style={{ padding: "24px 20px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>

            {/* Search */}
            <div style={{ background: surface, borderRadius: 16, border: `1px solid ${border}`, padding: 18, marginBottom: 16 }}>
              <input
                value={partSearch}
                onChange={e => setPartSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && searchParts()}
                placeholder={lang === "ar" ? "ابحث عن قطعة... مثلاً: تيل فرامل أو brake pad" : "Search a part... e.g. brake pad or تيل فرامل"}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color: textPri, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 12, direction: dir as React.CSSProperties["direction"], boxSizing: "border-box" }}
              />
              <select value={partCat} onChange={e => setPartCat(e.target.value as PartCategory | "")} style={selectStyle}>
                <option value="">{lang === "ar" ? "كل الأنواع" : "All categories"}</option>
                {PART_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {lang === "ar" ? c.ar : c.en}</option>
                ))}
              </select>
              <button onClick={() => searchParts()} style={{ width: "100%", marginTop: 12, padding: 13, borderRadius: 11, background: accent, color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", boxShadow: `0 4px 16px rgba(33,78,79,.25)` }}>
                🔍 {lang === "ar" ? "بحث عن الأسعار" : "Search prices"}
              </button>
            </div>

            {/* Disclaimer */}
            <div style={{ background: isDark ? "rgba(245,158,11,.06)" : "#FFFDF5", border: `1px solid rgba(245,158,11,.2)`, borderRadius: 12, padding: "11px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: "#B45309", margin: 0, lineHeight: 1.6 }}>
                {lang === "ar"
                  ? "⚠️ الأسعار متوسطات السوق المصري (٢٠٢٤–٢٠٢٥) — تتفاوت حسب الماركة، الموديل، ومصدر القطعة. ارجع دايماً لورشة موثوقة للتأكيد."
                  : "⚠️ Prices are Egyptian market averages (2024–2025) — they vary by brand, model and part source. Always confirm with a trusted workshop."}
              </p>
            </div>

            {/* Quick category chips */}
            {!partsSearched && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, color: textTer, marginBottom: 10, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {lang === "ar" ? "تصفح حسب النوع" : "Browse by category"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PART_CATEGORIES.map(c => (
                    <button key={c.id}
                      onClick={() => { setPartCat(c.id); searchParts(undefined, c.id); }}
                      style={{ padding: "8px 16px", borderRadius: 99, fontSize: 13, background: accentMuted, border: `1px solid ${accentBorder}`, cursor: "pointer", fontFamily: "inherit", color: accent, fontWeight: 600 }}
                    >
                      {c.icon} {lang === "ar" ? c.ar : c.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tier selector */}
            {partsSearched && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: textTer, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {lang === "ar" ? "عرض أسعار" : "Show prices for"}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["local", "oem", "imported"] as PartTier[]).map(t => (
                    <button key={t} onClick={() => setActiveTier(t)} style={{
                      padding: "8px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, fontFamily: "inherit",
                      background: activeTier === t ? tierLabels[t].color : "transparent",
                      color: activeTier === t ? "#fff" : textSec,
                      border: `1.5px solid ${activeTier === t ? tierLabels[t].color : border}`,
                      cursor: "pointer", transition: "all .15s",
                    }}>
                      {lang === "ar" ? tierLabels[t].ar : tierLabels[t].en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {partsSearched && (
              <div>
                <p style={{ fontSize: 12, color: textTer, marginBottom: 12 }}>
                  {partResults.length === 0
                    ? (lang === "ar" ? "مفيش نتائج — جرب كلمات تانية" : "No results — try different keywords")
                    : `${partResults.length} ${lang === "ar" ? "قطعة" : "part(s) found"}`}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {partResults.map(p => {
                    const catInfo = PART_CATEGORIES.find(c => c.id === p.category);
                    const tierPrice = activeTier === "local" ? p.price_local : activeTier === "oem" ? p.price_oem : p.price_imported;
                    const tl = tierLabels[activeTier];
                    return (
                      <div key={p.id} style={{ background: surface, borderRadius: 14, border: `1px solid ${border}`, padding: "16px 18px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: tierPrice || (p.note_ar || p.note_en) ? 12 : 0 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 11, background: accentMuted, border: `1px solid ${accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            {catInfo?.icon ?? "🔧"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: textPri, marginBottom: 3 }}>
                              {lang === "ar" ? p.name_ar : p.name_en}
                            </div>
                            <div style={{ fontSize: 12, color: textTer }}>
                              {lang === "ar" ? p.name_en : p.name_ar} · {catInfo ? (lang === "ar" ? catInfo.ar : catInfo.en) : ""}
                            </div>
                          </div>
                        </div>

                        {/* Price display */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          {(["local", "oem", "imported"] as PartTier[]).map(t => {
                            const price = t === "local" ? p.price_local : t === "oem" ? p.price_oem : p.price_imported;
                            const tinfo = tierLabels[t];
                            const isActive = activeTier === t;
                            return (
                              <div key={t} onClick={() => setActiveTier(t)} style={{
                                padding: "10px 12px", borderRadius: 10, cursor: "pointer", transition: "all .15s",
                                background: isActive ? `${tinfo.color}14` : isDark ? "rgba(234,236,233,.03)" : "#F5F2EA",
                                border: `1.5px solid ${isActive ? tinfo.color + "44" : border}`,
                              }}>
                                <p style={{ fontSize: 9, color: isActive ? tinfo.color : textTer, margin: "0 0 4px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>
                                  {lang === "ar" ? tinfo.ar : tinfo.en}
                                </p>
                                {price ? (
                                  <p style={{ fontSize: 13, fontWeight: 800, color: isActive ? tinfo.color : textPri, margin: 0 }}>
                                    {fmtRange(price)} <span style={{ fontSize: 9, fontWeight: 400, color: textTer }}>EGP</span>
                                  </p>
                                ) : (
                                  <p style={{ fontSize: 12, color: textTer, margin: 0, fontStyle: "italic" }}>
                                    {lang === "ar" ? "غير متاح" : "N/A"}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {(lang === "ar" ? p.note_ar : p.note_en) && (
                          <p style={{ fontSize: 11, color: textTer, margin: "10px 0 0", padding: "8px 12px", borderRadius: 8, background: isDark ? "rgba(234,236,233,.04)" : "#F0EDE5", lineHeight: 1.6 }}>
                            💡 {lang === "ar" ? p.note_ar : p.note_en}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {partResults.length > 0 && (
                  <button onClick={() => { setPartsSearched(false); setPartSearch(""); setPartCat(""); }} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 10, background: "transparent", border: `1px solid ${border}`, color: textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {lang === "ar" ? "بحث جديد" : "New search"}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer style={{ padding: 20, textAlign: "center", fontSize: 12, color: textTer, borderTop: `1px solid ${border}` }}>
        © 2025 Warsha.eg
      </footer>

      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.4), 0 0 0 0 rgba(239,68,68,.2); }
          50% { box-shadow: 0 0 0 18px rgba(239,68,68,.15), 0 0 0 36px rgba(239,68,68,.06); }
        }
        ::-webkit-scrollbar { display: none; }
        select option { background: #1F2A2E; color: #EAECE9; }
      `}</style>
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0F1414" }} />}>
      <DiagnoseInner />
    </Suspense>
  );
}
