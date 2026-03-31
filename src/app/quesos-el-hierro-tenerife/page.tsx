import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import queso from "@/assets/images/queso_mojo.webp";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Comprar Queso de El Hierro en Tenerife | Ahumado y Tierno",
  description:
    "El auténtico Queso Herreño en Tenerife. Queso ahumado de la Cooperativa de Ganaderos de El Hierro. Tierno, semicurado y curado. Venta en La Esperanza.",
};

const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  name: "Queso Herreño Ahumado Tierno",
  image: "https://terencio.es/assets/images/queso_mojo.webp",
  description:
    "Queso tierno ahumado con leña de higuera. Elaborado por la Cooperativa de Ganaderos de El Hierro. Venta directa en Tenerife.",
  brand: {
    "@type": "Brand",
    name: "Ganaderos de El Hierro",
  },
  offers: {
    "@type": "Offer",
    url: "https://terencio.es/quesos-el-hierro-tenerife",
    priceCurrency: "EUR",
    price: "14.50",
    priceValidUntil: "2025-12-31",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "120",
  },
};

export default function QuesosElHierroTenerifePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="relative overflow-hidden bg-yellow-900 py-12 text-white md:py-16">
        <Image src={queso} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/90 via-yellow-900/60 to-yellow-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-yellow-300 bg-yellow-100 px-3 py-1 text-xs font-bold tracking-wider text-yellow-800 uppercase">
            Delicatesen Canaria
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Comprar Queso de El Hierro en Tenerife: Ahumado y Tierno
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-yellow-100">
            Distribuidores oficiales de la Cooperativa de Ganaderos de El
            Hierro. El sabor ahumado único, directo a tu mesa.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Image
              src={queso}
              alt="Queso Ahumado El Hierro con Mojo"
              width={600}
              height={400}
              className="h-auto w-full rounded-2xl shadow-xl"
            />
            <div className="mt-6">
              <Link
                href="/blog/historia-queso-herreno"
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-yellow-300 hover:bg-yellow-50"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={queso}
                    alt="La historia del queso herreño"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-yellow-700 uppercase">
                    Blog
                  </p>
                  <h3 className="font-bold text-gray-900 transition group-hover:text-yellow-900">
                    La historia del Queso Herreño: Del ahumadero a tu mesa
                  </h3>
                </div>
              </Link>
            </div>
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Variedades y Diferencias
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              El queso herreño se elabora principalmente con leche de cabra y
              oveja, y su carácter distintivo proviene del{" "}
              <strong>ahumado natural</strong> con leña de higuera y pencas de
              tunera.
            </p>
            <div className="space-y-6">
              <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                <h3 className="flex items-center gap-2 font-bold text-yellow-900">
                  <Icon name="BadgePlus" size={18} /> Tierno Ahumado
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  Suave, blanco y cremoso. Ahumado ligero. Ideal para desayunos
                  o sándwiches.
                </p>
              </div>
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="flex items-center gap-2 font-bold text-yellow-900">
                  <Icon name="BadgePlus" size={18} /> Semicurado Mezcla
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  El equilibrio perfecto. Corteza ahumada natural y pasta
                  firme. El favorito para tapas.
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <h3 className="flex items-center gap-2 font-bold text-amber-900">
                  <Icon name="BadgePlus" size={18} /> Curado Viejo
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  Sabor intenso, picante y textura quebradiza. Ganador de
                  premios World Cheese Awards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white text-center">
        <h2 className="mb-8 text-3xl font-bold">Maridaje Perfecto</h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
              <Icon name="Droplets" size={24} />
            </div>
            <h3 className="mb-2 font-bold">Miel de Palma</h3>
            <p className="text-sm text-gray-500">
              Un contraste dulce que realza el ahumado.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="Flame" size={24} />
            </div>
            <h3 className="mb-2 font-bold">Mojo Rojo</h3>
            <p className="text-sm text-gray-500">
              Hazlo a la plancha con mojo por encima. ¡Delicioso!
            </p>
          </div>
          <Link
            href="/productos-el-hierro-tenerife"
            className="group block rounded-xl border border-yellow-200 bg-yellow-50 p-6 transition hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-yellow-700 transition group-hover:scale-105">
              <Icon name="Wine" size={24} />
            </div>
            <h3 className="mb-2 font-bold text-yellow-900">Vinos de Frontera</h3>
            <p className="text-sm text-yellow-800">
              Ver Vinos Recomendados{" "}
              <Icon name="ArrowRight" size={12} className="inline" />
            </p>
          </Link>
        </div>
      </Section>
    </main>
  );
}
