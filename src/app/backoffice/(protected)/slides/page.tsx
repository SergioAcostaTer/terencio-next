import SlidesManager from "@/components/backoffice/SlidesManager";
import { assertPermission, requireAdminPermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SlidesPage() {
  const session = await requireAdminPermission("slides.read");
  const slides = await prisma.slide.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-6 py-7 text-white shadow-[0_26px_50px_-34px_rgba(15,23,42,0.75)] sm:px-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-100/80">
          Backoffice / Pantalla TV
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Pantalla TV
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80">
              Gestiona las diapositivas que aparecen en la pantalla del
              supermercado.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-100/70">
              Elementos
            </p>
            <p className="mt-1 text-3xl font-black">{slides.length}</p>
          </div>
        </div>
      </section>

      <SlidesManager slides={slides} canManage={assertPermission(session, "slides.write")} />
    </div>
  );
}
