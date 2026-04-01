import { getRequiredDocumentLabel, getRequiredDocuments } from "@/lib/registrations/requiredDocuments";
import type { RegistrationDraftData } from "@/lib/registrations/types";
import { getMissingRequirements } from "@/lib/registrations/validation";

type Step5ReviewProps = {
  data: RegistrationDraftData;
  submitValidation: { fields: string[]; documents: string[] } | null;
  onEditStep: (step: number) => void;
};

function SummarySection({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: Array<[string, string]>;
  onEdit: () => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <button type="button" onClick={onEdit} className="text-sm font-medium text-green-700 transition hover:text-green-800">
          Editar
        </button>
      </div>
      <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-sm font-medium text-slate-900">{value || "Sin indicar"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function Step5Review({ data, submitValidation, onEditStep }: Step5ReviewProps) {
  const missing = getMissingRequirements(data);
  const requiredDocuments = getRequiredDocuments(data.clientType);
  const allComplete = missing.missingFields.length === 0 && missing.missingDocuments.length === 0;

  return (
    <div className="space-y-4">
      {allComplete ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
          <p className="text-sm font-semibold">Todo listo para enviar</p>
          <p className="mt-1 text-sm">Hemos revisado tus datos y todo parece correcto.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="text-sm font-semibold">Faltan algunos datos</p>
          {missing.missingFields.length > 0 ? (
            <p className="mt-1 text-sm">Campos: {missing.missingFields.join(", ")}</p>
          ) : null}
          {missing.missingDocuments.length > 0 ? (
            <p className="mt-1 text-sm">Documentos: {missing.missingDocuments.join(", ")}</p>
          ) : null}
          {submitValidation?.documents?.length ? (
            <p className="mt-1 text-sm">Pendiente en envío: {submitValidation.documents.join(", ")}</p>
          ) : null}
        </div>
      )}

      <SummarySection
        title="Empresa o autónomo"
        onEdit={() => onEditStep(1)}
        rows={[
          ["Tipo", data.clientType === "empresa" ? "Empresa" : data.clientType === "autonomo" ? "Autónomo" : ""],
          ["NIF", data.nifCif],
          ["Razón social", data.razonSocial],
          ["Nombre comercial", data.nombreComercial],
          ["Actividad", data.actividad],
          ["Código IAE", data.codigoIAE],
          ["Tarifa", data.tarifa],
        ]}
      />

      <SummarySection
        title="Dirección y contacto"
        onEdit={() => onEditStep(2)}
        rows={[
          ["Dirección", data.direccion],
          ["Código postal", data.codigoPostal],
          ["Población", data.poblacion],
          ["Provincia", data.provincia],
          ["Zona", data.zona],
          ["Teléfono", data.telefono],
          ["Móvil", data.movil],
          ["Email", data.email],
        ]}
      />

      <SummarySection
        title="Personas autorizadas"
        onEdit={() => onEditStep(3)}
        rows={[
          ["Contacto principal", data.contactoPrincipal],
          [
            "Autorizadas",
            data.personasAutorizadas.length > 0
              ? data.personasAutorizadas.map((person) => `${person.nombre} (${person.nif})`).join(", ")
              : "Ninguna",
          ],
        ]}
      />

      <SummarySection
        title="Documentación"
        onEdit={() => onEditStep(4)}
        rows={[
          ...requiredDocuments.map((document) => {
            const uploaded = data.documents.find((item) => item.type === document.type);
            return [document.label, uploaded?.fileName ?? "Pendiente de subir"] as [string, string];
          }),
          ...data.documents
            .filter((document) => document.type === "other")
            .map((document) => [getRequiredDocumentLabel(document.type), document.fileName] as [string, string]),
        ]}
      />

      <SummarySection
        title="Observaciones"
        onEdit={() => onEditStep(4)}
        rows={[["Notas", data.observaciones || "Sin observaciones"]]}
      />
    </div>
  );
}
