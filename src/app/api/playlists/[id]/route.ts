import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import {
  displayDeviceInclude,
  playlistInclude,
  publishDisplay,
  serializeDisplayState,
  serializePlaylistDetails,
} from "@/lib/display";
import { updatePlaylistSchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function publishPlaylistDisplays(playlistId: string) {
  const displays = await prisma.displayDevice.findMany({
    where: {
      playlistId,
      deviceToken: {
        not: null,
      },
    },
    include: displayDeviceInclude,
  });

  for (const display of displays) {
    if (display.deviceToken) {
      publishDisplay(display.deviceToken, serializeDisplayState(display));
    }
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: playlistInclude,
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist no encontrada." }, { status: 404 });
  }

  return NextResponse.json(serializePlaylistDetails(playlist));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updatePlaylistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de playlist no válidos." }, { status: 400 });
  }

  if (parsed.data.items) {
    const updates = parsed.data.items;

    await prisma.$transaction(
      updates.map((item) =>
        prisma.playlistAsset.update({
          where: { id: item.id },
          data: {
            order: item.order,
            durationSec: item.durationSec,
          },
        }),
      ),
    );
  }

  const playlist = await prisma.playlist.update({
    where: { id },
    data: {
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
    },
    include: playlistInclude,
  });

  await publishPlaylistDisplays(id);

  return NextResponse.json(serializePlaylistDetails(playlist));
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const impactedDisplays = await prisma.displayDevice.findMany({
    where: {
      playlistId: id,
      deviceToken: {
        not: null,
      },
    },
    select: {
      id: true,
      deviceToken: true,
    },
  });

  await prisma.playlist.delete({
    where: { id },
  });

  for (const display of impactedDisplays) {
    if (!display.deviceToken) {
      continue;
    }

    const refreshed = await prisma.displayDevice.findUnique({
      where: { id: display.id },
      include: displayDeviceInclude,
    });

    if (refreshed) {
      publishDisplay(display.deviceToken, serializeDisplayState(refreshed));
    }
  }

  return NextResponse.json({ ok: true });
}
