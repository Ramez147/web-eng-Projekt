import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { TrendingUpIcon } from "./icons";

describe("TrendingUpIcon", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<TrendingUpIcon />);
    expect(container).toBeTruthy();
  });

  it("rendert SVG Element", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("hat viewBox='0 0 24 24'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("hat fill='none'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("fill")).toBe("none");
  });

  it("hat stroke='currentColor'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
  });

  it("hat strokeWidth='2'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke-width")).toBe("2");
  });

  it("hat strokeLinecap='round'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke-linecap")).toBe("round");
  });

  it("hat strokeLinejoin='round'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke-linejoin")).toBe("round");
  });

  it("hat aria-hidden='true'", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("rendert 2 Path Elemente", () => {
    const { container } = render(<TrendingUpIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

  it("erstes Path hat korrektes d Attribut", () => {
    const { container } = render(<TrendingUpIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths[0].getAttribute("d")).toBe("M3 17l6-6 4 4 7-7");
  });

  it("zweites Path hat korrektes d Attribut", () => {
    const { container } = render(<TrendingUpIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths[1].getAttribute("d")).toBe("M14 8h6v6");
  });

  it("akzeptiert zusätzliche Props", () => {
    const { container } = render(<TrendingUpIcon data-testid="trending-icon" />);
    const svg = container.querySelector("[data-testid='trending-icon']");
    expect(svg).toBeInTheDocument();
  });

  it("Props werden an SVG durchgegeben", () => {
    const { container } = render(
      <TrendingUpIcon data-custom="test-value" />
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("data-custom")).toBe("test-value");
  });

  it("SVG hat korrekte Struktur für Trending Up Pfad", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.children.length).toBe(2);
  });

  it("erstes Path ist Linienpfad", () => {
    const { container } = render(<TrendingUpIcon />);
    const firstPath = container.querySelectorAll("path")[0];
    const dAttr = firstPath.getAttribute("d");
    expect(dAttr).toContain("M");
    expect(dAttr).toContain("l");
  });

  it("zweites Path ist Rechteck", () => {
    const { container } = render(<TrendingUpIcon />);
    const secondPath = container.querySelectorAll("path")[1];
    const dAttr = secondPath.getAttribute("d");
    expect(dAttr).toContain("M");
    expect(dAttr).toContain("h");
    expect(dAttr).toContain("v");
  });

  it("SVG ist als Icon konfiguriert", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("hat keinen Text Content", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.textContent).toBe("");
  });

  it("SVG ist inline Grafik", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.tagName).toBe("svg");
  });

  it("alle Paths haben Styling Attribute", () => {
    const { container } = render(<TrendingUpIcon />);
    const paths = container.querySelectorAll("path");
    paths.forEach((path) => {
      expect(path.getAttribute("d")).toBeTruthy();
    });
  });

  it("SVG ist zugänglich mit aria-hidden", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg[aria-hidden='true']");
    expect(svg).toBeInTheDocument();
  });

  it("Icon kann mit Custom Sizes angepasst werden", () => {
    const { container } = render(
      <TrendingUpIcon width="48" height="48" />
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("48");
    expect(svg?.getAttribute("height")).toBe("48");
  });

  it("Icon kann mit Custom Color angepasst werden", () => {
    const { container } = render(<TrendingUpIcon stroke="red" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke")).toBe("red");
  });

  it("hat alle SVG Standard Attribute", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.hasAttribute("viewBox")).toBe(true);
    expect(svg?.hasAttribute("fill")).toBe(true);
    expect(svg?.hasAttribute("stroke")).toBe(true);
    expect(svg?.hasAttribute("stroke-width")).toBe(true);
  });

  it("Paths sind Children von SVG", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    const paths = svg?.querySelectorAll("path");
    expect(paths?.length).toBe(2);
  });

  it("keine Fehler beim Icon Rendern", () => {
    expect(() => {
      render(<TrendingUpIcon />);
    }).not.toThrow();
  });

  it("Icon ist SVGProps kompatibel", () => {
    const { container } = render(
      <TrendingUpIcon role="img" aria-label="Trending Up" />
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Trending Up");
  });

  it("rendert als SVG Element Type", () => {
    const { container } = render(<TrendingUpIcon />);
    const svg = container.querySelector("svg");
    expect(svg?.constructor.name).toContain("SVG");
  });

  it("Icon zeigt Trend Aufwärts Visually", () => {
    const { container } = render(<TrendingUpIcon />);
    const dValue = container
      .querySelectorAll("path")[0]
      .getAttribute("d");
    expect(dValue).toContain("7-7");
  });

  it("kann mit ref angesprochen werden", () => {
    let ref: HTMLOrSVGElement | null = null;
    const { container } = render(
      <TrendingUpIcon ref={(el) => { ref = el; }} />
    );
    expect(ref).toBeInTheDocument();
  });
});
