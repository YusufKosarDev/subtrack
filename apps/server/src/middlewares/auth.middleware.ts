import type { NextFunction, Request, Response } from 'express';
import { Errors } from '../errors/app-error.js';
import { verifyToken } from '../lib/jwt.js';

/**
 * Authentication middleware.
 *
 * Extracts the JWT token from the `Authorization` header,
 * verifies it, and attaches the decoded payload to `req.user`.
 *
 * Header format expected:
 *   Authorization: Bearer <token>
 *
 * @throws AppError(401) if token is missing, malformed, or invalid
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw Errors.unauthorized('Authorization header is missing');
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw Errors.unauthorized('Authorization header must be in format: Bearer <token>');
  }

  const token = parts[1];

  if (!token) {
    throw Errors.unauthorized('Token is missing');
  }

  // Verify the token (throws if invalid)
  const payload = verifyToken(token);

  // Attach user to request
  req.user = payload;

  next();
}
