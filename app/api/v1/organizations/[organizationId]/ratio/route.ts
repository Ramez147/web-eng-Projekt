import { NextRequest, NextResponse } from "next/server";
import { assertOrganizationApiKey } from "@/lib/loyalty/auth";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { parsePositiveNumber } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

type Params = { params: Promise<{ organizationId: string }> };

export async function PATCH(request: NextRequest, context: Params) {
  try {
    const { organizationId } = await context.params;
    await assertOrganizationApiKey(request, organizationId);

    const body = await request.json();
    const pointsRatio = parsePositiveNumber(body?.pointsRatio, "pointsRatio");

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("organizations")
      .update({ points_ratio: pointsRatio })
      .eq("id", organizationId)
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
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
