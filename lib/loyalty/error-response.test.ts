// error-response.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  getErrorStatus,
  createErrorResponse,
  formatErrorResponse,
  isErrorCategory,
} from "./error-response";

describe("Error Response Utilities", () => {
  beforeEach(() => {
    // Cleanup if needed
  });

  // getErrorStatus Tests
  describe("getErrorStatus", () => {
    it("gibt 409 zurück für 'insufficient points balance' Fehler", () => {
      expect(getErrorStatus("insufficient points balance")).toBe(409);
    });

    it("gibt 409 zurück wenn Nachricht 'insufficient points balance' enthält", () => {
      expect(
        getErrorStatus("Your account has insufficient points balance for this transaction")
      ).toBe(409);
    });

    it("gibt 409 zurück unabhängig von Großschreibung", () => {
      expect(getErrorStatus("INSUFFICIENT POINTS BALANCE")).toBe(409);
    });

    it("gibt 401 zurück für 'invalid api key' Fehler", () => {
      expect(getErrorStatus("invalid api key")).toBe(401);
    });

    it("gibt 401 zurück für 'missing x-api-key' Fehler", () => {
      expect(getErrorStatus("missing x-api-key")).toBe(401);
    });

    it("gibt 401 zurück für 'unauthorized' Fehler", () => {
      expect(getErrorStatus("unauthorized")).toBe(401);
    });

    it("gibt 401 zurück für 'please sign in' Nachricht", () => {
      expect(getErrorStatus("please sign in")).toBe(401);
    });

    it("gibt 403 zurück für 'forbidden' Fehler", () => {
      expect(getErrorStatus("forbidden access")).toBe(403);
    });

    it("gibt 403 zurück für 'membership' Fehler", () => {
      expect(getErrorStatus("invalid membership status")).toBe(403);
    });

    it("gibt 404 zurück für 'not found' Fehler", () => {
      expect(getErrorStatus("The requested resource was not found")).toBe(404);
    });

    it("gibt 404 zurück wenn Nachricht 'not found' enthält", () => {
      expect(getErrorStatus("Customer profile not found in database")).toBe(404);
    });

    it("gibt 400 zurück für unbekannte Fehler", () => {
      expect(getErrorStatus("ein unbekannter fehler")).toBe(400);
    });

    it("gibt 400 zurück für generische Fehlermeldung", () => {
      expect(getErrorStatus("An error occurred")).toBe(400);
    });

    it("gibt 400 zurück für leeren String", () => {
      expect(getErrorStatus("")).toBe(400);
    });

    it("ist case-insensitive für alle Pattern", () => {
      expect(getErrorStatus("INVALID API KEY")).toBe(401);
      expect(getErrorStatus("Not Found")).toBe(404);
      expect(getErrorStatus("Forbidden Access")).toBe(403);
    });

    it("wählt ersten zutreffenden Status", () => {
      // Wenn mehrere Pattern passen, wird das erste zurückgegeben
      expect(getErrorStatus("not found and forbidden")).toBe(403);
    });

    it("akzeptiert lange Fehlermeldungen", () => {
      const longMessage = "insufficient points balance" + "x".repeat(1000);
      expect(getErrorStatus(longMessage)).toBe(409);
    });
  });

  // createErrorResponse Tests
  describe("createErrorResponse", () => {
    it("erstellt Response mit 'insufficient points balance'", () => {
      const response = createErrorResponse("insufficient points balance");
      expect(response.error).toBe("insufficient points balance");
      expect(response.status).toBe(409);
    });

    it("erstellt Response mit 'invalid api key'", () => {
      const response = createErrorResponse("invalid api key");
      expect(response.error).toBe("invalid api key");
      expect(response.status).toBe(401);
    });

    it("erstellt Response mit 'not found'", () => {
      const response = createErrorResponse("not found");
      expect(response.error).toBe("not found");
      expect(response.status).toBe(404);
    });

    it("erstellt Response mit unbekanntem Fehler", () => {
      const response = createErrorResponse("something went wrong");
      expect(response.error).toBe("something went wrong");
      expect(response.status).toBe(400);
    });

    it("hat immer error und status Felder", () => {
      const response = createErrorResponse("test error");
      expect(response).toHaveProperty("error");
      expect(response).toHaveProperty("status");
    });

    it("error Feld entspricht Input-Nachricht", () => {
      const message = "Custom error message";
      const response = createErrorResponse(message);
      expect(response.error).toBe(message);
    });

    it("status Feld ist eine Zahl", () => {
      const response = createErrorResponse("test");
      expect(typeof response.status).toBe("number");
    });

    it("status Feld ist zwischen 400 und 409", () => {
      const messages = [
        "insufficient points balance",
        "invalid api key",
        "forbidden",
        "not found",
        "error",
      ];
      messages.forEach((msg) => {
        const response = createErrorResponse(msg);
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThanOrEqual(409);
      });
    });

    it("erstellt unterschiedliche Responses für verschiedene Fehler", () => {
      const auth = createErrorResponse("invalid api key");
      const notfound = createErrorResponse("not found");
      expect(auth.status).not.toBe(notfound.status);
    });
  });

  // formatErrorResponse Tests
  describe("formatErrorResponse", () => {
    it("gibt gültigen JSON String zurück", () => {
      const json = formatErrorResponse("test error");
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("JSON enthält error Feld", () => {
      const json = formatErrorResponse("test error");
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty("error");
    });

    it("JSON enthält status Feld", () => {
      const json = formatErrorResponse("test error");
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty("status");
    });

    it("error Feld im JSON entspricht Input", () => {
      const message = "My error";
      const json = formatErrorResponse(message);
      const parsed = JSON.parse(json);
      expect(parsed.error).toBe(message);
    });

    it("status Feld im JSON ist korrekt", () => {
      const json = formatErrorResponse("not found");
      const parsed = JSON.parse(json);
      expect(parsed.status).toBe(404);
    });

    it("formatiert alle Status Typen korrekt", () => {
      const testCases = [
        { msg: "insufficient points balance", status: 409 },
        { msg: "invalid api key", status: 401 },
        { msg: "forbidden", status: 403 },
        { msg: "not found", status: 404 },
        { msg: "other error", status: 400 },
      ];

      testCases.forEach(({ msg, status }) => {
        const json = formatErrorResponse(msg);
        const parsed = JSON.parse(json);
        expect(parsed.status).toBe(status);
      });
    });

    it("escaped Sonderzeichen in JSON", () => {
      const message = 'Error with "quotes" and \\backslash';
      const json = formatErrorResponse(message);
      expect(() => JSON.parse(json)).not.toThrow();
    });
  });

  // isErrorCategory Tests
  describe("isErrorCategory", () => {
    it("erkennt auth Fehler", () => {
      expect(isErrorCategory("invalid api key", "auth")).toBe(true);
      expect(isErrorCategory("unauthorized", "auth")).toBe(true);
    });

    it("erkennt auth Fehler nicht für andere Kategorien", () => {
      expect(isErrorCategory("invalid api key", "notfound")).toBe(false);
      expect(isErrorCategory("invalid api key", "permission")).toBe(false);
    });

    it("erkennt permission Fehler", () => {
      expect(isErrorCategory("forbidden", "permission")).toBe(true);
      expect(isErrorCategory("membership", "permission")).toBe(true);
    });

    it("erkennt permission Fehler nicht für andere Kategorien", () => {
      expect(isErrorCategory("forbidden", "auth")).toBe(false);
      expect(isErrorCategory("forbidden", "conflict")).toBe(false);
    });

    it("erkennt notfound Fehler", () => {
      expect(isErrorCategory("not found", "notfound")).toBe(true);
    });

    it("erkennt notfound Fehler nicht für andere Kategorien", () => {
      expect(isErrorCategory("not found", "auth")).toBe(false);
      expect(isErrorCategory("not found", "permission")).toBe(false);
    });

    it("erkennt conflict Fehler", () => {
      expect(isErrorCategory("insufficient points balance", "conflict")).toBe(
        true
      );
    });

    it("erkennt conflict Fehler nicht für andere Kategorien", () => {
      expect(isErrorCategory("insufficient points balance", "auth")).toBe(
        false
      );
    });

    it("erkennt 'other' Fehler", () => {
      expect(isErrorCategory("some random error", "other")).toBe(true);
    });

    it("erkennt 'other' Fehler nicht für andere Kategorien", () => {
      expect(isErrorCategory("some random error", "auth")).toBe(false);
      expect(isErrorCategory("some random error", "notfound")).toBe(false);
    });

    it("gibt false zurück für unbekannte Kategorien", () => {
      expect(isErrorCategory("test", "unknown" as any)).toBe(false);
    });

    it("matched alle bekannten Kategorien", () => {
      const categories = ["auth", "permission", "notfound", "conflict", "other"] as const;
      categories.forEach((cat) => {
        expect(typeof isErrorCategory("test", cat)).toBe("boolean");
      });
    });

    it("ist case-insensitive bei Fehlermeldungen", () => {
      expect(isErrorCategory("INVALID API KEY", "auth")).toBe(true);
      expect(isErrorCategory("FORBIDDEN", "permission")).toBe(true);
    });
  });

  // Integration Tests
  describe("Error Response Utils Integration", () => {
    it("kombiniert getErrorStatus mit createErrorResponse", () => {
      const message = "insufficient points balance";
      const status = getErrorStatus(message);
      const response = createErrorResponse(message);
      expect(response.status).toBe(status);
    });

    it("formatiert Response als JSON korrekt", () => {
      const message = "invalid api key";
      const json = formatErrorResponse(message);
      const parsed = JSON.parse(json);
      expect(parsed.error).toBe(message);
      expect(parsed.status).toBe(401);
    });

    it("isErrorCategory matched createErrorResponse Status", () => {
      const message = "not found";
      const response = createErrorResponse(message);
      const isNotFound = isErrorCategory(message, "notfound");
      expect(isNotFound).toBe(response.status === 404);
    });

    it("verarbeitet alle Standard Auth Fehler korrekt", () => {
      const authErrors = [
        "invalid api key",
        "missing x-api-key",
        "unauthorized",
        "please sign in",
      ];

      authErrors.forEach((error) => {
        expect(isErrorCategory(error, "auth")).toBe(true);
        expect(getErrorStatus(error)).toBe(401);
        const response = createErrorResponse(error);
        expect(response.status).toBe(401);
      });
    });

    it("verarbeitet alle Standard Permission Fehler korrekt", () => {
      const permErrors = ["forbidden access", "invalid membership status"];

      permErrors.forEach((error) => {
        expect(isErrorCategory(error, "permission")).toBe(true);
        expect(getErrorStatus(error)).toBe(403);
        const response = createErrorResponse(error);
        expect(response.status).toBe(403);
      });
    });

    it("erstellt konsistente Fehlerresponses", () => {
      const message = "insufficient points balance";
      const response1 = createErrorResponse(message);
      const response2 = createErrorResponse(message);

      expect(response1).toEqual(response2);
    });

    it("gibt unterschiedliche Status für unterschiedliche Fehler", () => {
      const errors = [
        "insufficient points balance",
        "invalid api key",
        "forbidden",
        "not found",
      ];
      const statuses = errors.map((e) => getErrorStatus(e));

      expect(new Set(statuses).size).toBe(statuses.length);
    });

    it("formatiert komplexe Fehlermeldungen korrekt", () => {
      const complexMessage =
        "User invalid api key attempt from forbidden region with not found resource";
      const response = createErrorResponse(complexMessage);
      const json = formatErrorResponse(complexMessage);

      expect(response.error).toBe(complexMessage);
      expect(JSON.parse(json).error).toBe(complexMessage);
      expect(response.status).toBe(401); // First match wins
    });

    it("alle Utility Funktionen sind pure Functions", () => {
      const message = "test error";
      const result1 = getErrorStatus(message);
      const result2 = getErrorStatus(message);
      expect(result1).toBe(result2);

      const resp1 = createErrorResponse(message);
      const resp2 = createErrorResponse(message);
      expect(resp1).toEqual(resp2);
    });
  });
});
