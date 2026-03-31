import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const device = await prisma.displayDevice.updateMany({
    where: {
      deviceToken: id,
      isPaired: true,
    },
    data: {
      lastPing: new Date(),
    },
  });

  if (device.count === 0) {
    return NextResponse.json({ error: "Dispositivo no válido." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
