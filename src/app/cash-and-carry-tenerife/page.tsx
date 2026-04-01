import type { Metadata } from "next";

import interiorImage from "@/assets/images/supermercado-interior.webp";
import Hero from "@/components/Hero";
import LocationMap from "@/components/LocationMap";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Cash and Carry en Tenerife: Compra sin Carnet | Terencio",
  description:
    "El único Cash & Carry en Tenerife abierto al público general. Sin carnet, sin cuotas. Precios de mayorista para familias y empresas en La Esperanza.",
};

export default function CashAndCarryTenerifePage() {
  return (
    <main>
      <Hero
        title="Cash and Carry Tenerife: <span class='text-yellow-400'>Abierto al Público</span>"
        subtitle="Rompemos las reglas del mayorista. Aquí particulares y empresas compran con precios de almacén sin necesidad de ser socios."
        badge="Ahorro Inteligente"
        primaryCta={{ text: "Ver Ventajas", href: "#ventajas" }}
        backgroundImage={interiorImage}
      />

      <Section className="bg-white" id="ventajas">
        <div className="mb-16 text-center">
          <Badge className="px-4 py-1 text-sm">
            Modelo Híbrido
          </Badge>
          <h2 className="mt-4 mb-6 text-4xl font-bold text-gray-900">
            ¿Por qué comprar aquí?
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Hemos creado un espacio único que combina la comodidad de un
            supermercado de cercanía con la potencia de precios de un gran
            almacén.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-[2rem] border-gray-100 bg-green-50 p-4 text-center md:p-6" hover>
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-200 opacity-30 blur-2xl transition group-hover:opacity-50" />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-green-100 bg-white text-green-600 shadow-sm transition group-hover:scale-110">
              <Icon name="IdCard" size={36} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Sin Carnet ni Cuotas
            </h3>
            <p className="leading-relaxed text-gray-600">
              No necesitas ser autónomo, ni empresa, ni registrarte en ningún
              club. Las puertas están abiertas para todos. Entra, carga tu
              carro y ahorra.
            </p>
          </Card>

          <Card className="group relative overflow-hidden rounded-[2rem] border-gray-100 bg-yellow-50 p-4 text-center md:p-6" hover>
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-yellow-200 opacity-30 blur-2xl transition group-hover:opacity-50" />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-yellow-100 bg-white text-yellow-600 shadow-sm transition group-hover:scale-110">
              <Icon name="PackageOpen" size={36} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Formatos Familiares
            </h3>
            <p className="leading-relaxed text-gray-600">
              Libertad total. Compra una unidad suelta para la cena o llévate la
              caja completa para llenar la despensa y conseguir el máximo
              ahorro.
            </p>
          </Card>

          <Card className="group relative overflow-hidden rounded-[2rem] border-gray-100 bg-gray-50 p-4 text-center md:p-6" hover>
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-200 opacity-30 blur-2xl transition group-hover:opacity-50" />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-green-100 bg-white text-green-700 shadow-sm transition group-hover:scale-110">
              <Icon name="Beef" size={36} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Calidad Fresca
            </h3>
            <p className="leading-relaxed text-gray-600">
              A diferencia de otros Cash que solo tienen seco, nosotros
              destacamos por nuestra <strong>carnicería al corte</strong> y
              frutería local con reposición diaria.
            </p>
          </Card>
        </div>
      </Section>

      <Section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Terencio vs. Supermercado Típico
            </h2>
            <p className="text-slate-400">
              La comparativa que explica por qué nuestros clientes repiten.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/50 shadow-md backdrop-blur-sm">
            <div className="grid grid-cols-3 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center p-4 text-sm font-bold tracking-wider text-slate-400 uppercase md:p-6">
                Característica
              </div>
              <div className="flex items-center justify-center gap-2 border-x border-slate-700 bg-green-900/20 p-4 text-center text-lg font-bold text-green-400 md:p-6 md:text-xl">
                <Icon name="CircleCheck" size={20} /> Terencio
              </div>
              <div className="flex items-center justify-center p-4 text-center font-bold text-slate-400 md:p-6">
                Otros
              </div>
            </div>

            <div className="divide-y divide-slate-700">
              <div className="grid grid-cols-3 transition hover:bg-slate-700/30">
                <div className="p-4 font-medium md:p-6">Precio</div>
                <div className="border-x border-slate-700 bg-green-900/10 p-4 text-center font-bold text-white md:p-6">
                  Mayorista
                </div>
                <div className="p-4 text-center text-slate-400 md:p-6">
                  Minorista (PVP alto)
                </div>
              </div>
              <div className="grid grid-cols-3 transition hover:bg-slate-700/30">
                <div className="p-4 font-medium md:p-6">Acceso</div>
                <div className="border-x border-slate-700 bg-green-900/10 p-4 text-center font-bold text-white md:p-6">
                  Libre (Sin Carnet)
                </div>
                <div className="p-4 text-center text-slate-400 md:p-6">
                  Con Tarjeta / Socio
                </div>
              </div>
              <div className="grid grid-cols-3 transition hover:bg-slate-700/30">
                <div className="p-4 font-medium md:p-6">Domingos</div>
                <div className="border-x border-slate-700 bg-green-900/10 p-4 text-center font-bold text-white md:p-6">
                  ABIERTO
                </div>
                <div className="p-4 text-center text-slate-400 md:p-6">Cerrado</div>
              </div>
              <div className="grid grid-cols-3 transition hover:bg-slate-700/30">
                <div className="p-4 font-medium md:p-6">Carne Fresca</div>
                <div className="border-x border-slate-700 bg-green-900/10 p-4 text-center font-bold text-white md:p-6">
                  Despiece Propio
                </div>
                <div className="p-4 text-center text-slate-400 md:p-6">
                  Bandejas industriales
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white text-center">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Ubicación Estratégica
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
          En la subida a La Esperanza (La Laguna). Fácil aparcamiento gratuito
          en la puerta para cargar tu compra sin estrés y acceso directo desde
          la autopista.
        </p>

        <div className="mx-auto mb-10 h-[450px] max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 shadow-md transition duration-500 hover:scale-[1.01]">
          <LocationMap heightClass="h-full" title="Cómo llegar al Cash & Carry" />
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            href="https://www.google.com/maps/search/?api=1&query=Terencio+Cash+Market"
            target="_blank"
            variant="primary"
            className="gap-2 px-8 py-4 text-lg font-bold shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <Icon name="Navigation" size={20} /> Ir con Google Maps
          </Button>
          <Button
            href="/horario"
            variant="white"
            className="gap-2 border border-gray-200 px-8 py-4 text-lg font-bold shadow-sm transition-all hover:-translate-y-1 hover:bg-green-50 hover:shadow-md"
          >
            <Icon name="Clock" size={20} /> Ver Horarios
          </Button>
        </div>
      </Section>
    </main>
  );
}
