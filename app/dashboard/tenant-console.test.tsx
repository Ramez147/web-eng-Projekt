import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { LoyaltyConsole } from "./tenant-console";

// Mock dependencies
jest.mock("./actions", () => ({ generateApiKey: jest.fn(() => Promise.resolve("mock-api-key")) }));

describe("LoyaltyConsole", () => {
  it("renders login form when not authenticated", async () => {
    render(<LoyaltyConsole />);
    await waitFor(() => {
      expect(screen.getByText(/anmelden erforderlich/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/name@beispiel\.de/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢')).toBeInTheDocument();
    });
  });

  it("toggles between signin and signup", async () => {
    render(<LoyaltyConsole />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /registrieren/i })).toBeInTheDocument();
    });
    const toggleButton = screen.getByRole("button", { name: /registrieren/i });
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /anmelden/i })).toBeInTheDocument();
    });
  });

  // Add more tests for authenticated state, admin/member views, etc.
  // For full coverage, mock fetch and test dashboard rendering, forms, and actions.
});
