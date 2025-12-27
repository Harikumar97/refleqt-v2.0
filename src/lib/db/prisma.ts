/**
 * Prisma Client Singleton
 * Ensures single instance across the app with proper configuration for Prisma 7
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

// Prisma 7 initialization with PostgreSQL adapter
const prismaClientSingleton = () => {
  // Create PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env["DATABASE_URL"],
  });

  // Create Prisma adapter
  const adapter = new PrismaPg(pool);

  // Initialize Prisma Client with adapter
  return new PrismaClient({
    adapter,
    log:
      process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"],
  });
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env["NODE_ENV"] !== "production") globalThis.prismaGlobal = prisma;
