import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildReceiptHtml,
  escapeHtml,
  formatCurrency,
  PaymentSection,
  printReceipt,
} from "./payment-section";

describe("payment-section helpers", () => {
  it("formats cents as currency", () => {
    expect(formatCurrency(2999, "usd")).toBe("$29.99");
  });

  it("escapes html-sensitive values", () => {
    expect(escapeHtml('<img src=x onerror="1">')).toBe(
      "&lt;img src=x onerror=&quot;1&quot;&gt;"
    );
  });

  it("builds receipt html with escaped content", () => {
    const html = buildReceiptHtml({
      item: {
        id: "tx-123",
        amountCents: 2999,
        currency: "usd",
        status: "succeeded",
        description: '<script>alert("x")</script>',
        receiptUrl: null,
        createdAt: "2026-05-01T10:00:00.000Z",
      },
      organizationName: "ACME <Org>",
    });

    expect(html).toContain("ACME &lt;Org&gt;");
    expect(html).not.toContain('<script>alert("x")</script>');
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });

  it("returns false when popup is blocked", () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);

    const ok = printReceipt({
      id: "tx-124",
      amountCents: 1000,
      currency: "usd",
      status: "succeeded",
      description: "Premium",
      receiptUrl: null,
      createdAt: "2026-05-01T10:00:00.000Z",
    });

    expect(ok).toBe(false);
    openSpy.mockRestore();
  });
});

describe("PaymentSection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows free tier state and payment history", async () => {
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/payment/subscription")) {
        return {
          ok: true,
          json: async () => ({
            plan: "free",
            status: "active",
            currentPeriodEnd: null,
            stripeCustomerId: null,
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          items: [
            {
              id: "tx-123",
              amountCents: 2999,
              currency: "usd",
              status: "succeeded",
              description: "Premium subscription",
              receiptUrl: null,
              createdAt: "2026-05-01T10:00:00.000Z",
            },
          ],
        }),
      } as Response;
    });

    render(<PaymentSection />);

    await waitFor(() => {
      expect(screen.getByText("Current plan")).toBeInTheDocument();
    });

    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(
      screen.getByText("You are currently on the free tier.")
    ).toBeInTheDocument();
    expect(screen.getByText("Payment history")).toBeInTheDocument();
    expect(screen.getAllByText("Print").length).toBeGreaterThan(0);

    fetchMock.mockRestore();
  });

  it("shows popup warning when print popup is blocked", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/api/payment/subscription")) {
        return {
          ok: true,
          json: async () => ({
            plan: "premium",
            status: "active",
            currentPeriodEnd: "2026-06-01T10:00:00.000Z",
            stripeCustomerId: "cus_123",
          }),
        } as Response;
      }

      return {
        ok: true,
        json: async () => ({
          items: [
            {
              id: "tx-200",
              amountCents: 1200,
              currency: "usd",
              status: "succeeded",
              description: "Premium subscription",
              receiptUrl: null,
              createdAt: "2026-05-02T10:00:00.000Z",
            },
          ],
        }),
      } as Response;
    });

    vi.spyOn(window, "open").mockReturnValue(null);

    render(<PaymentSection />);

    await waitFor(() => {
      expect(screen.getAllByText("Print").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByText("Print")[0]);

    expect(
      await screen.findByText("Popup blocked. Please allow popups to print your receipt.")
    ).toBeInTheDocument();
  });
});
