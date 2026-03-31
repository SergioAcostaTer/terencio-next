import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  displayDeviceInclude,
  serializeDisplayState,
} from "@/lib/display";
import { deviceSessionSchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = deviceSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Token de dispositivo no válido." }, { status: 400 });
  }

  const device = await prisma.displayDevice.findFirst({
    where: {
      deviceToken: parsed.data.deviceToken,
      isPaired: true,
    },
    include: displayDeviceInclude,
  });

  if (!device) {
    return NextResponse.json({ error: "Dispositivo no válido." }, { status: 404 });
  }

  return NextResponse.json(serializeDisplayState(device));
}
