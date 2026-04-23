import { describe, it, expect } from "vitest";
import { ArrowUpToLine } from "lucide-react";

// Pure utility functions and data (extrahiert aus ScrollToTop)
export const SCROLL_THRESHOLD = 400;

export function shouldShowButton(scrollY: number): boolean {
  return scrollY > SCROLL_THRESHOLD;
}

export function getScrollTopPosition(): { top: number; left: number } {
  return {
    top: 0,
    left: 0,
  };
}

export function isValidScrollY(scrollY: number): boolean {
  return (
    typeof scrollY === "number" &&
    scrollY >= 0 &&
    scrollY !== Infinity &&
    !isNaN(scrollY)
  );
}

export function getButtonClassName(): string {
  return "fixed bottom-4 right-4 opacity-90 shadow-md";
}

export function getIconClassName(): string {
  return "h-4 w-4";
}

export function calculateScrollVisibility(scrollY: number): boolean {
  if (!isValidScrollY(scrollY)) return false;
  return shouldShowButton(scrollY);
}

export function validateScrollToTopState(state: {
  showTopBtn?: boolean;
  scrollY?: number;
}): { valid: boolean; error?: string } {
  const showTopBtn = state.showTopBtn;
  const scrollY = state.scrollY ?? 0;

  if (typeof showTopBtn !== "boolean") {
    return { valid: false, error: "showTopBtn muss ein Boolean sein" };
  }

  if (!isValidScrollY(scrollY)) {
    return { valid: false, error: "scrollY muss eine Zahl >= 0 sein" };
  }

  // Validiere, dass showTopBtn und scrollY konsistent sind
  const expectedShowButton = shouldShowButton(scrollY);
  if (showTopBtn !== expectedShowButton) {
    return {
      valid: false,
      error: `showTopBtn sollte ${expectedShowButton} sein bei scrollY ${scrollY}`,
    };
  }

  return { valid: true };
}

describe("ScrollToTop - Pure Utility Functions", () => {
  describe("shouldShowButton", () => {
    it("gibt false zurück bei scrollY = 0", () => {
      expect(shouldShowButton(0)).toBe(false);
    });

    it("gibt false zurück bei scrollY = 400", () => {
      expect(shouldShowButton(400)).toBe(false);
    });

    it("gibt true zurück bei scrollY = 401", () => {
      expect(shouldShowButton(401)).toBe(true);
    });

    it("gibt true zurück bei scrollY = 500", () => {
      expect(shouldShowButton(500)).toBe(true);
    });

    it("gibt true zurück bei großen scrollY Werten", () => {
      expect(shouldShowButton(1000)).toBe(true);
      expect(shouldShowButton(5000)).toBe(true);
    });

    it("gibt false zurück bei negativen scrollY", () => {
      expect(shouldShowButton(-1)).toBe(false);
      expect(shouldShowButton(-100)).toBe(false);
    });

    it("Threshold ist 400", () => {
      expect(shouldShowButton(SCROLL_THRESHOLD)).toBe(false);
      expect(shouldShowButton(SCROLL_THRESHOLD + 1)).toBe(true);
    });

    it("ist case für verschiedene Werte korrekt", () => {
      const testCases = [
        { scrollY: 0, expected: false },
        { scrollY: 100, expected: false },
        { scrollY: 399, expected: false },
        { scrollY: 400, expected: false },
        { scrollY: 401, expected: true },
        { scrollY: 800, expected: true },
      ];

      testCases.forEach(({ scrollY, expected }) => {
        expect(shouldShowButton(scrollY)).toBe(expected);
      });
    });
  });

  describe("getScrollTopPosition", () => {
    it("gibt { top: 0, left: 0 } zurück", () => {
      const position = getScrollTopPosition();
      expect(position).toEqual({ top: 0, left: 0 });
    });

    it("gibt immer das gleiche Objekt zurück", () => {
      const pos1 = getScrollTopPosition();
      const pos2 = getScrollTopPosition();
      expect(pos1).toEqual(pos2);
    });

    it("hat top Property mit Wert 0", () => {
      const position = getScrollTopPosition();
      expect(position.top).toBe(0);
    });

    it("hat left Property mit Wert 0", () => {
      const position = getScrollTopPosition();
      expect(position.left).toBe(0);
    });
  });

  describe("isValidScrollY", () => {
    it("akzeptiert 0", () => {
      expect(isValidScrollY(0)).toBe(true);
    });

    it("akzeptiert positive Zahlen", () => {
      expect(isValidScrollY(100)).toBe(true);
      expect(isValidScrollY(500)).toBe(true);
      expect(isValidScrollY(0.5)).toBe(true);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidScrollY(-1)).toBe(false);
      expect(isValidScrollY(-100)).toBe(false);
    });

    it("lehnt non-Zahlen ab", () => {
      expect(isValidScrollY("100" as any)).toBe(false);
      expect(isValidScrollY(null as any)).toBe(false);
      expect(isValidScrollY(undefined as any)).toBe(false);
    });

    it("lehnt NaN ab", () => {
      expect(isValidScrollY(NaN)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isValidScrollY(Infinity)).toBe(false);
    });
  });

  describe("getButtonClassName", () => {
    it("gibt Button ClassName zurück", () => {
      const className = getButtonClassName();
      expect(className).toBe("fixed bottom-4 right-4 opacity-90 shadow-md");
    });

    it("enthält 'fixed' für fixed positioning", () => {
      expect(getButtonClassName()).toContain("fixed");
    });

    it("enthält 'bottom-4' für Bottom Positioning", () => {
      expect(getButtonClassName()).toContain("bottom-4");
    });

    it("enthält 'right-4' für Right Positioning", () => {
      expect(getButtonClassName()).toContain("right-4");
    });

    it("enthält 'opacity-90' für Opacity", () => {
      expect(getButtonClassName()).toContain("opacity-90");
    });

    it("enthält 'shadow-md' für Shadow", () => {
      expect(getButtonClassName()).toContain("shadow-md");
    });
  });

  describe("getIconClassName", () => {
    it("gibt Icon ClassName zurück", () => {
      expect(getIconClassName()).toBe("h-4 w-4");
    });

    it("enthält 'h-4' für Height", () => {
      expect(getIconClassName()).toContain("h-4");
    });

    it("enthält 'w-4' für Width", () => {
      expect(getIconClassName()).toContain("w-4");
    });
  });

  describe("calculateScrollVisibility", () => {
    it("gibt false bei scrollY = 0 zurück", () => {
      expect(calculateScrollVisibility(0)).toBe(false);
    });

    it("gibt false bei scrollY = 400 zurück", () => {
      expect(calculateScrollVisibility(400)).toBe(false);
    });

    it("gibt true bei scrollY = 500 zurück", () => {
      expect(calculateScrollVisibility(500)).toBe(true);
    });

    it("lehnt ungültige scrollY Werte ab", () => {
      expect(calculateScrollVisibility(-1)).toBe(false);
      expect(calculateScrollVisibility(NaN as any)).toBe(false);
    });

    it("lehnt non-Zahlen ab", () => {
      expect(calculateScrollVisibility("100" as any)).toBe(false);
      expect(calculateScrollVisibility(null as any)).toBe(false);
    });
  });

  describe("validateScrollToTopState", () => {
    it("akzeptiert valide State mit showTopBtn false und scrollY 0", () => {
      const result = validateScrollToTopState({
        showTopBtn: false,
        scrollY: 0,
      });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("akzeptiert valide State mit showTopBtn false und scrollY 400", () => {
      const result = validateScrollToTopState({
        showTopBtn: false,
        scrollY: 400,
      });
      expect(result.valid).toBe(true);
    });

    it("akzeptiert valide State mit showTopBtn true und scrollY 500", () => {
      const result = validateScrollToTopState({
        showTopBtn: true,
        scrollY: 500,
      });
      expect(result.valid).toBe(true);
    });

    it("lehnt State mit ungültigem showTopBtn ab", () => {
      const result = validateScrollToTopState({
        showTopBtn: "true" as any,
        scrollY: 100,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Boolean");
    });

    it("lehnt State mit negative scrollY ab", () => {
      const result = validateScrollToTopState({
        showTopBtn: false,
        scrollY: -1,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Zahl");
    });

    it("lehnt State mit inconsistentem showTopBtn und scrollY ab", () => {
      // showTopBtn sollte true sein bei scrollY 500
      const result = validateScrollToTopState({
        showTopBtn: false,
        scrollY: 500,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("sollte");
    });

    it("lehnt State mit inconsistentem showTopBtn und scrollY ab (andere Richtung)", () => {
      // showTopBtn sollte false sein bei scrollY 300
      const result = validateScrollToTopState({
        showTopBtn: true,
        scrollY: 300,
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("SCROLL_THRESHOLD Constant", () => {
    it("ist 400", () => {
      expect(SCROLL_THRESHOLD).toBe(400);
    });

    it("wird in shouldShowButton verwendet", () => {
      expect(shouldShowButton(SCROLL_THRESHOLD)).toBe(false);
      expect(shouldShowButton(SCROLL_THRESHOLD + 1)).toBe(true);
    });
  });

  describe("ScrollToTop Utilities Integration", () => {
    it("kompletter Flow: Scroll Position → Button Sichtbarkeit", () => {
      const scrollPositions = [0, 100, 200, 300, 400, 401, 500, 1000];
      
      scrollPositions.forEach((scrollY) => {
        const shouldShow = shouldShowButton(scrollY);
        const isValid = isValidScrollY(scrollY);
        expect(isValid).toBe(true);
        
        if (shouldShow) {
          const position = getScrollTopPosition();
          expect(position.top).toBe(0);
          expect(position.left).toBe(0);
        }
      });
    });

    it("Button Visibility an Schwellenwert", () => {
      // Unter Schwellenwert
      expect(shouldShowButton(399)).toBe(false);
      
      // Genau am Schwellenwert
      expect(shouldShowButton(400)).toBe(false);
      
      // Über Schwellenwert
      expect(shouldShowButton(401)).toBe(true);
    });

    it("Button ClassName ist korrekt formatiert", () => {
      const className = getButtonClassName();
      const classes = className.split(" ");
      
      expect(classes).toContain("fixed");
      expect(classes).toContain("bottom-4");
      expect(classes).toContain("right-4");
      expect(classes).toContain("opacity-90");
      expect(classes).toContain("shadow-md");
    });

    it("Icon ClassName ist korrekt formatiert", () => {
      const className = getIconClassName();
      const classes = className.split(" ");
      
      expect(classes).toContain("h-4");
      expect(classes).toContain("w-4");
    });

    it("Scroll Position und Button Sichtbarkeit sind konsistent", () => {
      const testScrollPositions = [0, 200, 400, 500, 1000];
      
      testScrollPositions.forEach((scrollY) => {
        const shouldShow = shouldShowButton(scrollY);
        const state = {
          showTopBtn: shouldShow,
          scrollY,
        };
        const validation = validateScrollToTopState(state);
        expect(validation.valid).toBe(true);
      });
    });

    it("mehrere Scroll Events funktionieren", () => {
      // Scroll runter
      expect(shouldShowButton(0)).toBe(false);
      expect(shouldShowButton(500)).toBe(true);
      
      // Scroll wieder hoch
      expect(shouldShowButton(100)).toBe(false);
      
      // Scroll wieder runter
      expect(shouldShowButton(600)).toBe(true);
    });
  });
});
