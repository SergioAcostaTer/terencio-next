CREATE TYPE "MediaAssetType" AS ENUM ('image', 'video');
CREATE TYPE "DisplayMode" AS ENUM ('AUTOPLAY', 'PINNED', 'MANUAL');
CREATE TYPE "DisplayCommand" AS ENUM ('CONFIG_SYNC', 'NEXT', 'PREVIOUS', 'RELOAD', 'RESYNC');

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "MediaAssetType" NOT NULL,
  "url" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Playlist" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlaylistAsset" (
  "id" TEXT NOT NULL,
  "playlistId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "durationSec" INTEGER NOT NULL DEFAULT 10,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlaylistAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DisplayDevice" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "pairingCode" TEXT,
  "pairingExpiresAt" TIMESTAMP(3),
  "deviceToken" TEXT,
  "isPaired" BOOLEAN NOT NULL DEFAULT false,
  "lastPing" TIMESTAMP(3),
  "mode" "DisplayMode" NOT NULL DEFAULT 'AUTOPLAY',
  "playlistId" TEXT,
  "pinnedAssetId" TEXT,
  "manualIndex" INTEGER NOT NULL DEFAULT 0,
  "configVersion" INTEGER NOT NULL DEFAULT 1,
  "lastCommand" "DisplayCommand" NOT NULL DEFAULT 'CONFIG_SYNC',
  "lastCommandAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DisplayDevice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");
CREATE UNIQUE INDEX "PlaylistAsset_playlistId_order_key" ON "PlaylistAsset"("playlistId", "order");
CREATE INDEX "PlaylistAsset_playlistId_order_idx" ON "PlaylistAsset"("playlistId", "order");
CREATE INDEX "PlaylistAsset_assetId_idx" ON "PlaylistAsset"("assetId");
CREATE UNIQUE INDEX "DisplayDevice_pairingCode_key" ON "DisplayDevice"("pairingCode");
CREATE UNIQUE INDEX "DisplayDevice_deviceToken_key" ON "DisplayDevice"("deviceToken");
CREATE INDEX "DisplayDevice_isPaired_lastPing_idx" ON "DisplayDevice"("isPaired", "lastPing");
CREATE INDEX "DisplayDevice_playlistId_idx" ON "DisplayDevice"("playlistId");
CREATE INDEX "DisplayDevice_pinnedAssetId_idx" ON "DisplayDevice"("pinnedAssetId");

ALTER TABLE "PlaylistAsset"
ADD CONSTRAINT "PlaylistAsset_playlistId_fkey"
FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlaylistAsset"
ADD CONSTRAINT "PlaylistAsset_assetId_fkey"
FOREIGN KEY ("assetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DisplayDevice"
ADD CONSTRAINT "DisplayDevice_playlistId_fkey"
FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DisplayDevice"
ADD CONSTRAINT "DisplayDevice_pinnedAssetId_fkey"
FOREIGN KEY ("pinnedAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "Playlist" ("id", "name", "createdAt", "updatedAt")
SELECT 'legacy-default-playlist', 'Migracion slides legacy', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (SELECT 1 FROM "Slide")
  AND NOT EXISTS (SELECT 1 FROM "Playlist" WHERE "id" = 'legacy-default-playlist');

INSERT INTO "MediaAsset" ("id", "name", "type", "url", "key", "createdAt")
SELECT
  "id",
  regexp_replace(split_part("key", '/', 2), '^[0-9a-fA-F-]+-', ''),
  CASE WHEN "type" = 'video' THEN 'video'::"MediaAssetType" ELSE 'image'::"MediaAssetType" END,
  "url",
  "key",
  "createdAt"
FROM "Slide"
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "PlaylistAsset" ("id", "playlistId", "assetId", "order", "durationSec", "createdAt")
SELECT
  'legacy-item-' || "id",
  'legacy-default-playlist',
  "id",
  "order",
  "durationSec",
  "createdAt"
FROM "Slide"
ON CONFLICT ("id") DO NOTHING;
