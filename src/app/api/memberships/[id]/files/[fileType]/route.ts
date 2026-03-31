import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrivateSignedUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
    fileType: string;
  }>;
};

function getFileKey(
  submission: {
    dniFileKey: string | null;
    modelFileKey: string | null;
    certificateKey: string | null;
  },
  fileType: string,
) {
  switch (fileType) {
    case "dni":
      return submission.dniFileKey;
    case "model":
      return submission.modelFileKey;
    case "certificate":
      return submission.certificateKey;
    default:
      return null;
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id, fileType } = await context.params;
  const submission = await prisma.membershipSubmission.findUnique({
    where: { id },
    select: {
      dniFileKey: true,
      modelFileKey: true,
      certificateKey: true,
    },
  });

  if (!submission) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  const key = getFileKey(submission, fileType);

  if (!key) {
    return NextResponse.json({ error: "Archivo no encontrado." }, { status: 404 });
  }

  const signedUrl = await getPrivateSignedUrl(key);
  return NextResponse.redirect(signedUrl);
}
