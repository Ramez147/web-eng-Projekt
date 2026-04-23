// Pure utility functions for error response handling
// These functions don't depend on Next.js-specific APIs, making them fully testable

/**
 * Determines HTTP status code based on error message
 * @param message - Error message to analyze
 * @returns HTTP status code (400, 401, 403, 404, or 409)
 */
export function getErrorStatus(message: string): number {
  const lower = message.toLowerCase();

  // Insufficient resources
  if (lower.includes("insufficient points balance")) {
    return 409;
  }

  // Authentication errors
  if (
    lower.includes("invalid api key") ||
    lower.includes("missing x-api-key")
  ) {
    return 401;
  }

  if (lower.includes("unauthorized") || lower.includes("please sign in")) {
    return 401;
  }

  // Authorization errors
  if (lower.includes("forbidden") || lower.includes("membership")) {
    return 403;
  }

  // Not found errors
  if (lower.includes("not found")) {
    return 404;
  }

  // Default to bad request
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
