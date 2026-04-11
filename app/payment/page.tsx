"use client";

import { StripePayment } from "@/components/stripe-payment";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Premium Membership</span>
            <span className="font-semibold">$29.99</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">$29.99</span>
          </div>
        </div>

        <StripePayment
          amount={29.99}
          onSuccess={() => {
            // Handle success (e.g., redirect or show message)
            window.location.href = "/payment/success";
          }}
          onError={(error) => {
            alert(`Payment failed: ${error}`);
          }}
        />
      </div>
    </div>
  );
}