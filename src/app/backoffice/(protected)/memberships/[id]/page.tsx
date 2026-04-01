import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import RegistrationStatusActions from "@/components/backoffice/RegistrationStatusActions";
import { requireAdminPermission } from "@/lib/auth";
import { getRequiredDocumentLabel } from "@/lib/registrations/requiredDocuments";
import { getRegistrationDetail } from "@/lib/registrations/service";
import { registrationStatusLabels, registrationStatusTone } from "@/lib/registrations/types";

function DetailBlock({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <section className="backoffice-card rounded-xl p-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <dl className="mt-4 grid gap-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-4 py-4">
            <dt className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</dt>
            <dd className="mt-2 text-sm leading-6 text-slate-900">{value || "Sin indicar"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminPermission("memberships.read");
  const { id } = await params;
  const detail = await getRegistrationDetail(id);

  if (!detail) {
    notFound();
  }

  const { record, missingFields, missingDocuments, readyForReview } = detail;

  return (
    <div className="space-y-6">
      <Link href="/backoffice/memberships" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      <section className="backoffice-page-header px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Detalle de registro</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">{record.data.razonSocial || "Sin razón social"}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{record.data.nifCif || "Sin NIF/CIF"} · Paso actual {record.currentStep} · {record.completionPercentage}% completado</p>
          </div>
          <div className="space-y-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${registrationStatusTone[record.status]}`}>
              {registrationStatusLabels[record.status]}
            </span>
            <RegistrationStatusActions registrationId={record.id} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_380px]">
        <div className="space-y-4">
          <DetailBlock
            title="Empresa o autónomo"
            rows={[
              ["Tipo", record.data.clientType === "empresa" ? "Empresa" : record.data.clientType === "autonomo" ? "Autónomo" : ""],
              ["Razón social", record.data.razonSocial],
              ["Nombre comercial", record.data.nombreComercial],
              ["Actividad", record.data.actividad],
              ["Código IAE", record.data.codigoIAE],
              ["Tarifa", record.data.tarifa],
              ["NIF/CIF", record.data.nifCif],
            ]}
          />
          <DetailBlock
            title="Dirección y contacto"
            rows={[
              ["Dirección", record.data.direccion],
              ["Código postal", record.data.codigoPostal],
              ["Población", record.data.poblacion],
              ["Provincia", record.data.provincia],
              ["Zona", record.data.zona],
              ["Teléfono", record.data.telefono],
              ["Móvil", record.data.movil],
              ["Email", record.data.email],
            ]}
          />
          <DetailBlock
            title="Personas autorizadas"
            rows={[
              ["Contacto principal", record.data.contactoPrincipal],
              [
                "Autorizadas",
                record.data.personasAutorizadas.length > 0
                  ? record.data.personasAutorizadas.map((person) => `${person.nombre} (${person.nif})`).join(", ")
                  : "Sin personas autorizadas",
              ],
              ["Observaciones", record.data.observaciones],
            ]}
          />
        </div>

        <div className="space-y-4">
          <section className="backoffice-card rounded-xl p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-700" />
              <h2 className="text-lg font-semibold text-slate-950">Estado operativo</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Borrador listo para revisión: <strong className="text-slate-950">{readyForReview ? "Sí" : "No"}</strong></p>
              <p>Creado: <strong className="text-slate-950">{new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.createdAt))}</strong></p>
              <p>Actualizado: <strong className="text-slate-950">{new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.updatedAt))}</strong></p>
              <p>Enviado: <strong className="text-slate-950">{record.submittedAt ? new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.submittedAt)) : "Todavía no"}</strong></p>
            </div>
          </section>

          <section className="backoffice-card rounded-xl p-5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <h2 className="text-lg font-semibold text-slate-950">Documentos subidos</h2>
            </div>
            <div className="mt-4 space-y-3">
              {record.data.documents.length > 0 ? (
                record.data.documents.map((document) => (
                  <a
                    key={document.id}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl bg-slate-50 px-4 py-4 text-sm transition hover:bg-slate-100"
                  >
                    <p className="font-semibold text-slate-900">{document.fileName}</p>
                    <p className="mt-1 text-slate-500">{getRequiredDocumentLabel(document.type)}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500">No hay documentos subidos.</p>
              )}
            </div>
          </section>

          <section className="backoffice-card rounded-xl p-5">
            <h2 className="text-lg font-semibold text-slate-950">Pendientes</h2>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-slate-900">Campos pendientes</p>
                <p className="mt-2 text-slate-600">
                  {missingFields.length > 0 ? missingFields.join(", ") : "Sin campos obligatorios pendientes."}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Documentos pendientes</p>
                <p className="mt-2 text-slate-600">
                  {missingDocuments.length > 0 ? missingDocuments.join(", ") : "Toda la documentación obligatoria está subida."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
