// Environment utility functions - testable without direct process.env manipulation

export interface EnvValidationResult {
  isValid: boolean;
  error?: string;
  value?: string;
}

export function validateEnvVariable(
  value: string | undefined,
  varName: string
): EnvValidationResult {
  if (!value) {
    return {
      isValid: false,
      error: `Missing required environment variable: ${varName}`,
    };
  }

  return {
    isValid: true,
    value,
  };
}

export function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  return url.startsWith("https://") && url.includes("supabase.co");
}

export function isValidServiceRoleKey(key: string | undefined): boolean {
  if (!key) {
    return false;
  }

  return key.length > 0 && key.startsWith("eyJ");
}

export function isValidPublishableKey(key: string | undefined): boolean {
  if (!key) {
    return false;
  }

  return key.length > 0;
}

export function getEnvOrNull(name: string, env: Record<string, string | undefined>): string | undefined {
  return env[name];
}

export function getEnvOrDefault(
  name: string,
  defaultValue: string,
  env: Record<string, string | undefined>
): string {
  return env[name] ?? defaultValue;
}

export function selectPublishableKey(
  defaultKey: string | undefined,
  anonKey: string | undefined
): string | undefined {
  return defaultKey ?? anonKey;
}

export function validateSupabaseEnvVars(env: Record<string, string | undefined>): {
  url: EnvValidationResult;
  serviceRoleKey: EnvValidationResult;
} {
  return {
    url: validateEnvVariable(env["NEXT_PUBLIC_SUPABASE_URL"], "NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: validateEnvVariable(env["SUPABASE_SERVICE_ROLE_KEY"], "SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function validatePublishableKeyVars(env: Record<string, string | undefined>): {
  defaultKey: string | undefined;
  anonKey: EnvValidationResult;
} {
  const defaultKey = env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"];
  
  if (defaultKey) {
    return {
      defaultKey,
      anonKey: { isValid: true, value: defaultKey },
    };
  }

  return {
    defaultKey,
    anonKey: validateEnvVariable(env["NEXT_PUBLIC_SUPABASE_ANON_KEY"], "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function parseEnvString(value: string | undefined): {
  exists: boolean;
  isEmpty: boolean;
  value: string | null;
} {
  if (value === undefined) {
    return { exists: false, isEmpty: true, value: null };
  }

  if (value === "") {
    return { exists: true, isEmpty: true, value: "" };
  }

  return { exists: true, isEmpty: false, value };
}

export function formatEnvErrorMessage(varName: string, reason?: string): string {
  if (reason) {
    return `Invalid environment variable ${varName}: ${reason}`;
  }
  return `Missing required environment variable: ${varName}`;
}

export type EnvVarType = "required" | "optional" | "defaulted";

export function validateEnvVarType(
  value: string | undefined,
  type: EnvVarType
): boolean {
  if (type === "required") {
    return !!value;
  }

  if (type === "optional") {
    return true; // always valid
  }

  if (type === "defaulted") {
    return true; // always valid - will use default
  }

  return false;
}
