import { render } from "@testing-library/react";
import { Pricing } from "./Pricing";

describe("Pricing component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Pricing />);
    expect(container).not.toBeNull();
  });
});
