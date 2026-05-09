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
    const { data: orgSubscription, error: orgError } = await admin
      .from("subscriptions")
      .select("plan, status, current_period_end, stripe_customer_id")
      .eq("organization_id", organizationId)
      .eq("plan", "premium")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }

    if (orgSubscription) {
      const response: SubscriptionResponse = {
        plan: orgSubscription.plan,
        status: orgSubscription.status,
        currentPeriodEnd: orgSubscription.current_period_end ?? null,
        stripeCustomerId: orgSubscription.stripe_customer_id ?? null,
      };

      return NextResponse.json(response);
    }

    const { data: personalSubscription, error: personalError } = await admin
      .from("subscriptions")
      .select("plan, status, current_period_end, stripe_customer_id")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (personalError) {
      return NextResponse.json({ error: personalError.message }, { status: 500 });
    }

    if (!personalSubscription) {
      const response: SubscriptionResponse = {
        plan: "free",
        status: "active",
        currentPeriodEnd: null,
        stripeCustomerId: null,
      };
      return NextResponse.json(response);
    }

    const response: SubscriptionResponse = {
      plan: personalSubscription.plan,
      status: personalSubscription.status,
      currentPeriodEnd: personalSubscription.current_period_end ?? null,
      stripeCustomerId: personalSubscription.stripe_customer_id ?? null,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
