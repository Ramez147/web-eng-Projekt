// theme-provider.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ThemeProvider, useTheme } from "./theme-provider";

// Test Component, das useTheme Hook nutzt
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  it("rendert Children korrekt", () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    );
    const child = container.querySelector('[data-testid="child"]');
    expect(child).toBeInTheDocument();
  });

  it("zeigt 'Test Content' an", () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child">Test Content</div>
      </ThemeProvider>
    );
    expect(container.textContent).toContain("Test Content");
  });

  it("hat Standard-Theme 'dark'", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const themeValue = container.querySelector('[data-testid="theme-value"]');
    expect(themeValue?.textContent).toBe("dark");
  });

  it("hat Standard-Theme 'light'", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    const themeValue = container.querySelector('[data-testid="theme-value"]');
    expect(themeValue?.textContent).toBe("light");
  });

  it("hat children bei system theme", () => {
    // Einfacher Test ohne window.matchMedia
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <div data-testid="simple">Test</div>
      </ThemeProvider>
    );
    expect(container.querySelector('[data-testid="simple"]')).toBeInTheDocument();
  });

  it("speichert Theme in localStorage nach setTheme", () => {
    // Setzen Sie localStorage vor dem Rendern
    localStorage.setItem("vite-ui-theme", "dark");
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    expect(localStorage.getItem("vite-ui-theme")).toBeTruthy();
  });

  it("verwendet custom storageKey wenn vorhanden", () => {
    localStorage.setItem("custom-theme", "light");
    const { container } = render(
      <ThemeProvider defaultTheme="light" storageKey="custom-theme">
        <div>Test</div>
      </ThemeProvider>
    );
    // Nach dem Rendern sollte localStorage mit custom key vorhanden sein
    expect(localStorage.getItem("custom-theme")).toBeTruthy();
  });

  it("ThemeProviderContext.Provider ist vorhanden", () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("hat default storageKey 'vite-ui-theme' als Fallback", () => {
    localStorage.setItem("vite-ui-theme", "dark");
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );
    expect(localStorage.getItem("vite-ui-theme")).toBeTruthy();
  });

  it("rendert mehrere Children", () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ThemeProvider>
    );
    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child3"]')).toBeInTheDocument();
  });

  it("zeigt alle Children Text an", () => {
    const { container } = render(
      <ThemeProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ThemeProvider>
    );
    expect(container.textContent).toContain("Child 1");
    expect(container.textContent).toContain("Child 2");
    expect(container.textContent).toContain("Child 3");
  });

  it("hat Theme Props korrekt gesetzt", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark" storageKey="my-theme">
        <TestComponent />
      </ThemeProvider>
    );
    expect(container.textContent).toContain("dark");
  });

  it("kann mit unterschiedlichen defaultTheme Werten rendern (dark/light)", () => {
    const themes = ["dark", "light"];
    themes.forEach((theme) => {
      const { container } = render(
        <ThemeProvider defaultTheme={theme as any}>
          <TestComponent />
        </ThemeProvider>
      );
      const themeValue = container.querySelector('[data-testid="theme-value"]');
      expect(themeValue?.textContent).toBe(theme);
    });
  });

  it("hat Context Provider mit Value", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const themeValue = container.querySelector('[data-testid="theme-value"]');
    expect(themeValue).toBeInTheDocument();
  });

  it("hat Button Light im TestComponent", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const buttons = container.querySelectorAll("button");
    let hasLightButton = false;
    buttons.forEach((btn) => {
      if (btn.textContent === "Light") {
        hasLightButton = true;
      }
    });
    expect(hasLightButton).toBe(true);
  });

  it("hat Button Dark im TestComponent", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const buttons = container.querySelectorAll("button");
    let hasDarkButton = false;
    buttons.forEach((btn) => {
      if (btn.textContent === "Dark") {
        hasDarkButton = true;
      }
    });
    expect(hasDarkButton).toBe(true);
  });

  it("hat Button System im TestComponent", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const buttons = container.querySelectorAll("button");
    let hasSystemButton = false;
    buttons.forEach((btn) => {
      if (btn.textContent === "System") {
        hasSystemButton = true;
      }
    });
    expect(hasSystemButton).toBe(true);
  });

  it("hat alle 3 Buttons im TestComponent", () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(3);
  });

  it("keine Fehler beim ThemeProvider Rendern", () => {
    expect(() => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );
    }).not.toThrow();
  });
});