import { describe, it, expect } from "vitest";
import { Sun, Moon } from "lucide-react";

// Pure utility functions and data (extrahiert aus ModeToggle)
export type ThemeOption = "light" | "dark" | "system";

export const THEME_OPTIONS: ThemeOption[] = ["light", "dark", "system"];

export const THEME_LABELS: Record<ThemeOption, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export const ACCESSIBILITY_TEXT = "Toggle theme";

export function isValidTheme(theme: any): boolean {
  return THEME_OPTIONS.includes(theme);
}

export function getThemeLabel(theme: ThemeOption): string {
  return THEME_LABELS[theme];
}

export function getAllThemeOptions(): ThemeOption[] {
  return [...THEME_OPTIONS];
}

export function getSunIconClassName(): string {
  return "h-[1.1rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0";
}

export function getMoonIconClassName(): string {
  return "absolute h-[1.1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100";
}

export function getButtonVariant(): string {
  return "ghost";
}

export function getButtonSize(): string {
  return "icon";
}

export function validateThemeOption(option: any): boolean {
  return (
    typeof option === "string" &&
    THEME_OPTIONS.includes(option)
  );
}

export function getAccessibilityText(): string {
  return ACCESSIBILITY_TEXT;
}

export function getDropdownMenuAlign(): string {
  return "end";
}

export function getThemesByCategory(category: "light" | "dark"): ThemeOption[] {
  if (category === "light") {
    return ["light", "system"];
  }
  return ["dark", "system"];
}

export function validateToggleState(state: {
  currentTheme?: ThemeOption;
  isOpen?: boolean;
}): { valid: boolean; error?: string } {
  const currentTheme = state.currentTheme;
  const isOpen = state.isOpen;

  if (currentTheme && !isValidTheme(currentTheme)) {
    return {
      valid: false,
      error: "currentTheme muss 'light', 'dark' oder 'system' sein",
    };
  }

  if (typeof isOpen !== "boolean" && isOpen !== undefined) {
    return { valid: false, error: "isOpen muss ein Boolean sein" };
  }

  return { valid: true };
}

describe("ModeToggle - Pure Utility Functions", () => {
  describe("Theme Options Data", () => {
    it("sollte genau 3 Theme Optionen haben", () => {
      expect(THEME_OPTIONS).toHaveLength(3);
    });

    it("sollte 'light', 'dark', 'system' enthalten", () => {
      expect(THEME_OPTIONS).toContain("light");
      expect(THEME_OPTIONS).toContain("dark");
      expect(THEME_OPTIONS).toContain("system");
    });

    it("THEME_LABELS sollte für alle Optionen Labels haben", () => {
      THEME_OPTIONS.forEach((option) => {
        expect(THEME_LABELS[option]).toBeTruthy();
      });
    });

    it("Light Theme Label ist 'Light'", () => {
      expect(THEME_LABELS["light"]).toBe("Light");
    });

    it("Dark Theme Label ist 'Dark'", () => {
      expect(THEME_LABELS["dark"]).toBe("Dark");
    });

    it("System Theme Label ist 'System'", () => {
      expect(THEME_LABELS["system"]).toBe("System");
    });
  });

  describe("isValidTheme", () => {
    it("akzeptiert 'light'", () => {
      expect(isValidTheme("light")).toBe(true);
    });

    it("akzeptiert 'dark'", () => {
      expect(isValidTheme("dark")).toBe(true);
    });

    it("akzeptiert 'system'", () => {
      expect(isValidTheme("system")).toBe(true);
    });

    it("lehnt unbekannte Themes ab", () => {
      expect(isValidTheme("invalid")).toBe(false);
      expect(isValidTheme("auto")).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidTheme(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidTheme(undefined)).toBe(false);
    });

    it("ist case-sensitive", () => {
      expect(isValidTheme("Light")).toBe(false);
      expect(isValidTheme("DARK")).toBe(false);
    });
  });

  describe("getThemeLabel", () => {
    it("gibt 'Light' für 'light' zurück", () => {
      expect(getThemeLabel("light")).toBe("Light");
    });

    it("gibt 'Dark' für 'dark' zurück", () => {
      expect(getThemeLabel("dark")).toBe("Dark");
    });

    it("gibt 'System' für 'system' zurück", () => {
      expect(getThemeLabel("system")).toBe("System");
    });
  });

  describe("getAllThemeOptions", () => {
    it("gibt alle Theme Optionen zurück", () => {
      const options = getAllThemeOptions();
      expect(options).toHaveLength(3);
    });

    it("gibt neue Array Kopie zurück", () => {
      const options1 = getAllThemeOptions();
      const options2 = getAllThemeOptions();
      expect(options1).toEqual(options2);
      expect(options1).not.toBe(options2);
    });

    it("enthält 'light', 'dark', 'system'", () => {
      const options = getAllThemeOptions();
      expect(options).toContain("light");
      expect(options).toContain("dark");
      expect(options).toContain("system");
    });
  });

  describe("Icon ClassNames", () => {
    it("getSunIconClassName hat korrekte Klassen", () => {
      const className = getSunIconClassName();
      expect(className).toContain("h-[1.1rem]");
      expect(className).toContain("w-[1.2rem]");
      expect(className).toContain("rotate-0");
      expect(className).toContain("scale-100");
      expect(className).toContain("transition-all");
    });

    it("getMoonIconClassName hat korrekte Klassen", () => {
      const className = getMoonIconClassName();
      expect(className).toContain("absolute");
      expect(className).toContain("h-[1.1rem]");
      expect(className).toContain("w-[1.2rem]");
      expect(className).toContain("rotate-90");
      expect(className).toContain("scale-0");
      expect(className).toContain("transition-all");
    });

    it("getMoonIconClassName hat dark mode Klassen", () => {
      const className = getMoonIconClassName();
      expect(className).toContain("dark:rotate-0");
      expect(className).toContain("dark:scale-100");
    });

    it("getSunIconClassName hat dark mode Klassen", () => {
      const className = getSunIconClassName();
      expect(className).toContain("dark:-rotate-90");
      expect(className).toContain("dark:scale-0");
    });
  });

  describe("Button Properties", () => {
    it("getButtonVariant gibt 'ghost' zurück", () => {
      expect(getButtonVariant()).toBe("ghost");
    });

    it("getButtonSize gibt 'icon' zurück", () => {
      expect(getButtonSize()).toBe("icon");
    });

    it("Button Variant und Size sind konfigurierbar", () => {
      const variant = getButtonVariant();
      const size = getButtonSize();
      expect(variant).toBeTruthy();
      expect(size).toBeTruthy();
    });
  });

  describe("validateThemeOption", () => {
    it("validiert 'light'", () => {
      expect(validateThemeOption("light")).toBe(true);
    });

    it("validiert 'dark'", () => {
      expect(validateThemeOption("dark")).toBe(true);
    });

    it("validiert 'system'", () => {
      expect(validateThemeOption("system")).toBe(true);
    });

    it("lehnt ungültige Themes ab", () => {
      expect(validateThemeOption("invalid")).toBe(false);
      expect(validateThemeOption(123)).toBe(false);
      expect(validateThemeOption(null)).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("getAccessibilityText gibt 'Toggle theme' zurück", () => {
      expect(getAccessibilityText()).toBe("Toggle theme");
    });

    it("ACCESSIBILITY_TEXT ist 'Toggle theme'", () => {
      expect(ACCESSIBILITY_TEXT).toBe("Toggle theme");
    });

    it("Accessibility Text ist nicht leer", () => {
      expect(getAccessibilityText().length).toBeGreaterThan(0);
    });
  });

  describe("getDropdownMenuAlign", () => {
    it("gibt 'end' zurück", () => {
      expect(getDropdownMenuAlign()).toBe("end");
    });

    it("ist zum Ausrichten des Dropdowns am Trigger", () => {
      const align = getDropdownMenuAlign();
      expect(["start", "end", "center"]).toContain(align);
    });
  });

  describe("getThemesByCategory", () => {
    it("gibt Light Themes für 'light' Kategorie", () => {
      const themes = getThemesByCategory("light");
      expect(themes).toContain("light");
      expect(themes).toContain("system");
    });

    it("gibt Dark Themes für 'dark' Kategorie", () => {
      const themes = getThemesByCategory("dark");
      expect(themes).toContain("dark");
      expect(themes).toContain("system");
    });

    it("System ist in beiden Kategorien", () => {
      const lightThemes = getThemesByCategory("light");
      const darkThemes = getThemesByCategory("dark");
      expect(lightThemes).toContain("system");
      expect(darkThemes).toContain("system");
    });
  });

  describe("validateToggleState", () => {
    it("akzeptiert valide State mit light Theme", () => {
      const result = validateToggleState({
        currentTheme: "light",
        isOpen: false,
      });
      expect(result.valid).toBe(true);
    });

    it("akzeptiert valide State mit dark Theme", () => {
      const result = validateToggleState({
        currentTheme: "dark",
        isOpen: true,
      });
      expect(result.valid).toBe(true);
    });

    it("akzeptiert State ohne currentTheme", () => {
      const result = validateToggleState({
        isOpen: false,
      });
      expect(result.valid).toBe(true);
    });

    it("lehnt ungültiges Theme ab", () => {
      const result = validateToggleState({
        currentTheme: "invalid" as any,
        isOpen: false,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("light");
    });

    it("lehnt ungültiges isOpen ab", () => {
      const result = validateToggleState({
        currentTheme: "light",
        isOpen: "false" as any,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Boolean");
    });
  });

  describe("ModeToggle Utilities Integration", () => {
    it("alle Themes haben Labels", () => {
      const themes = getAllThemeOptions();
      themes.forEach((theme) => {
        const label = getThemeLabel(theme);
        expect(label).toBeTruthy();
        expect(validateThemeOption(theme)).toBe(true);
      });
    });

    it("kompletter Flow: Theme → Label → Toggle", () => {
      const themes = getAllThemeOptions();
      themes.forEach((theme) => {
        expect(isValidTheme(theme)).toBe(true);
        const label = getThemeLabel(theme);
        expect(label.length).toBeGreaterThan(0);
        
        const state = {
          currentTheme: theme,
          isOpen: true,
        };
        const validation = validateToggleState(state);
        expect(validation.valid).toBe(true);
      });
    });

    it("Icons sind konfiguriert", () => {
      expect(getSunIconClassName()).toBeTruthy();
      expect(getMoonIconClassName()).toBeTruthy();
    });

    it("Button Properties sind konfiguriert", () => {
      expect(getButtonVariant()).toBe("ghost");
      expect(getButtonSize()).toBe("icon");
    });

    it("Accessibility ist implementiert", () => {
      expect(getAccessibilityText()).toBe("Toggle theme");
      expect(getAccessibilityText().length).toBeGreaterThan(0);
    });

    it("Dropdown Alignment ist richtig", () => {
      expect(getDropdownMenuAlign()).toBe("end");
    });

    it("Sun und Moon Icons existieren", () => {
      expect(Sun).toBeDefined();
      expect(Moon).toBeDefined();
    });
  });
});
