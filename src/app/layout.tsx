import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import Icon from "@/components/ui/Icon";
import siteData from "@/data/siteData.json";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteData.url),
  title: {
    default: siteData.name,
    template: `%s | ${siteData.name}`,
  },
  description: siteData.seo.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-800">
        <LocalBusinessSchema />
        <Header />
        <div className="flex-grow pt-[110px] md:pt-[130px]">{children}</div>
        <Footer />
        <nav
          aria-label="Navegación Móvil Rápida"
          className="fixed right-0 bottom-0 left-0 z-[60] border-t border-gray-200 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden"
        >
          <ul className="m-0 flex w-full list-none justify-between gap-2 px-3 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
            <li className="flex flex-1">
              <a
                href={`tel:${siteData.contact.phoneRaw}`}
                className="tap-highlight-transparent flex min-h-12 w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
              >
                <Icon name="Phone" className="h-6 w-6 text-green-700" />
                <span className="mt-1 text-xs font-bold">Llamar</span>
              </a>
            </li>
            <li className="flex flex-1">
              <a
                href="/horario"
                className="tap-highlight-transparent flex min-h-12 w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
              >
                <Icon name="Clock3" className="h-6 w-6 text-green-700" />
                <span className="mt-1 text-xs font-bold">Horario</span>
              </a>
            </li>
            <li className="flex flex-[1.3]">
              <a
                href={siteData.social.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="tap-highlight-transparent flex min-h-12 w-full flex-col items-center justify-center rounded-xl bg-green-700 px-2 py-2.5 text-white shadow-lg transition hover:bg-green-800 active:scale-95 active:bg-green-900"
              >
                <Icon name="Navigation" className="mb-0.5 h-5 w-5" />
                <span className="text-xs leading-none font-bold uppercase">
                  Ir ahora
                </span>
              </a>
            </li>
            <li className="flex flex-1">
              <a
                href="/contacto"
                className="tap-highlight-transparent group relative flex min-h-12 w-full flex-col items-center justify-center rounded-xl px-2 py-2.5 text-gray-700 transition hover:bg-green-50 active:bg-green-100"
              >
                <Icon name="MessageSquare" className="h-6 w-6 text-green-700 transition-transform group-hover:scale-105" />
                <span className="mt-1 text-xs font-bold text-green-800">
                  Contacto
                </span>
              </a>
            </li>
          </ul>
        </nav>
        <CookieBanner />
      </body>
    </html>
  );
}
