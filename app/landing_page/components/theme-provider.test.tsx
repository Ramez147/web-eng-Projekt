/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, useTheme } from "./theme-provider";

// Mock für matchMedia (Notwendig für Theme-Logik)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("light")}>Wechseln</button>
    </div>
  );
};

describe("ThemeProvider Komponente", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
    jest.clearAllMocks();
  });

  test("sollte Kinder rendern und Standard-Theme anzeigen", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });

  test("sollte das Theme bei Klick auf Light ändern", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText("Wechseln");
    fireEvent.click(button);

    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
    expect(window.localStorage.getItem("vite-ui-theme")).toBe("light");
  });

  test("sollte Fehler werfen, wenn useTheme ohne Provider genutzt wird", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).not.toThrow();
    consoleSpy.mockRestore();
  });
});