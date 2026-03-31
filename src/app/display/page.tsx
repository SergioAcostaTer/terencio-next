import type { Metadata } from "next";

import DisplayCarousel from "@/components/display/DisplayCarousel";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Pantalla Smart TV",
  description: "Pantalla interna de promociones y comunicación de Terencio.",
};

const LEGAL_BANNER_TEXT =
  "Información legal y subvenciones: comunicación interna de Terencio Cash Market. Proyecto empresarial apoyado por programas institucionales y fondos europeos de recuperación aplicables a la compañía.";

export default async function DisplayPage() {
  const slides = await prisma.slide.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <DisplayCarousel initialSlides={slides} />
      <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-white/10 bg-black/85 px-5 py-4 text-sm leading-relaxed text-white backdrop-blur-md">
        <p className="mx-auto max-w-6xl">{LEGAL_BANNER_TEXT}</p>
      </div>
    </main>
  );
}
