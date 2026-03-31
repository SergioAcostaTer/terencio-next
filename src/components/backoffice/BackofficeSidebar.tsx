"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import Icon from "@/components/ui/Icon";
import type { BackofficeNavItem } from "@/lib/backoffice-navigation";

type BackofficeSidebarProps = {
  items: BackofficeNavItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  filter: string;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

function itemMatches(item: BackofficeNavItem, filter: string) {
  const query = filter.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return `${item.label} ${item.description ?? ""}`.toLowerCase().includes(query);
}

export default function BackofficeSidebar({
  items,
  collapsed,
  mobileOpen,
  filter,
  onCloseMobile,
  onToggleCollapsed,
}: BackofficeSidebarProps) {
  const activeSegment = useSelectedLayoutSegment();
  const visibleItems = items.filter((item) => itemMatches(item, filter));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-[var(--backoffice-border)] bg-white transition-[width,transform] duration-200 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        aria-label="Navegación de backoffice"
      >
        <div className="flex h-16 items-center border-b border-[var(--backoffice-border)] px-3">
          <Link
            href="/backoffice/submissions"
            className={`flex min-w-0 items-center gap-3 transition hover:opacity-90 ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={onCloseMobile}
            aria-label="Ir al inicio del backoffice"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
              <Image src="/logo.png" alt="Terencio" width={36} height={36} className="h-8 w-8 object-contain" priority />
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-950">
                  Terencio Cash Market
                </span>
                <span className="block truncate text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--backoffice-muted)]">
                  Backoffice
                </span>
              </span>
            ) : null}
          </Link>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--backoffice-border)] px-3 py-2.5">
          {!collapsed ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--backoffice-muted)]">
                Navegación
              </p>
              <p className="mt-1 text-xs text-slate-500">Módulos disponibles</p>
            </div>
          ) : (
            <span className="sr-only">Alternar barra lateral</span>
          )}

          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--backoffice-border)] bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            aria-pressed={collapsed}
          >
            <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const isActive = item.segment === activeSegment;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 overflow-visible rounded-lg border px-3 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "border-green-200 bg-green-50 text-green-900"
                        : "border-transparent text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition ${
                        isActive
                          ? "bg-green-700 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>

                    {!collapsed ? (
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{item.label}</span>
                        {item.description ? (
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="pointer-events-none absolute top-1/2 left-[calc(100%+0.75rem)] z-10 hidden -translate-y-1/2 rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg group-hover:block group-focus-visible:block">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {visibleItems.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-[var(--backoffice-border)] bg-white px-4 py-4 text-sm text-slate-500">
              {!collapsed ? "No hay módulos que coincidan con la búsqueda." : "Sin resultados"}
            </div>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
