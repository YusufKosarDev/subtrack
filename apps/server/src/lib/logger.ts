import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Application logger using Pino.
 *
 * In development: pretty-printed colored output (via pino-pretty).
 * In production: structured JSON output for log aggregators (Datadog, Loki, etc.).
 *
 * Log levels (lowest to highest):
 *   trace (10) → debug (20) → info (30) → warn (40) → error (50) → fatal (60)
 *
 * @example
 *   logger.info({ userId: '123' }, 'User logged in');
 *   logger.error({ err }, 'Failed to process payment');
 */
export const logger = pino({
  // Log level threshold
  // Development: show everything from debug up
  // Production: skip debug logs (reduce noise + cost)
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Pretty-print in non-production environments
  ...(env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    },
  }),

  // Production: structured JSON with readable level names
  ...(env.NODE_ENV === 'production' && {
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),

  // Redact sensitive fields automatically (security!)
  redact: {
    paths: [
      'password',
      'token',
      'authorization',
      'req.headers.authorization',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },

  // Base context attached to every log
  base: {
    env: env.NODE_ENV,
  },
});
