"use client";

import { useEffect, useRef, useState } from "react";

import LogoutButton from "@/components/backoffice/LogoutButton";
import Icon from "@/components/ui/Icon";
import { roleLabels, type AdminRole } from "@/lib/admin-users";

type BackofficeHeaderProps = {
  collapsed: boolean;
  isMobileNavOpen: boolean;
  sessionEmail: string;
  sessionRole: AdminRole;
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
  sessionEmail,
  sessionRole,
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
    <header className="sticky top-0 z-30 border-b border-[var(--backoffice-border)] bg-white/95">
      <div className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--backoffice-border)] bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 lg:hidden"
          aria-label={isMobileNavOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={isMobileNavOpen}
        >
          <Icon name={isMobileNavOpen ? "X" : "Menu"} className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="hidden h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700 lg:flex">
              <Icon name={collapsed ? "PanelLeft" : "LayoutDashboard"} className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold text-slate-950 sm:text-base">
                Panel de administración
              </h1>
              <p className="text-xs text-[var(--backoffice-muted)]">
                {roleLabels[sessionRole]}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-3 rounded-md border border-[var(--backoffice-border)] bg-white px-3 py-2 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              aria-expanded={menuOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--brand-green)] text-xs font-bold text-white">
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
                className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-72 rounded-lg border border-[var(--backoffice-border)] bg-white p-3 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.28)]"
              >
                <div className="rounded-md bg-slate-50 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Sesión activa
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950">{userName}</p>
                  <p className="mt-1 text-sm text-slate-500">{sessionEmail}</p>
                  <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
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
