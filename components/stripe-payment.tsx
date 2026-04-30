"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PaymentButton } from "./payment-button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        onError?.(error.message || "Payment failed");
      } else {
        onSuccess?.();
      }
    } catch (err) {
      onError?.("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}

interface StripePaymentProps {
  amount: number;
  metadata?: Record<string, string>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function StripePayment({ amount, metadata, onSuccess, onError }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentIntent = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, metadata }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (clientSecret) {
    const options = {
      clientSecret,
      appearance: {
        theme: "stripe" as const,
      },
    };

    return (
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm amount={amount} onSuccess={onSuccess} onError={onError} />
      </Elements>
    );
  }

  return (
    <PaymentButton
      amount={amount}
      error={error}
      isProcessing={isProcessing}
      onStartPayment={createPaymentIntent}
      onRetry={() => {
        setError(null);
        setClientSecret(null);
        createPaymentIntent();
      }}
    />
  );
}