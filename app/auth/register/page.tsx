"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "../../lib/supabase";

const S = {
  ar: { title:"إنشاء حساب", sub:"انضم لورشة مجاناً", roleLabel:"نوع الحساب", carTitle:"صاحب سيارة", carDesc:"أدور على ورش وتواصل معاهم", shopTitle:"صاحب ورشة", shopDesc:"أسجّل ورشتي وأستقبل عملاء", name:"الاسم الكامل", phone:"رقم الموبايل", email:"البريد الإلكتروني", pass:"كلمة المرور", passHint:"٦ أحرف على الأقل", btn:"إنشاء الحساب", loading:"جاري إنشاء الحساب...", have:"عندك حساب؟", login:"سجّل دخولك", errEmail:"البريد مستخدم بالفعل", errGen:"حصل خطأ", lang:"EN" },
  en: { title:"Create account", sub:"Join Warsha for free", roleLabel:"Account type", carTitle:"Car owner", carDesc:"Browse and contact workshops", shopTitle:"Shop owner", shopDesc:"List my shop and receive customers", name:"Full name", phone:"Phone number", email:"Email address", pass:"Password", passHint:"At least 6 characters", btn:"Create account", loading:"Creating account...", have:"Already have an account?", login:"Sign in", errEmail:"Email already in use", errGen:"Something went wrong", lang:"عربي" },
};

export default function RegisterPage() {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const [lang, setLang] = useState<"ar"|"en">("ar");
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"car_owner"|"shop_owner">("car_owner");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    setTheme((localStorage.getItem("warsha-theme") as any) || "dark");
    setLang((localStorage.getItem("warsha-lang") as any) || "ar");
    setMounted(true);
  }, []);

  function toggleTheme() { const n=theme==="dark"?"light":"dark"; setTheme(n); localStorage.setItem("warsha-theme",n); document.documentElement.setAttribute("data-theme",n); }
  function toggleLang() { const n=lang==="ar"?"en":"ar"; setLang(n); localStorage.setItem("warsha-lang",n); document.documentElement.setAttribute("lang",n); document.documentElement.setAttribute("dir",n==="ar"?"rtl":"ltr"); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp({ email, password:pass, fullName:name, phone, role });
    setLoading(false);
    if (error) {
      setError(error.message.toLowerCase().includes("already") ? S[lang].errEmail : S[lang].errGen);
      return;
    }
    // Email confirm is off — redirect straight to login
    router.push("/auth/login?registered=1");
  }

  if (!mounted) return null;
  const tr = S[lang];
  const dir = lang==="ar" ? "rtl" : "ltr";
  const inp: React.CSSProperties = { width:"100%", padding:"11px 14px", background:"var(--bg-secondary)", border:"1.5px solid var(--border)", borderRadius:"var(--radius-md)", color:"var(--text-primary)", fontSize:14, fontFamily:"inherit", outline:"none", transition:"border-color .2s" };

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"var(--bg)" }}>
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:"var(--nav-h)", borderBottom:"1px solid var(--border)", background:"var(--bg)" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"var(--accent)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13 }}>W</div>
          <span style={{ fontWeight:700, fontSize:16, color:"var(--text-primary)" }}>{lang==="ar"?"ورشة":"Warsha"}</span>
        </Link>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={toggleLang} style={{ height:32, padding:"0 10px", borderRadius:8, background:"var(--bg-secondary)", border:"1px solid var(--border)", cursor:"pointer", fontSize:12, fontWeight:600, color:"var(--text-secondary)", fontFamily:"inherit" }}>{tr.lang}</button>
          <button onClick={toggleTheme} style={{ width:32, height:32, borderRadius:8, background:"var(--bg-secondary)", border:"1px solid var(--border)", cursor:"pointer", fontSize:14 }}>{theme==="dark"?"☀️":"🌙"}</button>
        </div>
      </nav>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px" }}>
        <div style={{ width:"100%", maxWidth:440, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-xl)", padding:"36px 32px" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", margin:"0 0 4px" }}>{tr.title}</h1>
            <p style={{ fontSize:13, color:"var(--text-tertiary)", margin:0 }}>{tr.sub}</p>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:8 }}>{tr.roleLabel}</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {(["car_owner","shop_owner"] as const).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)} style={{
                  padding:"12px 10px", borderRadius:"var(--radius-md)", cursor:"pointer",
                  fontFamily:"inherit", textAlign:"center",
                  background: role===r ? "rgba(232,115,10,.1)" : "var(--bg-secondary)",
                  border: role===r ? "1.5px solid rgba(232,115,10,.4)" : "1px solid var(--border)",
                  transition:"all .15s",
                }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{r==="car_owner"?"🚗":"🔧"}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:role===r?"var(--accent)":"var(--text-primary)" }}>
                    {r==="car_owner" ? tr.carTitle : tr.shopTitle}
                  </div>
                  <div style={{ fontSize:11, color:"var(--text-tertiary)", marginTop:2 }}>
                    {r==="car_owner" ? tr.carDesc : tr.shopDesc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding:"10px 14px", borderRadius:"var(--radius-md)", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", color:"#EF4444", fontSize:13, marginBottom:14, textAlign:"center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:5 }}>{tr.name}</label>
              <input required value={name} onChange={e=>setName(e.target.value)}
                style={{ ...inp, direction:dir, textAlign:dir==="rtl"?"right":"left" }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:5 }}>{tr.phone}</label>
              <input required type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01xxxxxxxxx"
                style={{ ...inp, direction:"ltr", textAlign:"left" }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:5 }}>{tr.email}</label>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com"
                style={{ ...inp, direction:"ltr", textAlign:"left" }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:5 }}>
                {tr.pass} <span style={{ fontSize:11, color:"var(--text-tertiary)" }}>{tr.passHint}</span>
              </label>
              <input required type="password" minLength={6} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"
                style={{ ...inp, direction:"ltr", textAlign:"left" }}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <button type="submit" disabled={loading} className="warsha-btn-primary"
              style={{ padding:"12px 0", fontSize:14, fontFamily:"inherit", width:"100%", marginTop:6, opacity:loading?0.6:1 }}>
              {loading ? tr.loading : tr.btn}
            </button>
          </form>

          <p style={{ textAlign:"center", fontSize:13, color:"var(--text-tertiary)", margin:"16px 0 0" }}>
            {tr.have}{" "}
            <Link href="/auth/login" style={{ color:"var(--accent)", textDecoration:"none", fontWeight:600 }}>{tr.login}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}