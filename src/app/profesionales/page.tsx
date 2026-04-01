import type { Metadata } from "next";
import Image from "next/image";

import proImage from "@/assets/images/supermercado-interior.webp";
import ProfessionalForm from "@/components/forms/ProfessionalForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Proveedor HORECA Tenerife | Mayorista Alimentación y Bebidas",
  description:
    "Tu proveedor integral para hosteleria, autonomos y empresas en Tenerife. Alimentacion, bebidas, limpieza y menaje. Precios netos competitivos.",
};

const categories = [
  {
    title: "Alimentación y Frescos",
    icon: "Beef" as const,
    description:
      "Carnicería, charcutería, frutas, verduras y básicos de cocina con formato profesional.",
  },
  {
    title: "Bebidas y Bodega",
    icon: "Wine" as const,
    description:
      "Agua, refrescos, cerveza, vinos y referencias para sala y barra.",
  },
  {
    title: "Limpieza y Consumibles",
    icon: "Sparkles" as const,
    description:
      "Detergentes, papel, bolsas, desechables y reposición diaria para tu operativa.",
  },
];

const advantages = [
  "Un solo proveedor para centralizar compras",
  "Precios netos competitivos desde la primera unidad",
  "Formato Cash para controlar mejor el escandallo",
  "Apertura 362 días para urgencias de servicio",
];

export default function ProfesionalesPage() {
  return (
    <main>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-slate-900 pt-14 pb-8 lg:min-h-[84vh] lg:pt-18 lg:pb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src={proImage}
            alt="Almacén Terencio"
            fill
            priority
            className="scale-105 object-cover opacity-10 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="space-y-4 lg:col-span-7">
              <Badge className="gap-2 border border-green-500/30 bg-green-500/10 text-[11px] text-green-400 ring-0">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Canal B2B
              </Badge>

              <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-[3.2rem]">
                Alta profesional rápida para{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                  empresa o autónomo
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Rellena el formulario desde el móvil y deja la solicitud lista para revisión con datos fiscales, contacto y documentación.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm md:text-sm">
                  <Icon name="Package" className="h-5 w-5 text-green-400" />
                  Muelle de Carga
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm md:text-sm">
                  <Icon name="Clock" className="h-5 w-5 text-green-400" />
                  Servicio 362 días
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm md:text-sm">
                  <Icon name="Euro" className="h-5 w-5 text-green-400" />
                  Tarifas Netas
                </div>
              </div>

              <div className="pt-2">
                <Button href="/register" size="lg">
                  Solicitar alta profesional
                </Button>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 opacity-30 blur-lg" />
              <div className="relative rounded-2xl border border-slate-100 bg-white p-4 shadow-md md:p-5">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold text-slate-900">
                    Solicitud de alta
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Completa el formulario y el equipo revisará el alta.
                  </p>
                </div>
                <ProfessionalForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold tracking-widest text-green-700 uppercase">
            Ventajas Operativas
          </span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Una compra más simple y rentable
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {advantages.map((item) => (
            <Card
              key={item}
              className="flex items-start gap-4 bg-gray-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Icon name="CircleCheck" size={24} />
              </div>
              <p className="font-medium text-gray-800">{item}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-gray-50">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold tracking-widest text-slate-600 uppercase">
            Cobertura Integral
          </span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Categorías pensadas para restauración
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.title}
              className="p-4 md:p-6"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Icon name={category.icon} size={28} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {category.title}
              </h3>
              <p className="leading-relaxed text-gray-600">
                {category.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:flex-row md:items-center md:p-10">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold md:text-3xl">
                ¿Quieres optimizar compras y escandallos?
              </h2>
              <p className="mt-3 text-slate-300">
                Consulta nuestra guía profesional o habla con el equipo para
                revisar tu operativa actual.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/profesionales/optimizacion-escandallos">
                Ver Guía de Escandallos
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
