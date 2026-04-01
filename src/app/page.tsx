import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import elHierroImg from "@/assets/images/buceo-el-hierro-experiencia.webp";
import heroBg from "@/assets/images/hero-bg.webp";
import carniceriaImg from "@/assets/images/supermercado-interior.webp";
import frescoImg from "@/assets/images/visita-estudiantes-bachillerato.webp";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import NewsletterForm from "@/components/forms/NewsletterForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import ContentWidget from "@/components/widgets/ContentWidget";
import GoogleReviews from "@/components/widgets/GoogleReviews";

export const metadata: Metadata = {
  title:
    "Terencio Cash Market | Supermercado en La Esperanza y Mayorista Tenerife",
  description:
    "Tu supermercado en La Esperanza y San Cristóbal de La Laguna abierto los domingos. Cash & Carry sin carnet para particulares y proveedor alimentos al por mayor para HORECA.",
};

export default function Home() {
  return (
    <main>
      <Hero
        title="Supermercado en <span class='text-green-400'>La Esperanza</span> y compra profesional en <span class='text-yellow-400'>Tenerife</span>"
        subtitle="Compra para casa o solicita tu alta profesional desde el móvil en pocos minutos."
        badge="Ctra. La Esperanza, 22 (La Laguna)"
        compact
        primaryCta={{ text: "Solicitar alta profesional", href: "/register" }}
        backgroundImage={heroBg}
      />

      <Section className="border-b border-green-100 bg-white py-6">
        <div className="overflow-hidden border border-green-100 bg-gradient-to-r from-green-50 via-white to-emerald-50">
          <div className="grid gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
                Alta profesional
              </p>
              <h2 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
                Hazte socio profesional de Terencio
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                Si compras para tu negocio, solicita tu alta y envía la
                documentación en unos minutos. El equipo revisará la solicitud y
                te contactará para activar tu perfil profesional.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-green-100">
                  Sin trámites presenciales
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-green-100">
                  Documentación online
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-green-100">
                  Revisión rápida
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto">
              <Button href="/register" size="lg" className="min-w-56 justify-center">
                Solicitar alta profesional
              </Button>
              <Link
                href="/profesionales"
                className="inline-flex items-center justify-center rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50"
              >
                Ver ventajas para empresas
              </Link>
            </div>
          </div>

          <div className="border-t border-green-100 bg-white/70 px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-600">
              ¿Ya tienes claro que compras como empresa o autónomo?
              {" "}
              <Link href="/register" className="font-bold text-green-700 hover:text-green-800">
                Empieza aquí tu solicitud
              </Link>
            </p>
          </div>
        </div>
      </Section>

     

      <Section className="bg-gray-50">
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-green-700">
            Nuestros Departamentos
          </span>
          <h2 className="mt-2 mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            ¿Qué necesitas hoy?
          </h2>
          <p className="mx-auto mb-4 max-w-3xl text-lg leading-relaxed text-gray-600">
            Calidad, frescura y precios de almacén para todos los públicos. En
            Terencio encontrarás una amplia variedad de productos:{" "}
            <strong>frescos, congelados, bebidas y limpieza</strong>.
            Mantenemos stock permanente de marcas líderes y apostamos
            firmemente por el <strong>producto canario</strong>.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-2 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/carniceria-tenerife"
            className="group relative block h-72 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-0 lg:h-80"
          >
            <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <Image
              src={carniceriaImg}
              alt="Carnicería Terencio Tenerife - Carne de Fiesta"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="rounded-2xl object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 z-20 w-full p-4 text-white md:p-6">
              <Badge className="mb-3 border border-white/20 bg-green-700/90 text-white ring-0 backdrop-blur-sm">
                Corte a Cuchillo
              </Badge>
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                Carnicería
                <Icon
                  name="ArrowRight"
                  size={24}
                  className="-translate-x-4 text-yellow-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </h3>
              <p className="text-sm font-medium leading-relaxed text-gray-200 opacity-90">
                Despiece propio diario. Especialistas en{" "}
                <strong>Carne de Fiesta</strong>, chuletones y preparados para
                asaderos.
              </p>
            </div>
          </Link>

          <Link
            href="/productos-el-hierro-tenerife"
            className="group relative block h-72 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-0 lg:h-80"
          >
            <div className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <Image
              src={elHierroImg}
              alt="Productos de El Hierro en Tenerife"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="rounded-2xl object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 z-20 w-full p-4 text-white md:p-6">
              <Badge variant="warning" className="mb-3 border border-white/20 bg-yellow-500/90 text-black ring-0 backdrop-blur-sm">
                Exclusivo
              </Badge>
              <h3 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                Sabor Herreño
                <Icon
                  name="ArrowRight"
                  size={24}
                  className="-translate-x-4 text-yellow-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </h3>
              <p className="text-sm font-medium leading-relaxed text-gray-200 opacity-90">
                Traemos la isla a Tenerife: <strong>Quesadillas</strong>, Piña
                Tropical de Frontera y Queso ahumado. Stock semanal.
              </p>
            </div>
          </Link>

          <Link
            href="/profesionales"
            className="group relative block h-72 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-0 md:col-span-2 lg:col-span-1 lg:h-80"
          >
            <div className="absolute inset-0 z-10 rounded-2xl bg-slate-900" />
            <div className="absolute inset-0 z-10 rounded-2xl opacity-10 [background-image:url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="pointer-events-none absolute inset-0 z-30 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-green-300" />
            <div className="absolute inset-0 z-20 flex h-full flex-col items-center justify-center p-4 text-center text-white md:p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-green-800 bg-green-700 shadow-[0_0_20px_rgba(21,128,61,0.5)] transition-transform duration-300 group-hover:scale-110">
                <Icon name="Store" size={32} className="text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Empresas y Autonomos</h3>
              <p className="mx-auto mb-6 max-w-xs text-sm font-medium text-slate-300">
                Soluciones integrales para Hostelería y Restauración. Pedidos
                personalizados y tarifas netas competitivas.
              </p>
              <span className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2 text-sm font-bold text-slate-900 shadow-lg transition-colors group-hover:bg-green-400 group-hover:text-green-900">
                Solicitar Tarifas HORECA <Icon name="ArrowRight" size={16} />
              </span>
            </div>
          </Link>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="relative z-10 mx-auto mb-12 max-w-4xl text-center">
          <Badge className="px-4 py-1 text-sm">
            Tu Supermercado Diferente
          </Badge>
          <h2 className="mt-4 mb-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Por Qué Somos Tu Mejor Opción
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-green-700" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-gray-700">
          <p className="mb-8 text-lg leading-relaxed md:text-center md:text-xl">
            <strong>Terencio Cash Market</strong> ha revolucionado la forma de
            hacer la compra en el norte de Tenerife. Somos el único{" "}
            <strong>Cash & Carry sin carnet de socio</strong> donde
            particulares, autonomos y empresas conviven para beneficiarse de precios
            de almacén. Ubicados estratégicamente en la subida a{" "}
            <strong>La Esperanza (La Laguna)</strong>, ofrecemos una experiencia
            de compra cómoda, rápida y económica.
          </p>

          <div className="my-8 grid gap-8 text-left md:grid-cols-2">
            <Card className="bg-gray-50" hover>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Icon name="Beef" className="text-green-700" /> Carnicería
                Tradicional
              </h3>
              <p className="text-base">
                Nuestra <strong>carnicería propia</strong> cuenta con maestros
                carniceros que realizan{" "}
                <strong>despiece diario y corte a cuchillo</strong>. Olvídate
                de las bandejas industriales; aquí eliges el grosor de tu
                chuleta y te preparamos la Carne de Fiesta al momento.
              </p>
            </Card>
            <Card className="bg-gray-50" hover>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900">
                <Icon name="Wheat" className="text-yellow-600" /> Sabor Herreño
              </h3>
              <p className="text-base">
                Somos el puente directo con la Isla del Meridiano. Traemos
                semanalmente <strong>quesadillas de El Hierro</strong>{" "}
                artesanas, <strong>queso ahumado de la cooperativa</strong> y
                la famosa piña tropical de Frontera. Productos exclusivos.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 40L40 0H20L0 20M40 40V20L20 40"
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full border border-green-700 bg-green-900/50 px-3 py-1 text-sm font-bold uppercase tracking-widest text-green-400">
              Sector HORECA
            </span>
            <h2 className="mt-3 mb-5 text-3xl font-bold leading-tight md:text-4xl">
              Servicio Integral para Empresas y Autonomos
            </h2>

            <p className="mb-6 text-lg leading-relaxed text-slate-200">
              Si tienes un{" "}
              <strong>restaurante, bar, cafetería o guachinche</strong> en
              Tenerife, Terencio es tu aliado estratégico. Como proveedores
              HORECA y de venta al por mayor, ofrecemos{" "}
              <strong>soluciones globales</strong> que incluyen embutidos,
              carne, alimentación seca, bodega, productos de limpieza y menaje.
            </p>
            <ul className="mb-8 space-y-4">
              <li className="flex items-start gap-3">
                <Icon
                  name="CircleCheck"
                  className="mt-1 shrink-0 text-green-400"
                />
                <span>
                  <strong>Tarifas B2B:</strong> Precios netos especiales por
                  volumen de compra.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon
                  name="CircleCheck"
                  className="mt-1 shrink-0 text-green-400"
                />
                <span>
                  <strong>Zona de Carga:</strong> Acceso directo al almacén
                  para furgonetas.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon
                  name="CircleCheck"
                  className="mt-1 shrink-0 text-green-400"
                />
                <span>
                  <strong>Sin Esperas:</strong> Atención personalizada y
                  gestión de pedidos por teléfono.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/profesionales"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-8 py-4 font-bold text-white shadow-sm transition-all hover:-translate-y-1 hover:bg-green-800 hover:shadow-md"
              >
                <Icon name="FileText" size={20} />
                Ver Servicios HORECA
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-50 to-yellow-50" />
            <Image
              src={frescoImg}
              alt="Profesional cargando mercancía en Terencio"
              className="relative hidden h-[500px] w-full rounded-3xl border border-slate-700/60 object-cover shadow-md md:block"
            />
            <div className="absolute right-6 bottom-6 hidden max-w-xs rounded-2xl border border-slate-200 bg-white/95 p-4 text-slate-900 shadow-md md:block md:p-6">
              <p className="mb-1 text-lg font-bold">¿Pedido Urgente?</p>
              <p className="text-sm text-gray-600">
                Abrimos sábados y domingos para salvarte el servicio.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12">
          <div className="group rounded-xl p-4 text-center transition duration-300 hover:bg-green-50">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700 shadow-sm transition-all duration-300 group-hover:bg-green-600 group-hover:text-white">
              <Icon name="Beef" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Corte a Cuchillo
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Carniceros expertos, no bandejas industriales.
            </p>
          </div>
          <div className="group rounded-xl p-4 text-center transition duration-300 hover:bg-yellow-50">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-700 shadow-sm transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-slate-950">
              <Icon name="BadgePercent" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Precios Mayoristas
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Ahorra comprando formatos grandes sin carnet.
            </p>
          </div>
          <div className="group rounded-xl p-4 text-center transition duration-300 hover:bg-green-50">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700 shadow-sm transition-all duration-300 group-hover:bg-green-600 group-hover:text-white">
              <Icon name="CalendarClock" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Abierto 362 Días
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Domingos, festivos... siempre abiertos para ti.
            </p>
          </div>
          <div className="group rounded-xl p-4 text-center transition duration-300 hover:bg-yellow-50">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-100 text-yellow-700 shadow-sm transition-all duration-300 group-hover:bg-yellow-500 group-hover:text-slate-950">
              <Icon name="HeartHandshake" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% Canario</h3>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Empresa familiar de aquí, cerca de ti.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
            <Icon name="Mail" size={32} />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Únete a nuestra Comunidad
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
            Recibe semanalmente nuestras mejores ofertas en frescos, recetas
            exclusivas y novedades directamente en tu email.{" "}
            <strong>¡Solo contenido de valor y cero spam!</strong>
          </p>
          <NewsletterForm />
        </div>
      </Section>

      <GoogleReviews />

      <Section className="bg-gray-50">
        <ContentWidget
          title="Consejos, Recetas y Actualidad"
          subtitle="Blog Terencio"
          collection="blog"
          maxItems={3}
          bgClass="bg-transparent"
          viewAllLink="/blog"
          viewAllText="Ver todo el Blog"
        />
      </Section>

      <Section className="bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-green-700">
              Preguntas Frecuentes
            </span>
            <h2 className="mt-2 mb-4 text-3xl font-bold text-gray-900">
              Todo lo que necesitas saber
            </h2>
            <p className="mx-auto max-w-2xl text-base text-gray-600">
              Resolvemos las dudas más comunes sobre nuestro supermercado Cash &
              Carry en La Laguna
            </p>
          </div>

          <div className="space-y-4">
            <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100 md:p-6">
                <span className="flex items-center gap-3">
                  <Icon name="IdCard" className="text-green-600" />
                  ¿Necesito carnet de socio para comprar?
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <div className="border-t border-gray-100 bg-white px-4 pt-4 pb-4 leading-relaxed text-gray-700 md:px-6 md:pb-6">
                <strong>No</strong>, somos un{" "}
                <strong>Cash & Carry abierto a todos</strong>. Tanto
                particulares, autonomos y empresas pueden comprar libremente
                nuestros productos a precios mayoristas sin cuotas ni carnets.
              </div>
            </details>

            <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100 md:p-6">
                <span className="flex items-center gap-3">
                  <Icon name="MapPin" className="text-green-600" />
                  ¿Dónde está ubicado Terencio?
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <div className="border-t border-gray-100 bg-white px-4 pt-4 pb-4 leading-relaxed text-gray-700 md:px-6 md:pb-6">
                Estamos en <strong>Ctra. La Esperanza, 22</strong>, ubicación
                estratégica entre <strong>La Laguna y Santa Cruz</strong>. Fácil
                acceso desde la autopista del norte con{" "}
                <strong>parking gratuito</strong> amplio para coches y
                furgonetas.
              </div>
            </details>

            <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100 md:p-6">
                <span className="flex items-center gap-3">
                  <Icon name="Clock" className="text-green-600" />
                  ¿Qué días y horarios abren?
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <div className="border-t border-gray-100 bg-white px-4 pt-4 pb-4 leading-relaxed text-gray-700 md:px-6 md:pb-6">
                Abrimos <strong>362 días al año</strong>, incluidos{" "}
                <strong>domingos y festivos</strong>. Nuestro horario es de
                Lunes a Sábado de 08:00 a 21:00 y Domingos de 08:30 a 20:30.
              </div>
            </details>

            <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-lg font-bold text-gray-900 transition hover:bg-gray-100 md:p-6">
                <span className="flex items-center gap-3">
                  <Icon name="TreePalm" className="text-green-600" />
                  ¿Venden productos de El Hierro?
                </span>
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="ChevronDown" />
                </span>
              </summary>
              <div className="border-t border-gray-100 bg-white px-4 pt-4 pb-4 leading-relaxed text-gray-700 md:px-6 md:pb-6">
                Sí, traemos cada semana{" "}
                <strong>productos exclusivos de El Hierro</strong>: quesadillas
                artesanales, queso ahumado de Frontera y piña tropical.
              </div>
            </details>
          </div>
        </div>
      </Section>

      <LocationSection className="bg-white pt-0 pb-16" />
    </main>
  );
}
