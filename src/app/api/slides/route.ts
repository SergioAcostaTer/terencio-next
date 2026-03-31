import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import {
  slideFileTypes,
  slideFormSchema,
  validateUploadFile,
} from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/r2";

export const dynamic = "force-dynamic";

function inferSlideType(file: File) {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  throw new Error("El archivo no tiene un formato compatible.");
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  const items = await prisma.slide.findMany({
    where: session ? undefined : { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const parsed = slideFormSchema.safeParse({
    durationSec: formData.get("durationSec"),
    order: formData.get("order") ?? undefined,
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de diapositiva no válidos." },
      { status: 400 },
    );
  }

  try {
    const rawFiles = formData.getAll("files");
    const fallbackFile = formData.get("file");
    const candidateFiles = (rawFiles.length > 0 ? rawFiles : [fallbackFile]).filter(
      (value): value is File => value instanceof File,
    );

    const mediaFiles = candidateFiles
      .map((file) =>
        validateUploadFile(file, {
          required: true,
          label: "El archivo de la diapositiva",
          allowedTypes: slideFileTypes,
        }),
      )
      .filter((file): file is File => file !== null);

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { error: "Debes subir al menos un archivo." },
        { status: 400 },
      );
    }

    const currentMax = await prisma.slide.aggregate({
      _max: { order: true },
    });
    const startOrder =
      parsed.data.order ?? ((currentMax._max.order ?? -1) + 1);

    const createdSlides = [];

    for (const [index, mediaFile] of mediaFiles.entries()) {
      const upload = await uploadFile(mediaFile, "slides");

      if (!upload.url) {
        throw new Error("No se pudo generar la URL pública de la diapositiva.");
      }

      const slide = await prisma.slide.create({
        data: {
          type: inferSlideType(mediaFile),
          durationSec: parsed.data.durationSec,
          order: startOrder + index,
          isActive: parsed.data.isActive,
          url: upload.url,
          key: upload.key,
        },
      });

      createdSlides.push(slide);
    }

    return NextResponse.json(createdSlides, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo crear la diapositiva.",
      },
      { status: 500 },
    );
  }
}
