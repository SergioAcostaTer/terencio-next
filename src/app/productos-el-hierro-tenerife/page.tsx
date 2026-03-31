import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import quesadillas from "@/assets/images/quesadillas.webp";
import queso from "@/assets/images/queso_mojo.webp";
import vinos from "@/assets/images/vinos_el_hierro.webp";
import Icon from "@/components/ui/Icon";
import ContentWidget from "@/components/widgets/ContentWidget";

export const metadata: Metadata = {
  title: "Productos de El Hierro en Tenerife: Quesadillas, Vinos y Piña",
  description:
    "Compra productos de El Hierro en Tenerife: Quesadillas, Queso ahumado, Vinos y Piña tropical. Terencio Cash Market es tu conexión directa con la isla del Meridiano.",
};

export default function ProductosElHierroTenerifePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-yellow-900 py-12 text-white md:py-16">
        <Image
          src={quesadillas}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/90 via-yellow-900/60 to-yellow-900/90" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-yellow-500 bg-yellow-500/20 px-3 py-1 text-xs font-bold tracking-wider text-yellow-200 uppercase">
            Origen Garantizado
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Sabor Herreño:{" "}
            <span className="text-yellow-300">Del Barco a tu Mesa</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-yellow-100">
            Somos el referente de productos de El Hierro en Tenerife.
            Quesadillas, quesos, vinos y la mejor piña tropical.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="prose prose-lg text-gray-600">
              <h2 className="mb-6 text-4xl font-bold text-gray-900">
                Tu Supermercado Herreño en Tenerife
              </h2>
              <p>
                Nuestra historia comenzó en El Hierro, y nunca hemos perdido esa
                conexión. Gracias a nuestra logística propia, traemos
                semanalmente lo mejor de la isla del Meridiano a La Esperanza.
                Nos aseguramos de que el producto llegue fresco, manteniendo
                toda su esencia.
              </p>
              <p>
                Muchos clientes de Santa Cruz y La Laguna vienen buscando
                específicamente nuestras <strong>Quesadillas de Adrián</strong>,
                el <strong>Queso Ahumado</strong> de la cooperativa y, por
                supuesto, la <strong>Piña Tropical</strong> de Frontera, famosa
                por su dulzor inigualable.
              </p>
              <ul className="mt-8 space-y-4 not-prose">
                <li className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <span className="rounded-full bg-yellow-500 p-1 text-white">
                    <Icon name="Check" size={16} />
                  </span>
                  <span className="font-bold text-gray-800">
                    Quesadillas frescas:
                  </span>
                  <span className="text-gray-600">
                    Llegan cada jueves directas del obrador.
                  </span>
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <span className="rounded-full bg-yellow-500 p-1 text-white">
                    <Icon name="Check" size={16} />
                  </span>
                  <span className="font-bold text-gray-800">Piña Tropical:</span>
                  <span className="text-gray-600">
                    Recibimos piña de Frontera los viernes.
                  </span>
                </li>
                <li className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <span className="rounded-full bg-yellow-500 p-1 text-white">
                    <Icon name="Check" size={16} />
                  </span>
                  <span className="font-bold text-gray-800">
                    Distribuidores oficiales de la Cooperativa
                  </span>
                </li>
              </ul>
            </div>

            <div className="relative grid grid-cols-2 gap-6">
              <div className="absolute inset-0 scale-110 rounded-full bg-yellow-100 opacity-30 blur-3xl" />
              <Image
                src={quesadillas}
                alt="Quesadillas Herreñas"
                width={300}
                height={200}
                className="relative z-10 h-64 w-full translate-y-8 rounded-2xl object-cover shadow-xl transition duration-500 hover:-translate-y-1"
              />
              <Image
                src={vinos}
                alt="Vinos El Hierro"
                width={300}
                height={200}
                className="relative z-10 h-64 w-full -translate-y-8 rounded-2xl object-cover shadow-xl transition duration-500 hover:-translate-y-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="text-sm font-bold tracking-widest text-yellow-600 uppercase">
              Delicatesen
            </span>
            <h2 className="mt-2 text-4xl font-bold">Nuestra Selección Herreña</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={quesadillas}
                  alt="Quesadillas"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-md">
                  Dulce Típico
                </div>
              </div>
              <div className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Quesadillas Herreñas
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Elaboradas con queso fresco y horno de leña. Disponemos de
                  marcas artesanas de confianza como Adrián. El postre perfecto.
                </p>
                <Link
                  href="/contacto"
                  className="flex items-center gap-1 text-sm font-bold text-green-700 hover:underline"
                >
                  Consultar Stock <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>

            <div className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={queso}
                  alt="Queso Ahumado"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  Ahumado
                </div>
              </div>
              <div className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Queso de El Hierro
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Tierno, semicurado y curado. Ahumado con leña de higuera y
                  tunera. Un sabor único reconocido internacionalmente.
                </p>
                <Link
                  href="/quesos-el-hierro-tenerife"
                  className="flex items-center gap-1 text-sm font-bold text-green-700 hover:underline"
                >
                  Ver Variedades <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>

            <div className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative flex h-64 items-center justify-center bg-yellow-100">
                <span className="text-9xl transition duration-500 group-hover:scale-125 drop-shadow-md">
                  🍍
                </span>
                <div className="absolute top-4 right-4 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  Fresco
                </div>
              </div>
              <div className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Piña Tropical
                </h3>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Directa del Valle del Golfo. Variedad Roja Española, mucho más
                  dulce y jugosa que la piña de importación.
                </p>
                <Link
                  href="/contacto"
                  className="flex items-center gap-1 text-sm font-bold text-green-700 hover:underline"
                >
                  Ir a Frutería <Icon name="ArrowRight" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContentWidget
        title="Descubre El Hierro"
        subtitle="Blog de Viajes y Gastronomía"
        collection="blog"
        maxItems={3}
        bgClass="bg-gray-50"
      />
    </main>
  );
}
