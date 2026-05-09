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

  if (lower.includes("not found") || lower.includes("not found for this user")) {
    return 404;
  }

  return 400;
}

/**
 * Creates error response object
 * @param message - Error message
 * @returns Error response object with error field and appropriate status
 */
export function createErrorResponse(message: string): {
  error: string;
  status: number;
} {
  return {
    error: message,
    status: getErrorStatus(message),
  };
}

/**
 * Formats error response as JSON string for logging/debugging
 * @param message - Error message
 * @returns JSON string representation
 */
export function formatErrorResponse(message: string): string {
  const response = createErrorResponse(message);
  return JSON.stringify(response);
}

/**
 * Checks if error message indicates a specific status category
 * @param message - Error message
 * @param category - Status category: 'auth', 'permission', 'notfound', 'conflict', 'other'
 * @returns true if message matches the category
 */
export function isErrorCategory(
  message: string,
  category: "auth" | "permission" | "notfound" | "conflict" | "other"
): boolean {
  const status = getErrorStatus(message);

  switch (category) {
    case "auth":
      return status === 401;
    case "permission":
      return status === 403;
    case "notfound":
      return status === 404;
    case "conflict":
      return status === 409;
    case "other":
      return status === 400;
    default:
      return false;
  }
}

export function jsonError(message: string) {
  // Log server-side error message for easier debugging of API failures
  try {
    // Prefer structured logging when available
    // eslint-disable-next-line no-console
    console.error("API error:", message);
  } catch (e) {
    // ignore logging errors
  }

  return NextResponse.json({ error: message }, { status: getErrorStatus(message) });
}
