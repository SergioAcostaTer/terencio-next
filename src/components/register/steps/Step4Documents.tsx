import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

import { ACCEPTED_DOCUMENT_MIME_TYPES, MAX_UPLOAD_SIZE_BYTES, type DocumentType, type RegistrationDraftData, type UploadedDocument } from "@/lib/registrations/types";
import { getRequiredDocuments } from "@/lib/registrations/requiredDocuments";

type Step4DocumentsProps = {
  data: RegistrationDraftData;
  errors?: Record<string, string>;
  uploadingType: DocumentType | null;
  uploadErrors: Partial<Record<DocumentType, string>>;
  onUpload: (type: DocumentType, file: File) => Promise<UploadedDocument>;
  onRemove: (documentId: string) => void;
  onSetUploadError: (type: DocumentType, message: string | null) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File) {
  if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(file.type as (typeof ACCEPTED_DOCUMENT_MIME_TYPES)[number])) {
    return "Solo aceptamos PDF, JPG o PNG.";
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "El archivo no puede superar los 10MB.";
  }

  return null;
}

function Badge({ kind }: { kind: "required" | "optional" | "uploaded" }) {
  const className =
    kind === "required"
      ? "rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700"
      : kind === "optional"
        ? "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
        : "text-xs font-semibold text-green-700";

  const label = kind === "required" ? "Obligatorio" : kind === "optional" ? "Opcional" : "Subido";

  return <span className={className}>{label}</span>;
}

function UploadCard({
  label,
  description,
  optional,
  current,
  uploading,
  error,
  onUpload,
  onRemove,
}: {
  label: string;
  description: string;
  optional?: boolean;
  current?: UploadedDocument;
  uploading: boolean;
  error?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {current ? <Badge kind="uploaded" /> : <Badge kind={optional ? "optional" : "required"} />}
      </div>

      {current ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-700" />
            <div>
              <p className="text-sm font-medium text-slate-900">{current.fileName}</p>
              <p className="text-sm text-slate-500">{formatSize(current.size)}</p>
            </div>
          </div>
          <button type="button" onClick={onRemove} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : null}
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-300 hover:text-slate-700">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            ) : (
              <Upload className="h-5 w-5 text-slate-500" />
            )}
            <span className="mt-3 text-sm font-medium text-slate-700">
              {uploading ? `Subiendo...` : "Toca para subir"}
            </span>
            <span className="mt-1 text-xs text-slate-500">PDF, JPG o PNG · Máx. 10MB</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                onUpload(file);
                event.target.value = "";
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}

export default function Step4Documents({
  data,
  errors,
  uploadingType,
  uploadErrors,
  onUpload,
  onRemove,
  onSetUploadError,
}: Step4DocumentsProps) {
  const requiredDocuments = getRequiredDocuments(data.clientType);
  const extraDocuments = data.documents.filter((item) => item.type === "other");
  const missingRequired = requiredDocuments.filter((doc) => !data.documents.some((item) => item.type === doc.type));

  function handleUpload(type: DocumentType, file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      onSetUploadError(type, validationError);
      return;
    }

    onSetUploadError(type, null);
    void onUpload(type, file);
  }

  return (
    <div className="space-y-4">
      {!data.clientType ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Primero indica si eres autónomo o empresa para mostrar la documentación correcta.
        </div>
      ) : null}

      {missingRequired.length > 0 ? (
        <div
          data-error={errors?.documents ? "true" : undefined}
          className={`rounded-xl px-4 py-3 text-sm ${
            errors?.documents
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {errors?.documents
            ? "Te faltan documentos obligatorios. Súbelos antes de continuar."
            : `Te faltan ${missingRequired.length} documentos obligatorios para completar el alta.`}
        </div>
      ) : null}

      <div className="space-y-4">
        {requiredDocuments.map((document) => {
          const current = data.documents.find((item) => item.type === document.type);

          return (
            <UploadCard
              key={document.type}
              label={document.label}
              description={document.description}
              current={current}
              uploading={uploadingType === document.type}
              error={uploadErrors[document.type]}
              onUpload={(file) => handleUpload(document.type, file)}
              onRemove={() => current && onRemove(current.id)}
            />
          );
        })}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-800">Documentación adicional (opcional)</p>

        <UploadCard
          label="Documento adicional"
          description="Adjunta cualquier archivo que ayude a validar el alta."
          optional
          uploading={uploadingType === "other"}
          error={uploadErrors.other}
          onUpload={(file) => handleUpload("other", file)}
          onRemove={() => undefined}
        />

        {extraDocuments.length > 0 ? (
          <div className="space-y-3">
            {extraDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{document.fileName}</p>
                    <p className="text-sm text-slate-500">{formatSize(document.size)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => onRemove(document.id)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
