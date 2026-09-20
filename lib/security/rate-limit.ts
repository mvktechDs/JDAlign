/**
 * In-memory rate limiting implementation for JDAlign.
 * Note: Serverless environments (like Vercel functions) instantiate multiple ephemeral container instances.
 * This in-memory limiter provides best-effort protection per instance.
 * For production scale-up, replace this abstraction with Redis / Upstash.
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMinutes: number = 15
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(identifier, newRecord);

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  rateLimitMap.set(identifier, record);

  return {
    allowed: true,
    limit,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}
