import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export type SubscriptionResponse = {
  plan: "free" | "premium";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
};

export async function GET() {
  try {
    const { userId, organizationId } = await getCurrentMembershipContext();

    const admin = getAdminSupabaseClient();
    const { data, error } = await admin
      .from("subscriptions")
      .select("plan, status, current_period_end, stripe_customer_id")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      const response: SubscriptionResponse = {
        plan: "free",
        status: "active",
        currentPeriodEnd: null,
        stripeCustomerId: null,
      };
      return NextResponse.json(response);
    }

    const response: SubscriptionResponse = {
      plan: data.plan,
      status: data.status,
      currentPeriodEnd: data.current_period_end ?? null,
      stripeCustomerId: data.stripe_customer_id ?? null,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
