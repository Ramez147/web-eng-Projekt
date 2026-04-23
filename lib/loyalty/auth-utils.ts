
export function isValidApiKeyFormat(apiKey: string | null | undefined): boolean {
  if (!apiKey) {
    return false;
  }

  if (typeof apiKey !== "string") {
    return false;
  }

  return apiKey.length > 0;
}

export function validateApiKeyHeader(headers: Record<string, string | null>): string {
  const apiKey = headers["x-api-key"];

  if (apiKey === null || apiKey === undefined) {
    throw new Error("Missing x-api-key header");
  }

  if (!isValidApiKeyFormat(apiKey)) {
    throw new Error("Invalid x-api-key format");
  }

  return apiKey;
}

export function validateOrganizationMatch(
  organizationId: string,
  dataOrganizationId: string,
): boolean {
  return organizationId === dataOrganizationId;
}

export type ApiKeyValidationResult = {
  isValid: boolean;
  error?: string;
};

export function validateApiKeyResponse(data: any): ApiKeyValidationResult {
  if (!data) {
    return {
      isValid: false,
      error: "API key not found",
    };
  }

  if (!data.id || !data.name) {
    return {
      isValid: false,
      error: "Invalid organization data",
    };
  }

  return {
    isValid: true,
  };
}

export function extractPointsRatio(data: any): number {
  if (typeof data?.points_ratio === "number") {
    return data.points_ratio;
  }
  return 1;
}
