import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const items = await prisma.membershipSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}
