import { describe, it, expect } from "vitest";
import { Mail, Phone, MapPin, Clock3 } from "lucide-react";

// Pure utility functions and data (extrahiert aus KontaktPage)
export type ContactItem = {
  title: string;
  value: string;
  icon: any;
};

export const contactItems: ContactItem[] = [
  {
    title: "E-Mail",
    value: "kunde.service@loyaltyflow.de",
    icon: Mail,
  },
  {
    title: "Telefon",
    value: "+49 123 456 789",
    icon: Phone,
  },
  {
    title: "Adresse",
    value: "Musterstraße 123, 12345 Musterstadt",
    icon: MapPin,
  },
  {
    title: "Antwortzeit",
    value: "Innerhalb von 24 Stunden",
    icon: Clock3,
  },
];

// Pure utility functions
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2;
}

export function isValidMessage(message: string): boolean {
  const trimmed = message.trim();
  return trimmed.length >= 10;
}

export function validateContactForm(data: {
  name?: string;
  email?: string;
  message?: string;
}): { valid: boolean; error?: string } {
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();

  if (!name || !email || !message) {
    return {
      valid: false,
      error: "Bitte fülle Name, E-Mail und Nachricht aus.",
    };
  }

  if (!isValidName(name)) {
    return {
      valid: false,
      error: "Der Name muss mindestens 2 Zeichen lang sein.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      valid: false,
      error: "Bitte gebe eine gültige E-Mail Adresse ein.",
    };
  }

  if (!isValidMessage(message)) {
    return {
      valid: false,
      error: "Die Nachricht muss mindestens 10 Zeichen lang sein.",
    };
  }

  return { valid: true };
}

export function getContactItemByTitle(title: string): ContactItem | undefined {
  return contactItems.find((item) => item.title === title);
}

export function getAllContactTitles(): string[] {
  return contactItems.map((item) => item.title);
}

export function validateContactItem(item: any): boolean {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item.title === "string" &&
    typeof item.value === "string" &&
    item.icon !== undefined
  );
}

describe("KontaktPage - Pure Utility Functions", () => {
  describe("Contact Items Data", () => {
    it("sollte genau 4 Kontakt Items haben", () => {
      expect(contactItems).toHaveLength(4);
    });

    it("sollte E-Mail, Telefon, Adresse und Antwortzeit enthalten", () => {
      const titles = getAllContactTitles();
      expect(titles).toContain("E-Mail");
      expect(titles).toContain("Telefon");
      expect(titles).toContain("Adresse");
      expect(titles).toContain("Antwortzeit");
    });

    it("alle Contact Items sollten valide Strukturen sein", () => {
      contactItems.forEach((item) => {
        expect(validateContactItem(item)).toBe(true);
      });
    });

    it("E-Mail Item sollte korrekte Adresse haben", () => {
      const email = getContactItemByTitle("E-Mail");
      expect(email?.value).toBe("kunde.service@loyaltyflow.de");
    });

    it("Telefon Item sollte korrekte Nummer haben", () => {
      const phone = getContactItemByTitle("Telefon");
      expect(phone?.value).toBe("+49 123 456 789");
    });

    it("Adresse Item sollte korrekte Adresse haben", () => {
      const address = getContactItemByTitle("Adresse");
      expect(address?.value).toBe("Musterstraße 123, 12345 Musterstadt");
    });

    it("Antwortzeit Item sollte korrekte Info haben", () => {
      const responseTime = getContactItemByTitle("Antwortzeit");
      expect(responseTime?.value).toBe("Innerhalb von 24 Stunden");
    });
  });

  describe("isValidEmail", () => {
    it("akzeptiert gültige E-Mail Adressen", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user@domain.de")).toBe(true);
      expect(isValidEmail("kunde.service@loyaltyflow.de")).toBe(true);
    });

    it("lehnt E-Mails ohne @ ab", () => {
      expect(isValidEmail("testexample.com")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
    });

    it("lehnt E-Mails ohne Punkt ab", () => {
      expect(isValidEmail("test@example")).toBe(false);
      expect(isValidEmail("user@com")).toBe(false);
    });

    it("lehnt leere Strings ab", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("   ")).toBe(false);
    });

    it("trimmt Whitespace", () => {
      expect(isValidEmail("  test@example.com  ")).toBe(true);
      expect(isValidEmail("\tuser@domain.de\n")).toBe(true);
    });

    it("lehnt E-Mails mit Leerzeichen ab", () => {
      expect(isValidEmail("test @example.com")).toBe(false);
      expect(isValidEmail("user@ domain.de")).toBe(false);
    });
  });

  describe("isValidName", () => {
    it("akzeptiert Namen mit mindestens 2 Zeichen", () => {
      expect(isValidName("Al")).toBe(true);
      expect(isValidName("Alice")).toBe(true);
      expect(isValidName("Max Mustermann")).toBe(true);
    });

    it("lehnt Namen mit weniger als 2 Zeichen ab", () => {
      expect(isValidName("A")).toBe(false);
      expect(isValidName("")).toBe(false);
    });

    it("trimmt Whitespace", () => {
      expect(isValidName("  Al  ")).toBe(true);
      expect(isValidName("\tAlice\n")).toBe(true);
    });

    it("lehnt nur Whitespace ab", () => {
      expect(isValidName("   ")).toBe(false);
      expect(isValidName("\t\n")).toBe(false);
    });

    it("akzeptiert Namen mit Sonderzeichen", () => {
      expect(isValidName("Ä-Ö")).toBe(true);
      expect(isValidName("José")).toBe(true);
    });
  });

  describe("isValidMessage", () => {
    it("akzeptiert Nachrichten mit mindestens 10 Zeichen", () => {
      expect(isValidMessage("1234567890")).toBe(true);
      expect(isValidMessage("Das ist eine Test Nachricht")).toBe(true);
    });

    it("lehnt Nachrichten mit weniger als 10 Zeichen ab", () => {
      expect(isValidMessage("123456789")).toBe(false);
      expect(isValidMessage("short")).toBe(false);
      expect(isValidMessage("")).toBe(false);
    });

    it("trimmt Whitespace", () => {
      expect(isValidMessage("  1234567890  ")).toBe(true);
      expect(isValidMessage("\tDas ist lange\n")).toBe(true);
    });

    it("lehnt nur Whitespace ab", () => {
      expect(isValidMessage("   ")).toBe(false);
      expect(isValidMessage("\t\n")).toBe(false);
    });

    it("zählt Whitespace in der Länge", () => {
      const msg = "1234 6789"; // 9 chars after trim
      expect(isValidMessage(msg)).toBe(false);
      
      const msg2 = "1234 67890"; // 10 chars after trim
      expect(isValidMessage(msg2)).toBe(true);
    });
  });

  describe("validateContactForm", () => {
    it("akzeptiert vollständige und valide Formulare", () => {
      const result = validateContactForm({
        name: "Max Mustermann",
        email: "max@example.com",
        message: "Das ist eine Test Nachricht mit genügend Zeichen",
      });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("lehnt Formulare mit fehlender Name ab", () => {
      const result = validateContactForm({
        email: "test@example.com",
        message: "Das ist eine Test Nachricht",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Name");
    });

    it("lehnt Formulare mit fehlender E-Mail ab", () => {
      const result = validateContactForm({
        name: "Test User",
        message: "Das ist eine Test Nachricht",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Name, E-Mail und Nachricht");
    });

    it("lehnt Formulare mit fehlender Nachricht ab", () => {
      const result = validateContactForm({
        name: "Test User",
        email: "test@example.com",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Name, E-Mail und Nachricht");
    });

    it("lehnt Formulare mit ungültigem Namen ab", () => {
      const result = validateContactForm({
        name: "A",
        email: "test@example.com",
        message: "Das ist eine Test Nachricht",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("mindestens 2 Zeichen");
    });

    it("lehnt Formulare mit ungültiger E-Mail ab", () => {
      const result = validateContactForm({
        name: "Test User",
        email: "invalid-email",
        message: "Das ist eine Test Nachricht",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("E-Mail");
    });

    it("lehnt Formulare mit zu kurzer Nachricht ab", () => {
      const result = validateContactForm({
        name: "Test User",
        email: "test@example.com",
        message: "Short",
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("mindestens 10 Zeichen");
    });

    it("trimmt Whitespace in allen Feldern", () => {
      const result = validateContactForm({
        name: "  Max Mustermann  ",
        email: "  max@example.com  ",
        message: "  Das ist eine Test Nachricht mit genügend Zeichen  ",
      });
      expect(result.valid).toBe(true);
    });

    it("lehnt leere Strings ab", () => {
      const result = validateContactForm({
        name: "",
        email: "",
        message: "",
      });
      expect(result.valid).toBe(false);
    });

    it("lehnt nur Whitespace ab", () => {
      const result = validateContactForm({
        name: "   ",
        email: "\t\t",
        message: "\n\n",
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("getContactItemByTitle", () => {
    it("findet E-Mail Kontakt Item", () => {
      const item = getContactItemByTitle("E-Mail");
      expect(item?.value).toBe("kunde.service@loyaltyflow.de");
    });

    it("findet Telefon Kontakt Item", () => {
      const item = getContactItemByTitle("Telefon");
      expect(item?.value).toBe("+49 123 456 789");
    });

    it("findet Adresse Kontakt Item", () => {
      const item = getContactItemByTitle("Adresse");
      expect(item?.title).toBe("Adresse");
    });

    it("findet Antwortzeit Kontakt Item", () => {
      const item = getContactItemByTitle("Antwortzeit");
      expect(item?.value).toBe("Innerhalb von 24 Stunden");
    });

    it("gibt undefined für unbekannte Titel zurück", () => {
      expect(getContactItemByTitle("Unknown")).toBeUndefined();
      expect(getContactItemByTitle("")).toBeUndefined();
    });

    it("Suche ist case-sensitive", () => {
      expect(getContactItemByTitle("e-mail")).toBeUndefined();
      expect(getContactItemByTitle("TELEFON")).toBeUndefined();
    });
  });

  describe("getAllContactTitles", () => {
    it("gibt alle Kontakt Titel zurück", () => {
      const titles = getAllContactTitles();
      expect(titles).toHaveLength(4);
    });

    it("Reihenfolge ist gleich wie Original Array", () => {
      const titles = getAllContactTitles();
      expect(titles[0]).toBe("E-Mail");
      expect(titles[1]).toBe("Telefon");
      expect(titles[2]).toBe("Adresse");
      expect(titles[3]).toBe("Antwortzeit");
    });

    it("enthält alle erwarteten Titel", () => {
      const titles = getAllContactTitles();
      expect(titles).toContain("E-Mail");
      expect(titles).toContain("Telefon");
      expect(titles).toContain("Adresse");
      expect(titles).toContain("Antwortzeit");
    });
  });

  describe("validateContactItem", () => {
    it("validiert echte Contact Items", () => {
      contactItems.forEach((item) => {
        expect(validateContactItem(item)).toBe(true);
      });
    });

    it("lehnt null ab", () => {
      expect(validateContactItem(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(validateContactItem(undefined)).toBe(false);
    });

    it("lehnt Objekt ohne title ab", () => {
      expect(
        validateContactItem({
          value: "test",
          icon: "icon",
        })
      ).toBe(false);
    });

    it("lehnt Objekt ohne value ab", () => {
      expect(
        validateContactItem({
          title: "test",
          icon: "icon",
        })
      ).toBe(false);
    });

    it("lehnt Objekt ohne icon ab", () => {
      expect(
        validateContactItem({
          title: "test",
          value: "test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit non-string title ab", () => {
      expect(
        validateContactItem({
          title: 123,
          value: "test",
          icon: "icon",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit non-string value ab", () => {
      expect(
        validateContactItem({
          title: "test",
          value: 123,
          icon: "icon",
        })
      ).toBe(false);
    });
  });

  describe("KontaktPage Utilities Integration", () => {
    it("kompletter Kontakt Flow: Form Validierung + Kontakt Daten", () => {
      const formData = {
        name: "Max Mustermann",
        email: "max@example.com",
        message: "Ich würde gerne mehr über LoyaltyFlow erfahren",
      };

      const validation = validateContactForm(formData);
      expect(validation.valid).toBe(true);

      const emailItem = getContactItemByTitle("E-Mail");
      expect(emailItem).toBeDefined();
      expect(emailItem?.value).toContain("@");
    });

    it("alle Kontakt Daten sind abrufbar durch Titel", () => {
      const titles = getAllContactTitles();
      titles.forEach((title) => {
        const item = getContactItemByTitle(title);
        expect(item).toBeDefined();
        expect(item?.value).toBeTruthy();
      });
    });

    it("Validierungsfunktionen arbeiten zusammen", () => {
      const testCases = [
        { valid: true, name: "Al", email: "a@b.co", message: "1234567890" },
        { valid: false, name: "A", email: "a@b.co", message: "1234567890" },
        { valid: false, name: "Al", email: "invalid", message: "1234567890" },
        { valid: false, name: "Al", email: "a@b.co", message: "short" },
      ];

      testCases.forEach((testCase) => {
        const result = validateContactForm({
          name: testCase.name,
          email: testCase.email,
          message: testCase.message,
        });
        expect(result.valid).toBe(testCase.valid);
      });
    });

    it("Contact Items können kombiniert werden mit validen Daten", () => {
      const form = {
        name: "Ramez König",
        email: "ramez@loyaltyflow.de",
        message: "Ich bin interessiert an einer Partnerschaft mit LoyaltyFlow",
      };

      const validation = validateContactForm(form);
      expect(validation.valid).toBe(true);

      const allTitles = getAllContactTitles();
      expect(allTitles.length).toBeGreaterThan(0);
    });
  });
});
