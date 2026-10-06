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

  const labels = {
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
    <>
      <header className="warsha-navbar" dir={isArabic ? "rtl" : "ltr"}>
        {/* LOGO */}
        <Link href="/" className="warsha-brand">
          <div className="warsha-brand-mark">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M9 9l2 2" />
              <path d="M13 13l2 2" />
              <path d="M15 9l-2 2" />
              <path d="M11 13l-2 2" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>

          <div className="warsha-brand-text">
            <div className="warsha-brand-name">
              Warsha<span>.eg</span>
            </div>

            <div className="warsha-brand-subtitle">
              WORKSHOP DIRECTORY
            </div>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="warsha-main-links">
          <Link href="/" className="warsha-main-link">
            {labels.home}
          </Link>

          <Link href="/workshops" className="warsha-main-link">
            {labels.workshops}
          </Link>

          <Link href="/map" className="warsha-main-link">
            {labels.map}
          </Link>

          <Link href="/diagnose" className="warsha-main-link">
            {labels.diagnose}
          </Link>

          <Link href="/about" className="warsha-main-link">
            {labels.about}
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="warsha-nav-actions">
          <button
            type="button"
            onClick={onToggleLang}
            className="warsha-nav-button"
          >
            {labels.language}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="warsha-theme-button"
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
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
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          <Link href="/login" className="warsha-signin">
            {labels.signIn}
          </Link>

          <Link href="/list-shop" className="warsha-list-shop">
            {labels.listShop}
          </Link>
        </div>
      </header>

      <style jsx>{`
        .warsha-navbar {
          position: sticky;
          top: 0;
          z-index: 100;

          width: 100%;
          height: 64px;

          display: flex;
          align-items: center;

          padding: 0 24px;

          background: color-mix(
            in srgb,
            var(--bg) 92%,
            transparent
          );

          border-bottom: 1px solid var(--border);

          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);

          box-sizing: border-box;
        }

        .warsha-brand {
          display: flex;
          align-items: center;
          gap: 10px;

          text-decoration: none;
          flex-shrink: 0;
        }

        .warsha-brand-mark {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          color: var(--text-primary);

          background: var(--accent-muted);

          border: 1px solid var(--accent-border);

          box-shadow: 0 4px 16px var(--accent-muted);

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .warsha-brand:hover .warsha-brand-mark {
          transform: translateY(-1px);
          background: var(--accent-border);
        }

        .warsha-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .warsha-brand-name {
          font-size: 17px;
          font-weight: 850;
          letter-spacing: -0.045em;
          color: var(--text-primary);
        }

        .warsha-brand-name span {
          color: var(--accent);
        }

        .warsha-brand-subtitle {
          margin-top: 4px;

          font-size: 7px;
          font-weight: 700;

          letter-spacing: 0.13em;

          color: var(--text-tertiary);
        }

        .warsha-main-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);

          display: flex;
          align-items: center;
          gap: 3px;

          white-space: nowrap;
        }

        .warsha-main-link {
          position: relative;

          padding: 8px 11px;

          color: var(--text-secondary);

          text-decoration: none;

          font-size: 13px;
          font-weight: 550;

          border-radius: 9px;

          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .warsha-main-link:hover {
          color: var(--text-primary);
          background: var(--accent-muted);
        }

        .warsha-nav-actions {
          margin-inline-start: auto;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .warsha-nav-button,
        .warsha-theme-button {
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: var(--text-secondary);

          background: var(--bg-secondary);

          border: 1px solid var(--border);

          cursor: pointer;

          transition:
            color 0.18s ease,
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;
        }

        .warsha-nav-button {
          padding: 0 11px;
          border-radius: 9px;

          font-family: inherit;
          font-size: 11px;
          font-weight: 650;
        }

        .warsha-theme-button {
          width: 36px;
          border-radius: 9px;
        }

        .warsha-nav-button:hover,
        .warsha-theme-button:hover {
          color: var(--text-primary);
          background: var(--accent-muted);
          border-color: var(--accent-border);
        }

        .warsha-theme-button:hover {
          transform: translateY(-1px);
        }

        .warsha-signin {
          height: 36px;

          display: flex;
          align-items: center;

          padding: 0 12px;

          color: var(--text-secondary);

          border: 1px solid transparent;

          border-radius: 9px;

          text-decoration: none;

          font-size: 12px;
          font-weight: 650;

          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .warsha-signin:hover {
          color: var(--text-primary);
          background: var(--accent-muted);
        }

        .warsha-list-shop {
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 14px;

          color: var(--text-inverse);

          background: var(--accent);

          border: 1px solid var(--accent-border);

          border-radius: 9px;

          text-decoration: none;

          font-size: 12px;
          font-weight: 750;

          box-shadow: 0 4px 16px var(--accent-muted);

          transition:
            background 0.18s ease,
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .warsha-list-shop:hover {
          background: var(--accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-accent);
        }

        @media (max-width: 1050px) {
          .warsha-main-link {
            padding: 8px 7px;
            font-size: 12px;
          }

          .warsha-signin {
            display: none;
          }
        }

        @media (max-width: 800px) {
          .warsha-navbar {
            height: 60px;
            padding: 0 14px;
          }

          .warsha-main-links {
            display: none;
          }

          .warsha-brand-subtitle {
            display: none;
          }

          .warsha-brand-name {
            font-size: 16px;
          }

          .warsha-brand-mark {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 450px) {
          .warsha-nav-button {
            font-size: 10px;
            padding: 0 8px;
          }

          .warsha-list-shop {
            display: none;
          }

          .warsha-nav-actions {
            gap: 5px;
          }
        }
      `}</style>
    </>
  );
}