// user-membership.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  createMembershipContext,
  isAdminRole,
  isMemberRole,
  validateMembershipData,
  areMembershipContextsEqual,
  formatMembershipResponse,
  type MembershipContext,
} from "./user-membership";

describe("User Membership Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // createMembershipContext Tests
  describe("createMembershipContext", () => {
    it("erstellt gültige Admin MembershipContext", () => {
      const context = createMembershipContext("user-123", "org-456", "admin");
      expect(context.userId).toBe("user-123");
      expect(context.organizationId).toBe("org-456");
      expect(context.role).toBe("admin");
    });

    it("erstellt gültige Member MembershipContext", () => {
      const context = createMembershipContext("user-789", "org-101", "member");
      expect(context.userId).toBe("user-789");
      expect(context.organizationId).toBe("org-101");
      expect(context.role).toBe("member");
    });

    it("wirft Fehler für leeren userId", () => {
      expect(() => createMembershipContext("", "org-456", "admin")).toThrow(
        "Invalid userId"
      );
    });

    it("wirft Fehler für null userId", () => {
      expect(() => createMembershipContext(null as any, "org-456", "admin")).toThrow(
        "Invalid userId"
      );
    });

    it("wirft Fehler für leeren organizationId", () => {
      expect(() => createMembershipContext("user-123", "", "admin")).toThrow(
        "Invalid organizationId"
      );
    });

    it("wirft Fehler für null organizationId", () => {
      expect(() => createMembershipContext("user-123", null as any, "admin")).toThrow(
        "Invalid organizationId"
      );
    });

    it("wirft Fehler für ungültiger Role", () => {
      expect(() => createMembershipContext("user-123", "org-456", "superadmin")).toThrow(
        "Invalid role"
      );
    });

    it("wirft Fehler für leere Role", () => {
      expect(() => createMembershipContext("user-123", "org-456", "")).toThrow(
        "Invalid role"
      );
    });

    it("akzeptiert gültige UUIDs", () => {
      const context = createMembershipContext(
        "550e8400-e29b-41d4-a716-446655440000",
        "550e8400-e29b-41d4-a716-446655440001",
        "admin"
      );
      expect(context.userId).toMatch(/[0-9a-f-]{36}/);
    });

    it("akzeptiert lange String-IDs", () => {
      const longId = "x".repeat(255);
      const context = createMembershipContext(longId, "org-456", "member");
      expect(context.userId).toBe(longId);
    });

    it("hat korrekte Struktur", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      expect(context).toHaveProperty("userId");
      expect(context).toHaveProperty("organizationId");
      expect(context).toHaveProperty("role");
    });
  });

  // isAdminRole Tests
  describe("isAdminRole", () => {
    it("gibt true für Admin zurück", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      expect(isAdminRole(context)).toBe(true);
    });

    it("gibt false für Member zurück", () => {
      const context = createMembershipContext("user-1", "org-1", "member");
      expect(isAdminRole(context)).toBe(false);
    });

    it("funktioniert mit verschiedenen User IDs", () => {
      const admin1 = createMembershipContext("user-1", "org-1", "admin");
      const admin2 = createMembershipContext("user-2", "org-2", "admin");
      expect(isAdminRole(admin1)).toBe(true);
      expect(isAdminRole(admin2)).toBe(true);
    });

    it("funktioniert mit verschiedenen Org IDs", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      expect(isAdminRole(context)).toBe(true);
    });
  });

  // isMemberRole Tests
  describe("isMemberRole", () => {
    it("gibt true für Member zurück", () => {
      const context = createMembershipContext("user-1", "org-1", "member");
      expect(isMemberRole(context)).toBe(true);
    });

    it("gibt false für Admin zurück", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      expect(isMemberRole(context)).toBe(false);
    });

    it("funktioniert mit verschiedenen User IDs", () => {
      const member1 = createMembershipContext("user-1", "org-1", "member");
      const member2 = createMembershipContext("user-2", "org-2", "member");
      expect(isMemberRole(member1)).toBe(true);
      expect(isMemberRole(member2)).toBe(true);
    });
  });

  // validateMembershipData Tests
  describe("validateMembershipData", () => {
    it("validiert korrekte Admin-Daten", () => {
      const data = { organization_id: "org-1", role: "admin" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validiert korrekte Member-Daten", () => {
      const data = { organization_id: "org-1", role: "member" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("lehnt nicht-Objekt ab", () => {
      const result = validateMembershipData("string");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("lehnt null ab", () => {
      const result = validateMembershipData(null);
      expect(result.valid).toBe(false);
    });

    it("lehnt fehlende organization_id ab", () => {
      const data = { role: "admin" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("organization_id");
    });

    it("lehnt leere organization_id ab", () => {
      const data = { organization_id: "", role: "admin" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(false);
    });

    it("lehnt ungültige role ab", () => {
      const data = { organization_id: "org-1", role: "superadmin" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("role");
    });

    it("lehnt fehlende role ab", () => {
      const data = { organization_id: "org-1" };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("role");
    });

    it("akzeptiert zusätzliche Felder", () => {
      const data = {
        organization_id: "org-1",
        role: "admin",
        extra: "field",
        another: 123,
      };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(true);
    });

    it("akzeptiert verschiedene String-Formate für IDs", () => {
      const data1 = { organization_id: "simple-org", role: "admin" };
      const data2 = { organization_id: "550e8400-e29b-41d4-a716-446655440000", role: "member" };
      expect(validateMembershipData(data1).valid).toBe(true);
      expect(validateMembershipData(data2).valid).toBe(true);
    });
  });

  // areMembershipContextsEqual Tests
  describe("areMembershipContextsEqual", () => {
    it("gibt true für identische Contexts zurück", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-1", "org-1", "admin");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(true);
    });

    it("gibt false für unterschiedliche userId zurück", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-2", "org-1", "admin");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(false);
    });

    it("gibt false für unterschiedliche organizationId zurück", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-1", "org-2", "admin");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(false);
    });

    it("gibt false für unterschiedliche role zurück", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-1", "org-1", "member");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(false);
    });

    it("gibt false zurück wenn alle Felder unterschiedlich sind", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-2", "org-2", "member");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(false);
    });

    it("ist reflexiv (x === x)", () => {
      const ctx = createMembershipContext("user-1", "org-1", "admin");
      expect(areMembershipContextsEqual(ctx, ctx)).toBe(true);
    });

    it("ist symmetrisch (x === y implies y === x)", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-1", "org-1", "admin");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(areMembershipContextsEqual(ctx2, ctx1));
    });
  });

  // formatMembershipResponse Tests
  describe("formatMembershipResponse", () => {
    it("formatiert Admin Context korrekt", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      const formatted = formatMembershipResponse(context);
      expect(formatted.userId).toBe("user-1");
      expect(formatted.organizationId).toBe("org-1");
      expect(formatted.role).toBe("admin");
      expect(formatted.isAdmin).toBe(true);
    });

    it("formatiert Member Context korrekt", () => {
      const context = createMembershipContext("user-1", "org-1", "member");
      const formatted = formatMembershipResponse(context);
      expect(formatted.userId).toBe("user-1");
      expect(formatted.organizationId).toBe("org-1");
      expect(formatted.role).toBe("member");
      expect(formatted.isAdmin).toBe(false);
    });

    it("hat alle erforderlichen Felder", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      const formatted = formatMembershipResponse(context);
      expect(formatted).toHaveProperty("userId");
      expect(formatted).toHaveProperty("organizationId");
      expect(formatted).toHaveProperty("role");
      expect(formatted).toHaveProperty("isAdmin");
    });

    it("isAdmin ist true für Admin", () => {
      const admin = createMembershipContext("user-1", "org-1", "admin");
      const formatted = formatMembershipResponse(admin);
      expect(formatted.isAdmin).toBe(true);
    });

    it("isAdmin ist false für Member", () => {
      const member = createMembershipContext("user-1", "org-1", "member");
      const formatted = formatMembershipResponse(member);
      expect(formatted.isAdmin).toBe(false);
    });

    it("erhält ursprüngliche Werte", () => {
      const userId = "user-uuid-123";
      const orgId = "org-uuid-456";
      const context = createMembershipContext(userId, orgId, "admin");
      const formatted = formatMembershipResponse(context);
      expect(formatted.userId).toBe(userId);
      expect(formatted.organizationId).toBe(orgId);
    });

    it("formatiert mehrere Contexts unterschiedlich", () => {
      const admin = createMembershipContext("user-1", "org-1", "admin");
      const member = createMembershipContext("user-2", "org-2", "member");
      const formattedAdmin = formatMembershipResponse(admin);
      const formattedMember = formatMembershipResponse(member);
      expect(formattedAdmin.isAdmin).toBe(true);
      expect(formattedMember.isAdmin).toBe(false);
    });
  });

  // Integration Tests
  describe("User Membership Utils Integration", () => {
    it("erstellt und validiert MembershipContext", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      expect(isAdminRole(context)).toBe(true);
      expect(isMemberRole(context)).toBe(false);
    });

    it("validiert erstellte Contexts", () => {
      const context = createMembershipContext("user-1", "org-1", "member");
      const data = {
        organization_id: context.organizationId,
        role: context.role,
      };
      const result = validateMembershipData(data);
      expect(result.valid).toBe(true);
    });

    it("vergleicht und formatiert Contexts", () => {
      const ctx1 = createMembershipContext("user-1", "org-1", "admin");
      const ctx2 = createMembershipContext("user-1", "org-1", "admin");
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(true);
      const formatted = formatMembershipResponse(ctx1);
      expect(formatted.isAdmin).toBe(true);
    });

    it("kombiniert Rollen-Checks mit Formatierung", () => {
      const admin = createMembershipContext("admin-1", "org-1", "admin");
      const member = createMembershipContext("user-1", "org-1", "member");

      expect(isAdminRole(admin)).toBe(true);
      expect(isAdminRole(member)).toBe(false);
      expect(isMemberRole(member)).toBe(true);

      const adminFormatted = formatMembershipResponse(admin);
      const memberFormatted = formatMembershipResponse(member);
      expect(adminFormatted.isAdmin).toBe(true);
      expect(memberFormatted.isAdmin).toBe(false);
    });

    it("validiert verschiedene Membership-Szenarien", () => {
      const scenarios = [
        { organization_id: "org-1", role: "admin", expectValid: true },
        { organization_id: "org-2", role: "member", expectValid: true },
        { organization_id: "", role: "admin", expectValid: false },
        { organization_id: "org-3", role: "invalid", expectValid: false },
      ];

      scenarios.forEach(({ organization_id, role, expectValid }) => {
        const data = { organization_id, role };
        const result = validateMembershipData(data);
        expect(result.valid).toBe(expectValid);
      });
    });

    it("erstellte Contexts sind alle unterscheidbar", () => {
      const contexts = [
        createMembershipContext("user-1", "org-1", "admin"),
        createMembershipContext("user-2", "org-1", "admin"),
        createMembershipContext("user-1", "org-2", "admin"),
        createMembershipContext("user-1", "org-1", "member"),
      ];

      for (let i = 0; i < contexts.length; i++) {
        for (let j = i + 1; j < contexts.length; j++) {
          expect(areMembershipContextsEqual(contexts[i], contexts[j])).toBe(false);
        }
      }
    });

    it("formatierte Responses sind konsistent", () => {
      const context = createMembershipContext("user-1", "org-1", "admin");
      const formatted1 = formatMembershipResponse(context);
      const formatted2 = formatMembershipResponse(context);
      expect(formatted1).toEqual(formatted2);
    });

    it("alle Utilities sind Pure Functions", () => {
      const userId = "user-1";
      const orgId = "org-1";
      const role = "admin";

      // Multiple calls with same input produce same output
      const ctx1 = createMembershipContext(userId, orgId, role);
      const ctx2 = createMembershipContext(userId, orgId, role);
      expect(areMembershipContextsEqual(ctx1, ctx2)).toBe(true);

      const admin1 = isAdminRole(ctx1);
      const admin2 = isAdminRole(ctx2);
      expect(admin1).toBe(admin2);

      const formatted1 = formatMembershipResponse(ctx1);
      const formatted2 = formatMembershipResponse(ctx2);
      expect(formatted1).toEqual(formatted2);
    });

    it("Rollen-Checks und Validierung sind konsistent", () => {
      const adminData = { organization_id: "org-1", role: "admin" };
      const memberData = { organization_id: "org-1", role: "member" };

      const adminValid = validateMembershipData(adminData).valid;
      const memberValid = validateMembershipData(memberData).valid;
      expect(adminValid).toBe(true);
      expect(memberValid).toBe(true);

      const adminContext = createMembershipContext("user-1", "org-1", "admin");
      const memberContext = createMembershipContext("user-1", "org-1", "member");
      expect(isAdminRole(adminContext)).toBe(true);
      expect(isMemberRole(memberContext)).toBe(true);
    });

    it("verarbeitet große Mengen von Contexts", () => {
      const contexts: MembershipContext[] = [];
      for (let i = 0; i < 100; i++) {
        contexts.push(
          createMembershipContext(`user-${i}`, `org-${i % 10}`, i % 2 === 0 ? "admin" : "member")
        );
      }

      expect(contexts.length).toBe(100);

      // Check some properties
      const admins = contexts.filter(isAdminRole);
      const members = contexts.filter(isMemberRole);
      expect(admins.length).toBeGreaterThan(0);
      expect(members.length).toBeGreaterThan(0);
      expect(admins.length + members.length).toBe(100);
    });
  });
});
