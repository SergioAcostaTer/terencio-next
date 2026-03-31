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
import { displayCommandSchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = displayCommandSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Comando no válido." }, { status: 400 });
  }

  const display = await prisma.displayDevice.findUnique({
    where: { id },
    include: displayDeviceInclude,
  });

  if (!display) {
    return NextResponse.json({ error: "Pantalla no encontrada." }, { status: 404 });
  }

  const playlistLength = display.playlist?.items.length ?? 0;
  let manualIndex = display.manualIndex;

  if (parsed.data.command === "NEXT") {
    manualIndex = normalizeManualIndex(display.manualIndex + 1, playlistLength);
  }

  if (parsed.data.command === "PREVIOUS") {
    manualIndex = normalizeManualIndex(display.manualIndex - 1, playlistLength);
  }

  const updated = await prisma.displayDevice.update({
    where: { id },
    data: createDisplayUpdateData({
      mode: display.mode,
      playlistId: display.playlistId,
      pinnedAssetId: display.pinnedAssetId,
      manualIndex,
      lastCommand: parsed.data.command,
    }),
    include: displayDeviceInclude,
  });

  if (updated.deviceToken) {
    publishDisplay(updated.deviceToken, serializeDisplayState(updated));
  }

  return NextResponse.json(serializeDisplayAdmin(updated));
}
