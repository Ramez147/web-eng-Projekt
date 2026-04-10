import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { jsonError } from "@/lib/loyalty/error-response";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { parseNonEmptyString } from "@/lib/loyalty/validators";

type MembershipRole = "admin" | "member";

function parseMembershipRole(value: unknown): MembershipRole {
  if (value === "admin" || value === "member") {
    return value;
  }

  throw new Error("role must be either admin or member");
}

async function findUserByEmail(email: string) {
  const supabase = getAdminSupabaseClient();
  const normalized = email.toLowerCase();
  const perPage = 200;

  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(error.message);
    }

    const found = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (found) {
      return found;
    }

    if (data.users.length < perPage) {
      break;
    }
  }

  return null;
}

async function getEmailByUserIds(userIds: string[]) {
  const supabase = getAdminSupabaseClient();
  const perPage = 200;
  const remaining = new Set(userIds);
  const map = new Map<string, string | null>();

  for (let page = 1; page <= 50 && remaining.size > 0; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(error.message);
    }

    for (const user of data.users) {
      if (remaining.has(user.id)) {
        map.set(user.id, user.email ?? null);
        remaining.delete(user.id);
      }
    }

    if (data.users.length < perPage) {
      break;
    }
  }

  return map;
}

export async function GET() {
  try {
    const membership = await getCurrentMembershipContext();

    if (membership.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from("memberships")
      .select("user_id, role, created_at")
      .eq("organization_id", membership.organizationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const rows = data ?? [];
    const emailByUserId = await getEmailByUserIds(rows.map((row) => row.user_id));

    return NextResponse.json({
      memberships: rows.map((row) => ({
        userId: row.user_id,
        email: emailByUserId.get(row.user_id) ?? null,
        role: row.role,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const membership = await getCurrentMembershipContext();

    if (membership.role !== "admin") {
      throw new Error("Forbidden: admin role required");
    }

    const body = await request.json();
    const email = parseNonEmptyString(body?.email, "email");
    const role = parseMembershipRole(body?.role);

    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error("User with this email was not found");
    }

    const supabase = getAdminSupabaseClient();
    const { error } = await supabase
      .from("memberships")
      .upsert(
        {
          user_id: user.id,
          organization_id: membership.organizationId,
          role,
        },
        { onConflict: "user_id,organization_id" },
      );

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      userId: user.id,
      email: user.email ?? email,
      role,
      organizationId: membership.organizationId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message);
  }
}