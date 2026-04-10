import { NextRequest, NextResponse } from "next/server";
import { assertOrganizationApiKey } from "@/lib/loyalty/auth";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { parseNonEmptyString, parsePositiveNumber } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const organizationId = parseNonEmptyString(body?.organizationId, "organizationId");
    const externalCustomerId = parseNonEmptyString(
      body?.externalCustomerId,
      "externalCustomerId",
    );
    const pointsToRedeem = Math.floor(parsePositiveNumber(body?.points, "points"));

    await assertOrganizationApiKey(request, organizationId);

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase.rpc("loyalty_redeem_points", {
      p_organization_id: organizationId,
      p_external_customer_id: externalCustomerId,
      p_points_to_redeem: pointsToRedeem,
      p_metadata: body?.metadata ?? {},
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = data?.[0];
    if (!result) {
      throw new Error("No transaction result returned");
    }

    if (result.status !== "applied") {
      return NextResponse.json(
        {
          organizationId,
          externalCustomerId,
          status: result.status,
          message: result.message,
          newPointsBalance: Number(result.new_points_balance),
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      organizationId,
      externalCustomerId,
      profileId: result.profile_id,
      redeemedPoints: result.redeemed_points,
      newPointsBalance: Number(result.new_points_balance),
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
