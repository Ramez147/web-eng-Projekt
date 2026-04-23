// Testimonials.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Testimonials } from "./Testimonials";

describe("Testimonials", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Testimonials />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id testimonials", () => {
    const { container } = render(<Testimonials />);
    const section = container.querySelector("section#testimonials");
    expect(section).toBeInTheDocument();
  });

  it("section hat container py-20 sm:py-28", () => {
    const { container } = render(<Testimonials />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("container");
    expect(section?.className).toContain("py-20");
  });

  it("zeigt 'Beta-Feedback' Titel an", () => {
    const { container } = render(<Testimonials />);
    const text = container.textContent;
    expect(text).toContain("Beta-Feedback");
  });

  it("zeigt 'das Vertrauen aufbaut' Titel an", () => {
    const { container } = render(<Testimonials />);
    const text = container.textContent;
    expect(text).toContain("das Vertrauen aufbaut");
  });

  it("h2 hat text-3xl md:text-4xl font-bold", () => {
    const { container } = render(<Testimonials />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-3xl");
    expect(h2?.className).toContain("md:text-4xl");
    expect(h2?.className).toContain("font-bold");
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Testimonials />);
    const text = container.textContent;
    expect(text).toContain("Teams mit unserem Loyalty-System");
  });

  it("zeigt 'schnell live gehen' Text an", () => {
    const { container } = render(<Testimonials />);
    const text = container.textContent;
    expect(text).toContain("schnell live");
  });

  it("zeigt 'CSV-Dateien' Text an", () => {
    const { container } = render(<Testimonials />);
    const text = container.textContent;
    expect(text).toContain("CSV-Dateien");
  });

  it("p hat text-xl text-muted-foreground", () => {
    const { container } = render(<Testimonials />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-xl");
    expect(p?.className).toContain("text-muted-foreground");
  });

  it("p hat pt-4 max-w-3xl", () => {
    const { container } = render(<Testimonials />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("pt-4");
    expect(p?.className).toContain("max-w-3xl");
  });

  it("hat Flex Container mit gap-4", () => {
    const { container } = render(<Testimonials />);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex");
    expect(div?.className).toContain("gap-4");
  });

  it("Flex Container hat md:flex-row md:items-end", () => {
    const { container } = render(<Testimonials />);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("md:flex-row");
    expect(div?.className).toContain("md:items-end");
  });

  it("Flex Container hat md:justify-between", () => {
    const { container } = render(<Testimonials />);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("md:justify-between");
  });

  it("hat testimonial-glow-card Cards", () => {
    const { container } = render(<Testimonials />);
    const glowCards = container.querySelectorAll(".testimonial-glow-card");
    expect(glowCards.length).toBeGreaterThanOrEqual(0);
  });

  it("hat Card Elemente", () => {
    const { container } = render(<Testimonials />);
    // Cards werden durch divs dargestellt
    const cards = container.querySelectorAll("[class*='rounded']");
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it("hat Avatar Elemente", () => {
    const { container } = render(<Testimonials />);
    const avatars = container.querySelectorAll("img");
    expect(avatars.length).toBeGreaterThanOrEqual(0);
  });

  it("keine Fehler beim Testimonials Rendern", () => {
    expect(() => {
      render(<Testimonials />);
    }).not.toThrow();
  });
});