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
import { createPlaylistItemSchema } from "@/lib/display-validation";
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

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = createPlaylistItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Item de playlist no válido." }, { status: 400 });
  }

  const aggregate = await prisma.playlistAsset.aggregate({
    where: { playlistId: id },
    _max: { order: true },
  });

  await prisma.playlistAsset.create({
    data: {
      playlistId: id,
      assetId: parsed.data.assetId,
      durationSec: parsed.data.durationSec,
      order: (aggregate._max.order ?? -1) + 1,
    },
  });

  const playlist = await prisma.playlist.findUnique({
    where: { id },
    include: playlistInclude,
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist no encontrada." }, { status: 404 });
  }

  await publishPlaylistDisplays(id);

  return NextResponse.json(serializePlaylistDetails(playlist), { status: 201 });
}
