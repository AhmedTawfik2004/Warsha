"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    try {
      setIsDark((localStorage.getItem("warsha-theme") || "dark") === "dark");
      setLang(localStorage.getItem("warsha-lang") || "ar");
    } catch {}

    // Listen for theme/lang changes from other components
    function onStorage(e: StorageEvent) {
      if (e.key === "warsha-theme") setIsDark(e.newValue === "dark");
      if (e.key === "warsha-lang") setLang(e.newValue || "ar");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const bg     = isDark ? "rgba(10,10,9,0.97)"   : "rgba(255,255,255,0.97)";
  const border = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
  const active = isDark ? "#6E7F77"               : "#214E4F";
  const muted  = isDark ? "rgba(234,236,233,.40)" : "rgba(0,0,0,.35)";

  const items = [
    { href: "/",          icon: "🏠", label: lang === "ar" ? "الرئيسية" : "Home" },
    { href: "/workshops", icon: "🔍", label: lang === "ar" ? "الورش"    : "Workshops" },
    { href: "/map",       icon: "🗺️", label: lang === "ar" ? "الخريطة"  : "Map" },
    { href: "/diagnose",  icon: "🔧", label: lang === "ar" ? "تشخيص"    : "Diagnose" },
    { href: "/dashboard", icon: "👤", label: lang === "ar" ? "حسابي"    : "Account" },
  ];

  return (
    <nav style={{
      display: "none",           // shown only on mobile via the CSS below
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 200,
      background: bg,
      borderTop: `1px solid ${border}`,
      backdropFilter: "blur(20px) saturate(180%)",
      boxShadow: isDark ? "0 -2px 20px rgba(0,0,0,.4)" : "0 -2px 12px rgba(0,0,0,.06)",
      paddingBottom: "env(safe-area-inset-bottom, 0px)", // iPhone notch
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}
      className="warsha-mobile-bottom-nav"
    >
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "stretch",
        height: 58,
      }}>
        {items.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                color: isActive ? active : muted,
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                paddingTop: 6,
                transition: "color .15s",
                borderTop: isActive ? `2px solid ${active}` : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .warsha-mobile-bottom-nav { display: block !important; }
        }
        @media (min-width: 769px) {
          .warsha-mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
