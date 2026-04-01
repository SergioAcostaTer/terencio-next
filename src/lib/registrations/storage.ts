import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  ACCEPTED_DOCUMENT_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  type DocumentType,
  type UploadedDocument,
} from "@/lib/registrations/types";

function getExtension(fileName: string, mimeType: string) {
  const explicitExtension = path.extname(fileName);
  if (explicitExtension) {
    return explicitExtension;
  }

  if (mimeType === "application/pdf") {
    return ".pdf";
  }
  if (mimeType === "image/png") {
    return ".png";
  }

  return ".jpg";
}

export async function storeUploadedRegistrationDocument(input: {
  draftId?: string | null;
  type: DocumentType;
  file: File;
}): Promise<UploadedDocument> {
  if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(input.file.type as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    throw new Error("Formato no permitido. Solo aceptamos PDF, JPG o PNG.");
  }

  if (input.file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("Máximo 10MB por documento.");
  }

  const bytes = Buffer.from(await input.file.arrayBuffer());
  const safeDraftId = input.draftId ?? "pending";
  const directory = path.join(process.cwd(), "public", "uploads", "registrations", safeDraftId);
  await mkdir(directory, { recursive: true });

  const documentId = crypto.randomUUID();
  const extension = getExtension(input.file.name, input.file.type);
  const fileName = `${documentId}${extension}`;
  const absolutePath = path.join(directory, fileName);
  await writeFile(absolutePath, bytes);

  return {
    id: documentId,
    type: input.type,
    fileName: input.file.name,
    fileUrl: `/uploads/registrations/${safeDraftId}/${fileName}`,
    mimeType: input.file.type,
    size: input.file.size,
    uploadedAt: new Date().toISOString(),
  };
}
