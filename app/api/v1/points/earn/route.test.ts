import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus Points Earn Route)
export type EarnPointsRequest = {
  organizationId: string;
  externalCustomerId: string;
  amountEur: number;
  metadata?: Record<string, any>;
};

export type EarnPointsSuccessResponse = {
  organizationId: string;
  externalCustomerId: string;
  profileId: string;
  pointsEarned: number;
  newPointsBalance: number;
  totalSpentEur: number;
};

export type EarnPointsErrorResponse = {
  error: string;
};

export type EarnDatabaseResult = {
  profile_id: string;
  points_earned: number;
  new_points_balance: string | number;
  total_spent_eur: string | number;
};

export type ValidatedEarnInput = {
  organizationId: string;
  externalCustomerId: string;
  amountEur: number;
  metadata: Record<string, any>;
};

export const EARN_POINTS_HTTP_STATUS = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_ERROR: 500,
} as const;

export const EARN_POINTS_ERRORS = {
  NO_ORGANIZATION_ID: "organizationId is required",
  NO_CUSTOMER_ID: "externalCustomerId is required",
  NO_AMOUNT: "amountEur is required",
  INVALID_ORGANIZATION_ID: "Invalid organizationId",
  INVALID_CUSTOMER_ID: "Invalid externalCustomerId",
  INVALID_AMOUNT: "Invalid amountEur - must be positive number",
  NO_RESULT: "No transaction result returned",
  UNAUTHORIZED: "Unauthorized: Invalid API key",
} as const;

// Pure utility functions
export function isValidNonEmptyString(value: any): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidPositiveNumber(value: any): boolean {
  return typeof value === "number" && value > 0 && isFinite(value);
}

export function parseNonEmptyStringUtil(value: any, fieldName: string): { valid: boolean; value?: string; error?: string } {
  if (!isValidNonEmptyString(value)) {
    return { valid: false, error: `${fieldName} is required or invalid` };
  }
  return { valid: true, value: String(value).trim() };
}

export function parsePositiveNumberUtil(value: any, fieldName: string): { valid: boolean; value?: number; error?: string } {
  if (!isValidPositiveNumber(value)) {
    return { valid: false, error: `${fieldName} must be a positive number` };
  }
  return { valid: true, value: Number(value) };
}

export function validateEarnPointsRequest(body: any): { valid: boolean; data?: ValidatedEarnInput; errors: string[] } {
  const errors: string[] = [];

  const orgResult = parseNonEmptyStringUtil(body?.organizationId, "organizationId");
  if (!orgResult.valid) errors.push(orgResult.error!);

  const custResult = parseNonEmptyStringUtil(body?.externalCustomerId, "externalCustomerId");
  if (!custResult.valid) errors.push(custResult.error!);

  const amountResult = parsePositiveNumberUtil(body?.amountEur, "amountEur");
  if (!amountResult.valid) errors.push(amountResult.error!);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      organizationId: orgResult.value!,
      externalCustomerId: custResult.value!,
      amountEur: amountResult.value!,
      metadata: body?.metadata ?? {},
    },
    errors: [],
  };
}

export function isValidDatabaseResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof result.profile_id === "string" &&
    typeof result.points_earned === "number" &&
    (typeof result.new_points_balance === "number" || typeof result.new_points_balance === "string") &&
    (typeof result.total_spent_eur === "number" || typeof result.total_spent_eur === "string")
  );
}

export function buildSuccessEarnPointsResponse(
  organizationId: string,
  customerId: string,
  result: EarnDatabaseResult
): EarnPointsSuccessResponse {
  return {
    organizationId,
    externalCustomerId: customerId,
    profileId: result.profile_id,
    pointsEarned: result.points_earned,
    newPointsBalance: Number(result.new_points_balance),
    totalSpentEur: Number(result.total_spent_eur),
  };
}

export function parseDatabaseResult(data: any): EarnDatabaseResult | null {
  if (!data) return null;
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return null;

  return {
    profile_id: result.profile_id,
    points_earned: result.points_earned,
    new_points_balance: result.new_points_balance,
    total_spent_eur: result.total_spent_eur,
  };
}

export function getEarnPointsStatusCode(error: string | null): number {
  if (!error) return EARN_POINTS_HTTP_STATUS.SUCCESS;
  if (error.toLowerCase().includes("unauthorized")) return EARN_POINTS_HTTP_STATUS.UNAUTHORIZED;
  if (error.toLowerCase().includes("invalid")) return EARN_POINTS_HTTP_STATUS.BAD_REQUEST;
  return EARN_POINTS_HTTP_STATUS.INTERNAL_ERROR;
}

export function validateEarnPointsFlow(
  request: any
): { valid: boolean; errors: string[] } {
  const validation = validateEarnPointsRequest(request);
  return { valid: validation.valid, errors: validation.errors };
}

describe("Earn Points API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle HTTP Status Codes definieren", () => {
      expect(EARN_POINTS_HTTP_STATUS.SUCCESS).toBe(200);
      expect(EARN_POINTS_HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(EARN_POINTS_HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(EARN_POINTS_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(EARN_POINTS_ERRORS.NO_ORGANIZATION_ID).toBeTruthy();
      expect(EARN_POINTS_ERRORS.NO_CUSTOMER_ID).toBeTruthy();
      expect(EARN_POINTS_ERRORS.NO_AMOUNT).toBeTruthy();
      expect(EARN_POINTS_ERRORS.UNAUTHORIZED).toBeTruthy();
    });
  });

  describe("isValidNonEmptyString", () => {
    it("akzeptiert nicht-leere Strings", () => {
      expect(isValidNonEmptyString("org-123")).toBe(true);
      expect(isValidNonEmptyString("customer")).toBe(true);
    });

    it("lehnt leere Strings ab", () => {
      expect(isValidNonEmptyString("")).toBe(false);
      expect(isValidNonEmptyString("   ")).toBe(false);
    });

    it("lehnt nicht-Strings ab", () => {
      expect(isValidNonEmptyString(null)).toBe(false);
      expect(isValidNonEmptyString(undefined)).toBe(false);
      expect(isValidNonEmptyString(123)).toBe(false);
    });
  });

  describe("isValidPositiveNumber", () => {
    it("akzeptiert positive Zahlen", () => {
      expect(isValidPositiveNumber(100)).toBe(true);
      expect(isValidPositiveNumber(1)).toBe(true);
      expect(isValidPositiveNumber(0.5)).toBe(true);
      expect(isValidPositiveNumber(10.99)).toBe(true);
    });

    it("lehnt 0 ab", () => {
      expect(isValidPositiveNumber(0)).toBe(false);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidPositiveNumber(-100)).toBe(false);
      expect(isValidPositiveNumber(-0.5)).toBe(false);
    });

    it("lehnt Infinity und NaN ab", () => {
      expect(isValidPositiveNumber(Infinity)).toBe(false);
      expect(isValidPositiveNumber(NaN)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isValidPositiveNumber("100")).toBe(false);
      expect(isValidPositiveNumber(null)).toBe(false);
    });
  });

  describe("parseNonEmptyStringUtil", () => {
    it("akzeptiert valide Strings", () => {
      const result = parseNonEmptyStringUtil("test-value", "fieldName");
      expect(result.valid).toBe(true);
      expect(result.value).toBe("test-value");
    });

    it("trimmt Whitespace", () => {
      const result = parseNonEmptyStringUtil("  test-value  ", "fieldName");
      expect(result.valid).toBe(true);
      expect(result.value).toBe("test-value");
    });

    it("lehnt leere Strings ab", () => {
      const result = parseNonEmptyStringUtil("", "fieldName");
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("gibt Feldnamen im Error zurück", () => {
      const result = parseNonEmptyStringUtil("", "organizationId");
      expect(result.error).toContain("organizationId");
    });
  });

  describe("parsePositiveNumberUtil", () => {
    it("akzeptiert positive Zahlen", () => {
      const result = parsePositiveNumberUtil(100, "amountEur");
      expect(result.valid).toBe(true);
      expect(result.value).toBe(100);
    });

    it("akzeptiert dezimale Zahlen", () => {
      const result = parsePositiveNumberUtil(10.99, "amountEur");
      expect(result.valid).toBe(true);
      expect(result.value).toBe(10.99);
    });

    it("lehnt 0 und negative Zahlen ab", () => {
      const result0 = parsePositiveNumberUtil(0, "amountEur");
      expect(result0.valid).toBe(false);

      const resultNeg = parsePositiveNumberUtil(-50, "amountEur");
      expect(resultNeg.valid).toBe(false);
    });

    it("gibt Feldnamen im Error zurück", () => {
      const result = parsePositiveNumberUtil(-10, "amountEur");
      expect(result.error).toContain("amountEur");
    });
  });

  describe("validateEarnPointsRequest", () => {
    it("validiert kompletten Request", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 10.50,
      };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it("akzeptiert Request mit Metadata", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 25,
        metadata: { source: "purchase", orderId: "order-789" },
      };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data?.metadata).toEqual({ source: "purchase", orderId: "order-789" });
    });

    it("gibt leeres Metadata Object wenn nicht vorhanden", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 10,
      };
      const result = validateEarnPointsRequest(body);
      expect(result.data?.metadata).toEqual({});
    });

    it("sammelt Fehler für missing Fields", () => {
      const body = { organizationId: "org-123" };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("lehnt leere organizationId ab", () => {
      const body = {
        organizationId: "",
        externalCustomerId: "cust-456",
        amountEur: 10,
      };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("organizationId");
    });

    it("lehnt negative amountEur ab", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: -50,
      };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(false);
    });

    it("lehnt 0 amountEur ab", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 0,
      };
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(false);
    });

    it("lehnt alle fehlenden Fields ab", () => {
      const body = {};
      const result = validateEarnPointsRequest(body);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
  });

  describe("isValidDatabaseResult", () => {
    it("validiert korrekte Database Result", () => {
      const result = {
        profile_id: "p-123",
        points_earned: 100,
        new_points_balance: 500,
        total_spent_eur: 50.25,
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("akzeptiert string Werte für Zahlen", () => {
      const result = {
        profile_id: "p-123",
        points_earned: 100,
        new_points_balance: "500",
        total_spent_eur: "50.25",
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("lehnt Result ohne required Fields ab", () => {
      const result = { profile_id: "p-123" };
      expect(isValidDatabaseResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidDatabaseResult(null)).toBe(false);
    });
  });

  describe("buildSuccessEarnPointsResponse", () => {
    it("baut Success Response korrekt", () => {
      const result: EarnDatabaseResult = {
        profile_id: "p-123",
        points_earned: 100,
        new_points_balance: 500,
        total_spent_eur: 50.25,
      };

      const response = buildSuccessEarnPointsResponse("org-123", "cust-456", result);

      expect(response).toEqual({
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        profileId: "p-123",
        pointsEarned: 100,
        newPointsBalance: 500,
        totalSpentEur: 50.25,
      });
    });

    it("konvertiert string Zahlen zu Numbers", () => {
      const result: EarnDatabaseResult = {
        profile_id: "p-123",
        points_earned: 100,
        new_points_balance: "500",
        total_spent_eur: "50.25",
      };

      const response = buildSuccessEarnPointsResponse("org-123", "cust-456", result);

      expect(typeof response.newPointsBalance).toBe("number");
      expect(typeof response.totalSpentEur).toBe("number");
      expect(response.newPointsBalance).toBe(500);
      expect(response.totalSpentEur).toBe(50.25);
    });
  });

  describe("parseDatabaseResult", () => {
    it("parsed einzelnes Objekt", () => {
      const data = {
        profile_id: "p-123",
        points_earned: 100,
        new_points_balance: 500,
        total_spent_eur: 50.25,
      };

      const result = parseDatabaseResult(data);

      expect(result?.profile_id).toBe("p-123");
      expect(result?.points_earned).toBe(100);
    });

    it("parsed Array und nimmt erstes Element", () => {
      const data = [
        {
          profile_id: "p-123",
          points_earned: 50,
          new_points_balance: "450",
          total_spent_eur: "25.50",
        },
      ];

      const result = parseDatabaseResult(data);

      expect(result?.profile_id).toBe("p-123");
      expect(result?.points_earned).toBe(50);
    });

    it("gibt null für null/undefined zurück", () => {
      expect(parseDatabaseResult(null)).toBeNull();
      expect(parseDatabaseResult(undefined)).toBeNull();
    });

    it("gibt null für leeres Array zurück", () => {
      expect(parseDatabaseResult([])).toBeNull();
    });
  });

  describe("getEarnPointsStatusCode", () => {
    it("gibt 200 für null/kein Error zurück", () => {
      expect(getEarnPointsStatusCode(null)).toBe(200);
    });

    it("gibt 401 für Unauthorized Error zurück", () => {
      expect(getEarnPointsStatusCode("Unauthorized: Invalid API key")).toBe(401);
      expect(getEarnPointsStatusCode("unauthorized access")).toBe(401);
    });

    it("gibt 400 für Invalid Error zurück", () => {
      expect(getEarnPointsStatusCode("Invalid amountEur")).toBe(400);
      expect(getEarnPointsStatusCode("Invalid organizationId")).toBe(400);
    });

    it("gibt 500 für andere Errors zurück", () => {
      expect(getEarnPointsStatusCode("Database connection failed")).toBe(500);
      expect(getEarnPointsStatusCode("Unknown error")).toBe(500);
    });
  });

  describe("validateEarnPointsFlow", () => {
    it("validiert kompletten Flow", () => {
      const request = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 10.50,
      };

      const validation = validateEarnPointsFlow(request);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültigen Request", () => {
      const request = { amountEur: 10 };

      const validation = validateEarnPointsFlow(request);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Earn Points API Integration", () => {
    it("kompletter Flow: Success", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 10.50,
        metadata: { source: "purchase" },
      };

      const validation = validateEarnPointsRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: EarnDatabaseResult = {
        profile_id: "p-123",
        points_earned: 105,
        new_points_balance: 505,
        total_spent_eur: 110.50,
      };

      expect(isValidDatabaseResult(dbResult)).toBe(true);

      const response = buildSuccessEarnPointsResponse(
        validation.data!.organizationId,
        validation.data!.externalCustomerId,
        dbResult
      );

      expect(response.organizationId).toBe("org-123");
      expect(response.pointsEarned).toBe(105);
      expect(response.totalSpentEur).toBe(110.50);
    });

    it("Status Code Detection für verschiedene Errors", () => {
      expect(getEarnPointsStatusCode(null)).toBe(200);
      expect(getEarnPointsStatusCode("Unauthorized: Invalid API key")).toBe(401);
      expect(getEarnPointsStatusCode("Invalid amountEur")).toBe(400);
    });

    it("Multiple Requests mit verschiedenen Beträgen", () => {
      const requests = [
        { organizationId: "org-1", externalCustomerId: "c-1", amountEur: 5.99 },
        { organizationId: "org-1", externalCustomerId: "c-2", amountEur: 100 },
        { organizationId: "org-1", externalCustomerId: "c-3", amountEur: 1.50 },
      ];

      requests.forEach((req) => {
        const validation = validateEarnPointsRequest(req);
        expect(validation.valid).toBe(true);
        expect(validation.data?.amountEur).toBeGreaterThan(0);
      });
    });

    it("Array Result Parsing und Response Building", () => {
      const dbData = [
        {
          profile_id: "p-123",
          points_earned: 50,
          new_points_balance: "450",
          total_spent_eur: "25.50",
        },
      ];

      const parsed = parseDatabaseResult(dbData);
      expect(parsed).not.toBeNull();

      if (parsed) {
        expect(isValidDatabaseResult(parsed)).toBe(true);
        const response = buildSuccessEarnPointsResponse("org-123", "cust-456", parsed);
        expect(typeof response.newPointsBalance).toBe("number");
        expect(typeof response.totalSpentEur).toBe("number");
      }
    });

    it("Metadata wird korrekt weitergegeben", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 50,
        metadata: { source: "online", referrer: "social" },
      };

      const validation = validateEarnPointsRequest(body);
      expect(validation.data?.metadata).toEqual({ source: "online", referrer: "social" });
    });

    it("Dezimale Beträge werden korrekt verarbeitet", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        amountEur: 19.99,
      };

      const validation = validateEarnPointsRequest(body);
      expect(validation.valid).toBe(true);
      expect(validation.data?.amountEur).toBe(19.99);
    });
  });
});