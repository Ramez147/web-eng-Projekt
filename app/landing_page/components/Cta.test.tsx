import { render } from "@testing-library/react";
import { Cta } from "./Cta";

describe("Cta component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Cta />);
    expect(container).not.toBeNull();
  });
});
