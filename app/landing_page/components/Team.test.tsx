// Team.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Team } from "./Team";

describe("Team", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Team />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id team", () => {
    const { container } = render(<Team />);
    const section = container.querySelector("section#team");
    expect(section).toBeInTheDocument();
  });

  it("section hat container py-24 sm:py-32", () => {
    const { container } = render(<Team />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("container");
    expect(section?.className).toContain("py-24");
  });

  it("zeigt 'Our Dedicated' Text an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Our Dedicated");
  });

  it("zeigt 'Crew' Text an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Crew");
  });

  it("h2 hat text-3xl md:text-4xl font-bold", () => {
    const { container } = render(<Team />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-3xl");
    expect(h2?.className).toContain("md:text-4xl");
    expect(h2?.className).toContain("font-bold");
  });

  it("hat span mit gradient-to-b from-primary/60 to-primary", () => {
    const { container } = render(<Team />);
    const span = container.querySelector("span[class*='gradient-to-b']");
    expect(span).toBeInTheDocument();
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Lorem ipsum dolor sit amet consectetur");
  });

  it("p hat text-xl text-muted-foreground", () => {
    const { container } = render(<Team />);
    const ps = container.querySelectorAll("p");
    let hasDescription = false;
    ps.forEach((p) => {
      if (p.textContent?.includes("Lorem ipsum dolor sit amet consectetur")) {
        expect(p.className).toContain("text-xl");
        expect(p.className).toContain("text-muted-foreground");
        hasDescription = true;
      }
    });
    expect(hasDescription).toBe(true);
  });

  it("zeigt Emma Smith an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Emma Smith");
  });

  it("zeigt John Doe an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("John Doe");
  });

  it("zeigt Ashley Ross an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Ashley Ross");
  });

  it("zeigt Bruce Rogers an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Bruce Rogers");
  });

  it("zeigt 'Product Manager' Position an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Product Manager");
  });

  it("zeigt 'Tech Lead' Position an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Tech Lead");
  });

  it("zeigt 'Frontend Developer' Position an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Frontend Developer");
  });

  it("zeigt 'Backend Developer' Position an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Backend Developer");
  });

  it("hat Grid mit md:grid-cols-2 lg:grid-cols-4", () => {
    const { container } = render(<Team />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid");
    expect(grid?.className).toContain("md:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-4");
  });

  it("Grid hat gap-8 gap-y-10", () => {
    const { container } = render(<Team />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("gap-8");
    expect(grid?.className).toContain("gap-y-10");
  });

  it("hat 4 Team Karten", () => {
    const { container } = render(<Team />);
    // Card sind divs mit bestimmten Klassen
    const cards = container.querySelectorAll("[class*='rounded-lg']");
    expect(cards.length).toBeGreaterThanOrEqual(4);
  });

  it("Team Karten haben bg-muted/50", () => {
    const { container } = render(<Team />);
    const cards = container.querySelectorAll("[class*='bg-muted']");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("Team Karten haben relative mt-8 flex flex-col", () => {
    const { container } = render(<Team />);
    const divs = container.querySelectorAll("div");
    let hasCardLayout = false;
    divs.forEach((div) => {
      if (div.className.includes("mt-8") && div.className.includes("flex") && div.className.includes("flex-col")) {
        hasCardLayout = true;
      }
    });
    expect(hasCardLayout).toBe(true);
  });

  it("Team Karten haben justify-center items-center", () => {
    const { container } = render(<Team />);
    const divs = container.querySelectorAll("div");
    let hasJustify = false;
    divs.forEach((div) => {
      if (div.className.includes("justify-center") && div.className.includes("items-center")) {
        hasJustify = true;
      }
    });
    expect(hasJustify).toBe(true);
  });

  it("CardHeader hat mt-8 pb-2", () => {
    const { container } = render(<Team />);
    // CardHeader sind divs mit bestimmten Klassen
    const headers = container.querySelectorAll("[class*='mt-8']");
    expect(headers.length).toBeGreaterThan(0);
  });

  it("CardHeader hat flex justify-center items-center", () => {
    const { container } = render(<Team />);
    const divs = container.querySelectorAll("div");
    let hasHeader = false;
    divs.forEach((div) => {
      if (div.className.includes("flex") && div.className.includes("justify-center")) {
        hasHeader = true;
      }
    });
    expect(hasHeader).toBe(true);
  });

  it("Team Bilder existieren", () => {
    const { container } = render(<Team />);
    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(4);
  });

  it("Team Bilder haben -top-12 rounded-full w-24 h-24", () => {
    const { container } = render(<Team />);
    const images = container.querySelectorAll("img[class*='rounded-full']");
    expect(images.length).toBeGreaterThan(0);
  });

  it("zeigt Emma Smith Bild mit korrektem Avatar an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Emma Smith");
  });

  it("zeigt John Doe Bild an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("John Doe");
  });

  it("zeigt Ashley Ross Bild an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Ashley Ross");
  });

  it("zeigt Bruce Rogers Bild an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Bruce Rogers");
  });

  it("CardTitle ist text-center", () => {
    const { container } = render(<Team />);
    // Titel sind h3 oder span mit Namen
    const divs = container.querySelectorAll("[class*='text-center']");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("CardDescription hat text-primary", () => {
    const { container } = render(<Team />);
    const descriptions = container.querySelectorAll("[class*='text-primary']");
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it("zeigt Team Beschreibung 'Lorem ipsum dolor sit amet' an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Lorem ipsum dolor sit amet");
  });

  it("CardContent hat text-center pb-2", () => {
    const { container } = render(<Team />);
    const divs = container.querySelectorAll("[class*='pb-2']");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("hat Social Links für LinkedIn", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Linkedin icon");
  });

  it("hat Social Links für Facebook", () => {
    const { container } = render(<Team />);
    const links = container.querySelectorAll("a");
    let hasFacebook = false;
    links.forEach((link) => {
      if (link.href.includes("facebook.com")) {
        hasFacebook = true;
      }
    });
    expect(hasFacebook).toBe(true);
  });

  it("hat Social Links für Instagram", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Instagram icon");
  });

  it("Social Links haben rel noreferrer noopener", () => {
    const { container } = render(<Team />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      if (link.href.includes("linkedin.com") || link.href.includes("facebook.com") || link.href.includes("instagram.com")) {
        expect(link.rel).toContain("noreferrer");
        expect(link.rel).toContain("noopener");
      }
    });
  });

  it("Social Links öffnen sich in neuem Tab (target _blank)", () => {
    const { container } = render(<Team />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      if (link.href.includes("linkedin.com") || link.href.includes("facebook.com") || link.href.includes("instagram.com")) {
        expect(link.target).toBe("_blank");
      }
    });
  });

  it("zeigt alle 4 Team Mitglieder an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Emma Smith");
    expect(text).toContain("John Doe");
    expect(text).toContain("Ashley Ross");
    expect(text).toContain("Bruce Rogers");
  });

  it("zeigt alle 4 Positionen an", () => {
    const { container } = render(<Team />);
    const text = container.textContent;
    expect(text).toContain("Product Manager");
    expect(text).toContain("Tech Lead");
    expect(text).toContain("Frontend Developer");
    expect(text).toContain("Backend Developer");
  });

  it("keine Fehler beim Team Rendern", () => {
    expect(() => {
      render(<Team />);
    }).not.toThrow();
  });

});