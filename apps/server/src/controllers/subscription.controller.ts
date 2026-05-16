import type { Request, Response } from 'express';
import { Errors } from '../errors/app-error.js';
import { asyncHandler } from '../middlewares/async-handler.js';
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from '../schemas/subscription.schema.js';
import * as subscriptionService from '../services/subscription.service.js';

/**
 * Helper: Get the authenticated user's ID from req.user.
 * Throws 401 if not authenticated (defensive check, should be handled by requireAuth).
 */
function getUserId(req: Request): string {
  if (!req.user?.userId) {
    throw Errors.unauthorized('Not authenticated');
  }
  return req.user.userId;
}

/**
 * POST /api/subscriptions
 * Create a new subscription for the authenticated user.
 */
export const createSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const input = req.body as CreateSubscriptionInput;

  const subscription = await subscriptionService.createSubscription(userId, input);

  res.status(201).json({
    message: 'Subscription created successfully',
    subscription,
  });
});

/**
 * GET /api/subscriptions
 * List all subscriptions for the authenticated user.
 */
export const getAllSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const subscriptions = await subscriptionService.findAllSubscriptionsByUser(userId);

  res.status(200).json({
    count: subscriptions.length,
    subscriptions,
  });
});

/**
 * GET /api/subscriptions/upcoming
 * List subscriptions with payments due in the next 7 days.
 */
export const getUpcomingPayments = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  // Optional query param: ?days=14
  const days = req.query.days ? parseInt(String(req.query.days), 10) : 7;

  if (Number.isNaN(days) || days < 1 || days > 365) {
    throw Errors.badRequest('Query param "days" must be between 1 and 365');
  }

  const subscriptions = await subscriptionService.findUpcomingPaymentsForUser(userId, days);

  res.status(200).json({
    count: subscriptions.length,
    daysAhead: days,
    subscriptions,
  });
});

/**
 * GET /api/subscriptions/:id
 * Get a single subscription by ID (must belong to authenticated user).
 */
export const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const subscriptionId = req.params.id as string;

  const subscription = await subscriptionService.findSubscriptionByIdForUser(
    userId,
    subscriptionId,
  );

  res.status(200).json({ subscription });
});

/**
 * PUT /api/subscriptions/:id
 * Update a subscription (must belong to authenticated user).
 */
export const updateSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const subscriptionId = req.params.id as string;
  const input = req.body as UpdateSubscriptionInput;

  const subscription = await subscriptionService.updateSubscriptionForUser(
    userId,
    subscriptionId,
    input,
  );

  res.status(200).json({
    message: 'Subscription updated successfully',
    subscription,
  });
});

/**
 * DELETE /api/subscriptions/:id
 * Delete a subscription (must belong to authenticated user).
 */
export const deleteSubscription = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const subscriptionId = req.params.id as string;

  await subscriptionService.deleteSubscriptionForUser(userId, subscriptionId);

  res.status(204).send(); // 204 No Content: success, no body
});
