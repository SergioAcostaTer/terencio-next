import type { Metadata } from "next";
import Image from "next/image";

import blogBg from "@/assets/images/el-hierro-charco.webp";
import BlogGrid from "@/components/BlogGrid";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog y Noticias - Terencio Cash Market",
  description:
    "Últimas noticias, novedades sobre productos, ofertas y actualidad de Terencio Cash Market en Tenerife.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-900 py-10 text-white md:py-14">
        <Image
          src={blogBg}
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/90 via-green-900/65 to-slate-900" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-400 bg-green-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-100">
            Magazine
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            Blog y Actualidad
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-green-100">
            Descubre guías de viaje de El Hierro, recetas, consejos de ahorro
            y todas las novedades de nuestro supermercado.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </main>
  );
}
