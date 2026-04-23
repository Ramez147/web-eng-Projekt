// auth.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  isValidApiKeyFormat,
  validateApiKeyHeader,
  validateOrganizationMatch,
  validateApiKeyResponse,
  extractPointsRatio,
} from "./auth-utils";

describe("Auth Utilities", () => {
  beforeEach(() => {
    // Cleanup vor jedem Test
  });

  // isValidApiKeyFormat Tests
  describe("isValidApiKeyFormat", () => {
    it("gibt true zurück für validen API Key", () => {
      expect(isValidApiKeyFormat("valid-api-key-123")).toBe(true);
    });

    it("gibt true zurück für langen API Key", () => {
      expect(isValidApiKeyFormat("a".repeat(100))).toBe(true);
    });

    it("gibt false zurück für null", () => {
      expect(isValidApiKeyFormat(null)).toBe(false);
    });

    it("gibt false zurück für undefined", () => {
      expect(isValidApiKeyFormat(undefined)).toBe(false);
    });

    it("gibt false zurück für leeren String", () => {
      expect(isValidApiKeyFormat("")).toBe(false);
    });

    it("gibt false zurück für nicht-String Wert", () => {
      expect(isValidApiKeyFormat(123 as any)).toBe(false);
    });

    it("gibt false zurück für Object", () => {
      expect(isValidApiKeyFormat({} as any)).toBe(false);
    });

    it("gibt false zurück für Array", () => {
      expect(isValidApiKeyFormat([] as any)).toBe(false);
    });

    it("gibt true zurück für API Key mit Sonderzeichen", () => {
      expect(isValidApiKeyFormat("api_key-123.456")).toBe(true);
    });

    it("gibt true zurück für API Key mit Bindestrichen", () => {
      expect(isValidApiKeyFormat("sk-1234567890abcdef")).toBe(true);
    });

    it("gibt true zurück für API Key mit Unterstrichen", () => {
      expect(isValidApiKeyFormat("API_KEY_123_ABC")).toBe(true);
    });

    it("gibt true zurück für API Key mit Zahlen", () => {
      expect(isValidApiKeyFormat("123456789")).toBe(true);
    });

    it("gibt false zurück für Whitespace nur", () => {
      expect(isValidApiKeyFormat("   ")).toBe(true); // String ist nicht leer
    });
  });

  // validateApiKeyHeader Tests
  describe("validateApiKeyHeader", () => {
    it("gibt API Key zurück wenn vorhanden", () => {
      const headers = { "x-api-key": "test-key-123" };
      expect(validateApiKeyHeader(headers)).toBe("test-key-123");
    });

    it("wirft Fehler wenn x-api-key fehlt", () => {
      const headers = {};
      expect(() => validateApiKeyHeader(headers)).toThrow(
        "Missing x-api-key header"
      );
    });

    it("wirft Fehler wenn x-api-key null ist", () => {
      const headers = { "x-api-key": null };
      expect(() => validateApiKeyHeader(headers)).toThrow(
        "Missing x-api-key header"
      );
    });

    it("wirft Fehler wenn x-api-key leer ist", () => {
      const headers = { "x-api-key": "" };
      expect(() => validateApiKeyHeader(headers)).toThrow(
        "Invalid x-api-key format"
      );
    });

    it("gibt API Key mit Bindestrichen zurück", () => {
      const headers = { "x-api-key": "sk-1234-5678" };
      expect(validateApiKeyHeader(headers)).toBe("sk-1234-5678");
    });

    it("gibt API Key mit Unterstrichen zurück", () => {
      const headers = { "x-api-key": "API_KEY_XYZ" };
      expect(validateApiKeyHeader(headers)).toBe("API_KEY_XYZ");
    });

    it("gibt lange API Keys zurück", () => {
      const longKey = "a".repeat(256);
      const headers = { "x-api-key": longKey };
      expect(validateApiKeyHeader(headers)).toBe(longKey);
    });

    it("gibt API Key mit Zahlen zurück", () => {
      const headers = { "x-api-key": "key123456789" };
      expect(validateApiKeyHeader(headers)).toBe("key123456789");
    });

    it("wirft Fehler mit aussagekräftiger Nachricht bei fehlendem Header", () => {
      const headers = {};
      expect(() => validateApiKeyHeader(headers)).toThrow();
    });

    it("akzeptiert nur x-api-key Header", () => {
      const headers = { "api-key": "test-key" };
      expect(() => validateApiKeyHeader(headers)).toThrow(
        "Missing x-api-key header"
      );
    });
  });

  // validateOrganizationMatch Tests
  describe("validateOrganizationMatch", () => {
    it("gibt true zurück wenn IDs gleich sind", () => {
      expect(validateOrganizationMatch("org-123", "org-123")).toBe(true);
    });

    it("gibt false zurück wenn IDs unterschiedlich sind", () => {
      expect(validateOrganizationMatch("org-123", "org-456")).toBe(false);
    });

    it("gibt false zurück bei leeren IDs", () => {
      expect(validateOrganizationMatch("", "")).toBe(true);
    });

    it("gibt false zurück bei unterschiedlicher Länge", () => {
      expect(validateOrganizationMatch("org-123", "org-123-extra")).toBe(
        false
      );
    });

    it("ist case-sensitive", () => {
      expect(validateOrganizationMatch("ORG-123", "org-123")).toBe(false);
    });

    it("gibt true zurück bei UUID Format", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(validateOrganizationMatch(uuid, uuid)).toBe(true);
    });

    it("gibt true zurück bei numerischen IDs", () => {
      expect(validateOrganizationMatch("12345", "12345")).toBe(true);
    });

    it("gibt false zurück bei numerischen unterschiedlichen IDs", () => {
      expect(validateOrganizationMatch("12345", "54321")).toBe(false);
    });

    it("gibt true zurück bei Sonderzeichen wenn gleich", () => {
      expect(validateOrganizationMatch("org_123-abc", "org_123-abc")).toBe(
        true
      );
    });

    it("vergleicht exakte Strings", () => {
      expect(validateOrganizationMatch("org 123", "org 123")).toBe(true);
    });
  });

  // validateApiKeyResponse Tests
  describe("validateApiKeyResponse", () => {
    it("gibt gültiges Ergebnis zurück für korrekten Response", () => {
      const data = { id: "org-123", name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("gibt Fehler zurück wenn data null ist", () => {
      const result = validateApiKeyResponse(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("API key not found");
    });

    it("gibt Fehler zurück wenn data undefined ist", () => {
      const result = validateApiKeyResponse(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("API key not found");
    });

    it("gibt Fehler zurück wenn id fehlt", () => {
      const data = { name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid organization data");
    });

    it("gibt Fehler zurück wenn name fehlt", () => {
      const data = { id: "org-123", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("Invalid organization data");
    });

    it("gibt Fehler zurück wenn beide id und name fehlen", () => {
      const data = { points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("akzeptiert leere id nicht", () => {
      const data = { id: "", name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("akzeptiert leeren name nicht", () => {
      const data = { id: "org-123", name: "", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("akzeptiert null id nicht", () => {
      const data = { id: null, name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("akzeptiert null name nicht", () => {
      const data = { id: "org-123", name: null, points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("akzeptiert undefined id nicht", () => {
      const data = { id: undefined, name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(false);
    });

    it("gibt gültiges Ergebnis zurück mit extra Feldern", () => {
      const data = {
        id: "org-123",
        name: "Test Org",
        points_ratio: 1,
        extra_field: "extra",
      };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(true);
    });

    it("gibt gültiges Ergebnis zurück mit UUID als id", () => {
      const data = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Test Org",
        points_ratio: 1,
      };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(true);
    });

    it("gibt gültiges Ergebnis zurück mit numerischer id", () => {
      const data = { id: "12345", name: "Test Org", points_ratio: 1 };
      const result = validateApiKeyResponse(data);
      expect(result.isValid).toBe(true);
    });
  });

  // extractPointsRatio Tests
  describe("extractPointsRatio", () => {
    it("gibt points_ratio zurück wenn vorhanden", () => {
      const data = { points_ratio: 2.5 };
      expect(extractPointsRatio(data)).toBe(2.5);
    });

    it("gibt 1 zurück als Standard wenn points_ratio fehlt", () => {
      const data = { id: "org-123" };
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt 1 zurück wenn data null ist", () => {
      expect(extractPointsRatio(null)).toBe(1);
    });

    it("gibt 1 zurück wenn data undefined ist", () => {
      expect(extractPointsRatio(undefined)).toBe(1);
    });

    it("gibt 0 zurück wenn points_ratio 0 ist", () => {
      const data = { points_ratio: 0 };
      expect(extractPointsRatio(data)).toBe(0);
    });

    it("gibt negative Werte zurück wenn vorhanden", () => {
      const data = { points_ratio: -1.5 };
      expect(extractPointsRatio(data)).toBe(-1.5);
    });

    it("gibt große Dezimalzahlen zurück", () => {
      const data = { points_ratio: 999.99 };
      expect(extractPointsRatio(data)).toBe(999.99);
    });

    it("gibt kleine Dezimalzahlen zurück", () => {
      const data = { points_ratio: 0.001 };
      expect(extractPointsRatio(data)).toBe(0.001);
    });

    it("gibt 1 zurück wenn points_ratio kein Number ist", () => {
      const data = { points_ratio: "2.5" };
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt 1 zurück wenn points_ratio ein String ist", () => {
      const data = { points_ratio: "invalid" };
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt 1 zurück wenn points_ratio null ist", () => {
      const data = { points_ratio: null };
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt points_ratio mit langen Dezimalzahlen zurück", () => {
      const data = { points_ratio: 1.23456789 };
      expect(extractPointsRatio(data)).toBe(1.23456789);
    });

    it("gibt 1 zurück wenn Object leer ist", () => {
      const data = {};
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt 1 zurück wenn Object nur andere Eigenschaften hat", () => {
      const data = { id: "123", name: "Test" };
      expect(extractPointsRatio(data)).toBe(1);
    });

    it("gibt ganzzahlige points_ratio zurück", () => {
      const data = { points_ratio: 5 };
      expect(extractPointsRatio(data)).toBe(5);
    });
  });

  // Integration Tests
  describe("Auth Utils Integration", () => {
    it("validiert API Key Header und Organization Match zusammen", () => {
      const headers = { "x-api-key": "test-key-123" };
      const apiKey = validateApiKeyHeader(headers);
      expect(apiKey).toBe("test-key-123");

      const isMatch = validateOrganizationMatch("org-123", "org-123");
      expect(isMatch).toBe(true);
    });

    it("verarbeitet vollständigen Auth Flow", () => {
      const headers = { "x-api-key": "valid-key" };
      const apiKey = validateApiKeyHeader(headers);
      expect(apiKey).toBe("valid-key");

      const responseData = {
        id: "org-123",
        name: "My Org",
        points_ratio: 1.5,
      };
      const validation = validateApiKeyResponse(responseData);
      expect(validation.isValid).toBe(true);

      const ratio = extractPointsRatio(responseData);
      expect(ratio).toBe(1.5);
    });

    it("gibt Fehler bei invaliden Headers in vollständigem Flow", () => {
      const headers = {};
      expect(() => validateApiKeyHeader(headers)).toThrow(
        "Missing x-api-key header"
      );
    });

    it("validiert komplettes Auth Szenario", () => {
      // Setup
      const headers = { "x-api-key": "sk-prod-12345678" };
      const organizationId = "org-uuid-123";
      const responseData = {
        id: organizationId,
        name: "Production Org",
        points_ratio: 2.0,
      };

      // Validate
      const apiKey = validateApiKeyHeader(headers);
      expect(apiKey).toBe("sk-prod-12345678");

      const isValidResponse = validateApiKeyResponse(responseData);
      expect(isValidResponse.isValid).toBe(true);

      const isMatchingOrg = validateOrganizationMatch(
        organizationId,
        responseData.id
      );
      expect(isMatchingOrg).toBe(true);

      const pointsRatio = extractPointsRatio(responseData);
      expect(pointsRatio).toBe(2.0);
    });
  });
});
