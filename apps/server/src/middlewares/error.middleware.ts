import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';

/**
 * Centralized error handling middleware.
 *
 * MUST be the last middleware in the chain (after all routes).
 * Express recognizes it as an error handler because it has 4 parameters.
 *
 * Handles:
 * - AppError (our custom errors)
 * - ZodError (validation errors, though we usually catch them earlier)
 * - Prisma errors (P2002, P2025, etc.)
 * - Unknown errors (fallback to 500)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // -----------------------------------------------
  // 1. AppError (our custom errors)
  // -----------------------------------------------
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  // -----------------------------------------------
  // 2. Zod validation errors
  // -----------------------------------------------
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // -----------------------------------------------
  // 3. Prisma known errors (P2002, P2025, etc.)
  // -----------------------------------------------
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      res.status(409).json({
        error: `A record with this ${target} already exists`,
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
      });
      return;
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Record not found',
        code: 'NOT_FOUND',
      });
      return;
    }

    // Other Prisma errors
    res.status(400).json({
      error: 'Database operation failed',
      code: err.code,
      ...(isDevelopment && { message: err.message }),
    });
    return;
  }

  // -----------------------------------------------
  // 4. Unknown / unexpected errors
  // -----------------------------------------------
  console.error('[ERROR]', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: isDevelopment ? err.stack : undefined,
  });

  res.status(500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
    ...(isDevelopment && { stack: err.stack }),
  });
}

/**
 * 404 handler for undefined routes.
 * Should be placed BEFORE the errorHandler.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Cannot ${req.method} ${req.path}`, 404, 'ROUTE_NOT_FOUND'));
}
