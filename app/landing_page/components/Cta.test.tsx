// Cta.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Cta } from "./Cta";

describe("Cta component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Cta />);
    expect(container).toBeTruthy();
  });

  it("section mit id cta wird angezeigt", () => {
    const { container } = render(<Cta />);
    const section = container.querySelector("section#cta");
    expect(section).toBeInTheDocument();
  });

  it("hauptheading wird angezeigt", () => {
    render(<Cta />);
    const heading = screen.getByText(/Bereit für mehr Umsatz/);
    expect(heading).toBeInTheDocument();
  });

  it("kundenbindung text im heading", () => {
    render(<Cta />);
    const heading = screen.getByText(/Kundenbindung/);
    expect(heading).toBeInTheDocument();
  });

  it("beschreibungstext wird angezeigt", () => {
    render(<Cta />);
    const text = screen.getByText(/Starte unverbindlich, teste die API/);
    expect(text).toBeInTheDocument();
  });

  it("button 'Jetzt unverbindlich testen' wird angezeigt", () => {
    render(<Cta />);
    const button = screen.getByText("Jetzt unverbindlich testen");
    expect(button).toBeInTheDocument();
  });

  it("button führt zu #anmeldung", () => {
    render(<Cta />);
    const link = screen.getByRole("link", { name: /Jetzt unverbindlich testen/ });
    expect(link).toHaveAttribute("href", "#anmeldung");
  });

  it("button 'Demo vereinbaren' wird angezeigt", () => {
    render(<Cta />);
    const button = screen.getByText("Demo vereinbaren");
    expect(button).toBeInTheDocument();
  });

  it("demo button führt zu /kontakt", () => {
    render(<Cta />);
    const link = screen.getByRole("link", { name: /Demo vereinbaren/ });
    expect(link).toHaveAttribute("href", "/kontakt");
  });

  it("cta container hat richtige classes", () => {
    const { container } = render(<Cta />);
    const ctaContainer = container.querySelector(".cta-laser-host");
    expect(ctaContainer).toBeInTheDocument();
    expect(ctaContainer).toHaveClass("border-primary/20");
  });

  it("section hat richtige background classes", () => {
    const { container } = render(<Cta />);
    const section = container.querySelector("section#cta");
    expect(section).toHaveClass("bg-muted/50");
    expect(section).toHaveClass("py-12");
  });

  it("zwei buttons sind vorhanden", () => {
    render(<Cta />);
    const buttons = screen.getAllByRole("link");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<Cta />);
    }).not.toThrow();
  });
});
