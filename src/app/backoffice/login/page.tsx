import type { Metadata } from "next";

import LoginForm from "@/components/backoffice/LoginForm";

export const metadata: Metadata = {
  title: "Acceso empleados",
  description: "Acceso interno al backoffice de Terencio.",
};

export default function BackofficeLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dcfce7,transparent_40%),linear-gradient(180deg,#f8fafc,white)] px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/95 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-700">
          Acceso empleados
        </p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">Backoffice</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Inicia sesión con el usuario administrador configurado en las variables
          de entorno.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
