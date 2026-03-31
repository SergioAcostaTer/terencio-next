import type { ReactNode } from "react";

import BackofficeLayoutShell from "@/components/backoffice/BackofficeLayoutShell";
import { hasPermission, segmentPermissions } from "@/lib/admin-users";
import { requireAdminSession } from "@/lib/auth";
import { getBackofficeNavigation } from "@/lib/backoffice-navigation";

export default async function BackofficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdminSession();
  const navItems = await getBackofficeNavigation();
  const visibleNavItems = navItems.filter((item) => {
    const permission = segmentPermissions[item.segment as keyof typeof segmentPermissions];
    return permission ? hasPermission(session.role, permission) : false;
  });

  return (
    <BackofficeLayoutShell
      navItems={visibleNavItems}
      sessionEmail={session.email}
      sessionRole={session.role}
    >
      {children}
    </BackofficeLayoutShell>
  );
}
