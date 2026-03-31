import { promises as fs } from "node:fs";
import path from "node:path";

import type { StaticImageData } from "next/image";

import paisajeImg from "@/assets/images/paisaje.webp";
import paisaje2Img from "@/assets/images/paisaje-2.webp";
import quesoMojoImg from "@/assets/images/queso_mojo.webp";
import cocheImg from "@/assets/images/coche.webp";
import supermercadoInteriorImg from "@/assets/images/supermercado-interior.webp";
import visitaEstudiantesImg from "@/assets/images/visita-estudiantes-bachillerato.webp";
import sostenibilidad2Img from "@/assets/images/sostenibilidad-2.webp";
import henryAcostaImg from "@/assets/images/henry-acosta-terencio-laguna.webp";
import quesadillasImg from "@/assets/images/quesadillas.webp";
import heroBgImg from "@/assets/images/hero-bg.webp";
import cargadoresElectricosImg from "@/assets/images/cargadores-electricos.webp";
import elHierroCharcoImg from "@/assets/images/el-hierro-charco.webp";
import ecomuseoGuineaImg from "@/assets/images/ecomuseo_guinea.webp";
import faroOrchillaImg from "@/assets/images/faro_orchilla.webp";
import buceoElHierroExperienciaImg from "@/assets/images/buceo-el-hierro-experiencia.webp";
import buceoLaRestingaImg from "@/assets/images/buceo_la_restinga.webp";
import miradorIsoraImg from "@/assets/images/mirador-isora.webp";
import roqueBonanzaImg from "@/assets/images/Roque-Bonanza-El-Hierro.webp";
import miradorLasPlayasImg from "@/assets/images/mirador_las_playas.webp";
import terencioAcostaImg from "@/assets/images/terencio-acosta-entrevista.webp";
import tuboVolcanicoGuineaImg from "@/assets/images/tubo_volcanico_guinea.webp";
import rutaVolcanesImg from "@/assets/images/ruta_volcanes.webp";
import vinosElHierroImg from "@/assets/images/vinos_el_hierro.webp";

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  image?: StaticImageData;
  imageAlt?: string;
  author?: string;
  category?: string;
  tags?: string[];
  tag?: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
  html: string;
};

const imageRegistry: Record<string, StaticImageData> = {
  "paisaje.webp": paisajeImg,
  "paisaje-2.webp": paisaje2Img,
  "queso_mojo.webp": quesoMojoImg,
  "coche.webp": cocheImg,
  "supermercado-interior.webp": supermercadoInteriorImg,
  "visita-estudiantes-bachillerato.webp": visitaEstudiantesImg,
  "sostenibilidad-2.webp": sostenibilidad2Img,
  "henry-acosta-terencio-laguna.webp": henryAcostaImg,
  "quesadillas.webp": quesadillasImg,
  "hero-bg.webp": heroBgImg,
  "cargadores-electricos.webp": cargadoresElectricosImg,
  "el-hierro-charco.webp": elHierroCharcoImg,
  "ecomuseo_guinea.webp": ecomuseoGuineaImg,
  "faro_orchilla.webp": faroOrchillaImg,
  "buceo-el-hierro-experiencia.webp": buceoElHierroExperienciaImg,
  "buceo_la_restinga.webp": buceoLaRestingaImg,
  "mirador-isora.webp": miradorIsoraImg,
  "Roque-Bonanza-El-Hierro.webp": roqueBonanzaImg,
  "mirador_las_playas.webp": miradorLasPlayasImg,
  "terencio-acosta-entrevista.webp": terencioAcostaImg,
  "tubo_volcanico_guinea.webp": tuboVolcanicoGuineaImg,
  "ruta_volcanes.webp": rutaVolcanesImg,
  "vinos_el_hierro.webp": vinosElHierroImg,
};

const blogDir = path.join(process.cwd(), "_astro_staged", "content", "blog");

function stripQuotes(value: string) {
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!match) {
    return {} as Record<string, string | string[]>;
  }

  const result: Record<string, string | string[]> = {};
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

async function readBlogSource(slug: string) {
  const filePath = path.join(blogDir, `${slug}.md`);
  return fs.readFile(filePath, "utf8");
}

function mapBlogPost(fileName: string, source: string): BlogPost {
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
      typeof frontmatter.author === "string" ? frontmatter.author : "Equipo Terencio",
    category:
      typeof frontmatter.category === "string" ? frontmatter.category : undefined,
    tags,
    tag:
      typeof frontmatter.category === "string"
        ? frontmatter.category
        : typeof tags[0] === "string"
          ? tags[0]
          : "Blog",
    content,
    html: normalizeMarkdownAssetPaths(rawContent),
  };
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const fileNames = await fs.readdir(blogDir);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => mapBlogPost(fileName, await fs.readFile(path.join(blogDir, fileName), "utf8"))),
  );

  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  try {
    return mapBlogPost(`${slug}.md`, await readBlogSource(slug));
  } catch {
    return null;
  }
}
