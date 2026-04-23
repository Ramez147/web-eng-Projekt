import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus Session Route)
export type User = {
  id: string;
  email?: string | null;
  [key: string]: any;
};

export type AuthenticatedSessionResponse = {
  authenticated: true;
  userId: string;
  email: string | null;
};

export type UnauthenticatedSessionResponse = {
  authenticated: false;
};

export type ErrorSessionResponse = {
  error: string;
};

export type SessionResponse = AuthenticatedSessionResponse | UnauthenticatedSessionResponse | ErrorSessionResponse;

export type SessionCheckResult = {
  user: User | null;
  error?: Error;
};

export const SESSION_HTTP_STATUS = {
  SUCCESS: 200,
  SERVER_ERROR: 500,
} as const;

export const SESSION_ERRORS = {
  SERVER_ERROR: "Internal server error",
} as const;

// Pure utility functions
export function isValidUser(user: any): boolean {
  return (
    typeof user === "object" &&
    user !== null &&
    typeof user.id === "string"
  );
}

export function buildAuthenticatedSessionResponse(user: User): AuthenticatedSessionResponse {
  return {
    authenticated: true,
    userId: user.id,
    email: user.email ?? null,
  };
}

export function buildUnauthenticatedSessionResponse(): UnauthenticatedSessionResponse {
  return {
    authenticated: false,
  };
}

export function buildErrorSessionResponse(error: string = SESSION_ERRORS.SERVER_ERROR): ErrorSessionResponse {
  return { error };
}

export function getSessionStatusCode(hasError: boolean): number {
  return hasError ? SESSION_HTTP_STATUS.SERVER_ERROR : SESSION_HTTP_STATUS.SUCCESS;
}

export function buildSessionResponse(checkResult: SessionCheckResult): { response: SessionResponse; statusCode: number } {
  if (checkResult.error) {
    return {
      response: buildErrorSessionResponse(SESSION_ERRORS.SERVER_ERROR),
      statusCode: getSessionStatusCode(true),
    };
  }

  if (!checkResult.user) {
    return {
      response: buildUnauthenticatedSessionResponse(),
      statusCode: getSessionStatusCode(false),
    };
  }

  return {
    response: buildAuthenticatedSessionResponse(checkResult.user),
    statusCode: getSessionStatusCode(false),
  };
}

export function validateSessionResponse(response: any): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    (response.authenticated === true || response.authenticated === false || response.error !== undefined)
  );
}

describe("Session API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle HTTP Status Codes definieren", () => {
      expect(SESSION_HTTP_STATUS.SUCCESS).toBe(200);
      expect(SESSION_HTTP_STATUS.SERVER_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(SESSION_ERRORS.SERVER_ERROR).toBeTruthy();
    });
  });

  describe("isValidUser", () => {
    it("validiert korrekte User", () => {
      const user = { id: "user-123", email: "test@example.com" };
      expect(isValidUser(user)).toBe(true);
    });

    it("validiert User mit minimalen Feldern", () => {
      const user = { id: "user-123" };
      expect(isValidUser(user)).toBe(true);
    });

    it("lehnt User ohne id ab", () => {
      const user = { email: "test@example.com" };
      expect(isValidUser(user)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidUser(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidUser(undefined)).toBe(false);
    });

    it("lehnt Strings ab", () => {
      expect(isValidUser("user-123")).toBe(false);
    });
  });

  describe("buildAuthenticatedSessionResponse", () => {
    it("baut korrekte authentifizierte Response", () => {
      const user: User = { id: "user-123", email: "john@example.com" };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response).toEqual({
        authenticated: true,
        userId: "user-123",
        email: "john@example.com",
      });
    });

    it("setzt email auf null wenn nicht vorhanden", () => {
      const user: User = { id: "user-456" };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response.email).toBeNull();
    });

    it("ignoriert zusätzliche User-Felder", () => {
      const user: User = {
        id: "user-789",
        email: "jane@example.com",
        app_metadata: { role: "admin" },
      };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response).not.toHaveProperty("app_metadata");
      expect(response.authenticated).toBe(true);
    });

    it("handhabt null email", () => {
      const user: User = { id: "user-123", email: null };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response.email).toBeNull();
    });

    it("handhabt leere User IDs", () => {
      const user: User = { id: "", email: "test@example.com" };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response.userId).toBe("");
      expect(response.authenticated).toBe(true);
    });
  });

  describe("buildUnauthenticatedSessionResponse", () => {
    it("baut korrekte unauthentifizierte Response", () => {
      const response = buildUnauthenticatedSessionResponse();

      expect(response).toEqual({ authenticated: false });
    });

    it("gibt immer gleiche Response zurück", () => {
      const response1 = buildUnauthenticatedSessionResponse();
      const response2 = buildUnauthenticatedSessionResponse();

      expect(response1).toEqual(response2);
    });
  });

  describe("buildErrorSessionResponse", () => {
    it("baut Error Response mit default message", () => {
      const response = buildErrorSessionResponse();

      expect(response).toEqual({ error: SESSION_ERRORS.SERVER_ERROR });
    });

    it("baut Error Response mit custom message", () => {
      const response = buildErrorSessionResponse("Custom error");

      expect(response).toEqual({ error: "Custom error" });
    });
  });

  describe("getSessionStatusCode", () => {
    it("gibt 200 für Success zurück", () => {
      expect(getSessionStatusCode(false)).toBe(200);
    });

    it("gibt 500 für Error zurück", () => {
      expect(getSessionStatusCode(true)).toBe(500);
    });
  });

  describe("buildSessionResponse", () => {
    it("baut Response für authentifizierten User", () => {
      const checkResult: SessionCheckResult = {
        user: { id: "user-123", email: "test@example.com" },
        error: undefined,
      };

      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(200);
      expect((response as AuthenticatedSessionResponse).authenticated).toBe(true);
      expect((response as AuthenticatedSessionResponse).userId).toBe("user-123");
    });

    it("baut Response für unauthentifizierten User", () => {
      const checkResult: SessionCheckResult = {
        user: null,
        error: undefined,
      };

      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(200);
      expect((response as UnauthenticatedSessionResponse).authenticated).toBe(false);
    });

    it("baut Response für Error", () => {
      const checkResult: SessionCheckResult = {
        user: null,
        error: new Error("Database error"),
      };

      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(500);
      expect((response as ErrorSessionResponse).error).toBe(SESSION_ERRORS.SERVER_ERROR);
    });
  });

  describe("validateSessionResponse", () => {
    it("validiert authentifizierte Response", () => {
      const response: AuthenticatedSessionResponse = {
        authenticated: true,
        userId: "user-123",
        email: "test@example.com",
      };
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("validiert unauthentifizierte Response", () => {
      const response: UnauthenticatedSessionResponse = {
        authenticated: false,
      };
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("validiert Error Response", () => {
      const response: ErrorSessionResponse = {
        error: "Error message",
      };
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("lehnt ungültige Response ab", () => {
      expect(validateSessionResponse({})).toBe(false);
      expect(validateSessionResponse(null)).toBe(false);
      expect(validateSessionResponse("invalid")).toBe(false);
    });
  });

  describe("Session API Integration", () => {
    it("kompletter Flow: Authentifizierter User", () => {
      const user: User = { id: "user-123", email: "john@example.com" };
      const checkResult: SessionCheckResult = { user, error: undefined };

      expect(isValidUser(user)).toBe(true);
      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(200);
      expect((response as AuthenticatedSessionResponse).authenticated).toBe(true);
      expect((response as AuthenticatedSessionResponse).userId).toBe("user-123");
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("kompletter Flow: Unauthentifizierter User", () => {
      const checkResult: SessionCheckResult = { user: null, error: undefined };

      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(200);
      expect((response as UnauthenticatedSessionResponse).authenticated).toBe(false);
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("kompletter Flow: Server Error", () => {
      const checkResult: SessionCheckResult = {
        user: null,
        error: new Error("Internal error"),
      };

      const { response, statusCode } = buildSessionResponse(checkResult);

      expect(statusCode).toBe(500);
      expect((response as ErrorSessionResponse).error).toBe(SESSION_ERRORS.SERVER_ERROR);
      expect(validateSessionResponse(response)).toBe(true);
    });

    it("Response-Format: Authentifiziert", () => {
      const user: User = { id: "user-456", email: "jane@example.com" };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response).toHaveProperty("authenticated");
      expect(response).toHaveProperty("userId");
      expect(response).toHaveProperty("email");
      expect(Object.keys(response)).toHaveLength(3);
    });

    it("Response-Format: Unauthentifiziert", () => {
      const response = buildUnauthenticatedSessionResponse();

      expect(response).toHaveProperty("authenticated");
      expect(Object.keys(response)).toHaveLength(1);
    });

    it("Response-Format: Error", () => {
      const response = buildErrorSessionResponse();

      expect(response).toHaveProperty("error");
      expect(Object.keys(response)).toHaveLength(1);
    });

    it("Edge Case: Leere User ID", () => {
      const user: User = { id: "", email: null };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response.userId).toBe("");
      expect(response.authenticated).toBe(true);
    });

    it("Edge Case: User ohne email", () => {
      const user: User = { id: "user-123" };
      const response = buildAuthenticatedSessionResponse(user);

      expect(response.email).toBeNull();
    });

    it("Status Code Mapping: Success", () => {
      expect(getSessionStatusCode(false)).toBe(SESSION_HTTP_STATUS.SUCCESS);
    });

    it("Status Code Mapping: Error", () => {
      expect(getSessionStatusCode(true)).toBe(SESSION_HTTP_STATUS.SERVER_ERROR);
    });

    it("Multiple Session Checks", () => {
      const users = [
        { id: "user-1", email: "user1@example.com" },
        { id: "user-2", email: "user2@example.com" },
        { id: "user-3" },
      ];

      users.forEach((user) => {
        const checkResult: SessionCheckResult = { user, error: undefined };
        const { response, statusCode } = buildSessionResponse(checkResult);

        expect(statusCode).toBe(200);
        expect((response as AuthenticatedSessionResponse).authenticated).toBe(true);
      });
    });

    it("User Validation Consistency", () => {
      const validUsers = [
        { id: "user-1" },
        { id: "user-2", email: "test@example.com" },
        { id: "user-3", email: null, extra: "field" },
      ];

      validUsers.forEach((user) => {
        expect(isValidUser(user)).toBe(true);
      });

      const invalidUsers = [
        { email: "test@example.com" },
        null,
        undefined,
        { id: null },
      ];

      invalidUsers.forEach((user) => {
        expect(isValidUser(user)).toBe(false);
      });
    });
  });
});