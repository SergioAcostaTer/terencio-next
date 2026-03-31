import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { playlistInclude, serializePlaylistDetails } from "@/lib/display";
import { createPlaylistSchema } from "@/lib/display-validation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const playlists = await prisma.playlist.findMany({
    include: playlistInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(playlists.map(serializePlaylistDetails));
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "slides.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createPlaylistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de playlist no válidos." }, { status: 400 });
  }

  const playlist = await prisma.playlist.create({
    data: {
      name: parsed.data.name,
    },
    include: playlistInclude,
  });

  return NextResponse.json(serializePlaylistDetails(playlist), { status: 201 });
}
