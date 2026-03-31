import type { Metadata } from "next";

import LocationSection from "@/components/LocationSection";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title:
    "Horario Terencio Cash Market: La Esperanza | Abierto Domingos y Festivos",
  description:
    "Consulta el horario de Terencio Cash Market en La Esperanza (Tenerife). Abierto de Lunes a Domingo y Festivos. Tu supermercado siempre disponible cuando otros cierran.",
};

export default function HorarioPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Abierto 362 Días
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Horario de Apertura
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            Tu supermercado de confianza con horario ampliado. Abrimos todos
            los días del año para tu comodidad.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-green-50 p-8 shadow-sm md:p-10">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-green-100 opacity-50" />

            <div className="relative z-10 mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                ⏰
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Horario Habitual
              </h2>
            </div>

            <div className="relative z-10 space-y-6 text-lg">
              <div className="flex items-center justify-between border-b border-green-200 py-4">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <Icon name="Calendar" size={20} className="text-green-700" />
                  Lunes a Sábado
                </span>
                <span className="text-xl font-black text-green-800">
                  08:00 - 21:00
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-green-200 py-4">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <Icon name="Sun" size={20} className="text-green-700" />
                  Domingos
                </span>
                <span className="text-xl font-black text-green-800">
                  08:30 - 20:30
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <Icon
                    name="PartyPopper"
                    size={20}
                    className="text-green-700"
                  />
                  Festivos
                </span>
                <span className="text-xl font-black text-green-800">
                  08:30 - 20:30*
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-green-100 bg-white p-5 text-sm text-gray-600 shadow-sm">
              <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-yellow-500" />
              <p>
                <strong>*Excepciones:</strong> Solo cerramos los días de
                Navidad (25 Dic), Año Nuevo (1 Ene) y Reyes (6 Ene). El resto
                de festivos abrimos en horario de domingo.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Preguntas Frecuentes
              </h2>

              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Icon
                      name="MessageCircleQuestionMark"
                      size={20}
                      className="text-green-600"
                    />
                    ¿Abren los domingos?
                  </h3>
                  <p className="text-gray-600">
                    Sí, somos uno de los pocos supermercados en Tenerife norte
                    con horario completo de domingo, hasta las 20:30.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300">
                  <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Icon
                      name="UtensilsCrossed"
                      size={20}
                      className="text-green-600"
                    />
                    ¿La carnicería cierra antes?
                  </h3>
                  <p className="text-gray-600">
                    No, nuestros mostradores de carnicería y charcutería
                    mantienen el mismo horario que la tienda para que siempre
                    tengas producto fresco.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-center text-white shadow-xl">
              <h3 className="mb-2 text-xl font-bold">
                ¿Dudas sobre un festivo?
              </h3>
              <p className="mb-6 text-slate-300">
                Llámanos y te confirmamos al momento si estamos abiertos.
              </p>
              <a
                href={`tel:${siteData.contact.phoneRaw}`}
                className="inline-flex transform items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-slate-900 shadow-lg transition-colors hover:-translate-y-1 hover:bg-green-400"
              >
                <Icon name="Phone" size={20} />
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </Section>

      <LocationSection className="bg-gray-50 text-center" />
    </main>
  );
}
