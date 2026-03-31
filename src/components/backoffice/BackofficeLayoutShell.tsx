"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import BackofficeHeader from "@/components/backoffice/BackofficeHeader";
import BackofficeSidebar from "@/components/backoffice/BackofficeSidebar";
import type { BackofficeNavItem } from "@/lib/backoffice-navigation";

type BackofficeLayoutShellProps = {
  children: React.ReactNode;
  navItems: BackofficeNavItem[];
  sessionEmail: string;
};

const SIDEBAR_EXPANDED_WIDTH = 288;
const SIDEBAR_COLLAPSED_WIDTH = 96;
const COLLAPSE_STORAGE_KEY = "terencio-backoffice-sidebar-collapsed";

export default function BackofficeLayoutShell({
  children,
  navItems,
  sessionEmail,
}: BackofficeLayoutShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const storedValue = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);

    if (storedValue) {
      setCollapsed(storedValue === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    function handleChange(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches) {
        setMobileOpen(false);
      }
    }

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const sidebarOffset = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div className="backoffice-shell h-dvh overflow-hidden text-[var(--backoffice-text)]">
      <BackofficeSidebar
        items={navItems}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        filter={searchValue}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />

      <div
        className="flex h-dvh min-w-0 flex-1 flex-col lg:ml-[var(--sidebar-offset)] lg:transition-[margin-left] lg:duration-300"
        style={{ "--sidebar-offset": `${sidebarOffset}px` } as CSSProperties}
      >
        <BackofficeHeader
          collapsed={collapsed}
          isMobileNavOpen={mobileOpen}
          searchValue={searchValue}
          sessionEmail={sessionEmail}
          onSearchChange={setSearchValue}
          onToggleMobileNav={() => setMobileOpen((value) => !value)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="min-h-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
