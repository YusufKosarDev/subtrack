import { z } from 'zod';

/**
 * Schema for creating a new user.
 * Used by: POST /api/users
 */
export const createUserSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email must be at most 255 characters' }),

  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be at most 100 characters' }),

  name: z
    .string()
    .trim()
    .min(1, { message: 'Name cannot be empty' })
    .max(100, { message: 'Name must be at most 100 characters' })
    .optional(),
});

/**
 * Inferred TypeScript type from the schema.
 * Use this everywhere instead of manually typing the user input.
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
