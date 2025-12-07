import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Rate limit configurations for different endpoints
export const rateLimits = {
  // General API rate limit: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),

  // Auth endpoints: 10 requests per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),

  // Stripe webhooks: 50 requests per minute
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 m"),
    analytics: true,
    prefix: "ratelimit:webhook",
  }),

  // Component uploads: 5 per hour
  upload: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "ratelimit:upload",
  }),

  // Search/listing: 30 requests per minute
  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "ratelimit:search",
  }),
};

export type RateLimitType = keyof typeof rateLimits;

export async function checkRateLimit(
  type: RateLimitType,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ratelimit = rateLimits[type];
  const result = await ratelimit.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
