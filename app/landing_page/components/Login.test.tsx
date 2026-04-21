import { render } from "@testing-library/react";
import { Login } from "./Login";

describe("Login component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Login />);
    expect(container).not.toBeNull();
  });
});
