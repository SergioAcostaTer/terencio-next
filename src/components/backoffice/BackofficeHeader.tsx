"use client";

import { useEffect, useRef, useState } from "react";

import LogoutButton from "@/components/backoffice/LogoutButton";
import Icon from "@/components/ui/Icon";
import { roleLabels, type AdminRole } from "@/lib/admin-users";

type BackofficeHeaderProps = {
  collapsed: boolean;
  isMobileNavOpen: boolean;
  searchValue: string;
  sessionEmail: string;
  sessionRole: AdminRole;
  onSearchChange: (value: string) => void;
  onToggleMobileNav: () => void;
};

function formatUserName(email: string) {
  const base = email.split("@")[0] ?? email;

  return base
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean).slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "A";
}

export default function BackofficeHeader({
  collapsed,
  isMobileNavOpen,
  searchValue,
  sessionEmail,
  sessionRole,
  onSearchChange,
  onToggleMobileNav,
}: BackofficeHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userName = formatUserName(sessionEmail);
  const initials = getInitials(userName);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--backoffice-border)] bg-[rgba(248,250,252,0.88)] backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--backoffice-border)] bg-white text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 lg:hidden"
          aria-label={isMobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={isMobileNavOpen}
        >
          <Icon name={isMobileNavOpen ? "X" : "Menu"} className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-800 lg:flex">
              <Icon name={collapsed ? "PanelLeft" : "LayoutDashboard"} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--backoffice-muted)]">
                Backoffice
              </p>
              <h1 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                Panel de administración
              </h1>
            </div>
          </div>
        </div>

        <form
          role="search"
          className="hidden min-w-0 flex-1 justify-center lg:flex"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="relative w-full max-w-md">
            <span className="sr-only">Buscar módulos del backoffice</span>
            <Icon
              name="Search"
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar módulo"
              className="h-12 w-full rounded-2xl border border-[var(--backoffice-border)] bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-300 focus:ring-2 focus:ring-green-600/20"
            />
          </label>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--backoffice-border)] bg-white text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            aria-label="Notificaciones"
          >
            <span className="relative flex items-center justify-center">
              <Icon name="Bell" className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-3 rounded-2xl border border-[var(--backoffice-border)] bg-white px-3 py-2.5 text-left transition hover:border-green-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              aria-expanded={menuOpen}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-green),var(--brand-green-mid))] text-sm font-black text-white shadow-[0_16px_28px_-18px_rgba(22,101,52,0.7)]">
                {initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-bold text-slate-950">{userName}</span>
                <span className="block truncate text-xs text-slate-500">
                  {roleLabels[sessionRole]} · {sessionEmail}
                </span>
              </span>
              <Icon name="ChevronDown" className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            {menuOpen ? (
              <div
                className="absolute top-[calc(100%+0.75rem)] right-0 z-20 w-72 rounded-[24px] border border-[var(--backoffice-border)] bg-white p-3 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)]"
              >
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Sesión activa
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950">{userName}</p>
                  <p className="mt-1 text-sm text-slate-500">{sessionEmail}</p>
                  <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-700">
                    {roleLabels[sessionRole]}
                  </p>
                </div>
                <div className="mt-3">
                  <LogoutButton className="w-full justify-center" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
