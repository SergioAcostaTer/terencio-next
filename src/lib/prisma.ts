import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { getEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getPrismaAdapter() {
  return new PrismaPg({
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
