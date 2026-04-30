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
    // not signed in — client will still work but metadata won't be attached
  }

  return <PaymentPageClient userId={userId} organizationId={organizationId} />;
}