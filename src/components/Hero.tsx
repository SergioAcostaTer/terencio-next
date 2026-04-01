import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import defaultHeroBg from "@/assets/images/hero-bg.webp";
import Icon from "@/components/ui/Icon";

type HeroProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  compact?: boolean;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: StaticImageData;
};

export default function Hero({
  title = "Tu Compra Diaria y <span class='text-green-300'>Cash & Carry</span> para Profesionales",
  subtitle = "Calidad, frescura y los mejores precios en un solo lugar. Abierto todos los días para particulares y empresas de hostelería.",
  badge = "📍 La Laguna, Tenerife",
  align = "left",
  compact = false,
  primaryCta = { text: "Cómo llegar", href: "#donde-estamos" },
  secondaryCta,
  backgroundImage = defaultHeroBg,
}: HeroProps) {
  const isCentered = align === "center";

  return (
    <>
      <section className={`relative overflow-hidden bg-green-900 text-white ${compact ? "h-[60dvh] min-h-[420px] md:min-h-[500px]" : "min-h-[350px] md:min-h-[450px]"}`}>
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Fondo de Terencio Supermercado"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-900/80 to-transparent sm:from-green-900 sm:to-transparent/10" />
        </div>

        <div className={`relative z-10 flex h-full flex-col ${compact ? "justify-between" : ""}`}>
          <div className={`container mx-auto flex flex-1 flex-col justify-center px-4 lg:px-6 ${compact ? "py-6 md:py-8 lg:py-10" : "py-8 lg:py-16"}`}>
            <div
              className={[
                `animate-fade-in-up ${compact ? "max-w-[46rem]" : "max-w-3xl"}`,
                isCentered ? "mx-auto text-center" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 text-green-50 shadow-sm backdrop-blur-md ${compact ? "mb-4 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] md:text-xs" : "mb-8 px-4 py-1.5 text-sm font-bold uppercase tracking-wide"}`}>
                {badge}
              </span>

              <h1
                className={`${compact ? "mb-4 text-[1.95rem] leading-[1.05] md:text-[2.45rem] lg:text-[3rem]" : "mb-6 text-3xl leading-[1.1] md:text-4xl lg:text-5xl"} font-bold tracking-tight text-white drop-shadow-sm`}
                dangerouslySetInnerHTML={{ __html: title }}
              />

              <p className={`${compact ? "mb-5 max-w-2xl text-base leading-7 md:text-lg" : "mb-8 max-w-2xl text-base leading-relaxed md:text-lg"} font-medium text-green-50 opacity-90`}>
                {subtitle}
              </p>

              <div
                className={[
                  `flex w-full flex-col ${compact ? "gap-3" : "gap-4"} sm:w-auto sm:flex-row`,
                  isCentered ? "items-center sm:justify-center" : "items-center sm:items-start",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Link
                  href={primaryCta.href}
                  aria-label={`${primaryCta.text} - Ir a la sección`}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-red-700 hover:shadow-red-900/30 focus:ring-4 focus:ring-red-500/50 focus:outline-none sm:w-auto ${compact ? "px-6 py-3 text-base md:text-lg" : "px-6 py-3 text-base md:text-lg"}`}
                >
                  {primaryCta.text}
                  <Icon
                    name="ArrowRight"
                    size={compact ? 20 : 24}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                {secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    aria-label={`${secondaryCta.text} - Información adicional`}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 font-bold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 focus:ring-4 focus:ring-white/30 focus:outline-none sm:w-auto ${compact ? "px-5 py-2.5 text-sm md:text-base" : "px-6 py-3 text-base md:text-lg"}`}
                  >
                    {secondaryCta.text}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className={`border-b-4 border-green-800 bg-green-700 text-white shadow-lg ${compact ? "py-3 md:py-3.5" : "py-4 md:py-6"}`}>
            <div className="container mx-auto px-4">
              <div className={`flex flex-wrap justify-center text-center font-bold uppercase tracking-wider md:justify-around ${compact ? "gap-x-6 gap-y-2.5 text-xs md:text-sm" : "gap-x-8 gap-y-3 text-xs md:text-base"}`}>
                <span className="group flex cursor-default items-center gap-2">
                  <span className={`rounded-full bg-white/10 transition group-hover:bg-yellow-400 group-hover:text-green-900 ${compact ? "p-1.5" : "p-2"}`}>
                    <Icon name="Calendar" size={compact ? 16 : 18} />
                  </span>
                  Abierto Domingos
                </span>
                <span className="hidden text-green-400/50 md:inline">|</span>
                <span className="group flex cursor-default items-center gap-2">
                  <span className={`rounded-full bg-white/10 transition group-hover:bg-yellow-400 group-hover:text-green-900 ${compact ? "p-1.5" : "p-2"}`}>
                    <Icon name="CarFront" size={compact ? 16 : 18} />
                  </span>
                  Parking Gratis
                </span>
                <span className="hidden text-green-400/50 md:inline">|</span>
                <span className="group flex cursor-default items-center gap-2">
                  <span className={`rounded-full bg-white/10 transition group-hover:bg-yellow-400 group-hover:text-green-900 ${compact ? "p-1.5" : "p-2"}`}>
                    <Icon name="IdCard" size={compact ? 16 : 18} />
                  </span>
                  Sin Carnet de Socio
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
