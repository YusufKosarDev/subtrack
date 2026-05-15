import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Errors } from '../errors/app-error.js';
import { signToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import type { LoginInput } from '../schemas/auth.schema.js';
import type { CreateUserInput } from '../schemas/user.schema.js';

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Creates a new user and returns a JWT token.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body as CreateUserInput;

  // Check if email is already taken
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw Errors.conflict('A user with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  res.status(201).json({
    message: 'User registered successfully',
    user,
    token,
  });
});

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token.
 *
 * Security note: Uses the same error message for "user not found"
 * and "wrong password" to prevent email enumeration attacks.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  // Find user (include password this time — we need to compare it)
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
    },
  });

  if (!user) {
    // Don't reveal whether email exists — same message as wrong password
    throw Errors.unauthorized('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw Errors.unauthorized('Invalid email or password');
  }

  // Generate JWT token
  const token = signToken({
    userId: user.id,
    email: user.email,
  });

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  });
});

/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 * Requires `requireAuth` middleware to set req.user.
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by requireAuth middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw Errors.unauthorized('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw Errors.notFound('User not found');
  }

  res.status(200).json({ user });
});
