import type { MetadataRoute } from "next";

import siteData from "@/data/siteData.json";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_image", "/cdn-cgi/", "/backoffice/", "/api/"],
      },
    ],
    sitemap: [`${siteData.url}/sitemap.xml`, `${siteData.url}/news-sitemap.xml`],
    host: siteData.url,
  };
}
