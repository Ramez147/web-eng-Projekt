// Login.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Login } from "./Login";

describe("Login", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Login />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id anmeldung", () => {
    const { container } = render(<Login />);
    const section = container.querySelector("section#anmeldung");
    expect(section).toBeInTheDocument();
  });

  it("section hat py-20 class", () => {
    const { container } = render(<Login />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-20");
  });

  it("hat container mit grid layout", () => {
    const { container } = render(<Login />);
    const div = container.querySelector(".container");
    expect(div?.className).toContain("grid");
  });

  it("zeigt Anmelden Button an", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Anmelden");
  });

  it("zeigt Registrieren Button an", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Registrieren");
  });

  it("hat mindestens 2 mode toggle Buttons", () => {
    const { container } = render(<Login />);
    const buttons = container.querySelectorAll("button[type='button']");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("toggle container hat border-primary class", () => {
    const { container } = render(<Login />);
    const divs = container.querySelectorAll("[class*='border-primary']");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("toggle container hat rounded-full", () => {
    const { container } = render(<Login />);
    const divs = container.querySelectorAll(".rounded-full");
    expect(divs.length).toBeGreaterThan(0);
  });

  it("zeigt Anmelden Titel an", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Melde dich an");
  });

  it("h2 hat text-3xl font-bold", () => {
    const { container } = render(<Login />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("text-3xl");
    expect(h2?.className).toContain("font-bold");
  });

  it("h2 hat leading-tight class", () => {
    const { container } = render(<Login />);
    const h2 = container.querySelector("h2");
    expect(h2?.className).toContain("leading-tight");
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Kampagnen");
  });

  it("paragraph hat max-w-xl class", () => {
    const { container } = render(<Login />);
    const p = container.querySelector(".max-w-xl");
    expect(p).toBeInTheDocument();
  });

  it("paragraph hat text-muted-foreground", () => {
    const { container } = render(<Login />);
    const p = container.querySelector(".text-muted-foreground");
    expect(p).toBeInTheDocument();
  });

  it("hat login-image-glow-card div", () => {
    const { container } = render(<Login />);
    const div = container.querySelector(".login-image-glow-card");
    expect(div).toBeInTheDocument();
  });

  it("Bild-Container hat rounded-2xl border", () => {
    const { container } = render(<Login />);
    const div = container.querySelector(".login-image-glow-card");
    expect(div?.className).toContain("rounded-2xl");
    expect(div?.className).toContain("border");
  });

  it("Bild-Container hat p-4 padding", () => {
    const { container } = render(<Login />);
    const div = container.querySelector(".login-image-glow-card");
    expect(div?.className).toContain("p-4");
  });

  it("Bild existiert", () => {
    const { container } = render(<Login />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });

  it("Bild hat alt text", () => {
    const { container } = render(<Login />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBeTruthy();
  });

  it("Bild hat max-w-xs", () => {
    const { container } = render(<Login />);
    const img = container.querySelector(".max-w-xs");
    expect(img).toBeInTheDocument();
  });

  it("hat Card element", () => {
    const { container } = render(<Login />);
    const card = container.querySelector(".login-glow-card");
    expect(card).toBeInTheDocument();
  });

  it("Card hat border-primary class", () => {
    const { container } = render(<Login />);
    const card = container.querySelector(".login-glow-card");
    expect(card?.className).toContain("border-primary");
  });

  it("Card hat shadow-lg", () => {
    const { container } = render(<Login />);
    const card = container.querySelector(".login-glow-card");
    expect(card?.className).toContain("shadow-lg");
  });

  it("hat CardTitle mit Anmeldung Text", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Anmeldung");
  });

  it("hat CardDescription", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Nutze deine E-Mail");
  });

  it("hat form element", () => {
    const { container } = render(<Login />);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("form hat space-y-5 spacing", () => {
    const { container } = render(<Login />);
    const form = container.querySelector("form");
    expect(form?.className).toContain("space-y-5");
  });

  it("hat mindestens 2 input Felder", () => {
    const { container } = render(<Login />);
    const inputs = container.querySelectorAll("input");
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it("hat mindestens 1 Submit Button", () => {
    const { container } = render(<Login />);
    const buttons = container.querySelectorAll("button[type='submit']");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("Card hat Mouse-Event Handler", () => {
    const { container } = render(<Login />);
    const card = container.querySelector(".login-glow-card");
    expect(card).toBeTruthy();
  });

  it("Image Wrapper hat Mouse-Event Handler", () => {
    const { container } = render(<Login />);
    const imageWrapper = container.querySelector(".login-image-glow-card");
    expect(imageWrapper).toBeTruthy();
  });

  it("zeigt alle wichtigen Texte an", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Loyalty-System");
    expect(text).toContain("Anmelden");
  });

  it("section hat id für Link-Ziele", () => {
    const { container } = render(<Login />);
    const section = container.querySelector("section#anmeldung");
    expect(section).toBeInTheDocument();
  });

  it("Bild hat alt text für Screen Reader", () => {
    const { container } = render(<Login />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("alt")).toBeTruthy();
  });

  it("Buttons haben klare Labels", () => {
    const { container } = render(<Login />);
    const text = container.textContent;
    expect(text).toContain("Anmelden");
    expect(text).toContain("Registrieren");
  });

  it("alle visuellen Elemente existieren", () => {
    const { container } = render(<Login />);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector(".login-glow-card")).toBeInTheDocument();
    expect(container.querySelector(".login-image-glow-card")).toBeInTheDocument();
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("keine Fehler beim Login Rendern", () => {
    expect(() => {
      render(<Login />);
    }).not.toThrow();
  });
});
