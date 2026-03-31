import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import { getEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getPrismaAdapter() {
  return new PrismaNeon({
    connectionString: getEnv().DATABASE_URL,
  });
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: getPrismaAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
