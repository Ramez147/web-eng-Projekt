import { describe, it, expect } from "vitest";
import {
  isValidEventType,
  isValidStripeEvent,
  extractPaymentIntentFromEvent,
  extractPaymentMethodFromEvent,
  shouldProcessEvent,
  isValidWebhookHeaders,
} from "./route";

describe("Webhook Route Utils", () => {
  // isValidEventType Tests
  describe("isValidEventType", () => {
    it("gibt true für valide Event Typen zurück", () => {
      expect(isValidEventType("payment_intent.succeeded")).toBe(true);
      expect(isValidEventType("payment_intent.failed")).toBe(true);
      expect(isValidEventType("payment_method.attached")).toBe(true);
      expect(isValidEventType("charge.succeeded")).toBe(true);
    });

    it("gibt false für unvalide Event Typen zurück", () => {
      expect(isValidEventType("unknown.event")).toBe(false);
      expect(isValidEventType("random.type")).toBe(false);
    });

    it("gibt false für nicht-Strings zurück", () => {
      expect(isValidEventType(123 as any)).toBe(false);
      expect(isValidEventType(null as any)).toBe(false);
      expect(isValidEventType(undefined as any)).toBe(false);
    });

    it("gibt false für leeren String zurück", () => {
      expect(isValidEventType("")).toBe(false);
    });
  });

  // isValidStripeEvent Tests
  describe("isValidStripeEvent", () => {
    it("gibt true für valide Event Objekte zurück", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123" },
        },
      };
      expect(isValidStripeEvent(event)).toBe(true);
    });

    it("gibt true für Event mit zusätzlichen Feldern zurück", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123", amount: 1000 },
        },
        id: "evt_123",
        created: 1234567890,
      };
      expect(isValidStripeEvent(event)).toBe(true);
    });

    it("gibt false für null zurück", () => {
      expect(isValidStripeEvent(null)).toBe(false);
    });

    it("gibt false für undefined zurück", () => {
      expect(isValidStripeEvent(undefined)).toBe(false);
    });

    it("gibt false für Event ohne type zurück", () => {
      const event = { data: { object: { id: "pi_123" } } };
      expect(isValidStripeEvent(event)).toBe(false);
    });

    it("gibt false für Event ohne data zurück", () => {
      const event = { type: "payment_intent.succeeded" };
      expect(isValidStripeEvent(event)).toBe(false);
    });

    it("gibt false für Event ohne data.object zurück", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {},
      };
      expect(isValidStripeEvent(event)).toBe(false);
    });
  });

  // extractPaymentIntentFromEvent Tests
  describe("extractPaymentIntentFromEvent", () => {
    it("extrahiert PaymentIntent aus Event", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123", amount: 1000 },
        },
      };
      const result = extractPaymentIntentFromEvent(event);
      expect(result).toEqual({ id: "pi_123", amount: 1000 });
    });

    it("gibt null zurück wenn Event nicht payment_intent.succeeded ist", () => {
      const event = {
        type: "payment_method.attached",
        data: {
          object: { id: "pm_123" },
        },
      };
      const result = extractPaymentIntentFromEvent(event);
      expect(result).toBeNull();
    });

    it("gibt null zurück wenn object nicht vorhanden", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {},
      };
      const result = extractPaymentIntentFromEvent(event);
      expect(result).toBeNull();
    });

    it("gibt null zurück wenn object kein Objekt ist", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: null,
        },
      };
      const result = extractPaymentIntentFromEvent(event);
      expect(result).toBeNull();
    });
  });

  // extractPaymentMethodFromEvent Tests
  describe("extractPaymentMethodFromEvent", () => {
    it("extrahiert PaymentMethod aus Event", () => {
      const event = {
        type: "payment_method.attached",
        data: {
          object: { id: "pm_123", type: "card" },
        },
      };
      const result = extractPaymentMethodFromEvent(event);
      expect(result).toEqual({ id: "pm_123" });
    });

    it("gibt null zurück wenn Event nicht payment_method.attached ist", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123" },
        },
      };
      const result = extractPaymentMethodFromEvent(event);
      expect(result).toBeNull();
    });

    it("gibt null zurück wenn object nicht vorhanden", () => {
      const event = {
        type: "payment_method.attached",
        data: {},
      };
      const result = extractPaymentMethodFromEvent(event);
      expect(result).toBeNull();
    });
  });

  // shouldProcessEvent Tests
  describe("shouldProcessEvent", () => {
    it("gibt true für valide und processierbare Events zurück", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123" },
        },
      };
      expect(shouldProcessEvent(event)).toBe(true);
    });

    it("gibt false für valide aber nicht-processierbare Events zurück", () => {
      const event = {
        type: "unknown.event",
        data: {
          object: { id: "test" },
        },
      };
      expect(shouldProcessEvent(event)).toBe(false);
    });

    it("gibt false für invalide Events zurück", () => {
      expect(shouldProcessEvent(null)).toBe(false);
      expect(shouldProcessEvent(undefined)).toBe(false);
      expect(shouldProcessEvent({})).toBe(false);
    });

    it("gibt false für Events ohne type zurück", () => {
      const event = {
        data: {
          object: { id: "pi_123" },
        },
      };
      expect(shouldProcessEvent(event)).toBe(false);
    });
  });

  // isValidWebhookHeaders Tests
  describe("isValidWebhookHeaders", () => {
    it("extrahiert Signatur aus Headers", () => {
      const headers = { "stripe-signature": "test_signature" };
      const result = isValidWebhookHeaders(headers);
      expect(result.signature).toBe("test_signature");
    });

    it("gibt undefined Signatur zurück wenn nicht vorhanden", () => {
      const headers = {};
      const result = isValidWebhookHeaders(headers);
      expect(result.signature).toBeUndefined();
    });

    it("gibt leeres Objekt zurück für null headers", () => {
      const result = isValidWebhookHeaders(null);
      expect(result).toEqual({});
    });

    it("handhabt Headers mit get Methode", () => {
      const headers = {
        get: (key: string) => key === "stripe-signature" ? "test_sig" : null,
      };
      const result = isValidWebhookHeaders(headers);
      expect(result.signature).toBe("test_sig");
    });
  });

  // Integration Tests
  describe("Webhook Integration", () => {
    it("validiert kompletten Payment Intent Event", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123", amount: 1000 },
        },
      };

      expect(isValidStripeEvent(event)).toBe(true);
      expect(shouldProcessEvent(event)).toBe(true);
      const extracted = extractPaymentIntentFromEvent(event);
      expect(extracted).toEqual({ id: "pi_123", amount: 1000 });
    });

    it("validiert kompletten PaymentMethod Event", () => {
      const event = {
        type: "payment_method.attached",
        data: {
          object: { id: "pm_123", type: "card" },
        },
      };

      expect(isValidStripeEvent(event)).toBe(true);
      expect(shouldProcessEvent(event)).toBe(true);
      const extracted = extractPaymentMethodFromEvent(event);
      expect(extracted).toEqual({ id: "pm_123" });
    });

    it("lehnt unbekannte Events ab", () => {
      const event = {
        type: "unknown.event",
        data: {
          object: { id: "test" },
        },
      };

      expect(shouldProcessEvent(event)).toBe(false);
      expect(extractPaymentIntentFromEvent(event)).toBeNull();
      expect(extractPaymentMethodFromEvent(event)).toBeNull();
    });

    it("validiert mehrere valide Event Typen", () => {
      const validTypes = [
        "payment_intent.succeeded",
        "payment_intent.failed",
        "payment_method.attached",
        "charge.succeeded",
      ];

      validTypes.forEach((type) => {
        expect(isValidEventType(type)).toBe(true);
      });
    });

    it("alle Event Validierungen für kompletten Flow", () => {
      const event = {
        type: "payment_intent.succeeded",
        data: {
          object: { id: "pi_123", amount: 1000, currency: "usd" },
        },
      };

      // Validation chain
      expect(isValidStripeEvent(event)).toBe(true);
      expect(isValidEventType(event.type)).toBe(true);
      expect(shouldProcessEvent(event)).toBe(true);
      
      // Extraction
      const extracted = extractPaymentIntentFromEvent(event);
      expect(extracted?.id).toBe("pi_123");
      expect(extracted?.amount).toBe(1000);
    });
  });
});