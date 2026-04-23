// About.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { About } from "./About";

describe("About component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<About />);
    expect(container).toBeTruthy();
  });

  it("section mit id about wird angezeigt", () => {
    const { container } = render(<About />);
    const section = container.querySelector("section#about");
    expect(section).toBeInTheDocument();
  });

  it("heading mit About Company wird angezeigt", () => {
    render(<About />);
    const heading = screen.getByText("Company");
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain("About");
  });

  it("beschreibungstext wird angezeigt", () => {
    render(<About />);
    const text = screen.getByText(/Lorem ipsum dolor sit amet/);
    expect(text).toBeInTheDocument();
  });

  it("bild element wird gerendert", () => {
    const { container } = render(<About />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
  });

  it("statistics komponente wird gerendert", () => {
    const { container } = render(<About />);
    // Überprüfe, dass mehrere Elemente im Container vorhanden sind
    const section = container.querySelector("section#about");
    expect(section?.children.length).toBeGreaterThan(0);
  });

  it("container hat richtige classes", () => {
    const { container } = render(<About />);
    const innerDiv = container.querySelector(".container");
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass("py-24");
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<About />);
    }).not.toThrow();
  });
});
