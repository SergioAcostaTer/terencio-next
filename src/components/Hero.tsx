import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import defaultHeroBg from "@/assets/images/hero-bg.webp";
import Icon from "@/components/ui/Icon";

type HeroProps = {
  title?: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
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
  primaryCta = { text: "Cómo llegar", href: "#donde-estamos" },
  secondaryCta,
  backgroundImage = defaultHeroBg,
}: HeroProps) {
  const isCentered = align === "center";

  return (
    <>
    <section className="relative flex min-h-[350px] items-center overflow-hidden bg-green-900 text-white md:min-h-[450px]">
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

      <div className="container relative z-10 mx-auto flex h-full flex-col justify-center px-4 py-8 lg:px-6 lg:py-16">
        <div
          className={[
            "animate-fade-in-up max-w-3xl",
            isCentered ? "mx-auto text-center" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-green-50 shadow-sm backdrop-blur-md">
            {badge}
          </span>

          <h1
            className="mb-6 text-3xl leading-[1.1] font-bold tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <p className="mb-8 max-w-2xl text-base font-medium leading-relaxed text-green-50 opacity-90 md:text-lg">
            {subtitle}
          </p>

          <div
            className={[
              "flex w-full flex-col gap-4 sm:w-auto sm:flex-row",
              isCentered ? "items-center sm:justify-center" : "items-center sm:items-start",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link
              href={primaryCta.href}
              aria-label={`${primaryCta.text} - Ir a la sección`}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-red-700 hover:shadow-red-900/30 focus:ring-4 focus:ring-red-500/50 focus:outline-none sm:w-auto md:text-lg"
            >
              {primaryCta.text}
              <Icon
                name="ArrowRight"
                size={24}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                aria-label={`${secondaryCta.text} - Información adicional`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/20 focus:ring-4 focus:ring-white/30 focus:outline-none sm:w-auto md:text-lg"
              >
                {secondaryCta.text}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
     <div className="relative z-20 -mt-2 border-b-4 border-green-800 bg-green-700 py-4 text-white shadow-lg md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-center text-xs font-bold uppercase tracking-wider md:justify-around md:text-base">
            <span className="group flex cursor-default items-center gap-2">
              <span className="rounded-full bg-white/10 p-2 transition group-hover:bg-yellow-400 group-hover:text-green-900">
                <Icon name="Calendar" size={18} />
              </span>
              Abierto Domingos
            </span>
            <span className="hidden text-green-400/50 md:inline">|</span>
            <span className="group flex cursor-default items-center gap-2">
              <span className="rounded-full bg-white/10 p-2 transition group-hover:bg-yellow-400 group-hover:text-green-900">
                <Icon name="CarFront" size={18} />
              </span>
              Parking Gratis
            </span>
            <span className="hidden text-green-400/50 md:inline">|</span>
            <span className="group flex cursor-default items-center gap-2">
              <span className="rounded-full bg-white/10 p-2 transition group-hover:bg-yellow-400 group-hover:text-green-900">
                <Icon name="IdCard" size={18} />
              </span>
              Sin Carnet de Socio
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
