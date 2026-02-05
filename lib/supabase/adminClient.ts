import { createClient } from "@supabase/supabase-js";

import { loadEnvVar } from "@/lib/env";

const resolveSupabaseUrl = () =>
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  loadEnvVar("SUPABASE_URL") ??
  loadEnvVar("NEXT_PUBLIC_SUPABASE_URL") ??
  "";

const resolveServiceRoleKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  loadEnvVar("SUPABASE_SERVICE_ROLE_KEY") ??
  "";

export function getSupabaseAdminClient() {
  const supabaseUrl = resolveSupabaseUrl();
  const serviceRoleKey = resolveServiceRoleKey();

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
