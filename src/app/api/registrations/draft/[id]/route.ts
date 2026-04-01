import { NextResponse } from "next/server";

import { getRegistrationDraftById } from "@/lib/registrations/service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const record = await getRegistrationDraftById(id);

  if (!record) {
    return NextResponse.json({ success: false, error: "Borrador no encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    record,
  });
}
