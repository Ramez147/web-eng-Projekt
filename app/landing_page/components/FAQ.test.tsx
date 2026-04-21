import { render } from "@testing-library/react";
import { FAQ } from "./FAQ";

describe("FAQ component", () => {
  it("renders without crashing", () => {
    const { container } = render(<FAQ />);
    expect(container).not.toBeNull();
  });
});
