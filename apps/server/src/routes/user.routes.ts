import { Router } from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * User Routes (Protected)
 *
 * GET    /api/users  → List all users (requires authentication)
 *
 * Note: Registration moved to POST /api/auth/register
 */

router.get('/', requireAuth, getAllUsers);

export default router;
