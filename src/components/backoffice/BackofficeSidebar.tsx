"use client";

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
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col border-r border-[var(--backoffice-border)] bg-[rgba(255,255,255,0.92)] shadow-[0_24px_60px_-34px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-[width,transform] duration-300 ${
          collapsed ? "lg:w-24" : "lg:w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        aria-label="Navegación de backoffice"
      >
        <div className="flex h-20 items-center border-b border-[var(--backoffice-border)] px-4">
          <Link
            href="/backoffice/submissions"
            className={`flex min-w-0 items-center gap-3 rounded-2xl transition hover:opacity-90 ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={onCloseMobile}
            aria-label="Ir al inicio del backoffice"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-green),#0f172a)] text-lg font-black text-white shadow-[0_18px_36px_-22px_rgba(22,101,52,0.85)]">
              T
            </span>
            {!collapsed ? (
              <span className="min-w-0">
                <span className="block truncate text-lg font-black tracking-tight text-slate-950">
                  Terencio
                </span>
                <span className="block truncate text-xs font-bold uppercase tracking-[0.24em] text-[var(--backoffice-muted)]">
                  Control Center
                </span>
              </span>
            ) : null}
          </Link>
        </div>

        <div className="flex items-center justify-between border-b border-[var(--backoffice-border)] px-4 py-4">
          {!collapsed ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--backoffice-muted)]">
                Navegación
              </p>
              <p className="mt-1 text-sm text-slate-500">Módulos disponibles</p>
            </div>
          ) : (
            <span className="sr-only">Alternar barra lateral</span>
          )}

          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--backoffice-border)] bg-white text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            aria-pressed={collapsed}
          >
            <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2">
            {visibleItems.map((item) => {
              const isActive = item.segment === activeSegment;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center gap-3 overflow-visible rounded-2xl border px-3 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
                      collapsed ? "justify-center" : ""
                    } ${
                      isActive
                        ? "border-green-200 bg-green-50 text-green-900 shadow-[0_16px_32px_-28px_rgba(22,101,52,0.45)]"
                        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                        isActive
                          ? "bg-green-700 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>

                    {!collapsed ? (
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{item.label}</span>
                        {item.description ? (
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {item.description}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="pointer-events-none absolute top-1/2 left-[calc(100%+0.75rem)] z-10 hidden -translate-y-1/2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold whitespace-nowrap text-white shadow-lg group-hover:block group-focus-visible:block">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {visibleItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--backoffice-border)] bg-white/70 px-4 py-5 text-sm text-slate-500">
              {!collapsed ? "No hay módulos que coincidan con la búsqueda." : "Sin resultados"}
            </div>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
