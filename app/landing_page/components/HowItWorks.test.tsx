import { render } from "@testing-library/react";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks component", () => {
  it("renders without crashing", () => {
    const { container } = render(<HowItWorks />);
    expect(container).not.toBeNull();
  });
});
