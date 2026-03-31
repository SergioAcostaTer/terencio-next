import type { Metadata } from "next";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "¡Gracias por contactar! - Terencio Cash Market",
  description:
    "Hemos recibido tu mensaje correctamente. Te contestaremos lo antes posible.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GraciasPage() {
  return (
    <main>
      <div className="min-h-[70vh] bg-gray-50 py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl md:p-16">
            <div className="mx-auto mb-8 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-green-100">
              <Icon name="CircleCheck" size={56} className="text-green-600" />
            </div>

            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-5xl">
              ¡Mensaje Recibido!
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              Gracias por contactar con Terencio. Nuestro equipo ya tiene tu
              mensaje y te responderemos en el menor tiempo posible
              (usualmente menos de 24h).
            </p>

            <div className="mb-10 h-px w-full bg-gray-100" />

            <p className="mb-6 text-sm font-bold tracking-widest text-gray-500 uppercase">
              MIENTRAS ESPERAS...
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/horario"
                className="group block rounded-xl border border-blue-100 bg-blue-50 p-6 text-left transition hover:bg-blue-100"
              >
                <Icon
                  name="Clock3"
                  size={30}
                  className="mb-3 text-blue-500 transition group-hover:scale-110"
                />
                <h3 className="font-bold text-gray-900">Consulta el Horario</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Revisa cuándo abrir y planifica tu visita.
                </p>
              </Link>

              <Link
                href="/blog"
                className="group block rounded-xl border border-green-100 bg-green-50 p-6 text-left transition hover:bg-green-100"
              >
                <Icon
                  name="Newspaper"
                  size={30}
                  className="mb-3 text-green-500 transition group-hover:scale-110"
                />
                <h3 className="font-bold text-gray-900">Lee nuestro Blog</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Novedades y consejos sobre productos canarios.
                </p>
              </Link>
            </div>

            <div className="mt-10">
              <Button href="/" variant="ghost">
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
