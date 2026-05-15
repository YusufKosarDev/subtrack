import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async route handler to forward errors to Express's error middleware.
 *
 * Without this, throwing inside an async function would cause an unhandled
 * promise rejection. With this wrapper, errors automatically flow to errorHandler.
 *
 * @example
 *   router.post('/users', asyncHandler(async (req, res) => {
 *     // Just throw — errors are caught automatically
 *     throw new AppError('Something went wrong', 400);
 *   }));
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
