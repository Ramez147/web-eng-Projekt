export function parsePositiveNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return value;
}

export function parseNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return value.trim();
}
