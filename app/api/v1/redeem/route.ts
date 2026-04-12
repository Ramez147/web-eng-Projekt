import { NextRequest, NextResponse } from "next/server";
import {
  createPublicApiErrorResponse,
  getOrganizationIdFromApiKey,
  redeemRequestSchema,
} from "@/lib/loyalty/public-api";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const organization = await getOrganizationIdFromApiKey(request);
    const body = redeemRequestSchema.parse(await request.json());

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("loyalty_redeem_points", {
      p_organization_id: organization.id,
      p_external_customer_id: body.externalCustomerId,
      p_points_to_redeem: body.points,
      p_metadata: body.metadata,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (!result) {
      throw new Error("No transaction result returned");
    }

    if (result.status !== "applied") {
      return NextResponse.json(
        {
          error: result.message,
          status: result.status,
          newPointsBalance: Number(result.new_points_balance),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      organizationId: organization.id,
      externalCustomerId: body.externalCustomerId,
      profileId: result.profile_id,
      redeemedPoints: result.redeemed_points,
      newPointsBalance: Number(result.new_points_balance),
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    return createPublicApiErrorResponse(error);
  }
}
