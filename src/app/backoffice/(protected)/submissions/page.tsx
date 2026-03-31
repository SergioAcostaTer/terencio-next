import type { ReactNode } from "react";
import { Inbox, Mail, MessageSquareText, Newspaper, PhoneCall } from "lucide-react";

import { requireAdminPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="backoffice-stat rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-white">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  subtitle,
}: {
  title: string;
  count: number;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Bandeja
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">
        {count}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
      <Inbox className="mx-auto mb-3 h-7 w-7 text-slate-300" />
      {message}
    </div>
  );
}

export default async function SubmissionsPage() {
  await requireAdminPermission("submissions.read");

  const [contacts, professionals, newsletters] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.professionalSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.newsletterSubscription.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-10">
      <section className="backoffice-page-header px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Backoffice / Consultas
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
              Consultas Web
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Revisión centralizada de mensajes de contacto, solicitudes HORECA y
              suscripciones a newsletter.
            </p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Total registros
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">
              {contacts.length + professionals.length + newsletters.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Contacto" value={contacts.length} icon={<MessageSquareText className="h-4 w-4" />} />
        <StatCard label="Profesionales" value={professionals.length} icon={<PhoneCall className="h-4 w-4" />} />
        <StatCard label="Newsletter" value={newsletters.length} icon={<Newspaper className="h-4 w-4" />} />
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Contacto"
          count={contacts.length}
          subtitle="Mensajes directos enviados desde el formulario principal."
        />

        {contacts.length === 0 ? (
          <EmptyState message="Sin mensajes de contacto aún." />
        ) : (
          <div className="space-y-3">
            {contacts.map((item) => (
              <article
                key={item.id}
                className="backoffice-card rounded-xl p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{item.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                      {item.topic}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4" />
                    {item.email}
                  </a>
                  <a
                    href={`tel:${item.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <PhoneCall className="h-4 w-4" />
                    {item.phone}
                  </a>
                </div>

                <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Profesionales HORECA"
          count={professionals.length}
          subtitle="Solicitudes comerciales con datos de contacto para seguimiento."
        />

        {professionals.length === 0 ? (
          <EmptyState message="Sin solicitudes profesionales aún." />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {professionals.map((item) => (
              <article
                key={item.id}
                className="backoffice-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">
                      {item.businessName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">{item.sector}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <a
                    href={`mailto:${item.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4" />
                    {item.email}
                  </a>
                  <a
                    href={`tel:${item.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <PhoneCall className="h-4 w-4" />
                    {item.phone}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Newsletter"
          count={newsletters.length}
          subtitle="Suscripciones captadas para comunicaciones comerciales."
        />

        {newsletters.length === 0 ? (
          <EmptyState message="Sin suscriptores aún." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/90 text-left text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newsletters.map((item) => (
                    <tr key={item.id} className="transition hover:bg-blue-50/50">
                      <td className="px-5 py-4 font-semibold text-slate-950">{item.email}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
