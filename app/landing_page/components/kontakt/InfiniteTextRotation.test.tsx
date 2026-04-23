// InfiniteTextRotation.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { InfiniteTextRotation } from "./InfiniteTextRotation";

describe("InfiniteTextRotation", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<InfiniteTextRotation />);
    expect(container).toBeTruthy();
  });

  it("hat section element", () => {
    const { container } = render(<InfiniteTextRotation />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("section hat full width", () => {
    const { container } = render(<InfiniteTextRotation />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("w-full");
  });

  it("rendert h2 heading", () => {
    const { container } = render(<InfiniteTextRotation />);
    const heading = container.querySelector("h2");
    expect(heading).toBeInTheDocument();
  });

  it("h2 hat text-3xl class", () => {
    const { container } = render(<InfiniteTextRotation />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("text-3xl");
  });

  it("h2 hat font-black class", () => {
    const { container } = render(<InfiniteTextRotation />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("font-black");
  });

  it("zeigt 'The perfect choice for any' Text", () => {
    const { container } = render(<InfiniteTextRotation />);
    const text = container.textContent;
    expect(text).toContain("The perfect choice for any");
  });

  it("rendert rotating words span", () => {
    const { container } = render(<InfiniteTextRotation />);
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThan(0);
  });

  it("hat infinite-rotating-word spans mit animation", () => {
    const { container } = render(<InfiniteTextRotation />);
    const rotatingSpans = container.querySelectorAll(".infinite-rotating-word");
    expect(rotatingSpans.length).toBe(4); // creator, maker, creative, visionary
  });

  it("p tag mit description text existiert", () => {
    const { container } = render(<InfiniteTextRotation />);
    const paragraph = container.querySelector("p");
    expect(paragraph).toBeInTheDocument();
  });

  it("paragraph hat 'Built for ambitious teams' Text", () => {
    const { container } = render(<InfiniteTextRotation />);
    const text = container.textContent;
    expect(text).toContain("Built for ambitious teams");
  });

  it("paragraph hat text-sm class", () => {
    const { container } = render(<InfiniteTextRotation />);
    const paragraph = container.querySelector("p");
    expect(paragraph?.className).toContain("text-sm");
  });

  it("paragraph hat text-muted-foreground class", () => {
    const { container } = render(<InfiniteTextRotation />);
    const paragraph = container.querySelector("p");
    expect(paragraph?.className).toContain("text-muted-foreground");
  });

  it("rotating spans haben animation delay", () => {
    const { container } = render(<InfiniteTextRotation />);
    const spans = container.querySelectorAll(".infinite-rotating-word");
    spans.forEach((span, index) => {
      const style = (span as HTMLElement).style.animationDelay;
      expect(style).toBeDefined();
    });
  });

  it("h2 hat flex und flex-wrap classes", () => {
    const { container } = render(<InfiniteTextRotation />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("flex");
    expect(heading?.className).toContain("flex-wrap");
  });

  it("inline flex span mit overflow-hidden existiert", () => {
    const { container } = render(<InfiniteTextRotation />);
    const inlineSpan = container.querySelector(".overflow-hidden");
    expect(inlineSpan).toBeInTheDocument();
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<InfiniteTextRotation />);
    }).not.toThrow();
  });
});
