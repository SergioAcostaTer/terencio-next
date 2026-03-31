export type MediaAssetPayload = {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  createdAt: string;
};

export type PlaylistItemPayload = {
  id: string;
  order: number;
  durationSec: number;
  asset: MediaAssetPayload;
};

export type PlaylistPayload = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  itemsCount?: number;
  items: PlaylistItemPayload[];
};

export type DisplayStatePayload = {
  id: string;
  name: string;
  mode: "AUTOPLAY" | "PINNED" | "MANUAL";
  isPaired: boolean;
  lastPing: string | null;
  online: boolean;
  pairingCode: string | null;
  pairingExpiresAt: string | null;
  configVersion: number;
  lastCommand: "CONFIG_SYNC" | "NEXT" | "PREVIOUS" | "RELOAD" | "RESYNC";
  lastCommandAt: string | null;
  manualIndex: number;
  pinnedAsset: MediaAssetPayload | null;
  playlist: PlaylistPayload | null;
};

export type DisplayAdminPayload = DisplayStatePayload & {
  deviceToken: string | null;
  createdAt: string;
  updatedAt: string;
};
