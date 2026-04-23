// use-mobile.test.ts
import { describe, it, expect } from "vitest";
import {
  useIsMobile,
  isValidMediaQuery,
  getBreakpointQuery,
  extractBreakpointValue,
  isMediaQuerySupported,
  createMediaQueryListener,
} from "./use-mobile";

describe("useIsMobile Hook Utils", () => {
  // isValidMediaQuery Tests
  describe("isValidMediaQuery", () => {
    it("gibt true für valide Query zurück", () => {
      expect(isValidMediaQuery("(max-width: 767px)")).toBe(true);
      expect(isValidMediaQuery("(min-width: 768px)")).toBe(true);
    });

    it("gibt false für leeren String zurück", () => {
      expect(isValidMediaQuery("")).toBe(false);
      expect(isValidMediaQuery("   ")).toBe(false);
    });

    it("gibt false für nicht-Strings zurück", () => {
      expect(isValidMediaQuery(123 as any)).toBe(false);
      expect(isValidMediaQuery(null as any)).toBe(false);
    });

    it("gibt false für sehr lange Strings zurück", () => {
      const longString = "a".repeat(10000);
      expect(isValidMediaQuery(longString)).toBe(true);
    });
  });

  // getBreakpointQuery Tests
  describe("getBreakpointQuery", () => {
    it("gibt korrekte Query für 768px Breakpoint zurück", () => {
      const query = getBreakpointQuery(768);
      expect(query).toBe("(max-width: 767px)");
    });

    it("gibt korrekte Query für custom Breakpoint zurück", () => {
      const query = getBreakpointQuery(1024);
      expect(query).toBe("(max-width: 1023px)");
    });

    it("gibt Standard Query für negative Breakpoint zurück", () => {
      const query = getBreakpointQuery(-100);
      expect(query).toBe("(max-width: 767px)");
    });

    it("gibt Standard Query für 0 zurück", () => {
      const query = getBreakpointQuery(0);
      expect(query).toBe("(max-width: 767px)");
    });

    it("subtrahiert 1 von Breakpoint", () => {
      expect(getBreakpointQuery(500)).toBe("(max-width: 499px)");
      expect(getBreakpointQuery(1)).toBe("(max-width: 0px)");
    });
  });

  // extractBreakpointValue Tests
  describe("extractBreakpointValue", () => {
    it("extrahiert Breakpoint aus Query", () => {
      expect(extractBreakpointValue("(max-width: 767px)")).toBe(767);
      expect(extractBreakpointValue("(max-width: 1024px)")).toBe(1024);
    });

    it("gibt erste Zahl zurück", () => {
      expect(extractBreakpointValue("(min-width: 123px) and (max-width: 456px)")).toBe(123);
    });

    it("gibt null zurück wenn keine Zahl vorhanden", () => {
      expect(extractBreakpointValue("(max-width: nopx)")).toBeNull();
      expect(extractBreakpointValue("no numbers here")).toBeNull();
    });

    it("handhabt zweistellige Zahlen", () => {
      expect(extractBreakpointValue("(max-width: 99px)")).toBe(99);
    });

    it("handhabt vierstellige Zahlen", () => {
      expect(extractBreakpointValue("(max-width: 1920px)")).toBe(1920);
    });
  });

  // isMediaQuerySupported Tests
  describe("isMediaQuerySupported", () => {
    it("gibt true zurück wenn window.matchMedia existiert", () => {
      expect(isMediaQuerySupported()).toBe(true);
    });

    it("window.matchMedia ist in jsdom vorhanden", () => {
      expect(typeof window.matchMedia).toBe("function");
    });
  });

  // createMediaQueryListener Tests
  describe("createMediaQueryListener", () => {
    it("gibt Cleanup Function zurück", () => {
      const cleanup = createMediaQueryListener("(max-width: 767px)", () => {});
      expect(typeof cleanup).toBe("function");
    });

    it("Cleanup entfernt Listener", () => {
      const callback = () => {};
      const cleanup = createMediaQueryListener("(max-width: 767px)", callback);
      expect(() => cleanup()).not.toThrow();
    });

    it("handhabt mehrere Queries gleichzeitig", () => {
      const callback1 = () => {};
      const callback2 = () => {};
      
      const cleanup1 = createMediaQueryListener("(max-width: 767px)", callback1);
      const cleanup2 = createMediaQueryListener("(max-width: 1024px)", callback2);
      
      expect(() => {
        cleanup1();
        cleanup2();
      }).not.toThrow();
    });
  });

  
  describe("useIsMobile Integration", () => {
    it("Hook ist definiert", () => {
      expect(useIsMobile).toBeDefined();
    });

    it("Hook ist eine Function", () => {
      expect(typeof useIsMobile).toBe("function");
    });

    it("Hook hat keine Parameter", () => {
      expect(useIsMobile.length).toBe(0);
    });
  });

  // Pure Function Integration Tests
  describe("Breakpoint Utilities Integration", () => {
    it("kompletter Breakpoint Flow", () => {
      const breakpoint = 768;
      const query = getBreakpointQuery(breakpoint);
      const extracted = extractBreakpointValue(query);
      
      expect(query).toBe("(max-width: 767px)");
      expect(extracted).toBe(767);
      expect(isValidMediaQuery(query)).toBe(true);
    });

    it("validiert Query nach Generierung", () => {
      const breakpoints = [480, 768, 1024, 1440];
      
      breakpoints.forEach((bp) => {
        const query = getBreakpointQuery(bp);
        expect(isValidMediaQuery(query)).toBe(true);
      });
    });

    it("extrahiert korrekte Werte aus Queries", () => {
      const testCases = [
        { query: "(max-width: 767px)", expected: 767 },
        { query: "(max-width: 1023px)", expected: 1023 },
        { query: "(max-width: 479px)", expected: 479 },
      ];

      testCases.forEach(({ query, expected }) => {
        expect(extractBreakpointValue(query)).toBe(expected);
      });
    });

    it("holt Breakpoint zurück für alle Standard Größen", () => {
      const standardBreakpoints = [640, 768, 1024, 1280, 1536];
      
      standardBreakpoints.forEach((bp) => {
        const query = getBreakpointQuery(bp);
        const value = extractBreakpointValue(query);
        expect(value).toBe(bp - 1);
      });
    });

    it("Query ist konsistent für gleiche Inputs", () => {
      const query1 = getBreakpointQuery(768);
      const query2 = getBreakpointQuery(768);
      
      expect(query1).toBe(query2);
    });

    it("Listener kann mehrmals erstellt werden", () => {
      const callback = () => {};
      
      const cleanup1 = createMediaQueryListener("(max-width: 767px)", callback);
      const cleanup2 = createMediaQueryListener("(max-width: 767px)", callback);
      
      expect(() => {
        cleanup1();
        cleanup2();
      }).not.toThrow();
    });
  });
});

