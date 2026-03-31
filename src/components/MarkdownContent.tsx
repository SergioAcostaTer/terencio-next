import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export default function MarkdownContent({
  content,
  className = "",
}: MarkdownContentProps) {
  return (
    <div
      className={`max-w-none text-[1.05rem] leading-8 text-gray-700 ${className}`.trim()}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            if (href?.startsWith("/")) {
              return (
                <Link
                  href={href}
                  className="font-semibold text-green-700 underline decoration-green-300 underline-offset-4 transition hover:text-green-800"
                  {...props}
                >
                  {children}
                </Link>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-green-700 underline decoration-green-300 underline-offset-4 transition hover:text-green-800"
                {...props}
              >
                {children}
              </a>
            );
          },
          h1: ({ children }) => (
            <h1 className="mt-10 mb-5 text-3xl font-bold text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 mb-5 text-2xl font-bold text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 mb-4 text-xl font-bold text-gray-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-8 mb-3 text-lg font-bold text-gray-900">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="my-5 text-gray-700">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-5 ml-6 list-disc space-y-2 marker:text-green-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 ml-6 list-decimal space-y-2 marker:font-semibold marker:text-green-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-2xl border-l-4 border-green-700 bg-green-50 px-6 py-4 italic text-gray-700">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-10 border-0 border-t border-gray-200" />,
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full border-collapse bg-white text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-900 text-white">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
          tr: ({ children }) => <tr className="align-top">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-sm font-bold whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700">{children}</td>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => (
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.95em] text-gray-900">
              {children}
            </code>
          ),
          img: ({ src, alt }) => {
            if (typeof src !== "string" || !src) {
              return null;
            }

            return (
              <div className="relative my-8 block h-[320px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[420px]">
                <Image
                  src={src}
                  alt={alt || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
