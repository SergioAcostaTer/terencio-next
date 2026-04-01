"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Icon from "@/components/ui/Icon";
import siteData from "@/data/siteData.json";

type AppShellProps = {
  children: ReactNode;
};

const CHROMELESS_PREFIXES = ["/backoffice", "/display"];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showMarketingChrome = !CHROMELESS_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  useEffect(() => {
    document.body.dataset.chrome = showMarketingChrome ? "site" : "bare";

    return () => {
      delete document.body.dataset.chrome;
    };
  }, [showMarketingChrome]);

  if (!showMarketingChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-grow pt-[98px] md:pt-[130px]">{children}</div>
      <Footer />
      <nav
        aria-label="Navegación Móvil Rápida"
        className="fixed right-0 bottom-0 left-0 z-[60] border-t border-gray-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden"
      >
        <ul className="m-0 flex w-full list-none justify-between gap-1.5 px-2 py-1.5 pb-[calc(8px+env(safe-area-inset-bottom))]">
          <li className="flex flex-1">
            <a
              href={`tel:${siteData.contact.phoneRaw}`}
              className="tap-highlight-transparent flex min-h-10 w-full flex-col items-center justify-center rounded-xl px-1.5 py-1.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
            >
              <Icon name="Phone" className="h-5 w-5 text-green-700" />
              <span className="mt-0.5 text-[11px] font-bold">Llamar</span>
            </a>
          </li>
          <li className="flex flex-1">
            <a
              href="/horario"
              className="tap-highlight-transparent flex min-h-10 w-full flex-col items-center justify-center rounded-xl px-1.5 py-1.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
            >
              <Icon name="Clock3" className="h-5 w-5 text-green-700" />
              <span className="mt-0.5 text-[11px] font-bold">Horario</span>
            </a>
          </li>
          <li className="flex flex-[1.3]">
            <a
              href={siteData.social.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="tap-highlight-transparent flex min-h-10 w-full flex-col items-center justify-center rounded-xl bg-green-700 px-1.5 py-1.5 text-white shadow-lg transition hover:bg-green-800 active:scale-95 active:bg-green-900"
            >
              <Icon name="Navigation" className="mb-0.5 h-4.5 w-4.5" />
              <span className="text-[11px] leading-none font-bold uppercase">
                Ir ahora
              </span>
            </a>
          </li>
          <li className="flex flex-1">
            <a
              href="/contacto"
              className="tap-highlight-transparent group relative flex min-h-10 w-full flex-col items-center justify-center rounded-xl px-1.5 py-1.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
            >
              <Icon name="MessageSquare" className="h-5 w-5 text-green-700 transition-transform group-hover:scale-105" />
              <span className="mt-0.5 text-[11px] font-bold text-green-800">
                Contacto
              </span>
            </a>
          </li>
        </ul>
      </nav>
      <CookieBanner />
    </>
  );
}
