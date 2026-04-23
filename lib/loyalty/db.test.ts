// db.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  isValidSupabaseUrl,
  isValidServiceRoleKey,
  validateSupabaseEnv,
  getSupabaseClientConfig,
  mergeSupabaseConfig,
  isSupabaseConfigValid,
  extractSupabaseUrl,
  validateTableName,
  validateColumnName,
  isValidQueryOperation,
  checkConnectionHealth,
} from "./db-utils";

describe("Database Utilities", () => {
  beforeEach(() => {
    // Cleanup before each test
  });

  // isValidSupabaseUrl Tests
  describe("isValidSupabaseUrl", () => {
    it("gibt true zurück für valide Supabase URL", () => {
      const url = "https://example.supabase.co";
      expect(isValidSupabaseUrl(url)).toBe(true);
    });

    it("gibt true zurück für lange valide URL", () => {
      const url = "https://very-long-project-name-example.supabase.co";
      expect(isValidSupabaseUrl(url)).toBe(true);
    });

    it("gibt false zurück für null", () => {
      expect(isValidSupabaseUrl(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidSupabaseUrl(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidSupabaseUrl("")).toBe(false);
    });

    it("gibt false zurück für URL ohne https", () => {
      expect(isValidSupabaseUrl("http://example.supabase.co")).toBe(false);
    });

    it("gibt false zurück für URL ohne supabase.co", () => {
      expect(isValidSupabaseUrl("https://example.com")).toBe(false);
    });

    it("gibt true zurück für zu kurze URL mit valider Struktur", () => {
      expect(isValidSupabaseUrl("https://a.supabase.co")).toBe(true);
    });

    it("gibt false zurück für nicht-String Wert", () => {
      expect(isValidSupabaseUrl(123 as any)).toBe(false);
    });

    it("gibt true zurück für URL mit Umlauten in Projektnamen", () => {
      expect(isValidSupabaseUrl("https://project-name-123.supabase.co")).toBe(
        true
      );
    });

    it("gibt false zurück für URL mit ungültigem Schema", () => {
      expect(isValidSupabaseUrl("ftp://example.supabase.co")).toBe(false);
    });
  });

  // isValidServiceRoleKey Tests
  describe("isValidServiceRoleKey", () => {
    it("gibt true zurück für validen Service Role Key", () => {
      const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      expect(isValidServiceRoleKey(key)).toBe(true);
    });

    it("gibt true zurück für langen Service Role Key", () => {
      const key = "eyJ" + "a".repeat(200);
      expect(isValidServiceRoleKey(key)).toBe(true);
    });

    it("gibt false zurück für null", () => {
      expect(isValidServiceRoleKey(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidServiceRoleKey(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidServiceRoleKey("")).toBe(false);
    });

    it("gibt false zurück für Key ohne eyJ Prefix", () => {
      expect(isValidServiceRoleKey("invalidkey123")).toBe(false);
    });

    it("gibt false zurück für nicht-String Wert", () => {
      expect(isValidServiceRoleKey(123 as any)).toBe(false);
    });

    it("gibt true zurück für Key mit eyJ Prefix", () => {
      expect(isValidServiceRoleKey("eyJ")).toBe(true); // hat eyJ prefix
    });

    it("gibt true zurück für Key mit eyJ und Mindestlänge", () => {
      expect(isValidServiceRoleKey("eyJabc")).toBe(true);
    });

    it("gibt false zurück für Object", () => {
      expect(isValidServiceRoleKey({} as any)).toBe(false);
    });
  });

  // validateSupabaseEnv Tests
  describe("validateSupabaseEnv", () => {
    it("gibt valid zurück für korrektes Env", () => {
      const env = {
        url: "https://example.supabase.co",
        serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(true);
    });

    it("gibt Fehler zurück wenn URL fehlt", () => {
      const env = {
        serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Missing Supabase URL");
    });

    it("gibt Fehler zurück wenn URL ungültig", () => {
      const env = {
        url: "http://invalid.com",
        serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid Supabase URL");
    });

    it("gibt Fehler zurück wenn serviceRoleKey fehlt", () => {
      const env = {
        url: "https://example.supabase.co",
      };
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Missing service role key");
    });

    it("gibt Fehler zurück wenn serviceRoleKey ungültig", () => {
      const env = {
        url: "https://example.supabase.co",
        serviceRoleKey: "invalidkey",
      };
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("Invalid service role key");
    });

    it("gibt Fehler zurück wenn beide fehlerhaft", () => {
      const env = {};
      const result = validateSupabaseEnv(env);
      expect(result.isValid).toBe(false);
    });
  });

  // getSupabaseClientConfig Tests
  describe("getSupabaseClientConfig", () => {
    it("gibt Config mit persistSession false zurück", () => {
      const config = getSupabaseClientConfig();
      expect(config.auth.persistSession).toBe(false);
    });

    it("gibt Config mit autoRefreshToken false zurück", () => {
      const config = getSupabaseClientConfig();
      expect(config.auth.autoRefreshToken).toBe(false);
    });

    it("gibt Config mit auth Objekt zurück", () => {
      const config = getSupabaseClientConfig();
      expect(config.auth).toBeDefined();
    });

    it("gibt korrekte Config Struktur zurück", () => {
      const config = getSupabaseClientConfig();
      expect(config).toHaveProperty("auth");
      expect(config.auth).toHaveProperty("persistSession");
      expect(config.auth).toHaveProperty("autoRefreshToken");
    });

    it("gibt immer die gleiche Config zurück", () => {
      const config1 = getSupabaseClientConfig();
      const config2 = getSupabaseClientConfig();
      expect(config1).toEqual(config2);
    });
  });

  // mergeSupabaseConfig Tests
  describe("mergeSupabaseConfig", () => {
    it("gibt Base Config zurück wenn keine Overrides", () => {
      const baseConfig = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      const result = mergeSupabaseConfig(baseConfig);
      expect(result).toEqual(baseConfig);
    });

    it("merged Overrides mit Base Config", () => {
      const baseConfig = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      const overrides = {
        auth: { persistSession: true },
      } as any;
      const result = mergeSupabaseConfig(baseConfig, overrides);
      expect(result.auth.persistSession).toBe(true);
      expect(result.auth.autoRefreshToken).toBe(false);
    });

    it("kann autoRefreshToken überschreiben", () => {
      const baseConfig = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      const overrides = {
        auth: { autoRefreshToken: true },
      } as any;
      const result = mergeSupabaseConfig(baseConfig, overrides);
      expect(result.auth.autoRefreshToken).toBe(true);
    });

    it("gibt Fehler bei undefined baseConfig", () => {
      expect(() => mergeSupabaseConfig(undefined as any)).not.toThrow();
    });

    it("merged komplette Overrides", () => {
      const baseConfig = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      const overrides = {
        auth: { persistSession: true, autoRefreshToken: true },
      };
      const result = mergeSupabaseConfig(baseConfig, overrides);
      expect(result.auth.persistSession).toBe(true);
      expect(result.auth.autoRefreshToken).toBe(true);
    });

    it("behält Base Config wenn leere Overrides", () => {
      const baseConfig = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      const result = mergeSupabaseConfig(baseConfig, {});
      expect(result.auth.persistSession).toBe(false);
      expect(result.auth.autoRefreshToken).toBe(false);
    });
  });

  // isSupabaseConfigValid Tests
  describe("isSupabaseConfigValid", () => {
    it("gibt true zurück für valide Config", () => {
      const config = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      expect(isSupabaseConfigValid(config)).toBe(true);
    });

    it("gibt false zurück für Config ohne auth", () => {
      const config = {} as any;
      expect(isSupabaseConfigValid(config)).toBe(false);
    });

    it("gibt false zurück für Config mit undefined auth", () => {
      const config = { auth: undefined } as any;
      expect(isSupabaseConfigValid(config)).toBe(false);
    });

    it("gibt false zurück wenn persistSession nicht boolean", () => {
      const config = {
        auth: { persistSession: "false", autoRefreshToken: false },
      } as any;
      expect(isSupabaseConfigValid(config)).toBe(false);
    });

    it("gibt false zurück wenn autoRefreshToken nicht boolean", () => {
      const config = {
        auth: { persistSession: false, autoRefreshToken: "false" },
      } as any;
      expect(isSupabaseConfigValid(config)).toBe(false);
    });

    it("gibt true zurück mit beide true", () => {
      const config = {
        auth: { persistSession: true, autoRefreshToken: true },
      };
      expect(isSupabaseConfigValid(config)).toBe(true);
    });

    it("gibt true zurück mit beide false", () => {
      const config = {
        auth: { persistSession: false, autoRefreshToken: false },
      };
      expect(isSupabaseConfigValid(config)).toBe(true);
    });
  });

  // extractSupabaseUrl Tests
  describe("extractSupabaseUrl", () => {
    it("extrahiert URL aus Connection String", () => {
      const connectionString =
        "db connection https://example.supabase.co with more text";
      const result = extractSupabaseUrl(connectionString);
      expect(result).toBe("https://example.supabase.co");
    });

    it("gibt null zurück wenn keine valide URL im String", () => {
      const connectionString = "postgresql://user@example.com:5432/db";
      const result = extractSupabaseUrl(connectionString);
      expect(result).toBeNull();
    });

    it("extrahiert nur https URL", () => {
      const connectionString =
        "https://example.supabase.co/rest/v1/table?select=*";
      const result = extractSupabaseUrl(connectionString);
      expect(result).toContain("supabase.co");
    });

    it("gibt null zurück für leeren String", () => {
      const result = extractSupabaseUrl("");
      expect(result).toBeNull();
    });

    it("extrahiert URL mit Projekt Namen", () => {
      const connectionString =
        "some text https://my-project-123.supabase.co more text";
      const result = extractSupabaseUrl(connectionString);
      expect(result).toBe("https://my-project-123.supabase.co");
    });
  });

  // validateTableName Tests
  describe("validateTableName", () => {
    it("gibt true zurück für validen Table Namen", () => {
      expect(validateTableName("users")).toBe(true);
    });

    it("gibt true zurück für Table mit Underscores", () => {
      expect(validateTableName("user_profiles")).toBe(true);
    });

    it("gibt true zurück für Table mit Zahlen", () => {
      expect(validateTableName("users_table_123")).toBe(true);
    });

    it("gibt false zurück für Table mit Bindestrichen", () => {
      expect(validateTableName("user-profiles")).toBe(false);
    });

    it("gibt false zurück für Table mit Spaces", () => {
      expect(validateTableName("user profiles")).toBe(false);
    });

    it("gibt false zurück für Table mit Sonderzeichen", () => {
      expect(validateTableName("user@profiles")).toBe(false);
    });

    it("gibt false zurück für null", () => {
      expect(validateTableName(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(validateTableName(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(validateTableName("")).toBe(false);
    });

    it("gibt false zurück wenn mit Zahl startet", () => {
      expect(validateTableName("123users")).toBe(false);
    });

    it("gibt true zurück wenn mit Underscore startet", () => {
      expect(validateTableName("_users")).toBe(true);
    });
  });

  // validateColumnName Tests
  describe("validateColumnName", () => {
    it("gibt true zurück für validen Column Namen", () => {
      expect(validateColumnName("id")).toBe(true);
    });

    it("gibt true zurück für Column mit Underscores", () => {
      expect(validateColumnName("user_id")).toBe(true);
    });

    it("gibt true zurück für Column mit Zahlen", () => {
      expect(validateColumnName("user_id_123")).toBe(true);
    });

    it("gibt false zurück für Column mit Bindestrichen", () => {
      expect(validateColumnName("user-id")).toBe(false);
    });

    it("gibt false zurück für Column mit Spaces", () => {
      expect(validateColumnName("user id")).toBe(false);
    });

    it("gibt false zurück für null", () => {
      expect(validateColumnName(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(validateColumnName(undefined)).toBe(false);
    });

    it("gibt false zurück wenn mit Zahl startet", () => {
      expect(validateColumnName("123user_id")).toBe(false);
    });

    it("gibt true zurück wenn mit Underscore startet", () => {
      expect(validateColumnName("_internal")).toBe(true);
    });
  });

  // isValidQueryOperation Tests
  describe("isValidQueryOperation", () => {
    it("gibt true zurück für 'select'", () => {
      expect(isValidQueryOperation("select")).toBe(true);
    });

    it("gibt true zurück für 'insert'", () => {
      expect(isValidQueryOperation("insert")).toBe(true);
    });

    it("gibt true zurück für 'update'", () => {
      expect(isValidQueryOperation("update")).toBe(true);
    });

    it("gibt true zurück für 'delete'", () => {
      expect(isValidQueryOperation("delete")).toBe(true);
    });

    it("gibt false zurück für ungültige Operation", () => {
      expect(isValidQueryOperation("create")).toBe(false);
    });

    it("gibt false zurück für null", () => {
      expect(isValidQueryOperation(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidQueryOperation(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidQueryOperation("")).toBe(false);
    });

    it("gibt false zurück für großgeschriebene Operation", () => {
      expect(isValidQueryOperation("SELECT")).toBe(false);
    });

    it("gibt false zurück für nicht-String Wert", () => {
      expect(isValidQueryOperation(123 as any)).toBe(false);
    });
  });

  // checkConnectionHealth Tests
  describe("checkConnectionHealth", () => {
    it("gibt healthy zurück bei validen Parametern", () => {
      const result = checkConnectionHealth(
        "https://example.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      );
      expect(result.isHealthy).toBe(true);
      expect(result.message).toContain("valid");
    });

    it("gibt unhealthy zurück bei invalider URL", () => {
      const result = checkConnectionHealth(
        "http://invalid.com",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      );
      expect(result.isHealthy).toBe(false);
      expect(result.message).toContain("URL");
    });

    it("gibt unhealthy zurück bei invalider Key", () => {
      const result = checkConnectionHealth(
        "https://example.supabase.co",
        "invalidkey"
      );
      expect(result.isHealthy).toBe(false);
      expect(result.message).toContain("role key");
    });

    it("gibt unhealthy zurück bei null URL", () => {
      const result = checkConnectionHealth(
        null,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      );
      expect(result.isHealthy).toBe(false);
    });

    it("gibt unhealthy zurück bei null Key", () => {
      const result = checkConnectionHealth(
        "https://example.supabase.co",
        null
      );
      expect(result.isHealthy).toBe(false);
    });

    it("gibt aussagekräftige Error Message bei URL Fehler", () => {
      const result = checkConnectionHealth("invalid", "eyJ");
      expect(result.message).toContain("Invalid");
    });

    it("gibt aussagekräftige Error Message bei Key Fehler", () => {
      const result = checkConnectionHealth(
        "https://example.supabase.co",
        "short"
      );
      expect(result.message).toContain("Invalid");
    });

    it("gibt Success Message bei validen Parametern", () => {
      const result = checkConnectionHealth(
        "https://example.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      );
      expect(result.message).toContain("valid");
    });
  });

  // Integration Tests
  describe("Database Utils Integration", () => {
    it("validiert komplettes Env Setup", () => {
      const env = {
        url: "https://example.supabase.co",
        serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      const validation = validateSupabaseEnv(env);
      expect(validation.isValid).toBe(true);

      const health = checkConnectionHealth(env.url, env.serviceRoleKey);
      expect(health.isHealthy).toBe(true);
    });

    it("validiert Config und erstellt Client Config", () => {
      const config = getSupabaseClientConfig();
      expect(isSupabaseConfigValid(config)).toBe(true);

      const merged = mergeSupabaseConfig(config);
      expect(merged).toEqual(config);
    });

    it("validiert Table und Column Namen zusammen", () => {
      const tableName = "user_profiles";
      const columnName = "user_id";

      expect(validateTableName(tableName)).toBe(true);
      expect(validateColumnName(columnName)).toBe(true);
    });

    it("validiert Query mit Operation und Table", () => {
      const operation = "select";
      const table = "users";

      expect(isValidQueryOperation(operation)).toBe(true);
      expect(validateTableName(table)).toBe(true);
    });

    it("verarbeitet vollständiges DB Validierungs Szenario", () => {
      // Setup
      const connectionParams = {
        url: "https://my-project.supabase.co",
        serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      const table = "organizations";
      const operation = "select";

      // Validate
      const envValid = validateSupabaseEnv(connectionParams);
      expect(envValid.isValid).toBe(true);

      const tableValid = validateTableName(table);
      expect(tableValid).toBe(true);

      const operationValid = isValidQueryOperation(operation);
      expect(operationValid).toBe(true);

      const health = checkConnectionHealth(
        connectionParams.url,
        connectionParams.serviceRoleKey
      );
      expect(health.isHealthy).toBe(true);
    });
  });
});
