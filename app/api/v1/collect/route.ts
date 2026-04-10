import { NextRequest, NextResponse } from "next/server";
import { getOrganizationFromApiKey } from "@/lib/loyalty/auth";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { parseNonEmptyString, parsePositiveNumber } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalCustomerId = parseNonEmptyString(
      body?.externalCustomerId,
      "externalCustomerId",
    );
    const amountEur = parsePositiveNumber(body?.amountEur, "amountEur");

    const organization = await getOrganizationFromApiKey(request);

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("loyalty_earn_points", {
      p_organization_id: organization.id,
      p_external_customer_id: externalCustomerId,
      p_eur_amount: amountEur,
      p_metadata: body?.metadata ?? {},
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = data?.[0];
    if (!result) {
      throw new Error("No transaction result returned");
    }

    return NextResponse.json({
      organizationId: organization.id,
      externalCustomerId,
      profileId: result.profile_id,
      pointsCollected: result.points_earned,
      newPointsBalance: Number(result.new_points_balance),
      totalSpentEur: Number(result.total_spent_eur),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
