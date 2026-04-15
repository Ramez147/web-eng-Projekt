import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PeriodPicker } from "./period-picker";
import { useRouter, useSearchParams } from "next/navigation";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => "/dashboard",
  useSearchParams: jest.fn(),
}));

describe("PeriodPicker Komponente", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  test("Dropdown zeigt alle Optionen", () => {
    render(<PeriodPicker defaultValue="weekly" sectionKey="revenue" />);

    expect(screen.getByRole("combobox")).toHaveValue("weekly");
    expect(screen.getByText("weekly")).toBeInTheDocument();
    expect(screen.getByText("monthly")).toBeInTheDocument();
    expect(screen.getByText("yearly")).toBeInTheDocument();
  });

  test("Änderung aktualisiert die URL", () => {
    render(<PeriodPicker defaultValue="weekly" sectionKey="revenue" />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "monthly" } });

    expect(mockReplace).toHaveBeenCalledWith(
      "/dashboard?selected_time_frame=revenue%3Amonthly"
    );
  });

  test("Andere Werte in der URL bleiben erhalten", () => {
    const existingParams = new URLSearchParams("selected_time_frame=users:daily");
    (useSearchParams as jest.Mock).mockReturnValue(existingParams);

    render(<PeriodPicker defaultValue="weekly" sectionKey="revenue" />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "monthly" } });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining(
        "selected_time_frame=users%3Adaily%2Crevenue%3Amonthly"
      )
    );
  });
});