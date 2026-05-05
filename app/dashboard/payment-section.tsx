"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Printer,
  ReceiptText,
  XCircle,
  Zap,
} from "lucide-react";
import type { SubscriptionResponse } from "@/app/api/payment/subscription/route";
import type { PaymentHistoryItem } from "@/app/api/payment/history/route";

export function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function StatusBadge({ status }: { status: PaymentHistoryItem["status"] }) {
  const map: Record<PaymentHistoryItem["status"], { label: string; cls: string }> = {
    succeeded: { label: "Paid", cls: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
    pending: { label: "Pending", cls: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
    failed: { label: "Failed", cls: "text-red-300 bg-red-400/10 border-red-400/20" },
    refunded: { label: "Refunded", cls: "text-slate-300 bg-slate-400/10 border-slate-400/20" },
  };
  const { label, cls } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

type PrintReceiptProps = {
  item: PaymentHistoryItem;
  organizationName?: string;
};

export function buildReceiptHtml({ item, organizationName }: PrintReceiptProps) {
  const date = formatDate(item.createdAt);
  const amount = formatCurrency(item.amountCents, item.currency);
  const org = organizationName ?? "Your Organization";
  return `
    <html>
      <head>
        <title>Receipt – ${date}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 48px; color: #111; max-width: 480px; margin: auto; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          .meta { color: #555; font-size: 13px; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; }
          td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; }
          td:last-child { text-align: right; font-weight: 600; }
          .total td { font-size: 16px; border-bottom: none; font-weight: 700; padding-top: 16px; }
          .footer { margin-top: 40px; font-size: 12px; color: #888; text-align: center; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>Receipt</h1>
        <p class="meta">${escapeHtml(org)} &nbsp;·&nbsp; ${escapeHtml(date)}</p>
        <table>
          <tr><td>${escapeHtml(item.description ?? "Premium subscription")}</td><td>${escapeHtml(amount)}</td></tr>
          <tr class="total"><td>Total</td><td>${escapeHtml(amount)}</td></tr>
        </table>
        <p class="footer">Transaction ID: ${escapeHtml(item.id)}</p>
      </body>
    </html>
  `;
}

export function printReceipt(item: PaymentHistoryItem, organizationName?: string) {
  const win = window.open("", "_blank", "width=540,height=600");
  if (!win) return false;
  win.document.write(buildReceiptHtml({ item, organizationName }));
  win.document.close();
  win.focus();
  win.print();
  return true;
}

export function PaymentSection() {
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function load() {
      try {
        const [subRes, histRes] = await Promise.all([
          fetch("/api/payment/subscription", { credentials: "include" }),
          fetch("/api/payment/history", { credentials: "include" }),
        ]);

        if (!mounted.current) return;

        if (!subRes.ok || !histRes.ok) {
          setError("Failed to load payment data.");
          return;
        }

        const subData = (await subRes.json()) as SubscriptionResponse;
        const histData = (await histRes.json()) as { items: PaymentHistoryItem[] };

        if (!mounted.current) return;
        setSubscription(subData);
        setHistory(histData.items ?? []);
      } catch {
        if (mounted.current) setError("Could not load payment information.");
      } finally {
        if (mounted.current) setLoading(false);
      }
    }

    void load();
    return () => { mounted.current = false; };
  }, []);

  const isPremium = subscription?.plan === "premium" && subscription.status === "active";

  return (
    <section
      className="space-y-6"
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <ReceiptText className="h-5 w-5 text-emerald-300" />
        <h2 className="text-lg font-semibold text-white">Billing & Payments</h2>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-white/8 bg-white/4"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Tier status card */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {isPremium ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                    <Crown className="h-5 w-5 text-amber-200" />
                  </span>
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                    <Zap className="h-5 w-5 text-slate-300" />
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Current plan
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-lg font-bold text-white">
                    {isPremium ? "Premium" : "Free"}
                    {isPremium ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    ) : null}
                  </p>
                  {isPremium && subscription?.currentPeriodEnd ? (
                    <p className="mt-0.5 text-xs text-slate-400">
                      Renews {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  ) : null}
                  {!isPremium ? (
                    <p className="mt-0.5 text-xs text-slate-400">
                      You are currently on the free tier.
                    </p>
                  ) : null}
                </div>
              </div>

              {!isPremium ? (
                <a
                  href="/payment"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              )}
            </div>

            {/* Plan feature comparison */}
            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/8 pt-5 sm:grid-cols-2">
              {[
                { label: "Loyalty engine access", free: true, premium: true },
                { label: "Analytics dashboard", free: true, premium: true },
                { label: "Unlimited API calls", free: false, premium: true },
                { label: "Priority support", free: false, premium: true },
              ].map(({ label, free, premium }) => {
                const included = isPremium ? premium : free;
                return (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    {included ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <span className={included ? "text-slate-100" : "text-slate-400"}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment history */}
          <div className="rounded-2xl border border-white/8 bg-white/4 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <h3 className="mb-4 text-base font-semibold text-white">Payment history</h3>

            {history.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No payments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 pr-4">Description</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {history.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-3 pr-4 text-slate-300">{formatDate(item.createdAt)}</td>
                        <td className="py-3 pr-4 text-slate-100">
                          {item.description ?? "Premium subscription"}
                        </td>
                        <td className="py-3 pr-4 font-medium text-white">
                          {formatCurrency(item.amountCents, item.currency)}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3 text-right">
                          {item.receiptUrl ? (
                            <a
                              href={item.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-300/30 hover:text-emerald-200"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Print
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => printReceipt(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-300/30 hover:text-emerald-200"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Print
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
