import type { Metadata } from "next";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Cómo optimizar escandallos en tu Restaurante | Terencio Profesionales",
  description:
    "Guía para mejorar la rentabilidad de tu restaurante comprando en formato Cash & Carry. Reduce mermas y controla el coste por plato.",
};

export default function OptimizacionEscandallosPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-12 text-white md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/60 to-slate-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-green-500 bg-green-500/10 px-3 py-1 text-xs font-bold tracking-wider text-green-300 uppercase">
            Guía para Profesionales
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Optimiza tus <span className="text-green-400">Escandallos</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">
            La rentabilidad de tu plato empieza en la compra. Descubre cómo el
            formato Cash te ayuda a controlar el coste exacto.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="prose prose-lg mx-auto text-gray-600">
            <h2 className="text-3xl font-bold text-gray-900">
              El error número 1: Comprar formato doméstico
            </h2>
            <p>
              Muchos negocios de hostelería pierden entre un 15% y un 20% de
              margen por comprar formatos inadecuados en supermercados
              convencionales. El <strong>escandallo</strong> (el cálculo de
              coste real de cada plato) se dispara cuando no controlas el
              precio por kilo neto o pagas por envases que van a la basura.
            </p>

            <div className="not-prose my-8 rounded-r-xl border-l-4 border-green-500 bg-green-50 p-6">
              <h3 className="mb-2 text-lg font-bold text-green-900">
                La Regla del Cash & Carry
              </h3>
              <p className="m-0 text-green-800">
                Comprar en gran formato no solo baja el precio por kilo. Reduce
                la manipulación en cocina y garantiza una merma controlada.
              </p>
            </div>

            <h3>3 Claves para mejorar tu rentabilidad</h3>

            <div className="not-prose my-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon name="Beef" size={24} />
                </div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Despiece a Medida
                </h4>
                <p className="text-sm">
                  Pide la pieza limpia. Pagar por grasa y hueso que vas a tirar
                  es tirar dinero.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <Icon name="Package2" size={24} />
                </div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Formatos Horeca
                </h4>
                <p className="text-sm">
                  Las latas y envases grandes reducen el coste del envase
                  repercutido en el producto.
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon name="Scale" size={24} />
                </div>
                <h4 className="mb-2 font-bold text-gray-900">Estabilidad</h4>
                <p className="text-sm">
                  Nuestros precios fluctúan menos que el súper, permitiéndote
                  mantener precios de carta fijos.
                </p>
              </div>
            </div>

            <h3>Ejemplo Práctico: Carne de Fiesta</h3>
            <p>
              Si compras lomo sucio y lo limpias tú, pierdes tiempo de personal
              y merma de producto. Al comprar nuestra{" "}
              <strong>Carne de Fiesta Especial Restauración</strong>, el 100% de
              lo que pagas va al plato del cliente.
              <br />
              <strong>Resultado:</strong> Sabes exactamente que tu ración de
              300g te cuesta X euros. Sin sorpresas.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              ¿Quieres que revisemos tus costes?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-slate-600">
              Ven a vernos. Trae tu lista de la compra habitual y te haremos
              una comparativa sin compromiso para ver cuánto puedes ahorrar al
              mes.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                href="/profesionales"
                variant="primary"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Hablar con Comercial
              </Button>
              <Button href="/contacto" variant="outline">
                Ver Ubicación
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
