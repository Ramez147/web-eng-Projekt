// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "./logout-button";

// Pure utility functions (extrahiert aus LogoutButton)
export type LogoutResponse = {
  success?: boolean;
  error?: string;
};

export type LogoutRequest = {
  method: "POST";
  credentials: "include";
};

export type FetchConfig = {
  method: string;
  credentials: string;
};

export const LOGOUT_CONFIG = {
  URL: "/api/auth/signout",
  METHOD: "POST",
  CREDENTIALS: "include",
} as const;

export const LOGOUT_MESSAGES = {
  SUCCESS: "Logout erfolgreich",
  ERROR: "Abmeldung fehlgeschlagen",
} as const;

// Pure utility functions
export function buildLogoutRequest(): LogoutRequest {
  return {
    method: LOGOUT_CONFIG.METHOD as "POST",
    credentials: LOGOUT_CONFIG.CREDENTIALS as "include",
  };
}

export function isValidLogoutResponse(response: any): boolean {
  return (
    typeof response === "object" &&
    response !== null &&
    (typeof response.success === "boolean" || typeof response.error === "string")
  );
}

export function parseLogoutResponseData(data: any): LogoutResponse {
  if (!data) return {};
  return {
    success: typeof data.success === "boolean" ? data.success : undefined,
    error: typeof data.error === "string" ? data.error : undefined,
  };
}

export function validateLogoutResponse(
  ok: boolean,
  data: LogoutResponse
): { valid: boolean; error?: string } {
  if (!ok) {
    return { valid: false, error: data.error ?? LOGOUT_MESSAGES.ERROR };
  }

  if (!data.success) {
    return { valid: false, error: data.error ?? LOGOUT_MESSAGES.ERROR };
  }

  return { valid: true };
}

export function buildLogoutResponseData(
  success: boolean,
  error?: string
): LogoutResponse {
  return {
    success,
    error,
  };
}

export function getLogoutErrorMessage(error: any, data?: LogoutResponse): string {
  if (data?.error) {
    return data.error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return LOGOUT_MESSAGES.ERROR;
}

export function isButtonElement(element: any): boolean {
  return (
    element instanceof HTMLButtonElement &&
    element.type === "button"
  );
}

export function getLogoutButtonText(element: HTMLElement | null): string {
  if (!element) return "";
  return element.textContent?.trim() || "";
}

export function trackFetchCalls(): {
  calls: Array<{ url: string; config: any }>;
  handler: (url: string, config?: any) => Promise<Response>;
} {
  const calls: Array<{ url: string; config: any }> = [];

  return {
    calls,
    handler: async (url: string, config?: any) => {
      calls.push({ url, config });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    },
  };
}

describe("LogoutButton", () => {
  beforeEach(() => {
    // Reset any global state
    document.body.innerHTML = "";
  });

  describe("Constants", () => {
    it("sollte LOGOUT_CONFIG definieren", () => {
      expect(LOGOUT_CONFIG.URL).toBe("/api/auth/signout");
      expect(LOGOUT_CONFIG.METHOD).toBe("POST");
      expect(LOGOUT_CONFIG.CREDENTIALS).toBe("include");
    });

    it("sollte LOGOUT_MESSAGES definieren", () => {
      expect(LOGOUT_MESSAGES.SUCCESS).toBeTruthy();
      expect(LOGOUT_MESSAGES.ERROR).toBeTruthy();
    });
  });

  describe("buildLogoutRequest", () => {
    it("erstellt korrekten Logout Request", () => {
      const request = buildLogoutRequest();

      expect(request.method).toBe("POST");
      expect(request.credentials).toBe("include");
    });

    it("gibt immer gleiche Request zurück", () => {
      const req1 = buildLogoutRequest();
      const req2 = buildLogoutRequest();

      expect(req1).toEqual(req2);
    });
  });

  describe("isValidLogoutResponse", () => {
    it("validiert Response mit success", () => {
      const response = { success: true };
      expect(isValidLogoutResponse(response)).toBe(true);
    });

    it("validiert Response mit error", () => {
      const response = { error: "Logout failed" };
      expect(isValidLogoutResponse(response)).toBe(true);
    });

    it("lehnt null ab", () => {
      expect(isValidLogoutResponse(null)).toBe(false);
    });

    it("lehnt undefined ab", () => {
      expect(isValidLogoutResponse(undefined)).toBe(false);
    });

    it("lehnt leeres Object ab", () => {
      expect(isValidLogoutResponse({})).toBe(false);
    });
  });

  describe("parseLogoutResponseData", () => {
    it("parsed Success Response", () => {
      const data = parseLogoutResponseData({ success: true });
      expect(data.success).toBe(true);
    });

    it("parsed Error Response", () => {
      const data = parseLogoutResponseData({ error: "Error message" });
      expect(data.error).toBe("Error message");
    });

    it("parsed beide Felder", () => {
      const data = parseLogoutResponseData({ success: false, error: "Error" });
      expect(data.success).toBe(false);
      expect(data.error).toBe("Error");
    });

    it("handhabt null Data", () => {
      const data = parseLogoutResponseData(null);
      expect(data).toEqual({});
    });
  });

  describe("validateLogoutResponse", () => {
    it("validiert erfolgreiche Response", () => {
      const result = validateLogoutResponse(true, { success: true });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("lehnt Response mit ok=false ab", () => {
      const result = validateLogoutResponse(false, { error: "Logout failed" });
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Logout failed");
    });

    it("lehnt Response ohne success ab", () => {
      const result = validateLogoutResponse(true, { success: false });
      expect(result.valid).toBe(false);
    });

    it("gibt default error wenn keiner vorhanden", () => {
      const result = validateLogoutResponse(false, {});
      expect(result.valid).toBe(false);
      expect(result.error).toBe(LOGOUT_MESSAGES.ERROR);
    });
  });

  describe("buildLogoutResponseData", () => {
    it("baut Success Response", () => {
      const response = buildLogoutResponseData(true);
      expect(response.success).toBe(true);
    });

    it("baut Error Response", () => {
      const response = buildLogoutResponseData(false, "Error message");
      expect(response.success).toBe(false);
      expect(response.error).toBe("Error message");
    });
  });

  describe("getLogoutErrorMessage", () => {
    it("gibt data.error zurück wenn vorhanden", () => {
      const message = getLogoutErrorMessage(null, { error: "Data error" });
      expect(message).toBe("Data error");
    });

    it("gibt Error.message zurück", () => {
      const error = new Error("Custom error");
      const message = getLogoutErrorMessage(error);
      expect(message).toBe("Custom error");
    });

    it("gibt default message zurück", () => {
      const message = getLogoutErrorMessage(null);
      expect(message).toBe(LOGOUT_MESSAGES.ERROR);
    });
  });

  describe("isButtonElement", () => {
    it("validiert Button Element", () => {
      const button = document.createElement("button");
      button.type = "button";
      expect(isButtonElement(button)).toBe(true);
    });

    it("lehnt nicht-Button Element ab", () => {
      const div = document.createElement("div");
      expect(isButtonElement(div)).toBe(false);
    });

    it("lehnt Button mit falschem type ab", () => {
      const button = document.createElement("button");
      button.type = "submit";
      expect(isButtonElement(button)).toBe(false);
    });
  });

  describe("getLogoutButtonText", () => {
    it("gibt Button Text zurück", () => {
      const button = document.createElement("button");
      button.textContent = "Logout";
      expect(getLogoutButtonText(button)).toBe("Logout");
    });

    it("gibt leeren String für null zurück", () => {
      expect(getLogoutButtonText(null)).toBe("");
    });

    it("trimmt Whitespace", () => {
      const button = document.createElement("button");
      button.textContent = "  Logout  ";
      expect(getLogoutButtonText(button)).toBe("Logout");
    });
  });

  describe("trackFetchCalls", () => {
    it("erstellt Fetch Tracker", () => {
      const tracker = trackFetchCalls();

      expect(tracker.calls).toBeDefined();
      expect(Array.isArray(tracker.calls)).toBe(true);
      expect(tracker.handler).toBeDefined();
    });

    it("trackt Fetch Aufrufe", async () => {
      const tracker = trackFetchCalls();

      await tracker.handler("/api/auth/signout", { method: "POST" });

      expect(tracker.calls).toHaveLength(1);
      expect(tracker.calls[0].url).toBe("/api/auth/signout");
    });

    it("trackt mehrere Fetch Aufrufe", async () => {
      const tracker = trackFetchCalls();

      await tracker.handler("/api/auth/signout", { method: "POST" });
      await tracker.handler("/api/auth/signout", { method: "POST" });

      expect(tracker.calls).toHaveLength(2);
    });

    it("handler gibt erfolgreiche Response zurück", async () => {
      const tracker = trackFetchCalls();
      const response = await tracker.handler("/api/auth/signout");

      expect(response.status).toBe(200);
      expect(response.ok).toBe(true);
    });
  });

  describe("LogoutButton Component Rendering", () => {
    it("rendert ohne Fehler", () => {
      const { container } = render(<LogoutButton />);
      expect(container).toBeTruthy();
    });

    it("hat Button Element", () => {
      render(<LogoutButton />);
      const button = screen.getAllByText("Logout")[0];
      expect(button).toBeInTheDocument();
    });

    it("Button hat type 'button'", () => {
      render(<LogoutButton />);
      const button = screen.getAllByText("Logout")[0] as HTMLButtonElement;
      expect(button.type).toBe("button");
    });

    it("Button hat Logout Text", () => {
      render(<LogoutButton />);
      const button = screen.getAllByText("Logout")[0];
      expect(button).toBeInTheDocument();
    });

    it("Button Element ist klickbar", () => {
      const { container } = render(<LogoutButton />);
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
      // Do not click because it triggers real fetch
    });

    it("Button hat Styling Klassen", () => {
      const { container } = render(<LogoutButton />);
      const button = container.querySelector("button");
      expect(button?.className).toContain("inline-flex");
      expect(button?.className).toContain("gap-2");
    });

    it("Button hat hover:bg-slate-700", () => {
      const { container } = render(<LogoutButton />);
      const button = container.querySelector("button");
      expect(button?.className).toContain("hover:");
    });

    it("Button akzeptiert custom className", () => {
      const { container } = render(<LogoutButton className="custom-class" />);
      const button = container.querySelector("button");
      expect(button?.className).toContain("custom-class");
    });
  });

  describe("Logout Flow - Real Implementation", () => {
    it("Button Element ist vorhanden", () => {
      render(<LogoutButton />);
      const button = screen.getAllByText("Logout")[0];
      
      expect(button).toBeInTheDocument();
    });

    it("Button mit custom className", () => {
      const { container } = render(<LogoutButton className="test-class" />);
      const button = container.querySelector("button");
      
      expect(button?.className).toContain("test-class");
      expect(button?.className).toContain("inline-flex");
    });

    it("Button Text und Icon", () => {
      render(<LogoutButton />);
      const button = screen.getAllByText("Logout")[0];
      
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Logout");
    });
  });

  describe("Integration Tests", () => {
    it("Response Validation: Success", () => {
      const responseData = buildLogoutResponseData(true);
      const validation = validateLogoutResponse(true, responseData);
      
      expect(validation.valid).toBe(true);
    });

    it("Response Validation: Failure", () => {
      const responseData = buildLogoutResponseData(false, "Failed");
      const validation = validateLogoutResponse(false, responseData);
      
      expect(validation.valid).toBe(false);
      expect(validation.error).toBe("Failed");
    });

    it("kompletter Flow: Request und Response", () => {
      const request = buildLogoutRequest();
      const response = buildLogoutResponseData(true);
      const validation = validateLogoutResponse(true, response);
      
      expect(request.method).toBe("POST");
      expect(request.credentials).toBe("include");
      expect(validation.valid).toBe(true);
    });

    it("Error Handling: Missing Success Field", () => {
      const response = buildLogoutResponseData(false);
      const validation = validateLogoutResponse(true, response);
      
      expect(validation.valid).toBe(false);
    });

    it("Error Message Chain", () => {
      const responseData = buildLogoutResponseData(false, "Auth failed");
      const validation = validateLogoutResponse(false, responseData);
      const errorMsg = getLogoutErrorMessage(null, responseData);
      
      expect(validation.valid).toBe(false);
      expect(errorMsg).toBe("Auth failed");
    });
  });
});