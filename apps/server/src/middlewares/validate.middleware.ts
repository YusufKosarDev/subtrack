import type { NextFunction, Request, Response } from 'express';
import { type ZodType } from 'zod';

/**
 * Generic validation middleware factory.
 *
 * Validates `req.body` against the provided Zod schema.
 * On success, replaces `req.body` with the parsed (and transformed) data.
 * On failure, responds with 400 and an array of error messages.
 *
 * @example
 *   router.post('/users', validate(createUserSchema), createUser);
 */
export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
      return;
    }

    // Parsed (validated + transformed) data'yı req.body'ye yaz
    req.body = result.data;
    next();
  };
}
