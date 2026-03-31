import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createAdminUserSchema, isRootAdminEmail } from "@/lib/admin-users";
import { assertPermission, getSessionFromRequest } from "@/lib/auth";
import { getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "users.read")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users.map(serializeUser));
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session || !assertPermission(session, "users.write")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createAdminUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de usuario no válidos." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ error: "Ese email ya existe." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      role: parsed.data.role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(serializeUser(user), { status: 201 });
}
