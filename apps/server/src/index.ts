import cors from 'cors';
import 'dotenv/config';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';

import userRoutes from './routes/user.routes.js';

// Express uygulamasını oluştur
const app: Express = express();

// Çevre değişkenleri
const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Global middleware'ler
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
    environment: NODE_ENV,
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'SubTrack API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
  });
});

// API routes
app.use('/api/users', userRoutes);

// =====================================
// 404 HANDLER (en sonda olmalı)
// =====================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// =====================================
// SERVER'I BAŞLAT
// =====================================
app.listen(PORT, () => {
  console.log(`🚀 SubTrack API is running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API:     http://localhost:${PORT}/api/users`);
});
