import type { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

/**
 * 🛡️ Custom Redis-backed Rate Limiter
 * @param limit Maximum allowed requests in the time window
 * @param windowSeconds Duration of the rate limit window in seconds
 */
export function rateLimiter(limit: number, windowSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Identify client by IP
    const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const routePrefix = req.baseUrl || req.path;
    const redisKey = `ratelimit:${routePrefix}:${clientIp}`;

    try {
      // 2. Increment counter atomically in Redis
      const currentCount = await redis.incr(redisKey);

      // 3. Set expiration timer on first request
      if (currentCount === 1) {
        await redis.expire(redisKey, windowSeconds);
      }

      // 4. Set standard HTTP RateLimit headers
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - currentCount));

      // 5. Exceeded limit -> Reject with HTTP 429
      if (currentCount > limit) {
        const ttl = await redis.ttl(redisKey);
        res.setHeader("Retry-After", ttl > 0 ? ttl : windowSeconds);

        return res.status(429).json({
          success: false,
          message: `Too many requests from this IP. Please try again in ${ttl > 0 ? ttl : windowSeconds} seconds.`,
        });
      }

      // Within limit: proceed to next handler!
      next();
    } catch (error) {
      // 🛡️ Fail-Open Pattern: If Redis is temporarily unreachable, do not crash the app!
      console.warn("Rate limiter error, bypassing:", error);
      next();
    }
  };
}
