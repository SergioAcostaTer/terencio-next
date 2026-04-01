"use client";

import { useMemo } from "react";

import type {
  DocumentType,
  RegistrationDraftPayload,
  RegistrationRecord,
  UploadedDocument,
} from "@/lib/registrations/types";

type DraftResponse = {
  success: true;
  record: RegistrationRecord;
};

export function useDraftSync() {
  return useMemo(() => ({
    async saveDraft(payload: RegistrationDraftPayload) {
      const response = await fetch("/api/registrations/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el borrador.");
      }

      return (await response.json()) as DraftResponse;
    },

    async fetchDraft(id: string) {
      const response = await fetch(`/api/registrations/draft/${id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("No se pudo recuperar el borrador.");
      }

      return (await response.json()) as DraftResponse;
    },

    async uploadDocument(input: {
      draftId?: string | null;
      type: DocumentType;
      file: File;
    }) {
      const formData = new FormData();
      formData.append("file", input.file);
      formData.append("type", input.type);
      if (input.draftId) {
        formData.append("draftId", input.draftId);
      }

      const response = await fetch("/api/registrations/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as
        | { success: true; document: UploadedDocument }
        | { success: false; error: string };

      if (!response.ok || !payload.success) {
        throw new Error("error" in payload ? payload.error : "No se pudo subir el documento.");
      }

      return payload.document;
    },

    async submitDraft(id: string) {
      const response = await fetch("/api/registrations/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      return (await response.json()) as
        | { success: true; record: RegistrationRecord }
        | { success: false; errors?: { fields: string[]; documents: string[] }; error?: string };
    },
  }), []);
}
