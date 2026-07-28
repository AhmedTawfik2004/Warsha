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
      overflow: "hidden", border: "2px solid rgba(232,115,10,0.4)",
      flexShrink: 0, background: "#2b2b28",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img src="/Warsha_Logo.png" alt="Warsha" width={size} height={size} style={{ objectFit: "cover", display: "block" }} />
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

  const bg = isDark ? "rgba(10,10,9,0.97)" : "rgba(255,255,255,0.97)";
  const textPrimary = isDark ? "#ffffff" : "#111110";
  const textSecondary = isDark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.5)";
  const borderColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const cardBg = isDark ? "#1a1a18" : "#ffffff";

  useEffect(() => {
    getCurrentUser()
      .then(u => { setUser(u); setUserLoading(false); })
      .catch(() => { setUser(null); setUserLoading(false); });
  }, [pathname]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
    { label: safeLang === "ar" ? "الرئيسية" : "Home",     href: "/" },
    { label: tr.navShops,                                   href: "/workshops" },
    { label: tr.navMap,                                     href: "/map" },
    { label: safeLang === "ar" ? "تشخيص" : "Diagnose",    href: "/diagnose" },
    { label: tr.navAbout,                                   href: "/about" },
  ] as const;

  const initials = user?.profile?.full_name
    ? user.profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";
  const firstName = user?.profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const isAdminUser = user?.email === ADMIN_EMAIL;

  const dropdownItems = [
    { href: "/dashboard", icon: "👤", label: safeLang === "ar" ? "حسابي" : "My account" },
    { href: "/chat",      icon: "💬", label: safeLang === "ar" ? "رسائلي" : "My messages" },
    { href: "/workshops", icon: "🔍", label: safeLang === "ar" ? "تصفح الورش" : "Browse workshops" },
    { href: "/diagnose",  icon: "🔧", label: safeLang === "ar" ? "تشخيص مشكلة" : "Diagnose problem" },
    { href: "/list-shop", icon: "🏪", label: safeLang === "ar" ? "سجّل ورشتك" : "List your shop" },
    ...(isAdminUser ? [{ href: "/admin", icon: "⚙️", label: "Admin panel" }] : []),
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 60,
        background: bg,
        borderBottom: `1px solid ${borderColor}`,
        backdropFilter: "blur(20px) saturate(180%)",
        boxShadow: isDark ? "0 1px 20px rgba(0,0,0,.4)" : "0 1px 12px rgba(0,0,0,.06)",
        direction: dir,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* LOGO */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <WarshaLogo size={34} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em" }}>
              <span style={{ color: textPrimary }}>{safeLang === "ar" ? "وَرشة" : "Warsha"}</span>
              <span style={{ color: "#E8730A" }}>.eg</span>
            </div>
            <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.35)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {safeLang === "ar" ? "دليل الورش" : "Workshop Directory"}
            </div>
          </div>
        </Link>

        {/* CENTER NAV — desktop only */}
        <div className="warsha-desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                padding: "6px 12px", borderRadius: 8,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#E8730A" : textSecondary,
                textDecoration: "none", transition: "all .15s",
                background: isActive ? "rgba(232,115,10,.08)" : "transparent",
              }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = textPrimary; (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; } }}
              >{item.label}</Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Lang + Theme — desktop only */}
          <button onClick={onToggleLang} className="warsha-desktop-nav" style={{ height: 32, padding: "0 10px", borderRadius: 8, background: "transparent", border: `1px solid ${borderColor}`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: textSecondary, fontFamily: "inherit" }}>
            {safeLang === "ar" ? "EN" : "عربي"}
          </button>
          <button onClick={onToggleTheme} className="warsha-desktop-nav" style={{ width: 32, height: 32, borderRadius: 8, background: "transparent", border: `1px solid ${borderColor}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* User — desktop only */}
          {!userLoading && (
            <div ref={dropdownRef} className="warsha-desktop-nav" style={{ position: "relative" }}>
              {user ? (
                <>
                  <button onClick={() => setDropdownOpen(o => !o)} style={{
                    display: "flex", alignItems: "center", gap: 7, height: 32, padding: "0 10px", borderRadius: 8,
                    background: dropdownOpen ? "rgba(232,115,10,.1)" : (isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)"),
                    border: dropdownOpen ? "1px solid rgba(232,115,10,.3)" : `1px solid ${borderColor}`,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {user.profile?.avatar_url ? (
                      <img src={user.profile.avatar_url} alt="" width={20} height={20} style={{ borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800 }}>{initials}</div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: textPrimary, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</span>
                    <span style={{ fontSize: 9, color: textSecondary, transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform .2s", display: "block" }}>▾</span>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)",
                      [dir === "rtl" ? "left" : "right"]: 0,
                      minWidth: 210, background: cardBg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,.18)",
                      overflow: "hidden", zIndex: 200,
                    }}>
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${borderColor}` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: textPrimary, margin: "0 0 2px" }}>{user.profile?.full_name ?? user.email}</p>
                        <p style={{ fontSize: 11, color: textSecondary, margin: 0 }}>
                          {user.profile?.role === "shop_owner" ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner") : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}
                        </p>
                      </div>
                      {dropdownItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textDecoration: "none", fontSize: 13, color: textSecondary, borderBottom: `1px solid ${borderColor}`, transition: "all .12s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,115,10,.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; }}
                        >
                          <span style={{ fontSize: 15 }}>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      <button onClick={handleLogout} disabled={loggingOut}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#EF4444", textAlign: dir === "rtl" ? "right" : "left" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,.07)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                      >
                        <span>🚪</span>
                        {loggingOut ? (safeLang === "ar" ? "جاري الخروج..." : "Signing out...") : (safeLang === "ar" ? "تسجيل الخروج" : "Sign out")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth/login" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "transparent", border: `1px solid ${borderColor}`, fontSize: 13, fontWeight: 600, color: textSecondary, textDecoration: "none", display: "flex", alignItems: "center" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = borderColor; (e.currentTarget as HTMLAnchorElement).style.color = textSecondary; }}
                >
                  {safeLang === "ar" ? "دخول" : "Sign in"}
                </Link>
              )}
            </div>
          )}

          {/* List shop CTA — desktop only */}
          <Link href="/list-shop" className="warsha-desktop-nav" style={{ height: 32, padding: "0 14px", borderRadius: 8, background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 10px rgba(232,115,10,.3)", flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
          >{tr.navRegisterCta}</Link>

          {/* Hamburger — mobile only */}
          <button onClick={() => setMobileMenuOpen(o => !o)} className="warsha-mobile-nav"
            style={{ display: "none", width: 36, height: 36, borderRadius: 8, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)", border: `1px solid ${borderColor}`, cursor: "pointer", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 5, padding: 0 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: "block", width: 16, height: 2, background: textPrimary, borderRadius: 2, transition: "all .2s",
                transform: mobileMenuOpen && i === 0 ? "translateY(7px) rotate(45deg)" : mobileMenuOpen && i === 2 ? "translateY(-7px) rotate(-45deg)" : "none",
                opacity: mobileMenuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: bg, overflowY: "auto", direction: dir,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${borderColor}` }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>{user.profile?.full_name ?? user.email}</div>
                  <div style={{ fontSize: 12, color: textSecondary }}>{user.profile?.role === "shop_owner" ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner") : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}</div>
                </div>
              </div>
            )}
            {navItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", fontSize: 16, fontWeight: pathname === item.href ? 700 : 400, color: pathname === item.href ? "#E8730A" : textPrimary, textDecoration: "none", borderBottom: `1px solid ${borderColor}` }}>
                {item.label}
                <span style={{ color: textTertiary, fontSize: 14 }}>{dir === "rtl" ? "←" : "→"}</span>
              </Link>
            ))}
          </div>

          <div style={{ padding: "16px 20px" }}>
            <Link href="/list-shop" onClick={() => setMobileMenuOpen(false)} style={{ display: "block", padding: "14px 0", textAlign: "center", background: "#E8730A", color: "#fff", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: 12 }}>
              {tr.navRegisterCta}
            </Link>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { onToggleLang(); }} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", fontSize: 14, fontWeight: 600, color: textSecondary, cursor: "pointer", fontFamily: "inherit" }}>
                {safeLang === "ar" ? "English" : "عربي"}
              </button>
              <button onClick={onToggleTheme} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: `1px solid ${borderColor}`, background: "transparent", fontSize: 14, cursor: "pointer", fontFamily: "inherit", color: textSecondary }}>
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>

            {user ? (
              <button onClick={handleLogout} style={{ width: "100%", marginTop: 12, padding: "13px 0", borderRadius: 10, border: "1px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.06)", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {safeLang === "ar" ? "تسجيل الخروج" : "Sign out"}
              </button>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} style={{ display: "block", marginTop: 12, padding: "13px 0", borderRadius: 10, border: `1px solid ${borderColor}`, textAlign: "center", fontSize: 14, fontWeight: 600, color: textPrimary, textDecoration: "none" }}>
                {safeLang === "ar" ? "تسجيل الدخول" : "Sign in"}
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .warsha-desktop-nav { display: none !important; }
          .warsha-mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .warsha-mobile-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}