import type { ReactNode } from "react";
import Link from "next/link";

import LogoutButton from "@/components/backoffice/LogoutButton";
import { requireAdminSession } from "@/lib/auth";

export default async function BackofficeProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Backoffice
            </p>
            <h1 className="text-2xl font-black">Terencio</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-slate-500 sm:block">{session.email}</p>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
          <nav className="space-y-2">
            <Link
              href="/backoffice/memberships"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Memberships
            </Link>
            <Link
              href="/backoffice/slides"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Slides
            </Link>
            <Link
              href="/display"
              className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              Ver pantalla
            </Link>
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
