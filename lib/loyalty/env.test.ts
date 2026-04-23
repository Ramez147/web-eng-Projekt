// env.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  validateEnvVariable,
  isValidSupabaseUrl,
  isValidServiceRoleKey,
  isValidPublishableKey,
  getEnvOrNull,
  getEnvOrDefault,
  selectPublishableKey,
  validateSupabaseEnvVars,
  validatePublishableKeyVars,
  parseEnvString,
  formatEnvErrorMessage,
  validateEnvVarType,
} from "./env-utils";

describe("Environment Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // validateEnvVariable Tests
  describe("validateEnvVariable", () => {
    it("gibt gültig zurück für vorhandene Variable", () => {
      const result = validateEnvVariable("test-value", "TEST_VAR");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe("test-value");
    });

    it("gibt Fehler zurück wenn Variable undefined", () => {
      const result = validateEnvVariable(undefined, "TEST_VAR");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("TEST_VAR");
    });

    it("gibt Fehler zurück wenn Variable leer", () => {
      const result = validateEnvVariable("", "TEST_VAR");
      expect(result.isValid).toBe(false);
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      const result = validateEnvVariable(undefined, "MY_VAR");
      expect(result.error).toBe(
        "Missing required environment variable: MY_VAR"
      );
    });

    it("gibt korrekte Variable in Result zurück", () => {
      const result = validateEnvVariable("production-key", "API_KEY");
      expect(result.value).toBe("production-key");
    });

    it("akzeptiert lange Variablenwerte", () => {
      const longValue = "a".repeat(1000);
      const result = validateEnvVariable(longValue, "TEST_VAR");
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(longValue);
    });

    it("akzeptiert Variablen mit Sonderzeichen", () => {
      const value = "key-123_456.abc@xyz";
      const result = validateEnvVariable(value, "TEST_VAR");
      expect(result.isValid).toBe(true);
    });

    it("akzeptiert Variablen mit Whitespace", () => {
      const value = "  test value  ";
      const result = validateEnvVariable(value, "TEST_VAR");
      expect(result.isValid).toBe(true);
    });
  });

  // isValidSupabaseUrl Tests
  describe("isValidSupabaseUrl", () => {
    it("gibt true zurück für valide Supabase URL", () => {
      expect(isValidSupabaseUrl("https://example.supabase.co")).toBe(true);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidSupabaseUrl(undefined)).toBe(false);
    });

    it("gibt false zurück für HTTP URL", () => {
      expect(isValidSupabaseUrl("http://example.supabase.co")).toBe(false);
    });

    it("gibt false zurück für URL ohne supabase.co", () => {
      expect(isValidSupabaseUrl("https://example.com")).toBe(false);
    });

    it("gibt true zurück für lange Projekt URLs", () => {
      expect(
        isValidSupabaseUrl("https://my-long-project-name-123.supabase.co")
      ).toBe(true);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidSupabaseUrl("")).toBe(false);
    });

    it("gibt true zurück für Supabase URL mit Pfad", () => {
      expect(isValidSupabaseUrl("https://example.supabase.co/rest/v1")).toBe(
        true
      );
    });
  });

  // isValidServiceRoleKey Tests
  describe("isValidServiceRoleKey", () => {
    it("gibt true zurück für validen Service Role Key", () => {
      expect(isValidServiceRoleKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")).toBe(
        true
      );
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidServiceRoleKey(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidServiceRoleKey("")).toBe(false);
    });

    it("gibt false zurück für Key ohne eyJ Prefix", () => {
      expect(isValidServiceRoleKey("invalid-key")).toBe(false);
    });

    it("gibt true zurück für langen Service Role Key", () => {
      const longKey = "eyJ" + "a".repeat(200);
      expect(isValidServiceRoleKey(longKey)).toBe(true);
    });

    it("gibt true zurück für Key mit eyJ Prefix", () => {
      expect(isValidServiceRoleKey("eyJsomething")).toBe(true);
    });

    it("gibt false zurück für Key mit falscher Formatierung", () => {
      expect(isValidServiceRoleKey("jwt_key_123")).toBe(false);
    });
  });

  // isValidPublishableKey Tests
  describe("isValidPublishableKey", () => {
    it("gibt true zurück für nicht-leeren String", () => {
      expect(isValidPublishableKey("pub-key-123")).toBe(true);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidPublishableKey(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidPublishableKey("")).toBe(false);
    });

    it("gibt true zurück für beliebiges nicht-leeres Key Format", () => {
      expect(isValidPublishableKey("any-key-format-works")).toBe(true);
    });

    it("gibt true zurück für langen Publishable Key", () => {
      const longKey = "k".repeat(500);
      expect(isValidPublishableKey(longKey)).toBe(true);
    });
  });

  // getEnvOrNull Tests
  describe("getEnvOrNull", () => {
    it("gibt Wert zurück wenn vorhanden", () => {
      const env = { MY_VAR: "test-value" };
      expect(getEnvOrNull("MY_VAR", env)).toBe("test-value");
    });

    it("gibt undefined zurück wenn nicht vorhanden", () => {
      const env = {};
      expect(getEnvOrNull("MISSING_VAR", env)).toBeUndefined();
    });

    it("gibt undefined zurück wenn Wert undefined", () => {
      const env = { MY_VAR: undefined };
      expect(getEnvOrNull("MY_VAR", env)).toBeUndefined();
    });

    it("gibt leeren String zurück wenn das der Wert ist", () => {
      const env = { MY_VAR: "" };
      expect(getEnvOrNull("MY_VAR", env)).toBe("");
    });

    it("gibt korrekten Wert mit mehreren Variablen zurück", () => {
      const env = {
        VAR1: "value1",
        VAR2: "value2",
        VAR3: "value3",
      };
      expect(getEnvOrNull("VAR2", env)).toBe("value2");
    });
  });

  // getEnvOrDefault Tests
  describe("getEnvOrDefault", () => {
    it("gibt Wert zurück wenn vorhanden", () => {
      const env = { MY_VAR: "actual-value" };
      expect(getEnvOrDefault("MY_VAR", "default", env)).toBe("actual-value");
    });

    it("gibt Default zurück wenn Variable nicht vorhanden", () => {
      const env = {};
      expect(getEnvOrDefault("MISSING_VAR", "default-value", env)).toBe(
        "default-value"
      );
    });

    it("gibt Wert zurück und ignoriert Default", () => {
      const env = { MY_VAR: "set-value" };
      expect(getEnvOrDefault("MY_VAR", "unused-default", env)).toBe(
        "set-value"
      );
    });

    it("gibt leeren String zurück wenn das der Wert ist", () => {
      const env = { MY_VAR: "" };
      expect(getEnvOrDefault("MY_VAR", "default", env)).toBe("");
    });

    it("gibt Default bei undefined Wert", () => {
      const env = { MY_VAR: undefined };
      expect(getEnvOrDefault("MY_VAR", "fallback", env)).toBe("fallback");
    });
  });

  // selectPublishableKey Tests
  describe("selectPublishableKey", () => {
    it("gibt defaultKey zurück wenn vorhanden", () => {
      expect(selectPublishableKey("default-key", "anon-key")).toBe(
        "default-key"
      );
    });

    it("gibt anonKey zurück wenn defaultKey undefined", () => {
      expect(selectPublishableKey(undefined, "anon-key")).toBe("anon-key");
    });

    it("gibt defaultKey vor anonKey zurück", () => {
      expect(selectPublishableKey("default", "fallback")).toBe("default");
    });

    it("gibt undefined zurück wenn beide undefined", () => {
      expect(selectPublishableKey(undefined, undefined)).toBeUndefined();
    });

    it("ignoriert anonKey wenn defaultKey vorhanden", () => {
      expect(selectPublishableKey("primary-key", "ignored-key")).toBe(
        "primary-key"
      );
    });
  });

  // validateSupabaseEnvVars Tests
  describe("validateSupabaseEnvVars", () => {
    it("validiert korrekte Supabase Env Variablen", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiJ9",
      };
      const result = validateSupabaseEnvVars(env);
      expect(result.url.isValid).toBe(true);
      expect(result.serviceRoleKey.isValid).toBe(true);
    });

    it("gibt Fehler für fehlende URL", () => {
      const env = {
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiJ9",
      };
      const result = validateSupabaseEnvVars(env);
      expect(result.url.isValid).toBe(false);
    });

    it("gibt Fehler für fehlenden Service Role Key", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      };
      const result = validateSupabaseEnvVars(env);
      expect(result.serviceRoleKey.isValid).toBe(false);
    });

    it("gibt Fehler für beide fehlende Variablen", () => {
      const env = {};
      const result = validateSupabaseEnvVars(env);
      expect(result.url.isValid).toBe(false);
      expect(result.serviceRoleKey.isValid).toBe(false);
    });
  });

  // validatePublishableKeyVars Tests
  describe("validatePublishableKeyVars", () => {
    it("gibt defaultKey zurück wenn vorhanden", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "default-key",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      };
      const result = validatePublishableKeyVars(env);
      expect(result.defaultKey).toBe("default-key");
      expect(result.anonKey.isValid).toBe(true);
    });

    it("verwendet anonKey wenn defaultKey fehlt", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-value",
      };
      const result = validatePublishableKeyVars(env);
      expect(result.defaultKey).toBeUndefined();
      expect(result.anonKey.isValid).toBe(true);
    });

    it("gibt Error wenn beide Keys fehlen", () => {
      const env = {};
      const result = validatePublishableKeyVars(env);
      expect(result.anonKey.isValid).toBe(false);
    });

    it("bevorzugt defaultKey über anonKey", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "preferred",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "fallback",
      };
      const result = validatePublishableKeyVars(env);
      expect(result.defaultKey).toBe("preferred");
    });
  });

  // parseEnvString Tests
  describe("parseEnvString", () => {
    it("gibt exists true für nicht-leeren String", () => {
      const result = parseEnvString("value");
      expect(result.exists).toBe(true);
      expect(result.isEmpty).toBe(false);
      expect(result.value).toBe("value");
    });

    it("gibt exists false für undefined", () => {
      const result = parseEnvString(undefined);
      expect(result.exists).toBe(false);
      expect(result.isEmpty).toBe(true);
      expect(result.value).toBeNull();
    });

    it("gibt exists true aber isEmpty true für leeren String", () => {
      const result = parseEnvString("");
      expect(result.exists).toBe(true);
      expect(result.isEmpty).toBe(true);
      expect(result.value).toBe("");
    });

    it("gibt korrekten Wert für lange Strings", () => {
      const longString = "a".repeat(500);
      const result = parseEnvString(longString);
      expect(result.exists).toBe(true);
      expect(result.isEmpty).toBe(false);
      expect(result.value).toBe(longString);
    });

    it("gibt korrekten Wert für Whitespace String", () => {
      const result = parseEnvString("   ");
      expect(result.exists).toBe(true);
      expect(result.isEmpty).toBe(false);
      expect(result.value).toBe("   ");
    });
  });

  // formatEnvErrorMessage Tests
  describe("formatEnvErrorMessage", () => {
    it("gibt Fehlermeldung ohne Grund", () => {
      const message = formatEnvErrorMessage("MY_VAR");
      expect(message).toBe(
        "Missing required environment variable: MY_VAR"
      );
    });

    it("gibt Fehlermeldung mit Grund", () => {
      const message = formatEnvErrorMessage("MY_VAR", "Invalid format");
      expect(message).toContain("Invalid format");
      expect(message).toContain("MY_VAR");
    });

    it("hat aussagekräftige Fehlermeldungen", () => {
      const message = formatEnvErrorMessage("API_KEY", "Expected JWT format");
      expect(message).toBe(
        "Invalid environment variable API_KEY: Expected JWT format"
      );
    });

    it("formatiert mehrere Variablennamen korrekt", () => {
      const msg1 = formatEnvErrorMessage("VAR1");
      const msg2 = formatEnvErrorMessage("VAR2");
      expect(msg1).toContain("VAR1");
      expect(msg2).toContain("VAR2");
      expect(msg1).not.toBe(msg2);
    });
  });

  // validateEnvVarType Tests
  describe("validateEnvVarType", () => {
    it("validiert required Type wenn vorhanden", () => {
      expect(validateEnvVarType("value", "required")).toBe(true);
    });

    it("validiert required Type als ungültig wenn undefined", () => {
      expect(validateEnvVarType(undefined, "required")).toBe(false);
    });

    it("validiert optional Type immer als true", () => {
      expect(validateEnvVarType("value", "optional")).toBe(true);
      expect(validateEnvVarType(undefined, "optional")).toBe(true);
      expect(validateEnvVarType("", "optional")).toBe(true);
    });

    it("validiert defaulted Type immer als true", () => {
      expect(validateEnvVarType("value", "defaulted")).toBe(true);
      expect(validateEnvVarType(undefined, "defaulted")).toBe(true);
      expect(validateEnvVarType("", "defaulted")).toBe(true);
    });

    it("validiert required Type als ungültig für leeren String", () => {
      expect(validateEnvVarType("", "required")).toBe(false);
    });

    it("gibt false für unbekannte Types", () => {
      expect(validateEnvVarType("value", "unknown" as any)).toBe(false);
    });
  });

  // Integration Tests
  describe("Environment Utils Integration", () => {
    it("validiert komplettes Supabase Setup", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiJ9",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "pub-key",
      };

      const supabaseVars = validateSupabaseEnvVars(env);
      expect(supabaseVars.url.isValid).toBe(true);
      expect(supabaseVars.serviceRoleKey.isValid).toBe(true);

      const pubVars = validatePublishableKeyVars(env);
      expect(pubVars.defaultKey).toBe("pub-key");
    });

    it("fallback bei fehlender Default Key", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "fallback-key",
      };

      const pubVars = validatePublishableKeyVars(env);
      expect(pubVars.defaultKey).toBeUndefined();
      expect(pubVars.anonKey.isValid).toBe(true);
    });

    it("kombiniert Key Selection mit Validierung", () => {
      const defaultKey = "preferred-key-123";
      const anonKey = "fallback-key-456";

      const selected = selectPublishableKey(defaultKey, anonKey);
      expect(selected).toBe(defaultKey);
      expect(isValidPublishableKey(selected)).toBe(true);
    });

    it("validiert komplette Auth Setup mit fallbacks", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiJ9",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key-backup",
      };

      // Validate Supabase
      const supabase = validateSupabaseEnvVars(env);
      expect(supabase.url.isValid).toBe(true);

      // Get Publishable Key with fallback
      const pubVars = validatePublishableKeyVars(env);
      expect(pubVars.anonKey.isValid).toBe(true);

      // Validate URLs
      expect(isValidSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)).toBe(true);
      expect(isValidServiceRoleKey(env.SUPABASE_SERVICE_ROLE_KEY)).toBe(true);
    });

    it("verarbeitet fehlende Variablen mit Fallbacks", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        // SERVICE_ROLE_KEY fehlt - wird Error geben
        // aber wir haben fallback auf ANON_KEY
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-backup",
      };

      const supabase = validateSupabaseEnvVars(env);
      expect(supabase.url.isValid).toBe(true);
      expect(supabase.serviceRoleKey.isValid).toBe(false);

      const pub = validatePublishableKeyVars(env);
      expect(pub.anonKey.isValid).toBe(true);
    });

    it("kombiniert alle Utilities für vollständige Validierung", () => {
      const env = {
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiJ9",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "pub-default",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "pub-anon",
      };

      // Check all variables
      const urlValid = isValidSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL);
      const keyValid = isValidServiceRoleKey(env.SUPABASE_SERVICE_ROLE_KEY);
      const pubValid = isValidPublishableKey(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

      expect(urlValid).toBe(true);
      expect(keyValid).toBe(true);
      expect(pubValid).toBe(true);

      // Validate env vars
      const supabase = validateSupabaseEnvVars(env);
      expect(supabase.url.isValid).toBe(true);
      expect(supabase.serviceRoleKey.isValid).toBe(true);

      // Get publishable key
      const selected = selectPublishableKey(
        env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      expect(selected).toBe("pub-default");
    });
  });
});
