import { render } from "@testing-library/react";
import { About } from "./About";

describe("About component", () => {
  it("renders without crashing", () => {
    const { container } = render(<About />);
    expect(container).not.toBeNull();
  });
});
