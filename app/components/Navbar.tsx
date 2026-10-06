"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { Lang } from "../lib/translations";
import { t } from "../lib/translations";
import { getCurrentUser, signOut } from "../lib/supabase";

const ADMIN_EMAIL = "tkelite2004@gmail.com";

interface NavbarProps {
  lang: Lang;
  theme: "dark" | "light";
  onToggleLang: () => void;
  onToggleTheme: () => void;
}

export function WarshaLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", border: "2px solid rgba(33,78,79,0.4)",
      flexShrink: 0, background: "#1C2B2C",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img src="/Warsha_Logo.png" alt="Warsha" width={size} height={size}
        style={{ objectFit: "cover", display: "block" }} />
    </div>
  );
}

export default function Navbar({ lang, theme, onToggleLang, onToggleTheme }: NavbarProps) {
  const safeLang: Lang = lang === "en" ? "en" : "ar";
  const tr = t[safeLang];
  const pathname = usePathname();
  const router = useRouter();
  const dir = safeLang === "ar" ? "rtl" : "ltr";
  const isDark = theme === "dark";

  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const navBg      = isDark ? "rgba(15,20,20,0.97)"    : "rgba(250,247,242,0.97)";
  const accent      = isDark ? "#4A9FA5"                : "#214E4F";
  const textPrimary = isDark ? "#EAECE9"                : "#231F1A";
  const textSec     = isDark ? "#6E7F77"                : "#5C5650";
  const textTert    = isDark ? "rgba(110,127,119,.5)"   : "rgba(35,31,26,.35)";
  const border      = isDark ? "rgba(110,127,119,.2)"   : "rgba(35,31,26,.10)";
  const cardBg      = isDark ? "#1C2B2C"                : "#FFFFFF";
  const mobileBg    = isDark ? "rgba(15,20,20,.97)"     : "rgba(250,247,242,.97)";
  const bottomNavBg = isDark ? "rgba(15,20,20,.97)"     : "rgba(250,247,242,.97)";

  useEffect(() => {
    getCurrentUser()
      .then(u => { setUser(u); setUserLoading(false); })
      .catch(() => { setUser(null); setUserLoading(false); });
  }, [pathname]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    setUser(null);
    setLoggingOut(false);
    router.push("/");
    router.refresh();
  }

  const navItems = [
    { label: safeLang === "ar" ? "الرئيسية" : "Home",   href: "/" },
    { label: tr.navShops,                                 href: "/workshops" },
    { label: tr.navMap,                                   href: "/map" },
    { label: safeLang === "ar" ? "تشخيص" : "Diagnose",  href: "/diagnose" },
    { label: tr.navAbout,                                 href: "/about" },
  ] as const;

  const bottomNavItems = [
    { label: safeLang === "ar" ? "الرئيسية" : "Home",    href: "/",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: safeLang === "ar" ? "الورش" : "Workshops",  href: "/workshops",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
    { label: safeLang === "ar" ? "الخريطة" : "Map",      href: "/map",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
    { label: safeLang === "ar" ? "تشخيص" : "Diagnose",   href: "/diagnose",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: safeLang === "ar" ? "حسابي" : "Account",    href: "/dashboard",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  const initials = user?.profile?.full_name
    ? user.profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";
  const firstName = user?.profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const isAdminUser = user?.email === ADMIN_EMAIL;

  const dropdownItems = [
    { href: "/dashboard", label: safeLang === "ar" ? "حسابي" : "My account" },
    { href: "/chat",      label: safeLang === "ar" ? "رسائلي" : "My messages" },
    { href: "/workshops", label: safeLang === "ar" ? "تصفح الورش" : "Browse workshops" },
    { href: "/diagnose",  label: safeLang === "ar" ? "تشخيص مشكلة" : "Diagnose problem" },
    { href: "/list-shop", label: safeLang === "ar" ? "سجّل ورشتك" : "List your shop" },
    ...(isAdminUser ? [{ href: "/admin", label: "Admin panel" }] : []),
  ];

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 60,
        background: navBg,
        borderBottom: `1px solid ${border}`,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: isDark ? "0 1px 20px rgba(0,0,0,.4)" : "0 1px 12px rgba(35,31,26,.08)",
        direction: dir,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <WarshaLogo size={34} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>
              <span style={{ color: textPrimary }}>{safeLang === "ar" ? "وَرشة" : "Warsha"}</span>
              <span style={{ color: accent }}>.eg</span>
            </div>
            <div style={{ fontSize: 9, color: textTert, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {safeLang === "ar" ? "دليل الورش" : "Workshop Directory"}
            </div>
          </div>
        </Link>

        {/* Desktop center nav */}
        <div className="warsha-desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? accent : textSec,
                textDecoration: "none", transition: "all .15s",
                background: isActive ? `${accent}14` : "transparent",
              }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = textPrimary; (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(35,31,26,.04)"; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = textSec; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; } }}
              >{item.label}</Link>
            );
          })}
        </div>

        {/* Desktop right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={onToggleLang} className="warsha-desktop-nav" style={{ height: 32, padding: "0 10px", borderRadius: 8, background: "transparent", border: `1px solid ${border}`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: textSec, fontFamily: "inherit" }}>
            {safeLang === "ar" ? "EN" : "عربي"}
          </button>
          <button onClick={onToggleTheme} className="warsha-desktop-nav" style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: `1px solid ${border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {isDark ? "☀️" : "🌙"}
          </button>

          {!userLoading && (
            <div ref={dropdownRef} className="warsha-desktop-nav" style={{ position: "relative" }}>
              {user ? (
                <>
                  <button onClick={() => setDropdownOpen(o => !o)} style={{
                    display: "flex", alignItems: "center", gap: 7, height: 32, padding: "0 10px", borderRadius: 8,
                    background: dropdownOpen ? `${accent}18` : (isDark ? "rgba(255,255,255,.06)" : "rgba(35,31,26,.04)"),
                    border: dropdownOpen ? `1px solid ${accent}50` : `1px solid ${border}`,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {user.profile?.avatar_url
                      ? <img src={user.profile.avatar_url} alt="" width={20} height={20} style={{ borderRadius: "50%", objectFit: "cover" }} />
                      : <div style={{ width: 20, height: 20, borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800 }}>{initials}</div>
                    }
                    <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</span>
                    <span style={{ fontSize: 9, color: textSec, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform .2s", display: "block" }}>▾</span>
                  </button>
                  {dropdownOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", [dir === "rtl" ? "left" : "right"]: 0, minWidth: 200, background: cardBg, border: `1px solid ${border}`, borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,.18)", overflow: "hidden", zIndex: 200 }}>
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: "0 0 2px" }}>{user.profile?.full_name ?? user.email}</p>
                        <p style={{ fontSize: 11, color: textSec, margin: 0 }}>
                          {user.profile?.role === "shop_owner" ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner") : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}
                        </p>
                      </div>
                      {dropdownItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textDecoration: "none", fontSize: 13, color: textSec, borderBottom: `1px solid ${border}`, transition: "all .12s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${accent}10`; (e.currentTarget as HTMLAnchorElement).style.color = accent; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = textSec; }}
                        >{item.label}</Link>
                      ))}
                      <button onClick={handleLogout} disabled={loggingOut}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#EF4444", textAlign: dir === "rtl" ? "right" : "left" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,.07)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                      >
                        {loggingOut ? (safeLang === "ar" ? "جاري الخروج..." : "Signing out...") : (safeLang === "ar" ? "تسجيل الخروج" : "Sign out")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth/login" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "transparent", border: `1px solid ${border}`, fontSize: 13, fontWeight: 600, color: textSec, textDecoration: "none", display: "flex", alignItems: "center" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accent; (e.currentTarget as HTMLAnchorElement).style.color = accent; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = border; (e.currentTarget as HTMLAnchorElement).style.color = textSec; }}
                >{safeLang === "ar" ? "دخول" : "Sign in"}</Link>
              )}
            </div>
          )}

          <Link href="/list-shop" className="warsha-desktop-nav" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: accent, color: "#fff", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, textDecoration: "none", flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
          >{tr.navRegisterCta}</Link>

          {/* Hamburger — SVG, works on iOS */}
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="warsha-mobile-nav"
            aria-label="Menu"
            style={{
              display: "none",
              width: 40, height: 40, borderRadius: 10,
              background: isDark ? "rgba(110,127,119,.12)" : "rgba(35,31,26,.06)",
              border: `1px solid ${border}`,
              cursor: "pointer",
              alignItems: "center", justifyContent: "center",
              padding: 0, flexShrink: 0,
            }}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect x="0" y="0"  width="18" height="2" rx="1" fill={textPrimary}
                style={{ transformOrigin: "9px 1px", transform: mobileMenuOpen ? "translateY(5px) rotate(45deg)" : "none", transition: "transform .25s" }} />
              <rect x="0" y="6"  width="18" height="2" rx="1" fill={textPrimary}
                style={{ opacity: mobileMenuOpen ? 0 : 1, transition: "opacity .25s" }} />
              <rect x="0" y="12" width="18" height="2" rx="1" fill={textPrimary}
                style={{ transformOrigin: "9px 13px", transform: mobileMenuOpen ? "translateY(-5px) rotate(-45deg)" : "none", transition: "transform .25s" }} />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MOBILE SLIDE MENU ── */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: mobileBg, overflowY: "auto", direction: dir,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          paddingBottom: 80,
        }}>
          <div style={{ padding: "16px 20px" }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0 20px", borderBottom: `1px solid ${border}`, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{user.profile?.full_name ?? user.email}</div>
                  <div style={{ fontSize: 12, color: textSec }}>{user.profile?.role === "shop_owner" ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner") : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}</div>
                </div>
              </div>
            )}
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", fontSize: 16, fontWeight: pathname === item.href ? 700 : 400, color: pathname === item.href ? accent : textPrimary, textDecoration: "none", borderBottom: `1px solid ${border}` }}>
                {item.label}
                <span style={{ color: textTert, fontSize: 14 }}>{dir === "rtl" ? "←" : "→"}</span>
              </Link>
            ))}

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/list-shop" onClick={() => setMobileMenuOpen(false)}
                style={{ display: "block", padding: "14px 0", textAlign: "center", background: accent, color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
                {tr.navRegisterCta}
              </Link>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={onToggleLang} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${border}`, background: "transparent", fontSize: 14, fontWeight: 600, color: textSec, cursor: "pointer", fontFamily: "inherit" }}>
                  {safeLang === "ar" ? "English" : "عربي"}
                </button>
                <button onClick={onToggleTheme} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${border}`, background: "transparent", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: textSec }}>
                  {isDark ? "☀️ Light" : "🌙 Dark"}
                </button>
              </div>
              {user ? (
                <button onClick={handleLogout} style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.06)", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {safeLang === "ar" ? "تسجيل الخروج" : "Sign out"}
                </button>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "block", padding: "13px 0", borderRadius: 10, border: `1px solid ${border}`, textAlign: "center", fontSize: 14, fontWeight: 600, color: textPrimary, textDecoration: "none" }}>
                  {safeLang === "ar" ? "تسجيل الدخول" : "Sign in"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV — appears on every page ── */}
      <div
        className="warsha-mobile-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
          background: bottomNavBg,
          borderTop: `1px solid ${border}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "none",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
        }}
      >
        <div style={{ display: "flex", padding: "6px 0 2px" }}>
          {bottomNavItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  textDecoration: "none", padding: "6px 4px",
                  color: isActive ? accent : textTert,
                  transition: "color .15s",
                }}
              >
                {item.icon}
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: "0.01em" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom nav spacer so content isn't hidden behind it */}
      <div className="warsha-mobile-nav" style={{ display: "none", height: 70 }} />

      <style>{`
        @media (max-width: 768px) {
          .warsha-desktop-nav { display: none !important; }
          .warsha-mobile-nav  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .warsha-mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}