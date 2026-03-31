"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Icon from "@/components/ui/Icon";
import faqs from "@/data/faqs.json";
import siteData from "@/data/siteData.json";

type FaqItem = (typeof faqs)[number];
type CategoryKey = "general" | "productos" | "profesional";

type CategoryConfig = {
  key: CategoryKey;
  title: string;
  icon: "Store" | "Beef" | "Briefcase";
  iconWrapperClassName: string;
  detailsHoverClassName: string;
  summaryHoverClassName: string;
  summaryIconClassName: string;
};

const allCategories: Record<CategoryKey, FaqItem[]> = {
  general: faqs.filter((faq) => {
    const question = faq.question.toLowerCase();
    return (
      question.includes("horario") ||
      question.includes("abierto") ||
      question.includes("tarjeta")
    );
  }),
  productos: faqs.filter((faq) => {
    const question = faq.question.toLowerCase();
    return (
      question.includes("carne") ||
      question.includes("hierro") ||
      question.includes("stock")
    );
  }),
  profesional: faqs.filter((faq) => {
    const question = faq.question.toLowerCase();
    return (
      question.includes("autónomo") ||
      question.includes("profesional") ||
      question.includes("alta")
    );
  }),
};

const categoryConfig: CategoryConfig[] = [
  {
    key: "general",
    title: "Información General y Acceso",
    icon: "Store",
    iconWrapperClassName: "bg-green-100 text-green-700",
    detailsHoverClassName: "hover:border-green-300",
    summaryHoverClassName: "hover:text-green-800",
    summaryIconClassName:
      "bg-gray-50 text-gray-400 group-open:bg-green-50 group-open:text-green-700",
  },
  {
    key: "productos",
    title: "Productos y Frescos",
    icon: "Beef",
    iconWrapperClassName: "bg-yellow-100 text-yellow-700",
    detailsHoverClassName: "hover:border-yellow-300",
    summaryHoverClassName: "hover:text-yellow-800",
    summaryIconClassName:
      "bg-gray-50 text-gray-400 group-open:bg-yellow-50 group-open:text-yellow-700",
  },
  {
    key: "profesional",
    title: "Empresas, Autonomos y Facturacion",
    icon: "Briefcase",
    iconWrapperClassName: "bg-slate-100 text-slate-700",
    detailsHoverClassName: "hover:border-slate-300",
    summaryHoverClassName: "hover:text-slate-800",
    summaryIconClassName:
      "bg-gray-50 text-gray-400 group-open:bg-slate-100 group-open:text-slate-700",
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(allCategories);

  useEffect(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      setFilteredCategories(allCategories);
      return;
    }

    setFilteredCategories({
      general: allCategories.general.filter((faq) => matchesFaq(faq, normalizedTerm)),
      productos: allCategories.productos.filter((faq) =>
        matchesFaq(faq, normalizedTerm),
      ),
      profesional: allCategories.profesional.filter((faq) =>
        matchesFaq(faq, normalizedTerm),
      ),
    });
  }, [searchTerm]);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-8 text-white md:py-12">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-700 bg-green-900/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Soporte
          </span>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Centro de <span className="text-green-300">Ayuda</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            Encuentra respuestas rápidas. Estamos aquí para facilitarte la
            compra.
          </p>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-8 max-w-2xl px-4">
        <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
          <div className="pl-4 text-gray-400">
            <Icon name="Search" size={24} />
          </div>
          <input
            type="text"
            id="faq-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="¿Qué estás buscando? (ej. Horario domingo, Carne de fiesta...)"
            className="w-full rounded-xl p-4 text-lg text-gray-700 outline-none"
          />
        </div>
      </div>

      <section className="min-h-screen bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          {categoryConfig.map((category) => {
            const items = filteredCategories[category.key];

            if (searchTerm.trim() && items.length === 0) {
              return null;
            }

            return (
              <div key={category.key} className="faq-category mb-12">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <span
                    className={`rounded-lg p-2 ${category.iconWrapperClassName}`}
                  >
                    <Icon name={category.icon} size={24} />
                  </span>
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {items.map((faq) => (
                    <details
                      key={faq.question}
                      className={`group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 ${category.detailsHoverClassName}`}
                      name="faq-group"
                    >
                      <summary
                        className={`flex cursor-pointer list-none items-center justify-between p-6 text-lg font-bold text-gray-800 transition select-none ${category.summaryHoverClassName}`}
                      >
                        <span>{faq.question}</span>
                        <span
                          className={`rounded-full p-2 transition-transform duration-300 group-open:rotate-180 ${category.summaryIconClassName}`}
                        >
                          <Icon name="ChevronDown" size={20} />
                        </span>
                      </summary>
                      <div className="border-t border-gray-100 bg-gray-50/50 px-6 pb-6 text-gray-600">
                        <p className="leading-relaxed">{faq.answer}</p>
                        {category.key === "profesional" ? (
                          <div className="mt-4 flex items-center gap-2">
                            <Icon
                              name="MessageCircleQuestionMark"
                              size={20}
                              className="shrink-0 text-slate-700"
                            />
                            <Link
                              href="/profesionales"
                              className="text-sm font-bold text-slate-800 hover:underline"
                            >
                              Ir al canal B2B
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          {searchTerm.trim() &&
          categoryConfig.every(
            (category) => filteredCategories[category.key].length === 0,
          ) ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-600 shadow-sm">
              <p className="text-lg font-semibold text-gray-900">
                No encontramos resultados para &quot;{searchTerm}&quot;.
              </p>
              <p className="mt-2">
                Prueba con otra palabra clave o contacta con nuestro equipo.
              </p>
            </div>
          ) : null}

          <div className="mt-16 rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <Icon name="MessageCircleQuestionMark" size={32} />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              ¿No encuentras tu respuesta?
            </h3>
            <p className="mx-auto mb-8 max-w-md text-gray-600">
              Nuestro equipo de atención al cliente te responderá en menos de
              24 horas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="rounded-xl bg-green-700 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-green-800 hover:shadow-xl"
              >
                Contactar Ahora
              </Link>
              {siteData.contact.whatsapp || siteData.contact.whatsappUrl ? (
                <a
                  href={
                    siteData.contact.whatsappUrl ||
                    `https://wa.me/34${siteData.contact.phoneRaw}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-green-200 bg-white px-8 py-3 font-bold text-green-700 transition hover:bg-green-50"
                >
                  WhatsApp Web
                </a>
              ) : (
                <a
                  href={`tel:${siteData.contact.phoneRaw}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 font-bold text-slate-800 transition hover:bg-slate-50"
                >
                  <Icon name="Phone" size={20} /> Llamar a Tienda
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function matchesFaq(faq: FaqItem, term: string) {
  return (
    faq.question.toLowerCase().includes(term) ||
    faq.answer.toLowerCase().includes(term)
  );
}
