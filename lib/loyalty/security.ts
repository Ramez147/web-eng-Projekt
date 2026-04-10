import crypto from "node:crypto";

export function generateApiKey(): string {
  const secret = crypto.randomBytes(32).toString("hex");
  return `lp_live_${secret}`;
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}
