import { NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { generateApiKey, hashApiKey } from "@/lib/loyalty/security";
import { assignAdminMembership, getSignedInUser } from "@/lib/loyalty/user-membership";
import { parseNonEmptyString, parsePositiveNumber } from "@/lib/loyalty/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getSignedInUser();

    if (!user) {
      throw new Error("Unauthorized: please sign in");
    }

    const membershipCheckClient = getAdminSupabaseClient();
    const { data: existingMembership, error: membershipError } = await membershipCheckClient
      .from("memberships")
      .select("organization_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message);
    }

    if (existingMembership) {
      throw new Error("User already has an organization");
    }

    const body = await request.json();
    const name = parseNonEmptyString(body?.name, "name");
    const pointsRatio = parsePositiveNumber(body?.pointsRatio, "pointsRatio");

    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("organizations")
      .insert({
        name,
        points_ratio: pointsRatio,
        api_key_hash: apiKeyHash,
      })
      .select("id, name, points_ratio, created_at")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await assignAdminMembership(user.id, data.id);

    return NextResponse.json(
      {
        organization: {
          id: data.id,
          name: data.name,
          pointsRatio: Number(data.points_ratio),
          createdAt: data.created_at,
        },
        apiKey,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
