import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import {
  createDisplayUpdateData,
  displayDeviceInclude,
  normalizeManualIndex,
  publishDisplay,
  serializeDisplayAdmin,
  serializeDisplayState,
} from "@/lib/display";
import { updateDisplaySchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const display = await prisma.displayDevice.findUnique({
    where: { id },
    include: displayDeviceInclude,
  });

  if (!display) {
    return NextResponse.json({ error: "Pantalla no encontrada." }, { status: 404 });
  }

  return NextResponse.json(serializeDisplayAdmin(display));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateDisplaySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de pantalla no válidos." }, { status: 400 });
  }

  const current = await prisma.displayDevice.findUnique({
    where: { id },
    include: displayDeviceInclude,
  });

  if (!current) {
    return NextResponse.json({ error: "Pantalla no encontrada." }, { status: 404 });
  }

  if (parsed.data.playlistId) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: parsed.data.playlistId },
      include: { items: true },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist no encontrada." }, { status: 404 });
    }
  }

  if (parsed.data.pinnedAssetId) {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id: parsed.data.pinnedAssetId },
      select: { id: true },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset no encontrado." }, { status: 404 });
    }
  }

  const nextPlaylistId =
    parsed.data.playlistId !== undefined ? parsed.data.playlistId : current.playlistId;
  const nextMode = parsed.data.mode ?? current.mode;
  const nextPlaylistItems =
    nextPlaylistId === current.playlistId
      ? (current.playlist?.items ?? [])
      : nextPlaylistId
        ? await prisma.playlistAsset.findMany({
            where: { playlistId: nextPlaylistId },
            orderBy: { order: "asc" },
          })
        : [];
  const manualIndex = normalizeManualIndex(
    parsed.data.manualIndex ?? current.manualIndex,
    nextPlaylistItems.length,
  );

  const display = await prisma.displayDevice.update({
    where: { id },
    data: {
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      ...createDisplayUpdateData({
        mode: nextMode,
        playlistId: nextPlaylistId,
        pinnedAssetId: parsed.data.pinnedAssetId !== undefined ? parsed.data.pinnedAssetId : current.pinnedAssetId,
        manualIndex,
        lastCommand: "CONFIG_SYNC",
      }),
    },
    include: displayDeviceInclude,
  });

  if (display.deviceToken) {
    publishDisplay(display.deviceToken, serializeDisplayState(display));
  }

  return NextResponse.json(serializeDisplayAdmin(display));
}
