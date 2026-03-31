import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/60 to-slate-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-red-400 bg-red-500/10 px-3 py-1 text-xs font-bold tracking-wider text-red-300 uppercase">
            Error
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            404 - Página no encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            Vaya, parece que te has perdido en el pasillo. La página que buscas
            no existe o ha sido movida.
          </p>
          <div className="mt-8">
            <Button
              href="/"
              variant="primary"
              className="px-8 py-4 text-lg shadow-xl transition-all hover:-translate-y-1"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
