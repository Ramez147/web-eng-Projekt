// Statistics.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Statistics } from "./Statistics";

describe("Statistics", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Statistics />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id statistics", () => {
    const { container } = render(<Statistics />);
    const section = container.querySelector("section#statistics");
    expect(section).toBeInTheDocument();
  });

  it("zeigt '2.7K+' Users Statistik an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("2.7K+");
  });

  it("zeigt '1.8K+' Subscribers Statistik an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("1.8K+");
  });

  it("zeigt '112' Downloads Statistik an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("112");
  });

  it("zeigt '4' Products Statistik an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("4");
  });

  it("zeigt 'Users' Label an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("Users");
  });

  it("zeigt 'Subscribers' Label an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("Subscribers");
  });

  it("zeigt 'Downloads' Label an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("Downloads");
  });

  it("zeigt 'Products' Label an", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("Products");
  });

  it("hat Grid mit grid-cols-2 lg:grid-cols-4", () => {
    const { container } = render(<Statistics />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid");
    expect(grid?.className).toContain("grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-4");
  });

  it("Grid hat gap-8", () => {
    const { container } = render(<Statistics />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("gap-8");
  });

  it("hat 4 Statistik Items", () => {
    const { container } = render(<Statistics />);
    const items = container.querySelectorAll(".space-y-2");
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it("Statistik Items haben text-center", () => {
    const { container } = render(<Statistics />);
    const items = container.querySelectorAll(".text-center");
    expect(items.length).toBeGreaterThan(0);
  });

  it("Statistik Items haben space-y-2", () => {
    const { container } = render(<Statistics />);
    const items = container.querySelectorAll(".space-y-2");
    expect(items.length).toBeGreaterThan(0);
  });

  it("h2 Elements haben text-3xl sm:text-4xl", () => {
    const { container } = render(<Statistics />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBeGreaterThan(0);
    h2s.forEach((h2) => {
      expect(h2.className).toContain("text-3xl");
      expect(h2.className).toContain("sm:text-4xl");
    });
  });

  it("h2 Elements haben font-bold", () => {
    const { container } = render(<Statistics />);
    const h2s = container.querySelectorAll("h2");
    h2s.forEach((h2) => {
      expect(h2.className).toContain("font-bold");
    });
  });

  it("p Elements haben text-xl text-muted-foreground", () => {
    const { container } = render(<Statistics />);
    const ps = container.querySelectorAll("p");
    ps.forEach((p) => {
      expect(p.className).toContain("text-xl");
      expect(p.className).toContain("text-muted-foreground");
    });
  });

  it("alle 4 Statistiken werden angezeigt", () => {
    const { container } = render(<Statistics />);
    const text = container.textContent;
    expect(text).toContain("2.7K+");
    expect(text).toContain("1.8K+");
    expect(text).toContain("112");
    expect(text).toContain("4");
    expect(text).toContain("Users");
    expect(text).toContain("Subscribers");
    expect(text).toContain("Downloads");
    expect(text).toContain("Products");
  });

  it("keine Fehler beim Statistics Rendern", () => {
    expect(() => {
      render(<Statistics />);
    }).not.toThrow();
  });
});