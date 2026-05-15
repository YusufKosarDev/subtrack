import type { JwtPayload } from '../lib/jwt.js';

/**
 * Extend Express's Request interface to include the authenticated user.
 *
 * This makes `req.user` type-safe across the entire application.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
