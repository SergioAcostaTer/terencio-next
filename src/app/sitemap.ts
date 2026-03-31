import type { MetadataRoute } from "next";

import siteData from "@/data/siteData.json";
import { getBlogPosts } from "@/lib/blog";
import { getNewsPosts } from "@/lib/news";

const staticRoutes = [
  "",
  "/asaderos-tenerife",
  "/atencion-al-cliente",
  "/blog",
  "/carniceria-tenerife",
  "/cash-and-carry-tenerife",
  "/comparativa-precios-supermercado-cash",
  "/contacto",
  "/faq",
  "/horario",
  "/legal/aviso-legal",
  "/legal/cookies",
  "/legal/politica-privacidad",
  "/noticias",
  "/productos-el-hierro-tenerife",
  "/profesionales",
  "/profesionales/optimizacion-escandallos",
  "/quesos-el-hierro-tenerife",
  "/register",
  "/sobre-nosotros",
  "/trabaja-con-nosotros",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, newsPosts] = await Promise.all([getBlogPosts(), getNewsPosts()]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteData.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteData.url}/blog/${post.slug}`,
    lastModified: post.pubDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsPosts.map((post) => ({
    url: `${siteData.url}/noticias/${post.slug}`,
    lastModified: post.pubDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries, ...newsEntries];
}
