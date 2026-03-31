import { Suspense } from "react";
import type { Metadata } from "next";

import LoginForm from "@/components/backoffice/LoginForm";

export const metadata: Metadata = {
  title: "Acceso empleados | Terencio",
  description: "Acceso interno al backoffice de Terencio.",
};

export default function BackofficeLoginPage() {
  return (
    <main className="backoffice-shell flex min-h-screen items-center justify-center px-3 py-3 sm:px-4 sm:py-4">
      <div className="w-full max-w-md border border-[var(--backoffice-border)] bg-white p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Iniciar sesión
          </p>
          <h1 className="mt-2 text-xl font-semibold text-slate-950">
            Acceso al backoffice
          </h1>
        </div>

        <Suspense fallback={<div className="text-sm text-slate-500">Cargando acceso...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
