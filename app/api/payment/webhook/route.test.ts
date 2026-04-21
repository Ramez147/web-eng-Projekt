// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

// Mock headers
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

const mockStripe = require("stripe");
const { headers } = require("next/headers");

describe("POST /api/payment/webhook - Stripe Webhook Route", () => {
  let POST: any;
  let NextRequest: any;

  beforeAll(() => {
    jest.isolateModules(() => {
      // Set environment variables before importing the route
      process.env.STRIPE_SECRET_KEY = "test_stripe_secret_key";
      process.env.STRIPE_WEBHOOK_SECRET = "test_webhook_secret";

      // Import the route module
      const routeModule = require("./route");
      POST = routeModule.POST;
      NextRequest = require("next/server").NextRequest;
    });
  });

  const mockStripeInstance = {
    webhooks: {
      constructEvent: jest.fn(),
    },
  };

  const mockHeaders = new Map([
    ["stripe-signature", "t=1234567890,v1=test_signature"],
    ["content-type", "application/json"],
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
    (mockStripe as jest.Mock).mockReturnValue(mockStripeInstance);
    (headers as jest.Mock).mockResolvedValue(mockHeaders);
  });

  describe("Erfolgreiche Webhook-Verarbeitung", () => {
    test("seharusnya payment_intent.succeeded Event erfolgreich verarbeiten", async () => {
      const mockEvent = {
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_test_123",
            amount: 1000,
            currency: "usd",
          },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ received: true });
      expect(mockStripeInstance.webhooks.constructEvent).toHaveBeenCalledWith(
        JSON.stringify(mockEvent),
        "t=1234567890,v1=test_signature",
        "test_webhook_secret"
      );
    });

    test("seharusnya payment_method.attached Event erfolgreich verarbeiten", async () => {
      const mockEvent = {
        type: "payment_method.attached",
        data: {
          object: {
            id: "pm_test_123",
            type: "card",
          },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ received: true });
    });

    test("seharusnya unbekannte Event-Typen protokollieren", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const mockEvent = {
        type: "unknown.event.type",
        data: {
          object: { id: "test_id" },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ received: true });
      expect(consoleSpy).toHaveBeenCalledWith("Unhandled event type unknown.event.type");

      consoleSpy.mockRestore();
    });
  });

  describe("Webhook-Signatur-Verifizierung", () => {
    test("seharusnya 400 Fehler zurückgeben bei ungültiger Signatur", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Webhook error" });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Webhook signature verification failed.",
        "Invalid signature"
      );

      consoleSpy.mockRestore();
    });

    test("seharusnya 400 Fehler zurückgeben bei fehlender Stripe-Signatur", async () => {
      const mockHeadersWithoutSig = new Map([
        ["content-type", "application/json"],
      ]);

      (headers as jest.Mock).mockResolvedValue(mockHeadersWithoutSig);

      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("No signature");
      });

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Webhook error" });
    });

    test("seharusnya 400 Fehler zurückgeben bei fehlendem Webhook-Secret", async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;

      mockStripeInstance.webhooks.constructEvent.mockImplementation(() => {
        throw new Error("No webhook secret");
      });

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify({ type: "test.event" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "Webhook error" });
    });
  });

  describe("Stripe Integration", () => {
    test("seharusnya Stripe mit korrektem Secret Key initialisieren", async () => {
      process.env.STRIPE_SECRET_KEY = "custom_secret_key_123";

      const mockEvent = {
        type: "payment_intent.succeeded",
        data: { object: { id: "pi_test" } },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      await POST(request);

      expect(mockStripe).toHaveBeenCalledWith("custom_secret_key_123");
    });

    test("seharusnya constructEvent mit korrekten Parametern aufrufen", async () => {
      const mockEvent = {
        type: "payment_intent.succeeded",
        data: { object: { id: "pi_test" } },
      };

      const requestBody = JSON.stringify(mockEvent);
      const signature = "t=1234567890,v1=test_signature_123";

      const mockHeadersWithCustomSig = new Map([
        ["stripe-signature", signature],
        ["content-type", "application/json"],
      ]);

      (headers as jest.Mock).mockResolvedValue(mockHeadersWithCustomSig);

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: requestBody,
      });

      await POST(request);

      expect(mockStripeInstance.webhooks.constructEvent).toHaveBeenCalledWith(
        requestBody,
        signature,
        "test_webhook_secret"
      );
    });
  });

  describe("Event-Handling", () => {
    test("seharusnya payment_intent.succeeded Event korrekt loggen", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const mockEvent = {
        type: "payment_intent.succeeded",
        data: {
          object: {
            id: "pi_success_123",
            amount: 2500,
            currency: "usd",
          },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        "PaymentIntent was successful!",
        "pi_success_123"
      );

      consoleSpy.mockRestore();
    });

    test("seharusnya payment_method.attached Event korrekt loggen", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const mockEvent = {
        type: "payment_method.attached",
        data: {
          object: {
            id: "pm_attached_123",
            type: "card",
          },
        },
      };

      mockStripeInstance.webhooks.constructEvent.mockReturnValue(mockEvent);

      const request = new NextRequest("http://localhost:3000/api/payment/webhook", {
        method: "POST",
        body: JSON.stringify(mockEvent),
      });

      await POST(request);

      expect(consoleSpy).toHaveBeenCalledWith(
        "PaymentMethod was attached to a Customer!",
        "pm_attached_123"
      );

      consoleSpy.mockRestore();
    });
  });
});