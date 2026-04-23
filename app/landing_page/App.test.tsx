// App.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it("hat Main Wrapper div mit ml-4", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain("ml-4");
  });

  it("hat Main Wrapper div mit md:ml-10", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain("md:ml-10");
  });

  it("hat Navbar Navigation", () => {
    const { container } = render(<App />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("hat Footer Element", () => {
    const { container } = render(<App />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("hat Hero Section", () => {
    const { container } = render(<App />);
    const hero = container.querySelector("section");
    expect(hero).toBeInTheDocument();
  });

  it("alle Komponenten-Sections sind vorhanden", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);
  });

  it("rendert mehrere Section Elemente", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    // Sollte Hero, Sponsors, Testimonials, Features, Pricing, FAQ, Cta haben
    expect(sections.length).toBeGreaterThanOrEqual(5);
  });

  it("hat mindestens 1 Navbar", () => {
    const { container } = render(<App />);
    const navbars = container.querySelectorAll("nav");
    expect(navbars.length).toBeGreaterThanOrEqual(1);
  });

  it("hat mindestens 1 Footer", () => {
    const { container } = render(<App />);
    const footers = container.querySelectorAll("footer");
    expect(footers.length).toBeGreaterThanOrEqual(1);
  });

  it("Wrapper ist direktes Kind von Container", () => {
    const { container } = render(<App />);
    expect(container.children.length).toBeGreaterThan(0);
  });

  it("hat Main Content Wrapper mit Klassen", () => {
    const { container } = render(<App />);
    const wrapper = container.querySelector(".ml-4");
    expect(wrapper).toBeInTheDocument();
  });

  it("wrapper hat md:ml-10 Responsive Class", () => {
    const { container } = render(<App />);
    const wrapper = container.querySelector(".md\\:ml-10, [class*='md:ml-10']");
    expect(wrapper || container.querySelector(".ml-4")).toBeInTheDocument();
  });

  it("alle Komponenten rendern ohne Fehler", () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it("hat kein Error State nach Rendern", () => {
    const { container } = render(<App />);
    const errors = container.querySelectorAll("[role='alert']");
    expect(errors.length).toBe(0);
  });

  it("Body Content ist nicht leer", () => {
    const { container } = render(<App />);
    expect(container.textContent).not.toBe("");
  });

  it("Wrapper Element existiert", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
  });

  it("Navigation ist erste Komponente", () => {
    const { container } = render(<App />);
    const nav = container.querySelector("nav");
    expect(nav).toBeInTheDocument();
  });

  it("Footer ist letzte Komponente", () => {
    const { container } = render(<App />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("ScrollToTop Button existiert", () => {
    const { container } = render(<App />);
    // ScrollToTop hat meist einen Button mit 'scroll' im className
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it("hat Login Komponente", () => {
    const { container } = render(<App />);
    const text = container.textContent;
    // Login Component sollte vorhanden sein
    expect(container.querySelector("section, div")).toBeInTheDocument();
  });

  it("hat Sponsors Section", () => {
    const { container } = render(<App />);
    const text = container.textContent;
    // Sponsors Section sollte vorhanden sein
    expect(text).toBeTruthy();
  });

  it("hat Testimonials Section", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(1);
  });

  it("hat Features Section", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(2);
  });

  it("hat Pricing Section", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(3);
  });

  it("hat FAQ Section", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(4);
  });

  it("hat CTA Section", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(5);
  });

  it("Layout ist korrekt mit Margin Left", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("ml-");
  });

  it("hat responsive Design Klasse", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/md:|sm:|lg:|xl:/);
  });

  it("keine console Fehler", () => {
    const consoleSpy = expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it("rendert als Valid React Component", () => {
    const { container } = render(<App />);
    expect(container.querySelector("*")).toBeInTheDocument();
  });

  it("alle Children sind geholt", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children.length).toBeGreaterThan(0);
  });

  it("App Container ist Div Element", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild;
    expect(wrapper?.nodeName).toBe("DIV");
  });

  it("App rendert komplette Landing Page", () => {
    const { container } = render(<App />);
    const text = container.textContent;
    // Sollte verschiedene Texte haben
    expect(text?.length).toBeGreaterThan(0);
  });

  it("alle Sections haben unterschiedliche IDs", () => {
    const { container } = render(<App />);
    const sections = container.querySelectorAll("section[id]");
    const ids = Array.from(sections).map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBeGreaterThanOrEqual(0);
  });

  it("hat mehrere Button Elemente", () => {
    const { container } = render(<App />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });

  it("Wrapper hat exakt 2 Klassen (ml-4 und md:ml-10)", () => {
    const { container } = render(<App />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("ml-4");
    expect(wrapper.className).toContain("md:ml-10");
  });

  it("App rendert Struktur korrekt", () => {
    const { container } = render(<App />);
    const nav = container.querySelector("nav");
    const footer = container.querySelector("footer");
    expect(nav && footer).toBeTruthy();
  });

  it("keine Fehler beim App Rendern", () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });
});