// src/lib/env.ts
type EnvironmentMode = 'live_mode' | 'test_mode';

/**
 * Get the Dodo Payments environment (live_mode / test_mode)
 * Returns undefined if not set or invalid
 */
export function getEnvironment(): EnvironmentMode | undefined {
  const env = process.env.DODO_PAYMENTS_ENVIRONMENT;
  if (env === 'live_mode' || env === 'test_mode') return env;
  return undefined;
}

/**
 * Get the Dodo Payments environment and throw if not valid
 */
export function getRequiredEnvironment(): EnvironmentMode {
  const env = getEnvironment();
  if (!env) throw new Error("DODO_PAYMENTS_ENVIRONMENT must be set to 'live_mode' or 'test_mode'");
  return env;
}

/**
 * Get a required API key, throws if not set
 */
export function getRequiredApiKey(): string {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) throw new Error("DODO_PAYMENTS_API_KEY environment variable is required");
  return apiKey;
}

/**
 * Get a required Webhook secret key, throws if not set
 */
export function getRequiredWebhookKey(): string {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!webhookKey) throw new Error("DODO_PAYMENTS_WEBHOOK_KEY environment variable is required");
  return webhookKey;
}

/**
 * Generic getter for any environment variable, optional fallback
 */
export function getEnvVariable(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

/**
 * Get NEXT_PUBLIC_* environment variable for client-side usage
 */
export function getPublicEnvVariable(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing required public environment variable: ${key}`);
  return value;
}

// Example exports for Dodo Payments usage
export const DODO_PAYMENTS_API_KEY = getRequiredApiKey();
export const DODO_PAYMENTS_ENVIRONMENT = getRequiredEnvironment();
export const DODO_PAYMENTS_RETURN_URL = getEnvVariable('DODO_PAYMENTS_RETURN_URL');
export const DODO_PAYMENTS_WEBHOOK_KEY = getRequiredWebhookKey();

// Optional client-side
export const NEXT_PUBLIC_DODO_PAYMENTS_ENVIRONMENT =
  getPublicEnvVariable('NEXT_PUBLIC_DODO_PAYMENTS_ENVIRONMENT', 'test_mode');
