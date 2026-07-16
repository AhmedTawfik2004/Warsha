export type Lang = "ar" | "en";

export const t = {
  ar: {
    // Nav
    appName:        "ورشة",
    navShops:       "الورش",
    navServices:    "الخدمات",
    navMap:         "الخريطة",
    navAbout:       "عن المنصة",
    navRegisterCta: "سجّل ورشتك",

    // Hero
    eyebrow:     "٦٠٠+ ورشة متخصصة في مصر",
    h1Line1:     "اعثر على الورشة",
    h1Line2:     "المناسبة لسيارتك",
    heroBod:     "ابحث بالخدمة اللي محتاجها — ميكانيكا، تشطيب، تيونينج، صوتيات — وتواصل مباشرة مع الورشة الأقرب ليك",
    searchPlaceholder: "ابحث — مثلاً: برمجة ECU، تغليف، تغيير زيت...",
    searchBtn:   "ابحث",

    // Stats
    stat1Val:  "٦٠٠+", stat1Lbl: "ورشة مسجّلة",
    stat2Val:  "١٤K+", stat2Lbl: "تقييم موثّق",
    stat3Val:  "١٢",   stat3Lbl: "تخصصات",

    // Categories
    catHeading: "تصفّح حسب الخدمة",
    viewAll:    "عرض الكل",
    shopUnit:   "ورشة",
    activeBannerPrefix: "عرض ورش",
    activeBannerSuffix: "نتيجة",
    cancelFilter: "إلغاء",

    // Featured
    featuredHeading:  "ورش مميزة",
    featuredSubhead:  "الأعلى تقييماً هذا الأسبوع",
    reviewUnit:       "تقييم",
    btnWhatsApp:      "واتساب",
    btnChat:          "محادثة",
    btnViewOnMaps:    "عرض على خرائط جوجل",
    btnView:          "عرض الورشة",
    topRated:         "الأعلى تقييماً",

    // Category page
    backToHome:    "العودة للرئيسية",
    chooseType:    "اختار الخدمة المطلوبة",
    allLabel:      "الكل",
    moreComingSoon:"تفاصيل أكتر هتضاف قريباً",
    noShopsYet:    "لسه مفيش ورش متسجلة في القسم ده",
    shopsFoundSuffix: "ورشة متاحة",

    // Shop detail page
    shopNotFound:   "الورشة غير موجودة",
    getDirections:  "الاتجاهات",
    viewOnGoogleMaps: "عرض على خرائط جوجل",
    aboutShop:      "عن الورشة",
    aboutShopBody:  "صفحة الورشة دي لسه تحت التطوير — التفاصيل والصور والتقييمات الكاملة هتظهر هنا قريباً.",
    servicesOffered:"الخدمات المقدمة",
    backToCategory: "العودة إلى",

    // Map page
    mapPageTitle:    "كل الورش على الخريطة",
    mapPageSubtitle: "اضغط على ورشة من القايمة لتشوف موقعها على الخريطة",
    mapListHeading:  "كل الورش",

    // Workshops page
    workshopsTitle:   "كل الورش",
    workshopsSubtitle:"اعثر على الورشة المناسبة من بين كل المضافين على المنصة",
    workshopsSearch:  "ابحث باسم الورشة أو المنطقة...",
    allCategories:    "كل التخصصات",
    filterBy:         "تصفية حسب",
    contactCall:      "اتصال",
    noResults:        "مفيش ورش مطابقة للبحث",

    // Services page
    servicesTitle:    "الخدمات المتاحة",
    servicesSubtitle: "كل الخدمات اللي تقدر تلاقيها على ورشة",

    // About page
    aboutTitle:       "عن ورشة",
    aboutMission:     "مهمتنا",
    aboutMissionBody: "ورشة هي المنصة الأولى في مصر اللي بتوصّل أصحاب السيارات بالورش المتخصصة — ميكانيكا، تشطيب، تيونينج، وأكتر — بشكل سهل وموثوق.",
    aboutHowTitle:    "إزاي بنشتغل؟",
    aboutContact:     "تواصل معنا",
    aboutContactBody: "لو عندك ورشة وعايز تنضم أو عندك سؤال، تواصل معنا على:",

    // List shop page
    listShopTitle:      "سجّل ورشتك على ورشة",
    listShopSubtitle:   "انضم لأكبر دليل ورش سيارات في مصر واستقبل عملاء جدد",
    listShopBenefits:   "مزايا الانضمام",
    listShopFormTitle:  "أدخل بيانات ورشتك",
    formName:           "اسم الورشة",
    formOwner:          "اسم المالك",
    formPhone:          "رقم الموبايل / واتساب",
    formArea:           "المنطقة",
    formCategory:       "التخصص الرئيسي",
    formDesc:           "وصف مختصر للورشة",
    formSubmit:         "أرسل الطلب",
    formSuccess:        "تم إرسال طلبك! هنتواصل معاك خلال ٢٤ ساعة.",
    formNote:           "الانضمام مجاني خلال الفترة التجريبية",

    // Listings (providers view on list-shop page)
    listingsTitle:      "ورش مضافة مؤخراً",
    listingsSubtitle:   "الورش اللي انضمت للمنصة",

    // How it works
    howHeading: "كيف يشتغل ورشة؟",
    howSubhead: "٣ خطوات بس",
    steps: [
      { step: "خطوة ١", title: "اختار الخدمة",   body: "قول إيه اللي محتاج تعمله في عربيتك — ميكانيكا، تشطيب، تيونينج، أو صوتيات", icon: "🔍" },
      { step: "خطوة ٢", title: "قارن الورش",     body: "شوف التقييمات، الصور، والأسعار لأفضل الورش المتخصصة في منطقتك", icon: "⚖️" },
      { step: "خطوة ٣", title: "تواصل مباشرة",  body: "كلم الورشة على واتساب أو احجز موعد من غير ما تغادر المنصة", icon: "💬" },
    ],

    // Footer CTA
    footerCtaH:    "عندك ورشة؟",
    footerCtaBody: "سجّل ورشتك على ورشة وابدأ تستقبل عملاء جدد من يومك الأول — مجاناً خلال الفترة التجريبية",
    footerCtaBtn:  "سجّل ورشتك مجاناً ←",
    footerCopy:    "ورشة مصر © ٢٠٢٥ — جميع الحقوق محفوظة",

    // Suggestions
    suggestions: ["تغيير زيت المحرك", "تغليف الكابوريا", "برمجة ECU", "تركيب شاشة أندرويد", "تبديل إطارات", "صبغ الجنوط"],
  },

  en: {
    // Nav
    appName:        "Warsha",
    navShops:       "Workshops",
    navServices:    "Services",
    navMap:         "Map",
    navAbout:       "About",
    navRegisterCta: "List your shop",

    // Hero
    eyebrow:     "600+ verified workshops across Egypt",
    h1Line1:     "Find the right shop",
    h1Line2:     "for your car",
    heroBod:     "Search by what you need — mechanical work, interior, exterior, tuning, or audio — and contact the nearest specialist directly.",
    searchPlaceholder: "Search — e.g. ECU tuning, wrap, oil change...",
    searchBtn:   "Search",

    // Stats
    stat1Val:  "600+", stat1Lbl: "Registered shops",
    stat2Val:  "14K+", stat2Lbl: "Verified reviews",
    stat3Val:  "12",   stat3Lbl: "Specialisations",

    // Categories
    catHeading: "Browse by service",
    viewAll:    "View all",
    shopUnit:   "shops",
    activeBannerPrefix: "Showing",
    activeBannerSuffix: "results",
    cancelFilter: "Clear",

    // Featured
    featuredHeading:  "Featured Workshops",
    featuredSubhead:  "Highest rated this week",
    reviewUnit:       "reviews",
    btnWhatsApp:      "WhatsApp",
    btnChat:          "Chat",
    btnViewOnMaps:    "View on Google Maps",
    btnView:          "View Shop",
    topRated:         "Top Rated",

    // Category page
    backToHome:    "Back to home",
    chooseType:    "Choose the service you need",
    allLabel:      "All",
    moreComingSoon:"More detailed filters coming soon",
    noShopsYet:    "No shops registered in this category yet",
    shopsFoundSuffix: "shops available",

    // Shop detail page
    shopNotFound:   "Shop not found",
    getDirections:  "Get directions",
    viewOnGoogleMaps: "View on Google Maps",
    aboutShop:      "About this shop",
    aboutShopBody:  "This shop page is still under development — full details, photos, and reviews will appear here soon.",
    servicesOffered:"Services offered",
    backToCategory: "Back to",

    // Map page
    mapPageTitle:    "All workshops on the map",
    mapPageSubtitle: "Click a workshop in the list to see its location on the map",
    mapListHeading:  "All workshops",

    // Workshops page
    workshopsTitle:   "All workshops",
    workshopsSubtitle:"Find the right shop from everyone listed on the platform",
    workshopsSearch:  "Search by shop name or area...",
    allCategories:    "All categories",
    filterBy:         "Filter by",
    contactCall:      "Call",
    noResults:        "No shops match your search",

    // Services page
    servicesTitle:    "Available services",
    servicesSubtitle: "Everything you can find on Warsha",

    // About page
    aboutTitle:       "About Warsha",
    aboutMission:     "Our mission",
    aboutMissionBody: "Warsha is Egypt's first platform connecting car owners with specialist workshops — mechanical, interior, tuning, and more — in a simple, trustworthy way.",
    aboutHowTitle:    "How does it work?",
    aboutContact:     "Contact us",
    aboutContactBody: "If you own a shop and want to join, or have a question, reach us at:",

    // List shop page
    listShopTitle:      "List your shop on Warsha",
    listShopSubtitle:   "Join Egypt's largest auto workshop directory and receive new customers",
    listShopBenefits:   "Why join?",
    listShopFormTitle:  "Enter your shop details",
    formName:           "Shop name",
    formOwner:          "Owner name",
    formPhone:          "Phone / WhatsApp",
    formArea:           "Area",
    formCategory:       "Main specialisation",
    formDesc:           "Brief description",
    formSubmit:         "Submit request",
    formSuccess:        "Request sent! We'll be in touch within 24 hours.",
    formNote:           "Joining is free during the beta period",

    // Listings (providers view on list-shop page)
    listingsTitle:      "Recently listed shops",
    listingsSubtitle:   "Shops that have joined the platform",

    // How it works
    howHeading: "How Warsha works",
    howSubhead: "Three simple steps",
    steps: [
      { step: "Step 1", title: "Pick your service", body: "Tell us what you need — mechanical, interior, tuning, or audio — and we'll find specialists.", icon: "🔍" },
      { step: "Step 2", title: "Compare workshops", body: "See ratings, photos, and price ranges for the best shops near you.", icon: "⚖️" },
      { step: "Step 3", title: "Contact directly",  body: "Message the shop on WhatsApp or book an appointment without leaving the platform.", icon: "💬" },
    ],

    // Footer CTA
    footerCtaH:    "Own a workshop?",
    footerCtaBody: "List your shop on Warsha and start receiving customers from day one — free during the beta period.",
    footerCtaBtn:  "List your shop free →",
    footerCopy:    "Warsha Egypt © 2025 — All rights reserved",

    // Suggestions
    suggestions: ["Oil change", "Vinyl wrap", "ECU remapping", "Android screen install", "Tyre change", "Rim painting"],
  },
} as const;

// ─── Categories ─────────────────────────────────────────────────────────────

export type Subcategory = { id: string; ar: string; en: string; icon: string };

export const CATEGORIES = [
  {
    id: "mechanical", ar: "ميكانيكا", en: "Mechanical", icon: "⚙️",
    count: { ar: "٢٤٠+", en: "240+" }, accent: "#E8730A",
    description: { ar: "إصلاح المحرك، الفرامل، والتعليق", en: "Engine, brakes, suspension & more" },
    subcategories: [
      { id: "engine",       ar: "المحرك",      en: "Engine",       icon: "🔩" },
      { id: "suspension",   ar: "التعليق",     en: "Suspension",   icon: "🌀" },
      { id: "brakes",       ar: "الفرامل",     en: "Brakes",       icon: "🛑" },
      { id: "transmission", ar: "ناقل الحركة", en: "Transmission", icon: "⚙️" },
    ] as Subcategory[],
  },
  {
    id: "interior", ar: "تشطيب داخلي", en: "Interior", icon: "🪑",
    count: { ar: "١١٠+", en: "110+" }, accent: "#3B82F6",
    description: { ar: "صوتيات، إضاءة، شاشات، ودركسيون وإكسسوارات", en: "Audio, lighting, screens, accessories & more" },
    subcategories: [
      { id: "sound_system",   ar: "نظام الصوت",       en: "Sound system",       icon: "🔊" },
      { id: "led_lighting",   ar: "إضاءة LED",        en: "LED lighting",       icon: "💡" },
      { id: "steering_wheel", ar: "الدركسيون",        en: "Steering wheel",     icon: "🛞" },
      { id: "screens",        ar: "الشاشات",          en: "Screens",            icon: "📱" },
      { id: "interior_acc",   ar: "إكسسوارات داخلية", en: "Interior accessories", icon: "🛒" },
    ] as Subcategory[],
  },
  {
    id: "exterior", ar: "تشطيب خارجي", en: "Exterior", icon: "✨",
    count: { ar: "١٨٠+", en: "180+" }, accent: "#10B981",
    description: { ar: "سبويلر، سبليتر، بودي كيت وإكسسوارات خارجية", en: "Spoilers, splitters, body kits & exterior accessories" },
    subcategories: [
      { id: "spoiler",       ar: "سبويلر",              en: "Spoiler",              icon: "🔺" },
      { id: "splitter",      ar: "سبليتر",              en: "Splitter",             icon: "➖" },
      { id: "side_skirt",    ar: "سايد سكيرت",         en: "Side skirts",          icon: "▬" },
      { id: "body_kit",      ar: "بودي كيت",           en: "Body kit",             icon: "🧩" },
      { id: "exterior_acc",  ar: "إكسسوارات خارجية",   en: "Exterior accessories", icon: "🛒" },
    ] as Subcategory[],
  },
  {
    id: "performance", ar: "أداء وتيونينج", en: "Performance", icon: "🏁",
    count: { ar: "٩٠+", en: "90+" }, accent: "#EF4444",
    description: { ar: "تيونينج، شكمان، وبرمجة ECU", en: "Tuning, exhaust & ECU programming" },
    subcategories: [
      { id: "tuning",      ar: "تيونينج عام",      en: "General tuning",    icon: "🎛️" },
      { id: "air_intake",  ar: "فلتر هواء رياضي",  en: "Air intake",        icon: "💨" },
      { id: "exhaust",     ar: "الشكمان",          en: "Exhaust",           icon: "🔥" },
      { id: "ecu",         ar: "برمجة ECU",        en: "ECU tuning",        icon: "💻" },
      { id: "spark_plugs", ar: "بوجيهات رياضية",  en: "Sport spark plugs", icon: "⚡" },
    ] as Subcategory[],
  },
  {
    id: "diagnostics", ar: "دياجنوستيك", en: "Diagnostics", icon: "💻",
    count: { ar: "١٤٠+", en: "140+" }, accent: "#06B6D4",
    description: { ar: "فحص كمبيوتر وأعطال السيارة", en: "Computer diagnostics & fault codes" },
    subcategories: [] as Subcategory[],
  },
  {
    id: "tires", ar: "إطارات وجنوط", en: "Tyres & Rims", icon: "🔄",
    count: { ar: "١٦٠+", en: "160+" }, accent: "#F59E0B",
    description: { ar: "تركيب، ضبط زوايا، وصبغ جنوط", en: "Fitting, alignment & rim painting" },
    subcategories: [
      { id: "tyre_fitting", ar: "تركيب إطارات", en: "Tyre fitting",    icon: "🛞" },
      { id: "alignment",    ar: "ضبط الزوايا",  en: "Wheel alignment", icon: "📐" },
      { id: "rim_painting", ar: "صبغ الجنوط",   en: "Rim painting",    icon: "🎨" },
      { id: "balancing",    ar: "موازنة العجل", en: "Wheel balancing", icon: "⚖️" },
    ] as Subcategory[],
  },
  {
    id: "paint_wrap", ar: "دهان وتغليف", en: "Paint & Wrap", icon: "🎨",
    count: { ar: "٨٠+", en: "80+" }, accent: "#EC4899",
    description: { ar: "دهان، تغليف، ورش ووجوه كاليبر وتلوين داخلي", en: "Full paint, wrap, caliper coating & interior colour" },
    subcategories: [
      { id: "full_paint",     ar: "دهان كامل ودوكو",      en: "Full paint job",        icon: "🖌️" },
      { id: "car_wrap",       ar: "تغليف السيارة",        en: "Car wrap",              icon: "🎨" },
      { id: "caliper_wrap",   ar: "تلوين كاليبر الفرامل", en: "Brake caliper coating", icon: "🔴" },
      { id: "interior_wrap",  ar: "تغليف داخلي",          en: "Interior wrap",         icon: "🪑" },
      { id: "colour_accents", ar: "تلوين وإضافات لونية",  en: "Colour accents",        icon: "🌈" },
    ] as Subcategory[],
  },
  {
    id: "car_protection", ar: "حماية السيارة", en: "Car protection", icon: "🛡️",
    count: { ar: "٧٠+", en: "70+" }, accent: "#8B5CF6",
    description: { ar: "سيراميك، تغليف حماية، وتظليل", en: "Ceramic coating, PPF & tinting" },
    subcategories: [
      { id: "ceramic_coating", ar: "سيراميك",          en: "Ceramic coating",       icon: "✨" },
      { id: "ppf",             ar: "تغليف حماية PPF",  en: "Paint protection film", icon: "🎞️" },
      { id: "window_tint",     ar: "تظليل الزجاج",     en: "Window tinting",        icon: "🕶️" },
      { id: "undercoating",    ar: "حماية تحت الشاسيه", en: "Undercoating",         icon: "🔧" },
    ] as Subcategory[],
  },
  {
    id: "car_wash", ar: "غسيل وتفصيل", en: "Car wash & detailing", icon: "🚿",
    count: { ar: "١٢٠+", en: "120+" }, accent: "#0EA5E9",
    description: { ar: "غسيل، تلميع، تفصيل كامل، وتنظيف داخلي وخارجي", en: "Wash, polish, full detailing & interior cleaning" },
    subcategories: [
      { id: "hand_wash",             ar: "غسيل يدوي",           en: "Hand wash",               icon: "🤲" },
      { id: "foam_wash",             ar: "غسيل فوم",            en: "Foam wash",               icon: "🧼" },
      { id: "interior_vac",          ar: "شفط وتنظيف داخلي",    en: "Interior vacuum & clean", icon: "🧹" },
      { id: "full_detail",           ar: "تفصيل وتلميع كامل",   en: "Full detail & polish",    icon: "✨" },
      { id: "headlight_restoration", ar: "تجديد الكشافات",      en: "Headlight restoration",   icon: "💡" },
      { id: "engine_bay",            ar: "تنظيف غرفة المحرك",   en: "Engine bay cleaning",     icon: "🔧" },
    ] as Subcategory[],
  },
  {
    id: "glass_repair", ar: "زجاج السيارات", en: "Auto glass", icon: "🪟",
    count: { ar: "٥٠+", en: "50+" }, accent: "#64748B",
    description: { ar: "تغيير وإصلاح كسور زجاج السيارة", en: "Windscreen replacement & repair" },
    subcategories: [
      { id: "windscreen",   ar: "زجاج أمامي",       en: "Windscreen",   icon: "🪟" },
      { id: "side_windows", ar: "زجاج جانبي",       en: "Side windows", icon: "🪟" },
      { id: "crack_repair", ar: "إصلاح شروخ",       en: "Crack repair", icon: "🔧" },
      { id: "tint_removal", ar: "إزالة تظليل قديم", en: "Tint removal", icon: "🕶️" },
    ] as Subcategory[],
  },
  {
    id: "car_ac", ar: "تكييف السيارات", en: "Car A/C", icon: "❄️",
    count: { ar: "٦٠+", en: "60+" }, accent: "#38BDF8",
    description: { ar: "صيانة وتركيب تكييف السيارة", en: "A/C service, installation & repair" },
    subcategories: [
      { id: "ac_service",   ar: "صيانة دورية", en: "Regular service",   icon: "🔧" },
      { id: "gas_recharge", ar: "شحن فريون",    en: "Gas recharge",      icon: "💨" },
      { id: "compressor",   ar: "كمبروسور",     en: "Compressor",        icon: "⚙️" },
      { id: "ac_install",   ar: "تركيب وحدات", en: "Unit installation", icon: "❄️" },
    ] as Subcategory[],
  },
  {
    id: "auto_electric", ar: "كهرباء السيارات", en: "Auto electrics", icon: "🔌",
    count: { ar: "٥٠+", en: "50+" }, accent: "#EAB308",
    description: { ar: "بطاريات، دينامو، أسلاك، وإلكترونيات السيارة", en: "Batteries, alternator, wiring & car electronics" },
    subcategories: [
      { id: "battery",      ar: "بطاريات",            en: "Batteries",            icon: "🔋" },
      { id: "alternator",   ar: "دينامو وسلف",         en: "Alternator & starter", icon: "⚙️" },
      { id: "wiring",       ar: "عزل وتوصيلات",        en: "Wiring & insulation",  icon: "🔌" },
      { id: "ecu_electric", ar: "كمبيوتر وإلكترونيات", en: "ECU & electronics",    icon: "💡" },
      { id: "lights",       ar: "إضاءة السيارة",       en: "Car lighting",         icon: "🚗" },
    ] as Subcategory[],
  },
];

// ─── Featured shops (homepage) ──────────────────────────────────────────────

export const FEATURED_SHOPS = [
  { id: 116, name: "Nacita Auto Care",      area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" }, rating: 4.7, reviews: 0, tags: { ar: ["صيانة شاملة", "إطارات", "غسيل"], en: ["Full service", "Tyres", "Car wash"] }, badge: true },
  { id: 601, name: "Ghataty — Michelin",    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" }, rating: 5.0, reviews: 5,  tags: { ar: ["ميشلان", "هانكوك", "بطاريات VARTA"], en: ["Michelin", "Hankook", "VARTA batteries"] }, badge: false },
  { id: 701, name: "Ceramic Pro Madinaty",  area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" }, rating: 4.8, reviews: 0,  tags: { ar: ["سيراميك برو", "PPF", "حماية طلاء"], en: ["Ceramic Pro", "PPF", "Paint protection"] }, badge: false },
  { id: 111, name: "C.S Mercedes Benz",     area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" }, rating: 4.7, reviews: 0,  tags: { ar: ["صيانة مرسيدس", "خدمة معتمدة"], en: ["Mercedes service", "Certified center"] }, badge: false },
];

// ─── Shops (all real, verified from Google Maps) ───────────────────────────

export const SHOPS = [

  // ── MECHANICAL ────────────────────────────────────────────────────────────

  { id: 105, name: "AutoLube Express",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.5, reviews: 12, category: "mechanical", subcategory: "engine",
    tags: { ar: ["تغيير زيت", "زيوت وفلاتر"], en: ["Oil change", "Oils & filters"] },
    lat: 30.1602077, lng: 31.658392, phone: null },

  { id: 106, name: "German Kraft",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة مرسيدس", "قطع غيار أصلية", "فحص إلكتروني"], en: ["Mercedes service", "Original spare parts", "Electronic diagnostics"] },
    lat: 30.0768131, lng: 31.6753053, phone: null },

  { id: 107, name: "American Land Car Service",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة عامة", "تغيير زيت", "فحص"], en: ["General service", "Oil change", "Inspection"] },
    lat: 30.0722409, lng: 31.6736938, phone: null },

  { id: 108, name: "المتحدة لصيانة السيارات",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة عامة", "كهرباء سيارات", "فرامل"], en: ["General maintenance", "Auto electrics", "Brakes"] },
    lat: 30.0723825, lng: 31.6724746, phone: null },

  { id: 109, name: "100 Plus",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة متخصصة", "قطع غيار"], en: ["Specialist service", "Spare parts"] },
    lat: 30.0723706, lng: 31.6717233, phone: null },

  { id: 110, name: "AlHabiba Auto MG Service Center",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة MG", "مركز خدمة معتمد"], en: ["MG service center", "Authorized service"] },
    lat: 30.072364, lng: 31.6715279, phone: null },

  { id: 111, name: "C.S Mercedes Benz Service Center",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.7, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة مرسيدس", "خدمة معتمدة"], en: ["Mercedes Benz service", "Certified center"] },
    lat: 30.0723819, lng: 31.6704331, phone: null },

  { id: 112, name: "El Saba Auto Service",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.5, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة عامة", "كهرباء سيارات"], en: ["General service", "Auto electrics"] },
    lat: 30.1648122, lng: 31.6210379, phone: null },

  { id: 113, name: "European Service Center",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.6, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة سيارات أوروبية", "فحص إلكتروني"], en: ["European car service", "Electronic diagnostics"] },
    lat: 30.1648487, lng: 31.6238271, phone: null },

  { id: 114, name: "MATIC AUTO — ŠKODA Service & Showroom",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.7, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة سكودا", "معرض ومركز خدمة معتمد"], en: ["ŠKODA service", "Authorized showroom & service"] },
    lat: 30.1630018, lng: 31.6150887, phone: null },

  { id: 115, name: "KIA Al Shorouk",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.6, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة كيا", "مركز خدمة معتمد"], en: ["KIA service center", "Authorized service"] },
    lat: 30.164368, lng: 31.621078, phone: null },

  { id: 116, name: "Nacita Auto Care",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.7, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة شاملة", "إطارات", "غسيل"], en: ["Full service", "Tyres", "Car wash"] },
    lat: 30.0724, lng: 31.6715, phone: "19725" },

  { id: 117, name: "صيانة رينو مدينتي — EIM",
    area: { ar: "مدينتي", en: "Madinaty" },
    rating: 4.6, reviews: 0, category: "mechanical", subcategory: "engine",
    tags: { ar: ["صيانة رينو", "مركز خدمة معتمد", "قطع غيار"], en: ["Renault service", "Authorized center", "Spare parts"] },
    lat: 30.1041237, lng: 31.6049483, phone: null },


  // ── TYRES & RIMS ──────────────────────────────────────────────────────────

  { id: 601, name: "Ghataty — Michelin Tyres & Services",
    area: { ar: "كرافت زون بلوك ١ — مدينتي", en: "Craft Zone Block 1 — Madinaty" },
    rating: 5.0, reviews: 5, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["ميشلان", "هانكوك", "بطاريات VARTA", "تركيب وموازنة"], en: ["Michelin", "Hankook", "VARTA batteries", "Fitting & balancing"] },
    lat: 30.07236, lng: 31.66902, phone: "+201066046551" },

  { id: 602, name: "ACDelco — مؤسسة أشرف أبو إسماعيل",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["إطارات ACDelco", "بطاريات", "تركيب"], en: ["ACDelco tyres", "Batteries", "Fitting"] },
    lat: 30.0722604, lng: 31.6703279, phone: null },

  { id: 603, name: "Fit & Fix Madinaty 2",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["بريدجستون", "تركيب إطارات", "ضبط زوايا"], en: ["Bridgestone", "Tyre fitting", "Wheel alignment"] },
    lat: 30.0724375, lng: 31.6701875, phone: null },

  { id: 604, name: "ElAggar Auto Tires",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["إطارات", "موازنة", "ضبط زوايا"], en: ["Tyres", "Balancing", "Alignment"] },
    lat: 30.0723795, lng: 31.6706798, phone: null },

  { id: 605, name: "Kandil Tires — قنديل للإطارات",
    area: { ar: "كرافت زون محل ١٤ — مدينتي", en: "Craft Zone Shop 14 — Madinaty" },
    rating: 4.5, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["إطارات", "تركيب", "موازنة عجل"], en: ["Tyres", "Fitting", "Wheel balancing"] },
    lat: 30.072372, lng: 31.6712423, phone: null },

  { id: 606, name: "Elzamlout Tire & Auto Service",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["إطارات", "صيانة سيارات", "ضبط زوايا"], en: ["Tyres", "Auto service", "Alignment"] },
    lat: 30.0722696, lng: 31.672394, phone: null },

  { id: 607, name: "Ashrafco Madinaty",
    area: { ar: "مدينتي", en: "Madinaty" },
    rating: 4.7, reviews: 0, category: "tires", subcategory: "tyre_fitting",
    tags: { ar: ["إطارات", "جنوط رياضية", "بطاريات", "تقويم جنوط"], en: ["Tyres", "Sport rims", "Batteries", "Rim straightening"] },
    lat: 30.1042348, lng: 31.604333, phone: "15021" },


  // ── CAR WASH & DETAILING ──────────────────────────────────────────────────

  { id: 901, name: "212 Car Wash",
    area: { ar: "مدينتي", en: "Madinaty" },
    rating: 4.5, reviews: 0, category: "car_wash", subcategory: "foam_wash",
    tags: { ar: ["غسيل فوم", "غسيل خارجي", "تلميع"], en: ["Foam wash", "Exterior wash", "Polish"] },
    lat: 30.0723947, lng: 31.6700663, phone: null },

  { id: 902, name: "Wash Box",
    area: { ar: "مدينتي", en: "Madinaty" },
    rating: 4.6, reviews: 0, category: "car_wash", subcategory: "full_detail",
    tags: { ar: ["غسيل كامل", "شفط داخلي", "تلميع"], en: ["Full wash", "Interior vacuum", "Polish"] },
    lat: 30.0732445, lng: 31.6752871, phone: null },

  { id: 903, name: "AUTO TIME",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "car_wash", subcategory: "foam_wash",
    tags: { ar: ["غسيل سيارات", "تلميع"], en: ["Car wash", "Polishing"] },
    lat: 30.0722649, lng: 31.6718219, phone: null },

  { id: 904, name: "Oreo Car Detailing",
    area: { ar: "كرافت زون بلوك ٩ — مدينتي", en: "Craft Zone Block 9 — Madinaty" },
    rating: 4.7, reviews: 0, category: "car_wash", subcategory: "full_detail",
    tags: { ar: ["تلميع", "سيراميك نانو", "حماية PPF"], en: ["Polishing", "Nano ceramic", "PPF protection"] },
    lat: 30.0724, lng: 31.6753, phone: "+201092221382" },


  // ── CAR PROTECTION ────────────────────────────────────────────────────────

  { id: 701, name: "Ceramic Pro Madinaty",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.8, reviews: 0, category: "car_protection", subcategory: "ceramic_coating",
    tags: { ar: ["سيراميك برو", "تغليف PPF", "حماية طلاء"], en: ["Ceramic Pro", "PPF wrapping", "Paint protection"] },
    lat: 30.0722905, lng: 31.673427, phone: null },

  { id: 702, name: "EXOTICA Nano Ceramic — Car Care",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "car_protection", subcategory: "ceramic_coating",
    tags: { ar: ["سيراميك نانو", "تلميع", "حماية طلاء"], en: ["Nano ceramic", "Polishing", "Paint protection"] },
    lat: 30.0723486, lng: 31.6722368, phone: null },


  // ── AUTO GLASS ────────────────────────────────────────────────────────────

  { id: 1001, name: "Dr. Khaled Autoglass — Madinaty",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.7, reviews: 0, category: "glass_repair", subcategory: "windscreen",
    tags: { ar: ["تغيير زجاج أمامي", "إصلاح شروخ", "زجاج جانبي"], en: ["Windscreen replacement", "Crack repair", "Side windows"] },
    lat: 30.072364, lng: 31.6693188, phone: null },

  { id: 1002, name: "Dr. Khaled Autoglass — الشروق",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.7, reviews: 0, category: "glass_repair", subcategory: "windscreen",
    tags: { ar: ["تغيير زجاج أمامي", "إصلاح شروخ", "زجاج جانبي"], en: ["Windscreen replacement", "Crack repair", "Side windows"] },
    lat: 30.1642611, lng: 31.6202034, phone: null },


  // ── CAR A/C ───────────────────────────────────────────────────────────────

  { id: 1101, name: "Brothercond For Air Conditioning",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.7, reviews: 0, category: "car_ac", subcategory: "ac_service",
    tags: { ar: ["صيانة تكييف", "شحن فريون", "تركيب وحدات"], en: ["A/C maintenance", "Gas recharge", "Unit installation"] },
    lat: 30.072347, lng: 31.6730658, phone: "+201222211310" },


  // ── PAINT & WRAP ──────────────────────────────────────────────────────────

  { id: 401, name: "French Motors Service — Body & Paint",
    area: { ar: "مدينة الشروق", en: "Sherouk City" },
    rating: 4.6, reviews: 0, category: "paint_wrap", subcategory: "full_paint",
    tags: { ar: ["دهان كامل", "إصلاح هيكل", "ورش بودي"], en: ["Full respray", "Body repair", "Body shop"] },
    lat: 30.1635603, lng: 31.6151848, phone: null },


  // ── INTERIOR ──────────────────────────────────────────────────────────────

  { id: 1201, name: "المصرية لكماليات السيارات",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "interior", subcategory: "interior_acc",
    tags: { ar: ["إكسسوارات داخلية", "إكسسوارات خارجية", "إلكترونيات سيارات"], en: ["Interior accessories", "Exterior accessories", "Car electronics"] },
    lat: 30.0757013, lng: 31.6753169, phone: null },

  { id: 1202, name: "محسن الباشا لرفاهية السيارات",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.6, reviews: 0, category: "interior", subcategory: "interior_acc",
    tags: { ar: ["إكسسوارات فاخرة", "تجهيزات داخلية", "كماليات"], en: ["Luxury accessories", "Interior fittings", "Car accessories"] },
    lat: 30.0721834, lng: 31.6716504, phone: null },


  // ── AUTO ELECTRICS ────────────────────────────────────────────────────────

  { id: 1301, name: "صيانة كهرباء السيارات — مدينتي",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "auto_electric", subcategory: "wiring",
    tags: { ar: ["كهرباء عامة", "عزل أسلاك", "تشخيص"], en: ["General electrics", "Wiring", "Diagnostics"] },
    lat: 30.0724, lng: 31.6720, phone: null },

  { id: 1302, name: "بطاريات وكهرباء السيارات — مدينتي",
    area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },
    rating: 4.5, reviews: 0, category: "auto_electric", subcategory: "battery",
    tags: { ar: ["بطاريات VARTA", "بطاريات Bosch", "شحن وتركيب"], en: ["VARTA batteries", "Bosch batteries", "Installation"] },
    lat: 30.0723, lng: 31.6715, phone: null },

];