import { NextResponse } from "next/server";

import type { RegistrationDraftPayload } from "@/lib/registrations/types";
import { saveRegistrationDraft } from "@/lib/registrations/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegistrationDraftPayload;
    const record = await saveRegistrationDraft(body);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "No se pudo guardar el borrador.",
      },
      { status: 400 },
    );
  }
}
