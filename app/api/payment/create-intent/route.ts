import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Pure utility functions
export function isValidAmount(amount: any): boolean {
  if (typeof amount !== "number") return false;
  if (amount <= 0) return false;
  if (!isFinite(amount)) return false;
  return true;
}

export function isValidCurrency(currency: any): boolean {
  const validCurrencies = ["usd", "eur", "gbp", "jpy", "cad", "aud"];
  if (typeof currency !== "string") return false;
  return validCurrencies.includes(currency.toLowerCase());
}

export function convertAmountToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function isValidPaymentIntentResponse(response: any): boolean {
  if (!response || typeof response !== "object") return false;
  if (typeof response.client_secret !== "string") return false;
  if (response.client_secret.length === 0) return false;
  return true;
}

export function parsePaymentRequest(body: any): {
  amount?: number;
  currency: string;
  metadata?: Record<string, string>;
} {
  const { amount, currency = "usd", metadata } = body;
  return {
    amount,
    currency,
    metadata: metadata || {},
  };
}

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const body = await request.json();
    const { amount, currency, metadata } = parsePaymentRequest(body);

    if (!isValidAmount(amount)) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!isValidCurrency(currency)) {
      return NextResponse.json(
        { error: "Invalid currency" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertAmountToCents(amount as number),
      currency,
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    if (!isValidPaymentIntentResponse(paymentIntent)) {
      return NextResponse.json(
        { error: "Invalid Stripe response" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}