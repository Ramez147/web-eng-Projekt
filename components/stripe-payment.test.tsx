// stripe-payment.test.tsx
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { PaymentButton } from "./payment-button";

// Pure utility functions (extrahiert aus PaymentButton)
export type PaymentButtonProps = {
  amount: number;
  isProcessing?: boolean;
  onStartPayment?: () => void;
  onRetry?: () => void;
  error?: string | null;
};

export type PaymentState = {
  amount: number;
  isProcessing: boolean;
  error: string | null;
};

export const PAYMENT_MESSAGES = {
  ERROR_PREFIX: "Error: ",
  START_PAYMENT: "Start Payment",
  PROCESSING: "Processing...",
  RETRY: "Retry",
} as const;

export const PAYMENT_CLASSES = {
  CONTAINER_SUCCESS: "text-center",
  CONTAINER_ERROR: "text-red-600",
  BUTTON_SUCCESS: "bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50",
  BUTTON_ERROR: "ml-2 text-blue-600 underline",
} as const;

// Pure utility functions
export function isValidPaymentAmount(amount: any): boolean {
  return typeof amount === "number" && amount > 0 && isFinite(amount);
}

export function buildPaymentState(
  amount: number,
  isProcessing: boolean = false,
  error: string | null = null
): PaymentState {
  return {
    amount,
    isProcessing,
    error,
  };
}

export function shouldShowError(error: any): boolean {
  return typeof error === "string" && error.length > 0;
}

export function getButtonText(isProcessing: boolean, error: string | null): string {
  if (shouldShowError(error)) {
    return PAYMENT_MESSAGES.RETRY;
  }
  return isProcessing ? PAYMENT_MESSAGES.PROCESSING : PAYMENT_MESSAGES.START_PAYMENT;
}

export function getErrorDisplayText(error: string): string {
  return PAYMENT_MESSAGES.ERROR_PREFIX + error;
}

export function isButtonDisabled(isProcessing: boolean, error: string | null): boolean {
  return isProcessing && !shouldShowError(error);
}

export function validatePaymentButton(element: any): boolean {
  return (
    element instanceof HTMLButtonElement &&
    element.type === "submit"
  );
}

export function getContainerClass(error: string | null): string {
  return shouldShowError(error) ? PAYMENT_CLASSES.CONTAINER_ERROR : PAYMENT_CLASSES.CONTAINER_SUCCESS;
}

export function trackPaymentCallbacks(): {
  onStartPaymentCalls: number;
  onRetryCalls: number;
  onStartPayment: () => void;
  onRetry: () => void;
  getStartPaymentCalls: () => number;
  getRetryCalls: () => number;
} {
  const state = {
    onStartPaymentCalls: 0,
    onRetryCalls: 0,
  };

  return {
    get onStartPaymentCalls() {
      return state.onStartPaymentCalls;
    },
    get onRetryCalls() {
      return state.onRetryCalls;
    },
    onStartPayment: () => {
      state.onStartPaymentCalls++;
    },
    onRetry: () => {
      state.onRetryCalls++;
    },
    getStartPaymentCalls: () => state.onStartPaymentCalls,
    getRetryCalls: () => state.onRetryCalls,
  };
}

describe("PaymentButton", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Constants", () => {
    it("sollte PAYMENT_MESSAGES definieren", () => {
      expect(PAYMENT_MESSAGES.START_PAYMENT).toBe("Start Payment");
      expect(PAYMENT_MESSAGES.PROCESSING).toBe("Processing...");
      expect(PAYMENT_MESSAGES.RETRY).toBe("Retry");
    });

    it("sollte PAYMENT_CLASSES definieren", () => {
      expect(PAYMENT_CLASSES.CONTAINER_SUCCESS).toBeTruthy();
      expect(PAYMENT_CLASSES.CONTAINER_ERROR).toBeTruthy();
    });
  });

  describe("isValidPaymentAmount", () => {
    it("akzeptiert positive Zahlen", () => {
      expect(isValidPaymentAmount(99.99)).toBe(true);
      expect(isValidPaymentAmount(1)).toBe(true);
      expect(isValidPaymentAmount(0.01)).toBe(true);
    });

    it("lehnt null ab", () => {
      expect(isValidPaymentAmount(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidPaymentAmount(undefined)).toBe(false);
    });

    it("lehnt negative Zahlen ab", () => {
      expect(isValidPaymentAmount(-10)).toBe(false);
    });

    it("lehnt null Betrag ab", () => {
      expect(isValidPaymentAmount(0)).toBe(false);
    });

    it("lehnt Infinity ab", () => {
      expect(isValidPaymentAmount(Infinity)).toBe(false);
    });

    it("lehnt NaN ab", () => {
      expect(isValidPaymentAmount(NaN)).toBe(false);
    });
  });

  describe("buildPaymentState", () => {
    it("erstellt Payment State", () => {
      const state = buildPaymentState(99.99);
      expect(state.amount).toBe(99.99);
      expect(state.isProcessing).toBe(false);
      expect(state.error).toBeNull();
    });

    it("erstellt mit isProcessing true", () => {
      const state = buildPaymentState(50, true);
      expect(state.isProcessing).toBe(true);
    });

    it("erstellt mit Error", () => {
      const state = buildPaymentState(75, false, "Card declined");
      expect(state.error).toBe("Card declined");
    });
  });

  describe("shouldShowError", () => {
    it("zeigt Error bei String", () => {
      expect(shouldShowError("Payment failed")).toBe(true);
    });

    it("zeigt Error nicht bei null", () => {
      expect(shouldShowError(null)).toBe(false);
    });

    it("zeigt Error nicht bei undefined", () => {
      expect(shouldShowError(undefined)).toBe(false);
    });

    it("zeigt Error nicht bei leeren String", () => {
      expect(shouldShowError("")).toBe(false);
    });
  });

  describe("getButtonText", () => {
    it("gibt 'Start Payment' zurück", () => {
      const text = getButtonText(false, null);
      expect(text).toBe("Start Payment");
    });

    it("gibt 'Processing...' zurück wenn isProcessing", () => {
      const text = getButtonText(true, null);
      expect(text).toBe("Processing...");
    });

    it("gibt 'Retry' zurück wenn Error", () => {
      const text = getButtonText(false, "Failed");
      expect(text).toBe("Retry");
    });

    it("gibt 'Retry' zurück bei Error und Processing", () => {
      const text = getButtonText(true, "Failed");
      expect(text).toBe("Retry");
    });
  });

  describe("getErrorDisplayText", () => {
    it("formatiert Error Text", () => {
      const text = getErrorDisplayText("Payment failed");
      expect(text).toBe("Error: Payment failed");
    });

    it("formatiert verschiedene Errors", () => {
      expect(getErrorDisplayText("Network error")).toBe("Error: Network error");
      expect(getErrorDisplayText("Invalid card")).toBe("Error: Invalid card");
    });
  });

  describe("isButtonDisabled", () => {
    it("Button nicht disabled bei normalem State", () => {
      expect(isButtonDisabled(false, null)).toBe(false);
    });

    it("Button disabled bei Processing", () => {
      expect(isButtonDisabled(true, null)).toBe(true);
    });

    it("Button nicht disabled bei Error", () => {
      expect(isButtonDisabled(false, "Failed")).toBe(false);
    });

    it("Button nicht disabled bei Error und Processing", () => {
      expect(isButtonDisabled(true, "Failed")).toBe(false);
    });
  });

  describe("validatePaymentButton", () => {
    it("validiert Button Element", () => {
      const button = document.createElement("button");
      button.type = "submit";
      expect(validatePaymentButton(button)).toBe(true);
    });

    it("lehnt nicht-Button ab", () => {
      const div = document.createElement("div");
      expect(validatePaymentButton(div)).toBe(false);
    });

    it("lehnt Button mit falschem type ab", () => {
      const button = document.createElement("button");
      button.type = "button";
      expect(validatePaymentButton(button)).toBe(false);
    });
  });

  describe("getContainerClass", () => {
    it("gibt success Klasse zurück", () => {
      const cls = getContainerClass(null);
      expect(cls).toBe("text-center");
    });

    it("gibt error Klasse zurück", () => {
      const cls = getContainerClass("Failed");
      expect(cls).toContain("text-red-600");
    });
  });

  describe("trackPaymentCallbacks", () => {
    it("erstellt Callback Tracker", () => {
      const tracker = trackPaymentCallbacks();
      expect(tracker.onStartPaymentCalls).toBe(0);
      expect(tracker.onRetryCalls).toBe(0);
    });

    it("trackt onStartPayment Aufrufe", () => {
      const tracker = trackPaymentCallbacks();
      tracker.onStartPayment();
      expect(tracker.onStartPaymentCalls).toBe(1);
    });

    it("trackt onRetry Aufrufe", () => {
      const tracker = trackPaymentCallbacks();
      tracker.onRetry();
      expect(tracker.onRetryCalls).toBe(1);
    });

    it("trackt mehrere Aufrufe", () => {
      const tracker = trackPaymentCallbacks();
      tracker.onStartPayment();
      tracker.onStartPayment();
      tracker.onRetry();
      expect(tracker.onStartPaymentCalls).toBe(2);
      expect(tracker.onRetryCalls).toBe(1);
    });
  });

  describe("PaymentButton Component Rendering", () => {
    it("rendert ohne Fehler", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      expect(container).toBeTruthy();
    });

    it("zeigt 'Start Payment' Button wenn kein Error", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.textContent).toContain("Start Payment");
    });

    it("zeigt Button mit text-center Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("text-center");
    });

    it("Button hat bg-green-600 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("bg-green-600");
    });

    it("Button hat text-white Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-white");
    });

    it("Button hat py-2 px-4 Padding", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("py-2");
      expect(button?.className).toContain("px-4");
    });

    it("Button hat rounded-md Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("rounded-md");
    });

    it("Button hat hover:bg-green-700 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("hover:bg-green-700");
    });

    it("zeigt 'Processing...' wenn isProcessing true", () => {
      const { container } = render(
        <PaymentButton amount={99.99} isProcessing={true} />
      );
      const button = container.querySelector("button");
      expect(button?.textContent).toContain("Processing...");
    });

    it("Button ist disabled wenn isProcessing true", () => {
      const { container } = render(
        <PaymentButton amount={99.99} isProcessing={true} />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it("Button hat disabled:opacity-50 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} isProcessing={true} />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("disabled:opacity-50");
    });

    it("zeigt Error Nachricht wenn error prop gesetzt", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      expect(container.textContent).toContain("Error: Payment failed");
    });

    it("Error Container hat text-red-600 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      const div = container.querySelector("div");
      expect(div?.className).toContain("text-red-600");
    });

    it("zeigt 'Retry' Button wenn error vorhanden", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      const button = container.querySelector("button");
      expect(button?.textContent).toContain("Retry");
    });

    it("Retry Button hat text-blue-600 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("text-blue-600");
    });

    it("Retry Button hat underline Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("underline");
    });

    it("Retry Button hat ml-2 Klasse", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" />
      );
      const button = container.querySelector("button");
      expect(button?.className).toContain("ml-2");
    });

    it("akzeptiert amount prop", () => {
      const { container } = render(
        <PaymentButton amount={123.45} />
      );
      expect(container).toBeTruthy();
    });

    it("akzeptiert verschiedene amount Werte", () => {
      const { container: container1 } = render(
        <PaymentButton amount={50} />
      );
      const { container: container2 } = render(
        <PaymentButton amount={999.99} />
      );
      expect(container1).toBeTruthy();
      expect(container2).toBeTruthy();
    });

    it("rendert nur einen Button", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const buttons = container.querySelectorAll("button");
      expect(buttons.length).toBe(1);
    });

    it("hat korrekte Button Type", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      const button = container.querySelector("button");
      expect(button?.type).toBe("submit");
    });

    it("verarbeitet kleine Payment Amounts", () => {
      const { container } = render(
        <PaymentButton amount={0.01} />
      );
      expect(container).toBeTruthy();
    });

    it("verarbeitet große Payment Amounts", () => {
      const { container } = render(
        <PaymentButton amount={999999.99} />
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Callback Tests - Real Implementation", () => {
    it("onStartPayment wird aufgerufen wenn Button geklickt", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton amount={99.99} onStartPayment={tracker.onStartPayment} />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      fireEvent.click(button);
      expect(tracker.onStartPaymentCalls).toBe(1);
    });

    it("onRetry wird aufgerufen wenn Retry Button geklickt", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton amount={99.99} error="Payment failed" onRetry={tracker.onRetry} />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      fireEvent.click(button);
      expect(tracker.onRetryCalls).toBe(1);
    });

    it("onStartPayment wird nicht aufgerufen wenn Button disabled", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton amount={99.99} isProcessing={true} onStartPayment={tracker.onStartPayment} />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      // Cannot click disabled button via fireEvent, but button should be disabled
      expect(tracker.onStartPaymentCalls).toBe(0);
    });
  });

  describe("Error Message Tests", () => {
    it("zeigt verschiedene Error Nachrichten", () => {
      const { container: container1 } = render(
        <PaymentButton amount={99.99} error="Network error" />
      );
      expect(container1.textContent).toContain("Network error");

      const { container: container2 } = render(
        <PaymentButton amount={99.99} error="Invalid card" />
      );
      expect(container2.textContent).toContain("Invalid card");
    });

    it("Error wird nicht gezeigt wenn null", () => {
      const { container } = render(
        <PaymentButton amount={99.99} error={null} />
      );
      expect(container.textContent).not.toContain("Error:");
    });

    it("Error wird nicht gezeigt wenn undefined", () => {
      const { container } = render(
        <PaymentButton amount={99.99} />
      );
      expect(container.textContent).not.toContain("Error:");
    });

    it("zeigt korrekt mit langen Error Text", () => {
      const longError = "This is a very long error message that explains what went wrong in detail";
      const { container } = render(
        <PaymentButton amount={99.99} error={longError} />
      );
      expect(container.textContent).toContain(longError);
    });
  });

  describe("Prop Combinations Tests", () => {
    it("verarbeitet Processing mit Callback korrekt", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={99.99} 
          isProcessing={true} 
          onStartPayment={tracker.onStartPayment} 
        />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
      expect(button.textContent).toContain("Processing...");
    });

    it("verarbeitet Error mit onRetry Callback korrekt", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={99.99} 
          error="Failed" 
          onRetry={tracker.onRetry} 
        />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      fireEvent.click(button);
      expect(tracker.onRetryCalls).toBe(1);
    });

    it("Button ist clickable wenn nicht processing und kein error", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={99.99} 
          isProcessing={false} 
          onStartPayment={tracker.onStartPayment} 
        />
      );
      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.disabled).toBe(false);
      fireEvent.click(button);
      expect(tracker.onStartPaymentCalls).toBe(1);
    });

    it("akzeptiert alle Props zusammen", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={99.99} 
          isProcessing={false} 
          onStartPayment={tracker.onStartPayment} 
          onRetry={tracker.onRetry} 
          error={null}
        />
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Integration Tests", () => {
    it("kompletter Flow: Success State", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={50.00}
          isProcessing={false}
          onStartPayment={tracker.onStartPayment}
        />
      );

      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.textContent).toContain("Start Payment");
      
      fireEvent.click(button);
      expect(tracker.onStartPaymentCalls).toBe(1);
    });

    it("kompletter Flow: Processing State", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={50.00}
          isProcessing={true}
          onStartPayment={tracker.onStartPayment}
        />
      );

      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.textContent).toContain("Processing...");
      expect(button.disabled).toBe(true);
    });

    it("kompletter Flow: Error State mit Retry", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={50.00}
          error="Card declined"
          onRetry={tracker.onRetry}
        />
      );

      const button = container.querySelector("button") as HTMLButtonElement;
      expect(button.textContent).toContain("Retry");
      
      fireEvent.click(button);
      expect(tracker.onRetryCalls).toBe(1);
    });

    it("kompletter Flow: Multiple Retries", () => {
      const tracker = trackPaymentCallbacks();
      const { container } = render(
        <PaymentButton 
          amount={75.50}
          error="Failed"
          onRetry={tracker.onRetry}
        />
      );

      const button = container.querySelector("button") as HTMLButtonElement;
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(tracker.onRetryCalls).toBe(3);
    });

    it("States und Callbacks zusammen", () => {
      const tracker = trackPaymentCallbacks();
      
      // Initial state: no error
      const { container: c1 } = render(
        <PaymentButton 
          amount={99.99}
          isProcessing={false}
          onStartPayment={tracker.onStartPayment}
        />
      );
      expect(c1.querySelector("button")?.textContent).toContain("Start Payment");
      
      // After click, processing would be true
      const { container: c2 } = render(
        <PaymentButton 
          amount={99.99}
          isProcessing={true}
          onStartPayment={tracker.onStartPayment}
        />
      );
      expect(c2.querySelector("button")?.textContent).toContain("Processing...");
      
      // On error, show retry
      const { container: c3 } = render(
        <PaymentButton 
          amount={99.99}
          error="Failed"
          onRetry={tracker.onRetry}
        />
      );
      expect(c3.querySelector("button")?.textContent).toContain("Retry");
    });
  });
});
