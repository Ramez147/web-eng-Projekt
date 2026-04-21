import { POST as signUp } from "./route";
import * as ssr from "@supabase/ssr";
import { cookies } from "next/headers";

jest.mock("next/headers");
jest.mock("@supabase/ssr");

describe("POST /api/auth/signup - Sign Up Route", () => {
  const mockCookies = {
    getAll: jest.fn().mockReturnValue([]),
    set: jest.fn(),
  };

  const mockSupabase = {
    auth: {
      signUp: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue(mockCookies);
    (ssr.createServerClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe("Input Validation", () => {
    test("seharusnya return error jika email tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ password: "password123" }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika password tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com" }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika keduanya tidak ada", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya return error jika body kosong", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and password are required");
    });

    test("seharusnya accept valid email", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };

      const mockSession = {
        access_token: "token123",
      };

      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);

      expect(response.status).toBe(200);
    });
  });

  describe("Successful Sign Up", () => {
    test("seharusnya sign up dengan email dan password yang valid", async () => {
      const mockUser = {
        id: "user-123",
        email: "newuser@example.com",
        aud: "authenticated",
      };

      const mockSession = {
        access_token: "token123",
        refresh_token: "refresh123",
      };

      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user).toEqual(mockUser);
      expect(data.session).toEqual(mockSession);
    });

    test("seharusnya call signUp dengan email dan password", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "password123",
        }),
      });

      await signUp(request);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
      });
    });

    test("seharusnya return user dan session", async () => {
      const mockUser = { id: "user-456" };
      const mockSession = { access_token: "token" };

      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(data.user).toEqual(mockUser);
      expect(data.session).toEqual(mockSession);
    });
  });

  describe("Sign Up Errors", () => {
    test("seharusnya return error jika email sudah terdaftar", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "User already exists" },
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "existing@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("User already exists");
    });

    test("seharusnya return error jika password terlalu lemah", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Password too weak" },
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Password too weak");
    });

    test("seharusnya return error dari Supabase", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Sign up failed" },
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Sign up failed");
    });

    test("seharusnya handle server error", async () => {
      (ssr.createServerClient as jest.Mock).mockImplementation(() => {
        throw new Error("Server error");
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("Cookie Management", () => {
    test("seharusnya get cookies saat sign up", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      await signUp(request);

      expect(cookies).toHaveBeenCalled();
    });
  });

  describe("Supabase Client Creation", () => {
    test("seharusnya create Supabase client dengan correct config", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      await signUp(request);

      expect(ssr.createServerClient).toHaveBeenCalled();
    });
  });

  describe("Response Format", () => {
    test("seharusnya return JSON dengan user dan session", async () => {
      const mockUser = { id: "user-123", email: "test@example.com" };
      const mockSession = { access_token: "token" };

      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("session");
    });

    test("seharusnya return JSON dengan error jika gagal", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signUp(request);
      const data = await response.json();

      expect(data).toHaveProperty("error");
    });
  });

  describe("HTTP Status Codes", () => {
    test("seharusnya return 200 saat sign up berhasil", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: "123" }, session: {} },
        error: null,
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);

      expect(response.status).toBe(200);
    });

    test("seharusnya return 400 saat validasi gagal", async () => {
      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await signUp(request);

      expect(response.status).toBe(400);
    });

    test("seharusnya return 400 saat sign up error dari Supabase", async () => {
      (mockSupabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Error" },
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);

      expect(response.status).toBe(400);
    });

    test("seharusnya return 500 saat server error", async () => {
      (ssr.createServerClient as jest.Mock).mockImplementation(() => {
        throw new Error("Error");
      });

      const request = new Request("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });

      const response = await signUp(request);

      expect(response.status).toBe(500);
    });
  });
});
