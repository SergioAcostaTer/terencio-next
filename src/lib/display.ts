import "server-only";

import { randomInt, randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";

import type {
  DisplayCommand,
  DisplayDevice,
  DisplayMode,
  MediaAsset,
  MediaAssetType,
  Prisma,
  Playlist,
  PlaylistAsset,
} from "@prisma/client";

export const DISPLAY_PAIRING_TTL_MS = 10 * 60 * 1000;
export const DISPLAY_HEARTBEAT_INTERVAL_MS = 30_000;
export const DISPLAY_ONLINE_THRESHOLD_MS = DISPLAY_HEARTBEAT_INTERVAL_MS * 3;

type DisplayDeviceWithRelations = DisplayDevice & {
  playlist: (Playlist & {
    items: Array<PlaylistAsset & { asset: MediaAsset }>;
  }) | null;
  pinnedAsset: MediaAsset | null;
};

export const displayDeviceInclude = {
  playlist: {
    include: {
      items: {
        include: {
          asset: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  },
  pinnedAsset: true,
} satisfies Prisma.DisplayDeviceInclude;

export const playlistInclude = {
  items: {
    include: {
      asset: true,
    },
    orderBy: {
      order: "asc",
    },
  },
} satisfies Prisma.PlaylistInclude;

type DisplayStreamEvent = {
  type: "state";
  payload: ReturnType<typeof serializeDisplayState>;
};

type Subscriber = (event: DisplayStreamEvent) => void;

const globalForDisplayBus = globalThis as typeof globalThis & {
  __displayBus?: EventEmitter;
};

function getDisplayBus() {
  if (!globalForDisplayBus.__displayBus) {
    globalForDisplayBus.__displayBus = new EventEmitter();
    globalForDisplayBus.__displayBus.setMaxListeners(0);
  }

  return globalForDisplayBus.__displayBus;
}

export function generatePairingCode() {
  return String(randomInt(0, 10_000)).padStart(4, "0");
}

export function generateDeviceToken() {
  return randomUUID();
}

export function getPairingExpiryDate() {
  return new Date(Date.now() + DISPLAY_PAIRING_TTL_MS);
}

export function isDisplayOnline(lastPing: Date | null) {
  if (!lastPing) {
    return false;
  }

  return Date.now() - lastPing.getTime() <= DISPLAY_ONLINE_THRESHOLD_MS;
}

export function normalizeManualIndex(index: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return ((index % total) + total) % total;
}

export function inferAssetNameFromKey(key: string) {
  const filename = key.split("/").pop() ?? key;
  return filename.replace(/^[0-9a-fA-F-]+-/, "");
}

export function createDisplayUpdateData({
  mode,
  playlistId,
  pinnedAssetId,
  manualIndex,
  lastCommand,
}: {
  mode: DisplayMode;
  playlistId?: string | null;
  pinnedAssetId?: string | null;
  manualIndex?: number;
  lastCommand: DisplayCommand;
}) {
  return {
    mode,
    playlistId: playlistId ?? null,
    pinnedAssetId: pinnedAssetId ?? null,
    ...(typeof manualIndex === "number" ? { manualIndex } : {}),
    configVersion: { increment: 1 as const },
    lastCommand,
    lastCommandAt: new Date(),
  };
}

export function serializeMediaAsset(asset: MediaAsset) {
  return {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    url: asset.url,
    createdAt: asset.createdAt.toISOString(),
  };
}

export function serializePlaylistSummary(playlist: Playlist & { items?: PlaylistAsset[] }) {
  return {
    id: playlist.id,
    name: playlist.name,
    itemsCount: playlist.items?.length ?? 0,
    createdAt: playlist.createdAt.toISOString(),
    updatedAt: playlist.updatedAt.toISOString(),
  };
}

export function serializePlaylistDetails(
  playlist: Playlist & { items: Array<PlaylistAsset & { asset: MediaAsset }> },
) {
  return {
    id: playlist.id,
    name: playlist.name,
    createdAt: playlist.createdAt.toISOString(),
    updatedAt: playlist.updatedAt.toISOString(),
    items: playlist.items.map((item) => ({
      id: item.id,
      order: item.order,
      durationSec: item.durationSec,
      asset: serializeMediaAsset(item.asset),
    })),
  };
}

export function serializeDisplayState(device: DisplayDeviceWithRelations) {
  const playlistItems = device.playlist?.items ?? [];
  const normalizedManualIndex = normalizeManualIndex(device.manualIndex, playlistItems.length);

  return {
    id: device.id,
    name: device.name,
    mode: device.mode,
    isPaired: device.isPaired,
    lastPing: device.lastPing?.toISOString() ?? null,
    online: isDisplayOnline(device.lastPing),
    pairingCode: device.pairingCode,
    pairingExpiresAt: device.pairingExpiresAt?.toISOString() ?? null,
    configVersion: device.configVersion,
    lastCommand: device.lastCommand,
    lastCommandAt: device.lastCommandAt?.toISOString() ?? null,
    manualIndex: normalizedManualIndex,
    pinnedAsset: device.pinnedAsset ? serializeMediaAsset(device.pinnedAsset) : null,
    playlist: device.playlist
      ? {
          ...serializePlaylistSummary(device.playlist),
          items: playlistItems.map((item) => ({
            id: item.id,
            order: item.order,
            durationSec: item.durationSec,
            asset: serializeMediaAsset(item.asset),
          })),
        }
      : null,
  };
}

export function serializeDisplayAdmin(device: DisplayDeviceWithRelations) {
  const state = serializeDisplayState(device);

  return {
    ...state,
    deviceToken: device.deviceToken,
    createdAt: device.createdAt.toISOString(),
    updatedAt: device.updatedAt.toISOString(),
  };
}

export function subscribeDisplay(token: string, callback: Subscriber) {
  const channel = `display:${token}`;
  const bus = getDisplayBus();
  bus.on(channel, callback);

  return () => {
    bus.off(channel, callback);
  };
}

export function publishDisplay(token: string, payload: DisplayStreamEvent["payload"]) {
  const channel = `display:${token}`;
  getDisplayBus().emit(channel, { type: "state", payload } satisfies DisplayStreamEvent);
}

export type DisplayResolvedState = ReturnType<typeof serializeDisplayState>;
export type DisplayAdminState = ReturnType<typeof serializeDisplayAdmin>;
export type SerializedPlaylist = ReturnType<typeof serializePlaylistDetails>;
export type SerializedPlaylistSummary = ReturnType<typeof serializePlaylistSummary>;
export type SerializedMediaAsset = ReturnType<typeof serializeMediaAsset>;
export type SupportedMediaType = MediaAssetType;
