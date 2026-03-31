import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { getEnv } from "../src/lib/env-core";

const LEGACY_PLAYLIST_ID = "legacy-default-playlist";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getEnv().DATABASE_URL,
  }),
});

async function main() {
  const legacySlides = await prisma.slide.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  if (legacySlides.length === 0) {
    console.log("No legacy slides found. Nothing to backfill.");
    return;
  }

  await prisma.playlist.upsert({
    where: { id: LEGACY_PLAYLIST_ID },
    update: {
      name: "Migracion slides legacy",
    },
    create: {
      id: LEGACY_PLAYLIST_ID,
      name: "Migracion slides legacy",
    },
  });

  for (const slide of legacySlides) {
    await prisma.mediaAsset.upsert({
      where: { key: slide.key },
      update: {
        name: slide.key.split("/").pop()?.replace(/^[0-9a-fA-F-]+-/, "") ?? slide.key,
        type: slide.type === "video" ? "video" : "image",
        url: slide.url,
      },
      create: {
        id: slide.id,
        name: slide.key.split("/").pop()?.replace(/^[0-9a-fA-F-]+-/, "") ?? slide.key,
        type: slide.type === "video" ? "video" : "image",
        url: slide.url,
        key: slide.key,
        createdAt: slide.createdAt,
      },
    });

    await prisma.playlistAsset.upsert({
      where: {
        id: `legacy-item-${slide.id}`,
      },
      update: {
        order: slide.order,
        durationSec: slide.durationSec,
      },
      create: {
        id: `legacy-item-${slide.id}`,
        playlistId: LEGACY_PLAYLIST_ID,
        assetId: slide.id,
        order: slide.order,
        durationSec: slide.durationSec,
        createdAt: slide.createdAt,
      },
    });
  }

  console.log(`Backfilled ${legacySlides.length} slides into digital signage tables.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
