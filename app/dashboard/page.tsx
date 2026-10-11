"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "../lib/supabase";
import Navbar from "../components/Navbar";

const S = {
  ar: {
    loading: "جاري التحميل...",
    welcome: "أهلاً بيك،",
    carRole: "صاحب سيارة",
    shopRole: "صاحب ورشة",

    quickActions: "إجراءات سريعة",
    browse: "تصفح الورش",
    map: "عرض الخريطة",
    logout: "تسجيل الخروج",
    loggingOut: "جاري الخروج...",

    notLoggedIn: "مش مسجّل دخول",
    goLogin: "سجّل دخولك",

    shopActions: "إدارة الورشة",
    addShop: "أضف ورشتك",

    accountInfo: "بيانات الحساب",
    emailLbl: "البريد الإلكتروني",
    roleLbl: "نوع الحساب",
    since: "عضو منذ",

    comingSoon: "قريباً",

    chatSoon: "نظام الرسائل قادم قريباً",
    chatSoonBody:
      "هتقدر تتواصل مع الورش مباشرة من هنا من غير ما تغادر المنصة",

    reviewsSoon: "التقييمات قادمة قريباً",
    reviewsSoonBody:
      "هتقدر تقيّم الورش اللي زرتها وتساعد غيرك في الاختيار",

    listShop: "سجّل ورشتك",
    services: "الخدمات",

    statShops: "ورشة متاحة",
    statCats: "تخصص",
    statArea: "منطقة",
  },

  en: {
    loading: "Loading...",
    welcome: "Welcome back,",
    carRole: "Car owner",
    shopRole: "Shop owner",

    quickActions: "Quick actions",
    browse: "Browse workshops",
    map: "View map",
    logout: "Sign out",
    loggingOut: "Signing out...",

    notLoggedIn: "Not signed in",
    goLogin: "Go to login",

    shopActions: "Manage your shop",
    addShop: "List your shop",

    accountInfo: "Account info",
    emailLbl: "Email",
    roleLbl: "Account type",
    since: "Member since",

    comingSoon: "Coming soon",

    chatSoon: "Messaging coming soon",
    chatSoonBody:
      "Message workshops directly from here without leaving the platform",

    reviewsSoon: "Reviews coming soon",
    reviewsSoonBody:
      "Rate workshops you've visited and help others choose the best shop",

    listShop: "List your shop",
    services: "Services",

    statShops: "Shops available",
    statCats: "Specialisations",
    statArea: "Areas",
  },
};

export default function DashboardPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [userLoading, setUserLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const router = useRouter();

  /*
   * ---------------------------------------------------------
   * LOAD USER / THEME / LANGUAGE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("warsha-theme") as "dark" | "light") || "dark";

    const savedLang =
      (localStorage.getItem("warsha-lang") as "ar" | "en") || "ar";

    setTheme(savedTheme);
    setLang(savedLang);

    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("lang", savedLang);
    document.documentElement.setAttribute(
      "dir",
      savedLang === "ar" ? "rtl" : "ltr"
    );

    setMounted(true);

    getCurrentUser().then((u) => {
      setUser(u);
      setUserLoading(false);
    });
  }, []);

  /*
   * ---------------------------------------------------------
   * THEME
   * ---------------------------------------------------------
   */

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    localStorage.setItem("warsha-theme", nextTheme);

    document.documentElement.setAttribute(
      "data-theme",
      nextTheme
    );
  }, [theme]);

  /*
   * ---------------------------------------------------------
   * LANGUAGE
   * ---------------------------------------------------------
   */

  const toggleLang = useCallback(() => {
    const nextLang: "ar" | "en" =
      lang === "ar" ? "en" : "ar";

    setLang(nextLang);

    localStorage.setItem("warsha-lang", nextLang);

    document.documentElement.setAttribute(
      "lang",
      nextLang
    );

    document.documentElement.setAttribute(
      "dir",
      nextLang === "ar" ? "rtl" : "ltr"
    );
  }, [lang]);

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  async function handleLogout() {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (!mounted || userLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-primary)",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "3px solid var(--accent)",
              borderTopColor: "transparent",
              margin: "0 auto 14px",
              animation: "warsha-spin 1s linear infinite",
            }}
          />

          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 13,
              margin: 0,
            }}
          >
            Loading...
          </p>
        </div>

        <style>{`
          @keyframes warsha-spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const tr = S[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const isShop =
    user?.profile?.role === "shop_owner";

  const memberDate = user?.profile?.created_at
    ? new Date(
        user.profile.created_at
      ).toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-GB",
        {
          year: "numeric",
          month: "long",
        }
      )
    : "—";

  const initials = user?.profile?.full_name
    ? user.profile.full_name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "W";

  /*
   * ---------------------------------------------------------
   * NOT LOGGED IN
   * ---------------------------------------------------------
   */

  if (!user) {
    return (
      <div
        dir={dir}
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          color: "var(--text-primary)",
        }}
      >
        <Navbar
          lang={lang}
          theme={theme}
          onToggleLang={toggleLang}
          onToggleTheme={toggleTheme}
        />

        <main
          style={{
            minHeight: "calc(100vh - var(--nav-h))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              textAlign: "center",
              padding: 36,
              borderRadius: "var(--radius-xl)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto 18px",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--accent-muted)",
                border: "1px solid var(--accent-border)",
                color: "var(--accent)",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              W
            </div>

            <h1
              style={{
                margin: "0 0 8px",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {tr.notLoggedIn}
            </h1>

            <p
              style={{
                margin: "0 0 24px",
                color: "var(--text-tertiary)",
                fontSize: 13,
              }}
            >
              {lang === "ar"
                ? "سجّل دخولك للوصول إلى حسابك"
                : "Sign in to access your account"}
            </p>

            <Link
              href="/auth/login"
              className="warsha-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 42,
                padding: "0 22px",
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "inherit",
                borderRadius: "var(--radius-md)",
              }}
            >
              {tr.goLogin}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * DASHBOARD
   * ---------------------------------------------------------
   */

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* ---------------------------------------------------
          NAVBAR
      --------------------------------------------------- */}

      <Navbar
        lang={lang}
        theme={theme}
        onToggleLang={toggleLang}
        onToggleTheme={toggleTheme}
      />

      {/* ---------------------------------------------------
          MAIN
      --------------------------------------------------- */}

      <main
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "36px 20px 60px",
        }}
      >
        {/* -------------------------------------------------
            PAGE HEADER
        ------------------------------------------------- */}

        <div
          style={{
            marginBottom: 22,
          }}
        >
          <p
            style={{
              margin: "0 0 5px",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {lang === "ar" ? "حسابك" : "YOUR ACCOUNT"}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(24px, 4vw, 32px)",
              lineHeight: 1.15,
              fontWeight: 850,
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
            }}
          >
            {lang === "ar"
              ? "لوحة التحكم"
              : "Dashboard"}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 13,
              lineHeight: 1.7,
              color: "var(--text-tertiary)",
            }}
          >
            {lang === "ar"
              ? "إدارة حسابك والوصول السريع للخدمات"
              : "Manage your account and quickly access your services"}
          </p>
        </div>

        {/* -------------------------------------------------
            HERO PROFILE CARD
        ------------------------------------------------- */}

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "var(--radius-xl)",
            background:
              "linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)",
            border: "1px solid var(--accent-border)",
            padding: "28px",
            marginBottom: 18,
            boxShadow: "var(--shadow-accent)",
          }}
        >
          {/* subtle background pattern */}

          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.06,
              pointerEvents: "none",
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              direction: dir,
            }}
          >
            {/* PROFILE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.14)",
                  border: "1px solid rgba(255,255,255,.28)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 21,
                  fontWeight: 850,
                }}
              >
                {initials}
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <p
                  style={{
                    margin: "0 0 3px",
                    color: "rgba(255,255,255,.72)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {tr.welcome}
                </p>

                <h2
                  style={{
                    margin: "0 0 7px",
                    color: "#fff",
                    fontSize: 21,
                    fontWeight: 850,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 380,
                  }}
                >
                  {user.profile?.full_name ??
                    user.email}
                </h2>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,.13)",
                    border:
                      "1px solid rgba(255,255,255,.2)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 650,
                  }}
                >
                  <span>
                    {isShop ? "🔧" : "🚗"}
                  </span>

                  {isShop
                    ? tr.shopRole
                    : tr.carRole}
                </span>
              </div>
            </div>

            {/* STATS */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "4px 0",
              }}
            >
              {[
                ["37", tr.statShops],
                ["12", tr.statCats],
                ["4", tr.statArea],
              ].map(([value, label]) => (
                <div
                  key={label}
                  style={{
                    textAlign: "center",
                    minWidth: 58,
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 850,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color: "rgba(255,255,255,.68)",
                      fontSize: 10,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------
            QUICK ACTIONS + ACCOUNT INFO
        ------------------------------------------------- */}

        <div
          className="dashboard-two-column"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* QUICK ACTIONS */}

          <section
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--text-tertiary)",
                  fontSize: 11,
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                {tr.quickActions}
              </p>

              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--accent-border)",
                  color: "var(--accent)",
                  fontSize: 14,
                }}
              >
                ↗
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                {
                  href: "/workshops",
                  icon: "⌕",
                  label: tr.browse,
                },
                {
                  href: "/map",
                  icon: "⌖",
                  label: tr.map,
                },
                {
                  href: "/services",
                  icon: "⚙",
                  label: tr.services,
                },
                {
                  href: "/list-shop",
                  icon: "＋",
                  label: tr.listShop,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="dashboard-action"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    minHeight: 44,
                    padding: "0 13px",
                    borderRadius:
                      "var(--radius-md)",
                    background:
                      "var(--bg-secondary)",
                    border:
                      "1px solid var(--border)",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 650,
                    transition:
                      "all .16s ease",
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      background:
                        "var(--accent-muted)",
                      color: "var(--accent)",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  <span
                    style={{
                      marginInlineStart: "auto",
                      color: "var(--text-tertiary)",
                      fontSize: 15,
                    }}
                  >
                    {dir === "rtl"
                      ? "‹"
                      : "›"}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ACCOUNT INFO */}

          <section
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "var(--text-tertiary)",
                  fontSize: 11,
                  fontWeight: 750,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                {tr.accountInfo}
              </p>

              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--bg-secondary)",
                  border:
                    "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                }}
              >
                •••
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {[
                {
                  label: tr.emailLbl,
                  value: user.email,
                  icon: "✉",
                },
                {
                  label: tr.roleLbl,
                  value: isShop
                    ? tr.shopRole
                    : tr.carRole,
                  icon: isShop ? "🔧" : "🚗",
                },
                {
                  label: tr.since,
                  value: memberDate,
                  icon: "◷",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    minHeight: 44,
                    padding: "0 12px",
                    borderRadius:
                      "var(--radius-md)",
                    background:
                      "var(--bg-secondary)",
                    border:
                      "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background:
                          "var(--bg-card)",
                        color:
                          "var(--text-secondary)",
                        fontSize: 13,
                      }}
                    >
                      {row.icon}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        color:
                          "var(--text-tertiary)",
                      }}
                    >
                      {row.label}
                    </span>
                  </div>

                  <span
                    style={{
                      maxWidth: "55%",
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 11,
                      fontWeight: 650,
                      color:
                        "var(--text-secondary)",
                      direction:
                        row.label ===
                        tr.emailLbl
                          ? "ltr"
                          : "inherit",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* -------------------------------------------------
            COMING SOON
        ------------------------------------------------- */}

        <div
          className="dashboard-two-column"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* MESSAGING */}

          <section
            style={{
              background: "var(--bg-card)",
              border:
                "1px solid var(--border)",
              borderRadius:
                "var(--radius-lg)",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                margin: "0 auto 14px",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "var(--accent-muted)",
                border:
                  "1px solid var(--accent-border)",
                color: "var(--accent)",
                fontSize: 21,
              }}
            >
              ◌
            </div>

            <p
              style={{
                margin: "0 0 7px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 750,
              }}
            >
              {tr.chatSoon}
            </p>

            <p
              style={{
                margin: 0,
                color: "var(--text-tertiary)",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {tr.chatSoonBody}
            </p>

            <span
              style={{
                display: "inline-flex",
                marginTop: 15,
                padding: "4px 11px",
                borderRadius: 999,
                background:
                  "var(--accent-muted)",
                border:
                  "1px solid var(--accent-border)",
                color: "var(--accent)",
                fontSize: 10,
                fontWeight: 750,
              }}
            >
              {tr.comingSoon}
            </span>
          </section>

          {/* REVIEWS */}

          <section
            style={{
              background: "var(--bg-card)",
              border:
                "1px solid var(--border)",
              borderRadius:
                "var(--radius-lg)",
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                margin: "0 auto 14px",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "var(--accent-muted)",
                border:
                  "1px solid var(--accent-border)",
                color: "var(--accent)",
                fontSize: 21,
              }}
            >
              ★
            </div>

            <p
              style={{
                margin: "0 0 7px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 750,
              }}
            >
              {tr.reviewsSoon}
            </p>

            <p
              style={{
                margin: 0,
                color: "var(--text-tertiary)",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {tr.reviewsSoonBody}
            </p>

            <span
              style={{
                display: "inline-flex",
                marginTop: 15,
                padding: "4px 11px",
                borderRadius: 999,
                background:
                  "var(--accent-muted)",
                border:
                  "1px solid var(--accent-border)",
                color: "var(--accent)",
                fontSize: 10,
                fontWeight: 750,
              }}
            >
              {tr.comingSoon}
            </span>
          </section>
        </div>

        {/* -------------------------------------------------
            LOGOUT
        ------------------------------------------------- */}

        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 18px",
            borderRadius:
              "var(--radius-lg)",
            background:
              "var(--bg-secondary)",
            border:
              "1px solid var(--border)",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 3px",
                color: "var(--text-primary)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {lang === "ar"
                ? "تسجيل الخروج"
                : "Sign out"}
            </p>

            <p
              style={{
                margin: 0,
                color: "var(--text-tertiary)",
                fontSize: 11,
              }}
            >
              {lang === "ar"
                ? "يمكنك تسجيل الدخول مرة أخرى في أي وقت."
                : "You can sign back in at any time."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            style={{
              minHeight: 38,
              padding: "0 16px",
              borderRadius:
                "var(--radius-md)",
              background: "transparent",
              border:
                "1px solid var(--border)",
              color:
                "var(--text-secondary)",
              cursor: logoutLoading
                ? "wait"
                : "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 650,
              opacity: logoutLoading
                ? 0.6
                : 1,
              transition: "all .15s ease",
            }}
            onMouseEnter={(e) => {
              if (logoutLoading) return;

              const el =
                e.currentTarget;

              el.style.borderColor =
                "var(--accent-border)";
              el.style.color =
                "var(--accent)";
              el.style.background =
                "var(--accent-muted)";
            }}
            onMouseLeave={(e) => {
              const el =
                e.currentTarget;

              el.style.borderColor =
                "var(--border)";
              el.style.color =
                "var(--text-secondary)";
              el.style.background =
                "transparent";
            }}
          >
            {logoutLoading
              ? tr.loggingOut
              : tr.logout}
          </button>
        </section>
      </main>

      {/* ---------------------------------------------------
          RESPONSIVE
      --------------------------------------------------- */}

      <style>{`
        .dashboard-action:hover {
          background: var(--accent-muted) !important;
          border-color: var(--accent-border) !important;
          color: var(--accent) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 760px) {
          .dashboard-two-column {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          main {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          section {
            border-radius: var(--radius-lg);
          }
        }

        @media (max-width: 480px) {
          .dashboard-two-column {
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}