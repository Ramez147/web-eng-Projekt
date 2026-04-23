// HeroCards.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HeroCards } from "./HeroCards";

describe("HeroCards component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<HeroCards />);
    expect(container).toBeTruthy();
  });

  it("main container wird angezeigt", () => {
    const { container } = render(<HeroCards />);
    const wrapper = container.querySelector("div.hidden.lg\\:flex");
    expect(wrapper).toBeInTheDocument();
  });

  it("alle 3 karten werden gerendert", () => {
    render(<HeroCards />);
    // Überprüfe die 3 Haupt-Titel der Karten
    expect(screen.getByText("Live Loyalty Overview")).toBeInTheDocument();
    expect(screen.getByText("Campaign Engine")).toBeInTheDocument();
    expect(screen.getByText("Echtzeit-Analytics")).toBeInTheDocument();
  });

  it("'Live Loyalty Overview' card wird angezeigt", () => {
    render(<HeroCards />);
    const title = screen.getByText("Live Loyalty Overview");
    expect(title).toBeInTheDocument();
  });

  it("'points.flow' beschreibung wird angezeigt", () => {
    render(<HeroCards />);
    const description = screen.getByText("points.flow / customers.segmented");
    expect(description).toBeInTheDocument();
  });

  it("'Points issued today' text wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText("Points issued today");
    expect(text).toBeInTheDocument();
  });

  it("'+4,820' punkte werden angezeigt", () => {
    render(<HeroCards />);
    const points = screen.getByText("+4,820");
    expect(points).toBeInTheDocument();
  });

  it("reward rules synced text wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText(/Reward rules synced from your API/);
    expect(text).toBeInTheDocument();
  });

  it("'Campaign Engine' card wird angezeigt", () => {
    render(<HeroCards />);
    const title = screen.getByText("Campaign Engine");
    expect(title).toBeInTheDocument();
  });

  it("'Live' badge wird angezeigt", () => {
    render(<HeroCards />);
    const badge = screen.getByText("Live");
    expect(badge).toBeInTheDocument();
  });

  it("'1€ = 1 Punkt' wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText("1€ = 1 Punkt");
    expect(text).toBeInTheDocument();
  });

  it("campaign beschreibung wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText(/Passe Regeln, Trigger und Belohnungen an/);
    expect(text).toBeInTheDocument();
  });

  it("button 'Regel-Engine öffnen' wird angezeigt", () => {
    render(<HeroCards />);
    const button = screen.getByText("Regel-Engine öffnen");
    expect(button).toBeInTheDocument();
  });

  it("'Tiered rewards for VIP customers' benefit wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText("Tiered rewards for VIP customers");
    expect(text).toBeInTheDocument();
  });

  it("'Promo codes and campaigns in one place' benefit wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText("Promo codes and campaigns in one place");
    expect(text).toBeInTheDocument();
  });

  it("'Segments updated in real time' benefit wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText("Segments updated in real time");
    expect(text).toBeInTheDocument();
  });

  it("'Echtzeit-Analytics' card wird angezeigt", () => {
    render(<HeroCards />);
    const title = screen.getByText("Echtzeit-Analytics");
    expect(title).toBeInTheDocument();
  });

  it("analytics beschreibung wird angezeigt", () => {
    render(<HeroCards />);
    const text = screen.getByText(/Sieh sofort, welche Kampagnen Umsatz bringen/);
    expect(text).toBeInTheDocument();
  });

  it("avatar fallback wird angezeigt", () => {
    render(<HeroCards />);
    const fallback = screen.getByText("SH");
    expect(fallback).toBeInTheDocument();
  });

  it("cards element wird gerendert", () => {
    const { container } = render(<HeroCards />);
    const wrapper = container.querySelector("div");
    expect(wrapper).toBeInTheDocument();
  });

  it("cards haben absolute positioning", () => {
    const { container } = render(<HeroCards />);
    const cards = container.querySelectorAll(".absolute");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("cards haben drop-shadow-xl", () => {
    const { container } = render(<HeroCards />);
    const cards = container.querySelectorAll(".drop-shadow-xl");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("container hat richtige größe", () => {
    const { container } = render(<HeroCards />);
    const wrapper = container.querySelector("div[class*='w-\\[700px\\]']");
    expect(wrapper).toBeInTheDocument();
  });

  it("flex row layout wird angewendet", () => {
    const { container } = render(<HeroCards />);
    const wrapper = container.querySelector(".flex-row");
    expect(wrapper).toBeInTheDocument();
  });

  it("gap-8 wird angewendet", () => {
    const { container } = render(<HeroCards />);
    const wrapper = container.querySelector(".gap-8");
    expect(wrapper).toBeInTheDocument();
  });

  it("all benefits sind vorhanden", () => {
    render(<HeroCards />);
    expect(screen.getByText("Tiered rewards for VIP customers")).toBeInTheDocument();
    expect(screen.getByText("Promo codes and campaigns in one place")).toBeInTheDocument();
    expect(screen.getByText("Segments updated in real time")).toBeInTheDocument();
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<HeroCards />);
    }).not.toThrow();
  });
});
