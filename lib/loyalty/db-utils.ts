// Database utility functions - testable without external dependencies

export interface SupabaseEnv {
  url: string;
  serviceRoleKey: string;
}

export interface SupabaseClientConfig {
  auth: {
    persistSession: boolean;
    autoRefreshToken: boolean;
  };
}

export function isValidSupabaseUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  return (
    url.startsWith("https://") &&
    url.includes("supabase.co") &&
    url.length > 20
  );
}

export function isValidServiceRoleKey(key: string | null | undefined): boolean {
  if (!key || typeof key !== "string") {
    return false;
  }

  return key.length > 0 && key.startsWith("eyJ");
}

export function validateSupabaseEnv(env: Partial<SupabaseEnv>): {
  isValid: boolean;
  error?: string;
} {
  if (!env.url) {
    return { isValid: false, error: "Missing Supabase URL" };
  }

  if (!isValidSupabaseUrl(env.url)) {
    return { isValid: false, error: "Invalid Supabase URL format" };
  }

  if (!env.serviceRoleKey) {
    return { isValid: false, error: "Missing service role key" };
  }

  if (!isValidServiceRoleKey(env.serviceRoleKey)) {
    return { isValid: false, error: "Invalid service role key format" };
  }

  return { isValid: true };
}

export function getSupabaseClientConfig(): SupabaseClientConfig {
  return {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  };
}

export function mergeSupabaseConfig(
  baseConfig: SupabaseClientConfig,
  overrides?: Partial<SupabaseClientConfig>
): SupabaseClientConfig {
  if (!overrides) {
    return baseConfig;
  }

  return {
    ...baseConfig,
    auth: {
      ...baseConfig.auth,
      ...(overrides.auth || {}),
    },
  };
}

export function isSupabaseConfigValid(config: SupabaseClientConfig): boolean {
  return (
    config &&
    config.auth !== undefined &&
    typeof config.auth.persistSession === "boolean" &&
    typeof config.auth.autoRefreshToken === "boolean"
  );
}

export function extractSupabaseUrl(connectionString: string): string | null {
  try {
    const match = connectionString.match(/https:\/\/[^\/]+\.supabase\.co/);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

export function validateTableName(name: string | null | undefined): boolean {
  if (!name || typeof name !== "string") {
    return false;
  }

  const pattern = /^[a-z_][a-z0-9_]*$/i;
  return pattern.test(name);
}

export function validateColumnName(name: string | null | undefined): boolean {
  if (!name || typeof name !== "string") {
    return false;
  }

  const pattern = /^[a-z_][a-z0-9_]*$/i;
  return pattern.test(name);
}

export type QueryOperation = "select" | "insert" | "update" | "delete";

export function isValidQueryOperation(
  operation: string | null | undefined
): operation is QueryOperation {
  if (!operation || typeof operation !== "string") {
    return false;
  }

  return ["select", "insert", "update", "delete"].includes(operation);
}

export interface ConnectionHealthStatus {
  isHealthy: boolean;
  message: string;
}

export function checkConnectionHealth(
  url: string | null,
  key: string | null
): ConnectionHealthStatus {
  if (!isValidSupabaseUrl(url)) {
    return { isHealthy: false, message: "Invalid Supabase URL" };
  }

  if (!isValidServiceRoleKey(key)) {
    return { isHealthy: false, message: "Invalid service role key" };
  }

  return { isHealthy: true, message: "Connection parameters are valid" };
}
