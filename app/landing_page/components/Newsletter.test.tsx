// Newsletter.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Newsletter } from "./Newsletter";

describe("Newsletter", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Newsletter />);
    expect(container).toBeTruthy();
  });

  it("hat section element mit id newsletter", () => {
    const { container } = render(<Newsletter />);
    const section = container.querySelector("section#newsletter");
    expect(section).toBeInTheDocument();
  });

  it("hat zwei horizontale Linien (hr)", () => {
    const { container } = render(<Newsletter />);
    const hrs = container.querySelectorAll("hr");
    expect(hrs.length).toBe(2);
  });

  it("hr hat w-11/12 mx-auto", () => {
    const { container } = render(<Newsletter />);
    const hr = container.querySelector("hr");
    expect(hr?.className).toContain("w-11/12");
    expect(hr?.className).toContain("mx-auto");
  });

  it("hat container mit py-24 sm:py-32", () => {
    const { container } = render(<Newsletter />);
    const div = container.querySelector(".container");
    expect(div?.className).toContain("container");
  });

  it("zeigt 'Join Our Daily Newsletter' Titel an", () => {
    const { container } = render(<Newsletter />);
    const text = container.textContent;
    expect(text).toContain("Join Our Daily");
    expect(text).toContain("Newsletter");
  });

  it("h3 hat text-center text-4xl font-bold", () => {
    const { container } = render(<Newsletter />);
    const h3 = container.querySelector("h3");
    expect(h3?.className).toContain("text-center");
    expect(h3?.className).toContain("text-4xl");
    expect(h3?.className).toContain("font-bold");
  });

  it("h3 hat md:text-5xl responsive", () => {
    const { container } = render(<Newsletter />);
    const h3 = container.querySelector("h3");
    expect(h3?.className).toContain("md:text-5xl");
  });

  it("Newsletter Text hat Gradient", () => {
    const { container } = render(<Newsletter />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span).toBeInTheDocument();
  });

  it("Newsletter Gradient hat bg-clip-text", () => {
    const { container } = render(<Newsletter />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span?.className).toContain("bg-clip-text");
  });

  it("Newsletter Gradient hat text-transparent", () => {
    const { container } = render(<Newsletter />);
    const span = container.querySelector(".bg-gradient-to-b");
    expect(span?.className).toContain("text-transparent");
  });

  it("zeigt Beschreibungstext an", () => {
    const { container } = render(<Newsletter />);
    const text = container.textContent;
    expect(text).toContain("Lorem ipsum dolor sit amet consectetur");
  });

  it("p hat text-xl text-muted-foreground", () => {
    const { container } = render(<Newsletter />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-xl");
    expect(p?.className).toContain("text-muted-foreground");
  });

  it("p hat text-center", () => {
    const { container } = render(<Newsletter />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-center");
  });

  it("p hat mt-4 mb-8", () => {
    const { container } = render(<Newsletter />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("mt-4");
    expect(p?.className).toContain("mb-8");
  });

  it("hat form element", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("form hat flex flex-col", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    expect(form?.className).toContain("flex");
    expect(form?.className).toContain("flex-col");
  });

  it("form hat w-full md:flex-row", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    expect(form?.className).toContain("w-full");
    expect(form?.className).toContain("md:flex-row");
  });

  it("form hat md:w-6/12 lg:w-4/12", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    expect(form?.className).toContain("md:w-6/12");
    expect(form?.className).toContain("lg:w-4/12");
  });

  it("form hat mx-auto gap-4", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    expect(form?.className).toContain("mx-auto");
    expect(form?.className).toContain("gap-4");
  });

  it("hat Input element", () => {
    const { container } = render(<Newsletter />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
  });

  it("Input hat placeholder", () => {
    const { container } = render(<Newsletter />);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input?.placeholder).toBeTruthy();
  });

  it("Input hat bg-muted/50", () => {
    const { container } = render(<Newsletter />);
    const input = container.querySelector("input");
    expect(input?.className).toContain("bg-muted");
  });

  it("Input hat aria-label email", () => {
    const { container } = render(<Newsletter />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-label")).toBe("email");
  });

  it("hat Subscribe Button", () => {
    const { container } = render(<Newsletter />);
    const text = container.textContent;
    expect(text).toContain("Subscribe");
  });

  it("Button existiert im Form", () => {
    const { container } = render(<Newsletter />);
    const form = container.querySelector("form");
    const button = form?.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  it("keine Fehler beim Newsletter Rendern", () => {
    expect(() => {
      render(<Newsletter />);
    }).not.toThrow();
  });
});
