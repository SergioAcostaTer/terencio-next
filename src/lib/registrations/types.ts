export const REGISTRATION_STEPS = 5 as const;
export const LOCAL_STORAGE_KEY = "client-register-draft";
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;

export type RegistrationStatus =
  | "draft"
  | "submitted"
  | "review_pending"
  | "approved"
  | "rejected";

export type ClientType = "autonomo" | "empresa" | "";

export type DocumentType =
  | "nif"
  | "modelo_036_037"
  | "alta_autonomo"
  | "cif_empresa"
  | "other";

export type UploadedDocument = {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

export type AuthorizedPerson = {
  id: string;
  nombre: string;
  nif: string;
};

export type RegistrationDraftData = {
  clientType: ClientType;
  razonSocial: string;
  nombreComercial: string;
  actividad: string;
  codigoIAE: string;
  tarifa: string;
  nifCif: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  zona: string;
  telefono: string;
  movil: string;
  email: string;
  contactoPrincipal: string;
  personasAutorizadas: AuthorizedPerson[];
  observaciones: string;
  documents: UploadedDocument[];
};

export type RegistrationRecord = {
  id: string;
  status: RegistrationStatus;
  completionPercentage: number;
  currentStep: number;
  data: RegistrationDraftData;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
};

export type RegistrationDraftPayload = {
  id?: string;
  currentStep: number;
  data: RegistrationDraftData;
};

export type MissingRequirements = {
  missingFields: string[];
  missingDocuments: string[];
};

export type StepValidationResult = {
  isValid: boolean;
  fieldErrors: Record<string, string>;
  summary: string[];
};

export type RegistrationDetail = {
  record: RegistrationRecord;
  missingFields: string[];
  missingDocuments: string[];
  readyForReview: boolean;
};

export type RegistrationFilters = {
  status?: RegistrationStatus | "all";
  search?: string;
};

export type DraftStorageSnapshot = {
  draftId: string | null;
  currentStep: number;
  data: RegistrationDraftData;
  updatedAt: string | null;
  lastServerSyncAt: string | null;
};

export const registrationStatusLabels: Record<RegistrationStatus, string> = {
  draft: "Borrador",
  submitted: "Enviado",
  review_pending: "Pendiente de revisión",
  approved: "Aprobado",
  rejected: "Rechazado",
};

export const registrationStatusTone: Record<RegistrationStatus, string> = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  submitted: "border-blue-200 bg-blue-50 text-blue-700",
  review_pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

export function createEmptyRegistrationDraftData(): RegistrationDraftData {
  return {
    clientType: "",
    razonSocial: "",
    nombreComercial: "",
    actividad: "",
    codigoIAE: "",
    tarifa: "",
    nifCif: "",
    direccion: "",
    codigoPostal: "",
    poblacion: "",
    zona: "",
    telefono: "",
    movil: "",
    email: "",
    contactoPrincipal: "",
    personasAutorizadas: [],
    observaciones: "",
    documents: [],
  };
}
