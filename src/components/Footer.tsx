import Image from "next/image";
import Link from "next/link";

import europa from "@/assets/europa.png";
import sub2 from "@/assets/fondo-europeo-regional.png";
import logo from "@/assets/logo.png";
import sub4 from "@/assets/next-generation-eu.png";
import sub3 from "@/assets/plan-recuperacion-espana.png";
import sub1 from "@/assets/subvencion-gobierno-canarias.png";
import Icon from "@/components/ui/Icon";
import navigation from "@/data/navigation.json";
import siteData from "@/data/siteData.json";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t-4 border-green-700 bg-gray-900 py-12 text-gray-300">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="mb-2 flex items-center gap-2">
              <Image
                src={logo}
                alt="Terencio Logo Footer"
                width={40}
                height={40}
                className="h-10 w-auto rounded bg-white p-1"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Terencio Cash Market
              </span>
            </div>
            <address className="not-italic space-y-2 text-sm text-gray-200">
              <p className="flex items-start gap-2">
                <Icon name="MapPin" className="mt-0.5 h-5 w-5 text-green-500" />
                <span>
                  {siteData.address.streetAddress}
                  <br />
                  {siteData.address.postalCode}{" "}
                  {siteData.address.addressLocality},{" "}
                  {siteData.address.addressRegion}
                </span>
              </p>
              <a
                href={siteData.social.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-bold text-green-400 transition-all hover:text-green-300"
              >
                <Icon
                  name="Navigation"
                  size={16}
                  className="transition-transform group-hover:rotate-12"
                />
                <span>Ver en Google Maps</span>
              </a>
              <p className="flex items-center gap-2">
                <Icon name="Phone" className="h-5 w-5 text-green-500" />
                <a
                  href={`tel:${siteData.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {siteData.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Mail" className="h-5 w-5 text-green-500" />
                <a
                  href={`mailto:${siteData.contact.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteData.contact.email}
                </a>
              </p>
            </address>
          </div>

          <nav aria-label="Enlaces Rápidos" className="flex flex-col gap-4">
            <h3 className="w-fit border-b border-gray-700 pb-2 text-lg font-bold text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-green-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <h3 className="w-fit border-b border-gray-700 pb-2 text-lg font-bold text-white">
              Horario de Apertura
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex flex-col gap-1">
                <span className="font-medium text-gray-200">
                  {siteData.hours.text}
                </span>
              </li>
            </ul>
          </div>

          <nav aria-label="Destacados" className="flex flex-col gap-4">
            <h3 className="w-fit border-b border-gray-700 pb-2 text-lg font-bold text-white">
              Destacados
            </h3>
            <ul className="space-y-2 text-sm">
              {navigation.footer.featured.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-green-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <section className="mt-12 flex flex-col items-center justify-center gap-6 border-t border-gray-800 pt-8">
          <div className="flex flex-wrap justify-center gap-4">
            {[sub1, sub2, sub3, sub4].map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Subvención ${index + 1}`}
                width={200}
                height={64}
                className="h-12 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16"
              />
            ))}
          </div>
          <div className="mt-4 flex w-full justify-center md:mt-0 md:w-auto">
            <Image
              src={europa}
              alt="Logo Europa"
              width={580}
              height={180}
              className="w-full max-w-[580px] opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-20 md:w-auto"
            />
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-800 pt-6 text-xs text-gray-400 md:flex-row">
          <p>
            &copy; {year} {siteData.legalName} Todos los derechos reservados.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 md:mt-0 md:flex-row">
            <div className="flex gap-4">
              <Link href="/legal/aviso-legal" className="transition-colors hover:text-white">
                Aviso Legal
              </Link>
              <Link
                href="/legal/politica-privacidad"
                className="transition-colors hover:text-white"
              >
                Política de Privacidad
              </Link>
              <Link href="/legal/cookies" className="transition-colors hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
