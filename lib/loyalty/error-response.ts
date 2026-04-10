import { NextResponse } from "next/server";

export function getErrorStatus(message: string): number {
  const lower = message.toLowerCase();

  if (lower.includes("insufficient points balance")) {
    return 409;
  }

  if (lower.includes("invalid api key") || lower.includes("missing x-api-key")) {
    return 401;
  }

  if (lower.includes("unauthorized") || lower.includes("please sign in")) {
    return 401;
  }

  if (lower.includes("forbidden") || lower.includes("membership")) {
    return 403;
  }

  if (lower.includes("not found")) {
    return 404;
  }

  return 400;
}

export function jsonError(message: string) {
  return NextResponse.json({ error: message }, { status: getErrorStatus(message) });
}
