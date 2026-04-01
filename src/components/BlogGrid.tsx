import Image from "next/image";
import Link from "next/link";

import type { BlogPostSummary } from "@/lib/blog";

type BlogGridProps = {
  posts: BlogPostSummary[];
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100 active:translate-y-0"
        >
          <div className="relative h-48 overflow-hidden sm:h-56">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            ) : null}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:p-5 lg:p-6">
              <span className="rounded-full bg-green-600 px-3 py-1.5 text-sm font-bold text-white">
                Leer artículo →
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700 sm:mb-3">
              <span>{post.tag ?? "Blog"}</span>
              <span className="text-gray-300">•</span>
              <span className="font-normal normal-case text-gray-500">
                {formatDate(post.pubDate)}
              </span>
            </div>

            <h3 className="mb-2 text-lg leading-tight font-bold text-gray-900 transition-colors group-hover:text-green-700 sm:mb-3 sm:text-xl">
              {post.title}
            </h3>

            <p className="line-clamp-3 flex-grow text-base text-gray-600">
              {post.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
