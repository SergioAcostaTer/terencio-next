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

function createPrismaClient() {
  return new PrismaClient({
    adapter: getPrismaAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function hasDigitalSignageDelegates(client: PrismaClient | undefined) {
  if (!client) {
    return false;
  }

  return (
    "mediaAsset" in client &&
    "playlist" in client &&
    "playlistAsset" in client &&
    "displayDevice" in client
  );
}

export const prisma: PrismaClient = hasDigitalSignageDelegates(globalForPrisma.prisma)
  ? globalForPrisma.prisma!
  : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
