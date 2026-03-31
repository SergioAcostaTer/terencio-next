import Image from "next/image";
import Link from "next/link";

import { getNewsPosts, type NewsPostSummary } from "@/lib/news";

type NewsGridProps = {
  maxItems?: number;
  posts?: NewsPostSummary[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export default async function NewsGrid({
  maxItems,
  posts: providedPosts,
}: NewsGridProps) {
  const newsData = providedPosts ?? (await getNewsPosts());

  const sortedNews = [...newsData].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );
  const breakingNews = sortedNews.find((news) => news.isBreaking);
  const heroNews = breakingNews ?? sortedNews[0];

  const remainingNews = heroNews
    ? sortedNews.filter((news) => news.slug !== heroNews.slug)
    : [];
  const sidebarNews = remainingNews.slice(0, 2);
  const gridNews = remainingNews.slice(2, maxItems ? 2 + maxItems : undefined);

  return (
    <div className="news-portal font-sans">
      {breakingNews ? (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-700 px-3 py-3 text-sm font-bold text-white shadow-sm sm:mb-6 sm:gap-3 sm:px-4">
          <span className="h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-white opacity-75 sm:h-3 sm:w-3" />
          <span className="flex-shrink-0 tracking-wider uppercase">
            ÚLTIMA HORA:
          </span>
          <Link
            href={`/noticias/${breakingNews.slug}`}
            className="min-w-0 truncate hover:underline"
          >
            {breakingNews.title}
          </Link>
        </div>
      ) : null}

      {heroNews ? (
        <div className="mb-8 grid gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-3">
          <article className="group relative h-[350px] overflow-hidden rounded-xl shadow-lg sm:h-[450px] lg:col-span-2 lg:h-[500px]">
            <Link href={`/noticias/${heroNews.slug}`} className="block h-full w-full">
              {heroNews.image ? (
                <Image
                  src={heroNews.image}
                  alt={heroNews.imageAlt ?? heroNews.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  quality={70}
                  priority
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
              <div className="absolute bottom-0 left-0 w-full p-8">
                <span className="mb-2 inline-block rounded-sm bg-green-700 px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase sm:mb-3">
                  {heroNews.category || "Actualidad"}
                </span>
                <h2 className="mb-2 text-xl leading-tight font-bold text-white underline-offset-4 drop-shadow-md decoration-2 group-hover:underline sm:mb-3 sm:text-2xl md:text-4xl lg:text-5xl">
                  {heroNews.title}
                </h2>
                <p className="hidden text-sm text-gray-100 drop-shadow-md sm:block md:w-3/4 md:text-lg">
                  {heroNews.description}
                </p>
              </div>
            </Link>
          </article>

          <div className="flex flex-col space-y-4 sm:space-y-6 lg:h-[500px]">
            <div className="mb-2 flex items-center justify-between border-b-2 border-green-700 pb-2">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                Lo más leído
              </h3>
              <span className="text-xs font-bold text-green-800 sm:text-sm">
                Top 3
              </span>
            </div>

            {sidebarNews.map((news) => (
              <article
                key={news.slug}
                className="group flex-1 border-b border-gray-200 pb-3 last:border-0 last:pb-0 sm:pb-4"
              >
                <Link
                  href={`/noticias/${news.slug}`}
                  className="flex h-full gap-3 sm:gap-4"
                >
                  <div className="relative h-20 w-1/3 flex-shrink-0 overflow-hidden rounded-lg sm:h-24">
                    {news.image ? (
                      <Image
                        src={news.image}
                        alt={news.imageAlt ?? news.title}
                        fill
                        quality={70}
                        className="object-cover transition group-hover:opacity-80"
                      />
                    ) : null}
                  </div>
                  <div className="flex w-2/3 min-w-0 flex-col justify-between">
                    <div className="min-w-0">
                      <span className="mb-1 block text-xs font-bold text-green-800 uppercase">
                        {news.category}
                      </span>
                      <h4 className="line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition group-hover:text-green-800 sm:line-clamp-3 sm:text-base">
                        {news.title}
                      </h4>
                    </div>
                    <time className="mt-1 block text-xs font-medium text-gray-500 sm:mt-2">
                      {formatDate(news.pubDate)}
                    </time>
                  </div>
                </Link>
              </article>
            ))}

            <div className="mt-auto hidden rounded-lg border border-gray-200 bg-gray-100 p-3 text-center lg:block lg:p-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Mantente al día con nuestra actualidad corporativa.
              </p>
              <Link
                href="/noticias"
                className="block w-full rounded-lg bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-gray-800 active:scale-[0.99]"
              >
                Ver todas las noticias
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-gray-50 py-12 text-center">
          <p className="text-gray-500">
            No hay noticias destacadas en este momento.
          </p>
        </div>
      )}

      {gridNews.length > 0 ? (
        <div className="border-t border-gray-200 pt-6 sm:pt-8">
          <h3 className="mb-4 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
            Otras noticias
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {gridNews.map((news) => (
              <Link
                key={news.slug}
                href={`/noticias/${news.slug}`}
                className="group"
              >
                <article className="flex h-full flex-col">
                  <div className="relative mb-3 h-40 overflow-hidden rounded-lg sm:mb-4 sm:h-48">
                    {news.image ? (
                      <Image
                        src={news.image}
                        alt={news.imageAlt ?? news.title}
                        fill
                        quality={70}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <span className="mb-1 block text-xs font-bold text-gray-600 sm:mb-2">
                    {formatDate(news.pubDate)} · {news.category}
                  </span>
                  <h4 className="mb-2 text-base leading-snug font-bold text-gray-900 transition group-hover:text-green-800 sm:text-lg md:text-xl">
                    {news.title}
                  </h4>
                  <p className="line-clamp-2 text-base text-gray-600">
                    {news.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
