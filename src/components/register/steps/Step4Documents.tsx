import { CheckCircle2, Loader2, Upload, X } from "lucide-react";

import { getRequiredDocuments, getRequiredDocumentLabel } from "@/lib/registrations/requiredDocuments";
import type { DocumentType, RegistrationDraftData, UploadedDocument } from "@/lib/registrations/types";

type Step4DocumentsProps = {
  data: RegistrationDraftData;
  errors: Record<string, string>;
  uploadingType: DocumentType | null;
  uploadError: string | null;
  onUpload: (type: DocumentType, file: File) => Promise<UploadedDocument>;
  onRemove: (documentId: string) => void;
};

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadCard({
  label,
  description,
  current,
  uploading,
  onUpload,
  onRemove,
}: {
  label: string;
  description: string;
  current?: UploadedDocument;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {current ? <CheckCircle2 className="mt-1 h-5 w-5 text-green-700" /> : null}
      </div>

      {current ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm">
          <div>
            <p className="font-semibold text-emerald-900">{current.fileName}</p>
            <p className="text-emerald-700">{formatSize(current.size)} · Documento subido correctamente</p>
          </div>
          <button type="button" onClick={onRemove} className="rounded-full p-2 text-emerald-800 hover:bg-emerald-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-700 transition hover:border-green-400 hover:bg-green-50">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Subiendo..." : "Subir documento"}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onUpload(file);
                event.target.value = "";
              }
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function Step4Documents({
  data,
  errors,
  uploadingType,
  uploadError,
  onUpload,
  onRemove,
}: Step4DocumentsProps) {
  const requiredDocuments = getRequiredDocuments(data.clientType);
  const extraDocuments = data.documents.filter((item) => item.type === "other");

  return (
    <div className="space-y-6">
      {!data.clientType ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          Primero indica si eres autónomo o empresa para mostrar la documentación correcta.
        </div>
      ) : null}

      <div className="grid gap-4">
        {requiredDocuments.map((doc) => {
          const current = data.documents.find((item) => item.type === doc.type);
          return (
            <UploadCard
              key={doc.type}
              label={doc.label}
              description={doc.description}
              current={current}
              uploading={uploadingType === doc.type}
              onUpload={(file) => void onUpload(doc.type, file)}
              onRemove={() => onRemove(current!.id)}
            />
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
        <p className="font-semibold text-slate-950">Documentación extra</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Puedes añadir cualquier documento adicional que ayude a validar el alta.
        </p>
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm font-semibold text-slate-700 transition hover:border-green-400 hover:bg-green-50">
          {uploadingType === "other" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploadingType === "other" ? "Subiendo..." : "Añadir documento extra"}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void onUpload("other", file);
                event.target.value = "";
              }
            }}
          />
        </label>

        {extraDocuments.length > 0 ? (
          <div className="mt-4 space-y-3">
            {extraDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{document.fileName}</p>
                  <p className="text-slate-500">{getRequiredDocumentLabel(document.type)} · {formatSize(document.size)}</p>
                </div>
                <button type="button" onClick={() => onRemove(document.id)} className="rounded-full p-2 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {errors.documents ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errors.documents}
        </div>
      ) : null}
      {uploadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {uploadError}
        </div>
      ) : null}
      <p className="text-sm text-slate-500">Formatos admitidos: PDF, JPG y PNG. Máximo 10MB por archivo.</p>
    </div>
  );
}
