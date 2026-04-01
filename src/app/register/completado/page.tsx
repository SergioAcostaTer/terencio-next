import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Alta recibida",
  description: "Confirmación del alta digital de cliente.",
};

export default async function RegisterCompletedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ecfdf5_100%)] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-[0_24px_90px_-55px_rgba(15,23,42,0.45)] backdrop-blur md:p-12">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">
          Solicitud enviada
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          Hemos recibido tu alta de cliente
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
          Tu solicitud ya está en revisión. Si el equipo necesita algo más, te contactará por la vía que has indicado.
        </p>
        {id ? (
          <p className="mt-6 text-sm font-semibold text-slate-500">Referencia: {id}</p>
        ) : null}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            Volver a la web
          </Link>
        </div>
      </div>
    </main>
  );
}
