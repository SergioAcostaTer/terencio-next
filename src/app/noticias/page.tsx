import type { Metadata } from "next";
import Link from "next/link";

import NewsGrid from "@/components/NewsGrid";

export const metadata: Metadata = {
  title: "Actualidad y Noticias Corporativas | Terencio Cash Market",
  description:
    "Mantente al día con las últimas novedades, aperturas, y noticias corporativas de Terencio Cash Market en Tenerife.",
};

export default function NoticiasPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Actualidad
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Terencio Actualidad
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            El portal de noticias corporativas líder en distribución
            alimentaria de Canarias.
          </p>
        </div>
      </section>

      <div className="border-b border-gray-200 bg-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center hover:text-green-700">
                  <svg
                    className="mr-2.5 h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="mx-1 h-3 w-3 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 font-medium text-gray-700 md:ml-2">
                    Noticias
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <NewsGrid />
        </div>
      </section>
    </main>
  );
}
