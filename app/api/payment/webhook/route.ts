import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Pure utility functions
export function isValidEventType(type: any): boolean {
  if (typeof type !== "string") return false;
  const validTypes = [
    "payment_intent.succeeded",
    "payment_intent.failed",
    "payment_intent.payment_failed",
    "payment_method.attached",
    "charge.succeeded",
    "charge.failed",
  ];
  return validTypes.includes(type);
}

export function isValidStripeEvent(event: any): boolean {
  if (!event || typeof event !== "object") return false;
  if (typeof event.type !== "string") return false;
  if (!event.data || typeof event.data !== "object") return false;
  if (!event.data.object || typeof event.data.object !== "object") return false;
  return true;
}

export function extractPaymentIntentFromEvent(
  event: any
): { id?: string; amount?: number } | null {
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    if (!paymentIntent || typeof paymentIntent !== "object") return null;
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
    };
  }
  return null;
}

export function extractPaymentMethodFromEvent(
  event: any
): { id?: string } | null {
  if (event.type === "payment_method.attached") {
    const paymentMethod = event.data.object;
    if (!paymentMethod || typeof paymentMethod !== "object") return null;
    return {
      id: paymentMethod.id,
    };
  }
  return null;
}

export function shouldProcessEvent(event: any): boolean {
  if (!isValidStripeEvent(event)) return false;
  return isValidEventType(event.type);
}

export function isValidWebhookHeaders(
  headers: any
): { signature?: string } {
  if (!headers) return {};
  return {
    signature: headers["stripe-signature"] || headers.get?.("stripe-signature"),
  };
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // Validate event
  if (!shouldProcessEvent(event)) {
    console.log(`Unhandled event type ${event.type}`);
    return NextResponse.json({ received: true });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const userId = pi.metadata?.user_id;
      const organizationId = pi.metadata?.organization_id;

      if (userId && organizationId) {
        const admin = getAdminSupabaseClient();

        // Record in payment_history
        const { error: paymentHistoryError } = await admin.from("payment_history").upsert(
          {
            user_id: userId,
            organization_id: organizationId,
            stripe_payment_intent_id: pi.id,
            amount_cents: pi.amount,
            currency: pi.currency,
            status: "succeeded",
            description: pi.description ?? "Premium subscription",
          },
          { onConflict: "stripe_payment_intent_id" },
        );

        if (paymentHistoryError) {
          console.error("payment_history upsert failed", paymentHistoryError);
          return NextResponse.json({ error: paymentHistoryError.message }, { status: 500 });
        }

        // Activate subscription for this user
        const { error: subscriptionError } = await admin.from("subscriptions").upsert(
          {
            user_id: userId,
            organization_id: organizationId,
            plan: "premium",
            status: "active",
            stripe_customer_id:
              typeof pi.customer === "string" ? pi.customer : null,
          },
          { onConflict: "user_id,organization_id" },
        );

        if (subscriptionError) {
          console.error("subscriptions upsert failed", subscriptionError);
          return NextResponse.json({ error: subscriptionError.message }, { status: 500 });
        }
      } else {
        console.log(
          "payment_intent.succeeded: missing user_id or organization_id in metadata, skipping DB write.",
          pi.id,
        );
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const userId = pi.metadata?.user_id;
      const organizationId = pi.metadata?.organization_id;

      if (userId && organizationId) {
        const admin = getAdminSupabaseClient();
        const { error: paymentHistoryError } = await admin.from("payment_history").upsert(
          {
            user_id: userId,
            organization_id: organizationId,
            stripe_payment_intent_id: pi.id,
            amount_cents: pi.amount,
            currency: pi.currency,
            status: "failed",
            description: pi.description ?? "Payment failed",
          },
          { onConflict: "stripe_payment_intent_id" },
        );

        if (paymentHistoryError) {
          console.error("payment_history upsert failed", paymentHistoryError);
          return NextResponse.json({ error: paymentHistoryError.message }, { status: 500 });
        }
      }
      break;
    }
    case "payment_method.attached": {
      const paymentMethod = extractPaymentMethodFromEvent(event);
      if (paymentMethod) {
        console.log("PaymentMethod was attached to a Customer!", paymentMethod.id);
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}