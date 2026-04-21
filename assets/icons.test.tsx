import { render } from "@testing-library/react";
import { TrendingUpIcon } from "./icons";

describe("TrendingUpIcon", () => {
  it("renders SVG element with correct props", () => {
    const { container } = render(<TrendingUpIcon data-testid="icon" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    if (!svg) throw new Error("SVG not rendered");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-width")).toBe("2");
    expect(svg.getAttribute("stroke-linecap")).toBe("round");
    expect(svg.getAttribute("stroke-linejoin")).toBe("round");
  });

  it("renders two path elements", () => {
    const { container } = render(<TrendingUpIcon />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });
});
