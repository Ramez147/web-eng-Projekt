// validators.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  parsePositiveNumber,
  parseNonEmptyString,
  parsePositiveInteger,
  parseNumberInRange,
  parseStringWithPattern,
  parseStringMinLength,
  parseStringMaxLength,
  parseEmail,
  parseUUID,
  parseEnum,
} from "./validators";

describe("Validators Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // parsePositiveNumber Tests
  describe("parsePositiveNumber", () => {
    it("akzeptiert positive Zahlen", () => {
      expect(parsePositiveNumber(100, "Preis")).toBe(100);
      expect(parsePositiveNumber(0.1, "Gebühr")).toBe(0.1);
      expect(parsePositiveNumber(999999, "Betrag")).toBe(999999);
    });

    it("wirft Fehler für negative Zahlen", () => {
      expect(() => parsePositiveNumber(-10, "Preis")).toThrow("Preis must be a positive number");
      expect(() => parsePositiveNumber(-0.1, "Gebühr")).toThrow();
    });

    it("wirft Fehler für Null", () => {
      expect(() => parsePositiveNumber(0, "Betrag")).toThrow("Betrag must be a positive number");
    });

    it("wirft Fehler für NaN", () => {
      expect(() => parsePositiveNumber(NaN, "Wert")).toThrow();
    });

    it("akzeptiert Infinity (da größer als 0)", () => {
      expect(parsePositiveNumber(Infinity, "Wert")).toBe(Infinity);
    });

    it("wirft Fehler für String", () => {
      expect(() => parsePositiveNumber("100", "Preis")).toThrow();
    });

    it("wirft Fehler für undefined", () => {
      expect(() => parsePositiveNumber(undefined, "Preis")).toThrow();
    });

    it("wirft Fehler für null", () => {
      expect(() => parsePositiveNumber(null, "Preis")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parsePositiveNumber(-5, "MY_FIELD")).toThrow("MY_FIELD must be a positive number");
    });

    it("akzeptiert sehr große Zahlen", () => {
      expect(parsePositiveNumber(999999999999, "Wert")).toBe(999999999999);
    });

    it("akzeptiert kleine dezimale Zahlen", () => {
      expect(parsePositiveNumber(0.0001, "Wert")).toBe(0.0001);
    });
  });

  // parseNonEmptyString Tests
  describe("parseNonEmptyString", () => {
    it("akzeptiert nicht-leere Strings", () => {
      expect(parseNonEmptyString("Hallo", "Name")).toBe("Hallo");
      expect(parseNonEmptyString("Test", "Wert")).toBe("Test");
    });

    it("trimmt Whitespace", () => {
      expect(parseNonEmptyString("  Hallo  ", "Name")).toBe("Hallo");
      expect(parseNonEmptyString("\t\nTest\n\t", "Wert")).toBe("Test");
    });

    it("wirft Fehler für leeren String", () => {
      expect(() => parseNonEmptyString("", "Name")).toThrow("Name must be a non-empty string");
    });

    it("wirft Fehler für nur Whitespace", () => {
      expect(() => parseNonEmptyString("   ", "Name")).toThrow();
      expect(() => parseNonEmptyString("\t\n", "Wert")).toThrow();
    });

    it("wirft Fehler für nicht-String", () => {
      expect(() => parseNonEmptyString(123, "Name")).toThrow();
      expect(() => parseNonEmptyString(null, "Name")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parseNonEmptyString("", "MY_FIELD")).toThrow("MY_FIELD must be a non-empty string");
    });

    it("erhält Inhalt bei Whitespace", () => {
      expect(parseNonEmptyString("  a  ", "Feld")).toBe("a");
    });

    it("akzeptiert lange Strings", () => {
      const longString = "x".repeat(10000);
      expect(parseNonEmptyString(longString, "Text")).toBe(longString);
    });

    it("akzeptiert Sonderzeichen", () => {
      expect(parseNonEmptyString("!@#$%^&*()", "Feld")).toBe("!@#$%^&*()");
    });

    it("akzeptiert Unicode", () => {
      expect(parseNonEmptyString("こんにちは", "Feld")).toBe("こんにちは");
    });
  });

  // parsePositiveInteger Tests
  describe("parsePositiveInteger", () => {
    it("akzeptiert positive Integer", () => {
      expect(parsePositiveInteger(1, "Anzahl")).toBe(1);
      expect(parsePositiveInteger(100, "Menge")).toBe(100);
      expect(parsePositiveInteger(999999, "ID")).toBe(999999);
    });

    it("wirft Fehler für Dezimalzahlen", () => {
      expect(() => parsePositiveInteger(1.5, "Anzahl")).toThrow();
      expect(() => parsePositiveInteger(0.1, "Menge")).toThrow();
    });

    it("wirft Fehler für Null", () => {
      expect(() => parsePositiveInteger(0, "Anzahl")).toThrow();
    });

    it("wirft Fehler für negative Zahlen", () => {
      expect(() => parsePositiveInteger(-1, "Anzahl")).toThrow();
    });

    it("wirft Fehler für nicht-Zahl", () => {
      expect(() => parsePositiveInteger("100", "Anzahl")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parsePositiveInteger(1.5, "FIELD")).toThrow("FIELD must be a positive integer");
    });
  });

  // parseNumberInRange Tests
  describe("parseNumberInRange", () => {
    it("akzeptiert Zahlen im Bereich", () => {
      expect(parseNumberInRange(50, 0, 100, "Score")).toBe(50);
      expect(parseNumberInRange(0, 0, 100, "Score")).toBe(0);
      expect(parseNumberInRange(100, 0, 100, "Score")).toBe(100);
    });

    it("wirft Fehler für zu kleine Zahlen", () => {
      expect(() => parseNumberInRange(-1, 0, 100, "Score")).toThrow("Score must be between 0 and 100");
    });

    it("wirft Fehler für zu große Zahlen", () => {
      expect(() => parseNumberInRange(101, 0, 100, "Score")).toThrow("Score must be between 0 and 100");
    });

    it("akzeptiert Dezimalzahlen", () => {
      expect(parseNumberInRange(50.5, 0, 100, "Value")).toBe(50.5);
    });

    it("wirft Fehler für NaN", () => {
      expect(() => parseNumberInRange(NaN, 0, 100, "Value")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      const error = () => parseNumberInRange(150, 0, 100, "FIELD");
      expect(error).toThrow("FIELD must be between 0 and 100");
    });
  });

  // parseStringWithPattern Tests
  describe("parseStringWithPattern", () => {
    it("akzeptiert Strings die Pattern passen", () => {
      const pattern = /^[A-Z]+$/;
      expect(parseStringWithPattern("ABC", pattern, "Code")).toBe("ABC");
    });

    it("wirft Fehler wenn Pattern nicht passt", () => {
      const pattern = /^[A-Z]+$/;
      expect(() => parseStringWithPattern("abc123", pattern, "Code")).toThrow("Code format is invalid");
    });

    it("trimmt Whitespace", () => {
      const pattern = /^\d+$/;
      expect(parseStringWithPattern("  123  ", pattern, "Nummer")).toBe("123");
    });

    it("wirft Fehler für nicht-String", () => {
      const pattern = /test/;
      expect(() => parseStringWithPattern(123, pattern, "Feld")).toThrow();
    });

    it("akzeptiert komplexe Patterns", () => {
      const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
      expect(parseStringWithPattern("test@example.com", emailPattern, "Email")).toBe("test@example.com");
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      const pattern = /^test$/;
      expect(() => parseStringWithPattern("wrong", pattern, "FIELD")).toThrow("FIELD format is invalid");
    });
  });

  // parseStringMinLength Tests
  describe("parseStringMinLength", () => {
    it("akzeptiert Strings mit ausreichender Länge", () => {
      expect(parseStringMinLength("Hello", 3, "Name")).toBe("Hello");
      expect(parseStringMinLength("Hi", 2, "Code")).toBe("Hi");
    });

    it("wirft Fehler für zu kurze Strings", () => {
      expect(() => parseStringMinLength("Hi", 3, "Name")).toThrow("Name must be at least 3 characters");
    });

    it("trimmt vor Längsprüfung", () => {
      expect(parseStringMinLength("  Hello  ", 3, "Name")).toBe("Hello");
    });

    it("wirft Fehler für leeren String", () => {
      expect(() => parseStringMinLength("", 1, "Name")).toThrow();
    });

    it("akzeptiert genaue Mindestlänge", () => {
      expect(parseStringMinLength("abc", 3, "Code")).toBe("abc");
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parseStringMinLength("Hi", 5, "FIELD")).toThrow("FIELD must be at least 5 characters");
    });
  });

  // parseStringMaxLength Tests
  describe("parseStringMaxLength", () => {
    it("akzeptiert Strings innerhalb Maximallänge", () => {
      expect(parseStringMaxLength("Hello", 10, "Name")).toBe("Hello");
      expect(parseStringMaxLength("Hi", 2, "Code")).toBe("Hi");
    });

    it("wirft Fehler für zu lange Strings", () => {
      expect(() => parseStringMaxLength("Hello", 3, "Name")).toThrow("Name must not exceed 3 characters");
    });

    it("trimmt vor Längsprüfung", () => {
      expect(parseStringMaxLength("  Hi  ", 2, "Code")).toBe("Hi");
    });

    it("wirft Fehler für leeren String", () => {
      expect(() => parseStringMaxLength("", 10, "Name")).toThrow();
    });

    it("akzeptiert genaue Maximallänge", () => {
      expect(parseStringMaxLength("abc", 3, "Code")).toBe("abc");
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parseStringMaxLength("Hello World", 5, "FIELD")).toThrow(
        "FIELD must not exceed 5 characters"
      );
    });
  });

  // parseEmail Tests
  describe("parseEmail", () => {
    it("akzeptiert gültige Emails", () => {
      expect(parseEmail("test@example.com", "Email")).toBe("test@example.com");
      expect(parseEmail("user.name@domain.co.uk", "Email")).toBe("user.name@domain.co.uk");
    });

    it("konvertiert zu Lowercase", () => {
      expect(parseEmail("TEST@EXAMPLE.COM", "Email")).toBe("test@example.com");
      expect(parseEmail("User@Example.Com", "Email")).toBe("user@example.com");
    });

    it("trimmt Whitespace", () => {
      expect(parseEmail("  test@example.com  ", "Email")).toBe("test@example.com");
    });

    it("wirft Fehler für ungültige Emails", () => {
      expect(() => parseEmail("notanemail", "Email")).toThrow();
      expect(() => parseEmail("@example.com", "Email")).toThrow();
      expect(() => parseEmail("test@.com", "Email")).toThrow();
    });

    it("wirft Fehler für leerem String", () => {
      expect(() => parseEmail("", "Email")).toThrow();
    });

    it("wirft Fehler für nicht-String", () => {
      expect(() => parseEmail(123, "Email")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parseEmail("invalid", "FIELD")).toThrow("FIELD format is invalid");
    });

    it("akzeptiert verschiedene Email-Formate", () => {
      const validEmails = [
        "simple@example.com",
        "user+tag@example.co.uk",
        "name.surname@sub.example.com",
      ];
      validEmails.forEach((email) => {
        expect(() => parseEmail(email, "Email")).not.toThrow();
      });
    });
  });

  // parseUUID Tests
  describe("parseUUID", () => {
    it("akzeptiert gültige UUIDs", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(parseUUID(uuid, "ID")).toBe(uuid);
    });

    it("akzeptiert Uppercase UUIDs", () => {
      const uuid = "550E8400-E29B-41D4-A716-446655440000";
      expect(parseUUID(uuid, "ID")).toBe(uuid);
    });

    it("akzeptiert Mixed-Case UUIDs", () => {
      const uuid = "550e8400-E29B-41d4-A716-446655440000";
      expect(parseUUID(uuid, "ID")).toBe(uuid);
    });

    it("wirft Fehler für ungültige UUIDs", () => {
      expect(() => parseUUID("not-a-uuid", "ID")).toThrow();
      expect(() => parseUUID("550e8400e29b41d4a716446655440000", "ID")).toThrow();
    });

    it("wirft Fehler für leerem String", () => {
      expect(() => parseUUID("", "ID")).toThrow();
    });

    it("wirft Fehler für nicht-String", () => {
      expect(() => parseUUID(123, "ID")).toThrow();
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      expect(() => parseUUID("invalid", "FIELD")).toThrow("FIELD format is invalid");
    });
  });

  // parseEnum Tests
  describe("parseEnum", () => {
    it("akzeptiert gültige Enum-Werte", () => {
      const allowed = ["admin", "user", "guest"];
      expect(parseEnum("admin", allowed, "Role")).toBe("admin");
      expect(parseEnum("user", allowed, "Role")).toBe("user");
    });

    it("wirft Fehler für ungültige Enum-Werte", () => {
      const allowed = ["admin", "user"];
      expect(() => parseEnum("superadmin", allowed, "Role")).toThrow();
    });

    it("akzeptiert numerische Enums", () => {
      const allowed = [1, 2, 3];
      expect(parseEnum(2, allowed, "Level")).toBe(2);
    });

    it("wirft Fehler wenn Wert nicht im Enum", () => {
      const allowed = [1, 2, 3];
      expect(() => parseEnum(4, allowed, "Level")).toThrow("Level must be one of: 1, 2, 3");
    });

    it("hat aussagekräftige Fehlermeldung", () => {
      const allowed = ["a", "b", "c"];
      expect(() => parseEnum("d", allowed, "FIELD")).toThrow("FIELD must be one of: a, b, c");
    });

    it("akzeptiert verschiedene Datentypen in Enum", () => {
      const allowed = ["text", 123, true];
      expect(parseEnum("text", allowed, "Mixed")).toBe("text");
      expect(parseEnum(123, allowed, "Mixed")).toBe(123);
      expect(parseEnum(true, allowed, "Mixed")).toBe(true);
    });

    it("ist case-sensitive", () => {
      const allowed = ["Admin", "User"];
      expect(() => parseEnum("admin", allowed, "Role")).toThrow();
    });
  });

  // Integration Tests
  describe("Validators Integration", () => {
    it("kombiniert Positiv-Zahl mit Range-Check", () => {
      const positive = parsePositiveNumber(50, "Score");
      expect(parseNumberInRange(positive, 0, 100, "Range")).toBe(50);
    });

    it("kombiniert String-Validierungen", () => {
      const email = parseNonEmptyString("  test@example.com  ", "Email");
      expect(parseStringWithPattern(email, /^[\w.-]+@[\w.-]+\.\w+$/, "Email")).toBeDefined();
    });

    it("validiert komplettes User-Objekt", () => {
      const userData = {
        name: parseNonEmptyString("  John Doe  ", "Name"),
        age: parseNumberInRange(30, 0, 150, "Age"),
        role: parseEnum("admin", ["admin", "user"], "Role"),
      };

      expect(userData.name).toBe("John Doe");
      expect(userData.age).toBe(30);
      expect(userData.role).toBe("admin");
    });

    it("wirft Fehler bei ungültigen Daten", () => {
      const invalidData = {
        amount: () => parsePositiveNumber(-100, "Amount"),
        email: () => parseEmail("invalid", "Email"),
        name: () => parseNonEmptyString("", "Name"),
      };

      expect(invalidData.amount).toThrow();
      expect(invalidData.email).toThrow();
      expect(invalidData.name).toThrow();
    });

    it("alle Validatoren sind Pure Functions", () => {
      expect(parsePositiveNumber(100, "X")).toBe(parsePositiveNumber(100, "X"));
      expect(parseNonEmptyString("test", "X")).toBe(parseNonEmptyString("test", "X"));
      expect(parseEmail("a@b.c", "X")).toBe(parseEmail("a@b.c", "X"));
    });

    it("verarbeitet große Mengen von Validierungen", () => {
      const results = [];
      for (let i = 1; i <= 100; i++) {
        results.push(parsePositiveInteger(i, "Item"));
      }
      expect(results.length).toBe(100);
      expect(results[0]).toBe(1);
      expect(results[99]).toBe(100);
    });

    it("kombiniert mehrere Validatoren für ein Feld", () => {
      const password = "MyPassword123";
      expect(parseNonEmptyString(password, "Password")).toBe(password);
      expect(parseStringMinLength(password, 8, "Password")).toBe(password);
      expect(parseStringMaxLength(password, 50, "Password")).toBe(password);
    });

    it("gibt sprechende Fehlermeldungen für alle Fälle", () => {
      const testCases = [
        {
          fn: () => parsePositiveNumber(-1, "FIELD1"),
          expectedMsg: "FIELD1 must be a positive number",
        },
        {
          fn: () => parseNonEmptyString("", "FIELD2"),
          expectedMsg: "FIELD2 must be a non-empty string",
        },
        {
          fn: () => parseNumberInRange(150, 0, 100, "FIELD3"),
          expectedMsg: "FIELD3 must be between 0 and 100",
        },
      ];

      testCases.forEach(({ fn, expectedMsg }) => {
        expect(fn).toThrow(expectedMsg);
      });
    });

    it("kombiniert String-Längen-Validierung mit Pattern", () => {
      const code = parseNonEmptyString("  ABC123  ", "Code");
      expect(parseStringWithPattern(code, /^[A-Z0-9]+$/, "Code")).toBe("ABC123");
      expect(parseStringMinLength(code, 3, "Code")).toBe("ABC123");
      expect(parseStringMaxLength(code, 10, "Code")).toBe("ABC123");
    });

    it("Email-Validierung ist idempotent", () => {
      const email1 = parseEmail("TEST@EXAMPLE.COM", "Email");
      const email2 = parseEmail(email1, "Email");
      expect(email1).toBe(email2);
    });

    it("validiert typische Echtdaten-Szenarien", () => {
      // User registration validation
      const email = parseEmail("john@example.com", "Email");
      const name = parseStringMinLength("John Doe", 2, "Name");
      const age = parseNumberInRange(25, 0, 150, "Age");
      const status = parseEnum("active", ["active", "inactive"], "Status");

      expect(email).toBe("john@example.com");
      expect(name).toBe("John Doe");
      expect(age).toBe(25);
      expect(status).toBe("active");
    });
  });
});