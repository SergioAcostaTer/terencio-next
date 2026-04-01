import { NextResponse } from "next/server";

import { requireAdminPermission } from "@/lib/auth";
import { getRegistrationDetail, transitionRegistrationStatus } from "@/lib/registrations/service";
import type { RegistrationStatus } from "@/lib/registrations/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  await requireAdminPermission("memberships.read");

  const { id } = await context.params;
  const detail = await getRegistrationDetail(id);

  if (!detail) {
    return NextResponse.json({ success: false, error: "Registro no encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    ...detail,
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  await requireAdminPermission("memberships.read");

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: RegistrationStatus };

    if (!body.status) {
      return NextResponse.json({ success: false, error: "Falta el nuevo estado." }, { status: 400 });
    }

    const record = await transitionRegistrationStatus(id, body.status);

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "No se pudo actualizar el estado.",
      },
      { status: 400 },
    );
  }
}
