import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import {
  displayDeviceInclude,
  generateDeviceToken,
  publishDisplay,
  serializeDisplayAdmin,
  serializeDisplayState,
} from "@/lib/display";
import { displayPairSchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = displayPairSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de vinculación no válidos." }, { status: 400 });
  }

  const device = await prisma.displayDevice.findFirst({
    where: {
      pairingCode: parsed.data.pairingCode,
      isPaired: false,
      pairingExpiresAt: {
        gt: new Date(),
      },
    },
    include: displayDeviceInclude,
  });

  if (!device) {
    return NextResponse.json({ error: "PIN no válido o expirado." }, { status: 404 });
  }

  const deviceToken = device.deviceToken ?? generateDeviceToken();
  const paired = await prisma.displayDevice.update({
    where: { id: device.id },
    data: {
      name: parsed.data.name,
      isPaired: true,
      pairingExpiresAt: null,
      deviceToken,
      lastPing: new Date(),
      configVersion: { increment: 1 },
      lastCommand: "CONFIG_SYNC",
      lastCommandAt: new Date(),
    },
    include: displayDeviceInclude,
  });

  publishDisplay(deviceToken, serializeDisplayState(paired));

  return NextResponse.json({
    deviceToken,
    display: serializeDisplayAdmin(paired),
  });
}
