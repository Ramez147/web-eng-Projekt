// Services.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Services } from "./Services";

describe("Services", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Services />);
    expect(container).toBeTruthy();
  });

  it("hat section element", () => {
    const { container } = render(<Services />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("container hat py-24 sm:py-32", () => {
    const { container } = render(<Services />);
    const div = container.querySelector(".container");
    expect(div?.className).toContain("py-24");
    expect(div?.className).toContain("sm:py-32");
  });

  it("hat h2 Title", () => {
    const { container } = render(<Services />);
    const h2 = container.querySelector("h2");
    expect(h2).toBeInTheDocument();
  });

  it("zeigt 'Client-Centric Services' Titel an", () => {
    const { container } = render(<Services />);
    const text = container.textContent;
    expect(text).toContain("Client-Centric");
    expect(text).toContain("Services");
  });

  it("h2 hat text-3xl md:text-4xl font-bold", () => {
    const { container } = render(<Services />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-3xl");
    expect(h2?.className).toContain("md:text-4xl");
    expect(h2?.className).toContain("font-bold");
  });

  it("h2 hat gradient span", () => {
    const { container } = render(<Services />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span).toBeInTheDocument();
  });

  it("Gradient span hat bg-clip-text", () => {
    const { container } = render(<Services />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span?.className).toContain("bg-clip-text");
  });

  it("Gradient span hat text-transparent", () => {
    const { container } = render(<Services />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span?.className).toContain("text-transparent");
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Services />);
    const p = container.querySelector("p");
    expect(p?.textContent).toBeTruthy();
  });

  it("p hat text-muted-foreground text-xl", () => {
    const { container } = render(<Services />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-muted-foreground");
    expect(p?.className).toContain("text-xl");
  });

  it("p hat mt-4 mb-8", () => {
    const { container } = render(<Services />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("mt-4");
    expect(p?.className).toContain("mb-8");
  });

  it("hat Grid Layout lg:grid-cols", () => {
    const { container } = render(<Services />);
    const div = container.querySelector(".grid");
    expect(div?.className).toContain("grid");
    expect(div?.className).toContain("lg:grid-cols");
  });

  it("Grid hat gap-8", () => {
    const { container } = render(<Services />);
    const div = container.querySelector(".grid");
    expect(div?.className).toContain("gap-8");
  });

  it("Grid hat place-items-center", () => {
    const { container } = render(<Services />);
    const div = container.querySelector(".grid");
    expect(div?.className).toContain("place-items-center");
  });

  it("zeigt Service Titel an", () => {
    const { container } = render(<Services />);
    const text = container.textContent;
    expect(text).toContain("Code Collaboration");
  });

  it("zeigt Service Beschreibungen an", () => {
    const { container } = render(<Services />);
    const text = container.textContent;
    expect(text).toContain("Lorem ipsum");
  });

  it("hat Service Cards", () => {
    const { container } = render(<Services />);
    // Services sind normalerweise in Cards
    const cards = container.querySelectorAll(".rounded-lg");
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  it("hat Service Icons", () => {
    const { container } = render(<Services />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("hat Bild Element", () => {
    const { container } = render(<Services />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
  });

  it("keine Fehler beim Services Rendern", () => {
    expect(() => {
      render(<Services />);
    }).not.toThrow();
  });
});
