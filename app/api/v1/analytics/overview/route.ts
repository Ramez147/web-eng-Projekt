import { NextRequest, NextResponse } from "next/server";
import { assertOrganizationApiKey } from "@/lib/loyalty/auth";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";

export const runtime = "nodejs";

type HistoryRow = {
  id: string;
  transaction_type: "earn" | "redeem";
  points: number;
  eur_amount: number;
  created_at: string;
  profile_id: string;
};

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.nextUrl.searchParams.get("organizationId");

    if (!organizationId) {
      throw new Error("Missing query parameter: organizationId");
    }

    await assertOrganizationApiKey(request, organizationId);

    const supabase = getAdminSupabaseClient();

    const [organizationResult, profilesResult, transactionsResult] = await Promise.all([
      supabase
        .from("organizations")
        .select("id, name, points_ratio")
        .eq("id", organizationId)
        .single(),
      supabase
        .from("customer_profiles")
        .select("id, external_customer_id, points_balance, total_spent_eur")
        .eq("organization_id", organizationId),
      supabase
        .from("points_transactions")
        .select("id, transaction_type, points, eur_amount, created_at, profile_id")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (organizationResult.error) {
      throw new Error(organizationResult.error.message);
    }
    if (profilesResult.error) {
      throw new Error(profilesResult.error.message);
    }
    if (transactionsResult.error) {
      throw new Error(transactionsResult.error.message);
    }

    const profiles = profilesResult.data ?? [];
    const transactions: HistoryRow[] = transactionsResult.data ?? [];

    const profileLookup = new Map(
      profiles.map((profile) => [profile.id, profile.external_customer_id]),
    );

    const customersCount = profiles.length;
    const totalRevenueEur = profiles.reduce(
      (sum, profile) => sum + Number(profile.total_spent_eur),
      0,
    );

    const history = transactions.map((tx) => ({
      id: tx.id,
      type: tx.transaction_type,
      points: tx.points,
      eurAmount: Number(tx.eur_amount),
      createdAt: tx.created_at,
      externalCustomerId: profileLookup.get(tx.profile_id) ?? "unknown",
    }));

    const pointsHistoryByDay = history.reduce<Record<string, { earn: number; redeem: number }>>(
      (acc, tx) => {
        const day = tx.createdAt.slice(0, 10);
        if (!acc[day]) {
          acc[day] = { earn: 0, redeem: 0 };
        }

        if (tx.type === "earn") {
          acc[day].earn += tx.points;
        } else {
          acc[day].redeem += tx.points;
        }

        return acc;
      },
      {},
    );

    return NextResponse.json({
      organization: {
        id: organizationResult.data.id,
        name: organizationResult.data.name,
        pointsRatio: Number(organizationResult.data.points_ratio),
      },
      analytics: {
        customersCount,
        totalRevenueEur,
        pointsHistoryByDay,
        history,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
