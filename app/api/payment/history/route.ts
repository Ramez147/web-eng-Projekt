import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export type PaymentHistoryItem = {
  id: string;
  amountCents: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  description: string | null;
  receiptUrl: string | null;
  createdAt: string;
};

export async function GET() {
  try {
    const { userId, organizationId } = await getCurrentMembershipContext();

    const admin = getAdminSupabaseClient();
    const { data, error } = await admin
      .from("payment_history")
      .select("id, amount_cents, currency, status, description, receipt_url, created_at")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items: PaymentHistoryItem[] = (data ?? []).map((row) => ({
      id: row.id,
      amountCents: row.amount_cents,
      currency: row.currency,
      status: row.status,
      description: row.description ?? null,
      receiptUrl: row.receipt_url ?? null,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
