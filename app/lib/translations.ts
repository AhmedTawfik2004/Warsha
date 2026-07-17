export type Lang = "ar" | "en";

export const t = {
  ar: {
    // Nav
    appName:        "وَرشة فايندر",
    navShops:       "الورش",
    navServices:    "الخدمات",
    navMap:         "الخريطة",
    navAbout:       "عن المنصة",
    navRegisterCta: "سجّل ورشتك",

    // Hero
    eyebrow:     "٦٧+ ورشة متخصصة في القاهرة",
    h1Line1:     "اعثر على الورشة",
    h1Line2:     "المناسبة لسيارتك",
    heroBod:     "ابحث بالخدمة اللي محتاجها — ميكانيكا، تشطيب، تيونينج، صوتيات — وتواصل مباشرة مع الورشة الأقرب ليك",
    searchPlaceholder: "ابحث — مثلاً: برمجة ECU، تغليف، تغيير زيت، التكييف مش بيبرد...",
    searchBtn:   "ابحث",

    // Stats
    stat1Val:  "٦٧+",  stat1Lbl: "ورشة مسجّلة",
    stat2Val:  "١٢",   stat2Lbl: "تخصص",
    stat3Val:  "٣",    stat3Lbl: "مناطق",

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
    servicesSubtitle: "كل الخدمات اللي تقدر تلاقيها على وَرشة فايندر",

    // About page
    aboutTitle:       "عن وَرشة فايندر",
    aboutMission:     "مهمتنا",
    aboutMissionBody: "وَرشة فايندر هي المنصة الأولى في مصر اللي بتوصّل أصحاب السيارات بالورش المتخصصة — ميكانيكا، تشطيب، تيونينج، وأكتر — بشكل سهل وموثوق.",
    aboutHowTitle:    "إزاي بنشتغل؟",
    aboutContact:     "تواصل معنا",
    aboutContactBody: "لو عندك ورشة وعايز تنضم أو عندك سؤال، تواصل معنا على:",

    // List shop page
    listShopTitle:      "سجّل ورشتك على وَرشة فايندر",
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

    // Listings
    listingsTitle:      "ورش مضافة مؤخراً",
    listingsSubtitle:   "الورش اللي انضمت للمنصة",

    // How it works
    howHeading: "كيف يشتغل وَرشة فايندر؟",
    howSubhead: "٣ خطوات بس",
    steps: [
      { step: "خطوة ١", title: "اوصف مشكلتك",   body: "قول إيه اللي محتاج تعمله في عربيتك — ميكانيكا، تشطيب، تيونينج، أو صوتيات", icon: "🔍" },
      { step: "خطوة ٢", title: "قارن الورش",     body: "شوف التقييمات، الصور، والأسعار لأفضل الورش المتخصصة في منطقتك", icon: "⚖️" },
      { step: "خطوة ٣", title: "تواصل مباشرة",  body: "كلم الورشة على واتساب أو احجز موعد من غير ما تغادر المنصة", icon: "💬" },
    ],

    // Footer CTA
    footerCtaH:    "عندك ورشة؟",
    footerCtaBody: "سجّل ورشتك على وَرشة فايندر وابدأ تستقبل عملاء جدد من يومك الأول — مجاناً خلال الفترة التجريبية",
    footerCtaBtn:  "سجّل ورشتك مجاناً ←",
    footerCopy:    "وَرشة فايندر © ٢٠٢٥ — جميع الحقوق محفوظة",

    // Suggestions
    suggestions: ["تغيير زيت المحرك", "تغليف الكابوريا", "برمجة ECU", "تركيب شاشة أندرويد", "تبديل إطارات", "صبغ الجنوط", "التكييف مش بيبرد", "المحرك بيسخن", "فحص كمبيوتر"],
  },

  en: {
    // Nav
    appName:        "WarshaFinder",
    navShops:       "Workshops",
    navServices:    "Services",
    navMap:         "Map",
    navAbout:       "About",
    navRegisterCta: "List your shop",

    // Hero
    eyebrow:     "67+ verified workshops across Cairo",
    h1Line1:     "Find the right shop",
    h1Line2:     "for your car",
    heroBod:     "Search by what you need — mechanical work, interior, exterior, tuning, or audio — and contact the nearest specialist directly.",
    searchPlaceholder: "Search — e.g. ECU tuning, wrap, oil change, AC not cooling...",
    searchBtn:   "Search",

    // Stats
    stat1Val:  "67+",  stat1Lbl: "Registered shops",
    stat2Val:  "12",   stat2Lbl: "Specialisations",
    stat3Val:  "3",    stat3Lbl: "Areas",

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
    servicesSubtitle: "Everything you can find on WarshaFinder",

    // About page
    aboutTitle:       "About WarshaFinder",
    aboutMission:     "Our mission",
    aboutMissionBody: "WarshaFinder is Egypt's first platform connecting car owners with specialist workshops — mechanical, interior, tuning, and more — in a simple, trustworthy way.",
    aboutHowTitle:    "How does it work?",
    aboutContact:     "Contact us",
    aboutContactBody: "If you own a shop and want to join, or have a question, reach us at:",

    // List shop page
    listShopTitle:      "List your shop on WarshaFinder",
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

    // Listings
    listingsTitle:      "Recently listed shops",
    listingsSubtitle:   "Shops that have joined the platform",

    // How it works
    howHeading: "How WarshaFinder works",
    howSubhead: "Three simple steps",
    steps: [
      { step: "Step 1", title: "Describe your problem", body: "Tell us what you need — mechanical, interior, tuning, or audio — and we'll find specialists.", icon: "🔍" },
      { step: "Step 2", title: "Compare workshops", body: "See ratings, photos, and price ranges for the best shops near you.", icon: "⚖️" },
      { step: "Step 3", title: "Contact directly",  body: "Message the shop on WhatsApp or book an appointment without leaving the platform.", icon: "💬" },
    ],

    // Footer CTA
    footerCtaH:    "Own a workshop?",
    footerCtaBody: "List your shop on WarshaFinder and start receiving customers from day one — free during the beta period.",
    footerCtaBtn:  "List your shop free →",
    footerCopy:    "WarshaFinder © 2025 — All rights reserved",

    // Suggestions
    suggestions: ["Oil change", "Vinyl wrap", "ECU remapping", "Android screen install", "Tyre change", "Rim painting", "AC not cooling", "Engine overheating", "Computer diagnostics"],
  },
} as const;

// ─── Categories ─────────────────────────────────────────────────────────────

export type Subcategory = { id: string; ar: string; en: string; icon: string };

export const CATEGORIES = [
  {
    id: "mechanical", ar: "ميكانيكا", en: "Mechanical", icon: "⚙️",
    count: { ar: "٢٠+", en: "20+" }, accent: "#E8730A",
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
    count: { ar: "٥+", en: "5+" }, accent: "#3B82F6",
    description: { ar: "صوتيات، إضاءة، شاشات، جلد مقاعد وإكسسوارات", en: "Audio, lighting, screens, leather seats & accessories" },
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
    count: { ar: "٣+", en: "3+" }, accent: "#10B981",
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
    count: { ar: "٣+", en: "3+" }, accent: "#EF4444",
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
    count: { ar: "٣+", en: "3+" }, accent: "#06B6D4",
    description: { ar: "فحص كمبيوتر وأعطال السيارة", en: "Computer diagnostics & fault codes" },
    subcategories: [] as Subcategory[],
  },
  {
    id: "tires", ar: "إطارات وجنوط", en: "Tyres & Rims", icon: "🔄",
    count: { ar: "٧+", en: "7+" }, accent: "#F59E0B",
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
    count: { ar: "٣+", en: "3+" }, accent: "#EC4899",
    description: { ar: "دهان، تغليف، وتلوين كاليبر", en: "Full paint, wrap & caliper coating" },
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
    count: { ar: "٥+", en: "5+" }, accent: "#8B5CF6",
    description: { ar: "سيراميك، تغليف حماية PPF، ونانو", en: "Ceramic coating, PPF & nano protection" },
    subcategories: [
      { id: "ceramic_coating", ar: "سيراميك",          en: "Ceramic coating",       icon: "✨" },
      { id: "ppf",             ar: "تغليف حماية PPF",  en: "Paint protection film", icon: "🎞️" },
      { id: "window_tint",     ar: "تظليل الزجاج",     en: "Window tinting",        icon: "🕶️" },
      { id: "undercoating",    ar: "حماية تحت الشاسيه", en: "Undercoating",         icon: "🔧" },
    ] as Subcategory[],
  },
  {
    id: "car_wash", ar: "غسيل وتفصيل", en: "Car wash & detailing", icon: "🚿",
    count: { ar: "٧+", en: "7+" }, accent: "#0EA5E9",
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
    count: { ar: "٢+", en: "2+" }, accent: "#64748B",
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
    count: { ar: "١+", en: "1+" }, accent: "#38BDF8",
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
    count: { ar: "٢+", en: "2+" }, accent: "#EAB308",
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
  { id: 116,  name: "Nacita Auto Care",         area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },      rating: 4.7, reviews: 0, tags: { ar: ["صيانة شاملة", "إطارات", "غسيل"],       en: ["Full service", "Tyres", "Car wash"] },           badge: true  },
  { id: 601,  name: "Ghataty — Michelin",       area: { ar: "كرافت زون — مدينتي", en: "Craft Zone — Madinaty" },      rating: 5.0, reviews: 5, tags: { ar: ["ميشلان", "هانكوك", "بطاريات VARTA"], en: ["Michelin", "Hankook", "VARTA batteries"] },      badge: false },
  { id: 1410, name: "Real Performance Garage",  area: { ar: "القاهرة الجديدة",    en: "New Cairo" },                  rating: 4.8, reviews: 0, tags: { ar: ["تيونينج", "بيرفورمانس", "ECU"],       en: ["Tuning", "Performance", "ECU"] },               badge: false },
  { id: 1422, name: "Gemy Mechanic & RevLimit",  area: { ar: "القاهرة الجديدة",    en: "New Cairo" },                  rating: 4.8, reviews: 0, tags: { ar: ["تيونينج", "ميكانيكا", "ECU"],          en: ["Tuning", "Mechanical", "ECU"] },                badge: false },
];

// ─── All shops ───────────────────────────────────────────────────────────────

export const SHOPS = [

  // ── MECHANICAL — Madinaty / Sherouk ──────────────────────────────────────
  { id: 105,  name: "AutoLube Express",                   area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.5, reviews: 12, category: "mechanical",     subcategory: "engine",          tags: { ar: ["تغيير زيت", "زيوت وفلاتر"],                                     en: ["Oil change", "Oils & filters"] },                                  lat: 30.1602077, lng: 31.658392,   phone: null },
  { id: 106,  name: "German Kraft",                       area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة مرسيدس", "قطع غيار أصلية"],                              en: ["Mercedes service", "Original spare parts"] },                      lat: 30.0768131, lng: 31.6753053,  phone: null },
  { id: 107,  name: "American Land Car Service",          area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "تغيير زيت"],                                     en: ["General service", "Oil change"] },                                  lat: 30.0722409, lng: 31.6736938,  phone: null },
  { id: 108,  name: "المتحدة لصيانة السيارات",           area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "كهرباء سيارات", "فرامل"],                        en: ["General maintenance", "Auto electrics", "Brakes"] },               lat: 30.0723825, lng: 31.6724746,  phone: null },
  { id: 109,  name: "100 Plus",                           area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة متخصصة", "قطع غيار"],                                    en: ["Specialist service", "Spare parts"] },                              lat: 30.0723706, lng: 31.6717233,  phone: null },
  { id: 110,  name: "AlHabiba Auto MG Service Center",    area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة MG", "مركز خدمة معتمد"],                                 en: ["MG service center", "Authorized service"] },                        lat: 30.072364,  lng: 31.6715279,  phone: null },
  { id: 111,  name: "C.S Mercedes Benz Service Center",   area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.7, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة مرسيدس", "خدمة معتمدة"],                                 en: ["Mercedes Benz service", "Certified center"] },                      lat: 30.0723819, lng: 31.6704331,  phone: null },
  { id: 112,  name: "El Saba Auto Service",               area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "كهرباء سيارات"],                                 en: ["General service", "Auto electrics"] },                              lat: 30.1648122, lng: 31.6210379,  phone: null },
  { id: 113,  name: "European Service Center",            area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة سيارات أوروبية", "فحص إلكتروني"],                        en: ["European car service", "Electronic diagnostics"] },                 lat: 30.1648487, lng: 31.6238271,  phone: null },
  { id: 114,  name: "MATIC AUTO — ŠKODA Service",         area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.7, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة سكودا", "مركز خدمة معتمد"],                              en: ["ŠKODA service", "Authorized service"] },                            lat: 30.1630018, lng: 31.6150887,  phone: null },
  { id: 115,  name: "KIA Al Shorouk",                     area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة كيا", "مركز خدمة معتمد"],                                en: ["KIA service center", "Authorized service"] },                       lat: 30.164368,  lng: 31.621078,   phone: null },
  { id: 116,  name: "Nacita Auto Care",                   area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.7, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة شاملة", "إطارات", "غسيل"],                               en: ["Full service", "Tyres", "Car wash"] },                              lat: 30.0724,    lng: 31.6715,     phone: "19725" },
  { id: 117,  name: "صيانة رينو مدينتي — EIM",           area: { ar: "مدينتي",                    en: "Madinaty" },                       rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة رينو", "مركز خدمة معتمد"],                               en: ["Renault service", "Authorized center"] },                           lat: 30.1041237, lng: 31.6049483,  phone: null },

  // ── TYRES & RIMS ──────────────────────────────────────────────────────────
  { id: 601,  name: "Ghataty — Michelin Tyres & Services",area: { ar: "كرافت زون بلوك ١ — مدينتي", en: "Craft Zone Block 1 — Madinaty" }, rating: 5.0, reviews: 5,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["ميشلان", "هانكوك", "بطاريات VARTA", "تركيب وموازنة"],          en: ["Michelin", "Hankook", "VARTA batteries", "Fitting & balancing"] },  lat: 30.07236,   lng: 31.66902,    phone: "+201066046551" },
  { id: 602,  name: "ACDelco — مؤسسة أشرف أبو إسماعيل", area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["إطارات ACDelco", "بطاريات", "تركيب"],                          en: ["ACDelco tyres", "Batteries", "Fitting"] },                          lat: 30.0722604, lng: 31.6703279,  phone: null },
  { id: 603,  name: "Fit & Fix Madinaty 2",               area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["بريدجستون", "تركيب إطارات", "ضبط زوايا"],                      en: ["Bridgestone", "Tyre fitting", "Wheel alignment"] },                  lat: 30.0724375, lng: 31.6701875,  phone: null },
  { id: 604,  name: "ElAggar Auto Tires",                  area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["إطارات", "موازنة", "ضبط زوايا"],                               en: ["Tyres", "Balancing", "Alignment"] },                                lat: 30.0723795, lng: 31.6706798,  phone: null },
  { id: 605,  name: "Kandil Tires — قنديل للإطارات",     area: { ar: "كرافت زون محل ١٤ — مدينتي", en: "Craft Zone Shop 14 — Madinaty" }, rating: 4.5, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["إطارات", "تركيب", "موازنة عجل"],                               en: ["Tyres", "Fitting", "Wheel balancing"] },                            lat: 30.072372,  lng: 31.6712423,  phone: null },
  { id: 606,  name: "Elzamlout Tire & Auto Service",      area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["إطارات", "صيانة سيارات", "ضبط زوايا"],                         en: ["Tyres", "Auto service", "Alignment"] },                             lat: 30.0722696, lng: 31.672394,   phone: null },
  { id: 607,  name: "Ashrafco Madinaty",                   area: { ar: "مدينتي",                    en: "Madinaty" },                       rating: 4.7, reviews: 0,  category: "tires",          subcategory: "tyre_fitting",    tags: { ar: ["إطارات", "جنوط رياضية", "بطاريات"],                            en: ["Tyres", "Sport rims", "Batteries"] },                               lat: 30.1042348, lng: 31.604333,   phone: "15021" },

  // ── CAR WASH & DETAILING ──────────────────────────────────────────────────
  { id: 901,  name: "212 Car Wash",                        area: { ar: "مدينتي",                    en: "Madinaty" },                       rating: 4.5, reviews: 0,  category: "car_wash",       subcategory: "foam_wash",       tags: { ar: ["غسيل فوم", "غسيل خارجي", "تلميع"],                             en: ["Foam wash", "Exterior wash", "Polish"] },                           lat: 30.0723947, lng: 31.6700663,  phone: null },
  { id: 902,  name: "Wash Box",                            area: { ar: "مدينتي",                    en: "Madinaty" },                       rating: 4.6, reviews: 0,  category: "car_wash",       subcategory: "full_detail",     tags: { ar: ["غسيل كامل", "شفط داخلي", "تلميع"],                             en: ["Full wash", "Interior vacuum", "Polish"] },                         lat: 30.0732445, lng: 31.6752871,  phone: null },
  { id: 903,  name: "AUTO TIME",                           area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "car_wash",       subcategory: "foam_wash",       tags: { ar: ["غسيل سيارات", "تلميع"],                                        en: ["Car wash", "Polishing"] },                                          lat: 30.0722649, lng: 31.6718219,  phone: null },
  { id: 904,  name: "Oreo Car Detailing",                  area: { ar: "كرافت زون بلوك ٩ — مدينتي", en: "Craft Zone Block 9 — Madinaty" }, rating: 4.7, reviews: 0,  category: "car_wash",       subcategory: "full_detail",     tags: { ar: ["تلميع", "سيراميك نانو", "حماية PPF"],                          en: ["Polishing", "Nano ceramic", "PPF protection"] },                    lat: 30.0724,    lng: 31.6753,     phone: "+201092221382" },

  // ── CAR PROTECTION ────────────────────────────────────────────────────────
  { id: 701,  name: "Ceramic Pro Madinaty",                area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.8, reviews: 0,  category: "car_protection", subcategory: "ceramic_coating", tags: { ar: ["سيراميك برو", "تغليف PPF", "حماية طلاء"],                      en: ["Ceramic Pro", "PPF wrapping", "Paint protection"] },                lat: 30.0722905, lng: 31.673427,   phone: null },
  { id: 702,  name: "EXOTICA Nano Ceramic",                area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "car_protection", subcategory: "ceramic_coating", tags: { ar: ["سيراميك نانو", "تلميع", "حماية طلاء"],                         en: ["Nano ceramic", "Polishing", "Paint protection"] },                   lat: 30.0723486, lng: 31.6722368,  phone: null },

  // ── AUTO GLASS ────────────────────────────────────────────────────────────
  { id: 1001, name: "Dr. Khaled Autoglass — Madinaty",    area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.7, reviews: 0,  category: "glass_repair",   subcategory: "windscreen",      tags: { ar: ["تغيير زجاج أمامي", "إصلاح شروخ"],                              en: ["Windscreen replacement", "Crack repair"] },                         lat: 30.072364,  lng: 31.6693188,  phone: null },
  { id: 1002, name: "Dr. Khaled Autoglass — الشروق",     area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.7, reviews: 0,  category: "glass_repair",   subcategory: "windscreen",      tags: { ar: ["تغيير زجاج أمامي", "إصلاح شروخ"],                              en: ["Windscreen replacement", "Crack repair"] },                         lat: 30.1642611, lng: 31.6202034,  phone: null },

  // ── CAR A/C ───────────────────────────────────────────────────────────────
  { id: 1101, name: "Brothercond For Air Conditioning",   area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.7, reviews: 0,  category: "car_ac",         subcategory: "ac_service",      tags: { ar: ["صيانة تكييف", "شحن فريون", "تركيب وحدات"],                     en: ["A/C maintenance", "Gas recharge", "Unit installation"] },           lat: 30.072347,  lng: 31.6730658,  phone: "+201222211310" },

  // ── PAINT & WRAP ──────────────────────────────────────────────────────────
  { id: 401,  name: "French Motors Service — Body & Paint",area: { ar: "مدينة الشروق",              en: "Sherouk City" },                   rating: 4.6, reviews: 0,  category: "paint_wrap",     subcategory: "full_paint",      tags: { ar: ["دهان كامل", "إصلاح هيكل"],                                     en: ["Full respray", "Body repair"] },                                    lat: 30.1635603, lng: 31.6151848,  phone: null },

  // ── INTERIOR ──────────────────────────────────────────────────────────────
  { id: 1201, name: "المصرية لكماليات السيارات",          area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "interior",       subcategory: "interior_acc",    tags: { ar: ["إكسسوارات داخلية", "إكسسوارات خارجية"],                        en: ["Interior accessories", "Exterior accessories"] },                   lat: 30.0757013, lng: 31.6753169,  phone: null },
  { id: 1202, name: "محسن الباشا لرفاهية السيارات",      area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.6, reviews: 0,  category: "interior",       subcategory: "interior_acc",    tags: { ar: ["إكسسوارات فاخرة", "تجهيزات داخلية"],                           en: ["Luxury accessories", "Interior fittings"] },                        lat: 30.0721834, lng: 31.6716504,  phone: null },

  // ── AUTO ELECTRICS ────────────────────────────────────────────────────────
  { id: 1301, name: "صيانة كهرباء السيارات — مدينتي",   area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "auto_electric",  subcategory: "wiring",          tags: { ar: ["كهرباء عامة", "عزل أسلاك", "تشخيص"],                          en: ["General electrics", "Wiring", "Diagnostics"] },                     lat: 30.0724,    lng: 31.6720,     phone: null },
  { id: 1302, name: "بطاريات وكهرباء السيارات — مدينتي",area: { ar: "كرافت زون — مدينتي",        en: "Craft Zone — Madinaty" },          rating: 4.5, reviews: 0,  category: "auto_electric",  subcategory: "battery",         tags: { ar: ["بطاريات VARTA", "بطاريات Bosch", "شحن وتركيب"],               en: ["VARTA batteries", "Bosch batteries", "Installation"] },             lat: 30.0723,    lng: 31.6715,     phone: null },

  // ── NEW CAIRO — PROTECTION ─────────────────────────────────────────────────
  { id: 1401, name: "Diamond Cover - Car Paint Protection",area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "car_protection", subcategory: "ppf",             tags: { ar: ["حماية طلاء", "PPF", "تغليف حماية"],                            en: ["Paint protection", "PPF", "Car wrap"] },                            lat: 30.020305,  lng: 31.422305,   phone: null },
  { id: 1402, name: "Protect Me Egypt",                    area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "car_protection", subcategory: "ppf",             tags: { ar: ["حماية PPF", "تغليف حماية", "سيراميك"],                         en: ["PPF protection", "Ceramic coating", "Paint protection"] },           lat: 29.974352,  lng: 31.481993,   phone: null },
  { id: 1403, name: "Dr Nano Protection",                  area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "car_protection", subcategory: "ceramic_coating", tags: { ar: ["نانو سيراميك", "حماية طلاء", "تلميع"],                         en: ["Nano ceramic", "Paint protection", "Polishing"] },                   lat: 29.973874,  lng: 31.480521,   phone: null },
  { id: 1431, name: "Diamond Cover - New Cairo 2",         area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "car_protection", subcategory: "ppf",             tags: { ar: ["حماية طلاء", "PPF", "تغليف حماية"],                            en: ["Paint protection", "PPF", "Car wrap"] },                            lat: 30.019554,  lng: 31.422423,   phone: null },

  // ── NEW CAIRO — MECHANICAL ─────────────────────────────────────────────────
  { id: 1404, name: "Car Guide Garage",                    area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "إصلاح سيارات", "تشخيص"],                        en: ["General service", "Car repair", "Diagnostics"] },                   lat: 29.971738,  lng: 31.482366,   phone: null },
  { id: 1407, name: "XCAR Elite Automobile Services",      area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة سيارات", "ميكانيكا", "قطع غيار"],                        en: ["Car service", "Mechanical", "Spare parts"] },                       lat: 29.973483,  lng: 31.480607,   phone: null },
  { id: 1408, name: "Mansco Peugeot - New Cairo",          area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة بيجو", "خدمة معتمدة", "قطع غيار أصلية"],                en: ["Peugeot service", "Authorized service", "Original parts"] },         lat: 29.973222,  lng: 31.480696,   phone: null },
  { id: 1409, name: "The Mechanics Shop",                  area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["ميكانيكا عامة", "صيانة", "إصلاح"],                             en: ["General mechanical", "Maintenance", "Repair"] },                    lat: 29.972171,  lng: 31.481292,   phone: null },
  { id: 1411, name: "ROSSO Auto Service",                  area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "ميكانيكا", "خدمة سيارات"],                       en: ["General service", "Mechanical", "Car service"] },                   lat: 29.971571,  lng: 31.485338,   phone: null },
  { id: 1412, name: "Al Selmy Jeep Service",               area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة جيب", "خدمة معتمدة", "4x4"],                             en: ["Jeep service", "4x4 specialist", "Mechanical"] },                   lat: 29.971140,  lng: 31.484074,   phone: null },
  { id: 1413, name: "Auto-Shift Egypt",                    area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "transmission",    tags: { ar: ["إصلاح جيربوكس", "ناقل حركة", "صيانة"],                        en: ["Gearbox repair", "Transmission", "Maintenance"] },                  lat: 29.972321,  lng: 31.486031,   phone: null },
  { id: 1414, name: "Macchin Plus",                        area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["ميكانيكا", "صيانة سيارات", "إصلاح"],                          en: ["Mechanical", "Car maintenance", "Repair"] },                        lat: 29.972847,  lng: 31.485737,   phone: null },
  { id: 1416, name: "Opel Garage Service Center",          area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة أوبل", "خدمة معتمدة", "قطع غيار"],                      en: ["Opel service", "Authorized service", "Spare parts"] },              lat: 29.968580,  lng: 31.479303,   phone: null },
  { id: 1420, name: "Fix Automotive Service Center",       area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة عامة", "ميكانيكا", "خدمة سيارات"],                       en: ["General service", "Mechanical", "Car service"] },                   lat: 30.050595,  lng: 31.320012,   phone: null },
  { id: 1421, name: "Khaled Mechanic",                     area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.4, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["ميكانيكا", "صيانة", "إصلاح"],                                  en: ["Mechanical", "Maintenance", "Repair"] },                            lat: 30.039062,  lng: 31.339981,   phone: null },
  { id: 1427, name: "360 Car Center",                      area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة شاملة", "تفصيل", "ميكانيكا"],                            en: ["Full service", "Detailing", "Mechanical"] },                        lat: 30.046118,  lng: 31.325042,   phone: null },

  // ── MOKATTAM — MECHANICAL ─────────────────────────────────────────────────
  { id: 1417, name: "Ibrahim Mechanic",                    area: { ar: "المقطم",                   en: "Mokattam" },                       rating: 4.4, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["ميكانيكا عامة", "صيانة", "إصلاح"],                             en: ["General mechanical", "Maintenance", "Repair"] },                    lat: 30.100259,  lng: 31.299204,   phone: null },
  { id: 1418, name: "Tamer Honda — ورشة ميكانيكي",       area: { ar: "المقطم",                   en: "Mokattam" },                       rating: 4.6, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة هوندا", "ميكانيكا هوندا", "قطع غيار هوندا"],             en: ["Honda service", "Honda mechanic", "Honda parts"] },                 lat: 30.101980,  lng: 31.296722,   phone: null },
  { id: 1419, name: "حافظ هوندا",                         area: { ar: "المقطم",                   en: "Mokattam" },                       rating: 4.5, reviews: 0,  category: "mechanical",     subcategory: "engine",          tags: { ar: ["صيانة هوندا", "ميكانيكا هوندا", "متخصص هوندا"],                en: ["Honda service", "Honda specialist", "Honda repair"] },              lat: 30.102333,  lng: 31.296152,   phone: null },

  // ── NEW CAIRO — DIAGNOSTICS ────────────────────────────────────────────────
  { id: 1405, name: "Car Clinic Tagamo3",                  area: { ar: "التجمع الخامس",            en: "New Cairo - Tagamo3" },            rating: 4.6, reviews: 0,  category: "diagnostics",    subcategory: null,              tags: { ar: ["فحص سيارات", "تشخيص", "كشف أعطال"],                           en: ["Vehicle inspection", "Diagnostics", "Fault detection"] },           lat: 30.079523,  lng: 31.398386,   phone: null },
  { id: 1415, name: "ESOTICA AUTO",                        area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "diagnostics",    subcategory: null,              tags: { ar: ["دياجنوستيك", "تشخيص", "فحص كمبيوتر", "ميكانيكا"],             en: ["Diagnostics", "Computer scan", "Mechanical", "Performance"] },      lat: 29.974219,  lng: 31.483003,   phone: null },

  // ── NEW CAIRO — PERFORMANCE ────────────────────────────────────────────────
  { id: 1410, name: "Real Performance Garage",             area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.8, reviews: 0,  category: "performance",    subcategory: "tuning",          tags: { ar: ["تيونينج", "بيرفورمانس", "تعديلات سيارات"],                    en: ["Tuning", "Performance", "Car modifications"] },                     lat: 29.970706,  lng: 31.485138,   phone: null },
  { id: 1422, name: "Gemy Mechanic and Tuning - RevLimit", area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.8, reviews: 0,  category: "performance",    subcategory: "tuning",          tags: { ar: ["تيونينج", "بيرفورمانس", "ميكانيكا رياضية", "ECU"],            en: ["Tuning", "Performance", "Sport mechanical", "ECU"] },               lat: 30.043643,  lng: 31.376234,   phone: null },

  // ── NEW CAIRO — WRAPPING ───────────────────────────────────────────────────
  { id: 1406, name: "Carprogini",                          area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "paint_wrap",     subcategory: "car_wrap",        tags: { ar: ["تغليف سيارات", "تغليف فينيل", "تغليف كروم"],                   en: ["Car wrapping", "Vinyl wrap", "Chrome wrap"] },                      lat: 29.974301,  lng: 31.480827,   phone: null },

  // ── NEW CAIRO — INTERIOR & ACCESSORIES ───────────────────────────────────
  { id: 1423, name: "Car Accessories Shop - New Cairo",    area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "interior",       subcategory: "sound_system",    tags: { ar: ["إكسسوارات سيارات", "شاشات", "سبيكرات", "حساسات ركن", "LED"], en: ["Car accessories", "Screens", "Speakers", "Parking sensors", "LED"] }, lat: 30.050613,  lng: 31.345131,   phone: null },
  { id: 1425, name: "Jeans Car",                           area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "interior",       subcategory: "interior_acc",    tags: { ar: ["تغيير جلد مقاعد", "تشطيب داخلي", "خياطة جلد"],                en: ["Leather seats", "Interior upholstery", "Leather stitching"] },      lat: 30.054116,  lng: 31.328257,   phone: null },
  { id: 1428, name: "Almasa Car Accessories",              area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "interior",       subcategory: "interior_acc",    tags: { ar: ["إكسسوارات سيارات", "كاربون فايبر", "إضاءة أمبيانس", "سبويلر"],en: ["Car accessories", "Carbon fiber", "Ambient lights", "Spoilers"] },  lat: 30.037921,  lng: 31.343468,   phone: null },

  // ── NEW CAIRO — CAR WASH & DETAILING ─────────────────────────────────────
  { id: 1424, name: "X Car Care",                          area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.7, reviews: 0,  category: "car_wash",       subcategory: "full_detail",     tags: { ar: ["تفصيل سيارات", "تلميع", "غسيل احترافي"],                       en: ["Car detailing", "Polishing", "Professional wash"] },                lat: 30.057304,  lng: 31.334004,   phone: null },
  { id: 1426, name: "Friend Car Care and Car Protection",  area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.6, reviews: 0,  category: "car_wash",       subcategory: "full_detail",     tags: { ar: ["غسيل سيارات", "حماية طلاء", "تلميع"],                          en: ["Car wash", "Paint protection", "Polishing"] },                      lat: 30.059135,  lng: 31.358145,   phone: null },
  { id: 1429, name: "Barakat Car Wash",                    area: { ar: "القاهرة الجديدة",          en: "New Cairo" },                      rating: 4.5, reviews: 0,  category: "car_wash",       subcategory: "foam_wash",       tags: { ar: ["غسيل سيارات", "غسيل فوم", "تنظيف خارجي"],                     en: ["Car wash", "Foam wash", "Exterior cleaning"] },                     lat: 30.044397,  lng: 31.496115,   phone: null },
];
