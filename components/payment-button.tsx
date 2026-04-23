"use client";

import { useState } from "react";

interface PaymentButtonProps {
  amount: number;
  isProcessing?: boolean;
  onStartPayment?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function PaymentButton({
  amount,
  isProcessing = false,
  onStartPayment,
  onRetry,
  error,
}: PaymentButtonProps) {
  if (error) {
    return (
      <div className="text-red-600">
        <span>Error: {error}</span>
        <button
          onClick={onRetry}
          className="ml-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={onStartPayment}
        disabled={isProcessing}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Start Payment"}
      </button>
    </div>
  );
}
