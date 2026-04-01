import { NextResponse } from "next/server";

import { requireAdminPermission } from "@/lib/auth";
import { listRegistrations } from "@/lib/registrations/service";
import type { RegistrationStatus } from "@/lib/registrations/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await requireAdminPermission("memberships.read");

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") ?? "all") as RegistrationStatus | "all";
  const search = searchParams.get("search") ?? "";

  const items = await listRegistrations({ status, search });

  return NextResponse.json({
    success: true,
    items,
  });
}
