import { render } from "@testing-library/react";
import { Services } from "./Services";

describe("Services component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Services />);
    expect(container).not.toBeNull();
  });
});
