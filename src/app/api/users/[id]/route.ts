import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getEnv } from "@/lib/env";
import { isRootAdminEmail, updateAdminUserSchema } from "@/lib/admin-users";
import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

function serializeUser(user: {
  id: string;
  email: string;
  role: "ROOT" | "ADMIN" | "EDITOR" | "VIEWER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...user,
    isRoot: isRootAdminEmail(user.email, getEnv().ADMIN_EMAIL),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "users.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateAdminUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de usuario no válidos." }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });

  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (isRootAdminEmail(target.email, getEnv().ADMIN_EMAIL)) {
    return NextResponse.json(
      { error: "La cuenta ROOT no puede modificarse desde el backoffice." },
      { status: 403 },
    );
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(serializeUser(user));
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "users.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });

  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
  }

  if (target.id === session.userId) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta desde la sesión actual." },
      { status: 400 },
    );
  }

  if (isRootAdminEmail(target.email, getEnv().ADMIN_EMAIL)) {
    return NextResponse.json(
      { error: "La cuenta ROOT no puede eliminarse." },
      { status: 403 },
    );
  }

  await prisma.adminUser.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
