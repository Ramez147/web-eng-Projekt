import { POST as signIn } from "./route";
import * as ssr from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("next/headers");
jest.mock("@supabase/ssr");

describe("POST /api/auth/signin - Sign In Route", () => {
  const mockCookies = {
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  };

  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookies);
    (ssr.createServerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe("Input Validation", () => {
    test("seharusnya return error jika email tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ password: "password123" }),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika password tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com" }),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika keduanya tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika body kosong", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });
  });

  describe("Successful Sign In", () => {
    test("seharusnya sign in dengan email dan password yang valid", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        aud: "authenticated",
      };

      const mockSession = {
        access_token: "token123",
        refresh_token: "refresh123",
      };

      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.session).toEqual(mockSession);
    });

    test("seharusnya call signInWithPassword dengan email dan password", async () => {
      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      await signIn(request);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("Sign In Errors", () => {
    test("seharusnya return error dari Supabase jika sign in gagal", async () => {
      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "wrong",
        }),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid credentials");
    });

    test("seharusnya handle server error", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      // Mock throw error
      (ssr.createServerClient as jest.Mock).mockImplementation(() => {
        throw new Error("Server error");
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Cookie Management", () => {
    test("seharusnya get cookies saat sign in", async () => {
      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      await signIn(request);

      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("Supabase Client Creation", () => {
    test("seharusnya create Supabase client dengan correct config", async () => {
      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      await signIn(request);

      expect(ssr.createServerClient).toHaveBeenCalled();
    });
  });

  describe("Response Format", () => {
    test("seharusnya return JSON dengan user dan session", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      const mockSession = { access_token: "token" };

      (mockSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("session");
    });

    test("seharusnya return JSON dengan error jika gagal", async () => {
      const request = new Request("http://localhost:3000/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signIn(request);
      const data = await response.json();

      expect(data).toHaveProperty("error");
    });
  });
});
