import { describe, it, expect } from "vitest";

// Pure utility functions and types (extrahiert aus Redeem Route)
export type RedeemRequest = {
  externalCustomerId: string;
  points: number;
  metadata?: Record<string, any>;
};

export type RedeemSuccessResponse = {
  organizationId: string;
  externalCustomerId: string;
  profileId: string;
  redeemedPoints: number;
  newPointsBalance: number;
  status: "applied";
  message: string;
};

export type RedeemErrorResponse = {
  error: string;
  status?: string;
  newPointsBalance?: number;
};

export type RedeemDatabaseResult = {
  status: "applied" | "failed" | "insufficient_points";
  message: string;
  profile_id: string;
  redeemed_points: number;
  new_points_balance: string | number;
};

export type Organization = {
  id: string;
  name: string;
  pointsRatio: number;
};

export const REDEEM_STATUS = {
  APPLIED: "applied",
  FAILED: "failed",
  INSUFFICIENT_POINTS: "insufficient_points",
} as const;

export const ERROR_MESSAGES = {
  NO_RESULT: "No transaction result returned",
  INVALID_CUSTOMER_ID: "Invalid customer ID",
  INVALID_POINTS: "Invalid points amount",
  INSUFFICIENT_POINTS: "Insufficient points balance",
} as const;

// Pure utility functions
export function isValidRedeemRequest(request: any): request is RedeemRequest {
  return (
    typeof request === "object" &&
    request !== null &&
    typeof request.externalCustomerId === "string" &&
    request.externalCustomerId.trim().length > 0 &&
    typeof request.points === "number" &&
    request.points > 0 &&
    isFinite(request.points)
  );
}

export function isValidCustomerId(customerId: any): boolean {
  return typeof customerId === "string" && customerId.trim().length > 0;
}

export function isValidPointsAmount(points: any): boolean {
  return typeof points === "number" && points > 0 && isFinite(points);
}

export function isValidDatabaseResult(result: any): boolean {
  return (
    typeof result === "object" &&
    result !== null &&
    typeof result.status === "string" &&
    (REDEEM_STATUS.APPLIED === result.status ||
      REDEEM_STATUS.FAILED === result.status ||
      REDEEM_STATUS.INSUFFICIENT_POINTS === result.status)
  );
}

export function isRedeemSuccessful(result: RedeemDatabaseResult): boolean {
  return result.status === REDEEM_STATUS.APPLIED;
}

export function buildSuccessResponse(
  organization: Organization,
  request: RedeemRequest,
  result: RedeemDatabaseResult
): RedeemSuccessResponse {
  return {
    organizationId: organization.id,
    externalCustomerId: request.externalCustomerId,
    profileId: result.profile_id,
    redeemedPoints: result.redeemed_points,
    newPointsBalance: Number(result.new_points_balance),
    status: "applied" as const,
    message: result.message,
  };
}

export function buildErrorResponse(
  result: RedeemDatabaseResult
): RedeemErrorResponse {
  return {
    error: result.message,
    status: result.status,
    newPointsBalance: Number(result.new_points_balance),
  };
}

export function parseRedeemDatabaseResult(data: any): RedeemDatabaseResult | null {
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

export function getRedeemStatusCode(result: RedeemDatabaseResult): number {
  return result.status === REDEEM_STATUS.APPLIED ? 200 : 400;
}

export function validateRedeemFlow(
  request: any,
  result: any
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidRedeemRequest(request)) {
    if (!isValidCustomerId(request?.externalCustomerId)) {
      errors.push("Invalid customer ID");
    }
    if (!isValidPointsAmount(request?.points)) {
      errors.push("Invalid points amount");
    }
  }

  if (!isValidDatabaseResult(result)) {
    errors.push("Invalid database result");
  }

  return { valid: errors.length === 0, errors };
}

describe("Redeem API - Pure Utility Functions", () => {
  describe("Redeem Status Constants", () => {
    it("sollte alle Status-Werte definieren", () => {
      expect(REDEEM_STATUS.APPLIED).toBe("applied");
      expect(REDEEM_STATUS.FAILED).toBe("failed");
      expect(REDEEM_STATUS.INSUFFICIENT_POINTS).toBe("insufficient_points");
    });

    it("sollte alle Error Messages definieren", () => {
      expect(ERROR_MESSAGES.NO_RESULT).toBeTruthy();
      expect(ERROR_MESSAGES.INVALID_CUSTOMER_ID).toBeTruthy();
      expect(ERROR_MESSAGES.INVALID_POINTS).toBeTruthy();
      expect(ERROR_MESSAGES.INSUFFICIENT_POINTS).toBeTruthy();
    });
  });

  describe("isValidRedeemRequest", () => {
    it("akzeptiert valide Redeem Requests", () => {
      const request = {
        externalCustomerId: "cust-123",
        points: 100,
      };
      expect(isValidRedeemRequest(request)).toBe(true);
    });

    it("akzeptiert Requests mit Metadata", () => {
      const request = {
        externalCustomerId: "cust-123",
        points: 100,
        metadata: { reason: "promotion" },
      };
      expect(isValidRedeemRequest(request)).toBe(true);
    });

    it("lehnt Requests ohne externalCustomerId ab", () => {
      const request = { points: 100 };
      expect(isValidRedeemRequest(request)).toBe(false);
    });

    it("lehnt Requests ohne points ab", () => {
      const request = { externalCustomerId: "cust-123" };
      expect(isValidRedeemRequest(request)).toBe(false);
    });

    it("lehnt leere customerId ab", () => {
      const request = {
        externalCustomerId: "",
        points: 100,
      };
      expect(isValidRedeemRequest(request)).toBe(false);
    });

    it("lehnt 0 oder negative Points ab", () => {
      expect(isValidRedeemRequest({ externalCustomerId: "cust-123", points: 0 })).toBe(false);
      expect(isValidRedeemRequest({ externalCustomerId: "cust-123", points: -10 })).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isValidRedeemRequest({ externalCustomerId: "cust-123", points: Infinity })).toBe(false);
    });

    it("lehnt null und undefined ab", () => {
      expect(isValidRedeemRequest(null)).toBe(false);
      expect(isValidRedeemRequest(undefined)).toBe(false);
    });
  });

  describe("isValidCustomerId", () => {
    it("akzeptiert nicht-leere Strings", () => {
      expect(isValidCustomerId("cust-123")).toBe(true);
      expect(isValidCustomerId("customer")).toBe(true);
    });

    it("lehnt leere Strings ab", () => {
      expect(isValidCustomerId("")).toBe(false);
      expect(isValidCustomerId("   ")).toBe(false);
    });

    it("lehnt nicht-Strings ab", () => {
      expect(isValidCustomerId(123)).toBe(false);
      expect(isValidCustomerId(null)).toBe(false);
    });
  });

  describe("isValidPointsAmount", () => {
    it("akzeptiert positive Zahlen", () => {
      expect(isValidPointsAmount(100)).toBe(true);
      expect(isValidPointsAmount(1)).toBe(true);
      expect(isValidPointsAmount(0.5)).toBe(true);
    });

    it("lehnt 0 ab", () => {
      expect(isValidPointsAmount(0)).toBe(false);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidPointsAmount(-100)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isValidPointsAmount(Infinity)).toBe(false);
    });

    it("lehnt NaN ab", () => {
      expect(isValidPointsAmount(NaN)).toBe(false);
    });

    it("lehnt nicht-Zahlen ab", () => {
      expect(isValidPointsAmount("100")).toBe(false);
      expect(isValidPointsAmount(null)).toBe(false);
    });
  });

  describe("isValidDatabaseResult", () => {
    it("akzeptiert valide Results mit 'applied' Status", () => {
      const result = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("akzeptiert Results mit 'failed' Status", () => {
      const result = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 600,
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("akzeptiert Results mit 'insufficient_points' Status", () => {
      const result = {
        status: "insufficient_points",
        message: "Not enough points",
      };
      expect(isValidDatabaseResult(result)).toBe(true);
    });

    it("lehnt Results mit ungültigem Status ab", () => {
      const result = {
        status: "invalid",
        message: "Error",
      };
      expect(isValidDatabaseResult(result)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidDatabaseResult(null)).toBe(false);
    });
  });

  describe("isRedeemSuccessful", () => {
    it("gibt true für 'applied' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(isRedeemSuccessful(result)).toBe(true);
    });

    it("gibt false für 'failed' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 600,
      };
      expect(isRedeemSuccessful(result)).toBe(false);
    });

    it("gibt false für 'insufficient_points' Status zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 100,
      };
      expect(isRedeemSuccessful(result)).toBe(false);
    });
  });

  describe("buildSuccessResponse", () => {
    it("baut valide Success Response", () => {
      const organization: Organization = {
        id: "org-123",
        name: "Test Org",
        pointsRatio: 10,
      };
      const request: RedeemRequest = {
        externalCustomerId: "cust-123",
        points: 100,
      };
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Points redeemed successfully",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const response = buildSuccessResponse(organization, request, result);

      expect(response).toEqual({
        organizationId: "org-123",
        externalCustomerId: "cust-123",
        profileId: "p-123",
        redeemedPoints: 100,
        newPointsBalance: 500,
        status: "applied",
        message: "Points redeemed successfully",
      });
    });

    it("konvertiert newPointsBalance zu Number", () => {
      const organization: Organization = {
        id: "org-123",
        name: "Test Org",
        pointsRatio: 10,
      };
      const request: RedeemRequest = {
        externalCustomerId: "cust-123",
        points: 100,
      };
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: "500",
      };

      const response = buildSuccessResponse(organization, request, result);

      expect(typeof response.newPointsBalance).toBe("number");
      expect(response.newPointsBalance).toBe(500);
    });
  });

  describe("buildErrorResponse", () => {
    it("baut valide Error Response", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 100,
      };

      const response = buildErrorResponse(result);

      expect(response).toEqual({
        error: "Not enough points",
        status: "insufficient_points",
        newPointsBalance: 100,
      });
    });

    it("konvertiert newPointsBalance zu Number", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: "200",
      };

      const response = buildErrorResponse(result);

      expect(typeof response.newPointsBalance).toBe("number");
      expect(response.newPointsBalance).toBe(200);
    });
  });

  describe("parseRedeemDatabaseResult", () => {
    it("parsed einzelnes Objekt", () => {
      const data = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const result = parseRedeemDatabaseResult(data);

      expect(result).toEqual({
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      });
    });

    it("parsed Array und nimmt erstes Element", () => {
      const data = [
        {
          status: "applied",
          message: "Success",
          profile_id: "p-123",
          redeemed_points: 100,
          new_points_balance: 500,
        },
      ];

      const result = parseRedeemDatabaseResult(data);

      expect(result?.status).toBe("applied");
      expect(result?.profile_id).toBe("p-123");
    });

    it("gibt null für null Eingabe zurück", () => {
      expect(parseRedeemDatabaseResult(null)).toBeNull();
    });

    it("gibt null für undefined Eingabe zurück", () => {
      expect(parseRedeemDatabaseResult(undefined)).toBeNull();
    });

    it("gibt null für leeres Array zurück", () => {
      expect(parseRedeemDatabaseResult([])).toBeNull();
    });
  });

  describe("getRedeemStatusCode", () => {
    it("gibt 200 für 'applied' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };
      expect(getRedeemStatusCode(result)).toBe(200);
    });

    it("gibt 400 für 'failed' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "failed",
        message: "Error",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 600,
      };
      expect(getRedeemStatusCode(result)).toBe(400);
    });

    it("gibt 400 für 'insufficient_points' zurück", () => {
      const result: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points",
        profile_id: "p-123",
        redeemed_points: 0,
        new_points_balance: 100,
      };
      expect(getRedeemStatusCode(result)).toBe(400);
    });
  });

  describe("validateRedeemFlow", () => {
    it("validiert kompletten Flow", () => {
      const request: RedeemRequest = {
        externalCustomerId: "cust-123",
        points: 100,
      };
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const validation = validateRedeemFlow(request, result);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("sammelt Fehler für ungültigen Request", () => {
      const request = {
        externalCustomerId: "",
        points: -10,
      };
      const result: RedeemDatabaseResult = {
        status: "applied",
        message: "Success",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      const validation = validateRedeemFlow(request, result);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("sammelt Fehler für ungültiges Result", () => {
      const request: RedeemRequest = {
        externalCustomerId: "cust-123",
        points: 100,
      };
      const result = { status: "invalid" };

      const validation = validateRedeemFlow(request, result);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain("Invalid database result");
    });
  });

  describe("Redeem API Integration", () => {
    it("kompletter Redeem Flow mit Success", () => {
      const request: RedeemRequest = {
        externalCustomerId: "cust-123",
        points: 100,
        metadata: { source: "api" },
      };

      expect(isValidRedeemRequest(request)).toBe(true);

      const dbResult: RedeemDatabaseResult = {
        status: "applied",
        message: "Points redeemed successfully",
        profile_id: "p-123",
        redeemed_points: 100,
        new_points_balance: 500,
      };

      expect(isRedeemSuccessful(dbResult)).toBe(true);
      expect(getRedeemStatusCode(dbResult)).toBe(200);

      const organization: Organization = {
        id: "org-123",
        name: "Test Org",
        pointsRatio: 10,
      };

      const response = buildSuccessResponse(organization, request, dbResult);
      expect(response.organizationId).toBe("org-123");
      expect(response.status).toBe("applied");
    });

    it("kompletter Redeem Flow mit Insufficient Points", () => {
      const request: RedeemRequest = {
        externalCustomerId: "cust-456",
        points: 1000,
      };

      expect(isValidRedeemRequest(request)).toBe(true);

      const dbResult: RedeemDatabaseResult = {
        status: "insufficient_points",
        message: "Not enough points in balance",
        profile_id: "p-456",
        redeemed_points: 0,
        new_points_balance: 100,
      };

      expect(isRedeemSuccessful(dbResult)).toBe(false);
      expect(getRedeemStatusCode(dbResult)).toBe(400);

      const response = buildErrorResponse(dbResult);
      expect(response.error).toContain("Not enough points");
      expect(response.status).toBe("insufficient_points");
    });

    it("Array Result Parsing und Response Building", () => {
      const dbData = [
        {
          status: "applied",
          message: "Success",
          profile_id: "p-123",
          redeemed_points: 50,
          new_points_balance: "450",
        },
      ];

      const parsed = parseRedeemDatabaseResult(dbData);
      expect(parsed).not.toBeNull();

      if (parsed) {
        expect(isRedeemSuccessful(parsed)).toBe(true);
        const statusCode = getRedeemStatusCode(parsed);
        expect(statusCode).toBe(200);
      }
    });

    it("Multiple Redeem Requests mit unterschiedlichen Punktemengen", () => {
      const requests = [
        { externalCustomerId: "cust-1", points: 10 },
        { externalCustomerId: "cust-2", points: 100 },
        { externalCustomerId: "cust-3", points: 1000 },
      ];

      requests.forEach((req) => {
        expect(isValidRedeemRequest(req)).toBe(true);
        expect(isValidPointsAmount(req.points)).toBe(true);
      });
    });
  });
});