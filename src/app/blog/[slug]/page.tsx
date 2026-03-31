import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import logo from "@/assets/images/logo.webp";
import MarkdownContent from "@/components/MarkdownContent";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const posts = await getBlogPosts();
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: [post.image ? post.image.src : "/logo.png"],
    datePublished: post.pubDate.toISOString(),
    dateModified: post.pubDate.toISOString(),
    author: [
      {
        "@type": "Person",
        name: post.author,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Terencio Cash Market",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
    description: post.description,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="bg-white">
        <header className="relative overflow-hidden bg-gray-900 py-24 text-white md:py-32">
          <div className="absolute inset-0">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                className="object-cover opacity-20 blur-sm scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-gray-900/90" />
          </div>
          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-green-600/90 px-4 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg backdrop-blur-md">
              <span>{post.tag ?? "Blog Terencio"}</span>
            </div>
            <h1 className="mb-8 text-3xl leading-tight font-extrabold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-300 md:text-base">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-600 bg-white text-sm font-bold">
                  <Image
                    src={logo}
                    alt="Terencio Cash Market"
                    width={50}
                    height={50}
                    className="h-[60%] w-[60%]"
                  />
                </div>
                <span>{post.author}</span>
              </div>
              <span className="text-gray-600">•</span>
              <time
                dateTime={post.pubDate.toISOString()}
                className="flex items-center gap-2"
              >
                <Icon name="Calendar" size={18} />
                {formatDate(post.pubDate)}
              </time>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12 py-12 lg:flex-row">
            <div className="mx-auto max-w-3xl lg:w-3/4">
              {post.image ? (
                <div className="relative z-20 -mt-24 mb-12 overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    width={800}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ) : null}

              <MarkdownContent content={post.content} />

              <div className="mt-16 rounded-[3rem] border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold tracking-wider text-green-700 uppercase">
                  Recomendado
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                  ¿Quieres visitar Terencio Cash Market?
                </h2>
                <p className="mb-6 text-gray-600">
                  Descubre nuestro cash market en La Esperanza, consulta
                  horarios o habla con el equipo si necesitas información sobre
                  productos, pedidos o canal profesional.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button href="/contacto" className="gap-2">
                    <Icon name="MapPin" size={18} />
                    Ver ubicación y contacto
                  </Button>
                  <Button href="/profesionales" variant="outline">
                    Empresas y autonomos
                  </Button>
                </div>
              </div>

              {post.tags && post.tags.length > 0 ? (
                <div className="mt-16 border-t border-gray-100 pt-8">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="cursor-default rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-green-50 hover:text-green-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <section className="border-t border-gray-100 bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="mb-2 block text-sm font-bold tracking-widest text-green-700 uppercase">
                  Sigue leyendo
                </span>
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  También te puede interesar
                </h2>
              </div>
              <Link
                href="/blog"
                className="group hidden items-center gap-2 font-bold text-gray-900 transition hover:text-green-700 md:inline-flex"
              >
                Ver todo el blog
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden sm:h-56">
                    {relatedPost.image ? (
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.imageAlt ?? relatedPost.title}
                        fill
                        sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-6">
                      <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white sm:text-sm">
                        Leer artículo →
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold tracking-wider text-green-700 uppercase sm:mb-3 sm:text-xs">
                      <span>{relatedPost.tag ?? "Blog"}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-normal normal-case text-gray-500">
                        {formatDate(relatedPost.pubDate)}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg leading-tight font-bold text-gray-900 transition-colors group-hover:text-green-700 sm:mb-3 sm:text-xl">
                      {relatedPost.title}
                    </h3>

                    <p className="line-clamp-3 flex-grow text-xs text-gray-600 sm:text-sm">
                      {relatedPost.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Link
                href="/blog"
                className="inline-block rounded-xl bg-gray-100 px-8 py-3 font-bold text-gray-900 transition hover:bg-gray-200"
              >
                Ver todo el blog →
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
