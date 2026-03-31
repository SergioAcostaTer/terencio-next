import { z } from "zod";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;

export const mediaAssetFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export const createPlaylistSchema = z.object({
  name: z.string().trim().min(2, "Indica un nombre para la playlist.").max(120),
});

export const createPlaylistItemSchema = z.object({
  assetId: z.string().min(1),
  durationSec: z.coerce.number().int().min(3).max(300),
});

export const updatePlaylistSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0).max(9999),
        durationSec: z.number().int().min(3).max(300),
      }),
    )
    .optional(),
});

export const displayPairSchema = z.object({
  pairingCode: z.string().trim().regex(/^\d{4}$/, "El PIN debe tener 4 dígitos."),
  name: z.string().trim().min(2, "Indica un nombre para la pantalla.").max(120),
});

export const updateDisplaySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  mode: z.enum(["AUTOPLAY", "PINNED", "MANUAL"]).optional(),
  playlistId: z.string().min(1).nullable().optional(),
  pinnedAssetId: z.string().min(1).nullable().optional(),
  manualIndex: z.number().int().min(0).optional(),
});

export const displayCommandSchema = z.object({
  command: z.enum(["NEXT", "PREVIOUS", "RELOAD", "RESYNC"]),
});

export const deviceSessionSchema = z.object({
  deviceToken: z.string().uuid("Token de dispositivo no válido."),
});

export function validateMediaUpload(file: File | null) {
  if (!file || file.size === 0) {
    throw new Error("Debes seleccionar un archivo.");
  }

  if (!mediaAssetFileTypes.includes(file.type)) {
    throw new Error("El archivo no tiene un formato compatible.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("El archivo supera el máximo de 100 MB.");
  }

  return file;
}
