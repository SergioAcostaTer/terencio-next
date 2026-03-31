import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import {
  displayDeviceInclude,
  publishDisplay,
  serializeDisplayState,
} from "@/lib/display";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/r2";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const impactedDisplays = await prisma.displayDevice.findMany({
    where: {
      OR: [
        { pinnedAssetId: id },
        {
          playlist: {
            items: {
              some: {
                assetId: id,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      deviceToken: true,
    },
  });

  const asset = await prisma.mediaAsset.delete({
    where: { id },
  });

  await deleteFile(asset.key, "media").catch(() => undefined);

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
