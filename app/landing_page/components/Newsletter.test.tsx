import { render } from "@testing-library/react";
import { Newsletter } from "./Newsletter";

describe("Newsletter component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Newsletter />);
    expect(container).not.toBeNull();
  });
});
