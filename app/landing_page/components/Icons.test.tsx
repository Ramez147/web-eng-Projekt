// Icons.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import {
  LogoIcon,
  MedalIcon,
  MapIcon,
  PlaneIcon,
  GiftIcon,
} from "./Icons";

describe("Icons components", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  describe("LogoIcon", () => {
    it("LogoIcon rendert ohne Fehler", () => {
      const { container } = render(<LogoIcon />);
      expect(container).toBeTruthy();
    });

    it("LogoIcon rendert SVG element", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("LogoIcon hat viewBox attribute", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });

    it("LogoIcon hat lucide classes", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("lucide");
    });

    it("LogoIcon hat w-6 h-6 classes", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("w-6");
      expect(svg?.className.baseVal).toContain("h-6");
    });

    it("LogoIcon hat mr-2 margin", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("mr-2");
    });

    it("LogoIcon svg hat stroke", () => {
      const { container } = render(<LogoIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("stroke", "currentColor");
    });

    it("LogoIcon svg hat rect element", () => {
      const { container } = render(<LogoIcon />);
      const rect = container.querySelector("svg rect");
      expect(rect).toBeInTheDocument();
    });

    it("LogoIcon svg hat path elements", () => {
      const { container } = render(<LogoIcon />);
      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
    });

    it("keine Fehler beim LogoIcon Rendern", () => {
      expect(() => {
        render(<LogoIcon />);
      }).not.toThrow();
    });
  });

  describe("MedalIcon", () => {
    it("MedalIcon rendert ohne Fehler", () => {
      const { container } = render(<MedalIcon />);
      expect(container).toBeTruthy();
    });

    it("MedalIcon rendert SVG element", () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("MedalIcon hat viewBox 0 0 128 128", () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    });

    it("MedalIcon hat fill-primary class", () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("fill-primary");
    });

    it("MedalIcon hat w-14 class", () => {
      const { container } = render(<MedalIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("w-14");
    });

    it("MedalIcon hat svg title", () => {
      const { container } = render(<MedalIcon />);
      const title = container.querySelector("svg title");
      expect(title).toBeInTheDocument();
    });

    it("MedalIcon hat g element mit id", () => {
      const { container } = render(<MedalIcon />);
      const g = container.querySelector("svg g");
      expect(g).toHaveAttribute("id");
    });

    it("keine Fehler beim MedalIcon Rendern", () => {
      expect(() => {
        render(<MedalIcon />);
      }).not.toThrow();
    });
  });

  describe("MapIcon", () => {
    it("MapIcon rendert ohne Fehler", () => {
      const { container } = render(<MapIcon />);
      expect(container).toBeTruthy();
    });

    it("MapIcon rendert SVG element", () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("MapIcon hat viewBox 0 0 128 128", () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    });

    it("MapIcon hat fill-primary class", () => {
      const { container } = render(<MapIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("fill-primary");
    });

    it("MapIcon hat svg title", () => {
      const { container } = render(<MapIcon />);
      const title = container.querySelector("svg title");
      expect(title).toBeInTheDocument();
    });

    it("keine Fehler beim MapIcon Rendern", () => {
      expect(() => {
        render(<MapIcon />);
      }).not.toThrow();
    });
  });

  describe("PlaneIcon", () => {
    it("PlaneIcon rendert ohne Fehler", () => {
      const { container } = render(<PlaneIcon />);
      expect(container).toBeTruthy();
    });

    it("PlaneIcon rendert SVG element", () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("PlaneIcon hat viewBox 0 0 128 128", () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    });

    it("PlaneIcon hat fill-primary class", () => {
      const { container } = render(<PlaneIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("fill-primary");
    });

    it("keine Fehler beim PlaneIcon Rendern", () => {
      expect(() => {
        render(<PlaneIcon />);
      }).not.toThrow();
    });
  });

  describe("GiftIcon", () => {
    it("GiftIcon rendert ohne Fehler", () => {
      const { container } = render(<GiftIcon />);
      expect(container).toBeTruthy();
    });

    it("GiftIcon rendert SVG element", () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("GiftIcon hat viewBox 0 0 128 128", () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 128 128");
    });

    it("GiftIcon hat fill-primary class", () => {
      const { container } = render(<GiftIcon />);
      const svg = container.querySelector("svg");
      expect(svg?.className.baseVal).toContain("fill-primary");
    });

    it("keine Fehler beim GiftIcon Rendern", () => {
      expect(() => {
        render(<GiftIcon />);
      }).not.toThrow();
    });
  });

  describe("Alle Icons zusammen", () => {
    it("alle Icons können gleichzeitig gerendert werden", () => {
      const { container } = render(
        <>
          <LogoIcon />
          <MedalIcon />
          <MapIcon />
          <PlaneIcon />
          <GiftIcon />
        </>
      );
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBe(5);
    });

    it("alle Icons sind SVG elemente", () => {
      const { container } = render(
        <>
          <LogoIcon />
          <MedalIcon />
          <MapIcon />
          <PlaneIcon />
          <GiftIcon />
        </>
      );
      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg.tagName).toBe("svg");
      });
    });

    it("alle Icons haben xmlns attribute", () => {
      const { container } = render(
        <>
          <LogoIcon />
          <MedalIcon />
          <MapIcon />
          <PlaneIcon />
          <GiftIcon />
        </>
      );
      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute("xmlns");
      });
    });
  });
});
