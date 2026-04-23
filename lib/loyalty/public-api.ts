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

/**
 * Pure function to extract error message from various error types
 * @param error - Error object or ZodError
 * @returns Extracted error message
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join("; ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
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

/**
 * Pure function to create error response object
 * @param message - Error message
 * @param isZodError - Whether this came from ZodError (defaults to 400 status)
 * @returns Object with error message and HTTP status code
 */
export function createErrorResponseObject(message: string, isZodError: boolean = false): { error: string; status: number } {
  const status = isZodError ? 400 : getPublicApiErrorStatus(message);
  return { error: message, status };
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