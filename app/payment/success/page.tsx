import { Suspense } from "react";

import PaymentSuccessClient from "./payment-success-client";

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Finalizing your payment...</h1>
            <p className="text-gray-600 mb-6">We are syncing your payment to the dashboard.</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}