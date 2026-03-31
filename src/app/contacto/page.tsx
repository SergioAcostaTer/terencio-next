import type { Metadata } from "next";

import ContactForm from "@/components/forms/ContactForm";
import LocationMap from "@/components/LocationMap";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title: "Contacto Terencio Cash Market | Teléfono y Ubicación La Laguna",
  description:
    "Contacta con Supermercado Terencio. Teléfono, WhatsApp, Email y Ubicación en La Laguna (Carretera La Esperanza). Atención al cliente para particulares y hostelería.",
};

const whatsappMessage = "Hola, tengo una consulta sobre...";
const whatsappLink = `https://wa.me/34${siteData.contact.phoneRaw}?text=${encodeURIComponent(whatsappMessage)}`;

export default function ContactoPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-green-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-800/80 to-green-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Contacto Directo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Estamos muy <span className="text-green-300">Cerca de Ti</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            ¿Tienes dudas sobre stock, horarios o pedidos? Elige cómo quieres
            hablar con nosotros. Te respondemos rápido.
          </p>
        </div>
      </section>

      <section className="relative z-20 container mx-auto -mt-16 mb-16 px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <a
            href={`tel:${siteData.contact.phoneRaw}`}
            className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 transition duration-300 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white">
              <Icon name="Phone" size={32} />
            </div>
            <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Atención Telefónica
            </h3>
            <p className="mb-2 text-2xl font-black text-gray-900">
              {siteData.contact.phone}
            </p>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition group-hover:bg-green-100">
              Llamar Ahora
            </span>
          </a>

          {siteData.contact.whatsapp || siteData.contact.whatsappUrl ? (
            <a
              href={siteData.contact.whatsappUrl || whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white shadow-lg shadow-green-200 transition duration-300 group-hover:scale-110 group-hover:bg-green-800">
                <Icon name="MessageCircle" size={32} />
              </div>
              <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Chat Directo
              </h3>
              <p className="mb-2 text-2xl font-black text-gray-900">
                WhatsApp
              </p>
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 transition group-hover:bg-green-100">
                Abrir Chat
              </span>
            </a>
          ) : (
            <a
              href={`tel:${siteData.contact.phoneRaw}`}
              className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-200 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600">
                <Icon name="Phone" size={32} />
              </div>
              <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
                Habla con nosotros
              </h3>
              <p className="mb-2 text-2xl font-black text-gray-900">Llamada</p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition group-hover:bg-blue-100">
                Llamar Ahora
              </span>
            </a>
          )}

          <a
            href={`mailto:${siteData.contact.email}`}
            className="group flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
              <Icon name="Mail" size={32} />
            </div>
            <h3 className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
              Correo Electrónico
            </h3>
            <p className="mb-2 text-2xl font-black text-gray-900">
              {siteData.contact.email}
            </p>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition group-hover:bg-blue-100">
              Enviar Email
            </span>
          </a>
        </div>
      </section>

      <Section className="bg-gray-50 pt-0">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-3xl font-bold text-gray-900">
                <span className="rounded-xl bg-red-100 p-2 text-red-600">
                  <Icon name="MapPin" size={24} />
                </span>
                Visítanos
              </h2>

              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                Estamos en la subida principal a La Esperanza, con fácil acceso
                desde la autopista del norte y amplio{" "}
                <strong>aparcamiento gratuito</strong>.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-green-50 p-2 text-green-600">
                    <Icon name="Navigation" size={20} />
                  </div>
                  <div>
                    <strong className="mb-1 block text-gray-900">
                      Dirección
                    </strong>
                    <span className="text-gray-600">
                      {siteData.address.formatted}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-green-50 p-2 text-green-600">
                    <Icon name="Clock3" size={20} />
                  </div>
                  <div>
                    <strong className="mb-1 block text-gray-900">
                      Horario Comercial
                    </strong>
                    <p className="text-gray-600">{siteData.hours.text}</p>
                    <p className="mt-1 inline-block rounded bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                      ¡Abrimos domingos!
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 border-t border-gray-100 pt-8">
                <Button
                  href={siteData.social.googleMaps}
                  target="_blank"
                  rel="noreferrer"
                  variant="primary"
                  className="w-full gap-3 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Icon name="Navigation" size={20} />
                  Cómo llegar con Google Maps
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
              <div className="relative z-10">
                <h3 className="mb-1 flex items-center gap-2 text-xl font-bold">
                  <Icon name="ChefHat" className="text-yellow-400" />
                  ¿Eres Profesional?
                </h3>
                <p className="text-sm text-slate-400">
                  Tenemos un canal exclusivo para hostelería.
                </p>
              </div>
              <a
                href="/profesionales"
                className="relative z-10 rounded-xl border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <Icon name="ArrowRight" size={24} />
              </a>
            </div>
          </div>

          <div
            id="formulario"
            className="relative rounded-[2.5rem] border border-gray-100 bg-white p-5 shadow-2xl md:p-10"
          >
            <div className="absolute top-0 right-0 -z-0 h-32 w-32 rounded-bl-[2.5rem] bg-green-50" />

            <div className="relative z-10">
              <div className="mb-8">
                <span className="mb-2 block text-xs font-bold tracking-widest text-green-600 uppercase">
                  Escríbenos
                </span>
                <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
                  Envíanos un mensaje
                </h2>
                <p className="text-gray-500">
                  ¿Consultas generales o sugerencias? Te leemos.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <section className="group relative h-[450px] w-full bg-gray-200">
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/0 transition group-hover:bg-black/5" />
        <LocationMap
          heightClass="h-full"
          title="Ubicación Terencio Cash Market La Laguna"
          className="h-full rounded-none shadow-none"
        />
      </section>
    </main>
  );
}
