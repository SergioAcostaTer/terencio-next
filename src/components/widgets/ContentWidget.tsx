import Link from "next/link";

import BlogGrid from "@/components/BlogGrid";
import Icon from "@/components/ui/Icon";
import Section from "@/components/ui/Section";
import { getBlogPosts } from "@/lib/blog";

type ContentWidgetProps = {
  title?: string;
  subtitle?: string;
  collection: "blog" | "noticias";
  maxItems?: number;
  viewAllLink?: string;
  viewAllText?: string;
  bgClass?: string;
};

export default async function ContentWidget({
  title,
  subtitle,
  collection,
  maxItems = 3,
  viewAllLink,
  viewAllText,
  bgClass = "bg-white",
}: ContentWidgetProps) {
  if (collection !== "blog") {
    return null;
  }

  const items = (await getBlogPosts()).slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <Section className={bgClass}>
      {(title || subtitle) && (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
          <div className="flex-1">
            {subtitle ? (
              <span className="mb-2 block text-sm font-bold uppercase tracking-wider text-green-700">
                {subtitle}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                {title}
              </h2>
            ) : null}
          </div>

          <Link
            href={viewAllLink ?? "/blog"}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 text-base font-bold text-green-800 transition hover:bg-green-50 active:scale-[0.99]"
          >
            {viewAllText ?? "Ver todo el Blog"}
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>
      )}

      <BlogGrid posts={items} />
    </Section>
  );
}
