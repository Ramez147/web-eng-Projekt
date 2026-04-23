// HowItWorks.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<HowItWorks />);
    expect(container).toBeTruthy();
  });

  it("section mit id howItWorks wird angezeigt", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section#howItWorks");
    expect(section).toBeInTheDocument();
  });

  it("hauptheading 'How It' wird angezeigt", () => {
    render(<HowItWorks />);
    const heading = screen.getByText(/How It/);
    expect(heading).toBeInTheDocument();
  });

  it("'Works' text im heading wird angezeigt", () => {
    render(<HowItWorks />);
    const text = screen.getByText(/Works/);
    expect(text).toBeInTheDocument();
  });

  it("'Step-by-Step Guide' wird angezeigt", () => {
    render(<HowItWorks />);
    const text = screen.getByText(/Step-by-Step Guide/);
    expect(text).toBeInTheDocument();
  });

  it("beschreibungstext wird angezeigt", () => {
    render(<HowItWorks />);
    const description = screen.getByText(/Lorem ipsum dolor sit amet consectetur/);
    expect(description).toBeInTheDocument();
  });

  it("feature titel 'Accessibility' wird angezeigt", () => {
    render(<HowItWorks />);
    const title = screen.getByText("Accessibility");
    expect(title).toBeInTheDocument();
  });

  it("feature titel 'Community' wird angezeigt", () => {
    render(<HowItWorks />);
    const title = screen.getByText("Community");
    expect(title).toBeInTheDocument();
  });

  it("feature titel 'Scalability' wird angezeigt", () => {
    render(<HowItWorks />);
    const title = screen.getByText("Scalability");
    expect(title).toBeInTheDocument();
  });

  it("feature titel 'Gamification' wird angezeigt", () => {
    render(<HowItWorks />);
    const title = screen.getByText("Gamification");
    expect(title).toBeInTheDocument();
  });

  it("alle 4 features werden angezeigt", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Scalability")).toBeInTheDocument();
    expect(screen.getByText("Gamification")).toBeInTheDocument();
  });

  it("feature beschreibungen werden angezeigt", () => {
    render(<HowItWorks />);
    const descriptions = screen.getAllByText(/Lorem ipsum dolor sit amet, consectetur adipisicing elit/);
    expect(descriptions.length).toBeGreaterThanOrEqual(4);
  });

  it("feature cards werden gerendert", () => {
    render(<HowItWorks />);
    // Überprüfe, dass alle 4 Titel in den Karten vorhanden sind
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("Community")).toBeInTheDocument();
    expect(screen.getByText("Scalability")).toBeInTheDocument();
    expect(screen.getByText("Gamification")).toBeInTheDocument();
  });

  it("grid layout wird angewendet", () => {
    const { container } = render(<HowItWorks />);
    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("grid-cols-1");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });

  it("section hat text-center class", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("text-center");
  });

  it("section hat container class", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("container");
  });

  it("section hat padding y", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-24");
  });

  it("heading hat font-bold", () => {
    const { container } = render(<HowItWorks />);
    const heading = container.querySelector("h2");
    expect(heading).toHaveClass("font-bold");
  });

  it("beschreibung hat max-width", () => {
    const { container } = render(<HowItWorks />);
    const description = container.querySelector("p");
    expect(description).toHaveClass("md:w-3/4");
  });

  it("gap-8 wird auf das grid angewendet", () => {
    const { container } = render(<HowItWorks />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("gap-8");
  });

  it("cards haben bg-muted/50 class", () => {
    const { container } = render(<HowItWorks />);
    const cards = container.querySelectorAll("[class*='bg-muted']");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("card titles haben grid layout", () => {
    const { container } = render(<HowItWorks />);
    const titles = container.querySelectorAll(".grid");
    expect(titles.length).toBeGreaterThan(0);
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<HowItWorks />);
    }).not.toThrow();
  });
});
