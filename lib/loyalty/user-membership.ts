import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAdminSupabaseClient } from "./db";
import { getRequiredEnv, getSupabasePublishableKey } from "./env";

type MembershipRole = "admin" | "member";

export type MembershipContext = {
  userId: string;
  organizationId: string;
  role: MembershipRole;
};

export async function getCurrentMembershipContext(): Promise<MembershipContext> {
  const user = await getSignedInUser();

  if (!user) {
    throw new Error("Unauthorized: please sign in");
  }

  const admin = getAdminSupabaseClient();
  const { data: membership, error: membershipError } = await admin
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership) {
    throw new Error("Forbidden: no organization membership found for this user");
  }

  return {
    userId: user.id,
    organizationId: membership.organization_id,
    role: membership.role as MembershipRole,
  };
}

export async function getSignedInUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function assignAdminMembership(userId: string, organizationId: string) {
  const admin = getAdminSupabaseClient();

  const { error } = await admin
    .from("memberships")
    .upsert(
      {
        user_id: userId,
        organization_id: organizationId,
        role: "admin",
      },
      { onConflict: "user_id,organization_id" },
    );

  if (error) {
    throw new Error(error.message);
  }
}
