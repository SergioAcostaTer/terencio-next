import { NextResponse } from "next/server";

import { submitRegistration } from "@/lib/registrations/service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };

    if (!body.id) {
      return NextResponse.json({ success: false, error: "Falta el identificador del borrador." }, { status: 400 });
    }

    const result = await submitRegistration(body.id);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "No se pudo enviar la solicitud.",
      },
      { status: 400 },
    );
  }
}
