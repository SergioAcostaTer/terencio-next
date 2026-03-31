import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import aboutImage from "@/assets/images/supermercado-interior.webp";
import historyImage from "@/assets/images/henry-acosta-terencio-laguna.webp";
import teamImage from "@/assets/images/visita-estudiantes-bachillerato.webp";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Quiénes Somos | Historia de Supermercado Terencio Tenerife",
  description:
    "Desde nuestros orígenes con los supermercados en El Hierro hasta ser el Cash & Carry al por mayor de referencia en San Cristóbal de La Laguna. Descubre nuestra historia.",
};

export default function SobreNosotrosPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <Image
          src={aboutImage}
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/65 to-slate-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Desde 1999
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Nuestra <span className="text-green-300">Historia</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            Más de 20 años ofreciendo calidad, frescura y el mejor servicio a
            las familias canarias. De El Hierro a Tenerife.
          </p>
        </div>
      </section>

      <Section className="overflow-hidden bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-yellow-100 blur-xl mix-blend-multiply" />
              <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-green-100 blur-xl mix-blend-multiply" />

              <div className="relative z-10 transition duration-500 hover:rotate-1">
                <Image
                  src={historyImage}
                  alt="Henry Acosta y el legado de Supermercados Terencio"
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-2xl border-4 border-white object-cover shadow-xl"
                />
                <div className="absolute bottom-6 left-6 max-w-xs rounded-xl border border-gray-100 bg-white/90 p-4 shadow-lg backdrop-blur">
                  <p className="text-sm font-bold text-gray-800">
                    📷 Henry Acosta
                  </p>
                  <p className="text-xs text-gray-500">
                    Continuando el legado familiar
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 prose prose-lg text-gray-600 md:order-2">
              <span className="mb-4 inline-block rounded-full bg-yellow-50 px-3 py-1 text-sm font-bold tracking-widest text-yellow-600 uppercase">
                Raíces Herreñas
              </span>
              <h2 className="mb-6 text-4xl leading-tight font-bold text-gray-900">
                Una tradición que late desde El Hierro
              </h2>
              <p>
                Muchos nos recuerdan por nuestra amplia red de establecimientos
                bajo la marca <strong>Supermercados Terencio en El Hierro</strong>.
                Nuestro origen se encuentra en la Isla del Meridiano, donde
                aprendimos el valor de la palabra, el trato cercano y el
                respeto por el producto local.
              </p>
              <p>
                Esa experiencia forjó nuestro ADN. Aprendimos que la clave del
                éxito no es solo vender, sino conocer lo que vendes. Hoy,
                aunque nuestra operativa se ha transformado y modernizado en
                Tenerife, seguimos siendo el{" "}
                <strong>puente principal para los productos de El Hierro</strong>,
                trayendo semanalmente quesadillas, queso y piña a San Cristóbal
                de La Laguna.
              </p>
              <blockquote className="rounded-r-lg border-l-4 border-yellow-500 bg-yellow-50/50 py-2 pl-4 italic text-gray-800">
                &quot;No olvidamos de dónde venimos para saber a dónde vamos. El
                Hierro siempre será nuestra casa.&quot;
              </blockquote>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gray-50">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            La Evolución hacia el Cash Market
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            En un mercado cambiante, tomamos una decisión valiente: centralizar
            nuestra fuerza. Cerramos pequeñas tiendas para abrir un gran centro
            en la <strong>Carretera de La Esperanza</strong> que cambiara las
            reglas del juego.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              💡
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">La Idea</h3>
            <p className="text-gray-600">
              Crear un espacio donde una familia pudiera comprar con los mismos
              precios que un restaurante.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              🚀
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">El Modelo</h3>
            <p className="text-gray-600">
              Eliminar barreras. Sin carnet de socio, sin cuotas, sin mínimos
              de compra absurdos. Puertas abiertas.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
              🎯
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              El Resultado
            </h3>
            <p className="text-gray-600">
              El Cash &amp; Carry de referencia en el norte de Tenerife para
              particulares y profesionales HORECA.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Nuestros Pilares Fundamentales
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Icon name="MapPin" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Cercanía Estratégica
                  </h4>
                  <p className="text-gray-600">
                    En la subida a La Esperanza, servimos de nexo entre la zona
                    metropolitana y el norte. Fácil acceso y aparcamiento real.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Icon name="Tractor" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Producto Km 0
                  </h4>
                  <p className="text-gray-600">
                    Defendemos al sector primario de las islas. Si es canario y
                    es bueno, lo tenemos en nuestros lineales.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Icon name="Users" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Vocación de Servicio
                  </h4>
                  <p className="text-gray-600">
                    Somos solucionadores. Si un cliente profesional necesita
                    algo un domingo, ahí estamos para resolverlo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={teamImage}
              alt="Equipo de Terencio Cash Market"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="mb-2 text-2xl font-bold">El Equipo Humano</p>
              <p className="text-gray-200">
                Más de 30 personas trabajando cada día para ti.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 block text-sm font-bold tracking-widest text-green-700 uppercase">
              Actualidad Corporativa
            </span>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              La Evolución de Terencio
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Icon name="Building2" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Un centro más grande
              </h3>
              <p className="text-gray-600">
                Concentramos nuestra operación en La Esperanza para ofrecer más
                surtido, mejor logística y una experiencia de compra más ágil.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <Icon name="Handshake" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Relación directa con proveedores
              </h3>
              <p className="text-gray-600">
                Seguimos apostando por productores canarios y acuerdos estables
                que aseguran calidad, disponibilidad y precio competitivo.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Icon name="ChefHat" size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Servicio mixto: retail + HORECA
              </h3>
              <p className="text-gray-600">
                Combinamos atención a familias con soluciones de suministro
                para hostelería, bares y restauración en Tenerife.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden bg-slate-900 py-20 text-center text-white">
        <div className="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">
            Ven a conocer la nueva etapa de Terencio
          </h2>
          <p className="mb-10 text-xl leading-relaxed text-slate-300">
            Instalaciones renovadas, mayor surtido y la misma pasión de
            siempre. Te esperamos en La Esperanza.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="rounded-xl bg-green-700 px-10 py-4 font-bold text-white shadow-lg shadow-green-900/50 transition hover:bg-green-800"
            >
              Ver Ubicación y Contacto
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/20 bg-white/10 px-10 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
