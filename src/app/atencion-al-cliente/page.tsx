import type { Metadata } from "next";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title: "Atención al Cliente Terencio | Resolvemos tus dudas",
  description:
    "Centro de Atención al Cliente de Terencio Cash Market. Accesos rápidos a facturación, devoluciones, contacto comercial y soporte general.",
};

export default function AtencionAlClientePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-800 py-12 text-white md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/90 via-slate-800/60 to-slate-800/90" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
          <span className="inline-block rounded-full border border-green-400 bg-green-500/10 px-3 py-1 text-xs font-bold tracking-wider text-green-300 uppercase">
            Servicio Integral
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Atención al <span className="text-green-300">Cliente</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">
            Estamos a tu disposición para garantizar que tu experiencia de
            compra sea perfecta.
          </p>
        </div>
      </section>

      <Section className="bg-white">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm transition group-hover:scale-110">
                <Icon name="FileText" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Facturación
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                ¿Necesitas solicitar una factura o corregir datos fiscales?
                Gestiona tus documentos.
              </p>
              <a
                href={`mailto:${siteData.contact.email}?subject=Consulta Facturación`}
                className="flex items-center gap-1 text-sm font-bold text-green-700 transition-all hover:gap-2"
              >
                Contactar Administración <Icon name="ArrowRight" size={16} />
              </a>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm transition group-hover:scale-110">
                <Icon name="Briefcase" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Atencion Empresas y Autonomos
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Atencion para bares, restaurantes, autonomos, empresas y
                grandes cuentas. Altas, tarifas y pedidos.
              </p>
              <Link
                href="/profesionales"
                className="flex items-center gap-1 text-sm font-bold text-blue-700 transition-all hover:gap-2"
              >
                Ver canal B2B <Icon name="ArrowRight" size={16} />
              </Link>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-gray-50 p-8 transition-all hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-red-700 shadow-sm transition group-hover:scale-110">
                <Icon name="Store" size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Dudas en Tienda
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                Consultas sobre devoluciones, stock disponible en el momento u
                objetos perdidos.
              </p>
              <a
                href={`tel:${siteData.contact.phoneRaw}`}
                className="flex items-center gap-1 text-sm font-bold text-red-700 transition-all hover:gap-2"
              >
                Llamar a Tienda <Icon name="Phone" size={16} />
              </a>
            </div>
          </div>

          <div className="relative mt-16 flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-2xl md:flex-row md:p-12">
            <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full bg-slate-800 opacity-50" />
            <div className="relative z-10 text-white md:w-2/3">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                ¿Tienes preguntas rápidas?
              </h2>
              <p className="text-lg text-slate-300">
                Consulta nuestro Centro de Ayuda antes de contactar. Es posible
                que tu respuesta ya esté allí.
              </p>
            </div>
            <div className="relative z-10">
              <Button
                href="/faq"
                variant="white"
                className="border-none px-8 py-4 text-slate-900 shadow-xl hover:bg-gray-100"
              >
                Ver Preguntas Frecuentes
              </Button>
            </div>
          </div>
      </Section>
    </main>
  );
}
