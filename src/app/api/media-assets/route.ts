import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { inferAssetNameFromKey, serializeMediaAsset } from "@/lib/display";
import { validateMediaUpload } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/r2";

export const dynamic = "force-dynamic";

function inferMediaType(file: File) {
  if (file.type.startsWith("video/")) {
    return "video" as const;
  }

  return "image" as const;
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets.map(serializeMediaAsset));
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll("files");
    const fallbackFile = formData.get("file");
    const files = (rawFiles.length > 0 ? rawFiles : [fallbackFile]).filter(
      (value): value is File => value instanceof File,
    );

    if (files.length === 0) {
      return NextResponse.json({ error: "Debes subir al menos un archivo." }, { status: 400 });
    }

    const created = [];

    for (const file of files) {
      const validFile = validateMediaUpload(file);
      const upload = await uploadFile(validFile, "media");

      if (!upload.url) {
        throw new Error("No se pudo generar la URL pública del asset.");
      }

      const name = String(formData.get("name") || "").trim() || inferAssetNameFromKey(upload.key);

      const asset = await prisma.mediaAsset.create({
        data: {
          name,
          type: inferMediaType(validFile),
          url: upload.url,
          key: upload.key,
        },
      });

      created.push(serializeMediaAsset(asset));
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "No se pudo subir el asset.",
      },
      { status: 500 },
    );
  }
}
