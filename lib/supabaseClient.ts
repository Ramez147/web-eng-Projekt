import { createClient } from '@supabase/supabase-js';

/**
 * Validates that a URL is a valid Supabase URL format
 * @param url - URL to validate
 * @returns true if URL is valid Supabase format
 */
export function isValidSupabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    // Supabase URLs should be HTTPS
    if (parsed.protocol !== 'https:') return false;
    // Should contain supabase domain
    if (!parsed.hostname.includes('supabase')) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a string is a valid Supabase API key format
 * @param key - Key to validate
 * @returns true if key looks like valid Supabase format
 */
export function isValidSupabaseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  // Supabase keys are typically long base64-like strings
  if (key.length < 20) return false;
  // Should contain alphanumeric and possibly hyphens/underscores
  return /^[a-zA-Z0-9_-]+$/.test(key);
}

/**
 * Checks if all required Supabase environment variables are present
 * @param envVars - Object with NEXT_PUBLIC_SUPABASE_URL and key
 * @returns true if all required vars are present and valid
 */
export function areSupabaseEnvVarsValid(envVars: {
  url?: string;
  key?: string;
}): boolean {
  if (!envVars.url || !envVars.key) return false;
  return isValidSupabaseUrl(envVars.url) && isValidSupabaseKey(envVars.key);
}

/**
 * Gets the appropriate Supabase key from environment variables
 * @param publishableKey - Publishable key if available
 * @param anonKey - Anon key as fallback
 * @returns Selected key or null if neither available
 */
export function getSupabaseKey(publishableKey?: string, anonKey?: string): string | null {
  // Prefer publishable key if available
  if (publishableKey && isValidSupabaseKey(publishableKey)) {
    return publishableKey;
  }
  // Fall back to anon key
  if (anonKey && isValidSupabaseKey(anonKey)) {
    return anonKey;
  }
  return null;
}

/**
 * Trims and validates environment variable value
 * @param value - Environment variable value
 * @returns Trimmed value or null if empty
 */
export function getEnvVarValue(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Creates a Supabase URL from components
 * @param protocol - Protocol (should be https)
 * @param hostname - Hostname
 * @param port - Optional port
 * @returns Full URL or null if invalid
 */
export function buildSupabaseUrl(protocol: string, hostname: string, port?: number): string | null {
  if (protocol !== 'https') return null;
  if (!hostname || typeof hostname !== 'string') return null;
  
  try {
    const url = new URL(`${protocol}://${hostname}`);
    if (port) url.port = port.toString();
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Extracts hostname from Supabase URL
 * @param url - Supabase URL
 * @returns Hostname or null if invalid
 */
export function getHostnameFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

// Lazy initialize supabase client only if credentials available
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    // Client creation failed - will be null
  }
}

export { supabase };
