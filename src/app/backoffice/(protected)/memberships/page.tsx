import Link from "next/link";
import { AlertTriangle, ArrowUpRight, FileWarning, Search, TimerReset } from "lucide-react";

import { requireAdminPermission } from "@/lib/auth";
import { getRequiredDocuments } from "@/lib/registrations/requiredDocuments";
import { listRegistrations } from "@/lib/registrations/service";
import {
  registrationStatusLabels,
  registrationStatusTone,
  type RegistrationStatus,
} from "@/lib/registrations/types";
import { getMissingRequirements } from "@/lib/registrations/validation";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function MembershipsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  await requireAdminPermission("memberships.read");
  const params = await searchParams;
  const status = (params.status ?? "all") as RegistrationStatus | "all";
  const search = params.search ?? "";
  const items = await listRegistrations({ status, search });

  const stats = {
    total: items.length,
    drafts: items.filter((item) => item.status === "draft").length,
    pending: items.filter((item) => item.status === "review_pending" || item.status === "submitted").length,
    stale: items.filter((item) => item.status === "draft" && item.completionPercentage < 80).length,
  };

  return (
    <div className="space-y-8">
      <section className="backoffice-page-header px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Backoffice / Clientes</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Altas de cliente</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Visibilidad completa de borradores, solicitudes enviadas y expedientes listos para revisión.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="backoffice-stat rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Total</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{stats.total}</p>
        </div>
        <div className="backoffice-stat rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Borradores</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{stats.drafts}</p>
        </div>
        <div className="backoffice-stat rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Pendientes</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{stats.pending}</p>
        </div>
        <div className="backoffice-stat rounded-xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Requieren atención</p>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{stats.stale}</p>
        </div>
      </section>

      <section className="backoffice-card rounded-xl p-4">
        <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Buscar por razón social o NIF/CIF"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-green-700"
            />
          </label>
          <select
            name="status"
            defaultValue={status}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-700"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="review_pending">Pendiente de revisión</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
          <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
            Filtrar
          </button>
        </form>
      </section>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          No hay registros para los filtros seleccionados.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Progreso</th>
                  <th className="px-5 py-4">Paso</th>
                  <th className="px-5 py-4">Docs pendientes</th>
                  <th className="px-5 py-4">Última actualización</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const missing = getMissingRequirements(item.data);
                  const requiredDocsCount = getRequiredDocuments(item.data.clientType).length;
                  const needsAttention = item.status === "draft" && (item.completionPercentage < 70 || missing.missingDocuments.length > 0);

                  return (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[320px]">
                          <p className="font-semibold text-slate-950">{item.data.razonSocial || "Sin razón social"}</p>
                          <p className="mt-1 text-slate-500">{item.data.nifCif || "Sin NIF/CIF"}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                              {item.data.clientType === "empresa" ? "Empresa" : item.data.clientType === "autonomo" ? "Autónomo" : "Pendiente"}
                            </span>
                            {needsAttention ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                                <AlertTriangle className="h-3 w-3" />
                                Atención
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${registrationStatusTone[item.status]}`}>
                          {registrationStatusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="w-40">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{item.completionPercentage}%</span>
                            <span>{missing.missingFields.length} campos</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-green-700" style={{ width: `${item.completionPercentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <TimerReset className="h-4 w-4" />
                          Paso {item.currentStep}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-600">
                        <div className="inline-flex items-center gap-2">
                          <FileWarning className="h-4 w-4" />
                          {missing.missingDocuments.length}/{requiredDocsCount}
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-slate-500">{formatDate(item.updatedAt)}</td>
                      <td className="px-5 py-4 align-top text-right">
                        <Link
                          href={`/backoffice/memberships/${item.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Ver detalle
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
