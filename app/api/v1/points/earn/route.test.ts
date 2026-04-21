/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "./route";
import * as auth from "@/lib/loyalty/auth";

// Mocking the auth helper
jest.mock("@/lib/loyalty/auth", () => ({
  assertOrganizationApiKey: jest.fn(),
}));

describe("POST /api/v1/points/earn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sollte 401 zurückgeben, wenn die Authentifizierung fehlschlägt", async () => {
    // Pesan error HARUS mengandung kata 'unauthorized' agar status menjadi 401
    (auth.assertOrganizationApiKey as jest.Mock).mockRejectedValue(
      new Error("Unauthorized: Bitte anmelden")
    );

    const body = {
      organizationId: "org-123",
      externalCustomerId: "cust-001",
      amountEur: 10,
    };

    const req = new NextRequest("http://localhost/api/v1/points/earn", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    
    // Hasil sekarang akan menjadi 401
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain("Unauthorized");
  });

  test("sollte 400 zurückgeben bei fehlenden Pflichtfeldern", async () => {
    const req = new NextRequest("http://localhost/api/v1/points/earn", {
      method: "POST",
      body: JSON.stringify({ amountEur: 10 }), // organizationId fehlt
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});