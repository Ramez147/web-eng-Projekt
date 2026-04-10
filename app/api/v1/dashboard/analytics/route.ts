import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export const runtime = "nodejs";

export async function GET() {
  try {
    const membership = await getCurrentMembershipContext();
    const supabase = getAdminSupabaseClient();

    const [organizationResult, profilesResult, transactionsResult] = await Promise.all([
      supabase
        .from("organizations")
        .select("id, name, points_ratio")
        .eq("id", membership.organizationId)
        .single(),
      supabase
        .from("customer_profiles")
        .select("id, external_customer_id, points_balance, total_spent_eur")
        .eq("organization_id", membership.organizationId),
      supabase
        .from("points_transactions")
        .select("id, transaction_type, points, eur_amount, created_at, profile_id")
        .eq("organization_id", membership.organizationId)
        .order("created_at", { ascending: false }),
    ]);

    if (organizationResult.error) throw new Error(organizationResult.error.message);
    if (profilesResult.error) throw new Error(profilesResult.error.message);
    if (transactionsResult.error) throw new Error(transactionsResult.error.message);

    const profiles = profilesResult.data ?? [];
    const transactions = transactionsResult.data ?? [];

    const profileLookup = new Map(
      profiles.map((profile) => [profile.id, profile.external_customer_id]),
    );

    const pointsHistoryByDay = transactions.reduce<Record<string, { earn: number; redeem: number }>>(
      (acc, tx) => {
        const day = tx.created_at.slice(0, 10);
        if (!acc[day]) {
          acc[day] = { earn: 0, redeem: 0 };
        }

        if (tx.transaction_type === "earn") {
          acc[day].earn += tx.points;
        } else {
          acc[day].redeem += tx.points;
        }

        return acc;
      },
      {},
    );

    return NextResponse.json({
      membership: {
        userId: membership.userId,
        role: membership.role,
      },
      organization: {
        id: organizationResult.data.id,
        name: organizationResult.data.name,
        pointsRatio: Number(organizationResult.data.points_ratio),
      },
      analytics: {
        customersCount: profiles.length,
        totalTransactions: transactions.length,
        totalRevenueEur: transactions.reduce((sum, tx) => sum + Number(tx.eur_amount), 0),
        pointsHistoryByDay,
        history: transactions.map((tx) => ({
          id: tx.id,
          type: tx.transaction_type,
          points: tx.points,
          eurAmount: Number(tx.eur_amount),
          createdAt: tx.created_at,
          externalCustomerId: profileLookup.get(tx.profile_id) ?? "unknown",
        })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
