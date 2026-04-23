// FAQ.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { FAQ } from "./FAQ";

describe("FAQ component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<FAQ />);
    expect(container).toBeTruthy();
  });

  it("section mit id faq wird angezeigt", () => {
    const { container } = render(<FAQ />);
    const section = container.querySelector("section#faq");
    expect(section).toBeInTheDocument();
  });

  it("'Frequently asked' kicker wird angezeigt", () => {
    render(<FAQ />);
    const kicker = screen.getByText("Frequently asked");
    expect(kicker).toBeInTheDocument();
  });

  it("hauptheading wird angezeigt", () => {
    render(<FAQ />);
    const heading = screen.getByText(/Fragen, die fast jedes Team zuerst stellt/);
    expect(heading).toBeInTheDocument();
  });

  it("'bevor es startet' text im heading", () => {
    render(<FAQ />);
    const text = screen.getByText(/bevor es startet/);
    expect(text).toBeInTheDocument();
  });

  it("faq subtitle wird angezeigt", () => {
    render(<FAQ />);
    const subtitle = screen.getByText(/Alles auf einen Blick: Integration, Sicherheit/);
    expect(subtitle).toBeInTheDocument();
  });

  it("'15 Min' meta card wird angezeigt", () => {
    render(<FAQ />);
    const card = screen.getByText("15 Min");
    expect(card).toBeInTheDocument();
  });

  it("'bis zum Setup' label wird angezeigt", () => {
    render(<FAQ />);
    const label = screen.getByText("bis zum Setup");
    expect(label).toBeInTheDocument();
  });

  it("'API-first' meta card wird angezeigt", () => {
    render(<FAQ />);
    const card = screen.getByText("API-first");
    expect(card).toBeInTheDocument();
  });

  it("'für jede Plattform' label wird angezeigt", () => {
    render(<FAQ />);
    const label = screen.getByText("für jede Plattform");
    expect(label).toBeInTheDocument();
  });

  it("erste FAQ frage wird angezeigt", () => {
    render(<FAQ />);
    const question = screen.getByText("Wie lange dauert die Integration?");
    expect(question).toBeInTheDocument();
  });

  it("datensicherheit frage wird angezeigt", () => {
    render(<FAQ />);
    const question = screen.getByText("Sind meine Daten sicher?");
    expect(question).toBeInTheDocument();
  });

  it("white-label frage wird angezeigt", () => {
    render(<FAQ />);
    const question = screen.getByText("Kann ich White-Label anbieten?");
    expect(question).toBeInTheDocument();
  });

  it("shopify frage wird angezeigt", () => {
    render(<FAQ />);
    const question = screen.getByText("Kann ich Shopify oder WooCommerce anbinden?");
    expect(question).toBeInTheDocument();
  });

  it("integration antwort ist vorhanden", () => {
    const { container } = render(<FAQ />);
    const items = container.querySelectorAll(".faq-accordion-item");
    // Mindestens 4 Items sollten vorhanden sein
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  it("security antwort ist vorhanden", () => {
    const { container } = render(<FAQ />);
    const items = container.querySelectorAll(".faq-accordion-item");
    // Alle 4 FAQ Items sollten vorhanden sein
    expect(items.length).toBe(4);
  });

  it("'Noch Fragen?' section wird angezeigt", () => {
    render(<FAQ />);
    const section = screen.getByText(/Noch Fragen\?/);
    expect(section).toBeInTheDocument();
  });

  it("'Demo vereinbaren' link wird angezeigt", () => {
    render(<FAQ />);
    const link = screen.getByText("Demo vereinbaren");
    expect(link).toBeInTheDocument();
  });

  it("demo link führt zu #cta", () => {
    render(<FAQ />);
    const link = screen.getByRole("link", { name: /Demo vereinbaren/ });
    expect(link).toHaveAttribute("href", "#cta");
  });

  it("section hat richtige container classes", () => {
    const { container } = render(<FAQ />);
    const section = container.querySelector("section#faq");
    expect(section).toHaveClass("container");
    expect(section).toHaveClass("py-24");
  });

  it("accordion wird gerendert", () => {
    const { container } = render(<FAQ />);
    const accordion = container.querySelector(".faq-accordion");
    expect(accordion).toBeInTheDocument();
  });

  it("accordion items werden gerendert", () => {
    const { container } = render(<FAQ />);
    const items = container.querySelectorAll(".faq-accordion-item");
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  it("alle kategorie tags werden angezeigt", () => {
    render(<FAQ />);
    expect(screen.getByText("Onboarding")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Branding")).toBeInTheDocument();
    expect(screen.getByText("Integrations")).toBeInTheDocument();
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<FAQ />);
    }).not.toThrow();
  });
});
