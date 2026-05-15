import cors from 'cors';
import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app: Express = express();

// =====================================
// GLOBAL MIDDLEWARES
// =====================================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// ROUTES
// =====================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'SubTrack API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'SubTrack API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// =====================================
// ERROR HANDLING (must be last!)
// =====================================
app.use(notFoundHandler);
app.use(errorHandler);

// =====================================
// START SERVER
// =====================================
app.listen(env.PORT, () => {
  console.log(`🚀 SubTrack API is running on http://localhost:${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${env.PORT}/health`);
  console.log(`🔐 Auth API:      http://localhost:${env.PORT}/api/auth`);
  console.log(`👥 Users API:     http://localhost:${env.PORT}/api/users`);
});
