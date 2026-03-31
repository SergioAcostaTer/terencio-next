import "server-only";

import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import type { AdminRole, PermissionKey } from "@/lib/admin-users";
import { hasPermission, isRootAdminEmail } from "@/lib/admin-users";
import { getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "terencio_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  email: string;
};

export type AdminSession = SessionPayload & {
  role: AdminRole;
  isRoot: boolean;
};

function getSecretKey() {
  return new TextEncoder().encode(getEnv().AUTH_SECRET);
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ["HS256"],
  });

  return payload as SessionPayload;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function resolveSessionFromToken(token: string | undefined) {
  if (!token) {
    return { session: null, disabled: false as const };
  }

  let payload: SessionPayload;

  try {
    payload = await verifyToken(token);
  } catch {
    return { session: null, disabled: false as const };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!admin || !admin.isActive) {
    return { session: null, disabled: true as const };
  }

  return {
    session: {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      isRoot: isRootAdminEmail(admin.email, getEnv().ADMIN_EMAIL),
    } satisfies AdminSession,
    disabled: false as const,
  };
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const { session } = await resolveSessionFromToken(token);
  return session;
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { session } = await resolveSessionFromToken(token);
  return session;
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const { session, disabled } = await resolveSessionFromToken(token);

  if (!session) {
    if (disabled) {
      redirect("/api/auth/logout?next=/backoffice/login?error=account_disabled");
    }

    redirect("/backoffice/login");
  }

  return session;
}

export async function requireAdminPermission(permission: PermissionKey) {
  const session = await requireAdminSession();

  if (!hasPermission(session.role, permission)) {
    redirect("/backoffice");
  }

  return session;
}

export function assertPermission(session: AdminSession, permission: PermissionKey) {
  return hasPermission(session.role, permission);
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.passwordHash);

  if (!isValid) {
    return null;
  }

  return admin;
}
