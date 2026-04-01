import { CheckCircle2, CircleAlert, FileText } from "lucide-react";

import { getRequiredDocumentLabel } from "@/lib/registrations/requiredDocuments";
import type { RegistrationDraftData } from "@/lib/registrations/types";
import { getMissingRequirements } from "@/lib/registrations/validation";

type Step5ReviewProps = {
  data: RegistrationDraftData;
  submitError: string | null;
  submitValidation: { fields: string[]; documents: string[] } | null;
};

function SummaryBlock({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
      <p className="font-semibold text-slate-950">{title}</p>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <dt className="font-medium text-slate-500">{label}</dt>
            <dd className="text-slate-900">{value || "Sin indicar"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function Step5Review({ data, submitError, submitValidation }: Step5ReviewProps) {
  const missing = getMissingRequirements(data);

  return (
    <div className="space-y-6">
      <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
        <p className="text-lg font-bold">Antes de enviar</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Revisa el resumen. Si falta algo, puedes volver atrás sin perder progreso.
        </p>
      </div>

      {missing.missingFields.length === 0 && missing.missingDocuments.length === 0 ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Todo listo para enviar.
          </div>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold">
            <CircleAlert className="h-4 w-4" />
            Aún faltan algunos elementos antes de enviar.
          </div>
          {missing.missingFields.length > 0 ? (
            <p className="mt-3">Datos pendientes: {missing.missingFields.join(", ")}.</p>
          ) : null}
          {missing.missingDocuments.length > 0 ? (
            <p className="mt-2">Documentos pendientes: {missing.missingDocuments.join(", ")}.</p>
          ) : null}
        </div>
      )}

      {submitError ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
          {submitError}
          {submitValidation?.documents?.length ? ` Documentos: ${submitValidation.documents.join(", ")}.` : ""}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <SummaryBlock
          title="Empresa o autónomo"
          rows={[
            ["Tipo", data.clientType === "empresa" ? "Empresa" : data.clientType === "autonomo" ? "Autónomo" : ""],
            ["Razón social", data.razonSocial],
            ["Nombre comercial", data.nombreComercial],
            ["Actividad", data.actividad],
            ["Código IAE", data.codigoIAE],
            ["Tarifa", data.tarifa],
            ["NIF/CIF", data.nifCif],
          ]}
        />
        <SummaryBlock
          title="Dirección y contacto"
          rows={[
            ["Dirección", data.direccion],
            ["Código postal", data.codigoPostal],
            ["Población", data.poblacion],
            ["Zona", data.zona],
            ["Teléfono", data.telefono],
            ["Móvil", data.movil],
            ["Email", data.email],
          ]}
        />
      </div>

      <SummaryBlock
        title="Personas autorizadas"
        rows={[
          ["Contacto principal", data.contactoPrincipal],
          [
            "Autorizadas",
            data.personasAutorizadas.length > 0
              ? data.personasAutorizadas.map((person) => `${person.nombre} (${person.nif})`).join(", ")
              : "Sin personas autorizadas",
          ],
        ]}
      />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <p className="font-semibold text-slate-950">Documentación subida</p>
        </div>
        <div className="mt-4 space-y-3">
          {data.documents.length > 0 ? (
            data.documents.map((document) => (
              <div key={document.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <p className="font-semibold text-slate-900">{document.fileName}</p>
                <p className="text-slate-500">{getRequiredDocumentLabel(document.type)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Todavía no hay documentos adjuntos.</p>
          )}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-950">Observaciones</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{data.observaciones || "Sin observaciones."}</p>
      </div>
    </div>
  );
}
