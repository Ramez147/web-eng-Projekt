export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnv() {
  return {
    url: getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getSupabasePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
