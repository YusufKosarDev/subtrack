import { z } from "zod";

const isoDateString = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "Invalid date");

const futureIsoDateString = isoDateString.refine(
  (s) => Date.parse(s) > Date.now(),
  "Date must be in the future"
);

export const createSubscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than zero"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code")
    .transform((s) => s.toUpperCase()),
  billingCycle: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
  category: z.string().max(50).optional().or(z.literal("")),
  startDate: isoDateString,
  nextPaymentDate: futureIsoDateString,
  isTrial: z.boolean().default(false),
  trialEndsAt: isoDateString.optional().nullable(),
  notes: z
    .string()
    .max(1000, "Notes must be 1000 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
