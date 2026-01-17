import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

// Rate limit window in seconds (24 hours)
const RATE_LIMIT_WINDOW = 24 * 60 * 60;

// Singleton Redis client
let redisClient: ReturnType<typeof createClient> | null = null;
let redisConnectionFailed = false;

/**
 * Gets or creates Redis client
 */
async function getRedisClient(): Promise<ReturnType<
  typeof createClient
> | null> {
  // Skip if Redis URL not configured or connection previously failed
  if (!REDIS_URL || redisConnectionFailed) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({ url: REDIS_URL });

    redisClient.on("error", () => {
      // Mark as failed to prevent repeated connection attempts
      redisConnectionFailed = true;
      redisClient = null;
    });

    await redisClient.connect();
    return redisClient;
  } catch {
    redisConnectionFailed = true;
    return null;
  }
}

/**
 * Rate limit key format
 */
function getRateLimitKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `ratelimit:${userId}:${today}`;
}

/**
 * Checks and increments rate limit using Redis
 * Returns { allowed: boolean, remaining: number, reset: Date }
 *
 * SECURITY: When Redis is unavailable, returns source="database" to signal
 * that the caller MUST perform a database-based rate limit check.
 * The `allowed` field is set to `unknown: true` to indicate this is provisional.
 */
export async function checkRateLimit(
  userId: string,
  maxRequests: number,
): Promise<{
  allowed: boolean;
  remaining: number;
  current: number;
  reset: Date;
  source: "redis" | "database";
  requiresDatabaseCheck?: boolean;
}> {
  const redis = await getRedisClient();

  if (!redis) {
    // Fall back to database-based rate limiting
    // SECURITY: Do NOT set allowed=true blindly - caller must verify via database
    return {
      allowed: false, // Default to denied until database check confirms
      remaining: 0,
      current: 0,
      reset: getEndOfDay(),
      source: "database",
      requiresDatabaseCheck: true,
    };
  }

  const key = getRateLimitKey(userId);

  try {
    // Atomic increment and get
    const current = await redis.incr(key);

    // Set expiry on first request of the day
    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    const remaining = Math.max(0, maxRequests - current);
    const allowed = current <= maxRequests;

    return {
      allowed,
      remaining,
      current,
      reset: getEndOfDay(),
      source: "redis",
    };
  } catch {
    // Redis error, fall back to database
    // SECURITY: Do NOT set allowed=true blindly - caller must verify via database
    return {
      allowed: false,
      remaining: 0,
      current: 0,
      reset: getEndOfDay(),
      source: "database",
      requiresDatabaseCheck: true,
    };
  }
}

/**
 * Gets current rate limit count without incrementing
 */
export async function getRateLimitCount(
  userId: string,
): Promise<number | null> {
  const redis = await getRedisClient();

  if (!redis) {
    return null;
  }

  const key = getRateLimitKey(userId);

  try {
    const count = await redis.get(key);
    return count ? Number.parseInt(count, 10) : 0;
  } catch {
    return null;
  }
}

/**
 * Resets rate limit for a user (admin use)
 */
export async function resetRateLimit(userId: string): Promise<boolean> {
  const redis = await getRedisClient();

  if (!redis) {
    return false;
  }

  const key = getRateLimitKey(userId);

  try {
    await redis.del(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets end of current day (UTC)
 */
function getEndOfDay(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
}

/**
 * Returns rate limit headers for response
 */
export function getRateLimitHeaders(
  remaining: number,
  limit: number,
  reset: Date,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.floor(reset.getTime() / 1000)),
  };
}
