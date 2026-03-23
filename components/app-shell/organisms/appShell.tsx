"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { AdminSidebar } from "./adminSidebar";
import { AdminTopbar } from "./adminTopbar";
import { getPageMeta } from "../data";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpenForPath, setSidebarOpenForPath] = useState<string | null>(
    null,
  );
  const pageMeta = getPageMeta(pathname);
  const isSidebarOpen = sidebarOpenForPath === pathname;
  const usesSetupTopbar =
    pathname === "/classes/new" || pathname.startsWith("/classes/new/");

  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg-overlay"
            aria-label="Close navigation"
            onClick={() => setSidebarOpenForPath(null)}
          />
          <div className="relative h-full w-[280px] max-w-[86vw] border-r border-border-soft bg-bg-page shadow-[var(--shadow-panel)]">
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft bg-bg-surface text-text-secondary"
              aria-label="Close navigation"
              onClick={() => setSidebarOpenForPath(null)}
            >
              <CloseIcon size={18} />
            </button>
            <AdminSidebar
              pathname={pathname}
              onNavigate={() => setSidebarOpenForPath(null)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen">
        <div className="hidden w-[280px] shrink-0 lg:block">
          <div className="fixed inset-y-0 w-[280px] border-r border-border-soft">
            <AdminSidebar pathname={pathname} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {usesSetupTopbar ? null : (
            <AdminTopbar
              pageMeta={pageMeta}
              onOpenSidebar={() => setSidebarOpenForPath(pathname)}
            />
          )}
          <main
            className={
              usesSetupTopbar
                ? "px-4 pb-4 sm:px-6 sm:pb-6 lg:px-5 lg:pb-8"
                : "px-4 py-4 sm:px-6 sm:py-6 lg:px-5 lg:py-8"
            }
          >
            <div className="mx-auto max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
