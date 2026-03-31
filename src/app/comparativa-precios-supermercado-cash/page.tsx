import type { Metadata } from "next";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title:
    "Comparativa de Precios: Supermercado vs Cash Market en Tenerife | Terencio",
  description:
    "Descubre por qué comprar en un Cash Market es más barato que en un supermercado convencional. Ahorra en tu cesta de la compra en La Laguna.",
};

const comparisonData = [
  {
    category: "Carnicería",
    supermarket: "Carne envasada con gas, precio medio-alto",
    cash: "Corte fresco diario, sin mermas, precio mayorista",
  },
  {
    category: "Cantidades",
    supermarket: "Formatos pequeños que encarecen el kilo",
    cash: "Formatos adaptados y gran volumen = Menor precio unitario",
  },
  {
    category: "Origen",
    supermarket: "Cadena de suministro larga (más costes)",
    cash: "Trato directo con origen y productores locales",
  },
];

export default function ComparativaPreciosSupermercadoCashPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-blue-900 py-12 text-white md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 via-blue-800/60 to-blue-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-blue-300 bg-blue-800/70 px-3 py-1 text-xs font-bold tracking-wider text-blue-100 uppercase">
            Ahorro Inteligente
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Supermercado vs <span className="text-yellow-400">Cash Market</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-blue-100">
            ¿Por qué pagar más por lo mismo? Te explicamos la diferencia real en
            tu ticket de compra.
          </p>
        </div>
      </section>

      <Section className="bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              ¿Quién es el supermercado más barato en La Laguna?
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Muchas familias y negocios buscan ahorrar sin renunciar a la
              calidad. La clave no está solo en las ofertas puntuales, sino en
              el <strong>modelo de negocio</strong>. En Terencio operamos como
              Cash & Carry, lo que significa menores costes operativos que
              repercutimos directamente en un precio final más bajo para ti.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {comparisonData.map((item) => (
              <div
                key={item.category}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="bg-gray-100 p-4 text-center text-sm font-bold tracking-wider text-gray-800 uppercase">
                  {item.category}
                </div>
                <div className="flex flex-grow flex-col gap-6 p-6">
                  <div>
                    <span className="mb-1 block text-xs font-bold text-red-500">
                      Supermercado Convencional
                    </span>
                    <p className="text-sm text-gray-600">{item.supermarket}</p>
                  </div>
                  <div className="-mx-6 -mb-6 mt-auto border-t border-gray-100 bg-green-50/50 p-6 pt-4">
                    <span className="mb-1 flex items-center gap-1 text-xs font-bold text-green-700">
                      <Icon name="Check" size={12} /> Terencio Cash Market
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {item.cash}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col justify-center p-10 md:p-14">
                <span className="mb-2 text-sm font-bold tracking-widest text-blue-600 uppercase">
                  Caso Real
                </span>
                <h3 className="mb-4 text-3xl font-bold text-gray-900">
                  La cesta de la compra inteligente
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Al comprar formatos de hostelería o productos frescos a
                  granel, una familia media puede ahorrar hasta un{" "}
                  <strong>30% mensual</strong>. No necesitas ser un restaurante
                  para comprar aquí; nuestros pasillos están abiertos para
                  particulares que saben comprar.
                </p>
                <div className="flex gap-4">
                  <Button
                    href="/cash-and-carry-tenerife"
                    variant="primary"
                    className="border-none bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Ver Cómo Funciona
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center overflow-hidden bg-blue-50 p-10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" />
                <div className="relative z-10 text-center">
                  <div className="mb-[-20px] text-9xl font-black text-blue-900/20">
                    30%
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    de ahorro estimado
                  </div>
                  <p className="mt-2 text-sm text-blue-600">
                    en productos básicos y frescos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
