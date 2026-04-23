import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus Points Redeem Route)
export type RedeemPointsRequest = {
  organizationId: string;
  externalCustomerId: string;
  points: number;
  metadata?: Record<string, any>;
};

export type RedeemPointsSuccessResponse = {
  organizationId: string;
  externalCustomerId: string;
  profileId: string;
  redeemedPoints: number;
  newPointsBalance: number;
  status: "applied";
  message: string;
};

export type RedeemPointsErrorResponse = {
  organizationId: string;
  externalCustomerId: string;
  status: "insufficient_points" | "failed";
  message: string;
  newPointsBalance: number;
};

export type RedeemDatabaseResult = {
  status: "applied" | "insufficient_points" | "failed";
  message: string;
  profile_id: string;
  redeemed_points: number;
  new_points_balance: string | number;
};

export type ValidatedInput = {
  organizationId: string;
  externalCustomerId: string;
  pointsToRedeem: number;
  metadata: Record<string, any>;
};

export const REDEEM_POINTS_STATUS = {
  APPLIED: "applied",
  INSUFFICIENT_POINTS: "insufficient_points",
  FAILED: "failed",
} as const;

export const REDEEM_POINTS_HTTP_STATUS = {
  SUCCESS: 200,
  ERROR: 409,
  INTERNAL_ERROR: 500,
} as const;

export const REDEEM_POINTS_ERRORS = {
  NO_ORGANIZATION_ID: "organizationId is required",
  NO_CUSTOMER_ID: "externalCustomerId is required",
  NO_POINTS: "points is required",
  INVALID_ORGANIZATION_ID: "Invalid organizationId",
  INVALID_CUSTOMER_ID: "Invalid externalCustomerId",
  INVALID_POINTS: "Invalid points amount",
  NO_RESULT: "No transaction result returned",
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

export function validateRedeemPointsRequest(body: any): { valid: boolean; data?: ValidatedInput; errors: string[] } {
  const errors: string[] = [];
  
  const orgResult = parseNonEmptyStringUtil(body?.organizationId, "organizationId");
  if (!orgResult.valid) errors.push(orgResult.error!);

  const custResult = parseNonEmptyStringUtil(body?.externalCustomerId, "externalCustomerId");
  if (!custResult.valid) errors.push(custResult.error!);

  const pointsResult = parsePositiveNumberUtil(body?.points, "points");
  if (!pointsResult.valid) errors.push(pointsResult.error!);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      organizationId: orgResult.value!,
      externalCustomerId: custResult.value!,
      pointsToRedeem: Math.floor(pointsResult.value!),
      metadata: body?.metadata ?? {},
    },
    errors: [],
  };
}

export function isValidDatabaseResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof result.status === "string" &&
    typeof result.message === "string" &&
    typeof result.profile_id === "string" &&
    typeof result.redeemed_points === "number"
  );
}

export function isRedeemPointsSuccessful(result: RedeemDatabaseResult): boolean {
  return result.status === REDEEM_POINTS_STATUS.APPLIED;
}

export function buildSuccessRedeemPointsResponse(
  organizationId: string,
  customerId: string,
  result: RedeemDatabaseResult
): RedeemPointsSuccessResponse {
  return {
    organizationId,
    externalCustomerId: customerId,
    profileId: result.profile_id,
    redeemedPoints: result.redeemed_points,
    newPointsBalance: Number(result.new_points_balance),
    status: "applied" as const,
    message: result.message,
  };
}

export function buildErrorRedeemPointsResponse(
  organizationId: string,
  customerId: string,
  result: RedeemDatabaseResult
): RedeemPointsErrorResponse {
  return {
    organizationId,
    externalCustomerId: customerId,
    status: result.status as "insufficient_points" | "failed",
    message: result.message,
    newPointsBalance: Number(result.new_points_balance),
  };
}

export function getRedeemPointsStatusCode(result: RedeemDatabaseResult): number {
  return result.status === REDEEM_POINTS_STATUS.APPLIED 
    ? REDEEM_POINTS_HTTP_STATUS.SUCCESS 
    : REDEEM_POINTS_HTTP_STATUS.ERROR;
}

export function parseDatabaseResult(data: any): RedeemDatabaseResult | null {
  if (!data) return null;
  const result = Array.isArray(data) ? data[0] : data;
  if (!result) return null;
  
  return {
    status: result.status,
    message: result.message,
    profile_id: result.profile_id,
    redeemed_points: result.redeemed_points,
    new_points_balance: result.new_points_balance,
  };
}

export function validateRedeemPointsFlow(
  request: any,
  result: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const validation = validateRedeemPointsRequest(request);
  if (!validation.valid) {
    errors.push(...validation.errors);
  }

  if (!isValidDatabaseResult(result)) {
    errors.push("Invalid database result");
  }

  return { valid: errors.length === 0, errors };
}

describe("Redeem Points API - Pure Utility Functions", () => {
  describe("Constants", () => {
    it("sollte alle Status-Werte definieren", () => {
      expect(REDEEM_POINTS_STATUS.APPLIED).toBe("applied");
      expect(REDEEM_POINTS_STATUS.INSUFFICIENT_POINTS).toBe("insufficient_points");
      expect(REDEEM_POINTS_STATUS.FAILED).toBe("failed");
    });

    it("sollte alle HTTP Status Codes definieren", () => {
      expect(REDEEM_POINTS_HTTP_STATUS.SUCCESS).toBe(200);
      expect(REDEEM_POINTS_HTTP_STATUS.ERROR).toBe(409);
      expect(REDEEM_POINTS_HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });

    it("sollte alle Error Messages definieren", () => {
      expect(REDEEM_POINTS_ERRORS.NO_ORGANIZATION_ID).toBeTruthy();
      expect(REDEEM_POINTS_ERRORS.NO_CUSTOMER_ID).toBeTruthy();
      expect(REDEEM_POINTS_ERRORS.NO_POINTS).toBeTruthy();
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
    });

    it("lehnt 0 ab", () => {
      expect(isValidPositiveNumber(0)).toBe(false);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidPositiveNumber(-100)).toBe(false);
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
  });

  describe("parsePositiveNumberUtil", () => {
    it("akzeptiert positive Zahlen", () => {
      const result = parsePositiveNumberUtil(100, "points");
      expect(result.valid).toBe(true);
      expect(result.value).toBe(100);
    });

    it("lehnt 0 und negative Zahlen ab", () => {
      const result0 = parsePositiveNumberUtil(0, "points");
      expect(result0.valid).toBe(false);

      const resultNeg = parsePositiveNumberUtil(-50, "points");
      expect(resultNeg.valid).toBe(false);
    });
  });

  describe("validateRedeemPointsRequest", () => {
    it("validiert kompletten Request", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100,
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it("akzeptiert Request mit Metadata", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100,
        metadata: { reason: "promotion" },
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data?.metadata).toEqual({ reason: "promotion" });
    });

    it("floort Points zu Integer", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100.7,
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(true);
      expect(result.data?.pointsToRedeem).toBe(100);
    });

    it("sammelt Fehler für missing Fields", () => {
      const body = { organizationId: "org-123" };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("lehnt leere organizationId ab", () => {
      const body = {
        organizationId: "",
        externalCustomerId: "cust-456",
        points: 100,
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain("organizationId");
    });

    it("lehnt negative points ab", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: -100,
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.valid).toBe(false);
    });

    it("gibt leeres Metadata Object wenn nicht vorhanden", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100,
      };
      const result = validateRedeemPointsRequest(body);
      expect(result.data?.metadata).toEqual({});
    });
  });

  describe("isValidDatabaseResult", () => {
    it("validiert korrekte Database Result", () => {
      const result = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("lehnt Result ohne required Fields ab", () => {
      const result = { status: "applied" };
      expect(isValidDatabaseResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidDatabaseResult(null)).toBe(false);
    });
  });

  describe("isRedeemPointsSuccessful", () => {
    it("gibt true für 'applied' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(isRedeemPointsSuccessful(result)).toBe(true);
    });

    it("gibt false für 'insufficient_points' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 50,
      };
      expect(isRedeemPointsSuccessful(result)).toBe(false);
    });

    it("gibt false für 'failed' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 600,
      };
      expect(isRedeemPointsSuccessful(result)).toBe(false);
    });
  });

  describe("buildSuccessRedeemPointsResponse", () => {
    it("baut Success Response korrekt", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Points redeemed",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const response = buildSuccessRedeemPointsResponse("org-123", "cust-456", result);

      expect(response).toEqual({
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        profileId: "p-123",
        redeemedPoints: 100,
        newPointsBalance: 500,
        status: "applied",
        message: "Points redeemed",
      });
    });

    it("konvertiert newPointsBalance zu Number", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: "500",
      };

      const response = buildSuccessRedeemPointsResponse("org-123", "cust-456", result);

      expect(typeof response.newPointsBalance).toBe("number");
      expect(response.newPointsBalance).toBe(500);
    });
  });

  describe("buildErrorRedeemPointsResponse", () => {
    it("baut Error Response für insufficient_points", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 100,
      };

      const response = buildErrorRedeemPointsResponse("org-123", "cust-456", result);

      expect(response).toEqual({
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        status: "insufficient_points",
        message: "Not enough points",
        newPointsBalance: 100,
      });
    });

    it("baut Error Response für failed Status", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error occurred",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 200,
      };

      const response = buildErrorRedeemPointsResponse("org-123", "cust-456", result);

      expect(response.status).toBe("failed");
      expect(response.message).toBe("Error occurred");
    });
  });

  describe("getRedeemPointsStatusCode", () => {
    it("gibt 200 für 'applied' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(getRedeemPointsStatusCode(result)).toBe(200);
    });

    it("gibt 409 für 'insufficient_points' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 50,
      };
      expect(getRedeemPointsStatusCode(result)).toBe(409);
    });

    it("gibt 409 für 'failed' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 600,
      };
      expect(getRedeemPointsStatusCode(result)).toBe(409);
    });
  });

  describe("parseDatabaseResult", () => {
    it("parsed einzelnes Objekt", () => {
      const data = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const result = parseDatabaseResult(data);

      expect(result?.status).toBe("applied");
      expect(result?.profile_id).toBe("p-123");
    });

    it("parsed Array und nimmt erstes Element", () => {
      const data = [
        {
          status: "applied",
          message: "Success",
          profile_id: "p-123",
          redeemed_points: 50,
          new_points_balance: "450",
        },
      ];

      const result = parseDatabaseResult(data);

      expect(result?.status).toBe("applied");
      expect(result?.redeemed_points).toBe(50);
    });

    it("gibt null für null/undefined zurück", () => {
      expect(parseDatabaseResult(null)).toBeNull();
      expect(parseDatabaseResult(undefined)).toBeNull();
    });

    it("gibt null für leeres Array zurück", () => {
      expect(parseDatabaseResult([])).toBeNull();
    });
  });

  describe("validateRedeemPointsFlow", () => {
    it("validiert kompletten Flow", () => {
      const request = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100,
      };
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const validation = validateRedeemPointsFlow(request, result);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültigen Request", () => {
      const request = { points: 100 };
      const result = {};

      const validation = validateRedeemPointsFlow(request, result);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });

  describe("Redeem Points API Integration", () => {
    it("kompletter Flow: Success", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 100,
        metadata: { source: "api" },
      };

      const validation = validateRedeemPointsRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: RedeemDatabaseResult = {
        status: "applied",
        message: "Points redeemed successfully",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      expect(isRedeemPointsSuccessful(dbResult)).toBe(true);
      expect(getRedeemPointsStatusCode(dbResult)).toBe(200);

      const response = buildSuccessRedeemPointsResponse(
        validation.data!.organizationId,
        validation.data!.externalCustomerId,
        dbResult
      );

      expect(response.status).toBe("applied");
      expect(response.redeemedPoints).toBe(100);
    });

    it("kompletter Flow: Insufficient Points", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-789",
        points: 5000,
      };

      const validation = validateRedeemPointsRequest(body);
      expect(validation.valid).toBe(true);

      const dbResult: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points in balance",
        profile_id: "p-789",
        redeemed_points: 0,
        new_points_balance: 100,
      };

      expect(isRedeemPointsSuccessful(dbResult)).toBe(false);
      expect(getRedeemPointsStatusCode(dbResult)).toBe(409);

      const response = buildErrorRedeemPointsResponse(
        validation.data!.organizationId,
        validation.data!.externalCustomerId,
        dbResult
      );

      expect(response.status).toBe("insufficient_points");
      expect(response.message).toContain("Not enough points");
    });

    it("Multiple Requests mit verschiedenen Punktemengen", () => {
      const requests = [
        { organizationId: "org-1", externalCustomerId: "c-1", points: 50 },
        { organizationId: "org-1", externalCustomerId: "c-2", points: 100 },
        { organizationId: "org-1", externalCustomerId: "c-3", points: 1000 },
      ];

      requests.forEach((req) => {
        const validation = validateRedeemPointsRequest(req);
        expect(validation.valid).toBe(true);
        expect(validation.data?.pointsToRedeem).toBeGreaterThan(0);
      });
    });

    it("Request Validation mit Floating Point Points", () => {
      const body = {
        organizationId: "org-123",
        externalCustomerId: "cust-456",
        points: 123.456,
      };

      const validation = validateRedeemPointsRequest(body);

      expect(validation.valid).toBe(true);
      expect(validation.data?.pointsToRedeem).toBe(123);
      expect(Number.isInteger(validation.data?.pointsToRedeem)).toBe(true);
    });
  });
});