import { describe, it, expect } from "vitest";
import {
  isValidAmount,
  isValidCurrency,
  convertAmountToCents,
  isValidPaymentIntentResponse,
  parsePaymentRequest,
} from "./route";

describe("Payment Intent Route Utils", () => {
  // isValidAmount Tests
  describe("isValidAmount", () => {
    it("gibt true für positive Zahlen zurück", () => {
      expect(isValidAmount(10)).toBe(true);
      expect(isValidAmount(100.5)).toBe(true);
      expect(isValidAmount(0.01)).toBe(true);
    });

    it("gibt false für 0 zurück", () => {
      expect(isValidAmount(0)).toBe(false);
    });

    it("gibt false für negative Zahlen zurück", () => {
      expect(isValidAmount(-10)).toBe(false);
      expect(isValidAmount(-0.01)).toBe(false);
    });

    it("gibt false für nicht-Zahlen zurück", () => {
      expect(isValidAmount("10" as any)).toBe(false);
      expect(isValidAmount(null as any)).toBe(false);
      expect(isValidAmount(undefined as any)).toBe(false);
    });

    it("gibt false für Infinity zurück", () => {
      expect(isValidAmount(Infinity)).toBe(false);
      expect(isValidAmount(-Infinity)).toBe(false);
    });

    it("gibt false für NaN zurück", () => {
      expect(isValidAmount(NaN)).toBe(false);
    });

    it("gibt true für große Zahlen zurück", () => {
      expect(isValidAmount(999999)).toBe(true);
    });
  });

  // isValidCurrency Tests
  describe("isValidCurrency", () => {
    it("gibt true für valide Währungen zurück", () => {
      expect(isValidCurrency("usd")).toBe(true);
      expect(isValidCurrency("eur")).toBe(true);
      expect(isValidCurrency("gbp")).toBe(true);
      expect(isValidCurrency("jpy")).toBe(true);
    });

    it("gibt true für Großbuchstaben zurück", () => {
      expect(isValidCurrency("USD")).toBe(true);
      expect(isValidCurrency("EUR")).toBe(true);
    });

    it("gibt false für unbekannte Währungen zurück", () => {
      expect(isValidCurrency("xxx")).toBe(false);
      expect(isValidCurrency("abc")).toBe(false);
    });

    it("gibt false für nicht-Strings zurück", () => {
      expect(isValidCurrency(123 as any)).toBe(false);
      expect(isValidCurrency(null as any)).toBe(false);
    });

    it("gibt false für leeren String zurück", () => {
      expect(isValidCurrency("")).toBe(false);
    });
  });

  // convertAmountToCents Tests
  describe("convertAmountToCents", () => {
    it("konvertiert USD zu Cents", () => {
      expect(convertAmountToCents(10)).toBe(1000);
      expect(convertAmountToCents(1)).toBe(100);
      expect(convertAmountToCents(0.01)).toBe(1);
    });

    it("rundet auf nächsten Cent auf", () => {
      expect(convertAmountToCents(10.125)).toBe(1013);
      expect(convertAmountToCents(10.124)).toBe(1012);
    });

    it("handhabt große Beträge", () => {
      expect(convertAmountToCents(999.99)).toBe(99999);
    });

    it("handhabt kleine Beträge", () => {
      expect(convertAmountToCents(0.01)).toBe(1);
      expect(convertAmountToCents(0.001)).toBe(0);
    });
  });

  // isValidPaymentIntentResponse Tests
  describe("isValidPaymentIntentResponse", () => {
    it("gibt true für valide Response zurück", () => {
      const response = { client_secret: "pi_test_12345" };
      expect(isValidPaymentIntentResponse(response)).toBe(true);
    });

    it("gibt true für Response mit zusätzlichen Feldern zurück", () => {
      const response = {
        client_secret: "pi_test_12345",
        id: "pi_123",
        amount: 1000,
      };
      expect(isValidPaymentIntentResponse(response)).toBe(true);
    });

    it("gibt false für null zurück", () => {
      expect(isValidPaymentIntentResponse(null)).toBe(false);
    });

    it("gibt false für undefined zurück", () => {
      expect(isValidPaymentIntentResponse(undefined)).toBe(false);
    });

    it("gibt false für Response ohne client_secret zurück", () => {
      const response = { id: "pi_123" };
      expect(isValidPaymentIntentResponse(response)).toBe(false);
    });

    it("gibt false für Response mit leerem client_secret zurück", () => {
      const response = { client_secret: "" };
      expect(isValidPaymentIntentResponse(response)).toBe(false);
    });

    it("gibt false für Response mit nicht-String client_secret zurück", () => {
      const response = { client_secret: 123 };
      expect(isValidPaymentIntentResponse(response)).toBe(false);
    });

    it("gibt false für nicht-Objekt zurück", () => {
      expect(isValidPaymentIntentResponse("string" as any)).toBe(false);
      expect(isValidPaymentIntentResponse(123 as any)).toBe(false);
    });
  });

  // parsePaymentRequest Tests
  describe("parsePaymentRequest", () => {
    it("parst Request mit amount zurück", () => {
      const result = parsePaymentRequest({ amount: 10 });
      expect(result.amount).toBe(10);
    });

    it("setzt Standard-Währung auf USD", () => {
      const result = parsePaymentRequest({ amount: 10 });
      expect(result.currency).toBe("usd");
    });

    it("respektiert Custom Währung", () => {
      const result = parsePaymentRequest({ amount: 10, currency: "eur" });
      expect(result.currency).toBe("eur");
    });

    it("parst Metadata", () => {
      const metadata = { orderId: "123", userId: "456" };
      const result = parsePaymentRequest({ amount: 10, metadata });
      expect(result.metadata).toEqual(metadata);
    });

    it("gibt leeres Metadata zurück wenn nicht vorhanden", () => {
      const result = parsePaymentRequest({ amount: 10 });
      expect(result.metadata).toEqual({});
    });

    it("parst vollständige Request", () => {
      const metadata = { orderId: "123" };
      const result = parsePaymentRequest({
        amount: 50,
        currency: "gbp",
        metadata,
      });
      expect(result).toEqual({
        amount: 50,
        currency: "gbp",
        metadata,
      });
    });

    it("gibt undefined amount wenn nicht vorhanden", () => {
      const result = parsePaymentRequest({});
      expect(result.amount).toBeUndefined();
    });
  });

  // Integration Tests
  describe("Payment Intent Integration", () => {
    it("validiert kompletten Payment Flow", () => {
      const request = { amount: 99.99, currency: "usd", metadata: { orderId: "123" } };
      const parsed = parsePaymentRequest(request);
      
      expect(isValidAmount(parsed.amount as number)).toBe(true);
      expect(isValidCurrency(parsed.currency)).toBe(true);
      
      const cents = convertAmountToCents(parsed.amount as number);
      expect(cents).toBe(9999);
    });

    it("validiert fehlerhaften Flow - ungültige amount", () => {
      const request = { amount: 0, currency: "usd" };
      const parsed = parsePaymentRequest(request);
      
      expect(isValidAmount(parsed.amount as number)).toBe(false);
    });

    it("validiert fehlerhaften Flow - ungültige currency", () => {
      const request = { amount: 10, currency: "xxx" };
      const parsed = parsePaymentRequest(request);
      
      expect(isValidAmount(parsed.amount as number)).toBe(true);
      expect(isValidCurrency(parsed.currency)).toBe(false);
    });

    it("simuliert Stripe Response Validierung", () => {
      const stripeResponse = { 
        client_secret: "pi_test_secret_12345",
        id: "pi_test_id",
        amount: 1000,
        currency: "usd",
      };
      
      expect(isValidPaymentIntentResponse(stripeResponse)).toBe(true);
    });

    it("alle Validierungen passieren für valid Request", () => {
      const request = { 
        amount: 50.50,
        currency: "EUR",
        metadata: { orderId: "abc123" }
      };
      const parsed = parsePaymentRequest(request);
      
      const validAmount = isValidAmount(parsed.amount as number);
      const validCurrency = isValidCurrency(parsed.currency);
      const centsAmount = convertAmountToCents(parsed.amount as number);
      
      expect(validAmount).toBe(true);
      expect(validCurrency).toBe(true);
      expect(centsAmount).toBe(5050);
    });
  });
});