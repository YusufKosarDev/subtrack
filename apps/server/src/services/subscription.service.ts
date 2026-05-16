import { Errors } from '../errors/app-error.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from '../schemas/subscription.schema.js';

/**
 * Subscription Service
 *
 * All business logic for subscriptions lives here.
 * Controllers should call these functions, not Prisma directly.
 *
 * Security: All functions require userId to ensure users can only
 * access their own subscriptions (prevents IDOR attacks).
 */

/**
 * Field selection for subscription responses.
 * Centralized so we don't expose internal fields by accident.
 */
const subscriptionFields = {
  id: true,
  name: true,
  price: true,
  currency: true,
  billingCycle: true,
  category: true,
  startDate: true,
  nextPaymentDate: true,
  isActive: true,
  isTrial: true,
  trialEndsAt: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Create a new subscription for the given user.
 */
export async function createSubscription(userId: string, input: CreateSubscriptionInput) {
  return prisma.subscription.create({
    data: {
      userId,
      name: input.name,
      price: input.price,
      currency: input.currency,
      billingCycle: input.billingCycle,
      category: input.category ?? null,
      startDate: input.startDate,
      nextPaymentDate: input.nextPaymentDate,
      isTrial: input.isTrial,
      trialEndsAt: input.trialEndsAt ?? null,
      notes: input.notes ?? null,
    },
    select: subscriptionFields,
  });
}

/**
 * Find all subscriptions for the given user.
 */
export async function findAllSubscriptionsByUser(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    select: subscriptionFields,
    orderBy: { nextPaymentDate: 'asc' },
  });
}

/**
 * Find a single subscription by ID, ensuring it belongs to the given user.
 * Throws 404 if not found OR if it belongs to another user (security!).
 */
export async function findSubscriptionByIdForUser(userId: string, subscriptionId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId, // ← KEY SECURITY: scoped to this user
    },
    select: subscriptionFields,
  });

  if (!subscription) {
    // Don't reveal whether subscription exists — return 404 either way
    throw Errors.notFound('Subscription not found');
  }

  return subscription;
}

/**
 * Update a subscription, ensuring it belongs to the given user.
 */
export async function updateSubscriptionForUser(
  userId: string,
  subscriptionId: string,
  input: UpdateSubscriptionInput,
) {
  // First, verify ownership (throws 404 if not found or not owned)
  await findSubscriptionByIdForUser(userId, subscriptionId);

  // Build update data — only include fields that were provided
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.price !== undefined) data.price = input.price;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.billingCycle !== undefined) data.billingCycle = input.billingCycle;
  if (input.category !== undefined) data.category = input.category;
  if (input.startDate !== undefined) data.startDate = input.startDate;
  if (input.nextPaymentDate !== undefined) data.nextPaymentDate = input.nextPaymentDate;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.isTrial !== undefined) data.isTrial = input.isTrial;
  if (input.trialEndsAt !== undefined) data.trialEndsAt = input.trialEndsAt;
  if (input.notes !== undefined) data.notes = input.notes;

  return prisma.subscription.update({
    where: { id: subscriptionId },
    data,
    select: subscriptionFields,
  });
}

/**
 * Delete a subscription, ensuring it belongs to the given user.
 */
export async function deleteSubscriptionForUser(
  userId: string,
  subscriptionId: string,
): Promise<void> {
  // Verify ownership first (throws 404 if not allowed)
  await findSubscriptionByIdForUser(userId, subscriptionId);

  await prisma.subscription.delete({
    where: { id: subscriptionId },
  });
}

/**
 * Find subscriptions with payments due within the given number of days.
 * Used for the "upcoming payments" dashboard widget.
 */
export async function findUpcomingPaymentsForUser(userId: string, daysAhead = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);

  return prisma.subscription.findMany({
    where: {
      userId,
      isActive: true,
      nextPaymentDate: {
        gte: now,
        lte: futureDate,
      },
    },
    select: subscriptionFields,
    orderBy: { nextPaymentDate: 'asc' },
  });
}
