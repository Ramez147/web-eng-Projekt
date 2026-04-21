/**
 * @jest-environment node
 */
import { GET } from "./route";
import { NextRequest } from "next/server";
import * as auth from "@/lib/loyalty/auth";
import * as db from "@/lib/loyalty/db";

jest.mock("@/lib/loyalty/auth");
jest.mock("@/lib/loyalty/db");

describe("GET /api/v1/analytics/overview", () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    (db.getAdminSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
    (auth.assertOrganizationApiKey as jest.Mock).mockResolvedValue(undefined);
  });

  // Fungsi helper untuk membuat request yang "pasti jalan" di Jest
  const createMockRequest = (url: string) => {
    const fullUrl = new URL(url);
    return {
      nextUrl: fullUrl,
      url: url,
      headers: new Headers(),
    } as unknown as NextRequest;
  };

  test("sollte vollständige Analytics-Daten zurückgeben", async () => {
    // Arrange: Siapkan data mock
    const mockOrg = { data: { id: "org-123", name: "Test Org", points_ratio: 10 }, error: null };
    const mockProfiles = { data: [{ id: "p1", total_spent_eur: 50, external_customer_id: "c1" }], error: null };
    const mockTxs = { 
      data: [{ id: "t1", transaction_type: "earn", points: 10, eur_amount: 1, created_at: "2024-01-01T10:00:00Z", profile_id: "p1" }], 
      error: null 
    };

    mockSupabase.from.mockImplementation((table: string) => {
      if (table === "organizations") return { select: () => ({ eq: () => ({ single: () => Promise.resolve(mockOrg) }) }) };
      if (table === "customer_profiles") return { select: () => ({ eq: () => Promise.resolve(mockProfiles) }) };
      if (table === "points_transactions") return { select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve(mockTxs) }) }) }) };
      return {};
    });

    // Act: Gunakan helper untuk membuat request
    const req = createMockRequest("http://localhost/api?organizationId=org-123");
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.analytics.customersCount).toBe(1);
  });

  test("sollte 400 zurückgeben, wenn organizationId fehlt", async () => {
    // Act: Request tanpa organizationId
    const req = createMockRequest("http://localhost/api");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing query parameter: organizationId");
  });
});