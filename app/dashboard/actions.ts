"use server";

import { z } from "zod";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { generateApiKey as createApiKeyValue, hashApiKey } from "@/lib/loyalty/security";
import { getSignedInUser } from "@/lib/loyalty/user-membership";

const organizationIdSchema = z.string().uuid("organizationId must be a valid UUID");

export async function generateApiKey(orgId: string): Promise<string> {
  const organizationId = organizationIdSchema.parse(orgId);
  const user = await getSignedInUser();

  if (!user) {
    throw new Error("Unauthorized: please sign in");
  }

  const supabase = getAdminSupabaseClient();
  const { data: membership, error: membershipError } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership || membership.role !== "admin") {
    throw new Error("Forbidden: only admins can rotate API keys");
  }

  const apiKey = createApiKeyValue();
  const apiKeyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from("organizations")
    .update({ api_key_hash: apiKeyHash })
    .eq("id", organizationId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Organization not found");
  }

  return apiKey;
}