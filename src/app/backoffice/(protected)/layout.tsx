import type { ReactNode } from "react";

import BackofficeLayoutShell from "@/components/backoffice/BackofficeLayoutShell";
import { requireAdminSession } from "@/lib/auth";
import { getBackofficeNavigation } from "@/lib/backoffice-navigation";

export default async function BackofficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();
  const navItems = await getBackofficeNavigation();

  return (
    <BackofficeLayoutShell navItems={navItems} sessionEmail={session.email}>
      {children}
    </BackofficeLayoutShell>
  );
}
