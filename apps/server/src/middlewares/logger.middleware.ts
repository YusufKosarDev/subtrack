import { pinoHttp } from 'pino-http';
import { logger } from '../lib/logger.js';

/**
 * HTTP request logger middleware.
 *
 * Automatically logs every incoming request with:
 *   - Method, URL, status code
 *   - Response time (ms)
 *   - User agent (without sensitive headers)
 *
 * Log level is determined by status code:
 *   - 5xx → error
 *   - 4xx → warn
 *   - 3xx → silent (don't log redirects)
 *   - 2xx → info
 *
 * Health checks (/health) are excluded to reduce noise.
 */
export const requestLogger = pinoHttp({
  logger,

  // Determine log level based on response status
  customLogLevel: (_req, res, err) => {
    if (err) return 'error';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (res.statusCode >= 300) return 'silent';
    return 'info';
  },

  // Customize log message
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} — ${err.message}`;
  },

  // Skip noisy endpoints
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },

  // Only log essential request info (don't expose full headers)
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
