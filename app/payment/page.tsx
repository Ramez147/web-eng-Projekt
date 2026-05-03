import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { PaymentPageClient } from "./client";

export default async function PaymentPage() {
  let userId: string | undefined;
  let organizationId: string | undefined;

  try {
    const membership = await getCurrentMembershipContext();
    userId = membership.userId;
    organizationId = membership.organizationId;
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">Payment unavailable</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in again and open the payment page from an account with an organization membership.
          </p>
        </div>
      </div>
    );
  }

  return <PaymentPageClient userId={userId} organizationId={organizationId} />;
}