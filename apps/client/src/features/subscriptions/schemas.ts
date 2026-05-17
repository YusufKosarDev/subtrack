import { z } from "zod";

const createSubscriptionObject = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),

  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than zero")
    .max(9_999_999_999.99, "Price is too large"),

  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .transform((s) => s.toUpperCase()),

  billingCycle: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),

  category: z
    .string()
    .max(50, "Category must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),

  startDate: z.coerce
    .date()
    .refine((d) => d.getTime() <= Date.now(), {
      message: "Start date cannot be in the future",
    }),

  nextPaymentDate: z.coerce
    .date()
    .refine((d) => d.getTime() > Date.now(), {
      message: "Next payment date must be in the future",
    }),

  isTrial: z.boolean(),

  trialEndsAt: z.coerce.date().nullable().optional(),

  notes: z
    .string()
    .max(1000, "Notes must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const createSubscriptionSchema = createSubscriptionObject.refine(
  (data) => !data.isTrial || !!data.trialEndsAt,
  {
    message: "Trial end date is required when free trial is enabled",
    path: ["trialEndsAt"],
  }
);

export const updateSubscriptionSchema = createSubscriptionObject
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
