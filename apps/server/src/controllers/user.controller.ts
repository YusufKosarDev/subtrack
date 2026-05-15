import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/async-handler.js';

/**
 * GET /api/users
 * Lists all users (without passwords).
 * Protected route — requires authentication.
 */
export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    count: users.length,
    users,
  });
});
