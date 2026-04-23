import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus SignIn Route)
export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInSuccessResponse = {
  user: {
    id: string;
    email: string;
    aud?: string;
  };
  session: {
    access_token: string;
    refresh_token?: string;
  };
};

export type SignInErrorResponse = {
  error: string;
};

export type SignInDatabaseResult = {
  data: {
    user: {
      id: string;
      email: string;
      aud?: string;
    } | null;
    session: {
      access_token: string;
      refresh_token?: string;
    } | null;
  } | null;
  error?: {
    message: string;
  } | null;
};

export type ValidatedSignInInput = {
  email: string;
  password: string;
};

export const SIGNIN_HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
} as const;

export const SIGNIN_ERRORS = {
  MISSING_FIELDS: "Email and password are required",
  EMPTY_EMAIL: "Email is required",
  EMPTY_PASSWORD: "Password is required",
  INVALID_CREDENTIALS: "Invalid credentials",
  SERVER_ERROR: "Internal server error",
} as const;

// Pure utility functions
export function isValidEmail(email: any): boolean {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length === 0) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function isValidPassword(password: any): boolean {
  if (typeof password !== "string") return false;
  return password.trim().length >= 1; // At least 1 character after trimming
}

export function validateSignInRequest(body: any): { valid: boolean; data?: ValidatedSignInInput; error?: string } {
  if (!body) {
    return { valid: false, error: SIGNIN_ERRORS.MISSING_FIELDS };
  }

  const { email, password } = body;

  // Check for missing fields first
  if (!email && !password) {
    return { valid: false, error: SIGNIN_ERRORS.MISSING_FIELDS };
  }

  if (!email) {
    return { valid: false, error: SIGNIN_ERRORS.EMPTY_EMAIL };
  }

  if (!password) {
    return { valid: false, error: SIGNIN_ERRORS.EMPTY_PASSWORD };
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return { valid: false, error: SIGNIN_ERRORS.EMPTY_EMAIL };
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, error: SIGNIN_ERRORS.EMPTY_PASSWORD };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: SIGNIN_ERRORS.MISSING_FIELDS };
  }

  return {
    valid: true,
    data: {
      email: email.trim(),
      password: password.trim(),
    },
  };
}

export function isValidSignInResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    (result.data === null || (typeof result.data === "object" && typeof result.data.user === "object"))
  );
}

export function hasSignInError(result: SignInDatabaseResult): boolean {
  return result.error !== null && result.error !== undefined;
}

export function buildSuccessSignInResponse(result: SignInDatabaseResult): SignInSuccessResponse {
  return {
    user: result.data!.user!,
    session: result.data!.session!,
  };
}

export function buildErrorSignInResponse(errorMessage: string): SignInErrorResponse {
  return { error: errorMessage };
}

export function getSignInStatusCode(result: SignInDatabaseResult): number {
  if (!hasSignInError(result) && result.data) {
    return SIGNIN_HTTP_STATUS.SUCCESS;
  }
  return SIGNIN_HTTP_STATUS.BAD_REQUEST;
}

export function parseSignInError(error: any): string {
  if (!error) return SIGNIN_ERRORS.SERVER_ERROR;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return SIGNIN_ERRORS.SERVER_ERROR;
}

export function validateSignInFlow(body: any, result?: SignInDatabaseResult): { valid: boolean; errors: string[] } {
  const validation = validateSignInRequest(body);
  const errors: string[] = [];

  if (!validation.valid && validation.error) {
    errors.push(validation.error);
  }

  if (result && hasSignInError(result) && result.error?.message) {
    errors.push(result.error.message);
  }

  return { valid: validation.valid && (!result || !hasSignInError(result)), errors };
}

describe("Sign In API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle HTTP Status Codes definieren", () => {
      expect(SIGNIN_HTTP_STATUS.SUCCESS).toBe(200);
      expect(SIGNIN_HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(SIGNIN_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(SIGNIN_ERRORS.MISSING_FIELDS).toBeTruthy();
      expect(SIGNIN_ERRORS.EMPTY_EMAIL).toBeTruthy();
      expect(SIGNIN_ERRORS.EMPTY_PASSWORD).toBeTruthy();
      expect(SIGNIN_ERRORS.SERVER_ERROR).toBeTruthy();
    });
  });

  describe("isValidEmail", () => {
    it("akzeptiert gültige E-Mails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user@domain.de")).toBe(true);
    });

    it("lehnt E-Mails ohne @ ab", () => {
      expect(isValidEmail("testexample.com")).toBe(false);
    });

    it("lehnt leere Strings ab", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("   ")).toBe(false);
    });

    it("lehnt nicht-Strings ab", () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("akzeptiert nicht-leere Passwörter", () => {
      expect(isValidPassword("password123")).toBe(true);
      expect(isValidPassword("123")).toBe(true);
    });

    it("lehnt leere Passwörter ab", () => {
      expect(isValidPassword("")).toBe(false);
      expect(isValidPassword("   ")).toBe(false);
    });

    it("lehnt nicht-Strings ab", () => {
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
    });
  });

  describe("validateSignInRequest", () => {
    it("validiert kompletten Request", () => {
      const body = { email: "test@example.com", password: "password123" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.email).toBe("test@example.com");
    });

    it("lehnt null body ab", () => {
      const result = validateSignInRequest(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNIN_ERRORS.MISSING_FIELDS);
    });

    it("lehnt Request ohne Email ab", () => {
      const body = { password: "password123" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNIN_ERRORS.EMPTY_EMAIL);
    });

    it("lehnt Request ohne Password ab", () => {
      const body = { email: "test@example.com" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNIN_ERRORS.EMPTY_PASSWORD);
    });

    it("lehnt leere Email ab", () => {
      const body = { email: "", password: "password123" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNIN_ERRORS.EMPTY_EMAIL);
    });

    it("lehnt leeres Password ab", () => {
      const body = { email: "test@example.com", password: "" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNIN_ERRORS.EMPTY_PASSWORD);
    });

    it("trimmt Email", () => {
      const body = { email: "  test@example.com  ", password: "password123" };
      const result = validateSignInRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data?.email).toBe("test@example.com");
    });
  });

  describe("isValidSignInResult", () => {
    it("validiert korrekte Success Result", () => {
      const result = {
        data: {
          user: { id: "user-123", email: "test@example.com" },
          session: { access_token: "token123" },
        },
        error: null,
      };
      expect(isValidSignInResult(result)).toBe(true);
    });

    it("validiert Result mit Error", () => {
      const result = {
        data: null,
        error: { message: "Invalid credentials" },
      };
      expect(isValidSignInResult(result)).toBe(true);
    });

    it("lehnt Result ohne data Property ab", () => {
      const result = { error: null };
      expect(isValidSignInResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidSignInResult(null)).toBe(false);
    });
  });

  describe("hasSignInError", () => {
    it("gibt true für Result mit Error zurück", () => {
      const result: SignInDatabaseResult = {
        data: null,
        error: { message: "Invalid credentials" },
      };
      expect(hasSignInError(result)).toBe(true);
    });

    it("gibt false für Result ohne Error zurück", () => {
      const result: SignInDatabaseResult = {
        data: { user: { id: "123", email: "test@example.com" }, session: { access_token: "token" } },
        error: null,
      };
      expect(hasSignInError(result)).toBe(false);
    });
  });

  describe("buildSuccessSignInResponse", () => {
    it("baut Success Response korrekt", () => {
      const result: SignInDatabaseResult = {
        data: {
          user: { id: "user-123", email: "test@example.com", aud: "authenticated" },
          session: { access_token: "token123", refresh_token: "refresh123" },
        },
        error: null,
      };

      const response = buildSuccessSignInResponse(result);

      expect(response.user).toEqual({ id: "user-123", email: "test@example.com", aud: "authenticated" });
      expect(response.session.access_token).toBe("token123");
    });
  });

  describe("buildErrorSignInResponse", () => {
    it("baut Error Response korrekt", () => {
      const response = buildErrorSignInResponse("Invalid credentials");

      expect(response).toEqual({ error: "Invalid credentials" });
    });

    it("verarbeitet verschiedene Error Messages", () => {
      const errors = ["Invalid credentials", "User not found", "Wrong password"];

      errors.forEach((error) => {
        const response = buildErrorSignInResponse(error);
        expect(response.error).toBe(error);
      });
    });
  });

  describe("getSignInStatusCode", () => {
    it("gibt 200 für erfolgreiches Sign In zurück", () => {
      const result: SignInDatabaseResult = {
        data: {
          user: { id: "123", email: "test@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      };
      expect(getSignInStatusCode(result)).toBe(200);
    });

    it("gibt 400 für Sign In mit Error zurück", () => {
      const result: SignInDatabaseResult = {
        data: null,
        error: { message: "Invalid credentials" },
      };
      expect(getSignInStatusCode(result)).toBe(400);
    });
  });

  describe("parseSignInError", () => {
    it("gibt Error Message zurück", () => {
      const error = { message: "Invalid credentials" };
      expect(parseSignInError(error)).toBe("Invalid credentials");
    });

    it("gibt string Error direkt zurück", () => {
      expect(parseSignInError("Invalid credentials")).toBe("Invalid credentials");
    });

    it("gibt Server Error für null zurück", () => {
      expect(parseSignInError(null)).toBe(SIGNIN_ERRORS.SERVER_ERROR);
    });

    it("gibt Server Error für undefined zurück", () => {
      expect(parseSignInError(undefined)).toBe(SIGNIN_ERRORS.SERVER_ERROR);
    });
  });

  describe("validateSignInFlow", () => {
    it("validiert kompletten Flow", () => {
      const body = { email: "test@example.com", password: "password123" };
      const validation = validateSignInFlow(body);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültigen Request", () => {
      const body = {};
      const validation = validateSignInFlow(body);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("sammelt Fehler für Datenbank Error", () => {
      const body = { email: "test@example.com", password: "password123" };
      const result: SignInDatabaseResult = {
        data: null,
        error: { message: "Invalid credentials" },
      };
      const validation = validateSignInFlow(body, result);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Sign In API Integration", () => {
    it("kompletter Flow: Success", () => {
      const body = { email: "test@example.com", password: "password123" };

      const validation = validateSignInRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: SignInDatabaseResult = {
        data: {
          user: { id: "user-123", email: "test@example.com", aud: "authenticated" },
          session: { access_token: "token123", refresh_token: "refresh123" },
        },
        error: null,
      };

      expect(isValidSignInResult(dbResult)).toBe(true);
      expect(hasSignInError(dbResult)).toBe(false);
      expect(getSignInStatusCode(dbResult)).toBe(200);

      const response = buildSuccessSignInResponse(dbResult);
      expect(response.user.id).toBe("user-123");
      expect(response.session.access_token).toBe("token123");
    });

    it("kompletter Flow: Invalid Credentials", () => {
      const body = { email: "test@example.com", password: "wrong" };

      const validation = validateSignInRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: SignInDatabaseResult = {
        data: null,
        error: { message: "Invalid credentials" },
      };

      expect(hasSignInError(dbResult)).toBe(true);
      expect(getSignInStatusCode(dbResult)).toBe(400);

      const response = buildErrorSignInResponse(parseSignInError(dbResult.error));
      expect(response.error).toBe("Invalid credentials");
    });

    it("kompletter Flow: Missing Email", () => {
      const body = { password: "password123" };

      const validation = validateSignInRequest(body);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(SIGNIN_ERRORS.EMPTY_EMAIL);
    });

    it("kompletter Flow: Missing Password", () => {
      const body = { email: "test@example.com" };

      const validation = validateSignInRequest(body);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(SIGNIN_ERRORS.EMPTY_PASSWORD);
    });

    it("Response Format: Success", () => {
      const dbResult: SignInDatabaseResult = {
        data: {
          user: { id: "user-123", email: "test@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      };

      const response = buildSuccessSignInResponse(dbResult);
      expect(response).toHaveProperty("user");
      expect(response).toHaveProperty("session");
    });

    it("Response Format: Error", () => {
      const response = buildErrorSignInResponse("Invalid credentials");
      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Invalid credentials");
    });

    it("Status Code Mapping: Success", () => {
      const result: SignInDatabaseResult = {
        data: {
          user: { id: "123", email: "test@example.com" },
          session: { access_token: "token" },
        },
        error: null,
      };
      const statusCode = getSignInStatusCode(result);
      expect(statusCode).toBe(SIGNIN_HTTP_STATUS.SUCCESS);
    });

    it("Status Code Mapping: Error", () => {
      const result: SignInDatabaseResult = {
        data: null,
        error: { message: "Error" },
      };
      const statusCode = getSignInStatusCode(result);
      expect(statusCode).toBe(SIGNIN_HTTP_STATUS.BAD_REQUEST);
    });

    it("Multiple Sign In Attempts", () => {
      const requests = [
        { email: "user1@example.com", password: "pass1" },
        { email: "user2@example.com", password: "pass2" },
        { email: "user3@example.com", password: "pass3" },
      ];

      requests.forEach((req) => {
        const validation = validateSignInRequest(req);
        expect(validation.valid).toBe(true);
      });
    });

    it("Error Message Parsing Consistency", () => {
      const errors = [
        { message: "Invalid credentials" },
        { message: "User not found" },
        { message: "Wrong password" },
      ];

      errors.forEach((error) => {
        const parsed = parseSignInError(error);
        const response = buildErrorSignInResponse(parsed);

        expect(response.error).toBe(error.message);
      });
    });
  });
});
