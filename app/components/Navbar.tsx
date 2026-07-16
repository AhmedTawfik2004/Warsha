"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { Lang } from "../lib/translations";
import { t } from "../lib/translations";
import { getCurrentUser, signOut } from "../lib/supabase";

interface NavbarProps {
  lang: Lang;
  theme: "dark" | "light";
  onToggleLang: () => void;
  onToggleTheme: () => void;
}

export default function Navbar({ lang, theme, onToggleLang, onToggleTheme }: NavbarProps) {
  const safeLang: Lang = lang === "en" ? "en" : "ar";
  const tr = t[safeLang];
  const pathname = usePathname();
  const router = useRouter();
  const dir = safeLang === "ar" ? "rtl" : "ltr";

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
    { label: tr.navShops,    href: "/workshops" },
    { label: tr.navServices, href: "/services"  },
    { label: tr.navMap,      href: "/map"       },
    { label: safeLang === "ar" ? "تشخيص" : "Diagnose", href: "/diagnose" },
    { label: tr.navAbout,    href: "/about"     },
  ] as const;

  const initials = user?.profile?.full_name
    ? user.profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const firstName = user?.profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "var(--nav-h)", background: "var(--bg)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)", direction: dir }}>

      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>W</div>
        <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>{tr.appName}</span>
      </Link>

      {/* Centre links */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ fontSize: 13, color: isActive ? "var(--accent)" : "var(--text-secondary)", textDecoration: "none", transition: "color .2s", fontWeight: isActive ? 600 : 400 }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onToggleLang} style={{ height: 36, padding: "0 12px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", fontFamily: "inherit" }}>
          {safeLang === "ar" ? "EN" : "عربي"}
        </button>
        <button onClick={onToggleTheme} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "var(--text-secondary)" }}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Auth */}
        {userLoading ? (
          <div style={{ width: 80, height: 36, borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
        ) : user ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button onClick={() => setDropdownOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 10px", borderRadius: 10, background: dropdownOpen ? "var(--accent-muted)" : "var(--bg-secondary)", border: dropdownOpen ? "1px solid var(--accent-border)" : "1px solid var(--border)", cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</span>
              <span style={{ fontSize: 10, color: "var(--text-tertiary)", transition: "transform .2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </button>

            {dropdownOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", [dir === "rtl" ? "left" : "right"]: 0, minWidth: 190, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", overflow: "hidden", zIndex: 100 }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px" }}>{user.profile?.full_name ?? user.email}</p>
                  <p style={{ fontSize: 11, color: "var(--text-tertiary)", margin: 0 }}>
                    {user.profile?.role === "shop_owner"
                      ? (safeLang === "ar" ? "صاحب ورشة" : "Shop owner")
                      : (safeLang === "ar" ? "صاحب سيارة" : "Car owner")}
                  </p>
                </div>
                {[
                  { href: "/dashboard", icon: "👤", label: safeLang === "ar" ? "حسابي" : "My account" },
                  { href: "/workshops", icon: "🔍", label: safeLang === "ar" ? "تصفح الورش" : "Browse workshops" },
                  { href: "/diagnose",  icon: "🔧", label: safeLang === "ar" ? "تشخيص مشكلة" : "Diagnose problem" },
                  { href: "/list-shop", icon: "🏪", label: safeLang === "ar" ? "سجّل ورشتك" : "List your shop" },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", textDecoration: "none", fontSize: 13, color: "var(--text-secondary)", transition: "background .15s", borderBottom: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-muted)"}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
                  >
                    <span>{item.icon}</span> {item.label}
                  </Link>
                ))}
                <button onClick={handleLogout} disabled={loggingOut}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#EF4444", transition: "background .15s", textAlign: dir === "rtl" ? "right" : "left" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                  <span>🚪</span> {loggingOut
                    ? (safeLang === "ar" ? "جاري الخروج..." : "Signing out...")
                    : (safeLang === "ar" ? "تسجيل الخروج" : "Sign out")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/auth/login" style={{ height: 36, padding: "0 14px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
          >
            {safeLang === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
        )}

        <Link href="/list-shop" className="warsha-btn-primary"
          style={{ padding: "8px 16px", fontSize: 13, fontFamily: "inherit", textDecoration: "none" }}>
          {tr.navRegisterCta}
        </Link>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </nav>
  );
}