import { Router } from 'express';
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getUpcomingPayments,
  updateSubscription,
} from '../controllers/subscription.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from '../schemas/subscription.schema.js';

const router = Router();

/**
 * Subscription Routes (all protected)
 *
 * POST   /api/subscriptions          → Create new subscription
 * GET    /api/subscriptions          → List all user's subscriptions
 * GET    /api/subscriptions/upcoming → List upcoming payments (next 7 days)
 * GET    /api/subscriptions/:id      → Get one subscription
 * PUT    /api/subscriptions/:id      → Update subscription
 * DELETE /api/subscriptions/:id      → Delete subscription
 */

// Apply requireAuth to ALL routes in this router
router.use(requireAuth);

// Routes
router.post('/', validate(createSubscriptionSchema), createSubscription);
router.get('/', getAllSubscriptions);
router.get('/upcoming', getUpcomingPayments);
router.get('/:id', getSubscriptionById);
router.put('/:id', validate(updateSubscriptionSchema), updateSubscription);
router.delete('/:id', deleteSubscription);

export default router;
