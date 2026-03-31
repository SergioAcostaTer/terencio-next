import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { displayDeviceInclude, serializeDisplayAdmin } from "@/lib/display";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const displays = await prisma.displayDevice.findMany({
    where: { isPaired: true },
    include: displayDeviceInclude,
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json(displays.map(serializeDisplayAdmin));
}
