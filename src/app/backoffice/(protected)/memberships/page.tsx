import { BadgeCheck, Clock3, MapPin, Phone, Users2 } from "lucide-react";

import { requireAdminPermission } from "@/lib/auth";
import { getDocumentationConfig } from "@/lib/membership";
import { prisma } from "@/lib/prisma";

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

function DocBadge({
  label,
  state,
}: {
  label: string;
  state: string | null | undefined;
}) {
  const delivered = state === "delivered";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
        delivered ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {label}: {delivered ? "Entregado" : "Pendiente"}
    </span>
  );
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, string>;
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
          Backoffice / Clientes
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Altas de cliente</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Solicitudes digitales recibidas desde el QR de tienda, con datos fiscales, contacto, dirección y estado documental.
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
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Pendientes</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500 text-white">
              <Clock3 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{pendingCount}</p>
        </div>

        <div className="backoffice-stat rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Aprobadas</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-600 text-white">
              <BadgeCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{approvedCount}</p>
        </div>

        <div className="backoffice-stat rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Registros</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-950">{submissions.length}</p>
        </div>
      </section>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
          Aún no se han recibido altas de cliente.
        </div>
      ) : (
        <section className="space-y-4">
          {submissions.map((item) => {
            const docs = asRecord(item.documentationStatus);
            const authorizedPeople = Array.isArray(item.authorizedPersons)
              ? (item.authorizedPersons as Array<{ name?: string; nif?: string }>)
              : [];

            return (
              <article key={item.id} className="backoffice-card rounded-xl p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-950">{item.legalName}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        {item.type === "empresa" ? "Empresa" : "Autónomo"}
                      </span>
                    </div>
                    {item.commercialName ? (
                      <p className="mt-1 text-sm text-slate-500">&quot;{item.commercialName}&quot;</p>
                    ) : null}
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.nifCif} · {item.activity ?? "Sin actividad"} · {item.tariff ?? "Sin tarifa"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {new Intl.DateTimeFormat("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(item.submittedAt ?? item.createdAt))}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  {item.email ? (
                    <a
                      href={`mailto:${item.email}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {item.email}
                    </a>
                  ) : null}
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                    >
                      <Phone className="h-4 w-4" />
                      {item.phone}
                    </a>
                  ) : null}
                  {item.mobile ? (
                    <a
                      href={`tel:${item.mobile}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                    >
                      <Phone className="h-4 w-4" />
                      {item.mobile}
                    </a>
                  ) : null}
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <MapPin className="h-4 w-4" />
                    {[item.addressLine, item.postalCode, item.city, item.province].filter(Boolean).join(", ")}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {getDocumentationConfig(item.type as "autonomo" | "empresa").map((doc) => (
                    <DocBadge key={doc.key} label={doc.label} state={docs[doc.key]} />
                  ))}
                  {item.legalAccepted ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                      Privacidad aceptada
                    </span>
                  ) : null}
                </div>

                {authorizedPeople.length > 0 ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Personas autorizadas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {authorizedPeople.map((person, index) => (
                        <span
                          key={`${item.id}-${index}`}
                          className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
                        >
                          {[person.name, person.nif].filter(Boolean).join(" · ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {item.notes ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Observaciones</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.notes}</p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.iaeCode ? <span className="rounded-full bg-slate-100 px-3 py-1">IAE {item.iaeCode}</span> : null}
                  {item.zone ? <span className="rounded-full bg-slate-100 px-3 py-1">Zona {item.zone}</span> : null}
                  {item.source ? <span className="rounded-full bg-slate-100 px-3 py-1">Origen {item.source}</span> : null}
                  <span className="rounded-full bg-slate-100 px-3 py-1">ID {item.id}</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
