import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { slideUpdateSchema } from "@/lib/membership";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/r2";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = slideUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const slide = await prisma.slide.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(slide);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const slide = await prisma.slide.delete({
    where: { id },
  });

  await deleteFile(slide.key, "slides").catch(() => undefined);

  return NextResponse.json({ ok: true });
}
