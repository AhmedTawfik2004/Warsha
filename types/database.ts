export type UserRole = "car_owner" | "shop_owner";
export interface Profile { id: string; role: UserRole; full_name: string; phone: string | null; avatar_url: string | null; created_at: string; }
export interface AuthUser { id: string; email: string; profile: Profile | null; }
export interface Conversation { id: string; user_id: string; shop_id: number; last_message: string | null; last_message_at: string | null; created_at: string; }
export interface Message { id: string; conversation_id: string; sender_id: string; content: string; created_at: string; read: boolean; }
