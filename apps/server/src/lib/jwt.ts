import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Errors } from '../errors/app-error.js';

/**
 * Payload structure for our JWT tokens.
 * Keep this minimal — JWTs are visible in payload!
 */
export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Signs a new JWT token with the given payload.
 *
 * @param payload - User information to embed (DO NOT include sensitive data)
 * @returns Signed JWT token string
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'subtrack-api',
  });
}

/**
 * Verifies and decodes a JWT token.
 *
 * @param token - The JWT token string to verify
 * @returns Decoded payload
 * @throws AppError(401) if token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: 'subtrack-api',
    });

    if (typeof decoded === 'string') {
      throw Errors.unauthorized('Invalid token format');
    }

    return {
      userId: decoded.userId as string,
      email: decoded.email as string,
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw Errors.unauthorized('Token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw Errors.unauthorized('Invalid token');
    }
    throw err;
  }
}
