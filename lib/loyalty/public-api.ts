import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { getAdminSupabaseClient } from "./db";
import { hashApiKey } from "./security";

export const collectRequestSchema = z.object({
  externalCustomerId: z.string().trim().min(1, "externalCustomerId must be a non-empty string"),
  amountEur: z.coerce.number().positive("amountEur must be greater than 0"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const redeemRequestSchema = z.object({
  externalCustomerId: z.string().trim().min(1, "externalCustomerId must be a non-empty string"),
  points: z.coerce.number().int().positive("points must be a positive integer"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type PublicApiOrganization = {
  id: string;
};

export async function getOrganizationIdFromApiKey(
  request: NextRequest,
): Promise<PublicApiOrganization> {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    throw new Error("Missing x-api-key header");
  }

  const apiKeyHash = hashApiKey(apiKey);
  const supabase = getAdminSupabaseClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("id")
    .eq("api_key_hash", apiKeyHash)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Invalid API key");
  }

  return data;
}

export function getPublicApiErrorStatus(message: string): number {
  const lower = message.toLowerCase();

  if (lower.includes("missing x-api-key") || lower.includes("invalid api key")) {
    return 401;
  }

  if (
    lower.includes("must be") ||
    lower.includes("invalid") ||
    lower.includes("required") ||
    lower.includes("insufficient points") ||
    lower.includes("organization not found") ||
    lower.includes("calculated points")
  ) {
    return 400;
  }

  return 500;
}

export function createPublicApiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join("; ");

    return NextResponse.json({ error: message }, { status: 400 });
  }

  const message = error instanceof Error ? error.message : "Unknown error";

  return NextResponse.json({ error: message }, {
    status: getPublicApiErrorStatus(message),
  });
}