import { NextResponse } from "next/server";

import { authenticateAdmin, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/membership";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Credenciales no válidas." },
      { status: 400 },
    );
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);

  if (!admin) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos." },
      { status: 401 },
    );
  }

  await createSession({
    userId: admin.id,
    email: admin.email,
  });

  return NextResponse.json({ ok: true });
}
