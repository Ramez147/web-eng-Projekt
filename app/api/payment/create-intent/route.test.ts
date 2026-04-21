/**
 * @jest-environment node
 */
import { POST } from "./route";
import { NextRequest } from "next/server";
import Stripe from "stripe";

// 1. Mock Stripe Library
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
    },
  }));
});

describe("POST /api/payment/create-intent", () => {
  let stripeMockInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "test_sk";
    
    // Initialisierung des Mocks für jeden Test
    stripeMockInstance = new Stripe("test_sk");
    (Stripe as any).mockImplementation(() => stripeMockInstance);
  });

  describe("Erfolgreiche Erstellung", () => {
    test("sollte clientSecret zurückgeben bei gültigem Betrag", async () => {
      // Arrange
      const mockPaymentIntent = { client_secret: "pi_secret_123" };
      stripeMockInstance.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

      const req = new NextRequest("http://localhost/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount: 10.99 }),
      });

      // Act
      const response = await POST(req);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.clientSecret).toBe("pi_secret_123");
      expect(stripeMockInstance.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1099, // 10.99 * 100
          currency: "usd",
        })
      );
    });

    test("sollte benutzerdefinierte Währung unterstützen", async () => {
      stripeMockInstance.paymentIntents.create.mockResolvedValue({ client_secret: "pi_eur" });

      const req = new NextRequest("http://localhost/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount: 20, currency: "eur" }),
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
      expect(stripeMockInstance.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({ currency: "eur" })
      );
    });
  });

  describe("Validierung und Fehler", () => {
    test("sollte 400 zurückgeben, wenn der Betrag fehlt oder null ist", async () => {
      const req = new NextRequest("http://localhost/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount: 0 }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid amount");
    });

    test("sollte 500 zurückgeben, wenn Stripe einen Fehler wirft", async () => {
      stripeMockInstance.paymentIntents.create.mockRejectedValue(new Error("Stripe Error"));

      const req = new NextRequest("http://localhost/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount: 50 }),
      });

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create payment intent");
    });

    test("sollte 500 zurückgeben bei ungültigem JSON", async () => {
      const req = new NextRequest("http://localhost/api/payment", {
        method: "POST",
        body: "kein-json",
      });

      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });
});