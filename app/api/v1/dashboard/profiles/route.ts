import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export const runtime = "nodejs";

export async function GET() {
  try {
    const membership = await getCurrentMembershipContext();
    const supabase = getAdminSupabaseClient();

    const { data, error } = await supabase
      .from("customer_profiles")
      .select("id, external_customer_id, points_balance, total_spent_eur, created_at")
      .eq("organization_id", membership.organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      organizationId: membership.organizationId,
      profiles:
        data?.map((profile) => ({
          id: profile.id,
          externalCustomerId: profile.external_customer_id,
          pointsBalance: Number(profile.points_balance),
          totalSpentEur: Number(profile.total_spent_eur),
          createdAt: profile.created_at,
        })) ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
