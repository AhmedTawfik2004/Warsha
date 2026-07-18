import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// ─── Auth ─────────────────────────────────────────────────────────

export async function signUp({ email, password, fullName, phone, role }: {
  email: string; password: string; fullName: string; phone: string; role: "car_owner" | "shop_owner";
}) {
  const s = createClient();
  const { data, error } = await s.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, phone, role } }
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const s = createClient();
  const { data, error } = await s.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const s = createClient();
  const { error } = await s.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  try {
    const s = createClient();
    const { data: { user }, error } = await s.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await s.from("profiles").select("*").eq("id", user.id).single();
    return { id: user.id, email: user.email!, profile: profile ?? null };
  } catch {
    return null;
  }
}

export function onAuthChange(callback: (user: any) => void) {
  const s = createClient();
  const { data: { subscription } } = s.auth.onAuthStateChange(async (_e, session) => {
    if (!session?.user) { callback(null); return; }
    const { data: profile } = await s.from("profiles").select("*").eq("id", session.user.id).single();
    callback({ id: session.user.id, email: session.user.email!, profile: profile ?? null });
  });
  return () => subscription.unsubscribe();
}

// ─── Shops ────────────────────────────────────────────────────────

export type ShopRow = {
  id: number;
  name: string;
  area_ar: string;
  area_en: string;
  category_id: string;
  subcategory_id: string | null;
  rating: number;
  reviews: number;
  lat: number;
  lng: number;
  tags_ar: string[];
  tags_en: string[];
  phone: string | null;
  plan: string;
};

export async function getAllShops(): Promise<ShopRow[]> {
  try {
    const s = createClient();
    const { data, error } = await s.from("shops").select("*").order("id");
    if (error) { console.error("getAllShops:", error); return []; }
    return data ?? [];
  } catch { return []; }
}

export async function getShopsByCategory(categoryId: string): Promise<ShopRow[]> {
  try {
    const s = createClient();
    const { data, error } = await s.from("shops").select("*").eq("category_id", categoryId).order("rating", { ascending: false });
    if (error) { console.error("getShopsByCategory:", error); return []; }
    return data ?? [];
  } catch { return []; }
}

export async function getShopById(id: number): Promise<ShopRow | null> {
  try {
    const s = createClient();
    const { data, error } = await s.from("shops").select("*").eq("id", id).single();
    if (error) { console.error("getShopById:", error); return null; }
    return data ?? null;
  } catch { return null; }
}

export async function searchShops(query: string): Promise<ShopRow[]> {
  try {
    const s = createClient();
    const { data, error } = await s
      .from("shops")
      .select("*")
      .or(`name.ilike.%${query}%,area_en.ilike.%${query}%,area_ar.ilike.%${query}%`)
      .order("rating", { ascending: false });
    if (error) { console.error("searchShops:", error); return []; }
    return data ?? [];
  } catch { return []; }
}

// ─── Reviews ──────────────────────────────────────────────────────

export async function getReviewsByShop(shopId: number) {
  try {
    const s = createClient();
    const { data } = await s
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch { return []; }
}

export async function submitReview(shopId: number, rating: number, comment: string) {
  try {
    const s = createClient();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return { error: "Not logged in" };
    const { error } = await s.from("reviews").insert({ shop_id: shopId, user_id: user.id, rating, comment });
    return { error };
  } catch (e) {
    return { error: e };
  }
}
// ─── Conversations & Messages ─────────────────────────────────────

export async function getOrCreateConversation(userId: string, shopId: number) {
  const s = createClient();
  const { data: existing } = await s
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .eq("shop_id", shopId)
    .single();
  if (existing) return existing;
  const { data, error } = await s
    .from("conversations")
    .insert({ user_id: userId, shop_id: shopId })
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getConversations(userId: string) {
  const s = createClient();
  const { data } = await s
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: false });
  return data ?? [];
}

export async function getMessages(conversationId: number) {
  const s = createClient();
  const { data } = await s
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function sendMessage(conversationId: number, senderId: string, content: string) {
  const s = createClient();
  const { error } = await s.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
  if (!error) {
    await s.from("conversations").update({
      last_message: content,
      last_message_at: new Date().toISOString(),
    }).eq("id", conversationId);
  }
  return { error };
}

export function subscribeToMessages(conversationId: number, onNew: (msg: any) => void): () => void {
  const s = createClient();
  const sub = s
    .channel(`messages:${conversationId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `conversation_id=eq.${conversationId}`,
    }, payload => onNew(payload.new))
    .subscribe();
  return () => { s.removeChannel(sub); };
}

// ─── Admin ────────────────────────────────────────────────────────

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const s = createClient();
    const { data } = await s.from("admin_users").select("user_id").eq("user_id", userId).single();
    return !!data;
  } catch { return false; }
}

export async function adminGetAllUsers() {
  const s = createClient();
  const { data } = await s.from("profiles").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function adminGetAllShops() {
  const s = createClient();
  const { data } = await s.from("shops").select("*").order("id");
  return data ?? [];
}

export async function adminGetAllConversations() {
  const s = createClient();
  const { data } = await s
    .from("conversations")
    .select("*, messages(count)")
    .order("last_message_at", { ascending: false });
  return data ?? [];
}