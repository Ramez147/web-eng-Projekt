/**
 * @jest-environment jsdom
 */
import { POST } from "./route";
import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { assertOrganizationApiKey } from "@/lib/loyalty/auth";

// 1. Mocking Database
jest.mock("@/lib/loyalty/db", () => ({
  getAdminSupabaseClient: jest.fn(),
}));

// 2. Mocking Auth
jest.mock("@/lib/loyalty/auth", () => ({
  assertOrganizationApiKey: jest.fn(),
}));

// 3. Mocking Error Response Utility
jest.mock("@/lib/loyalty/error-response", () => ({
  jsonError: jest.fn((msg) => ({
    _data: { error: msg },
    _status: 400,
  })),
}));

// 4. Mocking NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      _data: data,
      _status: init?.status || 200,
    })),
  },
}));

describe("Redeem Points API Route (V1)", () => {
  const mockSupabase = {
    rpc: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAdminSupabaseClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  // --- ARRANGE, ACT, ASSERT ---

  test("sollte Punkte erfolgreich einlösen (Status 200)", async () => {
    // ARRANGE: Siapkan input dan pura-pura database sukses
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        organizationId: "org_123",
        externalCustomerId: "cust_456",
        points: 50,
      }),
    };

    (assertOrganizationApiKey as jest.Mock).mockResolvedValue(true);

    mockSupabase.rpc.mockResolvedValue({
      data: [{
        status: "applied",
        profile_id: "prof_789",
        redeemed_points: 50,
        new_points_balance: 100,
        message: "Redemption successful",
      }],
      error: null,
    });

    // ACT: Jalankan fungsi
    const response = (await POST(mockReq as any)) as any;

    // ASSERT: Cek hasilnya
    expect(response._status).toBe(200);
    expect(response._data.status).toBe("applied");
    expect(response._data.newPointsBalance).toBe(100);
  });

  test("sollte Status 409 zurückgeben, wenn das Guthaben nicht ausreicht", async () => {
    // ARRANGE: Pura-pura saldo kurang
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        organizationId: "org_123",
        externalCustomerId: "cust_456",
        points: 5000,
      }),
    };

    mockSupabase.rpc.mockResolvedValue({
      data: [{
        status: "insufficient_points",
        message: "Not enough points",
        new_points_balance: 10,
      }],
      error: null,
    });

    // ACT
    const response = (await POST(mockReq as any)) as any;

    // ASSERT
    expect(response._status).toBe(409);
    expect(response._data.message).toBe("Not enough points");
  });

  test("sollte einen Fehler werfen, wenn organizationId fehlt", async () => {
    // ARRANGE: Kirim data kosong
    const mockReq = {
      json: jest.fn().mockResolvedValue({}),
    };

    // ACT
    const response = (await POST(mockReq as any)) as any;

    // ASSERT: Cek apakah validator kita bekerja
    expect(response._data.error).toBeDefined();
  });
});