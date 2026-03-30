import { promises as fs } from "node:fs";
import path from "node:path";

import type { StaticImageData } from "next/image";

import paisajeImg from "@/assets/images/paisaje.webp";
import quesoMojoImg from "@/assets/images/queso_mojo.webp";
import cocheImg from "@/assets/images/coche.webp";
import supermercadoInteriorImg from "@/assets/images/supermercado-interior.webp";
import visitaEstudiantesImg from "@/assets/images/visita-estudiantes-bachillerato.webp";
import sostenibilidad2Img from "@/assets/images/sostenibilidad-2.webp";
import henryAcostaImg from "@/assets/images/henry-acosta-terencio-laguna.webp";
import quesadillasImg from "@/assets/images/quesadillas.webp";
import heroBgImg from "@/assets/images/hero-bg.webp";
import cargadoresElectricosImg from "@/assets/images/cargadores-electricos.webp";
import faroOrchillaImg from "@/assets/images/faro_orchilla.webp";
import roqueBonanzaImg from "@/assets/images/Roque-Bonanza-El-Hierro.webp";
import miradorLasPlayasImg from "@/assets/images/mirador_las_playas.webp";
import terencioAcostaImg from "@/assets/images/terencio-acosta-entrevista.webp";

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  image?: StaticImageData;
  tag?: string;
};

const imageRegistry: Record<string, StaticImageData> = {
  "paisaje.webp": paisajeImg,
  "queso_mojo.webp": quesoMojoImg,
  "coche.webp": cocheImg,
  "supermercado-interior.webp": supermercadoInteriorImg,
  "visita-estudiantes-bachillerato.webp": visitaEstudiantesImg,
  "sostenibilidad-2.webp": sostenibilidad2Img,
  "henry-acosta-terencio-laguna.webp": henryAcostaImg,
  "quesadillas.webp": quesadillasImg,
  "hero-bg.webp": heroBgImg,
  "cargadores-electricos.webp": cargadoresElectricosImg,
  "faro_orchilla.webp": faroOrchillaImg,
  "Roque-Bonanza-El-Hierro.webp": roqueBonanzaImg,
  "mirador_las_playas.webp": miradorLasPlayasImg,
  "terencio-acosta-entrevista.webp": terencioAcostaImg,
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

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const fileNames = await fs.readdir(blogDir);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map(async (fileName) => {
        const source = await fs.readFile(path.join(blogDir, fileName), "utf8");
        const frontmatter = parseFrontmatter(source);
        const imagePath =
          typeof frontmatter.image === "string"
            ? path.basename(frontmatter.image)
            : undefined;
        const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

        return {
          slug: fileName.replace(/\.md$/, ""),
          title:
            typeof frontmatter.title === "string" ? frontmatter.title : "",
          description:
            typeof frontmatter.description === "string"
              ? frontmatter.description
              : "",
          pubDate: new Date(
            typeof frontmatter.pubDate === "string"
              ? frontmatter.pubDate
              : Date.now(),
          ),
          image: imagePath ? imageRegistry[imagePath] : undefined,
          tag: typeof tags[0] === "string" ? tags[0] : "Blog",
        };
      }),
  );

  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}
