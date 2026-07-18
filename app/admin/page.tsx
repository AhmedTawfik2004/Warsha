"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, adminGetAllUsers, adminGetAllShops, adminGetAllConversations, isAdmin } from "../lib/supabase";

const ADMIN_EMAIL = "tkelite2004@gmail.com";

type Tab = "overview" | "users" | "shops" | "messages";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [convs, setConvs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then(async u => {
      if (!u) { window.location.href = "/auth/login"; return; }
      setUser(u);
      const adminCheck = await isAdmin(u.id);
      if (u.email !== ADMIN_EMAIL || !adminCheck) {
        setAuthorized(false); setLoading(false); return;
      }
      setAuthorized(true);
      setDataLoading(true);
      const [u2, s2, c2] = await Promise.all([
        adminGetAllUsers(), adminGetAllShops(), adminGetAllConversations(),
      ]);
      setUsers(u2); setShops(s2); setConvs(c2);
      setDataLoading(false); setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080807", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #E8730A", borderTopColor:"transparent", margin:"0 auto 12px", animation:"spin 1s linear infinite" }} />
        <p style={{ fontSize:12, color:"#555" }}>Verifying access...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!authorized) return (
    <div style={{ minHeight:"100vh", background:"#080807", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:56 }}>🚫</div>
      <p style={{ color:"#555", fontSize:15, margin:0 }}>Access denied</p>
      <p style={{ color:"#333", fontSize:12, margin:0 }}>This page is restricted</p>
      <Link href="/" style={{ color:"#E8730A", fontSize:13, textDecoration:"none", marginTop:8 }}>← Go home</Link>
    </div>
  );

  const carOwners = users.filter(u => !u.role || u.role === "car_owner");
  const shopOwners = users.filter(u => u.role === "shop_owner");

  const statCard = (val: string|number, lbl: string, color="#E8730A", sub?: string) => (
    <div key={lbl} style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:16, padding:"22px 24px" }}>
      <div style={{ fontSize:32, fontWeight:900, color, letterSpacing:"-0.02em" }}>{val}</div>
      <div style={{ fontSize:12, color:"#666", marginTop:6, fontWeight:600 }}>{lbl}</div>
      {sub && <div style={{ fontSize:11, color:"#444", marginTop:3 }}>{sub}</div>}
    </div>
  );

  const TH = ({ children }: { children: React.ReactNode }) => (
    <th style={{ textAlign:"left", padding:"11px 16px", fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:".06em", borderBottom:"1px solid #1e1e1c", whiteSpace:"nowrap" }}>{children}</th>
  );
  const TD = ({ children, muted=false }: { children: React.ReactNode; muted?: boolean }) => (
    <td style={{ padding:"12px 16px", fontSize:13, color:muted?"#555":"#bbb", borderBottom:"1px solid #161614" }}>{children}</td>
  );

  const roleBadge = (role: string) => (
    <span style={{ fontSize:11, padding:"2px 9px", borderRadius:99, fontWeight:700, background:role==="shop_owner"?"rgba(16,185,129,.1)":"rgba(59,130,246,.1)", color:role==="shop_owner"?"#10B981":"#60A5FA", border:`1px solid ${role==="shop_owner"?"rgba(16,185,129,.2)":"rgba(59,130,246,.2)"}` }}>
      {role==="shop_owner"?"Shop owner":"Car owner"}
    </span>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#080807", color:"#bbb", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", height:56, borderBottom:"1px solid #141412", background:"#0b0b0a", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"#E8730A", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff" }}>W</div>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff" }}>WarshaFinder</span>
          <span style={{ fontSize:11, color:"#E8730A", fontWeight:700, padding:"2px 10px", borderRadius:99, background:"rgba(232,115,10,.1)", border:"1px solid rgba(232,115,10,.2)" }}>ADMIN PANEL</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:12, color:"#555" }}>{user?.email}</span>
          <Link href="/" style={{ fontSize:12, color:"#E8730A", textDecoration:"none", fontWeight:600 }}>← Back to site</Link>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 28px" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:36, borderBottom:"1px solid #1a1a18", paddingBottom:0 }}>
          {(["overview","users","shops","messages"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"10px 20px", fontSize:13, fontWeight:600, fontFamily:"inherit",
              background:"transparent", border:"none", cursor:"pointer",
              color:tab===t?"#E8730A":"#555",
              borderBottom:tab===t?"2px solid #E8730A":"2px solid transparent",
              marginBottom:-1, textTransform:"capitalize", letterSpacing:".01em",
            }}>{t}</button>
          ))}
        </div>

        {dataLoading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:"#444" }}>Loading data...</div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab==="overview" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>Overview</h2>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12, marginBottom:40 }}>
                  {statCard(users.length, "Total users")}
                  {statCard(carOwners.length, "Car owners", "#60A5FA")}
                  {statCard(shopOwners.length, "Shop owners", "#10B981")}
                  {statCard(shops.length, "Shops in DB", "#8B5CF6")}
                  {statCard(convs.length, "Conversations", "#F59E0B")}
                </div>

                <h3 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:"0 0 14px" }}>Latest users</h3>
                <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><TH>Name</TH><TH>Role</TH><TH>Phone</TH><TH>Joined</TH></tr></thead>
                    <tbody>
                      {users.slice(0,8).map(u => (
                        <tr key={u.id}>
                          <TD>{u.full_name || "—"}</TD>
                          <TD>{roleBadge(u.role ?? "car_owner")}</TD>
                          <TD muted>{u.phone || "—"}</TD>
                          <TD muted>{new Date(u.created_at).toLocaleDateString("en-GB")}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab==="users" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>All users ({users.length})</h2>
                <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><TH>Name</TH><TH>Role</TH><TH>Phone</TH><TH>Joined</TH></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <TD>{u.full_name || "—"}</TD>
                          <TD>{roleBadge(u.role ?? "car_owner")}</TD>
                          <TD muted>{u.phone || "—"}</TD>
                          <TD muted>{new Date(u.created_at).toLocaleDateString("en-GB")}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SHOPS */}
            {tab==="shops" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>All shops in database ({shops.length})</h2>
                <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><TH>ID</TH><TH>Name</TH><TH>Category</TH><TH>Area</TH><TH>Rating</TH><TH>Phone</TH></tr></thead>
                    <tbody>
                      {shops.map((s: any) => (
                        <tr key={s.id}>
                          <TD muted>#{s.id}</TD>
                          <TD>{s.name}</TD>
                          <TD muted>{s.category_id}</TD>
                          <TD muted>{s.area_en}</TD>
                          <TD><span style={{ color:"#F59E0B", fontWeight:700 }}>★ {s.rating}</span></TD>
                          <TD muted>{s.phone || "—"}</TD>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {tab==="messages" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>Conversations ({convs.length})</h2>
                {convs.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0", color:"#444", fontSize:14 }}>No conversations yet</div>
                ) : (
                  <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead><tr><TH>Conv ID</TH><TH>Shop ID</TH><TH>Last message</TH><TH>Date</TH></tr></thead>
                      <tbody>
                        {convs.map((c: any) => (
                          <tr key={c.id}>
                            <TD muted>#{c.id}</TD>
                            <TD muted>#{c.shop_id}</TD>
                            <TD>{c.last_message || "—"}</TD>
                            <TD muted>{new Date(c.last_message_at).toLocaleDateString("en-GB")}</TD>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
