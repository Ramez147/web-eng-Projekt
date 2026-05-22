"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Finalizing your payment...");

  useEffect(() => {
    async function finalize() {
      if (!paymentIntentId) {
        setStatus("error");
        setMessage("Missing payment intent.");
        return;
      }

      try {
        const response = await fetch("/api/payment/finalize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId }),
        });

        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(data.error || "Failed to finalize payment");
        }

        setStatus("ready");
        setMessage("Payment Successful!");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to finalize payment");
      }
    }

    void finalize();
  }, [paymentIntentId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <svg
            className={`mx-auto h-12 w-12 ${status === "error" ? "text-red-500" : "text-green-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{message}</h1>
        <p className="text-gray-600 mb-6">
          {status === "ready"
            ? "Your transaction has been finalized and should now appear in the dashboard."
            : status === "error"
              ? "The payment succeeded in Stripe, but we could not finalize it in the app."
              : "We are syncing your payment to the dashboard."}
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
