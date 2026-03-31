import { z } from "zod";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const membershipFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const slideFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
];

export const membershipTypes = ["autonomo", "empresa"] as const;

export const membershipSchema = z.object({
  legalName: z.string().trim().min(2, "Indica la razón social o nombre legal."),
  commercialName: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().email("Introduce un email válido."),
  phone: z.string().trim().min(6, "Introduce un teléfono válido."),
  nifCif: z.string().trim().min(5, "Introduce el NIF o CIF."),
  type: z.enum(membershipTypes),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Introduce un email válido."),
  password: z.string().min(1, "Introduce la contraseña."),
});

export const slideFormSchema = z.object({
  type: z.enum(["image", "video"]),
  durationSec: z.coerce.number().int().min(3).max(300),
  order: z.coerce.number().int().min(0).max(9999),
  isActive: z.coerce.boolean().default(true),
});

export const slideUpdateSchema = z.object({
  durationSec: z.coerce.number().int().min(3).max(300),
  order: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export function validateUploadFile(
  file: File | null,
  {
    required,
    label,
    allowedTypes = membershipFileTypes,
  }: {
    required: boolean;
    label: string;
    allowedTypes?: string[];
  },
) {
  if (!file || file.size === 0) {
    if (required) {
      throw new Error(`${label} es obligatorio.`);
    }

    return null;
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} no tiene un formato compatible.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${label} supera el máximo de 10 MB.`);
  }

  return file;
}
