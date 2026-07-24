"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, isAdmin, createClient } from "../lib/supabase";

const ADMIN_EMAIL = "tkelite2004@gmail.com";
type Tab = "overview" | "users" | "shops" | "messages" | "requests";

async function adminGetAllUsers() {
  const s = createClient();
  const { data } = await s
    .from("admin_users_view")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function adminGetAllShops() {
  const s = createClient();
  const { data } = await s.from("shops").select("*").order("id");
  return data ?? [];
}

async function adminGetAllConversations() {
  const s = createClient();
  const { data } = await s
    .from("conversations")
    .select("*")
    .order("last_message_at", { ascending: false });
  return data ?? [];
}

async function adminGetAllRequests() {
  const s = createClient();
  const { data } = await s
    .from("shop_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function approveRequest(req: any) {
  const s = createClient();

  // 1. Insert into shops table
  const { data: newShop, error: shopError } = await s
    .from("shops")
    .insert({
      name: req.name,
      phone: req.phone,
      area_en: req.area,
      category_id: req.category,
      description_en: req.description,
      rating: 0,
    })
    .select()
    .single();

  if (shopError) throw new Error("Failed to create shop: " + shopError.message);

  // 2. Link shop to the user's profile if user_id exists
  if (req.user_id) {
    await s
      .from("profiles")
      .update({ shop_id: newShop.id, role: "shop_owner" })
      .eq("id", req.user_id);
  }

  // 3. Mark request as approved
  const { error: updateError } = await s
    .from("shop_requests")
    .update({ status: "approved" })
    .eq("id", req.id);

  if (updateError) throw new Error("Failed to update request: " + updateError.message);
}

async function rejectRequest(id: number, reason: string) {
  const s = createClient();
  const { error } = await s
    .from("shop_requests")
    .update({ status: "rejected", rejected_reason: reason })
    .eq("id", id);
  if (error) throw new Error("Failed to reject request: " + error.message);
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [convs, setConvs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: number; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

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
      const [u2, s2, c2, r2] = await Promise.all([
        adminGetAllUsers(), adminGetAllShops(), adminGetAllConversations(), adminGetAllRequests(),
      ]);
      setUsers(u2); setShops(s2); setConvs(c2); setRequests(r2);
      setDataLoading(false); setLoading(false);
    });
  }, []);

  const refreshRequests = async () => {
    const r = await adminGetAllRequests();
    setRequests(r);
  };

  const handleApprove = async (req: any) => {
    setActionLoading(req.id);
    try {
      await approveRequest(req);
      await refreshRequests();
      showToast(`✓ "${req.name}" approved and added to shops`);
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal.id);
    try {
      await rejectRequest(rejectModal.id, rejectReason);
      await refreshRequests();
      showToast(`✗ "${rejectModal.name}" rejected`);
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setActionLoading(null);
      setRejectModal(null);
      setRejectReason("");
    }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080807", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #E8730A", borderTopColor:"transparent", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!authorized) return (
    <div style={{ minHeight:"100vh", background:"#080807", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:56 }}>🚫</div>
      <p style={{ color:"#555", fontSize:15, margin:0 }}>Access denied</p>
      <Link href="/" style={{ color:"#E8730A", fontSize:13, textDecoration:"none" }}>← Go home</Link>
    </div>
  );

  const carOwners = users.filter(u => !u.role || u.role === "car_owner");
  const shopOwners = users.filter(u => u.role === "shop_owner");
  const pendingRequests = requests.filter(r => r.status === "pending");

  const statCard = (val: string|number, lbl: string, color="#E8730A") => (
    <div key={lbl} style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:16, padding:"22px 24px" }}>
      <div style={{ fontSize:32, fontWeight:900, color, letterSpacing:"-0.02em" }}>{val}</div>
      <div style={{ fontSize:12, color:"#666", marginTop:6, fontWeight:600 }}>{lbl}</div>
    </div>
  );

  const TH = ({ children }: { children: React.ReactNode }) => (
    <th style={{ textAlign:"left", padding:"11px 16px", fontSize:11, fontWeight:700, color:"#555", textTransform:"uppercase", letterSpacing:".06em", borderBottom:"1px solid #1e1e1c", whiteSpace:"nowrap" }}>{children}</th>
  );
  const TD = ({ children, muted=false }: { children: React.ReactNode; muted?: boolean }) => (
    <td style={{ padding:"12px 16px", fontSize:13, color:muted?"#555":"#bbb", borderBottom:"1px solid #161614" }}>{children}</td>
  );

  const roleBadge = (role: string) => (
    <span style={{ fontSize:11, padding:"2px 9px", borderRadius:99, fontWeight:700,
      background:role==="shop_owner"?"rgba(16,185,129,.1)":"rgba(59,130,246,.1)",
      color:role==="shop_owner"?"#10B981":"#60A5FA",
      border:`1px solid ${role==="shop_owner"?"rgba(16,185,129,.2)":"rgba(59,130,246,.2)"}`
    }}>
      {role==="shop_owner"?"Shop owner":"Car owner"}
    </span>
  );

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
      pending:  { bg:"rgba(245,158,11,.1)",  color:"#F59E0B", border:"rgba(245,158,11,.2)",  label:"Pending" },
      approved: { bg:"rgba(16,185,129,.1)",  color:"#10B981", border:"rgba(16,185,129,.2)",  label:"Approved" },
      rejected: { bg:"rgba(239,68,68,.1)",   color:"#EF4444", border:"rgba(239,68,68,.2)",   label:"Rejected" },
    };
    const s = map[status] ?? map.pending;
    return (
      <span style={{ fontSize:11, padding:"2px 9px", borderRadius:99, fontWeight:700,
        background:s.bg, color:s.color, border:`1px solid ${s.border}`
      }}>{s.label}</span>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080807", color:"#bbb", fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, right:24, zIndex:1000,
          background:toast.ok?"#10B981":"#EF4444", color:"#fff",
          padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600,
          boxShadow:"0 4px 24px rgba(0,0,0,.4)", transition:"opacity .3s"
        }}>{toast.msg}</div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,.7)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:20, padding:32, width:420, maxWidth:"90vw" }}>
            <h3 style={{ margin:"0 0 8px", color:"#fff", fontSize:17, fontWeight:800 }}>Reject "{rejectModal.name}"</h3>
            <p style={{ margin:"0 0 20px", color:"#555", fontSize:13 }}>Optionally provide a reason (visible to admin only for now).</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason (optional)..."
              rows={3}
              style={{
                width:"100%", background:"#0d0d0c", border:"1px solid #2a2a28",
                borderRadius:10, padding:"10px 14px", color:"#bbb", fontSize:13,
                fontFamily:"inherit", resize:"none", outline:"none", boxSizing:"border-box"
              }}
            />
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button onClick={() => { setRejectModal(null); setRejectReason(""); }} style={{
                padding:"9px 20px", borderRadius:10, border:"1px solid #2a2a28",
                background:"transparent", color:"#888", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit"
              }}>Cancel</button>
              <button onClick={handleReject} disabled={actionLoading === rejectModal.id} style={{
                padding:"9px 20px", borderRadius:10, border:"none",
                background:"#EF4444", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
              }}>
                {actionLoading === rejectModal.id ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", height:56, borderBottom:"1px solid #141412", background:"#0b0b0a", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"#E8730A", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, color:"#fff" }}>W</div>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff" }}>Warsha.eg</span>
          <span style={{ fontSize:11, color:"#E8730A", fontWeight:700, padding:"2px 10px", borderRadius:99, background:"rgba(232,115,10,.1)", border:"1px solid rgba(232,115,10,.2)" }}>ADMIN</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:12, color:"#555" }}>{user?.email}</span>
          <Link href="/" style={{ fontSize:12, color:"#E8730A", textDecoration:"none", fontWeight:600 }}>← Back to site</Link>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 28px" }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, marginBottom:36, borderBottom:"1px solid #1a1a18" }}>
          {(["overview","users","shops","messages","requests"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"10px 20px", fontSize:13, fontWeight:600, fontFamily:"inherit",
              background:"transparent", border:"none", cursor:"pointer",
              color:tab===t?"#E8730A":"#555",
              borderBottom:tab===t?"2px solid #E8730A":"2px solid transparent",
              marginBottom:-1, textTransform:"capitalize", position:"relative"
            }}>
              {t}
              {t === "requests" && pendingRequests.length > 0 && (
                <span style={{
                  position:"absolute", top:6, right:4,
                  background:"#EF4444", color:"#fff", fontSize:10, fontWeight:800,
                  borderRadius:99, padding:"1px 6px", lineHeight:"16px"
                }}>{pendingRequests.length}</span>
              )}
            </button>
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
                  {statCard(pendingRequests.length, "Pending requests", "#EF4444")}
                </div>

                <h3 style={{ fontSize:15, fontWeight:700, color:"#fff", margin:"0 0 14px" }}>Latest signups</h3>
                <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Phone</TH><TH>Joined</TH><TH>Last seen</TH></tr></thead>
                    <tbody>
                      {users.slice(0,10).map((u:any) => (
                        <tr key={u.id}>
                          <TD>{u.full_name || "—"}</TD>
                          <TD>{u.email}</TD>
                          <TD>{roleBadge(u.role ?? "car_owner")}</TD>
                          <TD muted>{u.phone || "—"}</TD>
                          <TD muted>{new Date(u.created_at).toLocaleDateString("en-GB")}</TD>
                          <TD muted>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("en-GB") : "—"}</TD>
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
                    <thead><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Phone</TH><TH>Joined</TH><TH>Last seen</TH></tr></thead>
                    <tbody>
                      {users.map((u:any) => (
                        <tr key={u.id}>
                          <TD>{u.full_name || "—"}</TD>
                          <TD><span style={{ fontSize:12, color:"#888" }}>{u.email}</span></TD>
                          <TD>{roleBadge(u.role ?? "car_owner")}</TD>
                          <TD muted>{u.phone || "—"}</TD>
                          <TD muted>{new Date(u.created_at).toLocaleDateString("en-GB")}</TD>
                          <TD muted>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("en-GB") : "—"}</TD>
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
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 24px" }}>All shops ({shops.length})</h2>
                <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead><tr><TH>ID</TH><TH>Name</TH><TH>Category</TH><TH>Area</TH><TH>Rating</TH><TH>Phone</TH></tr></thead>
                    <tbody>
                      {shops.map((s:any) => (
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
                  <div style={{ textAlign:"center", padding:"60px 0", color:"#444" }}>No conversations yet</div>
                ) : (
                  <div style={{ background:"#111110", border:"1px solid #1e1e1c", borderRadius:14, overflow:"hidden" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead><tr><TH>Conv ID</TH><TH>Shop ID</TH><TH>Last message</TH><TH>Date</TH></tr></thead>
                      <tbody>
                        {convs.map((c:any) => (
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

            {/* REQUESTS */}
            {tab==="requests" && (
              <div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 6px" }}>
                  Shop requests ({requests.length})
                </h2>
                <p style={{ margin:"0 0 24px", fontSize:13, color:"#555" }}>
                  Approving a request creates the shop in the DB and links it to the owner's profile.
                </p>

                {requests.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0", color:"#444" }}>No requests yet</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {requests.map((r: any) => (
                      <div key={r.id} style={{
                        background:"#111110", border:"1px solid #1e1e1c", borderRadius:16,
                        padding:"20px 24px", display:"flex", alignItems:"flex-start",
                        gap:20, flexWrap:"wrap"
                      }}>
                        {/* Info */}
                        <div style={{ flex:1, minWidth:220 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                            <span style={{ fontSize:15, fontWeight:800, color:"#fff" }}>{r.name}</span>
                            {statusBadge(r.status)}
                          </div>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 24px" }}>
                            {[
                              ["Owner",    r.owner],
                              ["Phone",    r.phone],
                              ["Area",     r.area],
                              ["Category", r.category],
                            ].map(([label, val]) => (
                              <div key={label}>
                                <span style={{ fontSize:11, color:"#555", fontWeight:700, textTransform:"uppercase", letterSpacing:".05em" }}>{label} </span>
                                <span style={{ fontSize:13, color:"#999" }}>{val || "—"}</span>
                              </div>
                            ))}
                          </div>
                          {r.description && (
                            <p style={{ margin:"10px 0 0", fontSize:13, color:"#666", lineHeight:1.5 }}>{r.description}</p>
                          )}
                          {r.status === "rejected" && r.rejected_reason && (
                            <p style={{ margin:"10px 0 0", fontSize:12, color:"#EF4444" }}>
                              Reason: {r.rejected_reason}
                            </p>
                          )}
                          <p style={{ margin:"10px 0 0", fontSize:11, color:"#444" }}>
                            Submitted {new Date(r.created_at).toLocaleDateString("en-GB")}
                          </p>
                        </div>

                        {/* Actions — only for pending */}
                        {r.status === "pending" && (
                          <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                            <button
                              onClick={() => handleApprove(r)}
                              disabled={actionLoading === r.id}
                              style={{
                                padding:"9px 20px", borderRadius:10, border:"none",
                                background:"#10B981", color:"#fff", fontSize:13,
                                fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                                opacity: actionLoading === r.id ? 0.6 : 1
                              }}
                            >
                              {actionLoading === r.id ? "Approving..." : "✓ Approve"}
                            </button>
                            <button
                              onClick={() => setRejectModal({ id: r.id, name: r.name })}
                              disabled={actionLoading === r.id}
                              style={{
                                padding:"9px 20px", borderRadius:10,
                                border:"1px solid rgba(239,68,68,.3)",
                                background:"rgba(239,68,68,.08)", color:"#EF4444",
                                fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit"
                              }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
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