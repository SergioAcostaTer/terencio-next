import SlidesManager from "@/components/backoffice/SlidesManager";
import { prisma } from "@/lib/prisma";

export default async function SlidesPage() {
  const slides = await prisma.slide.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Slides</h2>
        <p className="mt-2 text-sm text-slate-500">
          Gestiona el contenido de la pantalla global del supermercado.
        </p>
      </div>

      <SlidesManager slides={slides} />
    </section>
  );
}
