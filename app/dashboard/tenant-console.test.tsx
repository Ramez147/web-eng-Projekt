import { describe, it, expect } from "vitest";

// Pure utility functions and data (extrahiert aus LoyaltyConsole)
export type AuthMode = "signin" | "signup";
export type UserRole = "admin" | "member";
export type TransactionType = "earn" | "redeem";

export const AUTH_MODES: AuthMode[] = ["signin", "signup"];
export const USER_ROLES: UserRole[] = ["admin", "member"];
export const TRANSACTION_TYPES: TransactionType[] = ["earn", "redeem"];

export const AUTH_LABELS: Record<AuthMode, string> = {
  signin: "Anmelden",
  signup: "Registrieren",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  member: "Member",
};

export type RegisterResponse = {
  organization: {
    id: string;
    name: string;
    pointsRatio: number;
  };
  apiKey: string;
};

export type AnalyticsResponse = {
  membership: {
    userId: string;
    role: "admin" | "member";
  };
  organization: {
    id: string;
    name: string;
    pointsRatio: number;
  };
  analytics: {
    customersCount: number;
    totalTransactions: number;
    totalRevenueEur: number;
    pointsHistoryByDay: Record<string, { earn: number; redeem: number }>;
    history: Array<{
      id: string;
      type: "earn" | "redeem";
      points: number;
      eurAmount: number;
      createdAt: string;
      externalCustomerId: string;
    }>;
  };
};

export type ProfilesResponse = {
  organizationId: string;
  profiles: Array<{
    id: string;
    externalCustomerId: string;
    pointsBalance: number;
    totalSpentEur: number;
    createdAt: string;
  }>;
};

export type ErrorResponse = { error: string };

export type MembershipListResponse = {
  memberships: Array<{
    userId: string;
    email: string | null;
    role: "admin" | "member";
    createdAt: string;
  }>;
};

// Pure utility functions
export function hasError(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as { error: unknown }).error === "string"
  );
}

export function isValidAuthMode(mode: any): boolean {
  return AUTH_MODES.includes(mode);
}

export function isValidUserRole(role: any): boolean {
  return USER_ROLES.includes(role);
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidPointsRatio(ratio: number): boolean {
  return ratio > 0 && isFinite(ratio);
}

export function isValidOrganizationName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2;
}

export function getAuthModeLabel(mode: AuthMode): string {
  return AUTH_LABELS[mode];
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function toggleAuthMode(mode: AuthMode): AuthMode {
  return mode === "signin" ? "signup" : "signin";
}

export function validateRegisterResponse(response: any): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.organization === "object" &&
    typeof response.organization.id === "string" &&
    typeof response.organization.name === "string" &&
    typeof response.organization.pointsRatio === "number" &&
    typeof response.apiKey === "string"
  );
}

export function validateAnalyticsResponse(response: any): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.membership === "object" &&
    typeof response.organization === "object" &&
    typeof response.analytics === "object"
  );
}

export function validateProfilesResponse(response: any): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof response.organizationId === "string" &&
    Array.isArray(response.profiles)
  );
}

export function getMembershipListCount(response: MembershipListResponse): number {
  return response.memberships.length;
}

export function getAdminCount(response: MembershipListResponse): number {
  return response.memberships.filter((m) => m.role === "admin").length;
}

export function getMemberCount(response: MembershipListResponse): number {
  return response.memberships.filter((m) => m.role === "member").length;
}

export function validateConsoleState(state: {
  isAuthenticated?: boolean;
  authMode?: AuthMode;
  email?: string;
  organizationName?: string;
}): { valid: boolean; error?: string } {
  const isAuthenticated = state.isAuthenticated;
  const authMode = state.authMode;
  const email = state.email;
  const organizationName = state.organizationName;

  if (typeof isAuthenticated === "boolean") {
    if (!isAuthenticated && (!email || !isValidEmail(email))) {
      return { valid: false, error: "Gültige E-Mail erforderlich" };
    }
  }

  if (authMode && !isValidAuthMode(authMode)) {
    return { valid: false, error: "Ungültiger Auth Mode" };
  }

  if (organizationName && !isValidOrganizationName(organizationName)) {
    return { valid: false, error: "Organisationsname zu kurz" };
  }

  return { valid: true };
}

describe("LoyaltyConsole - Pure Utility Functions", () => {
  describe("Auth Modes", () => {
    it("sollte 'signin' und 'signup' enthalten", () => {
      expect(AUTH_MODES).toContain("signin");
      expect(AUTH_MODES).toContain("signup");
    });

    it("sollte genau 2 Auth Modes haben", () => {
      expect(AUTH_MODES).toHaveLength(2);
    });

    it("AUTH_LABELS sollte für alle Modes Labels haben", () => {
      AUTH_MODES.forEach((mode) => {
        expect(AUTH_LABELS[mode]).toBeTruthy();
      });
    });
  });

  describe("User Roles", () => {
    it("sollte 'admin' und 'member' enthalten", () => {
      expect(USER_ROLES).toContain("admin");
      expect(USER_ROLES).toContain("member");
    });

    it("sollte genau 2 Rollen haben", () => {
      expect(USER_ROLES).toHaveLength(2);
    });

    it("ROLE_LABELS sollte für alle Rollen Labels haben", () => {
      USER_ROLES.forEach((role) => {
        expect(ROLE_LABELS[role]).toBeTruthy();
      });
    });
  });

  describe("hasError", () => {
    it("erkennt Error Response mit error String", () => {
      const response = { error: "Something went wrong" };
      expect(hasError(response)).toBe(true);
    });

    it("lehnt Response ohne error ab", () => {
      const response = { data: "test" };
      expect(hasError(response)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(hasError(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(hasError(undefined)).toBe(false);
    });

    it("lehnt Response mit non-string error ab", () => {
      const response = { error: 123 };
      expect(hasError(response)).toBe(false);
    });
  });

  describe("isValidAuthMode", () => {
    it("akzeptiert 'signin'", () => {
      expect(isValidAuthMode("signin")).toBe(true);
    });

    it("akzeptiert 'signup'", () => {
      expect(isValidAuthMode("signup")).toBe(true);
    });

    it("lehnt unbekannte Modes ab", () => {
      expect(isValidAuthMode("invalid")).toBe(false);
    });

    it("lehnt null und undefined ab", () => {
      expect(isValidAuthMode(null)).toBe(false);
      expect(isValidAuthMode(undefined)).toBe(false);
    });
  });

  describe("isValidUserRole", () => {
    it("akzeptiert 'admin'", () => {
      expect(isValidUserRole("admin")).toBe(true);
    });

    it("akzeptiert 'member'", () => {
      expect(isValidUserRole("member")).toBe(true);
    });

    it("lehnt unbekannte Rollen ab", () => {
      expect(isValidUserRole("superadmin")).toBe(false);
      expect(isValidUserRole("guest")).toBe(false);
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
    });

    it("trimmt Whitespace", () => {
      expect(isValidEmail("  test@example.com  ")).toBe(true);
    });
  });

  describe("isValidPassword", () => {
    it("akzeptiert Passwörter mit min. 6 Zeichen", () => {
      expect(isValidPassword("password")).toBe(true);
      expect(isValidPassword("123456")).toBe(true);
    });

    it("lehnt zu kurze Passwörter ab", () => {
      expect(isValidPassword("12345")).toBe(false);
      expect(isValidPassword("")).toBe(false);
    });

    it("akzeptiert längere Passwörter", () => {
      expect(isValidPassword("a very long password")).toBe(true);
    });
  });

  describe("isValidPointsRatio", () => {
    it("akzeptiert positive Zahlen", () => {
      expect(isValidPointsRatio(10)).toBe(true);
      expect(isValidPointsRatio(0.5)).toBe(true);
      expect(isValidPointsRatio(100)).toBe(true);
    });

    it("lehnt 0 ab", () => {
      expect(isValidPointsRatio(0)).toBe(false);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidPointsRatio(-10)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isValidPointsRatio(Infinity)).toBe(false);
    });

    it("lehnt NaN ab", () => {
      expect(isValidPointsRatio(NaN)).toBe(false);
    });
  });

  describe("isValidOrganizationName", () => {
    it("akzeptiert Namen mit mindestens 2 Zeichen", () => {
      expect(isValidOrganizationName("Al")).toBe(true);
      expect(isValidOrganizationName("Company Name")).toBe(true);
    });

    it("lehnt zu kurze Namen ab", () => {
      expect(isValidOrganizationName("A")).toBe(false);
      expect(isValidOrganizationName("")).toBe(false);
    });

    it("trimmt Whitespace", () => {
      expect(isValidOrganizationName("  Company  ")).toBe(true);
    });
  });

  describe("getAuthModeLabel", () => {
    it("gibt 'Anmelden' für 'signin' zurück", () => {
      expect(getAuthModeLabel("signin")).toBe("Anmelden");
    });

    it("gibt 'Registrieren' für 'signup' zurück", () => {
      expect(getAuthModeLabel("signup")).toBe("Registrieren");
    });
  });

  describe("getRoleLabel", () => {
    it("gibt 'Administrator' für 'admin' zurück", () => {
      expect(getRoleLabel("admin")).toBe("Administrator");
    });

    it("gibt 'Member' für 'member' zurück", () => {
      expect(getRoleLabel("member")).toBe("Member");
    });
  });

  describe("toggleAuthMode", () => {
    it("wechselt von 'signin' zu 'signup'", () => {
      expect(toggleAuthMode("signin")).toBe("signup");
    });

    it("wechselt von 'signup' zu 'signin'", () => {
      expect(toggleAuthMode("signup")).toBe("signin");
    });
  });

  describe("validateRegisterResponse", () => {
    it("validiert korrekte RegisterResponse", () => {
      const response = {
        organization: {
          id: "org-123",
          name: "Test Org",
          pointsRatio: 10,
        },
        apiKey: "api-key-123",
      };
      expect(validateRegisterResponse(response)).toBe(true);
    });

    it("lehnt Response ohne organization ab", () => {
      const response = { apiKey: "api-key-123" };
      expect(validateRegisterResponse(response)).toBe(false);
    });

    it("lehnt Response ohne apiKey ab", () => {
      const response = {
        organization: {
          id: "org-123",
          name: "Test Org",
          pointsRatio: 10,
        },
      };
      expect(validateRegisterResponse(response)).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(validateRegisterResponse(null)).toBe(false);
    });
  });

  describe("validateAnalyticsResponse", () => {
    it("validiert korrekte AnalyticsResponse", () => {
      const response = {
        membership: { userId: "user-123", role: "admin" },
        organization: { id: "org-123", name: "Test", pointsRatio: 10 },
        analytics: { customersCount: 5, totalTransactions: 10 },
      };
      expect(validateAnalyticsResponse(response)).toBe(true);
    });

    it("lehnt Response ohne membership ab", () => {
      const response = {
        organization: { id: "org-123" },
        analytics: {},
      };
      expect(validateAnalyticsResponse(response)).toBe(false);
    });
  });

  describe("validateProfilesResponse", () => {
    it("validiert korrekte ProfilesResponse", () => {
      const response = {
        organizationId: "org-123",
        profiles: [{ id: "p1", pointsBalance: 100 }],
      };
      expect(validateProfilesResponse(response)).toBe(true);
    });

    it("lehnt Response ohne organizationId ab", () => {
      const response = { profiles: [] };
      expect(validateProfilesResponse(response)).toBe(false);
    });

    it("lehnt Response ohne profiles Array ab", () => {
      const response = { organizationId: "org-123" };
      expect(validateProfilesResponse(response)).toBe(false);
    });
  });

  describe("getMembershipListCount", () => {
    it("zählt Mitglieder korrekt", () => {
      const response: MembershipListResponse = {
        memberships: [
          { userId: "u1", email: "test1@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u2", email: "test2@test.com", role: "member", createdAt: "2024-01-01" },
        ],
      };
      expect(getMembershipListCount(response)).toBe(2);
    });

    it("gibt 0 für leere Liste zurück", () => {
      const response: MembershipListResponse = { memberships: [] };
      expect(getMembershipListCount(response)).toBe(0);
    });
  });

  describe("getAdminCount", () => {
    it("zählt nur Admins", () => {
      const response: MembershipListResponse = {
        memberships: [
          { userId: "u1", email: "test1@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u2", email: "test2@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u3", email: "test3@test.com", role: "member", createdAt: "2024-01-01" },
        ],
      };
      expect(getAdminCount(response)).toBe(2);
    });

    it("gibt 0 ohne Admins zurück", () => {
      const response: MembershipListResponse = {
        memberships: [
          { userId: "u1", email: "test1@test.com", role: "member", createdAt: "2024-01-01" },
        ],
      };
      expect(getAdminCount(response)).toBe(0);
    });
  });

  describe("getMemberCount", () => {
    it("zählt nur Members", () => {
      const response: MembershipListResponse = {
        memberships: [
          { userId: "u1", email: "test1@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u2", email: "test2@test.com", role: "member", createdAt: "2024-01-01" },
          { userId: "u3", email: "test3@test.com", role: "member", createdAt: "2024-01-01" },
        ],
      };
      expect(getMemberCount(response)).toBe(2);
    });
  });

  describe("validateConsoleState", () => {
    it("akzeptiert valide State", () => {
      const result = validateConsoleState({
        isAuthenticated: true,
        authMode: "signin",
      });
      expect(result.valid).toBe(true);
    });

    it("lehnt ungültige E-Mail ab wenn nicht authentifiziert", () => {
      const result = validateConsoleState({
        isAuthenticated: false,
        email: "invalid",
      });
      expect(result.valid).toBe(false);
    });

    it("lehnt ungültigen Auth Mode ab", () => {
      const result = validateConsoleState({
        authMode: "invalid" as any,
      });
      expect(result.valid).toBe(false);
    });

    it("lehnt kurze Organisationsnamen ab", () => {
      const result = validateConsoleState({
        organizationName: "A",
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("LoyaltyConsole Utilities Integration", () => {
    it("kompletter Auth Flow: Mode → Label", () => {
      const modes = AUTH_MODES;
      modes.forEach((mode) => {
        expect(isValidAuthMode(mode)).toBe(true);
        const label = getAuthModeLabel(mode);
        expect(label).toBeTruthy();
        const toggled = toggleAuthMode(mode);
        expect(isValidAuthMode(toggled)).toBe(true);
      });
    });

    it("kompletter Role Flow: Role → Label", () => {
      const roles = USER_ROLES;
      roles.forEach((role) => {
        expect(isValidUserRole(role)).toBe(true);
        const label = getRoleLabel(role);
        expect(label).toBeTruthy();
      });
    });

    it("Membership Counting funktioniert korrekt", () => {
      const response: MembershipListResponse = {
        memberships: [
          { userId: "u1", email: "test1@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u2", email: "test2@test.com", role: "admin", createdAt: "2024-01-01" },
          { userId: "u3", email: "test3@test.com", role: "member", createdAt: "2024-01-01" },
        ],
      };
      
      const total = getMembershipListCount(response);
      const admins = getAdminCount(response);
      const members = getMemberCount(response);
      
      expect(total).toBe(3);
      expect(admins).toBe(2);
      expect(members).toBe(1);
      expect(admins + members).toBe(total);
    });

    it("Error Handling funktioniert", () => {
      const errorResponse = { error: "Authentication failed" };
      const successResponse = { data: "success" };
      
      expect(hasError(errorResponse)).toBe(true);
      expect(hasError(successResponse)).toBe(false);
    });
  });
});
