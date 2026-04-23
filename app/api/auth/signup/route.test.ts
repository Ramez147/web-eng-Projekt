import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus Signup Route)
export type SignUpRequest = {
  email: string;
  password: string;
};

export type SignUpSuccessResponse = {
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

export type SignUpErrorResponse = {
  error: string;
};

export type SignUpDatabaseResult = {
  user: {
    id: string;
    email: string;
    aud?: string;
  } | null;
  session: {
    access_token: string;
    refresh_token?: string;
  } | null;
  error?: {
    message: string;
  } | null;
};

export type ValidatedSignUpInput = {
  email: string;
  password: string;
};

export const SIGNUP_HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
} as const;

export const SIGNUP_ERRORS = {
  MISSING_FIELDS: "Email and password are required",
  EMPTY_EMAIL: "Email is required",
  EMPTY_PASSWORD: "Password is required",
  INVALID_EMAIL: "Invalid email format",
  USER_EXISTS: "User already exists",
  WEAK_PASSWORD: "Password too weak",
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

export function validateSignUpRequest(body: any): { valid: boolean; data?: ValidatedSignUpInput; error?: string } {
  if (!body) {
    return { valid: false, error: SIGNUP_ERRORS.MISSING_FIELDS };
  }

  const { email, password } = body;

  // Check for missing fields first
  if (!email && !password) {
    return { valid: false, error: SIGNUP_ERRORS.MISSING_FIELDS };
  }

  if (!email) {
    return { valid: false, error: SIGNUP_ERRORS.EMPTY_EMAIL };
  }

  if (!password) {
    return { valid: false, error: SIGNUP_ERRORS.EMPTY_PASSWORD };
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    return { valid: false, error: SIGNUP_ERRORS.EMPTY_EMAIL };
  }

  if (typeof password !== "string" || password.trim().length === 0) {
    return { valid: false, error: SIGNUP_ERRORS.EMPTY_PASSWORD };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: SIGNUP_ERRORS.INVALID_EMAIL };
  }

  return {
    valid: true,
    data: {
      email: email.trim(),
      password: password.trim(),
    },
  };
}

export function isValidSignUpResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    (result.user === null || (typeof result.user === "object" && typeof result.user.id === "string")) &&
    (result.session === null || (typeof result.session === "object" && typeof result.session.access_token === "string"))
  );
}

export function hasSignUpError(result: SignUpDatabaseResult): boolean {
  return result.error !== null && result.error !== undefined;
}

export function buildSuccessSignUpResponse(result: SignUpDatabaseResult): SignUpSuccessResponse {
  return {
    user: result.user!,
    session: result.session!,
  };
}

export function buildErrorSignUpResponse(errorMessage: string): SignUpErrorResponse {
  return { error: errorMessage };
}

export function getSignUpStatusCode(result: SignUpDatabaseResult): number {
  if (!hasSignUpError(result)) {
    return SIGNUP_HTTP_STATUS.SUCCESS;
  }
  return SIGNUP_HTTP_STATUS.BAD_REQUEST;
}

export function parseSignUpError(error: any): string {
  if (!error) return SIGNUP_ERRORS.SERVER_ERROR;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return SIGNUP_ERRORS.SERVER_ERROR;
}

export function validateSignUpFlow(body: any): { valid: boolean; errors: string[] } {
  const validation = validateSignUpRequest(body);
  const errors: string[] = [];

  if (!validation.valid && validation.error) {
    errors.push(validation.error);
  }

  return { valid: validation.valid, errors };
}

describe("Sign Up API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle HTTP Status Codes definieren", () => {
      expect(SIGNUP_HTTP_STATUS.SUCCESS).toBe(200);
      expect(SIGNUP_HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(SIGNUP_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(SIGNUP_ERRORS.MISSING_FIELDS).toBeTruthy();
      expect(SIGNUP_ERRORS.EMPTY_EMAIL).toBeTruthy();
      expect(SIGNUP_ERRORS.EMPTY_PASSWORD).toBeTruthy();
      expect(SIGNUP_ERRORS.SERVER_ERROR).toBeTruthy();
    });
  });

  describe("isValidEmail", () => {
    it("akzeptiert gültige E-Mails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user@domain.de")).toBe(true);
      expect(isValidEmail("newuser@example.com")).toBe(true);
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
      expect(isValidEmail(123)).toBe(false);
    });

    it("trimmt Whitespace", () => {
      expect(isValidEmail("  test@example.com  ")).toBe(true);
    });
  });

  describe("isValidPassword", () => {
    it("akzeptiert nicht-leere Passwörter", () => {
      expect(isValidPassword("password123")).toBe(true);
      expect(isValidPassword("123")).toBe(true);
      expect(isValidPassword("a")).toBe(true);
    });

    it("lehnt leere Passwörter ab", () => {
      expect(isValidPassword("")).toBe(false);
      expect(isValidPassword("   ")).toBe(false); // Spaces are valid characters
    });

    it("lehnt nicht-Strings ab", () => {
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
      expect(isValidPassword(123)).toBe(false);
    });
  });

  describe("validateSignUpRequest", () => {
    it("validiert kompletten Request", () => {
      const body = { email: "test@example.com", password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.email).toBe("test@example.com");
      expect(result.data?.password).toBe("password123");
    });

    it("lehnt null body ab", () => {
      const result = validateSignUpRequest(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.MISSING_FIELDS);
    });

    it("lehnt undefined body ab", () => {
      const result = validateSignUpRequest(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.MISSING_FIELDS);
    });

    it("lehnt Request ohne Email ab", () => {
      const body = { password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.EMPTY_EMAIL);
    });

    it("lehnt Request ohne Password ab", () => {
      const body = { email: "test@example.com" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.EMPTY_PASSWORD);
    });

    it("lehnt leere Email ab", () => {
      const body = { email: "", password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.EMPTY_EMAIL);
    });

    it("lehnt leeres Password ab", () => {
      const body = { email: "test@example.com", password: "" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.EMPTY_PASSWORD);
    });

    it("lehnt ungültige Email ab", () => {
      const body = { email: "invalidemail", password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(SIGNUP_ERRORS.INVALID_EMAIL);
    });

    it("trimmt Email", () => {
      const body = { email: "  test@example.com  ", password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data?.email).toBe("test@example.com");
    });

    it("lehnt leere Email mit Spaces ab", () => {
      const body = { email: "   ", password: "password123" };
      const result = validateSignUpRequest(body);
      expect(result.valid).toBe(false);
    });
  });

  describe("isValidSignUpResult", () => {
    it("validiert korrekte Success Result", () => {
      const result = {
        user: { id: "user-123", email: "test@example.com" },
        session: { access_token: "token123" },
        error: null,
      };
      expect(isValidSignUpResult(result)).toBe(true);
    });

    it("validiert Result mit Error", () => {
      const result = {
        user: null,
        session: null,
        error: { message: "User already exists" },
      };
      expect(isValidSignUpResult(result)).toBe(true);
    });

    it("lehnt Result ohne user Property ab", () => {
      const result = { session: { access_token: "token" } };
      expect(isValidSignUpResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidSignUpResult(null)).toBe(false);
    });
  });

  describe("hasSignUpError", () => {
    it("gibt true für Result mit Error zurück", () => {
      const result: SignUpDatabaseResult = {
        user: null,
        session: null,
        error: { message: "User already exists" },
      };
      expect(hasSignUpError(result)).toBe(true);
    });

    it("gibt false für Result ohne Error zurück", () => {
      const result: SignUpDatabaseResult = {
        user: { id: "123", email: "test@example.com" },
        session: { access_token: "token" },
        error: null,
      };
      expect(hasSignUpError(result)).toBe(false);
    });

    it("gibt false für undefined Error zurück", () => {
      const result: SignUpDatabaseResult = {
        user: { id: "123", email: "test@example.com" },
        session: { access_token: "token" },
      };
      expect(hasSignUpError(result)).toBe(false);
    });
  });

  describe("buildSuccessSignUpResponse", () => {
    it("baut Success Response korrekt", () => {
      const result: SignUpDatabaseResult = {
        user: { id: "user-123", email: "test@example.com" },
        session: { access_token: "token123", refresh_token: "refresh123" },
        error: null,
      };

      const response = buildSuccessSignUpResponse(result);

      expect(response.user).toEqual({ id: "user-123", email: "test@example.com" });
      expect(response.session).toEqual({ access_token: "token123", refresh_token: "refresh123" });
    });

    it("baut Response mit aud Property", () => {
      const result: SignUpDatabaseResult = {
        user: { id: "user-123", email: "test@example.com", aud: "authenticated" },
        session: { access_token: "token123" },
        error: null,
      };

      const response = buildSuccessSignUpResponse(result);

      expect(response.user.aud).toBe("authenticated");
    });
  });

  describe("buildErrorSignUpResponse", () => {
    it("baut Error Response korrekt", () => {
      const response = buildErrorSignUpResponse("User already exists");

      expect(response).toEqual({ error: "User already exists" });
    });

    it("verarbeitet verschiedene Error Messages", () => {
      const errors = [
        "User already exists",
        "Password too weak",
        "Invalid email format",
      ];

      errors.forEach((error) => {
        const response = buildErrorSignUpResponse(error);
        expect(response.error).toBe(error);
      });
    });
  });

  describe("getSignUpStatusCode", () => {
    it("gibt 200 für erfolgreiches Sign Up zurück", () => {
      const result: SignUpDatabaseResult = {
        user: { id: "123", email: "test@example.com" },
        session: { access_token: "token" },
        error: null,
      };
      expect(getSignUpStatusCode(result)).toBe(200);
    });

    it("gibt 400 für Sign Up mit Error zurück", () => {
      const result: SignUpDatabaseResult = {
        user: null,
        session: null,
        error: { message: "User already exists" },
      };
      expect(getSignUpStatusCode(result)).toBe(400);
    });
  });

  describe("parseSignUpError", () => {
    it("gibt Error Message zurück", () => {
      const error = { message: "User already exists" };
      expect(parseSignUpError(error)).toBe("User already exists");
    });

    it("gibt string Error direkt zurück", () => {
      expect(parseSignUpError("Sign up failed")).toBe("Sign up failed");
    });

    it("gibt Server Error für null zurück", () => {
      expect(parseSignUpError(null)).toBe(SIGNUP_ERRORS.SERVER_ERROR);
    });

    it("gibt Server Error für undefined zurück", () => {
      expect(parseSignUpError(undefined)).toBe(SIGNUP_ERRORS.SERVER_ERROR);
    });
  });

  describe("validateSignUpFlow", () => {
    it("validiert kompletten Flow", () => {
      const body = { email: "test@example.com", password: "password123" };
      const validation = validateSignUpFlow(body);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültigen Request", () => {
      const body = {};
      const validation = validateSignUpFlow(body);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Sign Up API Integration", () => {
    it("kompletter Flow: Success", () => {
      const body = { email: "newuser@example.com", password: "password123" };

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: SignUpDatabaseResult = {
        user: { id: "user-123", email: "newuser@example.com", aud: "authenticated" },
        session: { access_token: "token123", refresh_token: "refresh123" },
        error: null,
      };

      expect(isValidSignUpResult(dbResult)).toBe(true);
      expect(hasSignUpError(dbResult)).toBe(false);
      expect(getSignUpStatusCode(dbResult)).toBe(200);

      const response = buildSuccessSignUpResponse(dbResult);
      expect(response.user.id).toBe("user-123");
      expect(response.session.access_token).toBe("token123");
    });

    it("kompletter Flow: User Already Exists", () => {
      const body = { email: "existing@example.com", password: "password123" };

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: SignUpDatabaseResult = {
        user: null,
        session: null,
        error: { message: "User already exists" },
      };

      expect(hasSignUpError(dbResult)).toBe(true);
      expect(getSignUpStatusCode(dbResult)).toBe(400);

      const response = buildErrorSignUpResponse(dbResult.error!.message);
      expect(response.error).toBe("User already exists");
    });

    it("kompletter Flow: Password Too Weak", () => {
      const body = { email: "test@example.com", password: "123" };

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(true); // Password validation only checks length

      const dbResult: SignUpDatabaseResult = {
        user: null,
        session: null,
        error: { message: "Password too weak" },
      };

      expect(hasSignUpError(dbResult)).toBe(true);
      const response = buildErrorSignUpResponse(parseSignUpError(dbResult.error));
      expect(response.error).toBe("Password too weak");
    });

    it("Input Validation: Missing Email", () => {
      const body = { password: "password123" };

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(SIGNUP_ERRORS.EMPTY_EMAIL);
    });

    it("Input Validation: Missing Password", () => {
      const body = { email: "test@example.com" };

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(SIGNUP_ERRORS.EMPTY_PASSWORD);
    });

    it("Input Validation: Both Missing", () => {
      const body = {};

      const validation = validateSignUpRequest(body);
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe(SIGNUP_ERRORS.MISSING_FIELDS);
    });

    it("Response Format: Success", () => {
      const dbResult: SignUpDatabaseResult = {
        user: { id: "user-123", email: "test@example.com" },
        session: { access_token: "token" },
        error: null,
      };

      const response = buildSuccessSignUpResponse(dbResult);
      expect(response).toHaveProperty("user");
      expect(response).toHaveProperty("session");
      expect(response.user.id).toBe("user-123");
    });

    it("Response Format: Error", () => {
      const response = buildErrorSignUpResponse("Error message");
      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Error message");
    });

    it("Multiple Registration Attempts", () => {
      const requests = [
        { email: "user1@example.com", password: "pass1" },
        { email: "user2@example.com", password: "pass2" },
        { email: "user3@example.com", password: "pass3" },
      ];

      requests.forEach((req) => {
        const validation = validateSignUpRequest(req);
        expect(validation.valid).toBe(true);
      });
    });
  });
});
