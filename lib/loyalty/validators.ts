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

/**
 * Validates an integer is positive
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @returns The validated positive integer
 * @throws Error if value is not a positive integer
 */
export function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return value;
}

/**
 * Validates a number is within a range
 * @param value - Value to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param fieldName - Field name for error messages
 * @returns The validated number
 * @throws Error if value is not a number or outside range
 */
export function parseNumberInRange(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${fieldName} must be a number`);
  }

  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }

  return value;
}

/**
 * Validates a string matches a pattern
 * @param value - Value to validate
 * @param pattern - Regular expression pattern
 * @param fieldName - Field name for error messages
 * @returns The validated string (trimmed)
 * @throws Error if value doesn't match pattern
 */
export function parseStringWithPattern(
  value: unknown,
  pattern: RegExp,
  fieldName: string
): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const trimmed = value.trim();

  if (!pattern.test(trimmed)) {
    throw new Error(`${fieldName} format is invalid`);
  }

  return trimmed;
}

/**
 * Validates a string has minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length
 * @param fieldName - Field name for error messages
 * @returns The validated string (trimmed)
 * @throws Error if string is too short
 */
export function parseStringMinLength(
  value: unknown,
  minLength: number,
  fieldName: string
): string {
  const str = parseNonEmptyString(value, fieldName);

  if (str.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters`);
  }

  return str;
}

/**
 * Validates a string has maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length
 * @param fieldName - Field name for error messages
 * @returns The validated string (trimmed)
 * @throws Error if string is too long
 */
export function parseStringMaxLength(
  value: unknown,
  maxLength: number,
  fieldName: string
): string {
  const str = parseNonEmptyString(value, fieldName);

  if (str.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters`);
  }

  return str;
}

/**
 * Validates a string is a valid email
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @returns The validated email (lowercased and trimmed)
 * @throws Error if not a valid email
 */
export function parseEmail(value: unknown, fieldName: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const str = parseStringWithPattern(value, emailRegex, fieldName);
  return str.toLowerCase();
}

/**
 * Validates a value is a valid UUID v4
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @returns The validated UUID
 * @throws Error if not a valid UUID
 */
export function parseUUID(value: unknown, fieldName: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return parseStringWithPattern(value, uuidRegex, fieldName);
}

/**
 * Validates a value is one of allowed values
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @param fieldName - Field name for error messages
 * @returns The validated value
 * @throws Error if value not in allowed list
 */
export function parseEnum<T>(value: unknown, allowedValues: T[], fieldName: string): T {
  if (!allowedValues.includes(value as T)) {
    throw new Error(
      `${fieldName} must be one of: ${allowedValues.join(", ")}`
    );
  }

  return value as T;
}
