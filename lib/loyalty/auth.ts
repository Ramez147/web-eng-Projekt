import type { NextRequest } from "next/server";
import { getAdminSupabaseClient } from "./db";
import { hashApiKey } from "./security";

export type ApiKeyOrganization = {
  id: string;
  name: string;
  points_ratio: number;
};

export async function getOrganizationFromApiKey(
  request: NextRequest,
): Promise<ApiKeyOrganization> {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new Error("Missing x-api-key header");
  }

  const apiKeyHash = hashApiKey(apiKey);
  const supabase = getAdminSupabaseClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, points_ratio")
    .eq("api_key_hash", apiKeyHash)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Invalid API key");
  }

  return data;
}

export async function assertOrganizationApiKey(
  request: NextRequest,
  organizationId: string,
): Promise<void> {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new Error("Missing x-api-key header");
  }

  const apiKeyHash = hashApiKey(apiKey);
  const supabase = getAdminSupabaseClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", organizationId)
    .eq("api_key_hash", apiKeyHash)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Invalid API key for organization");
  }
}
