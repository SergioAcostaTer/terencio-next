import type { ClientType, DocumentType } from "@/lib/registrations/types";

export type RequiredDocumentDefinition = {
  type: Exclude<DocumentType, "other">;
  label: string;
  description: string;
};

const REQUIRED_DOCUMENTS: Record<Exclude<ClientType, "">, RequiredDocumentDefinition[]> = {
  autonomo: [
    {
      type: "nif",
      label: "Fotocopia del NIF",
      description: "Una imagen o PDF legible del documento identificativo.",
    },
    {
      type: "modelo_036_037",
      label: "Modelo 036/037",
      description: "Documento de alta censal o modificación.",
    },
    {
      type: "alta_autonomo",
      label: "Alta autónomo",
      description: "Justificante de alta en RETA o equivalente.",
    },
  ],
  empresa: [
    {
      type: "nif",
      label: "NIF del representante",
      description: "Imagen o PDF legible del documento de la persona representante.",
    },
    {
      type: "cif_empresa",
      label: "CIF empresa",
      description: "Documento identificativo fiscal de la sociedad.",
    },
  ],
};

export function getRequiredDocuments(clientType: ClientType) {
  if (!clientType) {
    return [];
  }

  return REQUIRED_DOCUMENTS[clientType];
}

export function getRequiredDocumentLabel(type: DocumentType) {
  return (
    Object.values(REQUIRED_DOCUMENTS)
      .flat()
      .find((item) => item.type === type)?.label ??
    "Documento adicional"
  );
}
