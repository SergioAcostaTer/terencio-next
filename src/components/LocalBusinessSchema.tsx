import siteData from "@/data/siteData.json";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: siteData.name,
  legalName: siteData.legalName,
  image: `${siteData.url}${siteData.logo}`,
  url: siteData.url,
  telephone: siteData.contact.phoneInternational,
  email: siteData.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteData.address.streetAddress,
    addressLocality: siteData.address.addressLocality,
    addressRegion: siteData.address.addressRegion,
    postalCode: siteData.address.postalCode,
    addressCountry: siteData.address.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteData.geo.latitude,
    longitude: siteData.geo.longitude,
  },
  openingHoursSpecification: siteData.hours.schedule.map((entry) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: entry.dayOfWeek,
    opens: entry.opens,
    closes: entry.closes,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: siteData.ratings.google.rating,
    reviewCount: siteData.ratings.google.reviewCount,
    bestRating: siteData.ratings.google.maxRating,
    worstRating: siteData.ratings.google.minRating,
  },
};

export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
