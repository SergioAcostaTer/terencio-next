import LocationMap from "@/components/LocationMap";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

type LocationSectionProps = {
  className?: string;
};

const mapsHref =
  "https://www.google.com/maps/search/?api=1&query=Terencio+Cash+Market";

export default function LocationSection({
  className = "",
}: LocationSectionProps) {
  return (
    <section className={`bg-gray-50 py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Visítanos en La Laguna
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Estamos estratégicamente ubicados para dar servicio a La Laguna y
            Santa Cruz con parking gratuito propio.
          </p>
        </div>

        <div className="my-8 text-center">
          <Button
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            variant="primary"
            className="group w-full gap-3 px-8 py-4 text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:text-lg"
          >
            <Icon
              name="Navigation"
              size={24}
              className="transition-transform group-hover:rotate-12"
            />
            <span>Abrir en Google Maps</span>
            <Icon name="ExternalLink" size={18} className="opacity-70" />
          </Button>
        </div>

        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
          <LocationMap heightClass="h-[400px] md:h-[500px]" />
        </div>

        <div className="mt-8 text-center">
          <Button
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            variant="primary"
            className="group w-full gap-3 px-8 py-4 text-base font-bold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:w-auto sm:text-lg"
          >
            <Icon
              name="Navigation"
              size={24}
              className="transition-transform group-hover:rotate-12"
            />
            <span>Abrir en Google Maps</span>
            <Icon name="ExternalLink" size={18} className="opacity-70" />
          </Button>
        </div>
      </div>
    </section>
  );
}
