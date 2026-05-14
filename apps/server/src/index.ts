import cors from 'cors';
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

// Express uygulamasını oluştur
const app: Express = express();

// Çevre değişkenleri
const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

// Global middleware'ler
app.use(helmet()); // Güvenlik header'ları
app.use(cors()); // CORS izinleri
app.use(express.json()); // JSON body parsing
app.use(express.urlencoded({ extended: true })); // URL-encoded body parsing

// Basit bir health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'SubTrack API is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Kök endpoint — basit karşılama mesajı
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'SubTrack API',
    version: '0.1.0',
    docs: '/health',
  });
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 SubTrack API is running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
