import { Suspense } from "react";
import type { Metadata } from "next";
import { Lock, MonitorUp, PanelsTopLeft, ShieldCheck } from "lucide-react";

import LoginForm from "@/components/backoffice/LoginForm";

export const metadata: Metadata = {
  title: "Acceso empleados | Terencio",
  description: "Acceso interno al backoffice de Terencio.",
};

const featureCards = [
  {
    title: "Consultas web",
    description: "Mensajes, leads y formularios recibidos desde la web pública.",
    icon: PanelsTopLeft,
  },
  {
    title: "Socios",
    description: "Alta de clientes profesionales y revisión documental.",
    icon: ShieldCheck,
  },
  {
    title: "Pantalla TV",
    description: "Carga y ordena creatividades para el display de tienda.",
    icon: MonitorUp,
  },
];

export default function BackofficeLoginPage() {
  return (
    <main className="backoffice-shell relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px]">
        <section className="backoffice-panel relative flex flex-col justify-between overflow-hidden rounded-[36px] px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
              <Lock className="h-3.5 w-3.5" />
              Acceso interno
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Un backoffice con lectura de dashboard, sin tocar la lógica actual.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              El panel conserva las funcionalidades existentes y adopta una
              presentación más cercana a una consola operativa moderna.
            </p>
          </div>

          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            {featureCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.55)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="backoffice-panel flex items-center rounded-[36px] px-5 py-6 sm:px-8 sm:py-8">
          <div className="w-full">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#1d4ed8,#0f172a)] text-2xl font-black text-white shadow-[0_22px_45px_-24px_rgba(29,78,216,1)]">
                T
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
                Backoffice
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Terencio Control Center
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Acceso restringido a personal autorizado.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.75)] sm:p-7">
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                  Iniciar sesión
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Usa tus credenciales de administrador para entrar.
                </p>
              </div>
              <Suspense fallback={<div className="text-sm text-slate-500">Cargando acceso...</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
