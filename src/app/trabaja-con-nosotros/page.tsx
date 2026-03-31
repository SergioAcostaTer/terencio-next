import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import teamImage from "@/assets/images/visita-estudiantes-bachillerato.webp";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
  title: "Trabaja en Terencio Cash Market | Empleo en La Esperanza, Tenerife",
  description:
    "Únete a la familia Terencio. Buscamos cajeros, carniceros, reponedores y personal de gestión en La Esperanza. Estabilidad, formación y buen ambiente laboral.",
};

const benefits = [
  {
    title: "Estabilidad Real",
    desc: "Apostamos por el largo plazo. Muchos de nuestros encargados empezaron como aprendices.",
    icon: "ShieldCheck" as const,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Formación Continua",
    desc: "Aprende un oficio. Te formamos en carnicería, charcutería y gestión de retail.",
    icon: "BookOpen" as const,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Ambiente Familiar",
    desc: "Aquí no eres un número. Somos una empresa canaria donde el compañerismo importa.",
    icon: "Smile" as const,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Beneficios Empleado",
    desc: "Descuentos exclusivos en tus compras y facilidades para la conciliación.",
    icon: "Tag" as const,
    color: "bg-red-100 text-red-700",
  },
];

const departments = [
  {
    name: "Caja y Atención",
    icon: "ShoppingCart" as const,
    desc: "La sonrisa que recibe a nuestros clientes.",
  },
  {
    name: "Carnicería y Frescos",
    icon: "Beef" as const,
    desc: "Maestros del corte y el producto local.",
  },
  {
    name: "Almacén y Logística",
    icon: "Truck" as const,
    desc: "El motor que mantiene la tienda llena.",
  },
  {
    name: "Oficinas y Gestión",
    icon: "Computer" as const,
    desc: "Administración, compras y soporte.",
  },
];

export default function TrabajaConNosotrosPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-green-900 py-10 text-white md:py-14">
        <Image
          src={teamImage}
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-800/80 to-green-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Portal de Talento
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Tu Futuro Empieza <span className="text-yellow-300">Aquí</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            Buscamos personas con actitud, ganas de aprender y vocación de
            servicio para seguir creciendo juntos en Tenerife.
          </p>
        </div>
      </section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <span className="rounded-full bg-green-50 px-4 py-1 text-sm font-bold tracking-widest text-green-700 uppercase">
            ADN Terencio
          </span>
          <h2 className="mt-6 mb-6 text-3xl font-bold text-gray-900 md:text-5xl">
            Más que un Supermercado
          </h2>
          <p className="text-xl leading-relaxed text-gray-600">
            En Terencio Cash Market, no solo llenamos despensas, alimentamos la
            confianza de miles de familias y negocios de La Laguna y Santa
            Cruz. Trabajar aquí significa ser parte de un eslabón vital en la
            cadena de suministro de Tenerife.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition duration-300 group-hover:scale-110 ${benefit.color}`}
              >
                <Icon name={benefit.icon} size={32} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {benefit.title}
              </h3>
              <p className="leading-relaxed text-gray-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              ¿Dónde encajas tú?
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              Tenemos oportunidades para diferentes perfiles profesionales.
              Encuentra tu lugar en nuestro equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((department) => (
              <div
                key={department.name}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition duration-300 hover:bg-white/10"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 transition group-hover:scale-125 group-hover:rotate-12 group-hover:opacity-20">
                  <Icon name={department.icon} size={80} />
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 shadow-lg shadow-green-500/30 transition group-hover:bg-green-400">
                    <Icon
                      name={department.icon}
                      size={24}
                      className="text-white"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{department.name}</h3>
                  <p className="text-sm text-slate-300">{department.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl">
          <div className="bg-green-600 p-2" />
          <div className="p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <Icon name="Send" size={36} />
            </div>

            <h3 className="mb-4 text-3xl font-bold text-gray-900">
              Mándanos tu CV
            </h3>
            <p className="mb-8 text-lg text-gray-600">
              Actualmente centralizamos todos los procesos de selección a
              través de correo electrónico para asegurar que tu candidatura
              llegue directamente al departamento de RRHH.
            </p>

            <div className="mx-auto mb-8 max-w-lg rounded-2xl border border-gray-200 bg-gray-50 p-6 text-left">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
                <Icon name="Info" size={18} className="text-blue-500" />
                Instrucciones:
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-500">1.</span>
                  Prepara tu CV actualizado en formato PDF.
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-500">2.</span>
                  Indica en el asunto el puesto de interés (ej: &quot;Cajero/a&quot;).
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-green-500">3.</span>
                  Añade una breve carta de presentación en el cuerpo.
                </li>
              </ul>
            </div>

            <a
              href={`mailto:${siteData.contact.email}?subject=Candidatura CV - Web Terencio`}
              className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-800 hover:shadow-green-900/20 sm:w-auto"
            >
              <Icon name="Mail" />
              Enviar Candidatura por Email
            </a>

            <p className="mt-6 text-xs text-gray-400">
              Al enviar tu correo aceptas nuestra{" "}
              <Link
                href="/legal/politica-privacidad"
                className="underline transition hover:text-green-600"
              >
                política de privacidad
              </Link>{" "}
              para procesos de selección. Tus datos serán guardados por un
              máximo de 6 meses.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white pt-0">
        <div className="mx-auto max-w-4xl text-center">
          <Icon
            name="Quote"
            size={48}
            className="mx-auto mb-6 text-green-100"
          />
          <blockquote className="mb-8 text-2xl leading-relaxed font-medium italic text-gray-700">
            &quot;Empecé cubriendo una baja de verano en reposición. Hoy
            coordino la sección de frescos. En Terencio, si demuestras ganas y
            compromiso, tienes un futuro asegurado.&quot;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500">
              JD
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900">Juan D.</div>
              <div className="text-sm font-medium text-green-600">
                Coordinador de Frescos
              </div>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
