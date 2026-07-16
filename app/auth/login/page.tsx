"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../../lib/supabase";

const S = {
  ar: { title:"تسجيل الدخول", sub:"مرحباً بيك في ورشة", email:"البريد الإلكتروني", pass:"كلمة المرور", btn:"دخول", loading:"جاري الدخول...", noAcc:"مش عندك حساب؟", reg:"سجّل دلوقتي", forgot:"نسيت كلمة المرور؟", errInvalid:"البريد أو كلمة المرور غلط", errGen:"حصل خطأ، حاول تاني", lang:"EN" },
  en: { title:"Sign in", sub:"Welcome back to Warsha", email:"Email address", pass:"Password", btn:"Sign in", loading:"Signing in...", noAcc:"Don't have an account?", reg:"Register now", forgot:"Forgot password?", errInvalid:"Invalid email or password", errGen:"Something went wrong", lang:"عربي" },
};

export default function LoginPage() {
  const [theme, setTheme] = useState<"dark"|"light">("dark");
  const [lang, setLang] = useState<"ar"|"en">("ar");
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    setTheme((localStorage.getItem("warsha-theme") as any) || "dark");
    setLang((localStorage.getItem("warsha-lang") as any) || "ar");
    setMounted(true);
  }, []);

  function toggleTheme() { const n = theme==="dark"?"light":"dark"; setTheme(n); localStorage.setItem("warsha-theme",n); document.documentElement.setAttribute("data-theme",n); }
  function toggleLang() { const n = lang==="ar"?"en":"ar"; setLang(n); localStorage.setItem("warsha-lang",n); document.documentElement.setAttribute("lang",n); document.documentElement.setAttribute("dir",n==="ar"?"rtl":"ltr"); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message.toLowerCase().includes("invalid") ? S[lang].errInvalid : S[lang].errGen);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (!mounted) return null;
  const tr = S[lang];
  const dir = lang==="ar" ? "rtl" : "ltr";
  const inp: React.CSSProperties = { width:"100%", padding:"12px 14px", background:"var(--bg-secondary)", border:"1.5px solid var(--border)", borderRadius:"var(--radius-md)", color:"var(--text-primary)", fontSize:14, fontFamily:"inherit", outline:"none", direction:"ltr", textAlign:"left", transition:"border-color .2s" };

  return (
    <div dir={dir} style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
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

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:400, background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--radius-xl)", padding:"36px 32px" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ width:48, height:48, borderRadius:"var(--radius-md)", background:"var(--accent)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:20, margin:"0 auto 16px" }}>W</div>
            <h1 style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)", margin:"0 0 4px" }}>{tr.title}</h1>
            <p style={{ fontSize:13, color:"var(--text-tertiary)", margin:0 }}>{tr.sub}</p>
          </div>

          {error && (
            <div style={{ padding:"10px 14px", borderRadius:"var(--radius-md)", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)", color:"#EF4444", fontSize:13, marginBottom:16, textAlign:"center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:"var(--text-secondary)", marginBottom:6 }}>{tr.email}</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="example@email.com" style={inp}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"var(--text-secondary)" }}>{tr.pass}</label>
              </div>
              <input type="password" required value={password} onChange={e=>setPass(e.target.value)} placeholder="••••••••" style={inp}
                onFocus={e=>(e.target as HTMLInputElement).style.borderColor="var(--accent)"}
                onBlur={e=>(e.target as HTMLInputElement).style.borderColor="var(--border)"} />
            </div>
            <button type="submit" disabled={loading} className="warsha-btn-primary"
              style={{ padding:"12px 0", fontSize:14, fontFamily:"inherit", width:"100%", marginTop:4, opacity:loading?0.6:1 }}>
              {loading ? tr.loading : tr.btn}
            </button>
          </form>

          <p style={{ textAlign:"center", fontSize:13, color:"var(--text-tertiary)", margin:"20px 0 0" }}>
            {tr.noAcc}{" "}
            <Link href="/auth/register" style={{ color:"var(--accent)", textDecoration:"none", fontWeight:600 }}>{tr.reg}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}