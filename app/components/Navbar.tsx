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

// Logo: real PNG in a circle — like Careem/Talabat
export function WarshaLogo({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid rgba(232,115,10,0.5)",
      flexShrink: 0,
      background: "#2b2b28",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <img
        src="/Warsha_Logo.png"
        alt="Warsha"
        width={size}
        height={size}
        style={{ objectFit: "cover", display: "block" }}
      />
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
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  async function handleLogout() {
    setLoggingOut(true);
    setDropdownOpen(false);
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

  const initials = user?.profile?.full_name
    ? user.profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";
  const firstName = user?.profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";
  const isAdminUser = user?.email === ADMIN_EMAIL;
  const border = `1px solid ${isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 60,
      background: isDark ? "rgba(10,10,9,0.96)" : "rgba(255,255,255,0.96)",
      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)"}`,
      backdropFilter: "blur(24px) saturate(200%)",
      boxShadow: isDark ? "0 1px 24px rgba(0,0,0,.5)" : "0 1px 12px rgba(0,0,0,.07)",
      direction: dir,
    }}>

      {/* LOGO */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
        <WarshaLogo size={36} />
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>
            <span style={{ color: isDark ? "#fff" : "#1a1a18" }}>{safeLang === "ar" ? "وَرشة" : "Warsha"}</span>
            <span style={{ color: "#E8730A" }}>.eg</span>
          </div>
          <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.4)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {safeLang === "ar" ? "دليل الورش" : "Workshop Directory"}
          </div>
        </div>
      </Link>

      {/* CENTER NAV */}
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              padding: "6px 12px", borderRadius: 8,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? "#E8730A" : (isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)"),
              textDecoration: "none", transition: "all .15s",
              background: isActive ? "rgba(232,115,10,.08)" : "transparent",
            }}
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "#fff" : "#1a1a18"; } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)"; } }}
            >{item.label}</Link>
          );
        })}
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={onToggleLang} style={{ height: 34, padding: "0 12px", borderRadius: 8, background: "transparent", border, cursor: "pointer", fontSize: 12, fontWeight: 600, color: isDark ? "rgba(255,255,255,.6)" : "rgba(0,0,0,.55)", fontFamily: "inherit" }}>
          {safeLang === "ar" ? "EN" : "عربي"}
        </button>
        <button onClick={onToggleTheme} style={{ width: 34, height: 34, borderRadius: 8, background: "transparent", border, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
          {isDark ? "☀️" : "🌙"}
        </button>

        {userLoading ? (
          <div style={{ width: 72, height: 34, borderRadius: 8, background: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)" }} />
        ) : user ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button onClick={() => setDropdownOpen(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 8, height: 34, padding: "0 10px", borderRadius: 8,
              background: dropdownOpen ? "rgba(232,115,10,.1)" : (isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.04)"),
              border: dropdownOpen ? "1px solid rgba(232,115,10,.35)" : border,
              cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
            }}>
              {user.profile?.avatar_url ? (
                <img src={user.profile.avatar_url} alt="" width={22} height={22} style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{initials}</div>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#fff" : "#1a1a18", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</span>
              <span style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)", display: "block", transition: "transform .2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)",
                [dir === "rtl" ? "left" : "right"]: 0,
                minWidth: 210,
                background: isDark ? "rgba(16,16,14,.98)" : "rgba(255,255,255,.99)",
                border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"}`,
                borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.2)",
                overflow: "hidden", zIndex: 200, backdropFilter: "blur(20px)",
              }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)"}` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#fff" : "#1a1a18", margin: "0 0 3px" }}>{user.profile?.full_name ?? user.email}</p>
                  <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.4)", margin: 0 }}>
                    {user.profile?.role === "shop_owner" ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner") : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}
                  </p>
                </div>
                {[
                  { href: "/dashboard", icon: "👤", label: safeLang === "ar" ? "حسابي" : "My account" },
                  { href: "/chat",      icon: "💬", label: safeLang === "ar" ? "رسائلي" : "My messages" },
                  { href: "/workshops", icon: "🔍", label: safeLang === "ar" ? "تصفح الورش" : "Browse workshops" },
                  { href: "/diagnose",  icon: "🔧", label: safeLang === "ar" ? "تشخيص مشكلة" : "Diagnose problem" },
                  { href: "/list-shop", icon: "🏪", label: safeLang === "ar" ? "سجّل ورشتك" : "List your shop" },
                  ...(isAdminUser ? [{ href: "/admin", icon: "⚙️", label: "Admin panel" }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", textDecoration: "none", fontSize: 13, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"}`, transition: "all .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,115,10,.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)"; }}
                  >
                    <span style={{ fontSize: 15 }}>{item.icon}</span> {item.label}
                  </Link>
                ))}
                <button onClick={handleLogout} disabled={loggingOut}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#EF4444", textAlign: dir === "rtl" ? "right" : "left" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,.07)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                  <span style={{ fontSize: 15 }}>🚪</span>
                  {loggingOut ? (safeLang === "ar" ? "جاري الخروج..." : "Signing out...") : (safeLang === "ar" ? "تسجيل الخروج" : "Sign out")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login" style={{ height: 34, padding: "0 14px", borderRadius: 8, background: "transparent", border, fontSize: 13, fontWeight: 600, color: isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)", textDecoration: "none", display: "flex", alignItems: "center" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E8730A"; (e.currentTarget as HTMLAnchorElement).style.color = "#E8730A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isDark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"; (e.currentTarget as HTMLAnchorElement).style.color = isDark ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.65)"; }}
          >
            {safeLang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
        )}

        <Link href="/list-shop" style={{ height: 34, padding: "0 16px", borderRadius: 8, background: "#E8730A", color: "#fff", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 10px rgba(232,115,10,.35)", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "#C85E00"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "#E8730A"}
        >{tr.navRegisterCta}</Link>
      </div>
    </nav>
  );
}
