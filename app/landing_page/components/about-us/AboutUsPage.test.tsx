import { describe, it, expect } from "vitest";
import { Sparkles } from "lucide-react";

// Pure utility functions and data (extrahiert aus AboutUsPage)
export type ValueCard = {
  title: string;
  description: string;
};

export const valueCards: ValueCard[] = [
  {
    title: "Klare Produktlogik",
    description:
      "Von Membership bis Analytics bleibt alles tenant-fähig, nachvollziehbar und schnell integrierbar.",
  },
  {
    title: "Technisch sauber",
    description:
      "Wir setzen auf einfache Abläufe, gute Lesbarkeit und eine UI, die nicht im Weg steht.",
  },
];

export const aboutPageContent = {
  badgeText: "About Us",
  sectionLabel: "Über uns",
  headline: "Warum wir Loyalty neu denken",
  description:
    "Wir bauen eine API-first Plattform, damit Teams Punkte- und Rewards-Logik nicht jedes Mal neu entwickeln muessen.",
};

// Pure utility functions for badge scaling
export function calculateBadgeScale(
  scrollY: number,
  maxShrinkDistance: number = 220,
  minScale: number = 0.8,
  maxScale: number = 1
): number {
  const progress = Math.min(scrollY / maxShrinkDistance, 1);
  const scale = maxScale - progress * (maxScale - minScale);
  return Math.max(minScale, Math.min(maxScale, scale));
}

export function getTransformStyle(scale: number): string {
  return `scale(${scale})`;
}

export function getTransformOrigin(): string {
  return "left center";
}

export function validateValueCard(card: any): boolean {
  return (
    typeof card === "object" &&
    card !== null &&
    typeof card.title === "string" &&
    typeof card.description === "string"
  );
}

export function getValueCardByTitle(title: string): ValueCard | undefined {
  return valueCards.find((card) => card.title === title);
}

export function getAllValueCardTitles(): string[] {
  return valueCards.map((card) => card.title);
}

export function getValueCardByIndex(index: number): ValueCard | undefined {
  return valueCards[index];
}

export function isValidScrollPosition(scrollY: number): boolean {
  return typeof scrollY === "number" && scrollY >= 0;
}

describe("AboutUsPage - Pure Utility Functions", () => {
  describe("Value Cards Data", () => {
    it("sollte genau 2 Value Cards haben", () => {
      expect(valueCards).toHaveLength(2);
    });

    it("sollte 'Klare Produktlogik' und 'Technisch sauber' enthalten", () => {
      const titles = getAllValueCardTitles();
      expect(titles).toContain("Klare Produktlogik");
      expect(titles).toContain("Technisch sauber");
    });

    it("alle Value Cards sollten valide Strukturen sein", () => {
      valueCards.forEach((card) => {
        expect(validateValueCard(card)).toBe(true);
      });
    });

    it("erste Card sollte 'Klare Produktlogik' sein", () => {
      const card = getValueCardByIndex(0);
      expect(card?.title).toBe("Klare Produktlogik");
    });

    it("zweite Card sollte 'Technisch sauber' sein", () => {
      const card = getValueCardByIndex(1);
      expect(card?.title).toBe("Technisch sauber");
    });

    it("jede Card sollte Titel und Description haben", () => {
      valueCards.forEach((card) => {
        expect(card.title).toBeTruthy();
        expect(card.description).toBeTruthy();
        expect(card.title.length).toBeGreaterThan(0);
        expect(card.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe("About Page Content", () => {
    it("sollte Badge Text enthalten", () => {
      expect(aboutPageContent.badgeText).toBe("About Us");
    });

    it("sollte Section Label enthalten", () => {
      expect(aboutPageContent.sectionLabel).toBe("Über uns");
    });

    it("sollte Headline enthalten", () => {
      expect(aboutPageContent.headline).toBe("Warum wir Loyalty neu denken");
    });

    it("sollte Description enthalten", () => {
      expect(aboutPageContent.description).toContain("API-first Plattform");
    });

    it("alle Content Felder sollten Strings sein", () => {
      expect(typeof aboutPageContent.badgeText).toBe("string");
      expect(typeof aboutPageContent.sectionLabel).toBe("string");
      expect(typeof aboutPageContent.headline).toBe("string");
      expect(typeof aboutPageContent.description).toBe("string");
    });

    it("keine Content Felder sollten leer sein", () => {
      expect(aboutPageContent.badgeText.length).toBeGreaterThan(0);
      expect(aboutPageContent.sectionLabel.length).toBeGreaterThan(0);
      expect(aboutPageContent.headline.length).toBeGreaterThan(0);
      expect(aboutPageContent.description.length).toBeGreaterThan(0);
    });
  });

  describe("calculateBadgeScale", () => {
    it("gibt maxScale zurück bei scrollY = 0", () => {
      const scale = calculateBadgeScale(0);
      expect(scale).toBe(1);
    });

    it("gibt minScale zurück bei maxShrinkDistance erreicht", () => {
      const scale = calculateBadgeScale(220);
      expect(scale).toBe(0.8);
    });

    it("gibt minScale zurück wenn über maxShrinkDistance gescrollt", () => {
      const scale = calculateBadgeScale(500);
      expect(scale).toBe(0.8);
    });

    it("gibt mittlere Werte bei teilweisem Scroll zurück", () => {
      const scale = calculateBadgeScale(110);
      expect(scale).toBeGreaterThan(0.8);
      expect(scale).toBeLessThan(1);
      expect(scale).toBeCloseTo(0.9, 1);
    });

    it("berechnet Scale linear", () => {
      const scale1 = calculateBadgeScale(55);
      const scale2 = calculateBadgeScale(110);
      const scale3 = calculateBadgeScale(165);

      expect(scale1).toBeGreaterThan(scale2);
      expect(scale2).toBeGreaterThan(scale3);
    });

    it("nimmt Custom maxShrinkDistance Parameter an", () => {
      const scale1 = calculateBadgeScale(100, 100);
      const scale2 = calculateBadgeScale(100, 200);
      expect(scale1).toBeLessThan(scale2);
    });

    it("nimmt Custom minScale Parameter an", () => {
      const scale1 = calculateBadgeScale(220, 220, 0.5);
      expect(scale1).toBe(0.5);
    });

    it("nimmt Custom maxScale Parameter an", () => {
      const scale = calculateBadgeScale(0, 220, 0.8, 1.2);
      expect(scale).toBe(1.2);
    });

    it("lehnt negative scrollY ab", () => {
      const scale = calculateBadgeScale(-100);
      expect(scale).toBe(1);
    });
  });

  describe("getTransformStyle", () => {
    it("gibt CSS scale Transform zurück", () => {
      const style = getTransformStyle(1);
      expect(style).toBe("scale(1)");
    });

    it("formatiert Dezimal Scale korrekt", () => {
      const style = getTransformStyle(0.9);
      expect(style).toContain("0.9");
    });

    it("funktioniert mit verschiedenen Scale Werten", () => {
      expect(getTransformStyle(0.8)).toBe("scale(0.8)");
      expect(getTransformStyle(1.5)).toBe("scale(1.5)");
      expect(getTransformStyle(0.5)).toBe("scale(0.5)");
    });
  });

  describe("getTransformOrigin", () => {
    it("gibt 'left center' zurück", () => {
      expect(getTransformOrigin()).toBe("left center");
    });

    it("gibt immer den gleichen Wert zurück", () => {
      expect(getTransformOrigin()).toBe(getTransformOrigin());
    });
  });

  describe("validateValueCard", () => {
    it("validiert echte Value Cards", () => {
      valueCards.forEach((card) => {
        expect(validateValueCard(card)).toBe(true);
      });
    });

    it("lehnt null ab", () => {
      expect(validateValueCard(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(validateValueCard(undefined)).toBe(false);
    });

    it("lehnt Objekt ohne title ab", () => {
      expect(
        validateValueCard({
          description: "test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt ohne description ab", () => {
      expect(
        validateValueCard({
          title: "test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit non-string title ab", () => {
      expect(
        validateValueCard({
          title: 123,
          description: "test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit non-string description ab", () => {
      expect(
        validateValueCard({
          title: "test",
          description: 123,
        })
      ).toBe(false);
    });
  });

  describe("getValueCardByTitle", () => {
    it("findet 'Klare Produktlogik' Card", () => {
      const card = getValueCardByTitle("Klare Produktlogik");
      expect(card?.title).toBe("Klare Produktlogik");
      expect(card?.description).toContain("tenant-fähig");
    });

    it("findet 'Technisch sauber' Card", () => {
      const card = getValueCardByTitle("Technisch sauber");
      expect(card?.title).toBe("Technisch sauber");
      expect(card?.description).toContain("Abläufe");
    });

    it("gibt undefined für unbekannte Titel zurück", () => {
      expect(getValueCardByTitle("Unknown")).toBeUndefined();
      expect(getValueCardByTitle("")).toBeUndefined();
    });

    it("Suche ist case-sensitive", () => {
      expect(getValueCardByTitle("klare produktlogik")).toBeUndefined();
      expect(getValueCardByTitle("TECHNISCH SAUBER")).toBeUndefined();
    });
  });

  describe("getAllValueCardTitles", () => {
    it("gibt alle Value Card Titel zurück", () => {
      const titles = getAllValueCardTitles();
      expect(titles).toHaveLength(2);
    });

    it("Reihenfolge ist gleich wie Original Array", () => {
      const titles = getAllValueCardTitles();
      expect(titles[0]).toBe("Klare Produktlogik");
      expect(titles[1]).toBe("Technisch sauber");
    });

    it("enthält alle erwarteten Titel", () => {
      const titles = getAllValueCardTitles();
      expect(titles).toContain("Klare Produktlogik");
      expect(titles).toContain("Technisch sauber");
    });
  });

  describe("getValueCardByIndex", () => {
    it("gibt erste Card bei Index 0 zurück", () => {
      const card = getValueCardByIndex(0);
      expect(card?.title).toBe("Klare Produktlogik");
    });

    it("gibt zweite Card bei Index 1 zurück", () => {
      const card = getValueCardByIndex(1);
      expect(card?.title).toBe("Technisch sauber");
    });

    it("gibt undefined für Index außerhalb Bereich", () => {
      expect(getValueCardByIndex(2)).toBeUndefined();
      expect(getValueCardByIndex(10)).toBeUndefined();
    });

    it("gibt undefined für negative Index", () => {
      expect(getValueCardByIndex(-1)).toBeUndefined();
    });
  });

  describe("isValidScrollPosition", () => {
    it("akzeptiert 0", () => {
      expect(isValidScrollPosition(0)).toBe(true);
    });

    it("akzeptiert positive Zahlen", () => {
      expect(isValidScrollPosition(100)).toBe(true);
      expect(isValidScrollPosition(1000)).toBe(true);
      expect(isValidScrollPosition(0.5)).toBe(true);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidScrollPosition(-1)).toBe(false);
      expect(isValidScrollPosition(-100)).toBe(false);
    });

    it("lehnt non-Zahlen ab", () => {
      expect(isValidScrollPosition("100" as any)).toBe(false);
      expect(isValidScrollPosition(null as any)).toBe(false);
      expect(isValidScrollPosition(undefined as any)).toBe(false);
    });
  });

  describe("AboutUsPage Utilities Integration", () => {
    it("Badge Scale Berechnung mit verschiedenen Scroll Positionen", () => {
      const scrollPositions = [0, 55, 110, 165, 220, 500];
      const scales = scrollPositions.map((pos) => calculateBadgeScale(pos));

      // Scales sollten abnehmend sein
      for (let i = 0; i < scales.length - 1; i++) {
        if (i < scrollPositions.length - 1 && scrollPositions[i] < 220) {
          expect(scales[i]).toBeGreaterThanOrEqual(scales[i + 1]);
        }
      }
    });

    it("alle Value Cards sind durch Titel abrufbar", () => {
      const titles = getAllValueCardTitles();
      titles.forEach((title) => {
        const card = getValueCardByTitle(title);
        expect(card).toBeDefined();
        expect(card?.title).toBe(title);
      });
    });

    it("alle Value Cards sind durch Index abrufbar", () => {
      for (let i = 0; i < valueCards.length; i++) {
        const card = getValueCardByIndex(i);
        expect(card).toBeDefined();
        expect(card?.title).toBeTruthy();
      }
    });

    it("kompletter Flow: Badge Scale + Value Cards Rendering", () => {
      const scrollY = 100;
      expect(isValidScrollPosition(scrollY)).toBe(true);

      const scale = calculateBadgeScale(scrollY);
      const transform = getTransformStyle(scale);
      const origin = getTransformOrigin();

      expect(transform).toContain("scale");
      expect(origin).toBe("left center");

      const cards = getAllValueCardTitles();
      expect(cards.length).toBe(2);
    });

    it("Value Cards und Content passen zusammen", () => {
      expect(valueCards.length).toBeGreaterThan(0);
      expect(aboutPageContent.badgeText).toBeTruthy();
      expect(aboutPageContent.headline).toBeTruthy();
      expect(aboutPageContent.description).toBeTruthy();
    });

    it("Badge Scale bleibt zwischen min und max", () => {
      const testScrollPositions = [0, 50, 100, 150, 200, 250, 500, 1000];
      testScrollPositions.forEach((pos) => {
        const scale = calculateBadgeScale(pos);
        expect(scale).toBeGreaterThanOrEqual(0.8);
        expect(scale).toBeLessThanOrEqual(1);
      });
    });
  });
});
