import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responseUtils.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

// Cleanup stale records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (now > record.resetTime) {
      loginAttempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * In-memory rate limiter to prevent brute force attacks on auth endpoints.
 * Allows up to `maxAttempts` within `windowMs`.
 */
export const authRateLimiter = (maxAttempts: number = 30, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    // In dev environment or test, be permissive
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${clientIp}:${req.path}`;
    const now = Date.now();

    const record = loginAttempts.get(key);

    if (!record || now > record.resetTime) {
      loginAttempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxAttempts) {
      const retrySecs = Math.ceil((record.resetTime - now) / 1000);
      return sendError(
        res,
        `Too many attempts. Please try again after ${retrySecs} seconds.`,
        429
      );
    }

    record.count += 1;
    return next();
  };
};
