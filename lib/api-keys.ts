import { randomBytes, createHash } from "crypto";

const API_KEY_PREFIX = "oonkoo_";
const CLI_TOKEN_PREFIX = "cli_";
const API_KEY_LENGTH = 32;

/**
 * Generate a new API key
 * Returns both the raw key (to show user once) and the hashed key (for storage)
 */
export function generateApiKey(): { key: string; hash: string } {
  // Generate random bytes and convert to hex
  const randomPart = randomBytes(API_KEY_LENGTH).toString("hex");
  const key = `${API_KEY_PREFIX}${randomPart}`;

  // Hash the key for storage
  const hash = hashApiKey(key);

  return { key, hash };
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Validate API key format (traditional API key)
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length === API_KEY_PREFIX.length + API_KEY_LENGTH * 2;
}

/**
 * Validate CLI token format (from browser OAuth flow)
 */
export function isValidCliTokenFormat(key: string): boolean {
  return key.startsWith(CLI_TOKEN_PREFIX) && key.length === CLI_TOKEN_PREFIX.length + API_KEY_LENGTH * 2;
}

/**
 * Check if a key is any valid authentication token
 */
export function isValidAuthToken(key: string): boolean {
  return isValidApiKeyFormat(key) || isValidCliTokenFormat(key);
}

/**
 * Get the type of authentication token
 */
export function getTokenType(key: string): "api_key" | "cli_token" | "unknown" {
  if (isValidApiKeyFormat(key)) return "api_key";
  if (isValidCliTokenFormat(key)) return "cli_token";
  return "unknown";
}

/**
 * Mask an API key for display (show only first and last 4 characters)
 */
export function maskApiKey(key: string): string {
  if (key.length < 12) return "****";
  return `${key.slice(0, 12)}...${key.slice(-4)}`;
}
