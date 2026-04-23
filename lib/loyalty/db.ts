import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";
import { getSupabaseClientConfig } from "./db-utils";

export function getAdminSupabaseClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  const config = getSupabaseClientConfig();

  return createClient(url, serviceRoleKey, config);
}
