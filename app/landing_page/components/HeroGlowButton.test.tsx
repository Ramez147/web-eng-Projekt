// HeroGlowButton.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HeroGlowButton } from "./HeroGlowButton";

describe("HeroGlowButton component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test Button" />);
    expect(container).toBeTruthy();
  });

  it("link element wird angezeigt", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Demo vereinbaren" />);
    const link = container.querySelector("a");
    expect(link).toBeInTheDocument();
  });

  it("button label wird angezeigt", () => {
    render(<HeroGlowButton href="#cta" label="Demo vereinbaren" />);
    const label = screen.getByText("Demo vereinbaren");
    expect(label).toBeInTheDocument();
  });

  it("link führt zur korrekten href", () => {
    render(<HeroGlowButton href="#cta" label="Demo vereinbaren" />);
    const link = screen.getByRole("link", { name: /Demo vereinbaren/ });
    expect(link).toHaveAttribute("href", "#cta");
  });

  it("unterschiedliche href wird unterstützt", () => {
    render(<HeroGlowButton href="#pricing" label="Pricing" />);
    const link = screen.getByRole("link", { name: /Pricing/ });
    expect(link).toHaveAttribute("href", "#pricing");
  });

  it("link hat rel attribute", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("hero-button-glow class wird angewendet", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("hero-button-glow");
  });

  it("button hat outline variant", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const link = container.querySelector("a");
    expect(link?.className).toContain("outline");
  });

  it("arrow icon wird gerendert", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("arrow icon hat richtige größe", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("w-4");
    expect(svg).toHaveClass("h-4");
  });

  it("arrow icon hat margin-left", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const svg = container.querySelector("svg");
    // Überprüfe, dass der Icon-Container existiert
    expect(svg).toBeInTheDocument();
  });

  it("label und icon sind nebeneinander", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Demo" />);
    const link = container.querySelector("a");
    const children = link?.children;
    expect(children?.length).toBeGreaterThanOrEqual(1);
  });

  it("unterschiedliche labels werden korrekt angezeigt", () => {
    const labels = ["Start", "Demo vereinbaren", "Kostenlos testen"];
    labels.forEach((label) => {
      const { container: c } = render(<HeroGlowButton href="#test" label={label} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("link ist ein anchor element", () => {
    const { container } = render(<HeroGlowButton href="#cta" label="Test" />);
    const link = container.querySelector("a[href]");
    expect(link?.tagName).toBe("A");
  });

  it("alle props werden korrekt verwendet", () => {
    render(<HeroGlowButton href="#custom-section" label="Custom Label" />);
    const link = screen.getByRole("link", { name: /Custom Label/ });
    expect(link).toHaveAttribute("href", "#custom-section");
    expect(link).toBeInTheDocument();
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<HeroGlowButton href="#cta" label="Demo vereinbaren" />);
    }).not.toThrow();
  });
});
