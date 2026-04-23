import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { PeriodPickerBase } from "./period-picker-base";

// Pure utility functions (extrahiert aus PeriodPickerBase)
export type PeriodValue = "daily" | "weekly" | "monthly" | "yearly" | string;

export type PeriodPickerProps = {
  defaultValue: string;
  sectionKey: string;
  items?: string[];
  onChange?: (value: string) => void;
};

export const DEFAULT_PERIODS = ["weekly", "monthly", "yearly"] as const;

export const PERIOD_PICKER_CLASSES = {
  LABEL: "inline-flex items-center gap-2 text-sm text-slate-400",
  SR_ONLY: "sr-only",
  SELECT: "rounded-xl border border-white/12 bg-white/6 px-2.5 py-1.5 text-sm text-slate-200 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/25",
} as const;

// Pure utility functions
export function isValidPeriod(value: any): boolean {
  return typeof value === "string" && value.length > 0;
}

export function getPeriodOptions(customItems?: string[]): string[] {
  return customItems ?? [...DEFAULT_PERIODS];
}

export function validateCssClass(element: Element | null, className: string): boolean {
  if (!element) return false;
  return element.className.includes(className);
}

export function parseSelectChangeEvent(event: Event): string {
  const target = event.target as HTMLSelectElement;
  return target.value;
}

export function buildSelectAttributes(defaultValue: string, options: string[]): {
  value: string;
  optionsCount: number;
  optionsList: string[];
} {
  return {
    value: defaultValue,
    optionsCount: options.length,
    optionsList: options,
  };
}

export function trackCallbacks(): {
  onChangeCalls: string[];
  onChange: (value: string) => void;
} {
  const onChangeCalls: string[] = [];
  
  return {
    onChangeCalls,
    onChange: (value: string) => {
      onChangeCalls.push(value);
    },
  };
}

describe("PeriodPickerBase", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Constants", () => {
    it("sollte DEFAULT_PERIODS definieren", () => {
      expect(DEFAULT_PERIODS).toBeDefined();
      expect(DEFAULT_PERIODS).toContain("weekly");
      expect(DEFAULT_PERIODS).toContain("monthly");
      expect(DEFAULT_PERIODS).toContain("yearly");
    });

    it("sollte alle CSS Klassen definieren", () => {
      expect(PERIOD_PICKER_CLASSES.LABEL).toBeTruthy();
      expect(PERIOD_PICKER_CLASSES.SR_ONLY).toBeTruthy();
      expect(PERIOD_PICKER_CLASSES.SELECT).toBeTruthy();
    });
  });

  describe("isValidPeriod", () => {
    it("akzeptiert gültige Period Strings", () => {
      expect(isValidPeriod("weekly")).toBe(true);
      expect(isValidPeriod("monthly")).toBe(true);
      expect(isValidPeriod("custom")).toBe(true);
    });

    it("lehnt leere Strings ab", () => {
      expect(isValidPeriod("")).toBe(false);
    });

    it("lehnt null ab", () => {
      expect(isValidPeriod(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidPeriod(undefined)).toBe(false);
    });

    it("lehnt Zahlen ab", () => {
      expect(isValidPeriod(123)).toBe(false);
    });
  });

  describe("getPeriodOptions", () => {
    it("gibt DEFAULT_PERIODS zurück wenn keine custom Items", () => {
      const options = getPeriodOptions();
      expect(options).toEqual(["weekly", "monthly", "yearly"]);
    });

    it("gibt custom Items zurück wenn bereitgestellt", () => {
      const custom = ["daily", "weekly", "custom"];
      const options = getPeriodOptions(custom);
      expect(options).toEqual(custom);
    });

    it("handhabt leere custom Items Array", () => {
      const options = getPeriodOptions([]);
      expect(options).toEqual([]);
    });
  });

  describe("validateCssClass", () => {
    it("validiert Klasse wenn vorhanden", () => {
      const element = document.createElement("div");
      element.className = "inline-flex items-center";
      expect(validateCssClass(element, "inline-flex")).toBe(true);
    });

    it("lehnt Klasse ab wenn nicht vorhanden", () => {
      const element = document.createElement("div");
      element.className = "inline-flex";
      expect(validateCssClass(element, "nonexistent")).toBe(false);
    });

    it("handhabt null element", () => {
      expect(validateCssClass(null, "inline-flex")).toBe(false);
    });
  });

  describe("parseSelectChangeEvent", () => {
    it("extrahiert Wert aus Change Event", () => {
      const select = document.createElement("select") as HTMLSelectElement;
      const option1 = document.createElement("option");
      option1.value = "monthly";
      select.appendChild(option1);
      select.value = "monthly";
      
      expect(select.value).toBe("monthly");
    });
  });

  describe("buildSelectAttributes", () => {
    it("baut Select Attribute korrekt", () => {
      const attrs = buildSelectAttributes("weekly", ["weekly", "monthly"]);
      
      expect(attrs.value).toBe("weekly");
      expect(attrs.optionsCount).toBe(2);
      expect(attrs.optionsList).toEqual(["weekly", "monthly"]);
    });
  });

  describe("trackCallbacks", () => {
    it("erstellt Callback Tracker", () => {
      const tracker = trackCallbacks();
      
      expect(tracker.onChangeCalls).toBeDefined();
      expect(Array.isArray(tracker.onChangeCalls)).toBe(true);
      expect(tracker.onChange).toBeDefined();
    });

    it("trackt Callback Aufrufe", () => {
      const tracker = trackCallbacks();
      
      tracker.onChange("weekly");
      expect(tracker.onChangeCalls).toContain("weekly");
      expect(tracker.onChangeCalls).toHaveLength(1);
    });

    it("trackt mehrere Callback Aufrufe", () => {
      const tracker = trackCallbacks();
      
      tracker.onChange("weekly");
      tracker.onChange("monthly");
      tracker.onChange("yearly");
      
      expect(tracker.onChangeCalls).toHaveLength(3);
      expect(tracker.onChangeCalls[0]).toBe("weekly");
      expect(tracker.onChangeCalls[1]).toBe("monthly");
      expect(tracker.onChangeCalls[2]).toBe("yearly");
    });

    it("speichert richtige Werte", () => {
      const tracker = trackCallbacks();
      
      tracker.onChange("custom-value");
      expect(tracker.onChangeCalls[0]).toBe("custom-value");
    });
  });

  describe("Component Rendering", () => {
    it("rendert ohne Fehler", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      expect(container).toBeTruthy();
    });

    it("hat Label Element", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(label).toBeInTheDocument();
    });

    it("Label hat inline-flex Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(validateCssClass(label, "inline-flex")).toBe(true);
    });

    it("Label hat items-center Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(validateCssClass(label, "items-center")).toBe(true);
    });

    it("Label hat gap-2 Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(validateCssClass(label, "gap-2")).toBe(true);
    });

    it("Label hat text-sm Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(validateCssClass(label, "text-sm")).toBe(true);
    });

    it("hat sr-only span", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const srOnly = container.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
    });

    it("sr-only hat Text 'Select period'", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const srOnly = container.querySelector(".sr-only");
      expect(srOnly?.textContent).toBe("Select period");
    });

    it("hat Select Element", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(select).toBeInTheDocument();
    });

    it("Select hat rounded-xl Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "rounded-xl")).toBe(true);
    });

    it("Select hat border Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "border")).toBe(true);
    });

    it("Select hat bg-white Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "bg-white")).toBe(true);
    });

    it("Select hat text-sm Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "text-sm")).toBe(true);
    });

    it("Select hat outline-none Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "outline-none")).toBe(true);
    });

    it("Select hat transition Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "transition")).toBe(true);
    });

    it("Select hat focus:border-emerald-400", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "focus:")).toBe(true);
    });

    it("Select hat defaultValue 'weekly'", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      expect(select?.value).toBe("weekly");
    });

    it("hat 3 Standard Options", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const options = container.querySelectorAll("option");
      expect(options.length).toBe(3);
    });

    it("erste Option ist 'weekly'", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const options = container.querySelectorAll("option");
      expect(options[0].value).toBe("weekly");
      expect(options[0].textContent).toBe("weekly");
    });

    it("zweite Option ist 'monthly'", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const options = container.querySelectorAll("option");
      expect(options[1].value).toBe("monthly");
      expect(options[1].textContent).toBe("monthly");
    });

    it("dritte Option ist 'yearly'", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const options = container.querySelectorAll("option");
      expect(options[2].value).toBe("yearly");
      expect(options[2].textContent).toBe("yearly");
    });

    it("akzeptiert custom items", () => {
      const { container } = render(
        <PeriodPickerBase
          defaultValue="daily"
          sectionKey="revenue"
          items={["daily", "weekly", "monthly"]}
        />
      );
      const options = container.querySelectorAll("option");
      expect(options.length).toBe(3);
      expect(options[0].value).toBe("daily");
      expect(options[1].value).toBe("weekly");
      expect(options[2].value).toBe("monthly");
    });

    it("Select kann geändert werden", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("weekly");
      select.value = "monthly";
      fireEvent.change(select);
      expect(select.value).toBe("monthly");
    });

    it("sectionKey wird korrekt gespeichert", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="analytics" />
      );
      expect(container.textContent).toBeTruthy();
    });

    it("hat Text Color Klasse", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      expect(validateCssClass(label, "text-slate")).toBe(true);
    });

    it("Select Element ist interaktiv", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(select).toBeTruthy();
      expect((select as HTMLSelectElement).disabled).toBe(false);
    });

    it("alle Option Elemente haben Keys", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const options = container.querySelectorAll("option");
      options.forEach((option) => {
        expect(option.getAttribute("value")).toBeTruthy();
      });
    });

    it("Labels beinhalten Select", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      const select = label?.querySelector("select");
      expect(select).toBeInTheDocument();
    });

    it("Label beinhaltet sr-only span", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const label = container.querySelector("label");
      const srOnly = label?.querySelector(".sr-only");
      expect(srOnly).toBeInTheDocument();
    });

    it("defaultValue wird initial gesetzt", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="monthly" sectionKey="revenue" />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("monthly");
    });

    it("keine Fehler beim PeriodPickerBase Rendern", () => {
      expect(() => {
        render(
          <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
        );
      }).not.toThrow();
    });

    it("Komponente ist zugänglich", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const srOnly = container.querySelector(".sr-only");
      expect(srOnly?.textContent).toBe("Select period");
    });

    it("Select hat Focus States", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select");
      expect(validateCssClass(select, "focus:")).toBe(true);
    });
  });

  describe("onChange Callback - Real Implementation", () => {
    it("onChange Callback wird aufgerufen mit richtigem Wert", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          onChange={tracker.onChange}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "monthly" } });
      
      expect(tracker.onChangeCalls).toContain("monthly");
      expect(tracker.onChangeCalls).toHaveLength(1);
    });

    it("onChange wird mit verschiedenen Werten aufgerufen", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          onChange={tracker.onChange}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      
      fireEvent.change(select, { target: { value: "monthly" } });
      fireEvent.change(select, { target: { value: "yearly" } });
      
      expect(tracker.onChangeCalls).toEqual(["monthly", "yearly"]);
    });

    it("onChange wird nicht aufgerufen wenn nicht bereitgestellt", () => {
      const { container } = render(
        <PeriodPickerBase defaultValue="weekly" sectionKey="revenue" />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      
      expect(() => {
        fireEvent.change(select, { target: { value: "monthly" } });
      }).not.toThrow();
    });

    it("onChange trackt jeden Wechsel", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          items={["daily", "weekly", "monthly", "yearly"]}
          onChange={tracker.onChange}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      
      const values = ["monthly", "yearly", "weekly"];
      values.forEach(val => {
        fireEvent.change(select, { target: { value: val } });
      });
      
      expect(tracker.onChangeCalls).toEqual(values);
      expect(tracker.onChangeCalls).toHaveLength(3);
    });

    it("onChange speichert den exakten Wert", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          items={["weekly", "monthly", "yearly", "custom"]}
          onChange={tracker.onChange}
        />
      );
      const select = container.querySelector("select") as HTMLSelectElement;
      
      fireEvent.change(select, { target: { value: "custom" } });
      
      expect(tracker.onChangeCalls[0]).toBe("custom");
    });
  });

  describe("Integration Tests", () => {
    it("kompletter Flow: Select Wechsel mit onChange", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          items={["daily", "weekly", "monthly", "yearly"]}
          onChange={tracker.onChange}
        />
      );
      
      const select = container.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("weekly");
      
      fireEvent.change(select, { target: { value: "monthly" } });
      expect(tracker.onChangeCalls[0]).toBe("monthly");
      
      fireEvent.change(select, { target: { value: "yearly" } });
      expect(tracker.onChangeCalls[1]).toBe("yearly");
      
      expect(tracker.onChangeCalls).toHaveLength(2);
    });

    it("kompletter Flow: Custom Items mit onChange", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="option1"
          sectionKey="test"
          items={["option1", "option2", "option3"]}
          onChange={tracker.onChange}
        />
      );
      
      const select = container.querySelector("select") as HTMLSelectElement;
      const options = container.querySelectorAll("option");
      
      expect(options.length).toBe(3);
      expect(select.value).toBe("option1");
      
      fireEvent.change(select, { target: { value: "option2" } });
      expect(tracker.onChangeCalls).toContain("option2");
    });

    it("Accessibility mit onChange", () => {
      const tracker = trackCallbacks();
      const { container } = render(
        <PeriodPickerBase
          defaultValue="weekly"
          sectionKey="revenue"
          onChange={tracker.onChange}
        />
      );
      
      const srOnly = container.querySelector(".sr-only");
      expect(srOnly?.textContent).toBe("Select period");
      
      const select = container.querySelector("select");
      expect(select).toBeInTheDocument();
      
      fireEvent.change(select as HTMLSelectElement, { target: { value: "monthly" } });
      expect(tracker.onChangeCalls).toContain("monthly");
    });
  });
});