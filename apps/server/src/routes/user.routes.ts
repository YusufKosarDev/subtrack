import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller.js';

const router = Router();

/**
 * User Routes
 *
 * POST   /api/users  → Create new user
 * GET    /api/users  → List all users
 */

router.post('/', createUser);
router.get('/', getAllUsers);

export default router;
