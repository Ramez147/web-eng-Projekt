// Mock next/navigation secara eksplisit untuk test ini
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { render } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Navbar />);
    expect(container).not.toBeNull();
  });
});
