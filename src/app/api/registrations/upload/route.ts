import { NextResponse } from "next/server";

import { storeUploadedRegistrationDocument } from "@/lib/registrations/storage";
import type { DocumentType } from "@/lib/registrations/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");
    const draftId = formData.get("draftId");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No se ha recibido ningún archivo." }, { status: 400 });
    }

    const document = await storeUploadedRegistrationDocument({
      file,
      type: String(type) as DocumentType,
      draftId: typeof draftId === "string" ? draftId : null,
    });

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "No se pudo subir el documento.",
      },
      { status: 400 },
    );
  }
}
