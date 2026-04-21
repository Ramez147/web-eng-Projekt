import { render } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Hero />);
    expect(container).not.toBeNull();
  });
});
