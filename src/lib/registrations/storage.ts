import "server-only";

import { uploadFile } from "@/lib/r2";
import {
  ACCEPTED_DOCUMENT_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
  type DocumentType,
  type UploadedDocument,
} from "@/lib/registrations/types";

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

  const upload = await uploadFile(input.file, "memberships");
  const documentId = crypto.randomUUID();

  return {
    id: documentId,
    type: input.type,
    fileName: input.file.name,
    fileUrl: "",
    fileKey: upload.key,
    mimeType: input.file.type,
    size: input.file.size,
    uploadedAt: new Date().toISOString(),
  };
}
