/**
 * @jest-environment jsdom
 */
import { GET } from "./route";
import { getSignedInUser } from "@/lib/loyalty/user-membership";

type MockedJsonResponse = {
  _status: number;
  _body: {
    authenticated?: boolean;
    userId?: string;
    email?: string | null;
    error?: string;
    app_metadata?: unknown;
  };
  json: () => Promise<unknown>;
};

// Mock für NextResponse
// Wir fügen '_body' und '_status' hinzu, damit die Tests darauf zugreifen können
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, config) => ({
      json: async () => data,
      _status: config?.status || 200,
      _body: data, // Hier speichern wir die Daten für den Test
    })),
  },
}));

// Mock für den user-membership Service
jest.mock("@/lib/loyalty/user-membership", () => ({
  getSignedInUser: jest.fn(),
}));

describe("GET /api/auth/session - Session API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Erfolgreiche Authentifizierung", () => {
    test("sollte authenticated: true zurückgeben wenn Benutzer angemeldet ist", async () => {
      const mockUser = { id: "user-123", email: "john@example.com" };
      (getSignedInUser as jest.Mock).mockResolvedValue(mockUser);

      const response = (await GET()) as MockedJsonResponse;

      expect(getSignedInUser).toHaveBeenCalled();
      expect(response._body).toEqual({
        authenticated: true,
        userId: "user-123",
        email: "john@example.com",
      });
    });

    test("sollte nur erlaubte Session-Felder zurückgeben", async () => {
      const mockUser = { 
        id: "user-789", 
        email: "jane@example.com",
        app_metadata: { role: "admin" } 
      };
      (getSignedInUser as jest.Mock).mockResolvedValue(mockUser);

      const response = (await GET()) as MockedJsonResponse;

      expect(response._body).toEqual({
        authenticated: true,
        userId: "user-789",
        email: "jane@example.com",
      });
      expect(response._body.app_metadata).toBeUndefined();
    });
  });

  describe("Fehlerfälle", () => {
    test("sollte authenticated: false zurückgeben wenn kein Benutzer angemeldet ist", async () => {
      (getSignedInUser as jest.Mock).mockResolvedValue(null);

      const response = (await GET()) as MockedJsonResponse;

      expect(response._body).toEqual({
        authenticated: false,
      });
    });

    test("sollte Status 500 bei einer Exception zurückgeben", async () => {
      (getSignedInUser as jest.Mock).mockRejectedValue(new Error("Datenbankfehler"));

      const response = (await GET()) as MockedJsonResponse;

      expect(response._status).toBe(500);
      expect(response._body).toEqual({
        error: "Internal server error",
      });
    });
  });

  describe("Edge Cases", () => {
    test("sollte mit leeren User IDs umgehen können", async () => {
      const mockUser = { id: "", email: null };
      (getSignedInUser as jest.Mock).mockResolvedValue(mockUser);

      const response = (await GET()) as MockedJsonResponse;

      expect(response._body.userId).toBe("");
      expect(response._body.authenticated).toBe(true);
      expect(response._body.email).toBeNull();
    });
  });
});