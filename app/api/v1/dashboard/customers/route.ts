import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export const runtime = "nodejs";

const DEFAULT_PAGE_SIZE = 4;

function parsePositiveInteger(input: string | null, fallback: number) {
  const value = Number.parseInt(input ?? "", 10);

  if (!Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return value;
}

export async function GET(request: NextRequest) {
  try {
    const membership = await getCurrentMembershipContext();

    if (membership.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("q")?.trim() ?? "";
    const page = parsePositiveInteger(url.searchParams.get("page"), 1);
    const pageSize = parsePositiveInteger(url.searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
    const offset = (page - 1) * pageSize;

    const supabase = getAdminSupabaseClient();
    const baseQuery = supabase
      .from("customer_profiles")
      .select("id, external_customer_id, points_balance, total_spent_eur, created_at", { count: "exact" })
      .eq("organization_id", membership.organizationId)
      .order("created_at", { ascending: false })
      .order("external_customer_id", { ascending: true });

    const filteredQuery = search
      ? baseQuery.ilike("external_customer_id", `%${search}%`)
      : baseQuery;

    const { data, error, count } = await filteredQuery.range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    const rows =
      data?.map((row) => ({
        id: row.id,
        externalCustomerId: row.external_customer_id,
        pointsBalance: Number(row.points_balance),
        totalSpentEur: Number(row.total_spent_eur),
        createdAt: row.created_at,
      })) ?? [];

    return NextResponse.json({
      totalCount: count ?? 0,
      rows,
      page,
      pageSize,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}
