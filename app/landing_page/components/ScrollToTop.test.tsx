import { render } from "@testing-library/react";
import { ScrollToTop } from "./ScrollToTop";

describe("ScrollToTop component", () => {
  it("renders without crashing", () => {
    const { container } = render(<ScrollToTop />);
    expect(container).not.toBeNull();
  });
});
