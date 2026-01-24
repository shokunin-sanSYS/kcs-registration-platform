import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "./env";

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const { url, serviceRoleKey } = getSupabaseAdminConfig();

  cached = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return cached;
}