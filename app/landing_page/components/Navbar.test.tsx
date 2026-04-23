import { describe, it, expect } from "vitest";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

// Pure utility functions and data (extrahiert aus Navbar)
export interface RouteProps {
  href: string;
  label: string;
}

export const routeList: RouteProps[] = [
  {
    href: "#anmeldung",
    label: "Anmeldung",
  },
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Trust",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
  {
    href: "#cta",
    label: "Demo",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
  },
  {
    href: "/team",
    label: "Team",
  },
  {
    href: "/about-us",
    label: "About Us",
  },
];

export const GITHUB_URL = "https://github.com/Ramez147/web-eng-Projekt.git";
export const LOGO_TEXT = "LoyaltyFlow";
export const LOGO_HREF = "/";

// Pure utility functions
export function isExternalLink(href: string): boolean {
  return href.startsWith("http") || href.startsWith("mailto:");
}

export function isAnchorLink(href: string): boolean {
  return href.startsWith("#");
}

export function isInternalLink(href: string): boolean {
  return !isExternalLink(href) && !isAnchorLink(href);
}

export function getRouteByLabel(label: string): RouteProps | undefined {
  return routeList.find((route) => route.label === label);
}

export function getRouteByHref(href: string): RouteProps | undefined {
  return routeList.find((route) => route.href === href);
}

export function getAllRouteLabels(): string[] {
  return routeList.map((route) => route.label);
}

export function getAllRouteHrefs(): string[] {
  return routeList.map((route) => route.href);
}

export function validateRoute(route: any): boolean {
  return (
    typeof route === "object" &&
    route !== null &&
    typeof route.href === "string" &&
    typeof route.label === "string" &&
    route.href.length > 0 &&
    route.label.length > 0
  );
}

export function getInternalRoutes(): RouteProps[] {
  return routeList.filter((route) => isInternalLink(route.href));
}

export function getAnchorRoutes(): RouteProps[] {
  return routeList.filter((route) => isAnchorLink(route.href));
}

export function getHeaderClassName(): string {
  return "sticky border-b top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background";
}

export function getLogoLinkClassName(): string {
  return "ml-2 font-bold text-xl flex";
}

export function getNavContainerClassName(): string {
  return "container h-14 px-4 w-screen flex justify-between";
}

export function validateNavbarState(state: {
  isOpen?: boolean;
  pathname?: string;
}): { valid: boolean; error?: string } {
  const isOpen = state.isOpen;
  const pathname = state.pathname ?? "/";

  if (typeof isOpen !== "boolean") {
    return { valid: false, error: "isOpen muss ein Boolean sein" };
  }

  if (typeof pathname !== "string") {
    return { valid: false, error: "pathname muss ein String sein" };
  }

  return { valid: true };
}

describe("Navbar - Pure Utility Functions", () => {
  describe("Route List Data", () => {
    it("sollte genau 9 Navigation Routes haben", () => {
      expect(routeList).toHaveLength(9);
    });

    it("sollte alle erwarteten Labels enthalten", () => {
      const labels = getAllRouteLabels();
      expect(labels).toContain("Anmeldung");
      expect(labels).toContain("Features");
      expect(labels).toContain("Trust");
      expect(labels).toContain("Pricing");
      expect(labels).toContain("FAQ");
      expect(labels).toContain("Demo");
      expect(labels).toContain("Kontakt");
      expect(labels).toContain("Team");
      expect(labels).toContain("About Us");
    });

    it("alle Routes sollten valide Strukturen sein", () => {
      routeList.forEach((route) => {
        expect(validateRoute(route)).toBe(true);
      });
    });

    it("alle Routes sollten href und label haben", () => {
      routeList.forEach((route) => {
        expect(route.href).toBeTruthy();
        expect(route.label).toBeTruthy();
      });
    });

    it("sollte 3 interne Routes haben", () => {
      const internal = getInternalRoutes();
      expect(internal).toHaveLength(3);
      expect(internal.map((r) => r.label)).toContain("Kontakt");
      expect(internal.map((r) => r.label)).toContain("Team");
      expect(internal.map((r) => r.label)).toContain("About Us");
    });

    it("sollte 6 Anchor Routes haben", () => {
      const anchors = getAnchorRoutes();
      expect(anchors).toHaveLength(6);
    });
  });

  describe("Constants", () => {
    it("GITHUB_URL ist richtig gesetzt", () => {
      expect(GITHUB_URL).toBe("https://github.com/Ramez147/web-eng-Projekt.git");
    });

    it("LOGO_TEXT ist 'LoyaltyFlow'", () => {
      expect(LOGO_TEXT).toBe("LoyaltyFlow");
    });

    it("LOGO_HREF ist '/'", () => {
      expect(LOGO_HREF).toBe("/");
    });
  });

  describe("isExternalLink", () => {
    it("erkennt http Links", () => {
      expect(isExternalLink("http://example.com")).toBe(true);
      expect(isExternalLink("https://example.com")).toBe(true);
    });

    it("erkennt mailto Links", () => {
      expect(isExternalLink("mailto:test@example.com")).toBe(true);
    });

    it("lehnt interne Links ab", () => {
      expect(isExternalLink("/kontakt")).toBe(false);
      expect(isExternalLink("/team")).toBe(false);
    });

    it("lehnt Anchor Links ab", () => {
      expect(isExternalLink("#features")).toBe(false);
      expect(isExternalLink("#pricing")).toBe(false);
    });
  });

  describe("isAnchorLink", () => {
    it("erkennt Anchor Links", () => {
      expect(isAnchorLink("#anmeldung")).toBe(true);
      expect(isAnchorLink("#features")).toBe(true);
    });

    it("lehnt interne Links ab", () => {
      expect(isAnchorLink("/kontakt")).toBe(false);
    });

    it("lehnt externe Links ab", () => {
      expect(isAnchorLink("https://example.com")).toBe(false);
    });
  });

  describe("isInternalLink", () => {
    it("erkennt interne Links", () => {
      expect(isInternalLink("/kontakt")).toBe(true);
      expect(isInternalLink("/team")).toBe(true);
      expect(isInternalLink("/about-us")).toBe(true);
    });

    it("lehnt externe Links ab", () => {
      expect(isInternalLink("https://example.com")).toBe(false);
    });

    it("lehnt Anchor Links ab", () => {
      expect(isInternalLink("#features")).toBe(false);
    });
  });

  describe("getRouteByLabel", () => {
    it("findet Route durch Label 'Anmeldung'", () => {
      const route = getRouteByLabel("Anmeldung");
      expect(route?.href).toBe("#anmeldung");
    });

    it("findet Route durch Label 'Kontakt'", () => {
      const route = getRouteByLabel("Kontakt");
      expect(route?.href).toBe("/kontakt");
    });

    it("findet Route durch Label 'Team'", () => {
      const route = getRouteByLabel("Team");
      expect(route?.href).toBe("/team");
    });

    it("gibt undefined für unbekannte Labels zurück", () => {
      expect(getRouteByLabel("Unknown")).toBeUndefined();
    });

    it("Suche ist case-sensitive", () => {
      expect(getRouteByLabel("anmeldung")).toBeUndefined();
      expect(getRouteByLabel("FEATURES")).toBeUndefined();
    });
  });

  describe("getRouteByHref", () => {
    it("findet Route durch Href '#anmeldung'", () => {
      const route = getRouteByHref("#anmeldung");
      expect(route?.label).toBe("Anmeldung");
    });

    it("findet Route durch Href '/kontakt'", () => {
      const route = getRouteByHref("/kontakt");
      expect(route?.label).toBe("Kontakt");
    });

    it("findet Route durch Href '/about-us'", () => {
      const route = getRouteByHref("/about-us");
      expect(route?.label).toBe("About Us");
    });

    it("gibt undefined für unbekannte Hrefs zurück", () => {
      expect(getRouteByHref("/unknown")).toBeUndefined();
    });
  });

  describe("getAllRouteLabels", () => {
    it("gibt alle Route Labels zurück", () => {
      const labels = getAllRouteLabels();
      expect(labels).toHaveLength(9);
    });

    it("Labels sind in richtiger Reihenfolge", () => {
      const labels = getAllRouteLabels();
      expect(labels[0]).toBe("Anmeldung");
      expect(labels[1]).toBe("Features");
      expect(labels[8]).toBe("About Us");
    });
  });

  describe("getAllRouteHrefs", () => {
    it("gibt alle Route Hrefs zurück", () => {
      const hrefs = getAllRouteHrefs();
      expect(hrefs).toHaveLength(9);
    });

    it("Hrefs sind in richtiger Reihenfolge", () => {
      const hrefs = getAllRouteHrefs();
      expect(hrefs[0]).toBe("#anmeldung");
      expect(hrefs[6]).toBe("/kontakt");
    });
  });

  describe("validateRoute", () => {
    it("validiert echte Routes", () => {
      routeList.forEach((route) => {
        expect(validateRoute(route)).toBe(true);
      });
    });

    it("lehnt null ab", () => {
      expect(validateRoute(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(validateRoute(undefined)).toBe(false);
    });

    it("lehnt Objekt ohne href ab", () => {
      expect(
        validateRoute({
          label: "Test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt ohne label ab", () => {
      expect(
        validateRoute({
          href: "/test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit leerem href ab", () => {
      expect(
        validateRoute({
          href: "",
          label: "Test",
        })
      ).toBe(false);
    });

    it("lehnt Objekt mit leerem label ab", () => {
      expect(
        validateRoute({
          href: "/test",
          label: "",
        })
      ).toBe(false);
    });
  });

  describe("getInternalRoutes", () => {
    it("gibt 3 interne Routes zurück", () => {
      const internal = getInternalRoutes();
      expect(internal).toHaveLength(3);
    });

    it("enthält Kontakt, Team, About Us", () => {
      const internal = getInternalRoutes();
      const labels = internal.map((r) => r.label);
      expect(labels).toContain("Kontakt");
      expect(labels).toContain("Team");
      expect(labels).toContain("About Us");
    });

    it("alle hrefs sind Seiten-Links", () => {
      const internal = getInternalRoutes();
      internal.forEach((route) => {
        expect(isInternalLink(route.href)).toBe(true);
      });
    });
  });

  describe("getAnchorRoutes", () => {
    it("gibt 6 Anchor Routes zurück", () => {
      const anchors = getAnchorRoutes();
      expect(anchors).toHaveLength(6);
    });

    it("alle hrefs sind Anchors", () => {
      const anchors = getAnchorRoutes();
      anchors.forEach((route) => {
        expect(isAnchorLink(route.href)).toBe(true);
      });
    });
  });

  describe("CSS Class Names", () => {
    it("getHeaderClassName gibt richtigen Header CSS zurück", () => {
      const className = getHeaderClassName();
      expect(className).toContain("sticky");
      expect(className).toContain("border-b");
      expect(className).toContain("top-0");
      expect(className).toContain("z-40");
      expect(className).toContain("w-full");
    });

    it("getLogoLinkClassName gibt richtigen Logo CSS zurück", () => {
      const className = getLogoLinkClassName();
      expect(className).toContain("ml-2");
      expect(className).toContain("font-bold");
      expect(className).toContain("text-xl");
    });

    it("getNavContainerClassName gibt richtigen Container CSS zurück", () => {
      const className = getNavContainerClassName();
      expect(className).toContain("container");
      expect(className).toContain("h-14");
      expect(className).toContain("px-4");
      expect(className).toContain("w-screen");
      expect(className).toContain("flex");
      expect(className).toContain("justify-between");
    });
  });

  describe("validateNavbarState", () => {
    it("akzeptiert valide State", () => {
      const result = validateNavbarState({
        isOpen: false,
        pathname: "/",
      });
      expect(result.valid).toBe(true);
    });

    it("akzeptiert State mit isOpen true", () => {
      const result = validateNavbarState({
        isOpen: true,
        pathname: "/kontakt",
      });
      expect(result.valid).toBe(true);
    });

    it("lehnt State mit ungültigem isOpen ab", () => {
      const result = validateNavbarState({
        isOpen: "false" as any,
        pathname: "/",
      });
      expect(result.valid).toBe(false);
    });

    it("lehnt State mit ungültigem pathname ab", () => {
      const result = validateNavbarState({
        isOpen: false,
        pathname: 123 as any,
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("Navbar Utilities Integration", () => {
    it("kompletter Navigation Flow: Label → Route → Link Type", () => {
      const labels = getAllRouteLabels();
      labels.forEach((label) => {
        const route = getRouteByLabel(label);
        expect(route).toBeDefined();
        
        const isInternal = isInternalLink(route!.href);
        const isAnchor = isAnchorLink(route!.href);
        
        // Jeder Link sollte entweder Internal oder Anchor sein
        expect(isInternal || isAnchor).toBe(true);
      });
    });

    it("Route Daten sind konsistent", () => {
      const labels = getAllRouteLabels();
      const hrefs = getAllRouteHrefs();
      
      expect(labels).toHaveLength(hrefs.length);
      expect(labels).toHaveLength(9);
    });

    it("GitHubLogoIcon existiert", () => {
      expect(GitHubLogoIcon).toBeDefined();
    });

    it("Alle Anchor Routes haben # am Anfang", () => {
      const anchors = getAnchorRoutes();
      anchors.forEach((route) => {
        expect(route.href.startsWith("#")).toBe(true);
      });
    });

    it("Alle Internen Routes haben / am Anfang", () => {
      const internal = getInternalRoutes();
      internal.forEach((route) => {
        expect(route.href.startsWith("/")).toBe(true);
      });
    });
  });
});
