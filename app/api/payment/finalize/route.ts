import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

type FinalizeBody = {
  paymentIntentId?: string;
};

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = (await request.json()) as FinalizeBody;

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      return NextResponse.json({ error: "paymentIntentId is required" }, { status: 400 });
    }

    const membership = await getCurrentMembershipContext();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment is not completed" }, { status: 400 });
    }

    const paymentUserId = paymentIntent.metadata?.user_id ?? membership.userId;
    const paymentOrganizationId = paymentIntent.metadata?.organization_id ?? membership.organizationId;

    const admin = getAdminSupabaseClient();

    const { error: paymentHistoryError } = await admin.from("payment_history").upsert(
      {
        user_id: paymentUserId,
        organization_id: paymentOrganizationId,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: "succeeded",
        description: paymentIntent.description ?? "Premium subscription",
      },
      { onConflict: "stripe_payment_intent_id" },
    );

    if (paymentHistoryError) {
      return NextResponse.json({ error: paymentHistoryError.message }, { status: 500 });
    }

    const { error: subscriptionError } = await admin.from("subscriptions").upsert(
      {
        user_id: paymentUserId,
        organization_id: paymentOrganizationId,
        plan: "premium",
        status: "active",
        stripe_customer_id: typeof paymentIntent.customer === "string" ? paymentIntent.customer : null,
      },
      { onConflict: "user_id,organization_id" },
    );

    if (subscriptionError) {
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Failed to finalize payment", error);
    return NextResponse.json({ error: "Failed to finalize payment" }, { status: 500 });
  }
}
