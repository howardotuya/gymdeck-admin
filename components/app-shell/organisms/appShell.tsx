"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { SetupTopbar } from "@/components/ui";
import { useFakeAuth } from "@/stores/useFakeAuth";
import { AdminSidebar } from "./adminSidebar";
import { AdminTopbar } from "./adminTopbar";
import { getPageMeta } from "../data";

const SETUP_TOPBAR_EXEMPT_PATHS = [
  "/classes/new",
  "/branches/new",
  "/staff-roles/employees/new",
  "/staff-roles/roles/new",
];
const SETUP_TOPBAR_EXEMPT_PATH_PATTERNS = [
  /^\/classes\/[^/]+$/,
  /^\/classes\/[^/]+\/edit$/,
  /^\/branches\/[^/]+\/edit$/,
  /^\/staff-roles\/employees\/[^/]+$/,
  /^\/staff-roles\/employees\/[^/]+\/edit$/,
  /^\/staff-roles\/roles\/[^/]+$/,
  /^\/staff-roles\/roles\/[^/]+\/edit$/,
  /^\/transactions\/[^/]+$/,
];
const BACK_ONLY_TOPBAR_PATH_PATTERNS = [/^\/branches\/[^/]+$/];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useFakeAuth((state) => state.hasHydrated);
  const isSignedIn = useFakeAuth((state) => state.isSignedIn);
  const redirectPath = useFakeAuth((state) => state.redirectPath);
  const onboardingCompleted = useFakeAuth((state) => state.onboardingCompleted);
  const [sidebarOpenForPath, setSidebarOpenForPath] = useState<string | null>(
    null,
  );
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const pageMeta = getPageMeta(pathname);
  const isSidebarOpen = sidebarOpenForPath === pathname;
  const usesSetupTopbar =
    SETUP_TOPBAR_EXEMPT_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ) || SETUP_TOPBAR_EXEMPT_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
  const usesBackOnlyTopbar = BACK_ONLY_TOPBAR_PATH_PATTERNS.some((pattern) =>
    pattern.test(pathname),
  );

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (isAuthRoute) {
      if (isSignedIn) {
        router.replace(onboardingCompleted ? (redirectPath ?? "/") : "/onboarding");
      }
      return;
    }

    if (isOnboardingRoute) {
      if (!isSignedIn) {
        const params = new URLSearchParams({
          next: pathname,
        });
        router.replace(`/auth/login?${params.toString()}`);
        return;
      }

      if (onboardingCompleted) {
        router.replace(redirectPath ?? "/");
      }
      return;
    }

    if (!isSignedIn) {
      const params = new URLSearchParams({
        next: pathname,
      });
      router.replace(`/auth/login?${params.toString()}`);
      return;
    }

    if (!onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [
    hasHydrated,
    isAuthRoute,
    isOnboardingRoute,
    isSignedIn,
    onboardingCompleted,
    pathname,
    redirectPath,
    router,
  ]);

  if (!hasHydrated) {
    return <div className="min-h-screen bg-bg-page" />;
  }

  if (isAuthRoute) {
    if (isSignedIn) {
      return <div className="min-h-screen bg-bg-page" />;
    }

    return <>{children}</>;
  }

  if (isOnboardingRoute) {
    if (!isSignedIn || onboardingCompleted) {
      return <div className="min-h-screen bg-bg-page" />;
    }

    return <>{children}</>;
  }

  if (!isSignedIn) {
    return <div className="min-h-screen bg-bg-page" />;
  }

  if (!onboardingCompleted) {
    return <div className="min-h-screen bg-bg-page" />;
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      {isSidebarOpen ? (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
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
          {usesSetupTopbar ? null : usesBackOnlyTopbar ? (
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-5">
              <SetupTopbar
                backHref="/branches"
                backLabel="Back to branches"
                showCancel={false}
                showProceed={false}
              />
            </div>
          ) : (
            <AdminTopbar
              pageMeta={pageMeta}
              onOpenSidebar={() => setSidebarOpenForPath(pathname)}
            />
          )}
          <main
            className={
              usesSetupTopbar
                ? "px-4 pb-4 sm:px-6 sm:pb-6 lg:px-5 lg:pb-8"
                : usesBackOnlyTopbar
                  ? "px-4 py-4 sm:px-6 sm:py-6 lg:px-5 lg:py-8"
                  : "px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+6.75rem)] sm:px-6 md:py-6 md:pb-6 lg:px-5 lg:py-8"
            }
          >
            <div className={usesSetupTopbar ? "w-full" : "mx-auto max-w-[1600px]"}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
