import { describe, it, expect } from "vitest";

// Pure utility functions and data (extrahiert aus TeamPage)
export type TeamMember = {
  name: string;
  role: string;
  tone: string;
  description: string;
  expertise: string[];
};

export const members: TeamMember[] = [
  {
    name: "Ramez",
    role: "Produktstrategie und UX",
    tone: "from-primary/20 via-primary/10 to-background",
    description: "Führt die Vision des Produkts an und gestaltet intuitive, benutzerfreundliche Erfahrungen.",
    expertise: ["Strategie", "UX/UI", "User Research"],
  },
  {
    name: "William",
    role: "Full-Stack Entwicklung",
    tone: "from-sky-500/20 via-sky-500/10 to-background",
    description: "Baut die technische Grundlage mit modernen, skalierbaren Lösungen.",
    expertise: ["Backend", "Frontend", "API Design"],
  },
  {
    name: "Arezo",
    role: "Kommunikation und Design",
    tone: "from-emerald-500/20 via-emerald-500/10 to-background",
    description: "Prägt die visuelle Identität und vermittelt unsere Botschaft klar und wirkungsvoll.",
    expertise: ["Design System", "Branding", "Content"],
  },
  {
    name: "Ghaleb",
    role: "Daten, Analytics und Betrieb",
    tone: "from-amber-500/20 via-amber-500/10 to-background",
    description: "Sichert die Stabilität des Systems und extrahiert wertvolle Erkenntnisse aus Daten.",
    expertise: ["Datenanalyse", "DevOps", "Monitoring"],
  },
];

// Pure utility functions
export function getMemberByName(name: string): TeamMember | undefined {
  return members.find((member) => member.name === name);
}

export function getMembersByRole(roleKeyword: string): TeamMember[] {
  return members.filter((member) =>
    member.role.toLowerCase().includes(roleKeyword.toLowerCase())
  );
}

export function getMembersWithExpertise(skill: string): TeamMember[] {
  return members.filter((member) =>
    member.expertise.some((exp) => exp.toLowerCase() === skill.toLowerCase())
  );
}

export function getAllExpertiseTags(): string[] {
  const tags = new Set<string>();
  members.forEach((member) => {
    member.expertise.forEach((skill) => tags.add(skill));
  });
  return Array.from(tags).sort();
}

export function validateTeamMember(member: any): boolean {
  return (
    typeof member === "object" &&
    member !== null &&
    typeof member.name === "string" &&
    typeof member.role === "string" &&
    typeof member.tone === "string" &&
    typeof member.description === "string" &&
    Array.isArray(member.expertise) &&
    member.expertise.every((exp: any) => typeof exp === "string")
  );
}

describe("TeamPage - Pure Utility Functions", () => {
  describe("Team Members Data", () => {
    it("sollte genau 4 Team Members haben", () => {
      expect(members).toHaveLength(4);
    });

    it("alle Team Members sollten valide Strukturen sein", () => {
      members.forEach((member) => {
        expect(validateTeamMember(member)).toBe(true);
      });
    });

    it("sollte Ramez, William, Arezo und Ghaleb enthalten", () => {
      const names = members.map((m) => m.name);
      expect(names).toContain("Ramez");
      expect(names).toContain("William");
      expect(names).toContain("Arezo");
      expect(names).toContain("Ghaleb");
    });

    it("jeder Team Member sollte mindestens 1 Expertise haben", () => {
      members.forEach((member) => {
        expect(member.expertise.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("jeder Team Member sollte einen Namen, Role und Description haben", () => {
      members.forEach((member) => {
        expect(member.name).toBeTruthy();
        expect(member.role).toBeTruthy();
        expect(member.description).toBeTruthy();
      });
    });
  });

  describe("getMemberByName", () => {
    it("gibt Ramez zurück wenn nach 'Ramez' gesucht wird", () => {
      const result = getMemberByName("Ramez");
      expect(result?.name).toBe("Ramez");
      expect(result?.role).toBe("Produktstrategie und UX");
    });

    it("gibt William zurück wenn nach 'William' gesucht wird", () => {
      const result = getMemberByName("William");
      expect(result?.name).toBe("William");
      expect(result?.role).toBe("Full-Stack Entwicklung");
    });

    it("gibt Arezo zurück wenn nach 'Arezo' gesucht wird", () => {
      const result = getMemberByName("Arezo");
      expect(result?.name).toBe("Arezo");
    });

    it("gibt Ghaleb zurück wenn nach 'Ghaleb' gesucht wird", () => {
      const result = getMemberByName("Ghaleb");
      expect(result?.name).toBe("Ghaleb");
    });

    it("gibt undefined zurück für unbekannte Namen", () => {
      expect(getMemberByName("Unknown")).toBeUndefined();
      expect(getMemberByName("")).toBeUndefined();
    });

    it("Suche ist case-sensitive", () => {
      expect(getMemberByName("ramez")).toBeUndefined();
      expect(getMemberByName("WILLIAM")).toBeUndefined();
    });
  });

  describe("getMembersByRole", () => {
    it("findet Members mit 'Entwicklung' in der Role", () => {
      const results = getMembersByRole("Entwicklung");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("William");
    });

    it("findet Members mit 'Design' in der Role", () => {
      const results = getMembersByRole("Design");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Arezo");
    });

    it("findet Members mit 'Strategie' in der Role", () => {
      const results = getMembersByRole("Strategie");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Ramez");
    });

    it("findet Members mit 'und' in der Role (mehrere)", () => {
      const results = getMembersByRole("und");
      expect(results.length).toBeGreaterThan(1);
    });

    it("gibt leeres Array zurück für unbekannte Keywords", () => {
      expect(getMembersByRole("Unknown")).toEqual([]);
      expect(getMembersByRole("xyz")).toEqual([]);
    });

    it("Suche ist case-insensitive", () => {
      const result1 = getMembersByRole("entwicklung");
      const result2 = getMembersByRole("ENTWICKLUNG");
      expect(result1).toEqual(result2);
      expect(result1).toHaveLength(1);
    });
  });

  describe("getMembersWithExpertise", () => {
    it("findet Members mit 'Backend' Expertise", () => {
      const results = getMembersWithExpertise("Backend");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("William");
    });

    it("findet Members mit 'Design System' Expertise", () => {
      const results = getMembersWithExpertise("Design System");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Arezo");
    });

    it("findet Members mit 'Strategie' Expertise", () => {
      const results = getMembersWithExpertise("Strategie");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Ramez");
    });

    it("findet Members mit 'Frontend' Expertise", () => {
      const results = getMembersWithExpertise("Frontend");
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("William");
    });

    it("gibt leeres Array zurück für unbekannte Expertise", () => {
      expect(getMembersWithExpertise("Unknown")).toEqual([]);
    });

    it("Suche ist case-insensitive", () => {
      const result1 = getMembersWithExpertise("backend");
      const result2 = getMembersWithExpertise("BACKEND");
      expect(result1).toEqual(result2);
      expect(result1).toHaveLength(1);
    });
  });

  describe("getAllExpertiseTags", () => {
    it("gibt alle einzigartigen Expertise Tags zurück", () => {
      const tags = getAllExpertiseTags();
      expect(tags.length).toBeGreaterThan(0);
    });

    it("Tags sind sortiert", () => {
      const tags = getAllExpertiseTags();
      const sorted = [...tags].sort();
      expect(tags).toEqual(sorted);
    });

    it("enthält Backend Tag", () => {
      const tags = getAllExpertiseTags();
      expect(tags).toContain("Backend");
    });

    it("enthält Frontend Tag", () => {
      const tags = getAllExpertiseTags();
      expect(tags).toContain("Frontend");
    });

    it("enthält Design System Tag", () => {
      const tags = getAllExpertiseTags();
      expect(tags).toContain("Design System");
    });

    it("keine doppelten Tags", () => {
      const tags = getAllExpertiseTags();
      const uniqueTags = new Set(tags);
      expect(tags.length).toBe(uniqueTags.size);
    });

    it("alle Tags sind Strings", () => {
      const tags = getAllExpertiseTags();
      tags.forEach((tag) => {
        expect(typeof tag).toBe("string");
        expect(tag.length).toBeGreaterThan(0);
      });
    });
  });

  describe("validateTeamMember", () => {
    it("validiert echte Team Member", () => {
      members.forEach((member) => {
        expect(validateTeamMember(member)).toBe(true);
      });
    });

    it("lehnt null ab", () => {
      expect(validateTeamMember(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(validateTeamMember(undefined)).toBe(false);
    });

    it("lehnt Objekt ohne name ab", () => {
      expect(
        validateTeamMember({
          role: "Test",
          tone: "test",
          description: "test",
          expertise: [],
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit ungültigem expertise ab", () => {
      expect(
        validateTeamMember({
          name: "Test",
          role: "Test",
          tone: "test",
          description: "test",
          expertise: "not an array",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit non-string Values ab", () => {
      expect(
        validateTeamMember({
          name: 123,
          role: "Test",
          tone: "test",
          description: "test",
          expertise: [],
        })
      ).toBe(false);
    });
  });

  describe("TeamPage Utilities Integration", () => {
    it("kann alle Members durch Namen abrufen", () => {
      const names = members.map((m) => m.name);
      const retrieved = names.map((name) => getMemberByName(name));
      expect(retrieved.every((member) => member !== undefined)).toBe(true);
    });

    it("alle Members haben unterschiedliche Rollen", () => {
      const roles = members.map((m) => m.role);
      const uniqueRoles = new Set(roles);
      expect(roles.length).toBe(uniqueRoles.size);
    });

    it("Expertise Tags Suche funktioniert für alle Tag Typen", () => {
      const allTags = getAllExpertiseTags();
      allTags.forEach((tag) => {
        const membersWithTag = getMembersWithExpertise(tag);
        expect(membersWithTag.length).toBeGreaterThan(0);
      });
    });

    it("kombinierte Suche funktioniert: Member hat Skill", () => {
      const william = getMemberByName("William");
      const backendExperts = getMembersWithExpertise("Backend");
      expect(backendExperts).toContain(william);
    });

    it("alle Members können durch unterschiedliche Rollen-Keywords gefunden werden", () => {
      const keywords = ["und", "Daten", "Full", "Kommunikation"];
      keywords.forEach((keyword) => {
        const results = getMembersByRole(keyword);
        expect(results.length).toBeGreaterThan(0);
      });
    });
  });
});
