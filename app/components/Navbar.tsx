"use client";

import Link from "next/link";

type Lang = "ar" | "en";
type Theme = "dark" | "light";

type NavbarProps = {
  lang: Lang;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
};

export default function Navbar({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
}: NavbarProps) {
  const isArabic = lang === "ar";

  const nav = {
    home: isArabic ? "الرئيسية" : "Home",
    workshops: isArabic ? "الورش" : "Workshops",
    map: isArabic ? "الخريطة" : "Map",
    diagnose: isArabic ? "تشخيص" : "Diagnose",
    about: isArabic ? "عن ورشة" : "About",
    signIn: isArabic ? "تسجيل الدخول" : "Sign in",
    listShop: isArabic ? "سجّل ورشتك" : "List your shop",
    language: isArabic ? "English" : "عربي",
  };

  return (
    <header className="warsha-nav" dir={isArabic ? "rtl" : "ltr"}>
      {/* ─────────────────────────────────────────────────────────────
          LOGO
      ───────────────────────────────────────────────────────────── */}

      <Link href="/" className="warsha-nav-logo">
        <div
          className="warsha-nav-logo-icon"
          aria-label="Warsha"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M8.5 8.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M13.5 13.5L15.5 15.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M15.5 8.5L13.5 10.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M10.5 13.5L8.5 15.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <circle
              cx="12"
              cy="12"
              r="2.2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
            }}
          >
            Warsha
            <span style={{ color: "var(--accent)" }}>.eg</span>
          </span>

          <span
            style={{
              marginTop: 3,
              fontSize: 8,
              fontWeight: 700,
              letterSpacing: "0.10em",
              color: "var(--text-tertiary)",
            }}
          >
            WORKSHOP DIRECTORY
          </span>
        </div>
      </Link>

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP NAVIGATION
      ───────────────────────────────────────────────────────────── */}

      <nav
        className="warsha-desktop-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="warsha-nav-link"
        >
          {nav.home}
        </Link>

        <Link
          href="/workshops"
          className="warsha-nav-link"
        >
          {nav.workshops}
        </Link>

        <Link
          href="/map"
          className="warsha-nav-link"
        >
          {nav.map}
        </Link>

        <Link
          href="/diagnose"
          className="warsha-nav-link"
        >
          {nav.diagnose}
        </Link>

        <Link
          href="/about"
          className="warsha-nav-link"
        >
          {nav.about}
        </Link>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE
      ───────────────────────────────────────────────────────────── */}

      <div
        className="warsha-nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Language */}

        <button
          type="button"
          onClick={onToggleLang}
          className="warsha-nav-control"
          aria-label="Change language"
        >
          {nav.language}
        </button>

        {/* Theme */}

        <button
          type="button"
          onClick={onToggleTheme}
          className="warsha-nav-theme"
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.42 1.42" />
              <path d="m17.65 17.65 1.42 1.42" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.35 17.65-1.42 1.42" />
              <path d="m19.07 4.93-1.42 1.42" />
            </svg>
          ) : (
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" />
            </svg>
          )}
        </button>

        {/* Sign in */}

        <Link
          href="/login"
          className="warsha-nav-signin"
        >
          {nav.signIn}
        </Link>

        {/* List your shop */}

        <Link
          href="/list-shop"
          className="warsha-nav-list-shop"
        >
          {nav.listShop}
        </Link>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE
      ───────────────────────────────────────────────────────────── */}

      <div className="warsha-mobile-nav">
        <button
          type="button"
          onClick={onToggleLang}
          className="warsha-nav-control"
          aria-label="Change language"
        >
          {nav.language}
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="warsha-nav-theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>

      <style jsx>{`
        .warsha-nav-link {
          position: relative;

          padding: 8px 12px;

          color: var(--text-secondary);

          text-decoration: none;

          font-size: 13px;
          font-weight: 500;

          border-radius: var(--radius-sm);

          transition:
            color var(--t-base),
            background var(--t-base);
        }

        .warsha-nav-link:hover {
          color: var(--text-primary);
          background: var(--accent-muted);
        }

        .warsha-nav-control {
          height: 36px;

          padding: 0 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: transparent;

          color: var(--text-secondary);

          border: 1px solid var(--border);

          border-radius: var(--radius-md);

          cursor: pointer;

          font-family: inherit;
          font-size: 12px;
          font-weight: 600;

          transition:
            color var(--t-base),
            background var(--t-base),
            border-color var(--t-base);
        }

        .warsha-nav-control:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
          border-color: var(--border-strong);
        }

        .warsha-nav-theme {
          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--bg-secondary);

          color: var(--accent);

          border: 1px solid var(--border);

          border-radius: var(--radius-md);

          cursor: pointer;

          font-family: inherit;
          font-size: 16px;

          transition:
            color var(--t-base),
            background var(--t-base),
            border-color var(--t-base),
            transform var(--t-fast);
        }

        .warsha-nav-theme:hover {
          background: var(--accent-muted);
          border-color: var(--accent-border);
          transform: scale(1.04);
        }

        .warsha-nav-signin {
          height: 36px;

          display: flex;
          align-items: center;

          padding: 0 14px;

          color: var(--text-secondary);

          border: 1px solid var(--border);

          border-radius: var(--radius-md);

          text-decoration: none;

          font-size: 12px;
          font-weight: 600;

          transition:
            color var(--t-base),
            background var(--t-base),
            border-color var(--t-base);
        }

        .warsha-nav-signin:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
          border-color: var(--border-strong);
        }

        .warsha-nav-list-shop {
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 16px;

          background: var(--accent);

          color: var(--text-primary);

          border: 1px solid var(--accent-border);

          border-radius: var(--radius-md);

          text-decoration: none;

          font-size: 12px;
          font-weight: 800;

          box-shadow: 0 4px 16px var(--accent-muted);

          transition:
            background var(--t-base),
            color var(--t-base),
            transform var(--t-fast),
            box-shadow var(--t-base);
        }

        .warsha-nav-list-shop:hover {
          background: var(--accent-hover);
          color: var(--text-inverse);

          transform: translateY(-1px);

          box-shadow: var(--shadow-accent);
        }

        @media (max-width: 768px) {
          .warsha-nav-actions {
            display: none !important;
          }

          .warsha-nav-logo span:last-child {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .warsha-nav {
            padding: 0 12px;
          }

          .warsha-nav-logo {
            gap: 7px;
          }

          .warsha-nav-logo-icon {
            width: 30px !important;
            height: 30px !important;
          }
        }
      `}</style>
    </header>
  );
}