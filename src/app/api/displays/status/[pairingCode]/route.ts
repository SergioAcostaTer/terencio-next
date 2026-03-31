import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    pairingCode: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { pairingCode } = await context.params;
  const device = await prisma.displayDevice.findFirst({
    where: {
      pairingCode,
      OR: [
        { isPaired: true },
        {
          isPaired: false,
          pairingExpiresAt: {
            gt: new Date(),
          },
        },
      ],
    },
    select: {
      isPaired: true,
      deviceToken: true,
      pairingExpiresAt: true,
      name: true,
    },
  });

  if (!device) {
    return NextResponse.json({ status: "expired" }, { status: 404 });
  }

  return NextResponse.json({
    status: device.isPaired ? "paired" : "pending",
    deviceToken: device.deviceToken,
    pairingExpiresAt: device.pairingExpiresAt?.toISOString() ?? null,
    name: device.name,
  });
}
