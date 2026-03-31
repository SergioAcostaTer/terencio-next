import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

import type { IconName } from "@/components/ui/Icon";

export type BackofficeNavItem = {
  href: string;
  label: string;
  segment: string;
  icon: IconName;
  description?: string;
};

type NavOverride = {
  label: string;
  icon: IconName;
  description?: string;
  order: number;
};

const NAV_OVERRIDES: Record<string, NavOverride> = {
  submissions: {
    label: "Consultas",
    icon: "PanelsTopLeft",
    description: "Mensajes y captación",
    order: 1,
  },
  memberships: {
    label: "Socios",
    icon: "Users",
    description: "Altas y documentación",
    order: 2,
  },
  slides: {
    label: "Pantalla TV",
    icon: "MonitorPlay",
    description: "Creatividades del display",
    order: 3,
  },
  users: {
    label: "Usuarios",
    icon: "ShieldCheck",
    description: "Roles, acceso y sesiones",
    order: 4,
  },
};

const PAGE_FILES = new Set(["page.tsx", "page.ts", "page.jsx", "page.js"]);

function isStaticRouteSegment(segment: string) {
  return !segment.startsWith("(") && !segment.startsWith("[") && !segment.startsWith("_");
}

function toLabel(segment: string) {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getBackofficeNavigation(): Promise<BackofficeNavItem[]> {
  const protectedDir = path.join(
    process.cwd(),
    "src",
    "app",
    "backoffice",
    "(protected)",
  );

  const entries = await readdir(protectedDir, { withFileTypes: true });

  const navItems = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && isStaticRouteSegment(entry.name))
      .map(async (entry) => {
        const childEntries = await readdir(path.join(protectedDir, entry.name), {
          withFileTypes: true,
        });
        const hasPage = childEntries.some((child) => child.isFile() && PAGE_FILES.has(child.name));

        if (!hasPage) {
          return null;
        }

        const override = NAV_OVERRIDES[entry.name];

        return {
          href: `/backoffice/${entry.name}`,
          label: override?.label ?? toLabel(entry.name),
          segment: entry.name,
          icon: override?.icon ?? "LayoutGrid",
          description: override?.description,
          order: override?.order ?? 999,
        };
      }),
  );

  const resolvedItems = navItems.filter((item) => item !== null);

  return resolvedItems
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "es"))
    .map(({ order: _order, ...item }) => item);
}
