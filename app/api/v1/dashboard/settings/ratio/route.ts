import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { parsePositiveNumber } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const membership = await getCurrentMembershipContext();

    if (membership.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const body = await request.json();
    const pointsRatio = parsePositiveNumber(body?.pointsRatio, "pointsRatio");

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("organizations")
      .update({ points_ratio: pointsRatio })
      .eq("id", membership.organizationId)
      .select("id, points_ratio, updated_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      organizationId: data.id,
      pointsRatio: Number(data.points_ratio),
      updatedAt: data.updated_at,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
