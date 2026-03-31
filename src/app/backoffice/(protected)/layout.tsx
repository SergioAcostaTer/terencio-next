import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  MonitorPlay,
  PanelsTopLeft,
  ShieldCheck,
  Users2,
} from "lucide-react";

import LogoutButton from "@/components/backoffice/LogoutButton";
import { requireAdminSession } from "@/lib/auth";

const navLinks = [
  {
    href: "/backoffice/submissions",
    label: "Consultas",
    description: "Mensajes y captación",
    icon: PanelsTopLeft,
  },
  {
    href: "/backoffice/memberships",
    label: "Socios",
    description: "Altas y documentación",
    icon: Users2,
  },
  {
    href: "/backoffice/slides",
    label: "Pantalla TV",
    description: "Creatividades del display",
    icon: MonitorPlay,
  },
  {
    href: "/display",
    label: "Ver pantalla",
    description: "Vista pública en vivo",
    icon: BarChart3,
  },
];

export default async function BackofficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="backoffice-shell min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col px-4 py-4 lg:px-6 lg:py-6">
        <header className="backoffice-panel sticky top-4 z-50 mb-6 rounded-[28px]">
          <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1d4ed8,#0f172a)] text-lg font-black text-white shadow-[0_20px_35px_-20px_rgba(29,78,216,0.9)]">
                T
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Backoffice
                </div>
                <h1 className="text-xl font-black tracking-tight text-[var(--backoffice-text)] sm:text-2xl">
                  Terencio Control Center
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-[var(--backoffice-muted)]">
                  Consola interna para formularios, altas de socios y contenidos de
                  pantalla.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm shadow-[0_12px_28px_-24px_rgba(15,23,42,0.8)]">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Sesión activa
                </div>
                <p className="font-semibold text-slate-900">{session.email}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="backoffice-stat rounded-[24px] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Módulos activos
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">3</p>
            <p className="mt-1 text-sm text-slate-500">
              Gestión interna ya operativa.
            </p>
          </div>
          <div className="backoffice-stat rounded-[24px] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Estilo
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Dashboard
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Visual unificado en login, shell y tablas.
            </p>
          </div>
          <div className="backoffice-stat rounded-[24px] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
              Acceso
            </p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Seguro
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Mismas rutas y autenticación actual.
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="backoffice-panel rounded-[28px] p-4">
              <div className="mb-4 px-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  Navegación
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Áreas disponibles en el panel interno.
                </p>
              </div>
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-start gap-3 rounded-2xl border border-transparent bg-white/70 px-4 py-4 transition hover:border-blue-100 hover:bg-blue-50/70"
                    >
                      <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_24px_-18px_rgba(15,23,42,1)] transition group-hover:bg-blue-700">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-950">
                          {link.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="backoffice-grid backoffice-panel rounded-[32px] p-4 sm:p-5 lg:p-7">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
