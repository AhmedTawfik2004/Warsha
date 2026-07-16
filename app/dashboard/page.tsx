"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "../lib/supabase";

const S = {
  ar: {
    loading:"جاري التحميل...", welcome:"أهلاً بيك،", carRole:"صاحب سيارة", shopRole:"صاحب ورشة",
    quickActions:"إجراءات سريعة", browse:"تصفح الورش", map:"عرض الخريطة",
    logout:"تسجيل الخروج", loggingOut:"جاري الخروج...",
    notLoggedIn:"مش مسجّل دخول", goLogin:"سجّل دخولك",
    shopActions:"إدارة الورشة", addShop:"أضف ورشتك",
    accountInfo:"بيانات الحساب", emailLbl:"البريد الإلكتروني",
    roleLbl:"نوع الحساب", since:"عضو منذ", comingSoon:"قريباً",
    chatSoon:"نظام الرسائل قادم قريباً",
    chatSoonBody:"هتقدر تتواصل مع الورش مباشرة من هنا من غير ما تغادر المنصة",
    reviewsSoon:"التقييمات قادمة قريباً",
    reviewsSoonBody:"هتقدر تقيّم الورش اللي زرتها وتساعد غيرك في الاختيار",
    lang:"EN", listShop:"سجّل ورشتك", services:"الخدمات",
    statShops:"ورشة متاحة", statCats:"تخصص", statArea:"منطقة",
  },
  en: {
    loading:"Loading...", welcome:"Welcome back,", carRole:"Car owner", shopRole:"Shop owner",
    quickActions:"Quick actions", browse:"Browse workshops", map:"View map",
    logout:"Sign out", loggingOut:"Signing out...",
    notLoggedIn:"Not signed in", goLogin:"Go to login",
    shopActions:"Manage your shop", addShop:"List your shop",
    accountInfo:"Account info", emailLbl:"Email",
    roleLbl:"Account type", since:"Member since", comingSoon:"Coming soon",
    chatSoon:"Messaging coming soon",
    chatSoonBody:"Message workshops directly from here without leaving the platform",
    reviewsSoon:"Reviews coming soon",
    reviewsSoonBody:"Rate workshops you've visited and help others choose the best shop",
    lang:"عربي", listShop:"List your shop", services:"Services",
    statShops:"Shops available", statCats:"Specialisations", statArea:"Area",
  },
};

export default function DashboardPage() {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const [lang, setLang] = useState<"ar"|"en">("ar");
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTheme((localStorage.getItem("warsha-theme") as any) || "dark");
    setLang((localStorage.getItem("warsha-lang") as any) || "ar");
    setMounted(true);
    getCurrentUser().then(u => { setUser(u); setUserLoading(false); });
  }, []);

  function toggleTheme() { const n=theme==="dark"?"light":"dark"; setTheme(n); localStorage.setItem("warsha-theme",n); document.documentElement.setAttribute("data-theme",n); }
  function toggleLang() { const n=lang==="ar"?"en":"ar"; setLang(n); localStorage.setItem("warsha-lang",n); document.documentElement.setAttribute("lang",n); document.documentElement.setAttribute("dir",n==="ar"?"rtl":"ltr"); }
  async function handleLogout() { setLogoutLoading(true); await signOut(); router.push("/"); router.refresh(); }

  if (!mounted || userLoading) return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid var(--accent)", borderTopColor:"transparent", margin:"0 auto 12px", animation:"spin 1s linear infinite" }} />
        <p style={{ color:"var(--text-tertiary)", fontSize:13 }}>Loading...</p>
      </div>
    </div>
  );

  const tr = S[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isShop = user?.profile?.role === "shop_owner";
  const memberDate = user?.profile?.created_at
    ? new Date(user.profile.created_at).toLocaleDateString(lang==="ar"?"ar-EG":"en-GB", { year:"numeric", month:"long" })
    : "—";
  const initials = user?.profile?.full_name
    ? user.profile.full_name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0,2)
    : user?.email?.[0]?.toUpperCase() ?? "W";

  if (!user) return (
    <div dir={dir} style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12 }}>
      <p style={{ color:"var(--text-secondary)", fontSize:14 }}>{tr.notLoggedIn}</p>
      <Link href="/auth/login" className="warsha-btn-primary" style={{ padding:"10px 20px", fontSize:13, textDecoration:"none", fontFamily:"inherit" }}>{tr.goLogin}</Link>
    </div>
  );

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"var(--bg)", color:"var(--text-primary)" }}>

      {/* NAV */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:"var(--nav-h)", borderBottom:"1px solid var(--border)", background:"var(--bg)", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(12px)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"var(--accent)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14 }}>W</div>
          <span style={{ fontWeight:700, fontSize:17, color:"var(--text-primary)" }}>{lang==="ar"?"ورشة":"Warsha"}</span>
        </Link>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={toggleLang} style={{ height:34, padding:"0 12px", borderRadius:8, background:"var(--bg-secondary)", border:"1px solid var(--border)", cursor:"pointer", fontSize:12, fontWeight:600, color:"var(--text-secondary)", fontFamily:"inherit" }}>{tr.lang}</button>
          <button onClick={toggleTheme} style={{ width:34, height:34, borderRadius:8, background:"var(--bg-secondary)", border:"1px solid var(--border)", cursor:"pointer", fontSize:14 }}>{theme==="dark"?"☀️":"🌙"}</button>
          <button onClick={handleLogout} disabled={logoutLoading} style={{ height:34, padding:"0 14px", borderRadius:8, background:"transparent", border:"1px solid var(--border)", cursor:"pointer", fontSize:12, color:"var(--text-secondary)", fontFamily:"inherit", transition:"all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
          >{logoutLoading ? tr.loggingOut : tr.logout}</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* HERO CARD */}
        <div style={{
          borderRadius: "var(--radius-xl)", overflow: "hidden",
          background: "linear-gradient(135deg, var(--accent) 0%, #c95e00 100%)",
          padding: "32px 28px", position: "relative",
        }}>
          {/* Background pattern */}
          <div style={{ position:"absolute", inset:0, opacity:0.06, backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, direction:dir }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,.2)", backdropFilter:"blur(8px)", border:"2px solid rgba(255,255,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, color:"#fff", flexShrink:0 }}>
                {initials}
              </div>
              <div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.75)", margin:"0 0 3px" }}>{tr.welcome}</p>
                <h1 style={{ fontSize:22, fontWeight:900, color:"#fff", margin:"0 0 6px" }}>
                  {user.profile?.full_name ?? user.email}
                </h1>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:99, background:"rgba(255,255,255,.2)", color:"#fff" }}>
                  {isShop ? "🔧" : "🚗"} {isShop ? tr.shopRole : tr.carRole}
                </span>
              </div>
            </div>
            {/* Mini stats */}
            <div style={{ display:"flex", gap:24 }}>
              {[["37", tr.statShops], ["12", tr.statCats], ["2", tr.statArea]].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{val}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS + ACCOUNT INFO */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

          {/* Quick actions */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"20px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-tertiary)", margin:"0 0 14px", textTransform:"uppercase", letterSpacing:".06em" }}>{tr.quickActions}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[
                { href:"/workshops", icon:"🔍", label:tr.browse },
                { href:"/map",       icon:"🗺️", label:tr.map },
                { href:"/services",  icon:"⚙️", label:tr.services },
                { href:"/list-shop", icon:"🏪", label:tr.listShop },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"11px 14px",
                  borderRadius:"var(--radius-md)", background:"var(--bg-secondary)",
                  border:"1px solid var(--border)", textDecoration:"none",
                  fontSize:13, fontWeight:600, color:"var(--text-primary)",
                  transition:"all .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-muted)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
                >
                  <span style={{ fontSize:16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"20px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-tertiary)", margin:"0 0 14px", textTransform:"uppercase", letterSpacing:".06em" }}>{tr.accountInfo}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label: tr.emailLbl, value: user.email, icon:"✉️" },
                { label: tr.roleLbl,  value: isShop ? tr.shopRole : tr.carRole, icon: isShop ? "🔧" : "🚗" },
                { label: tr.since,    value: memberDate, icon:"📅" },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:"var(--radius-md)", background:"var(--bg-secondary)", border:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:14 }}>{row.icon}</span>
                    <span style={{ fontSize:12, color:"var(--text-tertiary)" }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)", direction:"ltr" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMING SOON CARDS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {[
            { icon:"💬", title:tr.chatSoon,    body:tr.chatSoonBody,    color:"#3B82F6" },
            { icon:"⭐", title:tr.reviewsSoon, body:tr.reviewsSoonBody, color:"#F59E0B" },
          ].map(card => (
            <div key={card.title} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"24px 20px", textAlign:"center" }}>
              <div style={{ width:48, height:48, borderRadius:"var(--radius-md)", background:`${card.color}18`, border:`1px solid ${card.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, margin:"0 auto 14px" }}>
                {card.icon}
              </div>
              <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)", margin:"0 0 6px" }}>{card.title}</p>
              <p style={{ fontSize:12, color:"var(--text-tertiary)", margin:0, lineHeight:1.7 }}>{card.body}</p>
              <div style={{ display:"inline-block", marginTop:14, fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:99, background:`${card.color}15`, color:card.color, border:`1px solid ${card.color}30` }}>
                {tr.comingSoon}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}