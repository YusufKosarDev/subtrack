/**
 * Custom application error class with HTTP status codes.
 *
 * Extends the native Error class so it works with `instanceof` checks
 * and preserves stack traces.
 *
 * @example
 *   throw new AppError('User not found', 404);
 *   throw new AppError('Email already exists', 409, 'EMAIL_TAKEN');
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string | undefined;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Beklenen, programatik hata (bug değil)

    // Stack trace'i temizle (constructor çağrısını gösterme)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Predefined error factories for common HTTP errors.
 * Use these for consistency across the codebase.
 */
export const Errors = {
  badRequest: (message = 'Bad request'): AppError => new AppError(message, 400, 'BAD_REQUEST'),

  unauthorized: (message = 'Unauthorized'): AppError => new AppError(message, 401, 'UNAUTHORIZED'),

  forbidden: (message = 'Forbidden'): AppError => new AppError(message, 403, 'FORBIDDEN'),

  notFound: (message = 'Resource not found'): AppError => new AppError(message, 404, 'NOT_FOUND'),

  conflict: (message = 'Resource conflict'): AppError => new AppError(message, 409, 'CONFLICT'),

  internalServer: (message = 'Internal server error'): AppError =>
    new AppError(message, 500, 'INTERNAL_SERVER_ERROR'),
};
