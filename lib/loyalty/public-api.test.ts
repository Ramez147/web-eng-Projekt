// public-api.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";
import {
  collectRequestSchema,
  redeemRequestSchema,
  getPublicApiErrorStatus,
  extractErrorMessage,
  createErrorResponseObject,
} from "./public-api";

describe("Public API Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // collectRequestSchema Tests
  describe("collectRequestSchema", () => {
    it("validiert korrekte Collect Request", () => {
      const data = {
        externalCustomerId: "cust-123",
        amountEur: 10.5,
        metadata: { source: "web" },
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("akzeptiert Request ohne metadata", () => {
      const data = {
        externalCustomerId: "cust-456",
        amountEur: 25,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("gibt default metadata zurück wenn nicht vorhanden", () => {
      const data = {
        externalCustomerId: "cust-789",
        amountEur: 5,
      };
      const result = collectRequestSchema.safeParse(data);
      if (result.success) {
        expect(result.data.metadata).toEqual({});
      }
    });

    it("lehnt Request ohne externalCustomerId ab", () => {
      const data = {
        amountEur: 10,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt leeren externalCustomerId ab", () => {
      const data = {
        externalCustomerId: "",
        amountEur: 10,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt Request ohne amountEur ab", () => {
      const data = {
        externalCustomerId: "cust-123",
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt negative amountEur ab", () => {
      const data = {
        externalCustomerId: "cust-123",
        amountEur: -10,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt amountEur von 0 ab", () => {
      const data = {
        externalCustomerId: "cust-123",
        amountEur: 0,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("konvertiert String zu Zahl für amountEur", () => {
      const data = {
        externalCustomerId: "cust-123",
        amountEur: "50.5",
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amountEur).toBe(50.5);
      }
    });

    it("trimmt externalCustomerId", () => {
      const data = {
        externalCustomerId: "  cust-123  ",
        amountEur: 10,
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.externalCustomerId).toBe("cust-123");
      }
    });

    it("akzeptiert komplexe metadata", () => {
      const data = {
        externalCustomerId: "cust-123",
        amountEur: 100,
        metadata: {
          source: "api",
          userId: "user-456",
          nested: { key: "value" },
        },
      };
      const result = collectRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  // redeemRequestSchema Tests
  describe("redeemRequestSchema", () => {
    it("validiert korrekte Redeem Request", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: 100,
        metadata: { reason: "purchase" },
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("akzeptiert Request ohne metadata", () => {
      const data = {
        externalCustomerId: "cust-456",
        points: 50,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("gibt default metadata zurück wenn nicht vorhanden", () => {
      const data = {
        externalCustomerId: "cust-789",
        points: 25,
      };
      const result = redeemRequestSchema.safeParse(data);
      if (result.success) {
        expect(result.data.metadata).toEqual({});
      }
    });

    it("lehnt Request ohne externalCustomerId ab", () => {
      const data = {
        points: 100,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt leeren externalCustomerId ab", () => {
      const data = {
        externalCustomerId: "",
        points: 100,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt Request ohne points ab", () => {
      const data = {
        externalCustomerId: "cust-123",
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt negative points ab", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: -50,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt points von 0 ab", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: 0,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("lehnt dezimale points ab", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: 50.5,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("konvertiert String zu Integer für points", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: "100",
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.points).toBe(100);
      }
    });

    it("trimmt externalCustomerId", () => {
      const data = {
        externalCustomerId: "  cust-123  ",
        points: 50,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.externalCustomerId).toBe("cust-123");
      }
    });

    it("akzeptiert große Point-Werte", () => {
      const data = {
        externalCustomerId: "cust-123",
        points: 999999,
      };
      const result = redeemRequestSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  // getPublicApiErrorStatus Tests
  describe("getPublicApiErrorStatus", () => {
    it("gibt 401 zurück für 'missing x-api-key'", () => {
      expect(getPublicApiErrorStatus("missing x-api-key")).toBe(401);
    });

    it("gibt 401 zurück für 'invalid api key'", () => {
      expect(getPublicApiErrorStatus("invalid api key")).toBe(401);
    });

    it("gibt 400 zurück für 'must be' Fehler", () => {
      expect(
        getPublicApiErrorStatus("amountEur must be greater than 0")
      ).toBe(400);
    });

    it("gibt 400 zurück für 'invalid' Fehler", () => {
      expect(getPublicApiErrorStatus("invalid request")).toBe(400);
    });

    it("gibt 400 zurück für 'required' Fehler", () => {
      expect(getPublicApiErrorStatus("field is required")).toBe(400);
    });

    it("gibt 400 zurück für 'insufficient points'", () => {
      expect(getPublicApiErrorStatus("insufficient points balance")).toBe(400);
    });

    it("gibt 400 zurück für 'organization not found'", () => {
      expect(getPublicApiErrorStatus("organization not found")).toBe(400);
    });

    it("gibt 400 zurück für 'calculated points'", () => {
      expect(getPublicApiErrorStatus("calculated points mismatch")).toBe(400);
    });

    it("gibt 500 zurück für unbekannte Fehler", () => {
      expect(getPublicApiErrorStatus("unexpected error")).toBe(500);
    });

    it("ist case-insensitive", () => {
      expect(getPublicApiErrorStatus("INVALID API KEY")).toBe(401);
      expect(getPublicApiErrorStatus("MUST BE POSITIVE")).toBe(400);
    });

    it("wählt ersten Match", () => {
      expect(getPublicApiErrorStatus("invalid api key and must be")).toBe(401);
    });

    it("akzeptiert lange Fehlermeldungen", () => {
      const longMessage = "invalid " + "x".repeat(1000);
      expect(getPublicApiErrorStatus(longMessage)).toBe(400);
    });

    it("akzeptiert leeren String", () => {
      expect(getPublicApiErrorStatus("")).toBe(500);
    });
  });

  // extractErrorMessage Tests
  describe("extractErrorMessage", () => {
    it("extrahiert Nachricht aus Error", () => {
      const error = new Error("Test error message");
      const message = extractErrorMessage(error);
      expect(message).toBe("Test error message");
    });

    it("extrahiert Nachricht aus ZodError", () => {
      const schema = z.object({ name: z.string() });
      const result = schema.safeParse({});
      if (!result.success) {
        const message = extractErrorMessage(result.error);
        expect(message.length).toBeGreaterThan(0);
        expect(typeof message).toBe("string");
      }
    });

    it("joiniert mehrere ZodError Nachrichten", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({});
      if (!result.success) {
        const message = extractErrorMessage(result.error);
        expect(message).toContain(";");
      }
    });

    it("gibt 'Unknown error' für unbekannte Fehler", () => {
      const message = extractErrorMessage("just a string");
      expect(message).toBe("Unknown error");
    });

    it("gibt 'Unknown error' für undefined", () => {
      const message = extractErrorMessage(undefined);
      expect(message).toBe("Unknown error");
    });

    it("gibt 'Unknown error' für null", () => {
      const message = extractErrorMessage(null);
      expect(message).toBe("Unknown error");
    });

    it("erhält Meldung aus TypeError", () => {
      const error = new TypeError("Type mismatch");
      const message = extractErrorMessage(error);
      expect(message).toBe("Type mismatch");
    });

    it("erhält Meldung aus RangeError", () => {
      const error = new RangeError("Out of range");
      const message = extractErrorMessage(error);
      expect(message).toBe("Out of range");
    });

    it("akzeptiert lange Error-Nachrichten", () => {
      const longMessage = "x".repeat(1000);
      const error = new Error(longMessage);
      const message = extractErrorMessage(error);
      expect(message).toBe(longMessage);
    });
  });

  // createErrorResponseObject Tests
  describe("createErrorResponseObject", () => {
    it("erstellt Response für normale Error-Nachricht", () => {
      const response = createErrorResponseObject("invalid api key");
      expect(response.error).toBe("invalid api key");
      expect(response.status).toBe(401);
    });

    it("erstellt Response für ZodError mit Status 400", () => {
      const response = createErrorResponseObject("validation failed", true);
      expect(response.error).toBe("validation failed");
      expect(response.status).toBe(400);
    });

    it("erstellt Response mit unterschiedlichen Status", () => {
      const auth = createErrorResponseObject("missing x-api-key");
      const validation = createErrorResponseObject("must be positive");
      expect(auth.status).toBe(401);
      expect(validation.status).toBe(400);
    });

    it("ignoriert getPublicApiErrorStatus wenn isZodError=true", () => {
      const response = createErrorResponseObject("anything", true);
      expect(response.status).toBe(400);
    });

    it("akzeptiert isZodError=false explizit", () => {
      const response = createErrorResponseObject("invalid api key", false);
      expect(response.status).toBe(401);
    });

    it("hat immer error und status Felder", () => {
      const response = createErrorResponseObject("test");
      expect(response).toHaveProperty("error");
      expect(response).toHaveProperty("status");
    });

    it("erhält genaue Error-Nachricht", () => {
      const message = "Custom error message";
      const response = createErrorResponseObject(message);
      expect(response.error).toBe(message);
    });

    it("gibt korrekte Status für alle bekannten Fehler", () => {
      expect(createErrorResponseObject("missing x-api-key").status).toBe(401);
      expect(createErrorResponseObject("invalid api key").status).toBe(401);
      expect(createErrorResponseObject("must be positive").status).toBe(400);
      expect(createErrorResponseObject("unknown error").status).toBe(500);
    });
  });

  // Integration Tests
  describe("Public API Utils Integration", () => {
    it("validiert collectRequestSchema und createErrorResponseObject", () => {
      const invalidData = {
        externalCustomerId: "",
        amountEur: -10,
      };
      const result = collectRequestSchema.safeParse(invalidData);
      if (!result.success) {
        const message = extractErrorMessage(result.error);
        const response = createErrorResponseObject(message, true);
        expect(response.status).toBe(400);
      }
    });

    it("validiert redeemRequestSchema und createErrorResponseObject", () => {
      const invalidData = {
        externalCustomerId: "cust-123",
        points: -50,
      };
      const result = redeemRequestSchema.safeParse(invalidData);
      if (!result.success) {
        const message = extractErrorMessage(result.error);
        const response = createErrorResponseObject(message, true);
        expect(response.status).toBe(400);
      }
    });

    it("kombiniert alle Utility-Funktionen für Error-Handling", () => {
      const error = new Error("invalid api key");
      const message = extractErrorMessage(error);
      const response = createErrorResponseObject(message);
      expect(response.error).toBe("invalid api key");
      expect(response.status).toBe(401);
    });

    it("verarbeitet Schema-Validierungsfehler korrekt", () => {
      const testCases = [
        {
          data: { externalCustomerId: "", amountEur: 10 },
          schema: collectRequestSchema,
        },
        {
          data: { externalCustomerId: "cust", points: 0 },
          schema: redeemRequestSchema,
        },
      ];

      testCases.forEach(({ data, schema }) => {
        const result = schema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          const message = extractErrorMessage(result.error);
          expect(message.length).toBeGreaterThan(0);
        }
      });
    });

    it("erstellt konsistente Error-Responses", () => {
      const message = "test error";
      const response1 = createErrorResponseObject(message);
      const response2 = createErrorResponseObject(message);
      expect(response1).toEqual(response2);
    });

    it("akzeptiert gültige Requests für beide Schemas", () => {
      const collectData = {
        externalCustomerId: "cust-123",
        amountEur: 50,
        metadata: { source: "api" },
      };
      const redeemData = {
        externalCustomerId: "cust-123",
        points: 100,
        metadata: { reason: "purchase" },
      };

      expect(collectRequestSchema.safeParse(collectData).success).toBe(true);
      expect(redeemRequestSchema.safeParse(redeemData).success).toBe(true);
    });

    it("unterscheidet zwischen ZodError und anderen Errors", () => {
      const collectResult = collectRequestSchema.safeParse({});
      const regularError = new Error("regular error");

      if (!collectResult.success) {
        const zodMessage = extractErrorMessage(collectResult.error);
        const regularMessage = extractErrorMessage(regularError);

        const zodResponse = createErrorResponseObject(zodMessage, true);
        const regularResponse = createErrorResponseObject(regularMessage, false);

        expect(zodResponse.status).toBe(400);
        expect(regularResponse.status).toBe(500); // "regular error" ist 500
      }
    });

    it("alle Funktionen sind pure Functions", () => {
      const message = "test";
      const result1 = getPublicApiErrorStatus(message);
      const result2 = getPublicApiErrorStatus(message);
      expect(result1).toBe(result2);

      const error = new Error("error");
      const msg1 = extractErrorMessage(error);
      const msg2 = extractErrorMessage(error);
      expect(msg1).toBe(msg2);

      const resp1 = createErrorResponseObject("msg");
      const resp2 = createErrorResponseObject("msg");
      expect(resp1).toEqual(resp2);
    });
  });
});
