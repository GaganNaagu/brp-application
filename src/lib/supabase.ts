import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Types for your application data
export type Application = {
  id: string;
  timestamp: string;
  username: string;
  age: number;
  steam_id: string;
  cfx_account: string;
  experience: string;
  character: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  discord_email: string;
  status?: "pending" | "approved" | "denied";
  status_reason?: string;
  updated_at?: string;
};
