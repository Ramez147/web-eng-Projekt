import { render } from "@testing-library/react";
import { Features } from "./Features";

describe("Features component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Features />);
    expect(container).not.toBeNull();
  });
});
