/**
 * Prisma Client Singleton
 * Ensures single instance across the app with proper configuration for Prisma 7
 */

import { PrismaClient } from "@prisma/client";

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

// Prisma 7 initialization
// DATABASE_URL from .env.local is read automatically
// prisma.config.ts provides the datasource configuration
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"],
  });
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env["NODE_ENV"] !== "production") globalThis.prismaGlobal = prisma;
