/**
 * Determines if a number should use compact notation
 * @param value - Number to check
 * @returns true if number is >= 1000
 */
export function shouldUseCompactFormat(value: number): boolean {
  return Math.abs(value) >= 1000;
}

/**
 * Extracts magnitude prefix for compact formatting
 * @param value - Number to analyze
 * @returns Magnitude string (K, M, B, etc.) or empty string if < 1000
 */
export function getMagnitudePrefix(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1000000000) return "B";
  if (absValue >= 1000000) return "M";
  if (absValue >= 1000) return "K";

  return "";
}

/**
 * Formats a number with thousand separators
 * @param value - Number to format
 * @returns Formatted string with commas
 */
export function addThousandSeparators(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Checks if a number is a whole number
 * @param value - Number to check
 * @returns true if number has no decimal part
 */
export function isWholeNumber(value: number): boolean {
  return Number.isInteger(value) || value % 1 === 0;
}

export function compactFormat(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export function standardFormat(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
}
