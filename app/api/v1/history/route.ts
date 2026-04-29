import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { getOrganizationFromApiKey } from "@/lib/loyalty/auth";
import { parseNonEmptyString } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

type TransactionRow = {
  id: string;
  transaction_type: "earn" | "redeem";
  points: number;
  eur_amount: string | number;
  created_at: string;
  metadata: Record<string, unknown>;
};

export async function GET(request: NextRequest) {
  try {
    const externalCustomerId = parseNonEmptyString(
      request.nextUrl.searchParams.get("externalCustomerId"),
      "externalCustomerId",
    );

    // Support both API-key auth (public API) and session auth (dashboard)
    let organizationId: string;
    const apiKey = request.headers.get("x-api-key");

    if (apiKey) {
      // Public API mode: validate API key
      const org = await getOrganizationFromApiKey(request);
      organizationId = org.id;
    } else {
      // Dashboard mode: validate session
      const membership = await getCurrentMembershipContext();
      organizationId = membership.organizationId;
    }

    const supabase = getAdminSupabaseClient();

    const { data: profile, error: profileError } = await supabase
      .from("customer_profiles")
      .select("id, external_customer_id, points_balance, total_spent_eur, created_at")
      .eq("organization_id", organizationId)
      .eq("external_customer_id", externalCustomerId)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    if (!profile) {
      throw new Error("Customer profile not found");
    }

    const { data: transactions, error: transactionsError } = await supabase
      .from("points_transactions")
      .select("id, transaction_type, points, eur_amount, created_at, metadata")
      .eq("organization_id", organizationId)
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (transactionsError) {
      throw new Error(transactionsError.message);
    }

    const history = (transactions ?? []).map((transaction: TransactionRow) => ({
      id: transaction.id,
      type: transaction.transaction_type,
      points: transaction.points,
      eurAmount: Number(transaction.eur_amount),
      createdAt: transaction.created_at,
      metadata: transaction.metadata ?? {},
    }));

    return NextResponse.json({
      organizationId: organizationId,
      externalCustomerId: profile.external_customer_id,
      customer: {
        id: profile.id,
        pointsBalance: Number(profile.points_balance),
        totalSpentEur: Number(profile.total_spent_eur),
        createdAt: profile.created_at,
      },
      history,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}