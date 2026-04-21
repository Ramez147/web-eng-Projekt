import { render } from "@testing-library/react";
import { HeroCards } from "./HeroCards";

describe("HeroCards component", () => {
  it("renders without crashing", () => {
    const { container } = render(<HeroCards />);
    expect(container).not.toBeNull();
  });
});
