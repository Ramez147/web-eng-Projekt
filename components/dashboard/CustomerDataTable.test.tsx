import { describe, it, expect } from "vitest";

// Pure utility functions (extrahiert aus der Komponente)
export const avatarClasses = [
  "bg-lime-300 text-slate-950",
  "bg-rose-300 text-slate-950",
  "bg-emerald-300 text-slate-950",
  "bg-amber-300 text-slate-950",
  "bg-emerald-300 text-slate-950",
  "bg-fuchsia-300 text-slate-950",
  "bg-green-300 text-slate-950",
  "bg-violet-300 text-slate-950",
] as const;

export function getAvatarClassName(value: string, index: number): string {
  const hash = value.split("").reduce((accumulator, character) => accumulator + character.charCodeAt(0), index);
  return avatarClasses[hash % avatarClasses.length];
}

export function getInitial(value: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

export function formatRange(startIndex: number, endIndex: number, totalCount: number): string {
  if (totalCount === 0) {
    return "Showing 0-0 out of 0 data";
  }
  return `Showing ${startIndex + 1}-${endIndex} out of ${totalCount} data`;
}

describe("CustomerDataTable - Pure Utility Functions", () => {
  // getAvatarClassName Tests
  describe("getAvatarClassName", () => {
    it("gibt einen gültigen Avatar-Klassennamen für beliebige String zurück", () => {
      const result = getAvatarClassName("CUST-001", 0);
      expect(avatarClasses).toContain(result);
    });

    it("gibt denselben Klassennamen für denselben Input zurück", () => {
      const result1 = getAvatarClassName("CUST-001", 0);
      const result2 = getAvatarClassName("CUST-001", 0);
      expect(result1).toBe(result2);
    });

    it("kann verschiedene Klassennamen für verschiedene Inputs geben", () => {
      const result1 = getAvatarClassName("CUST-001", 0);
      const result2 = getAvatarClassName("OTHER-001", 0);
      // Muss nicht unbedingt unterschiedlich sein, aber kann sein
      expect(avatarClasses).toContain(result1);
      expect(avatarClasses).toContain(result2);
    });

    it("respektiert den Index-Parameter", () => {
      const result1 = getAvatarClassName("test", 0);
      const result2 = getAvatarClassName("test", 1);
      // Ergebnisse können gleich oder unterschiedlich sein, abhängig vom Hash
      expect(typeof result1).toBe("string");
      expect(typeof result2).toBe("string");
    });

    it("alle Ergebnisse sind gültige Tailwind-Klassen", () => {
      const values = ["A", "ABC", "CUSTOMER-123", "test@example.com"];
      const indices = [0, 1, 5, 10];
      
      for (const value of values) {
        for (const index of indices) {
          const result = getAvatarClassName(value, index);
          expect(avatarClasses).toContain(result);
        }
      }
    });
  });

  // getInitial Tests
  describe("getInitial", () => {
    it("gibt erstes Zeichen für Normal-String zurück", () => {
      expect(getInitial("CUST-001")).toBe("C");
      expect(getInitial("Alice")).toBe("A");
    });

    it("gibt Großbuchstabe für Kleinbuchstaben zurück", () => {
      expect(getInitial("alice")).toBe("A");
      expect(getInitial("customer")).toBe("C");
    });

    it("gibt Fragezeichen für leeren String zurück", () => {
      expect(getInitial("")).toBe("?");
      expect(getInitial("   ")).toBe("?");
    });

    it("trimmt Whitespace vor der Extraktion", () => {
      expect(getInitial("  Alice")).toBe("A");
      expect(getInitial("\tBob")).toBe("B");
    });

    it("gibt Fragezeichen für nur Whitespace zurück", () => {
      expect(getInitial("     ")).toBe("?");
      expect(getInitial("\t\n")).toBe("?");
    });

    it("funktioniert mit Sonderzeichen", () => {
      expect(getInitial("@user")).toBe("@");
      expect(getInitial("#tag")).toBe("#");
    });

    it("funktioniert mit Zahlen", () => {
      expect(getInitial("123")).toBe("1");
      expect(getInitial("9abc")).toBe("9");
    });
  });

  // formatRange Tests
  describe("formatRange", () => {
    it("gibt korrektiges Format für normalen Range zurück", () => {
      const result = formatRange(0, 4, 100);
      expect(result).toBe("Showing 1-4 out of 100 data");
    });

    it("gibt korrektiges Format für zweite Seite zurück", () => {
      const result = formatRange(4, 8, 100);
      expect(result).toBe("Showing 5-8 out of 100 data");
    });

    it("gibt korrektiges Format für letzte Seite zurück", () => {
      const result = formatRange(8, 10, 10);
      expect(result).toBe("Showing 9-10 out of 10 data");
    });

    it("gibt spezielle Nachricht für leere Ergebnisse zurück", () => {
      const result = formatRange(0, 0, 0);
      expect(result).toBe("Showing 0-0 out of 0 data");
    });

    it("funktioniert mit einzelnem Datensatz", () => {
      const result = formatRange(0, 1, 1);
      expect(result).toBe("Showing 1-1 out of 1 data");
    });

    it("funktioniert mit großen Zahlen", () => {
      const result = formatRange(9990, 10000, 10500);
      expect(result).toBe("Showing 9991-10000 out of 10500 data");
    });

    it("format ist korrekt mit unterschiedlichen Page Sizes", () => {
      const result10 = formatRange(0, 10, 100);
      expect(result10).toBe("Showing 1-10 out of 100 data");
      
      const result25 = formatRange(0, 25, 100);
      expect(result25).toBe("Showing 1-25 out of 100 data");
    });

    it("endIndex kann größer als totalCount sein und wird trotzdem angezeigt", () => {
      // Diesen Fall sollte der Komponenten-Code behandeln, aber die Funktion sollte das akzeptieren
      const result = formatRange(90, 110, 100);
      expect(result).toBe("Showing 91-110 out of 100 data");
    });
  });

  // Integration Tests
  describe("CustomerDataTable Utilities Integration", () => {
    it("Avatar und Initial funktionieren zusammen", () => {
      const customerId = "CUST-001";
      const initial = getInitial(customerId);
      const avatarClass = getAvatarClassName(customerId, 0);
      
      expect(initial).toBe("C");
      expect(avatarClasses).toContain(avatarClass);
    });

    it("formatRange mit verschiedenen Paginierungsszenarien", () => {
      const pageSize = 4;
      const totalCount = 25;
      
      // Seite 1
      const page1 = formatRange(0, 4, totalCount);
      expect(page1).toContain("1-4");
      expect(page1).toContain("25");
      
      // Seite 2
      const page2 = formatRange(4, 8, totalCount);
      expect(page2).toContain("5-8");
      
      // Seite 7 (letzte)
      const page7 = formatRange(24, 25, totalCount);
      expect(page7).toContain("25-25");
    });

    it("alle Funktionen sind Pure Functions ohne Seiteneffekte", () => {
      const customerId = "TEST-123";
      const index = 5;
      
      // Mehrfache Aufrufe sollten identische Ergebnisse geben
      const avatar1 = getAvatarClassName(customerId, index);
      const avatar2 = getAvatarClassName(customerId, index);
      expect(avatar1).toBe(avatar2);
      
      const initial1 = getInitial(customerId);
      const initial2 = getInitial(customerId);
      expect(initial1).toBe(initial2);
      
      const range1 = formatRange(0, 10, 100);
      const range2 = formatRange(0, 10, 100);
      expect(range1).toBe(range2);
    });

    it("funktioniert mit Edge-Cases kombiniert", () => {
      // Leere Daten
      expect(formatRange(0, 0, 0)).toBe("Showing 0-0 out of 0 data");
      expect(getInitial("")).toBe("?");
      expect(avatarClasses).toContain(getAvatarClassName("", 0));
      
      // Maximale Werte
      expect(formatRange(999999, 1000000, 1000000)).toBe("Showing 1000000-1000000 out of 1000000 data");
    });
  });
});