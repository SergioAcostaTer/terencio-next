type LocationMapProps = {
  title?: string;
  className?: string;
  heightClass?: string;
};

export default function LocationMap({
  title = "Mapa de ubicación Terencio Cash Market",
  className = "",
  heightClass = "h-[400px] md:h-[500px]",
}: LocationMapProps) {
  return (
    <section
      id="map-container"
      className={`relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-md ${className} ${heightClass}`}
    >
      <iframe
        src="https://maps.google.com/maps?q=Carr.+de+la+Esperanza,+22,+38206+La+Laguna&t=&z=15&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="h-full min-h-[400px] w-full"
      />
    </section>
  );
}
