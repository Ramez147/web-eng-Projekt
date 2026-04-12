import { NextRequest, NextResponse } from "next/server";
import {
  collectRequestSchema,
  createPublicApiErrorResponse,
  getOrganizationIdFromApiKey,
} from "@/lib/loyalty/public-api";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const organization = await getOrganizationIdFromApiKey(request);
    const body = collectRequestSchema.parse(await request.json());

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("loyalty_earn_points", {
      p_organization_id: organization.id,
      p_external_customer_id: body.externalCustomerId,
      p_eur_amount: body.amountEur,
      p_metadata: body.metadata,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) {
      throw new Error("No transaction result returned");
    }

    return NextResponse.json({
      organizationId: organization.id,
      externalCustomerId: body.externalCustomerId,
      profileId: result.profile_id,
      pointsCollected: result.points_earned,
      newPointsBalance: Number(result.new_points_balance),
      totalSpentEur: Number(result.total_spent_eur),
    });
  } catch (error) {
    return createPublicApiErrorResponse(error);
  }
}
