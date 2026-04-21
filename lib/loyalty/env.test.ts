import { getRequiredEnv, getSupabaseEnv, getSupabasePublishableKey } from "./env";

describe("env utility functions", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe("getRequiredEnv", () => {
    it("returns the value if present", () => {
      process.env.TEST_KEY = "test-value";
      expect(getRequiredEnv("TEST_KEY")).toBe("test-value");
    });

    it("throws if the variable is missing", () => {
      delete process.env.TEST_KEY;
      expect(() => getRequiredEnv("TEST_KEY")).toThrow(
        "Missing required environment variable: TEST_KEY"
      );
    });
  });

  describe("getSupabaseEnv", () => {
    it("returns url and serviceRoleKey from env", () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "url";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "role-key";
      expect(getSupabaseEnv()).toEqual({
        url: "url",
        serviceRoleKey: "role-key",
      });
    });
  });

  describe("getSupabasePublishableKey", () => {
    it("returns publishable default key if present", () => {
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = "pub-key";
      expect(getSupabasePublishableKey()).toBe("pub-key");
    });

    it("returns anon key if default key is missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
      expect(getSupabasePublishableKey()).toBe("anon-key");
    });

    it("throws if both keys are missing", () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      expect(() => getSupabasePublishableKey()).toThrow(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    });
  });
});
