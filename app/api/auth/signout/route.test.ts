import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus SignOut Route)
export type SignOutResult = {
  error: null | { message: string };
};

export type SignOutResponse = {
  success?: boolean;
  error?: string;
};

export type SignOutDatabaseResult = {
  error: null | { message: string };
};

export const SIGNOUT_HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
} as const;

export const SIGNOUT_ERRORS = {
  SIGN_OUT_FAILED: "Sign out failed",
  SERVER_ERROR: "Internal server error",
} as const;

// Pure utility functions
export function isValidSignOutResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    (result.error === null || (typeof result.error === "object" && typeof result.error.message === "string"))
  );
}

export function hasSignOutError(result: SignOutDatabaseResult): boolean {
  return result.error !== null && result.error !== undefined;
}

export function buildSuccessSignOutResponse(): SignOutResponse {
  return { success: true };
}

export function buildErrorSignOutResponse(errorMessage: string): SignOutResponse {
  return { error: errorMessage };
}

export function getSignOutStatusCode(result: SignOutDatabaseResult): number {
  if (!hasSignOutError(result)) {
    return SIGNOUT_HTTP_STATUS.SUCCESS;
  }
  return SIGNOUT_HTTP_STATUS.BAD_REQUEST;
}

export function parseSignOutError(error: any): string {
  if (!error) return SIGNOUT_ERRORS.SERVER_ERROR;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return SIGNOUT_ERRORS.SERVER_ERROR;
}

export function validateSignOutFlow(result: SignOutDatabaseResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (hasSignOutError(result) && result.error?.message) {
    errors.push(result.error.message);
  }

  return { valid: !hasSignOutError(result), errors };
}

describe("Sign Out API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle HTTP Status Codes definieren", () => {
      expect(SIGNOUT_HTTP_STATUS.SUCCESS).toBe(200);
      expect(SIGNOUT_HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(SIGNOUT_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(SIGNOUT_ERRORS.SIGN_OUT_FAILED).toBeTruthy();
      expect(SIGNOUT_ERRORS.SERVER_ERROR).toBeTruthy();
    });
  });

  describe("isValidSignOutResult", () => {
    it("validiert korrekte Success Result", () => {
      const result = { error: null };
      expect(isValidSignOutResult(result)).toBe(true);
    });

    it("validiert Result mit Error", () => {
      const result = { error: { message: "Sign out failed" } };
      expect(isValidSignOutResult(result)).toBe(true);
    });

    it("lehnt Result ohne error Property ab", () => {
      const result = { success: true };
      expect(isValidSignOutResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidSignOutResult(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidSignOutResult(undefined)).toBe(false);
    });
  });

  describe("hasSignOutError", () => {
    it("gibt true für Result mit Error zurück", () => {
      const result: SignOutDatabaseResult = {
        error: { message: "Sign out failed" },
      };
      expect(hasSignOutError(result)).toBe(true);
    });

    it("gibt false für Result ohne Error zurück", () => {
      const result: SignOutDatabaseResult = {
        error: null,
      };
      expect(hasSignOutError(result)).toBe(false);
    });

    it("gibt false für undefined Error zurück", () => {
      const result: any = { error: undefined };
      expect(hasSignOutError(result)).toBe(false);
    });
  });

  describe("buildSuccessSignOutResponse", () => {
    it("baut Success Response korrekt", () => {
      const response = buildSuccessSignOutResponse();

      expect(response).toEqual({ success: true });
      expect(response.success).toBe(true);
    });

    it("gibt immer gleiche Response zurück", () => {
      const response1 = buildSuccessSignOutResponse();
      const response2 = buildSuccessSignOutResponse();

      expect(response1).toEqual(response2);
    });
  });

  describe("buildErrorSignOutResponse", () => {
    it("baut Error Response korrekt", () => {
      const response = buildErrorSignOutResponse("Sign out failed");

      expect(response).toEqual({ error: "Sign out failed" });
    });

    it("verarbeitet verschiedene Error Messages", () => {
      const errors = [
        "Sign out failed",
        "Network error",
        "Internal server error",
      ];

      errors.forEach((error) => {
        const response = buildErrorSignOutResponse(error);
        expect(response.error).toBe(error);
      });
    });

    it("verarbeitet leere Error Messages", () => {
      const response = buildErrorSignOutResponse("");
      expect(response.error).toBe("");
    });
  });

  describe("getSignOutStatusCode", () => {
    it("gibt 200 für erfolgreiches Sign Out zurück", () => {
      const result: SignOutDatabaseResult = { error: null };
      expect(getSignOutStatusCode(result)).toBe(200);
    });

    it("gibt 400 für Sign Out mit Error zurück", () => {
      const result: SignOutDatabaseResult = {
        error: { message: "Sign out failed" },
      };
      expect(getSignOutStatusCode(result)).toBe(400);
    });

    it("gibt 400 für verschiedene Errors zurück", () => {
      const errors = [
        { message: "Error 1" },
        { message: "Error 2" },
        { message: "Error 3" },
      ];

      errors.forEach((error) => {
        const result: SignOutDatabaseResult = { error };
        expect(getSignOutStatusCode(result)).toBe(400);
      });
    });
  });

  describe("parseSignOutError", () => {
    it("gibt Error Message zurück", () => {
      const error = { message: "Sign out failed" };
      expect(parseSignOutError(error)).toBe("Sign out failed");
    });

    it("gibt string Error direkt zurück", () => {
      expect(parseSignOutError("Sign out failed")).toBe("Sign out failed");
    });

    it("gibt Server Error für null zurück", () => {
      expect(parseSignOutError(null)).toBe(SIGNOUT_ERRORS.SERVER_ERROR);
    });

    it("gibt Server Error für undefined zurück", () => {
      expect(parseSignOutError(undefined)).toBe(SIGNOUT_ERRORS.SERVER_ERROR);
    });

    it("verarbeitet Errors ohne message Property", () => {
      const error = { code: "SIGNOUT_ERROR" };
      expect(parseSignOutError(error)).toBe(SIGNOUT_ERRORS.SERVER_ERROR);
    });
  });

  describe("validateSignOutFlow", () => {
    it("validiert erfolgreiche Sign Out", () => {
      const result: SignOutDatabaseResult = { error: null };
      const validation = validateSignOutFlow(result);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für Sign Out Error", () => {
      const result: SignOutDatabaseResult = {
        error: { message: "Sign out failed" },
      };
      const validation = validateSignOutFlow(result);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0]).toBe("Sign out failed");
    });

    it("verarbeitet verschiedene Error Messages", () => {
      const errors = [
        "Sign out failed",
        "Network error",
        "Database error",
      ];

      errors.forEach((errorMessage) => {
        const result: SignOutDatabaseResult = {
          error: { message: errorMessage },
        };
        const validation = validateSignOutFlow(result);

        expect(validation.valid).toBe(false);
        expect(validation.errors[0]).toBe(errorMessage);
      });
    });
  });

  describe("Sign Out API Integration", () => {
    it("kompletter Flow: Success", () => {
      const dbResult: SignOutDatabaseResult = { error: null };

      expect(isValidSignOutResult(dbResult)).toBe(true);
      expect(hasSignOutError(dbResult)).toBe(false);
      expect(getSignOutStatusCode(dbResult)).toBe(200);

      const response = buildSuccessSignOutResponse();
      expect(response.success).toBe(true);
    });

    it("kompletter Flow: Sign Out Error", () => {
      const dbResult: SignOutDatabaseResult = {
        error: { message: "Sign out failed" },
      };

      expect(isValidSignOutResult(dbResult)).toBe(true);
      expect(hasSignOutError(dbResult)).toBe(true);
      expect(getSignOutStatusCode(dbResult)).toBe(400);

      const errorMessage = parseSignOutError(dbResult.error);
      const response = buildErrorSignOutResponse(errorMessage);
      expect(response.error).toBe("Sign out failed");
    });

    it("kompletter Flow: Network Error", () => {
      const dbResult: SignOutDatabaseResult = {
        error: { message: "Network error" },
      };

      const validation = validateSignOutFlow(dbResult);
      expect(validation.valid).toBe(false);

      const statusCode = getSignOutStatusCode(dbResult);
      expect(statusCode).toBe(400);

      const response = buildErrorSignOutResponse(parseSignOutError(dbResult.error));
      expect(response.error).toBe("Network error");
    });

    it("Response Format: Success mit success Property", () => {
      const response = buildSuccessSignOutResponse();
      expect(response).toHaveProperty("success");
      expect(typeof response.success).toBe("boolean");
    });

    it("Response Format: Error mit error Property", () => {
      const response = buildErrorSignOutResponse("Error message");
      expect(response).toHaveProperty("error");
      expect(response.error).toBe("Error message");
    });

    it("Status Code Mapping: Success", () => {
      const result: SignOutDatabaseResult = { error: null };
      const statusCode = getSignOutStatusCode(result);
      expect(statusCode).toBe(SIGNOUT_HTTP_STATUS.SUCCESS);
    });

    it("Status Code Mapping: Error", () => {
      const result: SignOutDatabaseResult = {
        error: { message: "Error" },
      };
      const statusCode = getSignOutStatusCode(result);
      expect(statusCode).toBe(SIGNOUT_HTTP_STATUS.BAD_REQUEST);
    });

    it("Multiple Sign Out Attempts", () => {
      const results = [
        { error: null },
        { error: null },
        { error: { message: "Error" } },
      ];

      results.forEach((result) => {
        const statusCode = getSignOutStatusCode(result as SignOutDatabaseResult);
        const isSuccess = !hasSignOutError(result as SignOutDatabaseResult);

        if (isSuccess) {
          expect(statusCode).toBe(200);
        } else {
          expect(statusCode).toBe(400);
        }
      });
    });

    it("Error Message Parsing Consistency", () => {
      const errors = [
        { message: "Error 1" },
        { message: "Error 2" },
        { message: "Error 3" },
      ];

      errors.forEach((error) => {
        const parsed = parseSignOutError(error);
        const response = buildErrorSignOutResponse(parsed);

        expect(response.error).toBe(error.message);
      });
    });
  });
});
