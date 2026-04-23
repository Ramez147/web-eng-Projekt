// Features.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Features } from "./Features";

describe("Features component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Features />);
    expect(container).toBeTruthy();
  });

  it("section mit id features wird angezeigt", () => {
    const { container } = render(<Features />);
    const section = container.querySelector("section#features");
    expect(section).toBeInTheDocument();
  });

  it("hauptheading wird angezeigt", () => {
    render(<Features />);
    const heading = screen.getByText(/Loyalty-Features, die/);
    expect(heading).toBeInTheDocument();
  });

  it("'Umsatz und Wiederkäufe' text im heading", () => {
    render(<Features />);
    const text = screen.getByText(/Umsatz und Wiederkäufe/);
    expect(text).toBeInTheDocument();
  });

  it("feature titel 'Flexibles Punktesystem' wird angezeigt", () => {
    render(<Features />);
    const title = screen.getByText("Flexibles Punktesystem");
    expect(title).toBeInTheDocument();
  });

  it("feature titel 'Einfache Integration via API' wird angezeigt", () => {
    render(<Features />);
    const title = screen.getByText("Einfache Integration via API");
    expect(title).toBeInTheDocument();
  });

  it("feature titel 'Echtzeit-Analytics' wird angezeigt", () => {
    render(<Features />);
    const title = screen.getByText("Echtzeit-Analytics");
    expect(title).toBeInTheDocument();
  });

  it("feature beschreibung flexibles punktesystem wird angezeigt", () => {
    render(<Features />);
    const description = screen.getByText(/Du bestimmst die Regeln/);
    expect(description).toBeInTheDocument();
  });

  it("feature punkte 'Regeln pro Brand' werden angezeigt", () => {
    render(<Features />);
    const point = screen.getByText("Regeln pro Brand");
    expect(point).toBeInTheDocument();
  });

  it("feature punkte 'VIP-Tiers' werden angezeigt", () => {
    render(<Features />);
    const point = screen.getByText("VIP-Tiers");
    expect(point).toBeInTheDocument();
  });

  it("feature punkte 'REST API' werden angezeigt", () => {
    render(<Features />);
    const points = screen.getAllByText("REST API");
    expect(points.length).toBeGreaterThan(0);
  });

  it("feature liste badges werden angezeigt", () => {
    render(<Features />);
    const badges = screen.getAllByText("Punkte & Rewards");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("'White-label' badge wird angezeigt", () => {
    render(<Features />);
    const badges = screen.getAllByText("White-label");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("'GDPR Ready' badge wird angezeigt", () => {
    render(<Features />);
    const badges = screen.getAllByText("GDPR Ready");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("'A/B Kampagnen' badge wird angezeigt", () => {
    render(<Features />);
    const badges = screen.getAllByText("A/B Kampagnen");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("feature cards werden gerendert", () => {
    const { container } = render(<Features />);
    const cards = container.querySelectorAll(".feature-glow-card");
    expect(cards.length).toBe(3);
  });

  it("jede feature card hat richtige struktur", () => {
    const { container } = render(<Features />);
    const cards = container.querySelectorAll(".feature-glow-card");
    cards.forEach((card) => {
      const title = card.querySelector("h3");
      const content = card.querySelector('[class*="CardContent"]');
      expect(title || content).toBeTruthy();
    });
  });

  it("liste items in feature cards", () => {
    const { container } = render(<Features />);
    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBeGreaterThanOrEqual(9); // 3 features * 3 points
  });

  it("marquee container wird gerendert", () => {
    const { container } = render(<Features />);
    const marquee = container.querySelector(".feature-marquee");
    expect(marquee).toBeInTheDocument();
  });

  it("marquee track mit badges", () => {
    const { container } = render(<Features />);
    const track = container.querySelector(".feature-marquee-track");
    expect(track).toBeInTheDocument();
  });

  it("section hat richtige classes", () => {
    const { container } = render(<Features />);
    const section = container.querySelector("section#features");
    expect(section).toHaveClass("container");
    expect(section).toHaveClass("py-24");
  });

  it("feature glow effekt elemente vorhanden", () => {
    const { container } = render(<Features />);
    const card1 = container.querySelector(".feature-glow-1");
    const card2 = container.querySelector(".feature-glow-2");
    const card3 = container.querySelector(".feature-glow-3");
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();
    expect(card3).toBeInTheDocument();
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<Features />);
    }).not.toThrow();
  });
});
