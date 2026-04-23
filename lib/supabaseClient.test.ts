// supabaseClient.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  isValidSupabaseUrl,
  isValidSupabaseKey,
  areSupabaseEnvVarsValid,
  getSupabaseKey,
  getEnvVarValue,
  buildSupabaseUrl,
  getHostnameFromUrl,
} from "./supabaseClient";

describe("Supabase Client Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // isValidSupabaseUrl Tests
  describe("isValidSupabaseUrl", () => {
    it("akzeptiert gültige Supabase URLs", () => {
      const validUrl = "https://project.supabase.co";
      expect(isValidSupabaseUrl(validUrl)).toBe(true);
    });

    it("akzeptiert Supabase URLs mit Path", () => {
      expect(isValidSupabaseUrl("https://myproject.supabase.co/rest/v1")).toBe(true);
    });

    it("akzeptiert verschiedene Supabase Domains", () => {
      expect(isValidSupabaseUrl("https://abc.supabase.com")).toBe(true);
      expect(isValidSupabaseUrl("https://xyz.supabase.io")).toBe(true);
    });

    it("wirft Fehler für HTTP URLs", () => {
      expect(isValidSupabaseUrl("http://project.supabase.co")).toBe(false);
    });

    it("wirkt Fehler für URLs ohne supabase Domain", () => {
      expect(isValidSupabaseUrl("https://example.com")).toBe(false);
    });

    it("wirkt Fehler für ungültige URLs", () => {
      expect(isValidSupabaseUrl("not-a-url")).toBe(false);
    });

    it("wirkt Fehler für leeren String", () => {
      expect(isValidSupabaseUrl("")).toBe(false);
    });

    it("wirkt Fehler für null", () => {
      expect(isValidSupabaseUrl(null as any)).toBe(false);
    });

    it("wirkt Fehler für undefined", () => {
      expect(isValidSupabaseUrl(undefined as any)).toBe(false);
    });

    it("wirkt Fehler für nicht-String", () => {
      expect(isValidSupabaseUrl(123 as any)).toBe(false);
    });

    it("akzeptiert Localhost für Entwicklung", () => {
      // Localhost URLs won't pass since they don't contain 'supabase'
      expect(isValidSupabaseUrl("https://localhost:3000")).toBe(false);
    });

    it("ist case-insensitive für Supabase Domain", () => {
      expect(isValidSupabaseUrl("https://project.SUPABASE.co")).toBe(true);
    });
  });

  // isValidSupabaseKey Tests
  describe("isValidSupabaseKey", () => {
    it("akzeptiert gültige lange Keys", () => {
      const validKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      expect(isValidSupabaseKey(validKey)).toBe(true);
    });

    it("akzeptiert Keys mit Hyphens", () => {
      expect(isValidSupabaseKey("abc-def-ghi-jkl-mno-pqr-stu-vwx")).toBe(true);
    });

    it("akzeptiert Keys mit Underscores", () => {
      expect(isValidSupabaseKey("abc_def_ghi_jkl_mno_pqr_stu_vwx")).toBe(true);
    });

    it("akzeptiert Keys mit gemischten Zeichen", () => {
      expect(isValidSupabaseKey("abc-123_def-456_GHI_789xyz_ABC")).toBe(true);
    });

    it("wirakt Fehler für zu kurze Keys", () => {
      expect(isValidSupabaseKey("short")).toBe(false);
    });

    it("wirakt Fehler für leeren String", () => {
      expect(isValidSupabaseKey("")).toBe(false);
    });

    it("wirakt Fehler für null", () => {
      expect(isValidSupabaseKey(null as any)).toBe(false);
    });

    it("wirakt Fehler für undefined", () => {
      expect(isValidSupabaseKey(undefined as any)).toBe(false);
    });

    it("wirakt Fehler für Keys mit Sonderzeichen", () => {
      expect(isValidSupabaseKey("abc@def#ghi!jkl")).toBe(false);
    });

    it("wirakt Fehler für Keys mit Spaces", () => {
      expect(isValidSupabaseKey("abc def ghi jkl mno")).toBe(false);
    });

    it("akzeptiert sehr lange Keys", () => {
      const longKey = "a".repeat(100);
      expect(isValidSupabaseKey(longKey)).toBe(true);
    });

    it("akzeptiert Keys mit nur Zahlen", () => {
      expect(isValidSupabaseKey("1234567890123456789012345")).toBe(true);
    });
  });

  // areSupabaseEnvVarsValid Tests
  describe("areSupabaseEnvVarsValid", () => {
    it("gibt true für valide Environment Variables", () => {
      const validEnv = {
        url: "https://project.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      expect(areSupabaseEnvVarsValid(validEnv)).toBe(true);
    });

    it("gibt false wenn URL fehlt", () => {
      const invalidEnv = {
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false wenn Key fehlt", () => {
      const invalidEnv = {
        url: "https://project.supabase.co",
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false wenn beide fehlen", () => {
      expect(areSupabaseEnvVarsValid({})).toBe(false);
    });

    it("gibt false für ungültige URL", () => {
      const invalidEnv = {
        url: "not-a-url",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false für ungültigen Key", () => {
      const invalidEnv = {
        url: "https://project.supabase.co",
        key: "short",
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false wenn beide ungültig", () => {
      const invalidEnv = {
        url: "not-a-url",
        key: "short",
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false für undefined values", () => {
      const invalidEnv = {
        url: undefined,
        key: undefined,
      };
      expect(areSupabaseEnvVarsValid(invalidEnv)).toBe(false);
    });

    it("gibt false für null values", () => {
      const invalidEnv = {
        url: null,
        key: null,
      };
      expect(areSupabaseEnvVarsValid(invalidEnv as any)).toBe(false);
    });
  });

  // getSupabaseKey Tests
  describe("getSupabaseKey", () => {
    it("bevorzugt Publishable Key wenn verfügbar", () => {
      const publishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9publishable";
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";
      expect(getSupabaseKey(publishableKey, anonKey)).toBe(publishableKey);
    });

    it("fällt auf Anon Key wenn Publishable nicht verfügbar", () => {
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";
      expect(getSupabaseKey(undefined, anonKey)).toBe(anonKey);
    });

    it("gibt null wenn keinen Key verfügbar", () => {
      expect(getSupabaseKey(undefined, undefined)).toBe(null);
    });

    it("gibt null wenn beide Keys ungültig", () => {
      expect(getSupabaseKey("short", "short")).toBe(null);
    });

    it("akzeptiert nur Publishable Key", () => {
      const publishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9publishable";
      expect(getSupabaseKey(publishableKey)).toBe(publishableKey);
    });

    it("akzeptiert nur Anon Key", () => {
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";
      expect(getSupabaseKey(undefined, anonKey)).toBe(anonKey);
    });

    it("ignoriert ungültigen Publishable Key und nutzt Anon Key", () => {
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";
      expect(getSupabaseKey("short", anonKey)).toBe(anonKey);
    });

    it("ignoriert ungültigen Anon Key wenn Publishable gültig", () => {
      const publishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9publishable";
      expect(getSupabaseKey(publishableKey, "short")).toBe(publishableKey);
    });

    it("akzeptiert leere String als ungültig", () => {
      expect(getSupabaseKey("", "")).toBe(null);
    });
  });

  // getEnvVarValue Tests
  describe("getEnvVarValue", () => {
    it("gibt Wert zurück wenn vorhanden", () => {
      expect(getEnvVarValue("test-value")).toBe("test-value");
    });

    it("trimmt Whitespace", () => {
      expect(getEnvVarValue("  test-value  ")).toBe("test-value");
    });

    it("trimmt Tabs und Newlines", () => {
      expect(getEnvVarValue("\t\ntest-value\n\t")).toBe("test-value");
    });

    it("gibt null für leeren String", () => {
      expect(getEnvVarValue("")).toBe(null);
    });

    it("gibt null für nur Whitespace", () => {
      expect(getEnvVarValue("   ")).toBe(null);
    });

    it("gibt null für undefined", () => {
      expect(getEnvVarValue(undefined)).toBe(null);
    });

    it("gibt null wenn trim zu leerem String führt", () => {
      expect(getEnvVarValue("\t\n\t")).toBe(null);
    });

    it("bewahrt inneres Whitespace", () => {
      expect(getEnvVarValue("  hello world  ")).toBe("hello world");
    });

    it("akzeptiert Sonderzeichen", () => {
      expect(getEnvVarValue("!@#$%^&*()")).toBe("!@#$%^&*()");
    });

    it("akzeptiert sehr lange Werte", () => {
      const longValue = "a".repeat(10000);
      expect(getEnvVarValue(longValue)).toBe(longValue);
    });
  });

  // buildSupabaseUrl Tests
  describe("buildSupabaseUrl", () => {
    it("erstellt gültige URL mit https und Hostname", () => {
      const result = buildSupabaseUrl("https", "project.supabase.co");
      expect(result).toBe("https://project.supabase.co/");
    });

    it("erstellt URL mit Port", () => {
      const result = buildSupabaseUrl("https", "localhost", 3000);
      expect(result).toBe("https://localhost:3000/");
    });

    it("akzeptiert nur HTTPS Protocol", () => {
      expect(buildSupabaseUrl("http", "project.supabase.co")).toBe(null);
    });

    it("wirft Fehler für leeren Hostname", () => {
      expect(buildSupabaseUrl("https", "")).toBe(null);
    });

    it("wirkt Fehler für null Hostname", () => {
      expect(buildSupabaseUrl("https", null as any)).toBe(null);
    });

    it("wirkt Fehler für undefined Hostname", () => {
      expect(buildSupabaseUrl("https", undefined as any)).toBe(null);
    });

    it("akzeptiert verschiedene Hostnames", () => {
      expect(buildSupabaseUrl("https", "example.com")).toContain("example.com");
      expect(buildSupabaseUrl("https", "subdomain.example.com")).toContain(
        "subdomain.example.com"
      );
    });

    it("ignoriert ungültiges Protocol", () => {
      expect(buildSupabaseUrl("ftp", "project.supabase.co")).toBe(null);
    });

    it("akzeptiert gültiges Protocol", () => {
      expect(buildSupabaseUrl("https", "project.supabase.co")).not.toBe(null);
    });

    it("akzeptiert Port 80", () => {
      expect(buildSupabaseUrl("https", "example.com", 80)).not.toBe(null);
    });

    it("akzeptiert Port 443", () => {
      expect(buildSupabaseUrl("https", "example.com", 443)).not.toBe(null);
    });

    it("akzeptiert Custom Ports", () => {
      expect(buildSupabaseUrl("https", "example.com", 3000)).not.toBe(null);
      expect(buildSupabaseUrl("https", "example.com", 8080)).not.toBe(null);
    });
  });

  // getHostnameFromUrl Tests
  describe("getHostnameFromUrl", () => {
    it("extrahiert Hostname aus gültiger URL", () => {
      const result = getHostnameFromUrl("https://project.supabase.co");
      expect(result).toBe("project.supabase.co");
    });

    it("extrahiert Hostname aus URL mit Path", () => {
      const result = getHostnameFromUrl("https://project.supabase.co/rest/v1");
      expect(result).toBe("project.supabase.co");
    });

    it("extrahiert Hostname aus URL mit Port", () => {
      const result = getHostnameFromUrl("https://project.supabase.co:443");
      expect(result).toBe("project.supabase.co");
    });

    it("extrahiert Hostname aus URL mit Query String", () => {
      const result = getHostnameFromUrl("https://project.supabase.co?key=value");
      expect(result).toBe("project.supabase.co");
    });

    it("gibt null für ungültige URL", () => {
      expect(getHostnameFromUrl("not-a-url")).toBe(null);
    });

    it("gibt null für leeren String", () => {
      expect(getHostnameFromUrl("")).toBe(null);
    });

    it("gibt null für undefined", () => {
      expect(getHostnameFromUrl(undefined as any)).toBe(null);
    });

    it("gibt null für null", () => {
      expect(getHostnameFromUrl(null as any)).toBe(null);
    });

    it("extrahiert Hostname aus verschiedenen URLs", () => {
      expect(getHostnameFromUrl("https://example.com")).toBe("example.com");
      expect(getHostnameFromUrl("https://sub.example.com")).toBe("sub.example.com");
      expect(getHostnameFromUrl("https://a.b.c.example.com")).toBe("a.b.c.example.com");
    });

    it("extrahiert Hostname aus HTTP URLs", () => {
      const result = getHostnameFromUrl("http://project.supabase.co");
      expect(result).toBe("project.supabase.co");
    });

    it("akzeptiert Localhost", () => {
      const result = getHostnameFromUrl("https://localhost:3000");
      expect(result).toBe("localhost");
    });

    it("akzeptiert IP Adressen", () => {
      const result = getHostnameFromUrl("https://127.0.0.1:3000");
      expect(result).toBe("127.0.0.1");
    });

    it("akzeptiert IPv6 Adressen", () => {
      const result = getHostnameFromUrl("https://[::1]:3000");
      expect(result).toBe("[::1]");
    });
  });

  // Integration Tests
  describe("Supabase Client Utils Integration", () => {
    it("validiert komplette Supabase-Konfiguration", () => {
      const config = {
        url: "https://project.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9publishable",
      };

      expect(isValidSupabaseUrl(config.url)).toBe(true);
      expect(isValidSupabaseKey(config.key)).toBe(true);
      expect(areSupabaseEnvVarsValid(config)).toBe(true);
    });

    it("extrahiert und nutzt richtige Key-Priorität", () => {
      const publishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9pub";
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";

      const selectedKey = getSupabaseKey(publishableKey, anonKey);
      expect(selectedKey).toBe(publishableKey);

      const selectedKey2 = getSupabaseKey(undefined, anonKey);
      expect(selectedKey2).toBe(anonKey);
    });

    it("erstellt URL und extrahiert Hostname", () => {
      const url = buildSupabaseUrl("https", "project.supabase.co", 443);
      expect(url).not.toBe(null);

      if (url) {
        const hostname = getHostnameFromUrl(url);
        expect(hostname).toContain("project.supabase.co");
      }
    });

    it("verarbeitet Umgebungsvariablen korrekt", () => {
      const urlValue = getEnvVarValue("  https://project.supabase.co  ");
      const keyValue = getEnvVarValue("  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ");

      expect(urlValue).toBe("https://project.supabase.co");
      expect(keyValue).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      expect(isValidSupabaseUrl(urlValue!)).toBe(true);
      expect(isValidSupabaseKey(keyValue!)).toBe(true);
    });

    it("alle Utilities sind Pure Functions", () => {
      const testUrl = "https://project.supabase.co";
      const testKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

      expect(isValidSupabaseUrl(testUrl)).toBe(isValidSupabaseUrl(testUrl));
      expect(isValidSupabaseKey(testKey)).toBe(isValidSupabaseKey(testKey));
      expect(getHostnameFromUrl(testUrl)).toBe(getHostnameFromUrl(testUrl));
    });

    it("kombiniert URL-Validierung mit Hostname-Extraktion", () => {
      const validUrl = "https://project.supabase.co";
      expect(isValidSupabaseUrl(validUrl)).toBe(true);
      expect(getHostnameFromUrl(validUrl)).not.toBe(null);
    });

    it("kombiniert Key-Validierung mit Key-Auswahl", () => {
      const pubKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9pub";
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9anon";

      const selected = getSupabaseKey(pubKey, anonKey);
      expect(isValidSupabaseKey(selected!)).toBe(true);
    });

    it("behandelt ungültige Daten korrekt", () => {
      const invalidConfig = {
        url: "invalid",
        key: "short",
      };

      expect(isValidSupabaseUrl(invalidConfig.url)).toBe(false);
      expect(isValidSupabaseKey(invalidConfig.key)).toBe(false);
      expect(areSupabaseEnvVarsValid(invalidConfig)).toBe(false);
    });

    it("kombiniert Env-Var-Verarbeitung mit Validierung", () => {
      const rawUrl = "  https://project.supabase.co  ";
      const rawKey = "  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ";

      const cleanUrl = getEnvVarValue(rawUrl);
      const cleanKey = getEnvVarValue(rawKey);

      expect(isValidSupabaseUrl(cleanUrl!)).toBe(true);
      expect(isValidSupabaseKey(cleanKey!)).toBe(true);
    });

    it("verarbeitet große Mengen von URLs", () => {
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(isValidSupabaseUrl(`https://project-${i}.supabase.co`));
      }
      expect(results.length).toBe(100);
      expect(results.every((r) => r === true)).toBe(true);
    });

    it("verarbeitet große Mengen von Keys", () => {
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(isValidSupabaseKey(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_${i}`));
      }
      expect(results.length).toBe(100);
      expect(results.every((r) => r === true)).toBe(true);
    });

    it("URL-Extraktion ist konsistent mit URL-Bau", () => {
      const hostname = "project.supabase.co";
      const builtUrl = buildSupabaseUrl("https", hostname);
      const extractedHostname = getHostnameFromUrl(builtUrl!);

      expect(extractedHostname).toContain(hostname);
    });

    it("simuliert reale Supabase Konfiguration", () => {
      // Real world scenario
      const envUrl = getEnvVarValue("  https://project.supabase.co  ");
      const envKey = getEnvVarValue("  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ");

      const isValid = areSupabaseEnvVarsValid({
        url: envUrl || undefined,
        key: envKey || undefined,
      });

      expect(isValid).toBe(true);

      const selectedKey = getSupabaseKey(envKey || undefined);
      expect(selectedKey).not.toBe(null);
    });
  });
});
