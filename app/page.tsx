"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { t, CATEGORIES, FEATURED_SHOPS, type Lang } from "./lib/translations";
import Navbar from "./components/Navbar";

function useThemeAndLang() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Lang>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";

    const savedLang =
      (localStorage.getItem("warsha-lang") as Lang) || "ar";

    setTheme(savedTheme);
    setLang(savedLang);
    setMounted(true);

    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("lang", savedLang);
    document.documentElement.setAttribute(
      "dir",
      savedLang === "ar" ? "rtl" : "ltr"
    );
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
    document.documentElement.setAttribute(
      "dir",
      next === "ar" ? "rtl" : "ltr"
    );
  }, [lang]);

  return {
    theme,
    lang,
    toggleTheme,
    toggleLang,
    mounted,
  };
}

const PROBLEM_MAP: { keywords: string[]; cat: string }[] = [
  {
    keywords: [
      "ac",
      "a/c",
      "air con",
      "not cooling",
      "تكييف",
      "فريون",
      "مش بيبرد",
    ],
    cat: "car_ac",
  },
  {
    keywords: [
      "overheat",
      "engine",
      "oil",
      "محرك",
      "زيت",
      "بيسخن",
      "won't start",
      "مش بيشتغل",
    ],
    cat: "mechanical",
  },
  {
    keywords: [
      "tyre",
      "tire",
      "flat",
      "wheel",
      "rim",
      "إطار",
      "عجل",
      "جنط",
    ],
    cat: "tires",
  },
  {
    keywords: [
      "glass",
      "windscreen",
      "crack",
      "زجاج",
      "شرخ",
      "كسر",
    ],
    cat: "glass_repair",
  },
  {
    keywords: [
      "wrap",
      "paint",
      "dent",
      "scratch",
      "دهان",
      "تغليف",
      "خدش",
    ],
    cat: "paint_wrap",
  },
  {
    keywords: [
      "ceramic",
      "ppf",
      "tint",
      "سيراميك",
      "تظليل",
      "حماية",
    ],
    cat: "car_protection",
  },
  {
    keywords: [
      "wash",
      "detail",
      "polish",
      "غسيل",
      "تلميع",
      "تفصيل",
    ],
    cat: "car_wash",
  },
  {
    keywords: [
      "battery",
      "electric",
      "wiring",
      "كهرباء",
      "بطارية",
      "أسلاك",
    ],
    cat: "auto_electric",
  },
  {
    keywords: [
      "diagnos",
      "scan",
      "fault",
      "code",
      "check engine",
      "دياجنوستيك",
      "فحص",
    ],
    cat: "diagnostics",
  },
  {
    keywords: [
      "speaker",
      "screen",
      "audio",
      "sound",
      "شاشة",
      "صوت",
      "سبيكر",
    ],
    cat: "interior",
  },
  {
    keywords: [
      "spoiler",
      "body kit",
      "سبويلر",
      "بودي كيت",
    ],
    cat: "exterior",
  },
  {
    keywords: [
      "turbo",
      "ecu",
      "exhaust",
      "performance",
      "تيونينج",
      "شكمان",
    ],
    cat: "performance",
  },
];

const PROBLEM_WORDS = [
  "not",
  "won't",
  "broken",
  "noise",
  "leak",
  "overheating",
  "grinding",
  "مش",
  "بيسخن",
  "صوت",
  "مشكلة",
];

function handleSearch(query: string) {
  const q = query.trim();

  if (!q) {
    window.location.href = "/workshops";
    return;
  }

  const lower = q.toLowerCase();

  const looksLikeProblem =
    q.split(" ").length > 2 ||
    PROBLEM_WORDS.some((word) => lower.includes(word));

  if (looksLikeProblem) {
    window.location.href = `/diagnose?q=${encodeURIComponent(q)}`;
    return;
  }

  const match = PROBLEM_MAP.find((problem) =>
    problem.keywords.some((keyword) => lower.includes(keyword))
  );

  window.location.href = match
    ? `/workshops?cat=${match.cat}&q=${encodeURIComponent(q)}`
    : `/workshops?q=${encodeURIComponent(q)}`;
}

export default function HomePage() {
  const {
    theme,
    lang,
    toggleTheme,
    toggleLang,
    mounted,
  } = useThemeAndLang();

  const tr = t[lang];

  const dir = lang === "ar" ? "rtl" : "ltr";

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  if (!mounted) return null;

  const filteredSuggestions = tr.suggestions.filter((suggestion) =>
    query.length > 0
      ? suggestion.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
      }}
    >
      <Navbar
        lang={lang}
        theme={theme}
        onToggleLang={toggleLang}
        onToggleTheme={toggleTheme}
      />

      {/* HERO */}
      <section
        style={{
          padding: "70px 20px 58px",
          textAlign: "center",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
          }}
        >

          <h1
            style={{
              fontSize: "clamp(30px, 6vw, 52px)",
              fontWeight: 850,
              color: "var(--text-primary)",
              margin: "0 0 14px",
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
          >
            {lang === "ar" ? (
              <>
                ورشتك الصح،
                <br />
                <span style={{ color: "var(--accent)" }}>
                  قريبة منك
                </span>
              </>
            ) : (
              <>
                Find the right workshop,
                <br />
                <span style={{ color: "var(--accent)" }}>
                  near you
                </span>
              </>
            )}
          </h1>

          <p
            style={{
              maxWidth: 570,
              margin: "0 auto 32px",
              fontSize: 15,
              lineHeight: 1.75,
              color: "var(--text-secondary)",
            }}
          >
            {lang === "ar"
              ? "دليل شامل لورش السيارات في مدينتي، الشروق، والقاهرة الجديدة"
              : "The complete guide to car workshops in Madinaty, Sherouk & New Cairo"}
          </p>

          {/* SEARCH */}
          <div
            ref={searchRef}
            style={{
              position: "relative",
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 9px 8px 16px",

                background: "var(--bg-card)",

                borderRadius: 14,

                border: `1px solid ${
                  focused
                    ? "var(--accent)"
                    : "var(--border-strong)"
                }`,

                boxShadow: focused
                  ? "0 0 0 4px var(--accent-muted), var(--shadow-lg)"
                  : "var(--shadow-sm)",

                transition: "all .2s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  focused
                    ? "var(--accent)"
                    : "var(--text-tertiary)"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() =>
                  setTimeout(() => setFocused(false), 150)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(query);
                  }
                }}
                placeholder={
                  lang === "ar"
                    ? "ابحث — مثلاً: غسيل، تكييف، إطارات..."
                    : "Search — e.g. oil change, AC, tyres..."
                }
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "var(--text-primary)",
                  fontFamily: "inherit",
                  direction: dir,
                  textAlign:
                    dir === "rtl" ? "right" : "left",
                }}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-tertiary)",
                    fontSize: 19,
                    padding: 4,
                  }}
                >
                  ×
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSearch(query)}
                style={{
                  height: 40,
                  padding: "0 18px",
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "var(--text-inverse)",
                  border: "1px solid var(--accent-border)",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 750,
                  fontFamily: "inherit",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  boxShadow:
                    "0 4px 14px var(--accent-muted)",
                }}
              >
                {lang === "ar" ? "بحث" : "Search"}
              </button>
            </div>

            {/* SUGGESTIONS */}
            {focused && filteredSuggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  zIndex: 50,

                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,

                  boxShadow: "var(--shadow-lg)",

                  overflow: "hidden",

                  textAlign: dir === "rtl" ? "right" : "left",
                }}
              >
                {filteredSuggestions
                  .slice(0, 6)
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => {
                        setQuery(suggestion);
                        handleSearch(suggestion);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        borderBottom:
                          "1px solid var(--border)",
                        cursor: "pointer",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        fontFamily: "inherit",
                        textAlign:
                          dir === "rtl"
                            ? "right"
                            : "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>

                      {suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* QUICK SEARCHES */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            {(
              lang === "ar"
                ? ["غسيل سيارة", "تكييف", "فحص شامل", "إطارات"]
                : ["Car wash", "AC repair", "Full checkup", "Tyres"]
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                style={{
                  padding: "7px 13px",
                  borderRadius: 99,

                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",

                  cursor: "pointer",

                  fontSize: 12,
                  color: "var(--text-secondary)",
                  fontFamily: "inherit",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          padding: "20px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {[
            {
              value: "67+",
              label:
                lang === "ar"
                  ? "ورشة متاحة"
                  : "Verified workshops",
            },
            {
              value: "4",
              label: lang === "ar" ? "مناطق" : "Areas",
            },
            {
              value: "12",
              label:
                lang === "ar"
                  ? "تخصص"
                  : "Specialisations",
            },
          ].map((stat) => (
            <div
              key={stat.value}
              style={{
                textAlign: "center",
                padding: "4px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 21,
                  fontWeight: 850,
                  color: "var(--accent)",
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        style={{
          padding: "54px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 750,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  margin: "0 0 5px",
                }}
              >
                {lang === "ar"
                  ? "التخصصات"
                  : "SPECIALISATIONS"}
              </p>

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 850,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {tr.catHeading}
              </h2>
            </div>

            <Link
              href="/workshops"
              style={{
                fontSize: 13,
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 650,
                flexShrink: 0,
              }}
            >
              {lang === "ar"
                ? "كل التخصصات ←"
                : "All →"}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(155px, 1fr))",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/workshops?cat=${cat.id}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,

                  padding: 16,

                  borderRadius: 15,

                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",

                  textDecoration: "none",

                  transition:
                    "transform .18s ease, border-color .18s ease, background .18s ease",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: "var(--accent-muted)",
                    border: "1px solid var(--accent-border)",

                    fontSize: 19,
                  }}
                >
                  {cat.icon}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 3,
                    }}
                  >
                    {lang === "ar" ? cat.ar : cat.en}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {cat.count[lang]} {tr.shopUnit}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section
        style={{
          padding: "54px 20px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 750,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  margin: "0 0 5px",
                }}
              >
                {lang === "ar"
                  ? "مختارة بعناية"
                  : "HAND PICKED"}
              </p>

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 850,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {tr.featuredHeading}
              </h2>
            </div>

            <Link
              href="/workshops"
              style={{
                fontSize: 13,
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 650,
              }}
            >
              {tr.viewAll}{" "}
              {dir === "rtl" ? "←" : "→"}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {FEATURED_SHOPS.map((shop) => {
              const cat = CATEGORIES.find(
                (category) =>
                  category.id === (shop as any).category
              );

              return (
                <div
                  key={shop.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 17,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 15,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 750,
                          color: "var(--text-primary)",
                          marginBottom: 4,
                        }}
                      >
                        {shop.name}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        📍 {shop.area[lang]}
                      </div>
                    </div>

                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 11,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background:
                          "var(--accent-muted)",
                        border:
                          "1px solid var(--accent-border)",

                        fontSize: 18,
                        flexShrink: 0,
                        marginInlineStart: 12,
                      }}
                    >
                      {cat?.icon ?? "🔧"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 12,
                    }}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <span
                          key={index}
                          style={{
                            color:
                              index <
                              Math.round(shop.rating)
                                ? "var(--accent)"
                                : "var(--border-strong)",
                            fontSize: 12,
                          }}
                        >
                          ★
                        </span>
                      )
                    )}

                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginInlineStart: 4,
                      }}
                    >
                      {shop.rating}
                    </span>

                    {shop.reviews > 0 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        ({shop.reviews})
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 5,
                      marginBottom: 16,
                    }}
                  >
                    {shop.tags[lang]
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            padding: "4px 9px",
                            borderRadius: 99,
                            background:
                              "var(--bg-secondary)",
                            color:
                              "var(--text-secondary)",
                            border:
                              "1px solid var(--border)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <Link
                      href={`/chat?shop=${shop.id}`}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,

                        background: "var(--accent)",
                        color: "var(--text-inverse)",

                        border:
                          "1px solid var(--accent-border)",

                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                        textAlign: "center",

                        boxShadow:
                          "0 4px 14px var(--accent-muted)",
                      }}
                    >
                      {lang === "ar"
                        ? "تواصل"
                        : "Message"}
                    </Link>

                    <Link
                      href={`/shop/${shop.id}`}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,

                        background: "transparent",
                        border:
                          "1px solid var(--border)",

                        color: "var(--text-secondary)",

                        fontSize: 13,
                        fontWeight: 650,

                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      {tr.btnView}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "58px 20px",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 750,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            {lang === "ar"
              ? "كيف يعمل؟"
              : "HOW IT WORKS"}
          </p>

          <h2
            style={{
              fontSize: 23,
              fontWeight: 850,
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            {tr.howHeading}
          </h2>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            {tr.howSubhead}
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {tr.steps.map((item, index) => (
              <div
                key={item.step}
                style={{
                  padding: "26px 18px",
                  borderRadius: 16,

                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",

                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    margin: "0 auto 14px",

                    background: "var(--accent-muted)",
                    border:
                      "1px solid var(--accent-border)",

                    fontSize: 12,
                    fontWeight: 800,
                    color: "var(--accent)",
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 12,
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {item.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "58px 20px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 25,
              fontWeight: 850,
              color: "var(--text-primary)",
              margin: "0 0 12px",
            }}
          >
            {tr.footerCtaH}
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              margin: "0 0 28px",
            }}
          >
            {tr.footerCtaBody}
          </p>

          <Link
            href="/list-shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,

              padding: "13px 30px",

              background: "var(--accent)",
              color: "var(--text-inverse)",

              border:
                "1px solid var(--accent-border)",

              borderRadius: 11,

              fontSize: 14,
              fontWeight: 750,

              textDecoration: "none",

              boxShadow:
                "0 6px 20px var(--accent-muted)",
            }}
          >
            {tr.footerCtaBtn}{" "}
            {dir === "rtl" ? "←" : "→"}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "22px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
            }}
          >
            {tr.footerCopy}
          </span>

          <div
            style={{
              display: "flex",
              gap: 20,
            }}
          >
            {[
              {
                href: "/about",
                label: tr.navAbout,
              },
              {
                href: "/list-shop",
                label: tr.navRegisterCta,
              },
              {
                href: "/map",
                label: tr.navMap,
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "var(--text-tertiary)",
                  textDecoration: "none",
                  fontSize: 12,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <div
        className="warsha-home-mobile-nav"
        style={{
          display: "none",
        }}
      >
        {[
          {
            label: lang === "ar" ? "الرئيسية" : "Home",
            href: "/",
            icon: "⌂",
          },
          {
            label: lang === "ar" ? "الورش" : "Workshops",
            href: "/workshops",
            icon: "◈",
          },
          {
            label: lang === "ar" ? "الخريطة" : "Map",
            href: "/map",
            icon: "◎",
          },
          {
            label: lang === "ar" ? "تشخيص" : "Diagnose",
            href: "/diagnose",
            icon: "⚙",
          },
          {
            label: lang === "ar" ? "حسابي" : "Account",
            href: "/dashboard",
            icon: "◯",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              textDecoration: "none",
              padding: "4px 0",
              color: "var(--text-tertiary)",
            }}
          >
            <span
              style={{
                fontSize: 19,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>

            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 700px) {
          .warsha-home-mobile-nav {
            position: fixed;
            display: flex !important;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;

            padding: 8px 4px 14px;

            background: color-mix(
              in srgb,
              var(--bg) 94%,
              transparent
            );

            border-top: 1px solid var(--border);

            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
          }
        }
      `}</style>
    </div>
  );
}