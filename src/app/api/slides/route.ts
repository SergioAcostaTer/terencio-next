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
    type: formData.get("type"),
    durationSec: formData.get("durationSec"),
    order: formData.get("order"),
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de diapositiva no válidos." },
      { status: 400 },
    );
  }

  try {
    const mediaFile = validateUploadFile(formData.get("file") as File | null, {
      required: true,
      label: "El archivo de la diapositiva",
      allowedTypes: slideFileTypes,
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: "El archivo es obligatorio." },
        { status: 400 },
      );
    }

    const upload = await uploadFile(mediaFile, "slides");
    const slide = await prisma.slide.create({
      data: {
        ...parsed.data,
        url: upload.url,
        key: upload.key,
      },
    });

    return NextResponse.json(slide, { status: 201 });
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
