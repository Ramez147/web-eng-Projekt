// Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Hero } from "./Hero";

describe("Hero component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Hero />);
    expect(container).toBeTruthy();
  });

  it("section wird angezeigt", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section.container");
    expect(section).toBeInTheDocument();
  });

  it("badge 'SaaS Loyalty Platform für moderne Marken' wird angezeigt", () => {
    render(<Hero />);
    const badge = screen.getByText("SaaS Loyalty Platform für moderne Marken");
    expect(badge).toBeInTheDocument();
  });

  it("hauptheading 'Verwandle Einmalkunden' wird angezeigt", () => {
    render(<Hero />);
    const heading = screen.getByText("Verwandle Einmalkunden");
    expect(heading).toBeInTheDocument();
  });

  it("'in echte Fans' text wird angezeigt", () => {
    render(<Hero />);
    const text = screen.getByText(/in echte Fans/);
    expect(text).toBeInTheDocument();
  });

  it("'vollautomatisch' text wird angezeigt", () => {
    render(<Hero />);
    const text = screen.getByText("vollautomatisch.");
    expect(text).toBeInTheDocument();
  });

  it("beschreibungstext wird angezeigt", () => {
    render(<Hero />);
    const description = screen.getByText(/Das Loyalty-System für moderne Unternehmen/);
    expect(description).toBeInTheDocument();
  });

  it("button 'Kostenlos starten' wird angezeigt", () => {
    render(<Hero />);
    const button = screen.getByText("Kostenlos starten");
    expect(button).toBeInTheDocument();
  });

  it("button 'Demo vereinbaren' wird angezeigt", () => {
    render(<Hero />);
    const button = screen.getByText("Demo vereinbaren");
    expect(button).toBeInTheDocument();
  });

  it("demo button führt zu #cta", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /Demo vereinbaren/ });
    expect(link).toHaveAttribute("href", "#cta");
  });

  it("main element mit h1 wird angezeigt", () => {
    const { container } = render(<Hero />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
  });

  it("h1 heading wird angezeigt", () => {
    const { container } = render(<Hero />);
    const h1 = container.querySelector("h1");
    expect(h1).toBeInTheDocument();
  });

  it("hero cards komponente wird gerendert", () => {
    const { container } = render(<Hero />);
    // HeroCards sollte vorhanden sein (checke ob die Komponente gerendert wurde)
    const section = container.querySelector("section.container");
    expect(section?.children.length).toBeGreaterThan(0);
  });

  it("grid layout wird angewendet", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("grid");
    expect(section).toHaveClass("lg:grid-cols-2");
  });

  it("badge hat primary border", () => {
    const { container } = render(<Hero />);
    const badge = container.querySelector("div[class*='border-primary']");
    expect(badge).toBeInTheDocument();
  });

  it("beschreibung text breite ist korrekt", () => {
    const { container } = render(<Hero />);
    const description = container.querySelector("p.text-xl");
    expect(description).toHaveClass("md:w-10/12");
  });

  it("buttons container hat flex layout", () => {
    const { container } = render(<Hero />);
    const buttonsContainer = container.querySelector(".flex[class*='flex-col']");
    expect(buttonsContainer).toBeInTheDocument();
  });

  it("shadow element wird gerendert", () => {
    const { container } = render(<Hero />);
    const shadow = container.querySelector(".shadow");
    expect(shadow).toBeInTheDocument();
  });

  it("section hat overflow-hidden", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("overflow-hidden");
  });

  it("section hat padding y", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-20");
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<Hero />);
    }).not.toThrow();
  });
});
