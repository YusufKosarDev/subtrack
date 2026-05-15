import { z } from 'zod';

/**
 * Schema for required environment variables.
 * Validates at startup — fails loudly if anything is missing or invalid.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z
    .string()
    .default('3000')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),

  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),

  JWT_SECRET: z
    .string()
    .min(32, { message: 'JWT_SECRET must be at least 32 characters for security' }),

  JWT_EXPIRES_IN: z.string().default('7d'),
});

/**
 * Validated environment variables.
 * Throws on startup if validation fails.
 */
function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1); // Server'ı başlatma, hemen çık
  }

  return result.data;
}

export const env = loadEnv();

export type Env = z.infer<typeof envSchema>;
