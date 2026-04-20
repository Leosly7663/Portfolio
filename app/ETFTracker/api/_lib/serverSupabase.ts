import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SERVER_SUPABASE_UNAVAILABLE_MESSAGE =
  "Supabase server configuration is missing. This action is unavailable while backup mode is active.";

export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
