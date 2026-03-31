import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import carniceriaInterior from "@/assets/images/supermercado-interior.webp";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Carnicería en Tenerife: Carne de Fiesta y Despiece Propio | Terencio",
  description:
    "La mejor carnicería de La Esperanza. Despiece propio diario, carne fresca, carne de fiesta preparada al momento y cortes a gusto del cliente. Venta a particulares y restaurantes.",
};

const butcherSchema = {
  "@context": "https://schema.org",
  "@type": "ButcherShop",
  name: "Carnicería Terencio",
  image: "https://terencio.es/assets/images/supermercado-interior.webp",
  description:
    "Carnicería tradicional con despiece propio diario en La Esperanza, Tenerife. Especialistas en carne de fiesta y cortes a medida.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ctra. La Esperanza 22",
    addressLocality: "San Cristóbal de La Laguna",
    postalCode: "38291",
    addressRegion: "Santa Cruz de Tenerife",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.468,
    longitude: -16.365,
  },
  url: "https://terencio.es/carniceria-tenerife",
  telephone: "+34922550067",
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:30",
      closes: "20:30",
    },
  ],
};

export default function CarniceriaTenerifePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(butcherSchema) }}
      />

      <section className="relative overflow-hidden bg-red-900 py-12 text-white md:py-16">
        <Image
          src={carniceriaInterior}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/90 via-red-900/60 to-red-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-red-400 bg-red-800/80 px-3 py-1 text-xs font-bold tracking-wider text-red-100 uppercase">
            Especialistas en Carnes
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Carnicería Tradicional:{" "}
            <span className="text-red-300">Corte a Cuchillo</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-red-100">
            Recuperamos el sabor de siempre. Realizamos despiece propio cada
            mañana para garantizar la máxima frescura y preparamos tu carne de
            fiesta al momento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              href="#productos"
              variant="white"
              className="border-none px-8 font-bold text-red-800 shadow-xl hover:bg-red-50"
            >
              Ver Cortes Destacados
            </Button>
            <Button
              href="/profesionales"
              variant="outline"
              className="border-white px-8 font-bold text-white hover:bg-white hover:text-red-900"
            >
              Soy Restaurante
            </Button>
          </div>
        </div>
      </section>

      <Section className="overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 z-0 rotate-[-2deg] rounded-[3rem] bg-red-50" />
              <div className="absolute -inset-4 z-0 rotate-[2deg] rounded-[3rem] bg-gray-100 opacity-50" />
              <Image
                src={carniceriaInterior}
                alt="Carnicero cortando carne fresca en Terencio La Esperanza"
                width={600}
                height={400}
                className="relative z-10 h-auto w-full rounded-3xl border-8 border-white object-cover shadow-2xl transition duration-500 hover:scale-[1.01]"
              />
              <div className="absolute -right-6 -bottom-6 z-20 hidden animate-bounce-slow rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-6 text-center shadow-xl sm:block">
                <p className="mb-1 text-4xl leading-none font-black text-red-900">
                  100%
                </p>
                <p className="text-xs font-bold tracking-wider text-gray-700 uppercase">
                  Fresco Diario
                </p>
              </div>
            </div>

            <div className="order-1 prose prose-lg text-gray-600 md:order-2">
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold tracking-widest text-red-600 uppercase">
                Maestros Carniceros
              </span>
              <h2 className="mt-4 mb-6 text-4xl font-bold text-gray-900">
                El secreto está en el origen y el corte
              </h2>
              <p>
                En <strong>Terencio Cash Market</strong> no trabajamos con carne
                envasada industrialmente llena de gases conservantes. Nuestro
                equipo de maestros carniceros realiza el{" "}
                <strong>despiece propio</strong> en nuestras instalaciones de La
                Esperanza cada madrugada. Esto nos permite ofrecerte cortes
                frescos, jugosos y con el sabor auténtico que ya no se
                encuentra en los grandes supermercados.
              </p>
              <p>
                ¿Buscas la auténtica <strong>Carne de Fiesta</strong> para tu
                guachinche, ventorrillo o evento familiar? La preparamos al
                momento, con dados limpios y seleccionados, con el adobo
                tradicional canario o al natural para que tú le des tu toque
                secreto.
              </p>
              <ul className="mt-8 space-y-3 not-prose">
                <li className="flex items-center gap-3">
                  <Icon name="CircleCheck" className="shrink-0 text-red-600" />
                  <span className="font-medium text-gray-800">
                    Corte personalizado al grosor que desees
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="CircleCheck" className="shrink-0 text-red-600" />
                  <span className="font-medium text-gray-800">
                    Cerdo y Res del país y de importación selecta
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Icon name="CircleCheck" className="shrink-0 text-red-600" />
                  <span className="font-medium text-gray-800">
                    Precios directos de mayorista
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <section className="border-t border-gray-100 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold tracking-widest text-red-700 uppercase">
              Transparencia Total
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Conocemos a nuestros ganaderos por su nombre
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              No somos una multinacional anónima. Compramos ganado local para
              apoyar al sector primario de Tenerife y garantizarte la máxima
              frescura.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-gray-50 px-6 py-4 transition hover:border-red-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                JD
              </span>
              <div>
                <p className="leading-none font-bold text-gray-900">José D.</p>
                <p className="text-xs text-gray-500">Ganadero - La Esperanza</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-gray-50 px-6 py-4 transition hover:border-red-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                MG
              </span>
              <div>
                <p className="leading-none font-bold text-gray-900">Manuel G.</p>
                <p className="text-xs text-gray-500">Granja Porcina - Fasnia</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-full border border-gray-200 bg-gray-50 px-6 py-4 transition hover:border-red-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
                AG
              </span>
              <div>
                <p className="leading-none font-bold text-gray-900">Antonio G.</p>
                <p className="text-xs text-gray-500">Cooperativa - El Hierro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" className="border-t border-gray-200 bg-gray-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold tracking-widest text-red-600 uppercase">
              Nuestras Especialidades
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-5xl">
              Cortes Estrella
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Seleccionados por nuestros clientes como los mejores de la zona.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-red-50 text-9xl transition duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-red-100/50 to-transparent" />
                🥩
                <div className="absolute top-6 right-6 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  Top Ventas
                </div>
              </div>
              <div className="flex flex-grow flex-col p-8">
                <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-red-700">
                  Carne de Fiesta
                </h3>
                <p className="mb-6 flex-grow leading-relaxed text-gray-600">
                  Dados de cerdo limpios, sin grasa excesiva y jugosos.
                  Perfectos para freír con ajos y pimentón. Disponibles
                  adobados o al natural.
                </p>
                <Link
                  href="/contacto"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-center font-bold text-gray-900 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  Consultar Disponibilidad
                </Link>
              </div>
            </div>
            <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-yellow-50 text-9xl transition duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/50 to-transparent" />
                🍗
                <div className="absolute top-6 right-6 rounded-full bg-yellow-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  Económico
                </div>
              </div>
              <div className="flex flex-grow flex-col p-8">
                <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-yellow-700">
                  Pollo Fresco
                </h3>
                <p className="mb-6 flex-grow leading-relaxed text-gray-600">
                  Enteros, pechugas fileteadas al momento, muslos o alas. Nada
                  de congelado, todo frescura diaria y al mejor precio del
                  mercado.
                </p>
                <Link
                  href="/contacto"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-center font-bold text-gray-900 transition-colors hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  Consultar Disponibilidad
                </Link>
              </div>
            </div>
            <div className="group flex flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl">
              <div className="relative flex h-64 items-center justify-center overflow-hidden bg-orange-50 text-9xl transition duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-orange-100/50 to-transparent" />
                🥓
                <div className="absolute top-6 right-6 rounded-full bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  Tradición
                </div>
              </div>
              <div className="flex flex-grow flex-col p-8">
                <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-orange-700">
                  Chuletas y Costillas
                </h3>
                <p className="mb-6 flex-grow leading-relaxed text-gray-600">
                  Chuletas de aguja, lomo veteado o costillar salado ideal para
                  el potaje de berros. Te las cortamos al grosor que más te
                  guste.
                </p>
                <Link
                  href="/contacto"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-center font-bold text-gray-900 transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  Consultar Disponibilidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-900 py-24 text-center text-white">
        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5" />
        <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 opacity-20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-red-600 opacity-20 blur-[120px]" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500 bg-red-500/20 px-4 py-1.5 text-xs font-bold tracking-wider text-red-300 uppercase">
            <Icon name="ChefHat" size={16} /> Servicio HORECA
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
            ¿Tienes un restaurante o guachinche?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-300">
            Olvídate de limpiar carne y perder tiempo. Preparamos pedidos
            grandes de carne <strong>cortada y envasada al vacío</strong> según
            tus necesidades exactas. Reduce mermas y aumenta tu rentabilidad.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              href="/profesionales"
              variant="primary"
              className="border-none bg-red-600 px-10 py-4 text-lg text-white shadow-lg shadow-red-900/50 hover:bg-red-700"
            >
              Consultar Tarifas HORECA
            </Button>
            <Button
              href="tel:922550067"
              variant="outline"
              className="border-gray-600 px-10 py-4 text-lg text-gray-300 hover:border-white hover:bg-white hover:text-red-900"
            >
              <Icon name="Phone" className="mr-2" /> Llamar a Carnicería
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            Preguntas Frecuentes sobre Carnicería
          </h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 open:bg-white open:shadow-lg">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold text-gray-800">
                ¿Preparan la carne para llevar de viaje?
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-gray-600">
                Sí, podemos envasar tu pedido al vacío para que se conserve
                perfectamente durante el viaje entre islas o si vas a
                congelarla.
              </p>
            </details>
            <details className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 open:bg-white open:shadow-lg">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold text-gray-800">
                ¿Hay que encargar la Carne de Fiesta?
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-gray-600">
                Normalmente tenemos stock diario, pero para cantidades grandes
                (más de 5kg) recomendamos llamar con antelación para tenerla
                lista y que no tengas que esperar.
              </p>
            </details>
          </div>
          <div className="mt-12 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-sm text-gray-500">
            <p>
              Estamos estratégicamente ubicados en La Esperanza, a{" "}
              <strong>5 minutos de la Vía de Ronda</strong> y en plena carretera
              general subiendo hacia el Teide. La mejor opción si vienes de La
              Laguna, Santa Cruz o vas de camino a Las Raíces.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
