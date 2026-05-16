import { z } from 'zod';

/**
 * Billing cycle enum — must match Prisma's BillingCycle.
 */
export const billingCycleEnum = z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']);

/**
 * Currency code (ISO 4217) — 3 uppercase letters.
 */
const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(3, { message: 'Currency must be a 3-letter ISO code (e.g., TRY, USD, EUR)' });

/**
 * Schema for creating a new subscription.
 * Used by: POST /api/subscriptions
 */
export const createSubscriptionSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(1, { message: 'Name cannot be empty' })
      .max(100, { message: 'Name must be at most 100 characters' }),

    price: z
      .number({ message: 'Price is required' })
      .positive({ message: 'Price must be greater than 0' })
      .max(9_999_999_999.99, { message: 'Price is too large' }),

    currency: currencySchema.default('TRY'),

    billingCycle: billingCycleEnum.default('MONTHLY'),

    category: z
      .string()
      .trim()
      .min(1)
      .max(50, { message: 'Category must be at most 50 characters' })
      .optional(),

    startDate: z.coerce
      .date({ message: 'Invalid start date' })
      .refine((date) => date <= new Date(), {
        message: 'Start date cannot be in the future',
      }),

    nextPaymentDate: z.coerce
      .date({ message: 'Invalid next payment date' })
      .refine((date) => date > new Date(), {
        message: 'Next payment date must be in the future',
      }),

    isTrial: z.boolean().default(false),

    trialEndsAt: z.coerce.date().optional(),

    notes: z
      .string()
      .trim()
      .max(1000, { message: 'Notes must be at most 1000 characters' })
      .optional(),
  })
  .refine(
    (data) => {
      // If isTrial=true, trialEndsAt is required
      if (data.isTrial && !data.trialEndsAt) {
        return false;
      }
      return true;
    },
    {
      message: 'trialEndsAt is required when isTrial is true',
      path: ['trialEndsAt'],
    },
  );

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

/**
 * Schema for updating an existing subscription.
 * All fields are optional (partial update).
 * Used by: PUT /api/subscriptions/:id
 */
export const updateSubscriptionSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    price: z.number().positive().max(9_999_999_999.99).optional(),
    currency: currencySchema.optional(),
    billingCycle: billingCycleEnum.optional(),
    category: z.string().trim().min(1).max(50).nullable().optional(),
    startDate: z.coerce.date().optional(),
    nextPaymentDate: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
    isTrial: z.boolean().optional(),
    trialEndsAt: z.coerce.date().nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

/**
 * Schema for URL params (e.g., /api/subscriptions/:id).
 * Validates that the ID is a valid UUID.
 */
export const subscriptionIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid subscription ID' }),
});

export type SubscriptionIdParam = z.infer<typeof subscriptionIdParamSchema>;
