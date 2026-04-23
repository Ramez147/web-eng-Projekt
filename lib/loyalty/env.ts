import {
  validateEnvVariable,
  selectPublishableKey,
} from "./env-utils";

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  const validation = validateEnvVariable(value, name);

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return validation.value!;
}

export function getSupabaseEnv() {
  return {
    url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getSupabasePublishableKey() {
  const defaultKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const selected = selectPublishableKey(defaultKey, anonKey);
  
  if (!selected) {
    throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return selected;
}
