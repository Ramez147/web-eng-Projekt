// format-number.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  compactFormat,
  standardFormat,
  shouldUseCompactFormat,
  getMagnitudePrefix,
  addThousandSeparators,
  isWholeNumber,
} from "./format-number";

describe("Format Number Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // shouldUseCompactFormat Tests
  describe("shouldUseCompactFormat", () => {
    it("gibt true zurück für Zahlen >= 1000", () => {
      expect(shouldUseCompactFormat(1000)).toBe(true);
      expect(shouldUseCompactFormat(1001)).toBe(true);
      expect(shouldUseCompactFormat(999999)).toBe(true);
    });

    it("gibt false zurück für Zahlen < 1000", () => {
      expect(shouldUseCompactFormat(999)).toBe(false);
      expect(shouldUseCompactFormat(100)).toBe(false);
      expect(shouldUseCompactFormat(0)).toBe(false);
    });

    it("gibt true zurück für negative Zahlen mit großem Absolutwert", () => {
      expect(shouldUseCompactFormat(-1000)).toBe(true);
      expect(shouldUseCompactFormat(-999999)).toBe(true);
    });

    it("gibt false zurück für negative Zahlen mit kleinem Absolutwert", () => {
      expect(shouldUseCompactFormat(-999)).toBe(false);
      expect(shouldUseCompactFormat(-1)).toBe(false);
    });

    it("gibt false zurück für Dezimalzahlen < 1000", () => {
      expect(shouldUseCompactFormat(999.99)).toBe(false);
      expect(shouldUseCompactFormat(0.5)).toBe(false);
    });

    it("gibt true zurück für Dezimalzahlen >= 1000", () => {
      expect(shouldUseCompactFormat(1000.1)).toBe(true);
      expect(shouldUseCompactFormat(1500.5)).toBe(true);
    });
  });

  // getMagnitudePrefix Tests
  describe("getMagnitudePrefix", () => {
    it("gibt 'B' für Milliarden zurück", () => {
      expect(getMagnitudePrefix(1000000000)).toBe("B");
      expect(getMagnitudePrefix(5000000000)).toBe("B");
    });

    it("gibt 'M' für Millionen zurück", () => {
      expect(getMagnitudePrefix(1000000)).toBe("M");
      expect(getMagnitudePrefix(5000000)).toBe("M");
    });

    it("gibt 'K' für Tausende zurück", () => {
      expect(getMagnitudePrefix(1000)).toBe("K");
      expect(getMagnitudePrefix(5000)).toBe("K");
    });

    it("gibt leeren String für Zahlen < 1000 zurück", () => {
      expect(getMagnitudePrefix(999)).toBe("");
      expect(getMagnitudePrefix(100)).toBe("");
      expect(getMagnitudePrefix(0)).toBe("");
    });

    it("berücksichtigt Absolutwert für negative Zahlen", () => {
      expect(getMagnitudePrefix(-1000000000)).toBe("B");
      expect(getMagnitudePrefix(-1000000)).toBe("M");
      expect(getMagnitudePrefix(-1000)).toBe("K");
    });

    it("wählt größte passende Magnitude", () => {
      expect(getMagnitudePrefix(999999999)).toBe("M");
      expect(getMagnitudePrefix(1000000000)).toBe("B");
      expect(getMagnitudePrefix(999999)).toBe("K");
    });

    it("akzeptiert Dezimalzahlen", () => {
      expect(getMagnitudePrefix(1500.5)).toBe("K");
      expect(getMagnitudePrefix(1000000.5)).toBe("M");
    });
  });

  // addThousandSeparators Tests
  describe("addThousandSeparators", () => {
    it("fügt Kommas für Tausende hinzu", () => {
      expect(addThousandSeparators(1000)).toBe("1,000");
      expect(addThousandSeparators(1000000)).toBe("1,000,000");
    });

    it("formatiert kleine Zahlen ohne Änderung", () => {
      expect(addThousandSeparators(100)).toBe("100");
      expect(addThousandSeparators(999)).toBe("999");
    });

    it("rundet dezimale Zahlen", () => {
      expect(addThousandSeparators(1000.5)).toBe("1,001");
      expect(addThousandSeparators(1000.4)).toBe("1,000");
    });

    it("formatiert negative Zahlen", () => {
      expect(addThousandSeparators(-1000)).toBe("-1,000");
      expect(addThousandSeparators(-1000000)).toBe("-1,000,000");
    });

    it("formatiert Null korrekt", () => {
      expect(addThousandSeparators(0)).toBe("0");
    });

    it("akzeptiert sehr große Zahlen", () => {
      expect(addThousandSeparators(1000000000)).toBe("1,000,000,000");
    });

    it("akzeptiert sehr kleine dezimale Zahlen", () => {
      expect(addThousandSeparators(0.1)).toBe("0");
      expect(addThousandSeparators(0.9)).toBe("1");
    });
  });

  // isWholeNumber Tests
  describe("isWholeNumber", () => {
    it("gibt true für Integer zurück", () => {
      expect(isWholeNumber(1)).toBe(true);
      expect(isWholeNumber(100)).toBe(true);
      expect(isWholeNumber(0)).toBe(true);
    });

    it("gibt false für Dezimalzahlen zurück", () => {
      expect(isWholeNumber(1.5)).toBe(false);
      expect(isWholeNumber(100.1)).toBe(false);
      expect(isWholeNumber(0.1)).toBe(false);
    });

    it("gibt true für negative Integer zurück", () => {
      expect(isWholeNumber(-1)).toBe(true);
      expect(isWholeNumber(-100)).toBe(true);
    });

    it("gibt false für negative Dezimalzahlen zurück", () => {
      expect(isWholeNumber(-1.5)).toBe(false);
      expect(isWholeNumber(-0.1)).toBe(false);
    });

    it("gibt true für sehr große Integer zurück", () => {
      expect(isWholeNumber(999999999999)).toBe(true);
    });

    it("gibt false für 1.0 (Dezimal)", () => {
      // Note: 1.0 === 1, so isWholeNumber should return true
      expect(isWholeNumber(1.0)).toBe(true);
    });

    it("erkennt praktisch Ganze Zahlen", () => {
      expect(isWholeNumber(5.0)).toBe(true);
      expect(isWholeNumber(5.000000)).toBe(true);
    });
  });

  // compactFormat Tests
  describe("compactFormat", () => {
    it("formatiert 1000 als 1K", () => {
      expect(compactFormat(1000)).toBe("1K");
    });

    it("formatiert 1500 als 1.5K", () => {
      expect(compactFormat(1500)).toBe("1.5K");
    });

    it("formatiert 1000000 als 1M", () => {
      expect(compactFormat(1000000)).toBe("1M");
    });

    it("formatiert 1500000 als 1.5M", () => {
      expect(compactFormat(1500000)).toBe("1.5M");
    });

    it("formatiert 1000000000 als 1B", () => {
      expect(compactFormat(1000000000)).toBe("1B");
    });

    it("formatiert kleine Zahlen ohne Änderung", () => {
      expect(compactFormat(100)).toBe("100");
      expect(compactFormat(999)).toBe("999");
    });

    it("formatiert negative Zahlen", () => {
      expect(compactFormat(-1000)).toBe("-1K");
      expect(compactFormat(-1500)).toBe("-1.5K");
    });

    it("formatiert Null", () => {
      expect(compactFormat(0)).toBe("0");
    });

    it("hat maximale Dezimalstelle von 1", () => {
      expect(compactFormat(1234)).toBe("1.2K");
      expect(compactFormat(1567)).toBe("1.6K");
    });

    it("formatiert verschiedene Magnitudes korrekt", () => {
      expect(compactFormat(5000)).toBe("5K");
      expect(compactFormat(5000000)).toBe("5M");
      expect(compactFormat(5000000000)).toBe("5B");
    });

    it("behandelt Grenzzahlen", () => {
      expect(compactFormat(999)).toBe("999");
      expect(compactFormat(1000)).toBe("1K");
      expect(compactFormat(999999)).toBe("1M");
      expect(compactFormat(1000000)).toBe("1M");
    });
  });

  // standardFormat Tests
  describe("standardFormat", () => {
    it("formatiert 1000 mit Komma", () => {
      expect(standardFormat(1000)).toBe("1,000");
    });

    it("formatiert 1000000 mit Kommas", () => {
      expect(standardFormat(1000000)).toBe("1,000,000");
    });

    it("formatiert kleine Zahlen ohne Komma", () => {
      expect(standardFormat(100)).toBe("100");
      expect(standardFormat(999)).toBe("999");
    });

    it("rundet Dezimalzahlen", () => {
      expect(standardFormat(1000.5)).toBe("1,001");
      expect(standardFormat(1000.4)).toBe("1,000");
    });

    it("formatiert negative Zahlen", () => {
      expect(standardFormat(-1000)).toBe("-1,000");
      expect(standardFormat(-1000000)).toBe("-1,000,000");
    });

    it("formatiert Null", () => {
      expect(standardFormat(0)).toBe("0");
    });

    it("hat keine Dezimalstellen", () => {
      expect(standardFormat(1000.9)).toBe("1,001");
      expect(standardFormat(1000.1)).toBe("1,000");
    });

    it("formatiert sehr große Zahlen", () => {
      expect(standardFormat(1000000000)).toBe("1,000,000,000");
    });

    it("unterscheidet sich vom compactFormat bei großen Zahlen", () => {
      expect(standardFormat(1000000)).toBe("1,000,000");
      expect(compactFormat(1000000)).toBe("1M");
    });
  });

  // Integration Tests
  describe("Format Number Utils Integration", () => {
    it("shouldUseCompactFormat entspricht getMagnitudePrefix", () => {
      const testValues = [999, 1000, 1000000, 1000000000];
      testValues.forEach((val) => {
        const shouldCompact = shouldUseCompactFormat(val);
        const hasPrefix = getMagnitudePrefix(val) !== "";
        expect(shouldCompact).toBe(hasPrefix);
      });
    });

    it("wählt richtige Formatierung basierend auf Größe", () => {
      const largeNumber = 1500000;
      if (shouldUseCompactFormat(largeNumber)) {
        expect(compactFormat(largeNumber)).toBe("1.5M");
      } else {
        expect(standardFormat(largeNumber)).toContain(",");
      }
    });

    it("formatiert verschiedene Zahlengrößen konsistent", () => {
      const numbers = [100, 1000, 1000000, 1000000000];
      numbers.forEach((num) => {
        const compact = compactFormat(num);
        const standard = standardFormat(num);
        expect(compact).toBeDefined();
        expect(standard).toBeDefined();
      });
    });

    it("isWholeNumber ist konsistent mit Formatierung", () => {
      const testCases = [
        { num: 1000, expected: true },
        { num: 1000.5, expected: false },
        { num: 0, expected: true },
      ];

      testCases.forEach(({ num, expected }) => {
        expect(isWholeNumber(num)).toBe(expected);
      });
    });

    it("addThousandSeparators entspricht standardFormat", () => {
      const testValues = [100, 1000, 10000, 1000000];
      testValues.forEach((val) => {
        expect(addThousandSeparators(val)).toBe(standardFormat(val));
      });
    });

    it("kompakte und Standard-Formatierung zeigen dasselbe Wert", () => {
      // Both formats should represent same numerical value
      const testNum = 1234567;
      const compact = compactFormat(testNum);
      const standard = standardFormat(testNum);
      expect(compact).toBe("1.2M");
      expect(standard).toBe("1,234,567");
    });

    it("formatiert Sequenz von Zahlen richtig", () => {
      const sequence = [0, 100, 1000, 10000, 100000, 1000000];
      const formatted = sequence.map(compactFormat);
      expect(formatted[0]).toBe("0");
      expect(formatted[1]).toBe("100");
      expect(formatted[2]).toBe("1K");
      expect(formatted[3]).toBe("10K");
      expect(formatted[4]).toBe("100K");
      expect(formatted[5]).toBe("1M");
    });

    it("negative und positive Zahlen sind symmetrisch", () => {
      const positives = [1000, 1000000];
      positives.forEach((pos) => {
        const negPos = compactFormat(pos);
        const negNeg = compactFormat(-pos);
        // Should have same magnitude but different sign
        expect(negNeg).toContain(negPos.replace("-", ""));
      });
    });

    it("alle Utility-Funktionen sind Pure Functions", () => {
      const testVal = 1234567;
      expect(compactFormat(testVal)).toBe(compactFormat(testVal));
      expect(standardFormat(testVal)).toBe(standardFormat(testVal));
      expect(shouldUseCompactFormat(testVal)).toBe(shouldUseCompactFormat(testVal));
      expect(getMagnitudePrefix(testVal)).toBe(getMagnitudePrefix(testVal));
    });

    it("formatiert Edge Cases korrekt", () => {
      const edgeCases = [
        { val: 0, compact: "0", standard: "0" },
        { val: 1, compact: "1", standard: "1" },
        { val: -1, compact: "-1", standard: "-1" },
        { val: 1000, compact: "1K", standard: "1,000" },
        { val: -1000, compact: "-1K", standard: "-1,000" },
      ];

      edgeCases.forEach(({ val, compact, standard }) => {
        expect(compactFormat(val)).toBe(compact);
        expect(standardFormat(val)).toBe(standard);
      });
    });

    it("verarbeitet große Mengen von Zahlen", () => {
      const results = [];
      for (let i = 0; i <= 1000000000; i += 100000000) {
        results.push({
          compact: compactFormat(i),
          standard: standardFormat(i),
        });
      }
      expect(results.length).toBe(11);
      expect(results[0].compact).toBe("0");
      expect(results[10].compact).toBe("1B");
    });

    it("prefix-Reihenfolge ist konsistent", () => {
      expect(getMagnitudePrefix(1000)).toBe("K");
      expect(getMagnitudePrefix(1000000)).toBe("M");
      expect(getMagnitudePrefix(1000000000)).toBe("B");
      // Larger should have different prefix
      expect(getMagnitudePrefix(1000000000)).not.toBe(getMagnitudePrefix(1000));
    });
  });
});