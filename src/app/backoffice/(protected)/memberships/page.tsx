import { BadgeCheck, FileText, FolderOpen, Users2 } from "lucide-react";

import { requireAdminPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getFileHref(
  item: {
    id: string;
    dniFileKey: string | null;
    modelFileKey: string | null;
    certificateKey: string | null;
    dniFileUrl: string | null;
    modelFileUrl: string | null;
    certificateUrl: string | null;
  },
  fileType: "dni" | "model" | "certificate",
) {
  switch (fileType) {
    case "dni":
      return item.dniFileKey ? `/api/memberships/${item.id}/files/dni` : item.dniFileUrl;
    case "model":
      return item.modelFileKey ? `/api/memberships/${item.id}/files/model` : item.modelFileUrl;
    case "certificate":
      return item.certificateKey
        ? `/api/memberships/${item.id}/files/certificate`
        : item.certificateUrl;
  }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-rose-200 bg-rose-50 text-rose-700",
  };
  const labels: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
        map[status] ?? "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function FileLink({ href, label }: { href: string | null | undefined; label: string }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 transition hover:border-blue-200 hover:bg-blue-100"
    >
      <FolderOpen className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

export default async function MembershipsPage() {
  await requireAdminPermission("memberships.read");

  const submissions = await prisma.membershipSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pendingCount = submissions.filter((item) => item.status === "pending").length;
  const approvedCount = submissions.filter((item) => item.status === "approved").length;

  return (
    <div className="space-y-8">
      <section className="backoffice-page-header px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Backoffice / Socios
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Socios</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Seguimiento visual de solicitudes de alta y documentación adjunta.
            </p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Total solicitudes
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{submissions.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="backoffice-stat rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Pendientes
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500 text-white">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{pendingCount}</p>
        </div>

        <div className="backoffice-stat rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Aprobadas
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white">
              <BadgeCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{approvedCount}</p>
        </div>

        <div className="backoffice-stat rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Registros
            </p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{submissions.length}</p>
        </div>
      </section>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          Aún no se han recibido solicitudes.
        </div>
      ) : (
        <section className="space-y-4">
          {submissions.map((item) => (
            <article
              key={item.id}
              className="backoffice-card rounded-xl p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    {item.legalName}
                  </h2>
                  {item.commercialName ? (
                    <p className="mt-1 text-sm text-slate-500">"{item.commercialName}"</p>
                  ) : null}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    NIF/CIF {item.nifCif} · {item.type}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {new Intl.DateTimeFormat("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(item.createdAt))}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <a
                  href={`mailto:${item.email}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  {item.email}
                </a>
                <a
                  href={`tel:${item.phone}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                >
                  {item.phone}
                </a>
              </div>

              {item.notes ? (
                <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item.notes}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <FileLink href={getFileHref(item, "dni")} label="DNI / CIF" />
                <FileLink href={getFileHref(item, "model")} label="Modelo 21/62" />
                <FileLink href={getFileHref(item, "certificate")} label="Certificado" />
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
