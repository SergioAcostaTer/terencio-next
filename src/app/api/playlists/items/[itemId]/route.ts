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
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    itemId: string;
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { itemId } = await context.params;
  const deletedItem = await prisma.playlistAsset.delete({
    where: { id: itemId },
  });

  const remainingItems = await prisma.playlistAsset.findMany({
    where: { playlistId: deletedItem.playlistId },
    orderBy: { order: "asc" },
  });

  await prisma.$transaction(
    remainingItems.map((item, index) =>
      prisma.playlistAsset.update({
        where: { id: item.id },
        data: { order: index },
      }),
    ),
  );

  const playlist = await prisma.playlist.findUnique({
    where: { id: deletedItem.playlistId },
    include: playlistInclude,
  });

  if (!playlist) {
    return NextResponse.json({ ok: true });
  }

  await publishPlaylistDisplays(deletedItem.playlistId);

  return NextResponse.json(serializePlaylistDetails(playlist));
}
