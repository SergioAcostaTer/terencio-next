import { promises as fs } from "node:fs";
import path from "node:path";

import type { StaticImageData } from "next/image";

import visitaEstudiantesImg from "@/assets/images/visita-estudiantes-bachillerato.webp";
import sostenibilidad1Img from "@/assets/images/sostenibilidad-1.webp";
import sostenibilidad2Img from "@/assets/images/sostenibilidad-2.webp";
import henryAcostaImg from "@/assets/images/henry-acosta-terencio-laguna.webp";
import terencioAcostaImg from "@/assets/images/terencio-acosta-entrevista.webp";
import traspasoHiperDinoImg from "@/assets/images/traspasohiperdinoterencio.webp";

export type NewsPostSummary = {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  image?: StaticImageData;
  imageAlt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  isBreaking?: boolean;
};

export type NewsPost = NewsPostSummary & {
  content: string;
  html: string;
};

const imageRegistry: Record<string, StaticImageData> = {
  "visita-estudiantes-bachillerato.webp": visitaEstudiantesImg,
  "sostenibilidad-1.webp": sostenibilidad1Img,
  "sostenibilidad-2.webp": sostenibilidad2Img,
  "henry-acosta-terencio-laguna.webp": henryAcostaImg,
  "terencio-acosta-entrevista.webp": terencioAcostaImg,
  "traspasohiperdinoterencio.webp": traspasoHiperDinoImg,
};

const newsDir = path.join(process.cwd(), "_astro_staged", "content", "noticias");

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {} as Record<string, string | string[] | boolean>;
  }

  const result: Record<string, string | string[] | boolean> = {};
  const lines = match[1].split(/\r?\n/);

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!rawValue) {
      continue;
    }

    if (rawValue.startsWith("[")) {
      try {
        result[key] = JSON.parse(rawValue) as string[];
      } catch {
        result[key] = [];
      }
      continue;
    }

    if (rawValue === "true" || rawValue === "false") {
      result[key] = rawValue === "true";
      continue;
    }

    result[key] = stripQuotes(rawValue);
  }

  return result;
}

function stripFrontmatter(source: string) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInlineMarkdown(value: string) {
  const escaped = escapeHtml(value);

  return escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function normalizeMarkdownAssetPaths(source: string) {
  return source.replace(
    /\.\.\/\.\.\/assets\/images\/([A-Za-z0-9._-]+)/g,
    (fullMatch, fileName: string) => imageRegistry[fileName]?.src ?? fullMatch,
  );
}

async function readNewsSource(slug: string) {
  const filePath = path.join(newsDir, `${slug}.md`);
  return fs.readFile(filePath, "utf8");
}

function mapNewsPost(fileName: string, source: string): NewsPost {
  const frontmatter = parseFrontmatter(source);
  const imagePath =
    typeof frontmatter.image === "string"
      ? path.basename(frontmatter.image)
      : undefined;
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  const rawContent = stripFrontmatter(source).trim();
  const content = normalizeMarkdownAssetPaths(rawContent);

  return {
    slug: fileName.replace(/\.md$/, ""),
    title: typeof frontmatter.title === "string" ? frontmatter.title : "",
    description:
      typeof frontmatter.description === "string" ? frontmatter.description : "",
    pubDate: new Date(
      typeof frontmatter.pubDate === "string" ? frontmatter.pubDate : Date.now(),
    ),
    image: imagePath ? imageRegistry[imagePath] : undefined,
    imageAlt:
      typeof frontmatter.imageAlt === "string"
        ? frontmatter.imageAlt
        : typeof frontmatter.title === "string"
          ? frontmatter.title
          : undefined,
    author:
      typeof frontmatter.author === "string"
        ? frontmatter.author
        : "Equipo Terencio",
    category:
      typeof frontmatter.category === "string" ? frontmatter.category : undefined,
    tags,
    isBreaking:
      typeof frontmatter.isBreaking === "boolean"
        ? frontmatter.isBreaking
        : false,
    content,
    html: normalizeMarkdownAssetPaths(rawContent),
  };
}

export async function getNewsPosts(): Promise<NewsPostSummary[]> {
  const fileNames = await fs.readdir(newsDir);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) =>
        mapNewsPost(fileName, await fs.readFile(path.join(newsDir, fileName), "utf8")),
      ),
  );

  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export async function getNewsPostBySlug(slug: string) {
  try {
    return mapNewsPost(`${slug}.md`, await readNewsSource(slug));
  } catch {
    return null;
  }
}
