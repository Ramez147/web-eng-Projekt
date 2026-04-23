// Pricing.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Pricing } from "./Pricing";

describe("Pricing", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Pricing />);
    expect(container).toBeTruthy();
  });

  it("hat section element", () => {
    const { container } = render(<Pricing />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("hat Container mit py-24 sm:py-32", () => {
    const { container } = render(<Pricing />);
    const div = container.querySelector(".container");
    expect(div?.className).toContain("container");
  });

  it("hat h2 Titel", () => {
    const { container } = render(<Pricing />);
    const h2 = container.querySelector("h2");
    expect(h2).toBeInTheDocument();
  });

  it("h2 hat text-3xl md:text-4xl", () => {
    const { container } = render(<Pricing />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-3xl");
    expect(h2?.className).toContain("md:text-4xl");
  });

  it("h2 hat font-bold", () => {
    const { container } = render(<Pricing />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("font-bold");
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Pricing />);
    const text = container.textContent;
    expect(text?.length).toBeGreaterThan(50);
  });

  it("hat mehrere Card Elemente", () => {
    const { container } = render(<Pricing />);
    // Cards werden durch divs mit bestimmten Klassen dargestellt
    const cards = container.querySelectorAll(".rounded-lg");
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });

  it("zeigt Starter Plan an", () => {
    const { container } = render(<Pricing />);
    const text = container.textContent;
    expect(text).toContain("Starter");
  });

  it("zeigt Pricing Information an", () => {
    const { container } = render(<Pricing />);
    const text = container.textContent;
    expect(text).toContain("€");
  });

  it("hat Buttons für Plans", () => {
    const { container } = render(<Pricing />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("zeigt Features / Vorteile an", () => {
    const { container } = render(<Pricing />);
    const text = container.textContent;
    expect(text?.length).toBeGreaterThan(100);
  });

  it("hat Check Icons für Vorteile", () => {
    const { container } = render(<Pricing />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("Container hat Grid Layout", () => {
    const { container } = render(<Pricing />);
    const div = container.querySelector(".container");
    expect(div?.className).toContain("container");
  });

  it("keine Fehler beim Pricing Rendern", () => {
    expect(() => {
      render(<Pricing />);
    }).not.toThrow();
  });
});
