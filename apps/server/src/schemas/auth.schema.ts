import { z } from 'zod';

/**
 * Schema for user login.
 * Note: We don't enforce password rules here (e.g., min length)
 * because we want to give the same "invalid credentials" error
 * regardless of why login failed (security best practice).
 */
export const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email format' }),

  password: z
    .string({ message: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
