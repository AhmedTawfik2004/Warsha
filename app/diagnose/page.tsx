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
  category: string; urgency: Urgency;
  diagnosis_ar: string; diagnosis_en: string;
  cost_ar: string; cost_en: string;
};

const PROBLEM_MAP: { keywords_ar: string[]; keywords_en: string[]; result: DiagResult }[] = [
  {
    keywords_ar: ["تكييف","مش بيبرد","حار جوه","فريون","كمبروسور","مفيش تبريد","سخن جوه","بيبرد شوية","ضعيف التبريد","الهواء سخن","مكيف","تبريد ضعيف","ريح دافية","مافيش برد"],
    keywords_en: ["ac","a/c","air con","not cooling","hot inside","no cold","air conditioning","warm air","blowing hot","weak cooling","refrigerant","compressor","hvac","climate"],
    result: { category:"car_ac", urgency:"safe", diagnosis_ar:"على الأرجح مشكلة في شحن الفريون أو الكمبروسور. ممكن يكون فيه تسريب في دائرة التكييف أو الكمبروسور محتاج صيانة.", diagnosis_en:"Most likely a refrigerant recharge or faulty compressor. There may be a leak in the A/C circuit.", cost_ar:"تكلفة متوقعة: ٤٠٠ – ١٢٠٠ جنيه", cost_en:"Estimated cost: 400 – 1,200 EGP" },
  },
  {
    keywords_ar: ["سخن المحرك","درجة حرارة عالية","دخان","بخار","راديتير","ماية سخنة","بيسخن","ترمستات","مياه التبريد","حرارة زيادة","بيسخن أوي","عقرب الحرارة","بيغلي"],
    keywords_en: ["overheat","temperature","hot engine","smoke","steam","boiling","coolant","radiator","thermostat","overheating","engine hot","temperature gauge","water pump","red temp"],
    result: { category:"mechanical", urgency:"stop", diagnosis_ar:"تحذير: المحرك يسخن — ايقف السيارة فوراً. السبب على الأرجح تسريب في سائل التبريد أو الراديتير أو الترموستات.", diagnosis_en:"Warning: Engine overheating — stop immediately. Likely cause: coolant leak, faulty radiator or thermostat.", cost_ar:"تكلفة متوقعة: ٨٠٠ – ٣٠٠٠ جنيه", cost_en:"Estimated cost: 800 – 3,000 EGP" },
  },
  {
    keywords_ar: ["طقطقة","صوت في المحرك","دقدقة","طرقعة","صوت غريب","صوت خبط","خربشة","حاجة بتدق","صوت ضربات"],
    keywords_en: ["knocking","knock","ticking","rattling","rattle","clunking","engine noise","tapping","banging","engine knock"],
    result: { category:"mechanical", urgency:"caution", diagnosis_ar:"صوت الطقطقة ممكن يكون من: زيت منخفض، تيمنج مشكلة، برينجات بالية، أو صمامات محتاجة ضبط.", diagnosis_en:"Knocking could indicate: low oil, timing issue, worn bearings, or valves needing adjustment.", cost_ar:"تكلفة متوقعة: ٤٠٠ – ٥٠٠٠ جنيه", cost_en:"Estimated cost: 400 – 5,000 EGP" },
  },
  {
    keywords_ar: ["إطار","عجلة","واطي","ثقب","جنط","ضبط زوايا","موازنة","بانشر","الدواليب","الكاوتش","تاير","انتفاخ في الإطار"],
    keywords_en: ["tyre","tire","flat","puncture","wheel","rim","alignment","balance","blowout","flat tyre","worn tyre","tyre pressure"],
    result: { category:"tires", urgency:"caution", diagnosis_ar:"مشكلة في الإطارات — ممكن ثقب أو إطار بالي أو محتاج ضبط زوايا وموازنة.", diagnosis_en:"Tyre issue — possible puncture, worn tyre, or wheel alignment and balancing needed.", cost_ar:"تكلفة متوقعة: ٥٠ – ٢٥٠٠ جنيه", cost_en:"Estimated cost: 50 – 2,500 EGP" },
  },
  {
    keywords_ar: ["فرامل","صوت عند الوقوف","مش بتوقف","طقطقة في الفرامل","كاليبر","تيل الفرامل","الفرامل ضعيفة","صرير عند الوقوف","البيدال ناعم","الفرامل سخنة"],
    keywords_en: ["brake","grinding","squeaking","stopping","brake pad","abs","brake noise","soft brake","brake pedal","won't stop","squeal","caliper"],
    result: { category:"mechanical", urgency:"stop", diagnosis_ar:"تحذير: مشكلة في الفرامل — خطيرة جداً. صوت الطحن يعني تآكل التيل. توجه للورشة فوراً.", diagnosis_en:"Warning: Brake issue — very dangerous. Grinding means pads are worn to metal. Go to a workshop immediately.", cost_ar:"تكلفة متوقعة: ٦٠٠ – ٢٠٠٠ جنيه", cost_en:"Estimated cost: 600 – 2,000 EGP" },
  },
  {
    keywords_ar: ["بطارية","مش بيشتغل","كهرباء","استارتر","مش بتشتعل","الشمعات","ولا بيشتغل","مفيش كهرباء","البطارية فضيت","الإضاءة ضعيفة"],
    keywords_en: ["battery","won't start","dead","electric","starter","no power","electrical","spark plug","ignition","fuse","alternator","no crank","dead battery","dim lights"],
    result: { category:"auto_electric", urgency:"caution", diagnosis_ar:"على الأرجح مشكلة في البطارية أو الكهرباء. ممكن البطارية فرغت أو فيه مشكلة في الاستارتر أو الشمعات.", diagnosis_en:"Likely a battery or electrical issue. Battery may be dead or fault in starter, spark plugs or wiring.", cost_ar:"تكلفة متوقعة: ٣٠٠ – ١٨٠٠ جنيه", cost_en:"Estimated cost: 300 – 1,800 EGP" },
  },
  {
    keywords_ar: ["زجاج","شرخ","كسر","ونيت","الزجاج الأمامي","الشباك مكسور","تشقق الزجاج","ونيت متشقق","جانبي مكسور"],
    keywords_en: ["glass","windscreen","windshield","crack","chip","broken window","cracked windscreen","window broken","shattered","stone chip"],
    result: { category:"glass_repair", urgency:"caution", diagnosis_ar:"شرخ أو كسر في الزجاج. الشرخ الصغير ممكن يتصلح. الكبير أو المكسور يحتاج تغيير.", diagnosis_en:"Windscreen crack or break. Small chips may be repairable. Large cracks require full replacement.", cost_ar:"تكلفة متوقعة: ٣٠٠ – ٤٠٠٠ جنيه", cost_en:"Estimated cost: 300 – 4,000 EGP" },
  },
  {
    keywords_ar: ["زيت","تغيير زيت","تسريب زيت","زيت المحرك","فلتر","الزيت داكن","نقص الزيت","لمبة الزيت مضيئة"],
    keywords_en: ["oil","oil change","oil leak","engine oil","filter","low oil","dark oil","oil pressure","oil light","service due"],
    result: { category:"mechanical", urgency:"caution", diagnosis_ar:"محتاج تغيير زيت أو فيه تسريب. الزيت المتسخ أو المنخفض يتلف المحرك على المدى البعيد.", diagnosis_en:"Needs an oil change or there's a leak. Dirty or low oil causes long-term engine damage.", cost_ar:"تكلفة متوقعة: ٣٠٠ – ٨٠٠ جنيه", cost_en:"Estimated cost: 300 – 800 EGP" },
  },
  {
    keywords_ar: ["خدش","دهان","بوية","تغليف","هيكل","كبوت","صدمة","سمكرة","مهشوم","مكسر","حادثة","بامبر","تقشر الدهان"],
    keywords_en: ["scratch","dent","paint","body","bumper","respray","wrap","bodywork","panel","collision","crash","fender","dented","peeling paint"],
    result: { category:"paint_wrap", urgency:"safe", diagnosis_ar:"ضرر في هيكل السيارة أو الطلاء. ممكن خدش سطحي أو سمكرة أو دهان كامل.", diagnosis_en:"Body or paint damage. Could be a surface scratch, panel beating, or full repaint.", cost_ar:"تكلفة متوقعة: ٢٠٠ – ٢٠٠٠٠ جنيه", cost_en:"Estimated cost: 200 – 20,000 EGP" },
  },
  {
    keywords_ar: ["لمبة","ضوء أحمر","فحص","كود خطأ","دياجنوستيك","check engine","ضوء تحذير","أيقونة على الداشبورد","لمبة مضاءة","رموز خطأ"],
    keywords_en: ["check engine","warning light","fault code","obd","scan","diagnostic","dashboard light","engine light","error code","malfunction","indicator","service light","ecu"],
    result: { category:"diagnostics", urgency:"caution", diagnosis_ar:"ضوء تحذير مضيء — محتاج فحص كمبيوتر لقراءة كود الخطأ.", diagnosis_en:"Warning light on — needs a computer diagnostic scan to read the fault code.", cost_ar:"تكلفة متوقعة: ٢٠٠ – ٥٠٠ جنيه للفحص", cost_en:"Estimated cost: 200 – 500 EGP for scan" },
  },
  {
    keywords_ar: ["ناقل حركة","فيتيس","تعشيق","صندوق سرعات","مش بيدخل فيتيس","الجير تقيل","كلاتش بالي","صوت في الجير","الكلاتش ضعيف"],
    keywords_en: ["gearbox","transmission","gear","clutch","won't shift","slipping gear","hard to shift","grinding gear","clutch slip","gear noise","gear stuck"],
    result: { category:"mechanical", urgency:"caution", diagnosis_ar:"مشكلة في ناقل الحركة أو الكلاتش. لو السيارة مش بتتحرك — لا تكمل القيادة.", diagnosis_en:"Gearbox or clutch issue. If the car won't move — do not continue driving.", cost_ar:"تكلفة متوقعة: ١٠٠٠ – ٨٠٠٠ جنيه", cost_en:"Estimated cost: 1,000 – 8,000 EGP" },
  },
  {
    keywords_ar: ["تعليق","هزة","اهتزاز","صدمات","بليات","العجلة بترتجف","اهتزاز عند السرعة","المقود بيهز"],
    keywords_en: ["suspension","vibration","shake","shaking","bumpy","rough ride","shock absorber","strut","spring","steering wheel shake","vibrates at speed","bounce"],
    result: { category:"mechanical", urgency:"caution", diagnosis_ar:"مشكلة في التعليق أو الصدمات. الاهتزاز عند السرعة ممكن يكون من موازنة العجلات.", diagnosis_en:"Suspension or shock absorber issue. Vibration at speed may be wheel balancing.", cost_ar:"تكلفة متوقعة: ٥٠٠ – ٣٠٠٠ جنيه", cost_en:"Estimated cost: 500 – 3,000 EGP" },
  },
];

function diagnoseScored(input: string, lang: Lang): { result: DiagResult; confidence: "high"|"medium"|"low" } | null {
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
  return { result: best.result, confidence: best.score >= 4 ? "high" : best.score >= 2 ? "medium" : "low" };
}

const URGENCY = {
  safe:    { color:"#10B981", icon:"✅", ar:"آمن للقيادة",       en:"Safe to drive" },
  caution: { color:"#F59E0B", icon:"⚠️", ar:"تعامل بحذر",        en:"Drive with caution" },
  stop:    { color:"#EF4444", icon:"🛑", ar:"لا تقود السيارة",  en:"Do not drive" },
};
const CONFIDENCE = {
  high:   { ar:"تشخيص دقيق",  en:"High confidence" },
  medium: { ar:"تشخيص محتمل", en:"Likely match" },
  low:    { ar:"تشخيص جزئي",  en:"Partial match" },
};

// ─────────────────────────── CAR PARTS SYSTEM ────────────────────────────────
//
// Base prices are calibrated to the most common cars in Egypt (Lada Granta,
// Kia Cerato, Toyota Corolla). Each car model has a "partsFactor" that
// multiplies the base price — so a BMW part costs 4–6× more than a Kia part.
//
// Data sources: Wekalet el-Birka (Ataba), El-Geish St Heliopolis market,
// CarQuote.com.eg, Jumia Egypt, OLX listings — averaged 2024-2025.
// ─────────────────────────────────────────────────────────────────────────────

type PartCategory =
  | "engine" | "brakes" | "suspension" | "electrical"
  | "ac" | "filters_fluids" | "transmission" | "exhaust" | "body_glass";

type CarPart = {
  id: string; name_ar: string; name_en: string; category: PartCategory;
  // Base prices in EGP for a mid-range common car (Kia Cerato / Toyota Corolla).
  // Actual price = base * car's partsFactor (see CAR_MODELS below).
  base_local:    [number,number] | null;  // local/Chinese aftermarket
  base_oem:      [number,number] | null;  // OEM genuine
  base_imported: [number,number] | null;  // European/Japanese imported
  note_ar?: string; note_en?: string;
};

// All prices in EGP, calibrated to 2024-2025 Egyptian market.
const PARTS_DB: CarPart[] = [
  // ── ENGINE ──────────────────────────────────────────────────────────────────
  { id:"eng-sparkplug",      name_ar:"شمعة الإشعال",              name_en:"Spark Plug",                 category:"engine",         base_local:[35,80],      base_oem:[80,200],     base_imported:[180,400],  note_ar:"سعر لشمعة واحدة — معظم السيارات ٤ شمعات", note_en:"Per plug — most cars need 4" },
  { id:"eng-oilfilter",      name_ar:"فلتر الزيت",                name_en:"Oil Filter",                 category:"engine",         base_local:[45,90],      base_oem:[90,200],     base_imported:[160,350],  note_ar:"يتغير مع كل تغيير زيت", note_en:"Changed with every oil service" },
  { id:"eng-airfilter",      name_ar:"فلتر الهواء",               name_en:"Air Filter",                 category:"engine",         base_local:[60,140],     base_oem:[140,380],    base_imported:[280,650],  },
  { id:"eng-fuelfilter",     name_ar:"فلتر البنزين",              name_en:"Fuel Filter",                category:"engine",         base_local:[80,200],     base_oem:[200,480],    base_imported:[350,850],  },
  { id:"eng-ignitioncoil",   name_ar:"كويل الإشعال",              name_en:"Ignition Coil",              category:"engine",         base_local:[200,500],    base_oem:[500,1400],   base_imported:[900,2800], note_ar:"سعر لكويل واحد", note_en:"Per coil" },
  { id:"eng-timingbelt",     name_ar:"سير التوقيت",               name_en:"Timing Belt",                category:"engine",         base_local:[300,600],    base_oem:[650,1700],   base_imported:[1400,3200],note_ar:"يتغير كل ٦٠–٩٠ ألف كم", note_en:"Replace every 60–90k km" },
  { id:"eng-timingchain",    name_ar:"طقم سلسلة التوقيت",         name_en:"Timing Chain Kit",           category:"engine",         base_local:[1200,2400],  base_oem:[2800,6500],  base_imported:[5000,11000],note_ar:"يشمل الجيت والتنشنر", note_en:"Includes guides and tensioner" },
  { id:"eng-waterpump",      name_ar:"طرمبة الماء",               name_en:"Water Pump",                 category:"engine",         base_local:[350,680],    base_oem:[750,1900],   base_imported:[1400,3800],},
  { id:"eng-thermostat",     name_ar:"ترموستات",                  name_en:"Thermostat",                 category:"engine",         base_local:[80,200],     base_oem:[240,580],    base_imported:[380,1100], },
  { id:"eng-radiator",       name_ar:"رادياتير التبريد",           name_en:"Radiator",                   category:"engine",         base_local:[700,1500],   base_oem:[1900,4800],  base_imported:[3800,9500],},
  { id:"eng-headgasket",     name_ar:"جوانة رأس السيلندر",        name_en:"Head Gasket",                category:"engine",         base_local:[400,900],    base_oem:[1100,2800],  base_imported:[2400,5800],note_ar:"التركيب ٢٠٠٠–٦٠٠٠ جنيه إضافية", note_en:"Labor adds 2,000–6,000 EGP" },
  { id:"eng-enginemount",    name_ar:"ماونت المحرك",              name_en:"Engine Mount",               category:"engine",         base_local:[200,450],    base_oem:[480,1150],   base_imported:[850,2400], note_ar:"السيارة ٢–٤ ماونتات", note_en:"Cars have 2–4 mounts" },
  { id:"eng-enginebearing",  name_ar:"برينجات المحرك (طقم)",      name_en:"Engine Bearing Set",         category:"engine",         base_local:[600,1400],   base_oem:[1700,4200],  base_imported:[2900,7500],},
  // ── BRAKES ──────────────────────────────────────────────────────────────────
  { id:"brk-pads-front",     name_ar:"تيل فرامل أمامي (طقم)",    name_en:"Front Brake Pads (Set)",     category:"brakes",         base_local:[200,480],    base_oem:[480,1150],   base_imported:[850,2400], note_ar:"طقم = ٤ قطع للمحور الأمامي", note_en:"Set = 4 pads for front axle" },
  { id:"brk-pads-rear",      name_ar:"تيل فرامل خلفي (طقم)",     name_en:"Rear Brake Pads (Set)",      category:"brakes",         base_local:[180,430],    base_oem:[430,1050],   base_imported:[770,2100], },
  { id:"brk-disc-front",     name_ar:"قرص فرامل أمامي",          name_en:"Front Brake Disc",           category:"brakes",         base_local:[290,680],    base_oem:[680,1700],   base_imported:[1150,3300],note_ar:"سعر لقرص واحد — الأمامي ٢ قرص", note_en:"Per disc — front has 2 discs" },
  { id:"brk-disc-rear",      name_ar:"قرص فرامل خلفي",           name_en:"Rear Brake Disc",            category:"brakes",         base_local:[270,620],    base_oem:[620,1500],   base_imported:[1050,2850],},
  { id:"brk-caliper",        name_ar:"كاليبر الفرامل",           name_en:"Brake Caliper",              category:"brakes",         base_local:[480,1150],   base_oem:[1150,2800],  base_imported:[1900,5700],note_ar:"سعر لكاليبر واحد", note_en:"Per caliper" },
  { id:"brk-master",         name_ar:"ماستر سيلندر الفرامل",     name_en:"Brake Master Cylinder",      category:"brakes",         base_local:[380,860],    base_oem:[860,2400],   base_imported:[1700,4800],},
  { id:"brk-abs-sensor",     name_ar:"سنسور ABS",                name_en:"ABS Wheel Speed Sensor",     category:"brakes",         base_local:[190,480],    base_oem:[480,1400],   base_imported:[860,2850], note_ar:"سعر لسنسور واحد", note_en:"Per sensor" },
  // ── SUSPENSION ──────────────────────────────────────────────────────────────
  { id:"sus-shock-front",    name_ar:"صدام أمامي",               name_en:"Front Shock Absorber",       category:"suspension",     base_local:[400,860],    base_oem:[960,2850],   base_imported:[1900,5700],note_ar:"يُفضَّل تغيير اثنين مع بعض", note_en:"Best replaced in pairs" },
  { id:"sus-shock-rear",     name_ar:"صدام خلفي",                name_en:"Rear Shock Absorber",        category:"suspension",     base_local:[340,770],    base_oem:[860,2400],   base_imported:[1700,4800],},
  { id:"sus-balljoints",     name_ar:"بليات التعليق (زوج)",      name_en:"Ball Joints (pair)",         category:"suspension",     base_local:[290,670],    base_oem:[670,1900],   base_imported:[1430,3800],},
  { id:"sus-tierod",         name_ar:"تاي رود (قضيب التوجيه)",   name_en:"Tie Rod End",                category:"suspension",     base_local:[145,380],    base_oem:[380,960],    base_imported:[670,1900], },
  { id:"sus-stabilizer",     name_ar:"مطاط استابيلايزر (طقم)",   name_en:"Stabilizer Bar Bush Set",    category:"suspension",     base_local:[75,190],     base_oem:[190,570],    base_imported:[380,1150], },
  { id:"sus-strut-mount",    name_ar:"ستراب الصدام العلوي",       name_en:"Strut Top Mount / Bearing",  category:"suspension",     base_local:[145,380],    base_oem:[380,1150],   base_imported:[770,2400], },
  { id:"sus-control-arm",    name_ar:"كنترول آرم",               name_en:"Control Arm",                category:"suspension",     base_local:[480,1150],   base_oem:[1150,3300],  base_imported:[2400,6700],},
  // ── ELECTRICAL ──────────────────────────────────────────────────────────────
  { id:"elc-battery",        name_ar:"بطارية السيارة",           name_en:"Car Battery",                category:"electrical",     base_local:[900,1750],   base_oem:[1750,3400],  base_imported:[2900,6700],note_ar:"السعر يشمل التركيب", note_en:"Usually includes fitting" },
  { id:"elc-alternator",     name_ar:"دينامو الشحن",             name_en:"Alternator",                 category:"electrical",     base_local:[770,1900],   base_oem:[1900,4800],  base_imported:[3800,9500],note_ar:"مستعمل متجدد ٦٠٠–١٢٠٠ جنيه", note_en:"Refurbished: 600–1,200 EGP" },
  { id:"elc-starter",        name_ar:"موتور الاستارت",           name_en:"Starter Motor",              category:"electrical",     base_local:[670,1700],   base_oem:[1700,4300],  base_imported:[3300,8600],note_ar:"مستعمل متجدد ٥٠٠–١٠٠٠ جنيه", note_en:"Refurbished: 500–1,000 EGP" },
  { id:"elc-headbulb",       name_ar:"شمعة إضاءة أمامية",       name_en:"Headlight Bulb",             category:"electrical",     base_local:[50,145],     base_oem:[145,380],    base_imported:[290,860],  note_ar:"HID/LED قد تصل ٢٠٠٠+ جنيه", note_en:"HID/LED may cost 2,000+ EGP" },
  { id:"elc-headunit",       name_ar:"شاشة / هيد يونيت",        name_en:"Car Head Unit / Screen",     category:"electrical",     base_local:[1150,3300],  base_oem:null,         base_imported:[3800,14000],note_ar:"أندرويد ٢ دين — حسب المواصفات", note_en:"Android 2-DIN — varies by specs" },
  // ── A/C ─────────────────────────────────────────────────────────────────────
  { id:"ac-compressor",      name_ar:"كمبروسور التكييف",         name_en:"A/C Compressor",             category:"ac",             base_local:[1900,4300],  base_oem:[4800,11500], base_imported:[8600,21000],note_ar:"مستعمل ١٢٠٠–٢٥٠٠ جنيه", note_en:"Used unit: 1,200–2,500 EGP" },
  { id:"ac-condenser",       name_ar:"كوندنسر التكييف",          name_en:"A/C Condenser",              category:"ac",             base_local:[770,1900],   base_oem:[1900,5200],  base_imported:[3800,9500],},
  { id:"ac-evaporator",      name_ar:"إيفابوريتر التكييف",       name_en:"A/C Evaporator",             category:"ac",             base_local:[670,1700],   base_oem:[1700,4800],  base_imported:[3300,8600],},
  { id:"ac-freon",           name_ar:"شحن فريون (خدمة)",         name_en:"Freon Recharge (service)",   category:"ac",             base_local:[190,380],    base_oem:null,         base_imported:null,        note_ar:"شامل الغاز والتركيب", note_en:"Incl. gas and fitting" },
  { id:"ac-cabin-filter",    name_ar:"فلتر كابينة التكييف",      name_en:"Cabin Air Filter",           category:"ac",             base_local:[75,190],     base_oem:[190,480],    base_imported:[330,860],  },
  // ── FILTERS & FLUIDS ────────────────────────────────────────────────────────
  { id:"ff-oil-mineral",     name_ar:"زيت معدني ٤ لتر",          name_en:"Mineral Engine Oil (4L)",    category:"filters_fluids", base_local:[240,430],    base_oem:null,         base_imported:[480,860],  note_ar:"Shell / Mobil / Castrol / Total", note_en:"Shell / Mobil / Castrol / Total" },
  { id:"ff-oil-semi",        name_ar:"زيت نصف تركيبي ٤ لتر",    name_en:"Semi-Synthetic Oil (4L)",    category:"filters_fluids", base_local:null,         base_oem:null,         base_imported:[720,1330], },
  { id:"ff-oil-full",        name_ar:"زيت تركيبي كامل ٤ لتر",   name_en:"Full Synthetic Oil (4L)",    category:"filters_fluids", base_local:null,         base_oem:null,         base_imported:[1050,2100],},
  { id:"ff-gbx-oil",         name_ar:"زيت جيربوكس / لتر",       name_en:"Gearbox / ATF Fluid (1L)",   category:"filters_fluids", base_local:[190,480],    base_oem:null,         base_imported:[480,1430], note_ar:"معظم السيارات تحتاج ٢–٤ لتر", note_en:"Most cars need 2–4 litres" },
  { id:"ff-brake-fluid",     name_ar:"سائل فرامل DOT4 (0.5L)",  name_en:"Brake Fluid DOT4 (0.5L)",    category:"filters_fluids", base_local:[75,145],     base_oem:null,         base_imported:[145,330],  },
  { id:"ff-coolant",         name_ar:"سائل تبريد (لتر)",         name_en:"Coolant / Antifreeze (1L)",  category:"filters_fluids", base_local:[75,170],     base_oem:null,         base_imported:[170,380],  },
  // ── TRANSMISSION ────────────────────────────────────────────────────────────
  { id:"trn-clutch-kit",     name_ar:"طقم كلاتش (قرص+طبق+بلية)",name_en:"Clutch Kit (disc+plate+bearing)",category:"transmission", base_local:[860,1900],  base_oem:[2400,5700],  base_imported:[4300,11500],note_ar:"التركيب ١٥٠٠–٤٠٠٠ جنيه إضافية", note_en:"Labor adds 1,500–4,000 EGP" },
  { id:"trn-driveshaft",     name_ar:"فردة (دراف شافت)",         name_en:"Drive Shaft / CV Axle",      category:"transmission",   base_local:[575,1430],   base_oem:[1430,3800],  base_imported:[2850,7600],},
  { id:"trn-cvjoint",        name_ar:"جوانتي الفردة (CV Boot)",  name_en:"CV Joint Boot Kit",          category:"transmission",   base_local:[95,285],     base_oem:[285,760],    base_imported:[570,1710], },
  // ── EXHAUST ─────────────────────────────────────────────────────────────────
  { id:"exh-catalytic",      name_ar:"كاتالتيك كنفرتر",          name_en:"Catalytic Converter",        category:"exhaust",        base_local:[1430,3800],  base_oem:[4800,14300], base_imported:null,        note_ar:"أصلي أغلى بكثير من البديل", note_en:"OEM much pricier than aftermarket" },
  { id:"exh-muffler",        name_ar:"شكمان (صامت العادم)",      name_en:"Exhaust Muffler / Silencer", category:"exhaust",        base_local:[480,1150],   base_oem:[1150,2850],  base_imported:[2400,5700],},
  { id:"exh-o2sensor",       name_ar:"سنسور أكسجين (لمبدا)",     name_en:"Oxygen / Lambda Sensor",     category:"exhaust",        base_local:[285,670],    base_oem:[670,1900],   base_imported:[1430,3800],},
  // ── BODY & GLASS ────────────────────────────────────────────────────────────
  { id:"bdy-windscreen",     name_ar:"زجاج أمامي (ونيت)",        name_en:"Windscreen / Windshield",    category:"body_glass",     base_local:[760,1900],   base_oem:[2400,6700],  base_imported:[4800,14300],note_ar:"بدون تركيب — التركيب ٣٠٠–٦٠٠ جنيه", note_en:"Excl. fitting (300–600 EGP)" },
  { id:"bdy-sidewindow",     name_ar:"زجاج جانبي",               name_en:"Side Window Glass",          category:"body_glass",     base_local:[380,860],    base_oem:[860,2400],   base_imported:[1900,5700],},
  { id:"bdy-rearwindow",     name_ar:"زجاج خلفي",                name_en:"Rear Window Glass",          category:"body_glass",     base_local:[570,1430],   base_oem:[1430,3800],  base_imported:[2850,7600],},
  { id:"bdy-bumper-f",       name_ar:"بامبر أمامي",              name_en:"Front Bumper",               category:"body_glass",     base_local:[480,1430],   base_oem:[1430,4800],  base_imported:[3800,11500],note_ar:"بدون دهان — الدهان ٨٠٠–٢٠٠٠ جنيه", note_en:"Unpainted — paint adds 800–2,000 EGP" },
  { id:"bdy-hood",           name_ar:"كبوت الموتور",             name_en:"Engine Hood / Bonnet",       category:"body_glass",     base_local:[1150,2850],  base_oem:[3300,8600],  base_imported:[6700,19000],note_ar:"بدون دهان", note_en:"Unpainted" },
];

// ─── Car models with price factor ─────────────────────────────────────────────
//
// partsFactor: multiplier applied to base part prices.
//   1.0 = Kia Cerato / Toyota Corolla (the calibration baseline)
//   <1.0 = cheaper parts (Chinese brands, Lada)
//   >1.0 = more expensive parts (German, French, Japanese luxury)
//
// yearFactor: extra multiplier for older cars (harder to find parts)
//   - 2018–present: 1.0 (easy availability)
//   - 2012–2017: 1.1
//   - 2006–2011: 1.25
//   - 2000–2005: 1.4
//   - before 2000: 1.6
// ─────────────────────────────────────────────────────────────────────────────

type CarModel = {
  brand: string; brand_ar: string; model: string; model_ar: string;
  years: string; partsFactor: number;
  note_ar?: string; note_en?: string;
};

const CAR_MODELS: CarModel[] = [
  // ── LADA ────────────────────────────────────────────────────────────────────
  { brand:"Lada", brand_ar:"لادا", model:"Granta",     model_ar:"جرانتا",     years:"2014–present", partsFactor:0.55, note_ar:"قطع رخيصة ومتوفرة بكثرة", note_en:"Very affordable & widely available parts" },
  { brand:"Lada", brand_ar:"لادا", model:"Vesta",      model_ar:"فيستا",      years:"2017–present", partsFactor:0.60, },
  { brand:"Lada", brand_ar:"لادا", model:"Niva",       model_ar:"نيفا",       years:"2000–present", partsFactor:0.65, note_ar:"قطع نيفا متوفرة جداً", note_en:"Niva parts are widely available" },
  { brand:"Lada", brand_ar:"لادا", model:"Priora",     model_ar:"بريورا",     years:"2007–2018",    partsFactor:0.55, },
  // ── KIA ─────────────────────────────────────────────────────────────────────
  { brand:"Kia",  brand_ar:"كيا",  model:"Cerato",     model_ar:"سيراتو",     years:"2004–present", partsFactor:1.00, note_ar:"الأكثر شيوعاً في مصر — قطع متوفرة بسهولة", note_en:"Most common in Egypt — easy parts availability" },
  { brand:"Kia",  brand_ar:"كيا",  model:"Sportage",   model_ar:"سبورتاج",    years:"2005–present", partsFactor:1.10, },
  { brand:"Kia",  brand_ar:"كيا",  model:"Rio",        model_ar:"ريو",        years:"2005–present", partsFactor:0.90, },
  { brand:"Kia",  brand_ar:"كيا",  model:"K5 / Optima",model_ar:"K5 / أوبتيما",years:"2010–present",partsFactor:1.20, },
  { brand:"Kia",  brand_ar:"كيا",  model:"Picanto",    model_ar:"بيكانتو",    years:"2004–present", partsFactor:0.85, },
  { brand:"Kia",  brand_ar:"كيا",  model:"Sorento",    model_ar:"سورينتو",    years:"2002–present", partsFactor:1.30, },
  // ── TOYOTA ──────────────────────────────────────────────────────────────────
  { brand:"Toyota", brand_ar:"تويوتا", model:"Corolla",  model_ar:"كورولا",   years:"1997–present", partsFactor:1.05, note_ar:"قطع متوفرة على نطاق واسع", note_en:"Widely available parts" },
  { brand:"Toyota", brand_ar:"تويوتا", model:"Yaris",    model_ar:"ياريس",    years:"2005–present", partsFactor:0.95, },
  { brand:"Toyota", brand_ar:"تويوتا", model:"Camry",    model_ar:"كامري",    years:"2000–present", partsFactor:1.20, },
  { brand:"Toyota", brand_ar:"تويوتا", model:"Land Cruiser", model_ar:"لاند كروزر", years:"1990–present", partsFactor:2.20, note_ar:"قطع غالية — ورش متخصصة فقط", note_en:"Expensive parts — specialist workshops only" },
  { brand:"Toyota", brand_ar:"تويوتا", model:"Fortuner", model_ar:"فورتشنر",  years:"2005–present", partsFactor:1.80, },
  { brand:"Toyota", brand_ar:"تويوتا", model:"Hilux",    model_ar:"هايلوكس",  years:"2000–present", partsFactor:1.60, },
  { brand:"Toyota", brand_ar:"تويوتا", model:"RAV4",     model_ar:"راف ٤",    years:"2000–present", partsFactor:1.40, },
  // ── HYUNDAI ─────────────────────────────────────────────────────────────────
  { brand:"Hyundai", brand_ar:"هيونداي", model:"Elantra",    model_ar:"إيلانترا",  years:"2000–present", partsFactor:0.95, },
  { brand:"Hyundai", brand_ar:"هيونداي", model:"Accent",     model_ar:"أكسنت",     years:"2000–present", partsFactor:0.85, note_ar:"شائع وقطعه سهلة", note_en:"Common with easy parts" },
  { brand:"Hyundai", brand_ar:"هيونداي", model:"Tucson",     model_ar:"توسان",     years:"2004–present", partsFactor:1.15, },
  { brand:"Hyundai", brand_ar:"هيونداي", model:"Santa Fe",   model_ar:"سانتا في",  years:"2001–present", partsFactor:1.40, },
  { brand:"Hyundai", brand_ar:"هيونداي", model:"i10",        model_ar:"آي ١٠",     years:"2007–present", partsFactor:0.80, },
  { brand:"Hyundai", brand_ar:"هيونداي", model:"i20",        model_ar:"آي ٢٠",     years:"2008–present", partsFactor:0.88, },
  // ── CHEVROLET / GM ──────────────────────────────────────────────────────────
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Lanos",   model_ar:"لانوس",   years:"1997–2016",    partsFactor:0.70, note_ar:"قطع كتير في السوق", note_en:"Plenty of parts in market" },
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Spark",   model_ar:"سبارك",   years:"2005–present", partsFactor:0.75, },
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Aveo",    model_ar:"أفيو",    years:"2002–present", partsFactor:0.85, },
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Cruze",   model_ar:"كروز",    years:"2009–present", partsFactor:1.10, },
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Captiva", model_ar:"كابتيفا", years:"2006–2019",    partsFactor:1.35, },
  { brand:"Chevrolet", brand_ar:"شيفروليه", model:"Optra",   model_ar:"أوبترا",  years:"2002–2012",    partsFactor:0.90, },
  // ── NISSAN ──────────────────────────────────────────────────────────────────
  { brand:"Nissan", brand_ar:"نيسان", model:"Sunny",    model_ar:"صني",      years:"2006–present", partsFactor:0.95, note_ar:"شائع جداً في مصر", note_en:"Very common in Egypt" },
  { brand:"Nissan", brand_ar:"نيسان", model:"Sentra",   model_ar:"سنترا",    years:"2000–present", partsFactor:1.00, },
  { brand:"Nissan", brand_ar:"نيسان", model:"Qashqai",  model_ar:"قشقاي",    years:"2007–present", partsFactor:1.30, },
  { brand:"Nissan", brand_ar:"نيسان", model:"X-Trail",  model_ar:"إكس ترايل",years:"2001–present", partsFactor:1.40, },
  { brand:"Nissan", brand_ar:"نيسان", model:"Patrol",   model_ar:"باترول",   years:"1994–present", partsFactor:2.00, note_ar:"قطع غالية ومتخصصة", note_en:"Expensive, specialised parts" },
  { brand:"Nissan", brand_ar:"نيسان", model:"Navara",   model_ar:"نافارا",   years:"2005–present", partsFactor:1.55, },
  // ── MITSUBISHI ──────────────────────────────────────────────────────────────
  { brand:"Mitsubishi", brand_ar:"ميتسوبيشي", model:"Lancer",     model_ar:"لانسر",     years:"2000–2018",    partsFactor:1.00, },
  { brand:"Mitsubishi", brand_ar:"ميتسوبيشي", model:"Galant",     model_ar:"جالانت",    years:"1996–2012",    partsFactor:1.05, },
  { brand:"Mitsubishi", brand_ar:"ميتسوبيشي", model:"Pajero",     model_ar:"باجيرو",    years:"1991–present", partsFactor:1.90, note_ar:"قطع أصلية تستورد", note_en:"OEM parts mostly imported" },
  { brand:"Mitsubishi", brand_ar:"ميتسوبيشي", model:"Eclipse Cross",model_ar:"إكليبس كروس",years:"2017–present",partsFactor:1.50,},
  // ── BMW ─────────────────────────────────────────────────────────────────────
  { brand:"BMW", brand_ar:"بي إم دبليو", model:"3 Series (E46/E90/F30/G20)", model_ar:"الفئة الثالثة",  years:"1998–present", partsFactor:3.80, note_ar:"قطع أصلية بي إم دبليو باهظة جداً", note_en:"BMW OEM parts are very expensive" },
  { brand:"BMW", brand_ar:"بي إم دبليو", model:"5 Series (E39/E60/F10/G30)", model_ar:"الفئة الخامسة",  years:"1995–present", partsFactor:4.50, },
  { brand:"BMW", brand_ar:"بي إم دبليو", model:"X5 (E53/E70/F15/G05)",       model_ar:"إكس ٥",          years:"1999–present", partsFactor:5.50, },
  { brand:"BMW", brand_ar:"بي إم دبليو", model:"1 Series (E87/F20)",         model_ar:"الفئة الأولى",   years:"2004–present", partsFactor:3.20, },
  // ── MERCEDES-BENZ ───────────────────────────────────────────────────────────
  { brand:"Mercedes-Benz", brand_ar:"مرسيدس", model:"C-Class (W202/W203/W204/W205)", model_ar:"C كلاس",    years:"1993–present", partsFactor:4.20, note_ar:"أشغال التركيب أعلى بكثير من اليابانية", note_en:"Labor costs much higher than Japanese" },
  { brand:"Mercedes-Benz", brand_ar:"مرسيدس", model:"E-Class (W210/W211/W212/W213)", model_ar:"E كلاس",    years:"1995–present", partsFactor:5.00, },
  { brand:"Mercedes-Benz", brand_ar:"مرسيدس", model:"GLC / ML",                       model_ar:"GLC / ML",  years:"2005–present", partsFactor:6.00, },
  { brand:"Mercedes-Benz", brand_ar:"مرسيدس", model:"A-Class (W176/W177)",            model_ar:"A كلاس",    years:"2012–present", partsFactor:3.80, },
  // ── VOLKSWAGEN ──────────────────────────────────────────────────────────────
  { brand:"Volkswagen", brand_ar:"فولكسفاغن", model:"Golf (Mk5/Mk6/Mk7)",  model_ar:"جولف",     years:"2003–present", partsFactor:2.80, },
  { brand:"Volkswagen", brand_ar:"فولكسفاغن", model:"Passat (B6/B7/B8)",   model_ar:"باسات",    years:"2005–present", partsFactor:3.20, },
  { brand:"Volkswagen", brand_ar:"فولكسفاغن", model:"Tiguan",              model_ar:"تيجوان",   years:"2007–present", partsFactor:3.50, },
  { brand:"Volkswagen", brand_ar:"فولكسفاغن", model:"Polo",                model_ar:"بولو",     years:"2002–present", partsFactor:2.50, },
  // ── PEUGEOT ─────────────────────────────────────────────────────────────────
  { brand:"Peugeot", brand_ar:"بيجو", model:"206",  model_ar:"٢٠٦",  years:"2000–2015",    partsFactor:1.10, note_ar:"شائع جداً وقطعه متوفرة", note_en:"Very common, parts widely available" },
  { brand:"Peugeot", brand_ar:"بيجو", model:"207",  model_ar:"٢٠٧",  years:"2006–2015",    partsFactor:1.20, },
  { brand:"Peugeot", brand_ar:"بيجو", model:"301",  model_ar:"٣٠١",  years:"2012–present", partsFactor:1.15, },
  { brand:"Peugeot", brand_ar:"بيجو", model:"308",  model_ar:"٣٠٨",  years:"2007–present", partsFactor:1.40, },
  { brand:"Peugeot", brand_ar:"بيجو", model:"2008", model_ar:"٢٠٠٨", years:"2013–present", partsFactor:1.50, },
  { brand:"Peugeot", brand_ar:"بيجو", model:"3008", model_ar:"٣٠٠٨", years:"2009–present", partsFactor:1.70, },
  // ── RENAULT ─────────────────────────────────────────────────────────────────
  { brand:"Renault", brand_ar:"رينو", model:"Symbol / Thalia", model_ar:"سيمبول", years:"2000–present", partsFactor:0.90, note_ar:"شائع جداً في مصر", note_en:"Very common in Egypt" },
  { brand:"Renault", brand_ar:"رينو", model:"Clio",            model_ar:"كليو",    years:"2000–present", partsFactor:1.00, },
  { brand:"Renault", brand_ar:"رينو", model:"Duster",          model_ar:"داستر",   years:"2010–present", partsFactor:1.10, },
  { brand:"Renault", brand_ar:"رينو", model:"Megane",          model_ar:"ميجان",   years:"2002–present", partsFactor:1.20, },
  { brand:"Renault", brand_ar:"رينو", model:"Koleos",          model_ar:"كوليوس",  years:"2008–present", partsFactor:1.50, },
  // ── HONDA ───────────────────────────────────────────────────────────────────
  { brand:"Honda", brand_ar:"هوندا", model:"Civic",   model_ar:"سيفيك",  years:"2001–present", partsFactor:1.15, },
  { brand:"Honda", brand_ar:"هوندا", model:"Accord",  model_ar:"أكورد",  years:"1998–present", partsFactor:1.40, },
  { brand:"Honda", brand_ar:"هوندا", model:"CR-V",    model_ar:"CR-V",   years:"2002–present", partsFactor:1.60, },
  { brand:"Honda", brand_ar:"هوندا", model:"Jazz/Fit",model_ar:"جاز/فيت",years:"2001–present", partsFactor:1.00, },
  // ── MG ──────────────────────────────────────────────────────────────────────
  { brand:"MG", brand_ar:"إم جي", model:"MG5",  model_ar:"إم جي ٥",  years:"2021–present", partsFactor:1.00, note_ar:"قطع متوفرة — انتشار سريع في مصر", note_en:"Parts becoming widely available in Egypt" },
  { brand:"MG", brand_ar:"إم جي", model:"MG6",  model_ar:"إم جي ٦",  years:"2021–present", partsFactor:1.10, },
  { brand:"MG", brand_ar:"إم جي", model:"ZS",   model_ar:"ZS",       years:"2017–present", partsFactor:1.05, },
  { brand:"MG", brand_ar:"إم جي", model:"RX5",  model_ar:"RX5",      years:"2016–present", partsFactor:1.15, },
  { brand:"MG", brand_ar:"إم جي", model:"HS",   model_ar:"HS",       years:"2018–present", partsFactor:1.20, },
  // ── CHERY ───────────────────────────────────────────────────────────────────
  { brand:"Chery", brand_ar:"شيري", model:"Tiggo 4 Pro",  model_ar:"تيجو ٤ برو",  years:"2020–present", partsFactor:0.80, },
  { brand:"Chery", brand_ar:"شيري", model:"Tiggo 7 Pro",  model_ar:"تيجو ٧ برو",  years:"2020–present", partsFactor:0.90, },
  { brand:"Chery", brand_ar:"شيري", model:"Arrizo 5/6",   model_ar:"أريزو ٥/٦",   years:"2015–present", partsFactor:0.75, },
  // ── GEELY ───────────────────────────────────────────────────────────────────
  { brand:"Geely", brand_ar:"جيلي", model:"Emgrand EC7",  model_ar:"إيمجراند EC7",years:"2009–present", partsFactor:0.75, },
  { brand:"Geely", brand_ar:"جيلي", model:"Coolray",       model_ar:"كولراي",      years:"2019–present", partsFactor:0.85, },
  { brand:"Geely", brand_ar:"جيلي", model:"Monjaro",       model_ar:"مونجارو",     years:"2022–present", partsFactor:1.00, },
  // ── SEAT / SKODA ────────────────────────────────────────────────────────────
  { brand:"Seat",  brand_ar:"سيات",  model:"Leon / Ibiza", model_ar:"ليون / إيبيزا",years:"2003–present", partsFactor:2.60, },
  { brand:"Skoda", brand_ar:"سكودا", model:"Octavia",      model_ar:"أوكتافيا",    years:"2004–present", partsFactor:2.70, },
  { brand:"Skoda", brand_ar:"سكودا", model:"Fabia",        model_ar:"فابيا",       years:"2000–present", partsFactor:2.40, },
  // ── OPEL ────────────────────────────────────────────────────────────────────
  { brand:"Opel", brand_ar:"أوبل", model:"Astra",   model_ar:"أسترا",   years:"2000–present", partsFactor:1.30, },
  { brand:"Opel", brand_ar:"أوبل", model:"Corsa",   model_ar:"كورسا",   years:"2000–present", partsFactor:1.20, },
  { brand:"Opel", brand_ar:"أوبل", model:"Vectra",  model_ar:"فيكترا",  years:"1995–2008",    partsFactor:1.35, },
  { brand:"Opel", brand_ar:"أوبل", model:"Zafira",  model_ar:"زافيرا",  years:"1999–present", partsFactor:1.40, },
];

const BRANDS = [...new Set(CAR_MODELS.map(c => c.brand))].sort();

// Year range buckets
const YEAR_RANGES = [
  { id:"2020+",     ar:"٢٠٢٠ وما بعد", en:"2020 and newer", factor:1.00 },
  { id:"2015-2019", ar:"٢٠١٥ – ٢٠١٩",  en:"2015 – 2019",     factor:1.05 },
  { id:"2010-2014", ar:"٢٠١٠ – ٢٠١٤",  en:"2010 – 2014",     factor:1.15 },
  { id:"2005-2009", ar:"٢٠٠٥ – ٢٠٠٩",  en:"2005 – 2009",     factor:1.28 },
  { id:"2000-2004", ar:"٢٠٠٠ – ٢٠٠٤",  en:"2000 – 2004",     factor:1.45 },
  { id:"pre-2000",  ar:"قبل ٢٠٠٠",      en:"Before 2000",     factor:1.65 },
];

type PartTier = "local" | "oem" | "imported";
const TIER_LABELS: Record<PartTier,{ar:string;en:string;color:string}> = {
  local:    { ar:"محلي / صيني",                en:"Local / Chinese",       color:"#F59E0B" },
  oem:      { ar:"OEM أصلي",                   en:"OEM Genuine",           color:"#10B981" },
  imported: { ar:"مستورد أوروبي / ياباني",     en:"European / Japanese",   color:"#6366F1" },
};

const PART_CATEGORIES: { id:PartCategory; icon:string; ar:string; en:string }[] = [
  { id:"engine",         icon:"⚙️",  ar:"محرك",           en:"Engine" },
  { id:"brakes",         icon:"🛑",  ar:"فرامل",          en:"Brakes" },
  { id:"suspension",     icon:"🔩",  ar:"تعليق",          en:"Suspension" },
  { id:"electrical",     icon:"⚡",  ar:"كهرباء",         en:"Electrical" },
  { id:"ac",             icon:"❄️",  ar:"تكييف",          en:"A/C" },
  { id:"filters_fluids", icon:"🧪",  ar:"فلاتر وزيوت",   en:"Filters & Fluids" },
  { id:"transmission",   icon:"🔄",  ar:"ناقل حركة",      en:"Transmission" },
  { id:"exhaust",        icon:"💨",  ar:"عادم",           en:"Exhaust" },
  { id:"body_glass",     icon:"🪟",  ar:"هيكل وزجاج",    en:"Body & Glass" },
];

function applyFactor(base:[number,number]|null, carFactor:number, yearFactor:number): [number,number]|null {
  if (!base) return null;
  const f = carFactor * yearFactor;
  return [Math.round(base[0] * f / 10) * 10, Math.round(base[1] * f / 10) * 10];
}

function fmtEGP(n:number) {
  if (n >= 1000) return `${Math.round(n/100)/10}K`;
  return n.toLocaleString();
}
function fmtRange(r:[number,number]) { return `${fmtEGP(r[0])} – ${fmtEGP(r[1])}`; }

// ─── Inline SVG Warsha logo ────────────────────────────────────────────────────
// Used everywhere in place of /Warsha_Logo.png so it always displays correctly.
// This is a faithful recreation of the uploaded logo:
//   • "Warsha" in petrol teal bold text
//   • The W letterform has a wrench head integrated
//   • Thin car silhouette outline above in sage/grey-green
function WarshaLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Warsha logo">
      {/* Car silhouette outline — thin sage line */}
      <g stroke="#6E7F77" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
        {/* car body */}
        <path d="M15 68 Q16 56 28 53 L42 47 Q52 38 68 38 Q82 38 90 45 L102 53 Q110 55 112 63 L112 72 Q112 76 108 76 L100 76" />
        <path d="M15 68 L15 72 Q15 76 19 76 L30 76" />
        {/* wheels outline */}
        <circle cx="38" cy="76" r="10" />
        <circle cx="88" cy="76" r="10" />
        {/* windscreen */}
        <path d="M44 47 L42 53 L78 53 L76 44 Q67 39 54 40 Z" />
      </g>
      {/* "W" with wrench integrated — petrol teal fill */}
      <text
        x="60" y="108"
        fontFamily="Arial Black, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill="#214E4F"
        textAnchor="middle"
        letterSpacing="-1"
      >WARSHA</text>
    </svg>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
function DiagnoseInner() {
  const { theme, lang, toggleTheme, toggleLang, mounted } = useThemeAndLang();
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";
  const searchParams = useSearchParams();

  const [mainTab, setMainTab] = useState<"diagnose"|"parts">("diagnose");

  // diagnose
  const [tab,      setTab]      = useState<"text"|"voice"|"photo">("text");
  const [input,    setInput]    = useState("");
  const [match,    setMatch]    = useState<{result:DiagResult;confidence:"high"|"medium"|"low"}|null>(null);
  const [searched, setSearched] = useState(false);

  // voice
  const [listening,      setListening]      = useState(false);
  const [transcript,     setTranscript]     = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // photo
  const [photoFile,     setPhotoFile]     = useState<File|null>(null);
  const [photoPreview,  setPhotoPreview]  = useState<string|null>(null);
  const [photoDragging, setPhotoDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // parts
  const [partSearch,    setPartSearch]    = useState("");
  const [partCat,       setPartCat]       = useState<PartCategory|"">("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear,  setSelectedYear]  = useState("");
  const [partResults,   setPartResults]   = useState<CarPart[]>([]);
  const [partsSearched, setPartsSearched] = useState(false);
  const [activeTier,    setActiveTier]    = useState<PartTier>("local");

  // Design tokens
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
    rec.onresult = (e:any) => { const t = Array.from(e.results as any[]).map((r:any) => r[0].transcript).join(""); setTranscript(t); };
    rec.onend    = () => setListening(false);
    rec.onerror  = () => setListening(false);
    rec.start();
  }
  function stopListening() { recognitionRef.current?.stop(); setListening(false); }
  function diagnoseFromVoice() { if (!transcript.trim()) return; setInput(transcript); setMatch(diagnoseScored(transcript, lang)); setSearched(true); }
  function handlePhotoFile(file:File) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }

  const modelsForBrand = CAR_MODELS.filter(c => c.brand === selectedBrand);
  const selectedCarModel = CAR_MODELS.find(c => c.brand === selectedBrand && c.model === selectedModel) ?? null;
  const selectedYearRange = YEAR_RANGES.find(y => y.id === selectedYear) ?? null;
  const carFactor   = selectedCarModel?.partsFactor ?? 1.0;
  const yearFactor  = selectedYearRange?.factor ?? 1.0;

  function searchParts(overrideSearch?: string, overrideCat?: PartCategory|"") {
    const q   = (overrideSearch ?? partSearch).toLowerCase().trim();
    const cat = overrideCat !== undefined ? overrideCat : partCat;
    const res = PARTS_DB.filter(p => {
      const matchText = !q || p.name_ar.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q);
      const matchCat  = !cat || p.category === cat;
      return matchText && matchCat;
    });
    setPartResults(res);
    setPartsSearched(true);
  }

  const suggestions = lang === "ar"
    ? ["التكييف مش بيبرد","المحرك بيسخن","صوت طقطقة في المحرك","البطارية ماتت","شرخ في الزجاج","لمبة تحذير على الداشبورد","محتاج تغيير زيت","إطار واطي","صوت في الجير","الفرامل بتطق","هزة في السيارة"]
    : ["AC not cooling","Engine overheating","Engine knocking sounds","Battery dead","Cracked windscreen","Check engine light on","Need oil change","Flat tyre","Gear noise","Brake grinding","Car vibrating"];

  if (!mounted) return null;

  const matchedCat   = match ? (CATEGORIES.find((c:{id:string}) => c.id === match.result.category) ?? null) : null;
  const matchedShops = match ? SHOPS.filter(s => s.category === match.result.category).slice(0,3) : [];

  const selectStyle: React.CSSProperties = {
    padding:"10px 14px", borderRadius:10, border:`1.5px solid ${border}`,
    background:surface, color:textPri, fontSize:13, fontFamily:"inherit",
    outline:"none", cursor:"pointer", direction:dir as React.CSSProperties["direction"], width:"100%",
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${border}`, background:bg, color:textPri,
    fontSize:13, fontFamily:"inherit", outline:"none",
    direction:dir as React.CSSProperties["direction"],
    boxSizing:"border-box",
  };

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:bg, color:textPri, fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Navbar lang={lang} theme={theme} onToggleLang={toggleLang} onToggleTheme={toggleTheme} />

      {/* ── Header ── */}
      <section style={{ padding:"28px 20px 0", background:bgSec, borderBottom:`1px solid ${border}` }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, color:textTer, textDecoration:"none", marginBottom:14 }}
            onMouseEnter={e => (e.currentTarget.style.color = accent)}
            onMouseLeave={e => (e.currentTarget.style.color = textTer)}
          >
            {dir === "rtl" ? "→" : "←"} {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            {/* Logo — SVG inline, no external file dependency */}
            <div style={{ width:52, height:52, borderRadius:16, background:accentMuted, border:`1px solid ${accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
              <WarshaLogo size={42} />
            </div>
            <div>
              <h1 style={{ fontSize:21, fontWeight:900, color:textPri, margin:0, letterSpacing:"-0.02em" }}>
                {lang === "ar" ? "مساعد وَرْشة الذكي" : "Warsha Smart Assistant"}
              </h1>
              <p style={{ fontSize:13, color:textTer, margin:"3px 0 0" }}>
                {lang === "ar" ? "تشخيص مشاكل السيارة وأسعار قطع الغيار" : "Car problem diagnosis & spare parts prices"}
              </p>
            </div>
          </div>
          {/* Main tabs */}
          <div style={{ display:"flex", gap:0 }}>
            {([
              { key:"diagnose", ar:"🔍 تشخيص المشكلة",    en:"🔍 Diagnose Problem" },
              { key:"parts",    ar:"🔧 أسعار قطع الغيار", en:"🔧 Car Parts Prices" },
            ] as const).map(({ key, ar, en }) => (
              <button key={key} onClick={() => setMainTab(key)} style={{
                padding:"13px 20px", fontSize:13, fontWeight:700, fontFamily:"inherit",
                background:"transparent", border:"none", cursor:"pointer",
                color: mainTab === key ? accent : textTer,
                borderBottom: mainTab === key ? `2px solid ${accent}` : "2px solid transparent",
                transition:"all .15s",
              }}>
                {lang === "ar" ? ar : en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── DIAGNOSE TAB ─────────────────── */}
      {mainTab === "diagnose" && (
        <section style={{ padding:"24px 20px" }}>
          <div style={{ maxWidth:760, margin:"0 auto" }}>
            {/* Sub tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:18 }}>
              {([
                { key:"text",  ar:"✍️ نص",   en:"✍️ Text"  },
                { key:"voice", ar:"🎙️ صوت",  en:"🎙️ Voice" },
                { key:"photo", ar:"📷 صورة", en:"📷 Photo" },
              ] as const).map(({ key, ar, en }) => (
                <button key={key} onClick={() => { setTab(key); setSearched(false); setMatch(null); }} style={{
                  padding:"9px 18px", borderRadius:99, fontSize:13, fontWeight:700, fontFamily:"inherit",
                  background: tab === key ? accent : surface,
                  color: tab === key ? "#fff" : textSec,
                  border:`1px solid ${tab === key ? accent : border}`,
                  cursor:"pointer", transition:"all .15s",
                }}>
                  {lang === "ar" ? ar : en}
                </button>
              ))}
            </div>

            {/* TEXT */}
            {tab === "text" && (
              <div>
                <div style={{ background:surface, borderRadius:16, border:`1.5px solid ${border}`, padding:16, marginBottom:12 }}>
                  <textarea value={input}
                    onChange={e => { setInput(e.target.value); setSearched(false); setMatch(null); }}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleDiagnose(); } }}
                    placeholder={lang === "ar"
                      ? "اكتب المشكلة بكلامك... مثلاً: \"المحرك فيه صوت طقطقة وبيسخن على الطريق\""
                      : "Describe freely... e.g. \"Engine knocking and overheating on the highway\""}
                    rows={4}
                    style={{ width:"100%", background:"transparent", border:"none", outline:"none", color:textPri, fontSize:14, fontFamily:"inherit", lineHeight:1.75, resize:"none", direction:dir as React.CSSProperties["direction"], textAlign:dir === "rtl" ? "right" : "left" }}
                  />
                </div>
                <button onClick={() => handleDiagnose()} style={{ width:"100%", padding:14, borderRadius:12, background:accent, color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 16px rgba(33,78,79,.25)` }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = ".87")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  🔍 {lang === "ar" ? "تشخيص الآن" : "Diagnose now"}
                </button>
                {!searched && (
                  <div style={{ marginTop:16 }}>
                    <p style={{ fontSize:11, color:textTer, marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>
                      {lang === "ar" ? "اقتراحات سريعة" : "Quick suggestions"}
                    </p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {suggestions.map(s => (
                        <button key={s} onClick={() => { setInput(s); handleDiagnose(s); }}
                          style={{ padding:"7px 14px", borderRadius:99, fontSize:12, background:accentMuted, border:`1px solid ${accentBorder}`, cursor:"pointer", fontFamily:"inherit", color:accent, fontWeight:500 }}
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
              <div style={{ textAlign:"center" }}>
                {!voiceSupported ? (
                  <div style={{ background:surface, borderRadius:16, border:`1px solid ${border}`, padding:"40px 24px" }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🎙️</div>
                    <p style={{ fontSize:15, fontWeight:700, color:textPri, margin:"0 0 8px" }}>{lang === "ar" ? "المتصفح مش بيدعم التعرف على الصوت" : "Browser doesn't support voice recognition"}</p>
                    <p style={{ fontSize:13, color:textTer, margin:0 }}>{lang === "ar" ? "جرب Chrome أو Safari على الموبايل" : "Try Chrome or Safari on mobile"}</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom:24 }}>
                      <button onClick={listening ? stopListening : startListening} style={{
                        width:100, height:100, borderRadius:"50%",
                        background: listening ? "#EF4444" : accent,
                        border:"none", cursor:"pointer", fontSize:38,
                        display:"inline-flex", alignItems:"center", justifyContent:"center",
                        boxShadow: listening ? "0 0 0 16px rgba(239,68,68,.15),0 0 0 32px rgba(239,68,68,.07)" : `0 4px 24px rgba(33,78,79,.3)`,
                        transition:"all .25s",
                      }}>🎙️</button>
                    </div>
                    <p style={{ fontSize:14, fontWeight:600, color: listening ? "#EF4444" : textSec, marginBottom:8 }}>
                      {listening ? (lang === "ar" ? "🔴 بيسمعك..." : "🔴 Listening...") : (lang === "ar" ? "اضغط المايك واتكلم" : "Tap mic and speak")}
                    </p>
                    {transcript && (
                      <div style={{ background:surface, borderRadius:14, border:`1px solid ${border}`, padding:"14px 18px", marginBottom:14, textAlign:dir === "rtl" ? "right" : "left" }}>
                        <p style={{ fontSize:11, color:textTer, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:".06em" }}>{lang === "ar" ? "ما قلته" : "You said"}</p>
                        <p style={{ fontSize:14, color:textPri, margin:0, lineHeight:1.7 }}>{transcript}</p>
                      </div>
                    )}
                    {transcript && !listening && (
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={() => { setTranscript(""); setSearched(false); setMatch(null); }} style={{ flex:1, padding:12, borderRadius:12, background:"transparent", border:`1px solid ${border}`, color:textSec, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                          {lang === "ar" ? "إعادة" : "Record again"}
                        </button>
                        <button onClick={diagnoseFromVoice} style={{ flex:2, padding:12, borderRadius:12, background:accent, color:"#fff", fontSize:13, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit" }}>
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
                  style={{ borderRadius:16, border:`2px dashed ${photoDragging ? accent : border}`, background: photoDragging ? accentMuted : surface, overflow:"hidden", cursor: photoPreview ? "default" : "pointer", transition:"all .2s", marginBottom:14, minHeight: photoPreview ? "auto" : 200, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}
                >
                  {photoPreview ? (
                    <div style={{ width:"100%", position:"relative" }}>
                      <img src={photoPreview} alt="car problem" style={{ width:"100%", maxHeight:320, objectFit:"contain", display:"block" }} />
                      <button onClick={e => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(null); }} style={{ position:"absolute", top:10, insetInlineEnd:10, width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,.6)", border:"none", color:"#fff", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                    </div>
                  ) : (
                    <div style={{ textAlign:"center", padding:40 }}>
                      <div style={{ fontSize:44, marginBottom:12 }}>📷</div>
                      <p style={{ fontSize:14, fontWeight:700, color:textPri, margin:"0 0 6px" }}>{lang === "ar" ? "التقط أو اختر صورة للمشكلة" : "Take or choose a photo of the problem"}</p>
                      <p style={{ fontSize:12, color:textTer, margin:0 }}>{lang === "ar" ? "اسحب وأفلت أو اضغط للاختيار" : "Drag & drop, or tap to choose"}</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
                {photoPreview && (
                  <div>
                    <div style={{ background: isDark ? "rgba(239,68,68,.08)" : "#FFF7F0", border:`1px solid rgba(239,68,68,.2)`, borderRadius:12, padding:"12px 16px", marginBottom:12 }}>
                      <p style={{ fontSize:12, color:"#EF4444", margin:0, lineHeight:1.6, fontWeight:500 }}>
                        {lang === "ar" ? "⚠️ التشخيص بالصورة يحتاج مراجعة يدوية — ارسل الصورة على الإيميل." : "⚠️ Photo diagnosis requires manual review — send the photo by email."}
                      </p>
                    </div>
                    <a href={`mailto:Warsha.Finder@gmail.com?subject=${encodeURIComponent(lang === "ar" ? "صورة مشكلة سيارة — وَرْشة" : "Car Problem Photo — Warsha")}`}
                      style={{ display:"block", width:"100%", padding:13, borderRadius:12, background:accent, color:"#fff", fontSize:14, fontWeight:700, textDecoration:"none", textAlign:"center" }}>
                      📧 {lang === "ar" ? "إرسال الصورة للمراجعة" : "Send photo for review"}
                    </a>
                    <p style={{ fontSize:11, color:textTer, textAlign:"center", marginTop:8 }}>Warsha.Finder@gmail.com</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Diagnose Results ── */}
            {searched && (
              <div style={{ marginTop:24 }}>
                {!match ? (
                  <div style={{ textAlign:"center", padding:"40px 24px", background:surface, border:`1px solid ${border}`, borderRadius:16 }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🤔</div>
                    <p style={{ fontSize:15, fontWeight:700, color:textPri, margin:"0 0 8px" }}>{lang === "ar" ? "مش قادرين نتعرف على المشكلة" : "Couldn't identify the problem"}</p>
                    <p style={{ fontSize:13, color:textTer, margin:"0 0 20px" }}>{lang === "ar" ? "جرب تكتب أكتر تفاصيل" : "Try adding more details"}</p>
                    <Link href="/workshops" style={{ display:"inline-block", padding:"10px 24px", fontSize:13, background:accent, color:"#fff", borderRadius:10, textDecoration:"none", fontWeight:700 }}>
                      {lang === "ar" ? "تصفح كل الورش" : "Browse all workshops"}
                    </Link>
                  </div>
                ) : matchedCat && (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
                      <div style={{ padding:"14px 18px", background:`${matchedCat.accent}10`, borderBottom:`1px solid ${matchedCat.accent}22`, display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:`${matchedCat.accent}18`, border:`1px solid ${matchedCat.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{matchedCat.icon}</div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:11, color:textTer, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:".07em" }}>{lang === "ar" ? "التخصص المطلوب" : "Specialist needed"}</p>
                          <p style={{ fontSize:15, fontWeight:700, color:matchedCat.accent, margin:0 }}>{lang === "ar" ? matchedCat.ar : matchedCat.en}</p>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99, background:accentMuted, color:accent, border:`1px solid ${accentBorder}`, flexShrink:0 }}>
                          {lang === "ar" ? CONFIDENCE[match.confidence].ar : CONFIDENCE[match.confidence].en}
                        </span>
                      </div>
                      <div style={{ padding:18 }}>
                        {(() => { const u = URGENCY[match.result.urgency]; return (
                          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:99, marginBottom:14, background:`${u.color}12`, border:`1px solid ${u.color}28` }}>
                            <span>{u.icon}</span><span style={{ fontSize:13, fontWeight:700, color:u.color }}>{lang === "ar" ? u.ar : u.en}</span>
                          </div>
                        ); })()}
                        <p style={{ fontSize:14, color:textPri, lineHeight:1.78, margin:"0 0 16px" }}>
                          {lang === "ar" ? match.result.diagnosis_ar : match.result.diagnosis_en}
                        </p>
                        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 15px", borderRadius:12, background: isDark ? "rgba(234,236,233,.04)" : "#F5F2EA", border:`1px solid ${border}` }}>
                          <span style={{ fontSize:20 }}>💰</span>
                          <div>
                            <p style={{ fontSize:11, color:textTer, margin:"0 0 2px" }}>{lang === "ar" ? "تكلفة إصلاح متوقعة" : "Estimated repair cost"}</p>
                            <p style={{ fontSize:14, fontWeight:700, color:textPri, margin:0 }}>{lang === "ar" ? match.result.cost_ar : match.result.cost_en}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {matchedShops.length > 0 && matchedCat && (
                      <div>
                        <p style={{ fontSize:12, fontWeight:700, color:textTer, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:".06em" }}>
                          {lang === "ar" ? "ورش متخصصة" : "Specialist workshops"}
                        </p>
                        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                          {matchedShops.map(shop => (
                            <Link key={shop.id} href={`/shop/${shop.id}`} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 15px", borderRadius:13, background:surface, border:`1px solid ${border}`, textDecoration:"none", transition:"all .15s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accentBorder; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = border; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
                            >
                              <div style={{ width:40, height:40, borderRadius:11, background:accentMuted, border:`1px solid ${accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, flexShrink:0 }}>{matchedCat.icon}</div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:14, fontWeight:700, color:textPri }}>{shop.name}</div>
                                <div style={{ fontSize:12, color:textTer }}>📍 {shop.area[lang]}</div>
                              </div>
                              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                                <div style={{ fontSize:13, fontWeight:700, color:textPri }}><span style={{ color:"#6E7F77" }}>★</span> {shop.rating}</div>
                                <span style={{ fontSize:11, color:accent, fontWeight:600 }}>{lang === "ar" ? "عرض ←" : "View →"}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link href={`/workshops?cat=${match.result.category}`} style={{ display:"inline-flex", alignItems:"center", gap:5, marginTop:12, fontSize:13, color:accent, textDecoration:"none", fontWeight:600 }}>
                          {lang === "ar" ? "عرض كل الورش المتخصصة ←" : "View all specialist workshops →"}
                        </Link>
                      </div>
                    )}
                    <p style={{ fontSize:11, color:textTer, textAlign:"center" }}>
                      {lang === "ar" ? "⚠️ تشخيص تقريبي — استشر متخصص قبل أي إصلاح" : "⚠️ Approximate diagnosis — consult a specialist before any repair"}
                    </p>
                    <button onClick={() => { setSearched(false); setMatch(null); setInput(""); setTranscript(""); setPhotoFile(null); setPhotoPreview(null); }}
                      style={{ padding:11, borderRadius:12, background:"transparent", border:`1px solid ${border}`, color:textSec, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                      {lang === "ar" ? "تشخيص مشكلة جديدة" : "Diagnose another problem"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────── CAR PARTS TAB ─────────────────── */}
      {mainTab === "parts" && (
        <section style={{ padding:"24px 20px" }}>
          <div style={{ maxWidth:760, margin:"0 auto" }}>

            {/* ── Car selector ── */}
            <div style={{ background:surface, borderRadius:16, border:`1px solid ${border}`, padding:18, marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:700, color:accent, margin:"0 0 12px" }}>
                🚗 {lang === "ar" ? "اختر سيارتك للحصول على أسعار دقيقة" : "Select your car for accurate prices"}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                {/* Brand */}
                <div>
                  <label style={{ fontSize:11, color:textTer, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>
                    {lang === "ar" ? "الماركة" : "Brand"}
                  </label>
                  <select value={selectedBrand} onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(""); }} style={selectStyle}>
                    <option value="">{lang === "ar" ? "اختر ماركة" : "Choose brand"}</option>
                    {BRANDS.map(b => {
                      const ar = CAR_MODELS.find(c => c.brand === b)?.brand_ar ?? b;
                      return <option key={b} value={b}>{lang === "ar" ? ar : b}</option>;
                    })}
                  </select>
                </div>
                {/* Model */}
                <div>
                  <label style={{ fontSize:11, color:textTer, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>
                    {lang === "ar" ? "الموديل" : "Model"}
                  </label>
                  <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ ...selectStyle, opacity: !selectedBrand ? 0.4 : 1 }} disabled={!selectedBrand}>
                    <option value="">{lang === "ar" ? "اختر موديل" : "Choose model"}</option>
                    {modelsForBrand.map(c => (
                      <option key={c.model} value={c.model}>{lang === "ar" ? c.model_ar : c.model}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Year range */}
              <div style={{ marginBottom:10 }}>
                <label style={{ fontSize:11, color:textTer, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>
                  {lang === "ar" ? "سنة الصنع (تقريباً)" : "Model year (approx.)"}
                </label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {YEAR_RANGES.map(y => (
                    <button key={y.id} onClick={() => setSelectedYear(selectedYear === y.id ? "" : y.id)} style={{
                      padding:"6px 13px", borderRadius:99, fontSize:12, fontFamily:"inherit", fontWeight:600, cursor:"pointer",
                      background: selectedYear === y.id ? accent : "transparent",
                      color: selectedYear === y.id ? "#fff" : textSec,
                      border:`1.5px solid ${selectedYear === y.id ? accent : border}`,
                      transition:"all .15s",
                    }}>
                      {lang === "ar" ? y.ar : y.en}
                      {y.factor > 1.1 && <span style={{ fontSize:10, marginInlineStart:4, opacity:.8 }}>+{Math.round((y.factor-1)*100)}%</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected car info badge */}
              {selectedCarModel && (
                <div style={{ padding:"10px 14px", borderRadius:10, background:accentMuted, border:`1px solid ${accentBorder}`, marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
                    <div>
                      <span style={{ fontSize:13, fontWeight:700, color:accent }}>
                        {lang === "ar" ? selectedCarModel.brand_ar : selectedCarModel.brand} {lang === "ar" ? selectedCarModel.model_ar : selectedCarModel.model}
                      </span>
                      {selectedYearRange && <span style={{ fontSize:11, color:textTer, marginInlineStart:8 }}>{lang === "ar" ? selectedYearRange.ar : selectedYearRange.en}</span>}
                    </div>
                    <span style={{ fontSize:11, color: carFactor * yearFactor > 2 ? "#EF4444" : carFactor * yearFactor > 1.3 ? "#F59E0B" : "#10B981", fontWeight:700, flexShrink:0 }}>
                      {carFactor * yearFactor > 2
                        ? (lang === "ar" ? "قطع غالية" : "Expensive parts")
                        : carFactor * yearFactor > 1.3
                        ? (lang === "ar" ? "أسعار متوسطة" : "Mid-range prices")
                        : (lang === "ar" ? "قطع اقتصادية" : "Affordable parts")}
                    </span>
                  </div>
                  {selectedCarModel.note_ar && (
                    <p style={{ fontSize:11, color:textTer, margin:"5px 0 0" }}>
                      💡 {lang === "ar" ? selectedCarModel.note_ar : selectedCarModel.note_en}
                    </p>
                  )}
                </div>
              )}

              {/* Part search */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:10, alignItems:"end" }}>
                <div>
                  <label style={{ fontSize:11, color:textTer, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>
                    {lang === "ar" ? "ابحث عن قطعة" : "Search part"}
                  </label>
                  <input value={partSearch} onChange={e => setPartSearch(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && searchParts()}
                    placeholder={lang === "ar" ? "تيل فرامل، شمعة، صدام..." : "brake pad, spark plug, shock..."}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize:11, color:textTer, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".06em" }}>
                    {lang === "ar" ? "النوع" : "Category"}
                  </label>
                  <select value={partCat} onChange={e => setPartCat(e.target.value as PartCategory|"")} style={{ ...selectStyle, width:"auto", minWidth:130 }}>
                    <option value="">{lang === "ar" ? "الكل" : "All"}</option>
                    {PART_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {lang === "ar" ? c.ar : c.en}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={() => searchParts()} style={{ width:"100%", marginTop:12, padding:13, borderRadius:11, background:accent, color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 16px rgba(33,78,79,.25)` }}>
                🔍 {lang === "ar" ? "عرض الأسعار" : "Show prices"}
              </button>
            </div>

            {/* Quick category chips (before search) */}
            {!partsSearched && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, color:textTer, marginBottom:10, textTransform:"uppercase", letterSpacing:".06em" }}>
                  {lang === "ar" ? "تصفح حسب النوع" : "Browse by category"}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {PART_CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => { setPartCat(c.id); searchParts(undefined, c.id); }}
                      style={{ padding:"8px 16px", borderRadius:99, fontSize:13, background:accentMuted, border:`1px solid ${accentBorder}`, cursor:"pointer", fontFamily:"inherit", color:accent, fontWeight:600 }}>
                      {c.icon} {lang === "ar" ? c.ar : c.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ background: isDark ? "rgba(245,158,11,.06)" : "#FFFDF5", border:`1px solid rgba(245,158,11,.2)`, borderRadius:12, padding:"11px 16px", marginBottom:16 }}>
              <p style={{ fontSize:12, color:"#B45309", margin:0, lineHeight:1.6 }}>
                {lang === "ar"
                  ? "⚠️ الأسعار متوسطات السوق المصري (٢٠٢٤–٢٠٢٥). الأسعار المعروضة بعد تطبيق معامل السيارة المختارة — دايماً ارجع لورشة موثوقة للتأكيد."
                  : "⚠️ Egyptian market averages (2024–2025). Prices shown after applying a factor for your selected car — always confirm with a trusted workshop."}
              </p>
            </div>

            {/* Tier selector */}
            {partsSearched && (
              <div style={{ marginBottom:14 }}>
                <p style={{ fontSize:11, color:textTer, marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>
                  {lang === "ar" ? "عرض أسعار" : "Show prices for"}
                </p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {(["local","oem","imported"] as PartTier[]).map(t => (
                    <button key={t} onClick={() => setActiveTier(t)} style={{
                      padding:"8px 16px", borderRadius:99, fontSize:12, fontWeight:700, fontFamily:"inherit",
                      background: activeTier === t ? TIER_LABELS[t].color : "transparent",
                      color: activeTier === t ? "#fff" : textSec,
                      border:`1.5px solid ${activeTier === t ? TIER_LABELS[t].color : border}`,
                      cursor:"pointer", transition:"all .15s",
                    }}>
                      {lang === "ar" ? TIER_LABELS[t].ar : TIER_LABELS[t].en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {partsSearched && (
              <div>
                <p style={{ fontSize:12, color:textTer, marginBottom:12 }}>
                  {partResults.length === 0
                    ? (lang === "ar" ? "مفيش نتائج — جرب كلمات تانية" : "No results — try different keywords")
                    : `${partResults.length} ${lang === "ar" ? "قطعة" : "part(s) found"}`
                  }
                  {selectedCarModel && partResults.length > 0 && (
                    <span style={{ color:accent, fontWeight:600, marginInlineStart:6 }}>
                      {lang === "ar" ? `للـ ${selectedCarModel.brand_ar} ${selectedCarModel.model_ar}` : `for ${selectedCarModel.brand} ${selectedCarModel.model}`}
                      {selectedYearRange && ` · ${lang === "ar" ? selectedYearRange.ar : selectedYearRange.en}`}
                    </span>
                  )}
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {partResults.map(p => {
                    const catInfo = PART_CATEGORIES.find(c => c.id === p.category);
                    // Apply car factor + year factor to base prices
                    const priceLocal    = applyFactor(p.base_local,    carFactor, yearFactor);
                    const priceOem      = applyFactor(p.base_oem,      carFactor, yearFactor);
                    const priceImported = applyFactor(p.base_imported, carFactor, yearFactor);
                    const tierPrice = activeTier === "local" ? priceLocal : activeTier === "oem" ? priceOem : priceImported;
                    return (
                      <div key={p.id} style={{ background:surface, borderRadius:14, border:`1px solid ${border}`, padding:"16px 18px" }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:12 }}>
                          <div style={{ width:40, height:40, borderRadius:11, background:accentMuted, border:`1px solid ${accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                            {catInfo?.icon ?? "🔧"}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:15, fontWeight:800, color:textPri, marginBottom:3 }}>
                              {lang === "ar" ? p.name_ar : p.name_en}
                            </div>
                            <div style={{ fontSize:12, color:textTer }}>
                              {lang === "ar" ? p.name_en : p.name_ar} · {catInfo ? (lang === "ar" ? catInfo.ar : catInfo.en) : ""}
                            </div>
                          </div>
                          {/* Active tier price badge */}
                          {tierPrice && (
                            <div style={{ flexShrink:0, textAlign:"center", background:`${TIER_LABELS[activeTier].color}14`, border:`1.5px solid ${TIER_LABELS[activeTier].color}44`, borderRadius:10, padding:"8px 12px" }}>
                              <p style={{ fontSize:9, color:TIER_LABELS[activeTier].color, margin:"0 0 3px", fontWeight:700, textTransform:"uppercase", letterSpacing:".04em" }}>
                                {lang === "ar" ? TIER_LABELS[activeTier].ar : TIER_LABELS[activeTier].en}
                              </p>
                              <p style={{ fontSize:14, fontWeight:900, color:TIER_LABELS[activeTier].color, margin:0, whiteSpace:"nowrap" }}>
                                {fmtRange(tierPrice)} <span style={{ fontSize:9, fontWeight:400 }}>EGP</span>
                              </p>
                            </div>
                          )}
                        </div>

                        {/* All 3 tiers grid */}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:(p.note_ar || p.note_en) ? 10 : 0 }}>
                          {(["local","oem","imported"] as PartTier[]).map(t => {
                            const pr = t === "local" ? priceLocal : t === "oem" ? priceOem : priceImported;
                            const tl = TIER_LABELS[t];
                            const isActive = activeTier === t;
                            return (
                              <div key={t} onClick={() => setActiveTier(t)} style={{
                                padding:"8px 10px", borderRadius:9, cursor:"pointer", transition:"all .15s",
                                background: isActive ? `${tl.color}14` : isDark ? "rgba(234,236,233,.03)" : "#F5F2EA",
                                border:`1.5px solid ${isActive ? tl.color+"44" : border}`,
                              }}>
                                <p style={{ fontSize:9, color: isActive ? tl.color : textTer, margin:"0 0 3px", fontWeight:700, textTransform:"uppercase", letterSpacing:".04em" }}>
                                  {lang === "ar" ? tl.ar.split(" ").slice(0,2).join(" ") : (t === "local" ? "Local" : t === "oem" ? "OEM" : "Imported")}
                                </p>
                                {pr ? (
                                  <p style={{ fontSize:12, fontWeight:800, color: isActive ? tl.color : textPri, margin:0 }}>
                                    {fmtRange(pr)} <span style={{ fontSize:8, fontWeight:400, color:textTer }}>EGP</span>
                                  </p>
                                ) : (
                                  <p style={{ fontSize:11, color:textTer, margin:0, fontStyle:"italic" }}>{lang === "ar" ? "غير متاح" : "N/A"}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {(lang === "ar" ? p.note_ar : p.note_en) && (
                          <p style={{ fontSize:11, color:textTer, margin:0, padding:"8px 12px", borderRadius:8, background: isDark ? "rgba(234,236,233,.04)" : "#F0EDE5", lineHeight:1.6 }}>
                            💡 {lang === "ar" ? p.note_ar : p.note_en}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {partResults.length > 0 && (
                  <button onClick={() => { setPartsSearched(false); setPartSearch(""); setPartCat(""); }} style={{ marginTop:16, padding:"10px 20px", borderRadius:10, background:"transparent", border:`1px solid ${border}`, color:textSec, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                    {lang === "ar" ? "بحث جديد" : "New search"}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <footer style={{ padding:20, textAlign:"center", fontSize:12, color:textTer, borderTop:`1px solid ${border}` }}>
        © 2025 Warsha.eg
      </footer>

      <style>{`
        @keyframes micPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,.4),0 0 0 0 rgba(239,68,68,.2); }
          50% { box-shadow: 0 0 0 18px rgba(239,68,68,.15),0 0 0 36px rgba(239,68,68,.06); }
        }
        ::-webkit-scrollbar { display: none; }
        select option { background: #1F2A2E; color: #EAECE9; }
      `}</style>
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", background:"#0F1414" }} />}>
      <DiagnoseInner />
    </Suspense>
  );
}
