import type { Metadata } from "next";

import heroBg from "@/assets/images/hero-bg.webp";
import Hero from "@/components/Hero";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Asaderos en Tenerife: Carne, Leña y Carbón en La Esperanza | Terencio",
  description:
    "Todo para tu asadero en Tenerife camino al monte. Carne de fiesta fresca, leña, carbón y bebidas. Parada obligatoria subiendo al Teide o Las Raíces.",
};

export default function AsaderosTenerifePage() {
  return (
    <main>
      <Hero
        title="Todo para tu <span class='text-yellow-400'>Asadero</span>"
        subtitle="¿Subes al monte? Haz tu parada técnica en La Esperanza. Carne fresca, leña, carbón y todo lo que necesitas sin desviarte."
        badge="Parada Obligatoria"
        align="center"
        primaryCta={{ text: "Ver Carne de Fiesta", href: "/carniceria-tenerife" }}
        secondaryCta={{ text: "Cómo Llegar", href: "https://maps.app.goo.gl/YourGoogleMapsLink" }}
        backgroundImage={heroBg}
      />

      <Section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="prose prose-lg text-gray-600">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                ¿Vas de asadero a Las Raíces o al Teide?
              </h2>
              <p className="leading-relaxed">
                Sabemos que un buen asadero empieza con una buena compra.
                Estamos ubicados estratégicamente en <strong>La Esperanza</strong>,
                el último punto para comprar a buen precio antes de subir al
                monte.
              </p>
              <p className="mt-4 leading-relaxed">
                Olvídate de cargar el coche desde abajo. En{" "}
                <strong>Terencio Cash Market</strong> tienes parking fácil y
                todo lo que necesitas en un solo lugar.
              </p>

              <div className="my-8 rounded-r-xl border-l-4 border-yellow-400 bg-gray-50 p-6">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <Icon name="MapPin" /> Ubicación Estratégica
                </h3>
                <p className="m-0 text-gray-700">
                  Estamos a solo <strong>5 minutos de la Vía de Ronda</strong>{" "}
                  y en plena subida hacia el Parque Nacional del Teide. La
                  parada perfecta para comprar carne para asadero en La
                  Esperanza.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-green-200 hover:bg-green-50">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <Icon name="Beef" size={28} />
                </div>
                <h3 className="font-bold text-gray-900">Carne Fresca</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Costillas, chuletas y carne de fiesta
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-green-200 hover:bg-green-50">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <Icon name="Flame" size={28} />
                </div>
                <h3 className="font-bold text-gray-900">Leña y Carbón</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sacos grandes al mejor precio
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-green-200 hover:bg-green-50">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon name="Snowflake" size={28} />
                </div>
                <h3 className="font-bold text-gray-900">Hielo y Bebida</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Cerveza fría y refrescos
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center transition hover:border-green-200 hover:bg-green-50">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <Icon name="Sandwich" size={28} />
                </div>
                <h3 className="font-bold text-gray-900">Pan y Mojo</h3>
                <p className="mt-2 text-sm text-gray-500">
                  El complemento perfecto
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden bg-slate-900 py-16 text-center text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_32%)]" />
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            ¿Quieres ir sobre seguro?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
            Si sois un grupo grande, puedes llamarnos para reservar tu pedido
            de carne y recogerlo sin esperas.
          </p>
          <Button
            href="tel:922550067"
            className="bg-green-700 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-green-800"
          >
            <Icon name="Phone" className="mr-2" /> Llamar para Reservar
          </Button>
        </div>
      </section>
    </main>
  );
}
