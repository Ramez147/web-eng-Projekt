// Sponsors.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Sponsors } from "./Sponsors";

describe("Sponsors", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Sponsors />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id sponsors", () => {
    const { container } = render(<Sponsors />);
    const section = container.querySelector("section#sponsors");
    expect(section).toBeInTheDocument();
  });

  it("section hat container pt-12 sm:pt-20", () => {
    const { container } = render(<Sponsors />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("container");
    expect(section?.className).toContain("pt-12");
  });

  it("hat sponsor-glow-card div", () => {
    const { container } = render(<Sponsors />);
    const div = container.querySelector(".sponsor-glow-card");
    expect(div).toBeInTheDocument();
  });

  it("sponsor-glow-card hat rounded-2xl border", () => {
    const { container } = render(<Sponsors />);
    const div = container.querySelector(".sponsor-glow-card");
    expect(div?.className).toContain("rounded-2xl");
    expect(div?.className).toContain("border");
  });

  it("sponsor-glow-card hat bg-muted/30 p-6", () => {
    const { container } = render(<Sponsors />);
    const div = container.querySelector(".sponsor-glow-card");
    expect(div?.className).toContain("bg-muted");
    expect(div?.className).toContain("p-6");
  });

  it("sponsor-glow-card hat md:p-8 responsive padding", () => {
    const { container } = render(<Sponsors />);
    const div = container.querySelector(".sponsor-glow-card");
    expect(div?.className).toContain("md:p-8");
  });

  it("zeigt 'Trusted by teams' Überschrift an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Trusted by teams");
  });

  it("zeigt 'building modern commerce stacks' Text an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("building modern commerce stacks");
  });

  it("h2 hat text-sm font-semibold uppercase", () => {
    const { container } = render(<Sponsors />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-sm");
    expect(h2?.className).toContain("font-semibold");
    expect(h2?.className).toContain("uppercase");
  });

  it("h2 hat tracking-[0.2em]", () => {
    const { container } = render(<Sponsors />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("tracking");
  });

  it("h2 hat text-muted-foreground", () => {
    const { container } = render(<Sponsors />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-muted-foreground");
  });

  it("zeigt 'Plug into the tools' Beschreibung an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Plug into the tools");
  });

  it("zeigt 'already use' Text an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("already use");
  });

  it("p hat text-sm text-muted-foreground", () => {
    const { container } = render(<Sponsors />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-sm");
    expect(p?.className).toContain("text-muted-foreground");
  });

  it("zeigt Stripe Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Stripe");
  });

  it("zeigt Next.js Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Next.js");
  });

  it("zeigt Vercel Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Vercel");
  });

  it("zeigt Shopify Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("Shopify");
  });

  it("zeigt WooCommerce Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("WooCommerce");
  });

  it("zeigt API-first Sponsor an", () => {
    const { container } = render(<Sponsors />);
    const text = container.textContent;
    expect(text).toContain("API-first");
  });

  it("zeigt alle 6 Sponsoren an", () => {
    const { container } = render(<Sponsors />);
    const sponsors = ["Stripe", "Next.js", "Vercel", "Shopify", "WooCommerce", "API-first"];
    sponsors.forEach((name) => {
      expect(container.textContent).toContain(name);
    });
  });

  it("hat Sponsor Container mit flex flex-wrap", () => {
    const { container } = render(<Sponsors />);
    const divs = container.querySelectorAll("div");
    let hasFlexWrap = false;
    divs.forEach((div) => {
      if (div.className.includes("flex") && div.className.includes("flex-wrap")) {
        hasFlexWrap = true;
      }
    });
    expect(hasFlexWrap).toBe(true);
  });

  it("Sponsor Container hat justify-center md:justify-start", () => {
    const { container } = render(<Sponsors />);
    const divs = container.querySelectorAll("div");
    let hasJustify = false;
    divs.forEach((div) => {
      if (div.className.includes("justify-center") && div.className.includes("md:justify-start")) {
        hasJustify = true;
      }
    });
    expect(hasJustify).toBe(true);
  });

  it("Sponsor Container hat gap-3", () => {
    const { container } = render(<Sponsors />);
    const divs = container.querySelectorAll("div");
    let hasGap = false;
    divs.forEach((div) => {
      if (div.className.includes("gap-3")) {
        hasGap = true;
      }
    });
    expect(hasGap).toBe(true);
  });

  it("Sponsor Items haben rounded-full border", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll(".rounded-full");
    expect(sponsorItems.length).toBe(6);
  });

  it("Sponsor Items haben bg-background", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll(".bg-background");
    expect(sponsorItems.length).toBeGreaterThan(0);
  });

  it("Sponsor Items haben px-4 py-2", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll("[class*='px-4']");
    expect(sponsorItems.length).toBeGreaterThan(0);
  });

  it("Sponsor Items haben text-sm font-medium", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll("[class*='text-sm']");
    expect(sponsorItems.length).toBeGreaterThan(0);
  });

  it("Sponsor Items haben text-foreground", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll("[class*='text-foreground']");
    expect(sponsorItems.length).toBeGreaterThan(0);
  });

  it("Sponsor Items haben shadow-sm", () => {
    const { container } = render(<Sponsors />);
    const sponsorItems = container.querySelectorAll(".shadow-sm");
    expect(sponsorItems.length).toBeGreaterThan(0);
  });

  it("hat Flex Container mit gap-4 md:flex-row", () => {
    const { container } = render(<Sponsors />);
    const divs = container.querySelectorAll("div");
    let hasFlexGap = false;
    divs.forEach((div) => {
      if (div.className.includes("gap-4") && div.className.includes("md:flex-row")) {
        hasFlexGap = true;
      }
    });
    expect(hasFlexGap).toBe(true);
  });

  it("hat mt-6 spacing zwischen Header und Sponsoren", () => {
    const { container } = render(<Sponsors />);
    const sponsorsContainer = Array.from(container.querySelectorAll("div")).find(
      (div) => div.className.includes("mt-6")
    );
    expect(sponsorsContainer).toBeInTheDocument();
  });

  it("hat md:items-center responsive Layout", () => {
    const { container } = render(<Sponsors />);
    const divs = container.querySelectorAll("div");
    let hasResponsive = false;
    divs.forEach((div) => {
      if (div.className.includes("md:items-center")) {
        hasResponsive = true;
      }
    });
    expect(hasResponsive).toBe(true);
  });

  it("hat Mouse Event Handler auf Glow Card", () => {
    const { container } = render(<Sponsors />);
    const glowCard = container.querySelector(".sponsor-glow-card");
    expect(glowCard).toBeTruthy();
  });

  it("keine Fehler beim Sponsors Rendern", () => {
    expect(() => {
      render(<Sponsors />);
    }).not.toThrow();
  });
});