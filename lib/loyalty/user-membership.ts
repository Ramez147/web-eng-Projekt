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

/**
 * Pure function to create MembershipContext from raw data
 * @param userId - User ID
 * @param organizationId - Organization ID
 * @param role - User role in organization
 * @returns MembershipContext object
 */
export function createMembershipContext(
  userId: string,
  organizationId: string,
  role: string
): MembershipContext {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid userId");
  }
  if (!organizationId || typeof organizationId !== "string") {
    throw new Error("Invalid organizationId");
  }
  if (!["admin", "member"].includes(role)) {
    throw new Error("Invalid role: must be 'admin' or 'member'");
  }

  return {
    userId,
    organizationId,
    role: role as MembershipRole,
  };
}

/**
 * Pure function to check if user has admin role
 * @param context - MembershipContext
 * @returns true if user is admin
 */
export function isAdminRole(context: MembershipContext): boolean {
  return context.role === "admin";
}

/**
 * Pure function to check if user has member role
 * @param context - MembershipContext
 * @returns true if user is member
 */
export function isMemberRole(context: MembershipContext): boolean {
  return context.role === "member";
}

/**
 * Pure function to validate membership data
 * @param data - Raw data to validate
 * @returns Validation result with error if invalid
 */
export function validateMembershipData(data: unknown): { valid: boolean; error?: string } {
  if (typeof data !== "object" || data === null) {
    return { valid: false, error: "Data must be an object" };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.organization_id !== "string" || !obj.organization_id) {
    return { valid: false, error: "organization_id is required and must be a string" };
  }

  if (typeof obj.role !== "string" || !["admin", "member"].includes(obj.role)) {
    return {
      valid: false,
      error: "role must be 'admin' or 'member'",
    };
  }

  return { valid: true };
}

/**
 * Pure function to compare membership contexts
 * @param ctx1 - First context
 * @param ctx2 - Second context
 * @returns true if contexts are equal
 */
export function areMembershipContextsEqual(
  ctx1: MembershipContext,
  ctx2: MembershipContext
): boolean {
  return (
    ctx1.userId === ctx2.userId &&
    ctx1.organizationId === ctx2.organizationId &&
    ctx1.role === ctx2.role
  );
}

/**
 * Pure function to format membership for response
 * @param context - MembershipContext
 * @returns Formatted object for API response
 */
export function formatMembershipResponse(context: MembershipContext): {
  userId: string;
  organizationId: string;
  role: string;
  isAdmin: boolean;
} {
  return {
    userId: context.userId,
    organizationId: context.organizationId,
    role: context.role,
    isAdmin: context.role === "admin",
  };
}

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

/**
 * Get current membership context or null if user has no organization
 * @returns MembershipContext or null if user has no organization
 * @throws Error if user is not signed in
 */
export async function getCurrentMembershipContextOptional(): Promise<MembershipContext | null> {
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
    return null;
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
