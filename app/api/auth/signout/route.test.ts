import { POST as signOut } from "./route";
import * as ssr from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("next/headers");
jest.mock("@supabase/ssr");

describe("POST /api/auth/signout - Sign Out Route", () => {
  const mockCookies = {
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  };

  const mockSupabase = {
    auth: {
      signOut: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookies);
    (ssr.createServerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe("Successful Sign Out", () => {
    test("seharusnya sign out berhasil", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    test("seharusnya call signOut method", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      await signOut(request);

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    test("seharusnya return success true", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(data.success).toBe(true);
    });
  });

  describe("Sign Out Errors", () => {
    test("seharusnya return error jika signOut gagal", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Sign out failed" },
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Sign out failed");
    });

    test("seharusnya handle server error", async () => {
      (ssr.createServerClient as jest.Mock).mockImplementation(() => {
        throw new Error("Server error");
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });

    test("seharusnya handle network error", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Cookie Management", () => {
    test("seharusnya get cookies", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      await signOut(request);

      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("Supabase Client Creation", () => {
    test("seharusnya create Supabase client", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      await signOut(request);

      expect(ssr.createServerClient).toHaveBeenCalled();
    });
  });

  describe("Response Format", () => {
    test("seharusnya return JSON dengan success field", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(data).toHaveProperty("success");
      expect(typeof data.success).toBe("boolean");
    });

    test("seharusnya return JSON dengan error jika gagal", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Error" },
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);
      const data = await response.json();

      expect(data).toHaveProperty("error");
    });
  });

  describe("No Request Body Required", () => {
    test("seharusnya work tanpa request body", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);

      expect(response.status).toBe(200);
    });

    test("seharusnya work dengan empty body", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signOut(request);

      expect(response.status).toBe(200);
    });
  });

  describe("HTTP Status Codes", () => {
    test("seharusnya return 200 saat berhasil", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);

      expect(response.status).toBe(200);
    });

    test("seharusnya return 400 saat error dari Supabase", async () => {
      (mockSupabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Error" },
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);

      expect(response.status).toBe(400);
    });

    test("seharusnya return 500 saat server error", async () => {
      (ssr.createServerClient as jest.Mock).mockImplementation(() => {
        throw new Error("Error");
      });

      const request = new Request("http://localhost:3000/api/auth/signout", {
        method: "POST",
      });

      const response = await signOut(request);

      expect(response.status).toBe(500);
    });
  });
});
