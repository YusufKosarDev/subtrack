import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { createUserSchema } from '../schemas/user.schema.js';

const router = Router();

/**
 * Auth Routes
 *
 * POST   /api/auth/register   → Create new user + return token
 * POST   /api/auth/login      → Validate credentials + return token
 * GET    /api/auth/me         → Get current user (requires auth)
 */

router.post('/register', validate(createUserSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getCurrentUser);

export default router;
