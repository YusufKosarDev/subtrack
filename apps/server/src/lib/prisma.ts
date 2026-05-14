import { PrismaClient } from '@prisma/client';

/**
 * Singleton Prisma Client instance.
 *
 * In development, hot reload can create multiple instances.
 * We attach the client to globalThis to reuse it across reloads.
 *
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prismaClient ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
