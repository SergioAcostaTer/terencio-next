import { promises as fs } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Icon from "@/components/ui/Icon";
import siteData from "@/data/siteData.json";
import { getNewsPostBySlug } from "@/lib/news";

type NewsPostPageProps = {
  params: Promise<{ slug: string }>;
};

const newsDir = path.join(process.cwd(), "_astro_staged", "content", "noticias");

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const fileNames = await fs.readdir(newsDir);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ""),
    }));
}

export async function generateMetadata({
  params,
}: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    return {
      title: "Noticia no encontrada",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.pubDate.toISOString(),
      images: post.image
        ? [
            {
              url: post.image.src,
              alt: post.imageAlt ?? post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function NoticiaSlugPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    image: [post.image ? post.image.src : "/logo.png"],
    datePublished: post.pubDate.toISOString(),
    dateModified: post.pubDate.toISOString(),
    author: [
      {
        "@type": "Person",
        name: post.author,
        url: "https://terencio.es",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Terencio Cash Market",
      logo: {
        "@type": "ImageObject",
        url: "https://terencio.es/logo.png",
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="min-h-screen bg-white">
        <header className="relative bg-gray-900 py-12 md:py-20 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                className="scale-110 object-cover opacity-30 blur-sm"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          </div>

          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            <span className="mb-4 inline-block rounded bg-green-700 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase md:mb-6 md:text-sm">
              {post.category || "Noticia Corporativa"}
            </span>
            <h1 className="mb-4 px-2 text-2xl leading-tight font-bold text-white md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl">
              {post.title}
            </h1>
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-300 md:flex-row md:gap-4 md:text-base lg:text-lg">
              <span className="font-medium">{post.author}</span>
              <span className="hidden md:inline">•</span>
              <time dateTime={post.pubDate.toISOString()}>
                {formatFullDate(post.pubDate)}
              </time>
            </div>
          </div>
        </header>

        <div className="container relative z-20 mx-auto -mt-6 max-w-5xl px-4 pb-12 md:-mt-10 md:pb-20">
          <div className="overflow-hidden rounded-lg bg-gray-200 shadow-xl md:mb-12 md:rounded-xl md:shadow-2xl">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                width={1200}
                height={600}
                className="h-auto max-h-[400px] w-full object-cover md:max-h-[600px]"
              />
            ) : null}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
            <div
              className="prose prose-base prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:text-gray-700 prose-a:text-green-700 prose-strong:text-gray-900 hover:prose-a:text-green-800 max-w-none md:prose-lg"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            <aside className="hidden h-fit space-y-8 lg:sticky lg:top-24 lg:block">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase">
                  Compartir artículo
                </h4>
                <div className="flex flex-col gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://terencio.es/noticias/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title} - ${post.description}`)}&url=${encodeURIComponent(`https://terencio.es/noticias/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    X (Twitter)
                  </a>
                  {siteData.contact.whatsapp || siteData.contact.whatsappUrl ? (
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${post.description}\nhttps://terencio.es/noticias/${post.slug}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-sm font-medium text-white transition hover:bg-green-800"
                    >
                      WhatsApp
                    </a>
                  ) : (
                    <a
                      href={`tel:${siteData.contact.phoneRaw}`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
                    >
                      Llamar
                    </a>
                  )}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://terencio.es/noticias/${post.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4 text-xs font-bold tracking-wider text-gray-900 uppercase">
                  Más en {post.category}
                </h4>
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:underline"
                >
                  Ver todas las noticias
                  <Icon name="ChevronRight" size={16} />
                </Link>
              </div>
            </aside>
          </div>

          <div className="h-20 lg:hidden" />
        </div>

        <div className="border-t border-gray-200 bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <h3 className="mb-6 text-xl font-bold text-gray-900 md:mb-8 md:text-2xl">
              Sigue leyendo
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
                <p className="mb-4 text-gray-500">
                  Descubre más novedades sobre Terencio
                </p>
                <Link
                  href="/noticias"
                  className="rounded bg-gray-900 px-6 py-2 text-sm font-bold text-white transition hover:bg-black md:text-base"
                >
                  Ir a portada de Noticias
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
