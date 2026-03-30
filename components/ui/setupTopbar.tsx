"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CloseIcon, MoreVerticalIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme";

type SetupTopbarProps = {
  backHref?: string;
  cancelHref?: string;
  backLabel?: string;
  cancelLabel?: string;
  proceedLabel?: string;
  onBack?: () => void;
  onProceed?: () => void;
  proceedDisabled?: boolean;
  showCancel?: boolean;
  showProceed?: boolean;
  mobileTitle?: string;
  mobileMeta?: string;
  mobileProgressCurrent?: number;
  mobileProgressTotal?: number;
};

const secondaryButtonClassName =
  "inline-flex h-[49px] items-center justify-center rounded-full border border-border-soft bg-bg-surface px-5 text-[14px] font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-bg-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";
const primaryButtonClassName =
  "inline-flex h-[49px] items-center justify-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20 disabled:cursor-not-allowed disabled:opacity-60";

export function SetupTopbar({
  backHref,
  cancelHref,
  backLabel = "Back",
  cancelLabel = "Cancel",
  proceedLabel = "Proceed",
  onBack,
  onProceed,
  proceedDisabled = false,
  showCancel = true,
  showProceed = true,
  mobileTitle,
  mobileMeta,
  mobileProgressCurrent,
  mobileProgressTotal,
}: SetupTopbarProps) {
  const router = useRouter();
  const panelId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hasMobileProgress =
    typeof mobileProgressCurrent === "number" &&
    typeof mobileProgressTotal === "number" &&
    mobileProgressTotal > 0;
  const mobileProgressWidth = hasMobileProgress
    ? `${Math.min(Math.max((mobileProgressCurrent / mobileProgressTotal) * 100, 0), 100)}%`
    : "0%";

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (backHref) {
      router.push(backHref);
      return;
    }

    router.back();
  };

  const mobileHeading = mobileTitle ?? backLabel;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <div className="-mx-4 sticky top-0 z-20 border-b border-border-soft bg-bg-surface/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-5 lg:-mx-5 lg:px-5">
        <div className="mx-auto py-3 sm:flex sm:min-h-[72px] sm:items-center sm:justify-between sm:py-0">
          <div className="sm:hidden">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                aria-label={backLabel}
                className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-brand bg-bg-brand-soft text-text-brand transition-colors hover:bg-bg-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20"
              >
                <ArrowLeftIcon size={16} strokeWidth={2.2} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-text-primary">
                  {mobileHeading}
                </p>
              </div>

              {mobileMeta ? (
                <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-bg-control px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                  {mobileMeta}
                </span>
              ) : null}

              <div ref={menuRef} className="relative shrink-0">
                <button
                  type="button"
                  aria-expanded={mobileMenuOpen}
                  aria-controls={panelId}
                  aria-label={mobileMenuOpen ? "Close setup menu" : "Open setup menu"}
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-bg-surface text-text-secondary transition-colors hover:border-border-strong hover:bg-bg-control hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20"
                >
                  {mobileMenuOpen ? <CloseIcon size={17} /> : <MoreVerticalIcon size={17} />}
                </button>

                {mobileMenuOpen ? (
                  <div
                    id={panelId}
                    className="absolute right-0 top-[calc(100%+10px)] z-20 w-[min(18rem,calc(100vw-2rem))] rounded-[24px] border border-border-soft bg-bg-surface p-3 shadow-[var(--shadow-panel)]"
                  >
                    <div className="space-y-2">
                      <ThemeToggle
                        labelMode="always"
                        className="h-11 w-full justify-between rounded-2xl border-transparent bg-bg-control px-3 hover:border-transparent hover:bg-bg-muted"
                      />
                      {showCancel ? (
                        <Link
                          href={cancelHref ?? "/classes"}
                          onClick={closeMobileMenu}
                          className="flex h-11 items-center justify-center rounded-2xl border border-border-soft bg-bg-surface px-4 text-[14px] font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-bg-control"
                        >
                          {cancelLabel}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {hasMobileProgress ? (
              <div className="mt-3">
                <div className="h-1 overflow-hidden rounded-full bg-bg-control">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-[width] duration-300 ease-out"
                    style={{ width: mobileProgressWidth }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="hidden items-center justify-between gap-4 sm:flex sm:w-full">
            <button
              type="button"
              onClick={handleBack}
              className="group inline-flex items-center gap-3 text-left"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-brand bg-bg-brand-soft text-text-brand transition-colors group-hover:bg-bg-control">
                <ArrowLeftIcon size={16} strokeWidth={2.2} />
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.02em] text-text-primary">
                {backLabel}
              </span>
            </button>

            <div className="flex flex-wrap items-center gap-4">
              <ThemeToggle />
              {showCancel ? (
                <Link
                  href={cancelHref ?? "/classes"}
                  className={secondaryButtonClassName}
                >
                  {cancelLabel}
                </Link>
              ) : null}
              {showProceed ? (
                <button
                  type="button"
                  onClick={onProceed}
                  disabled={proceedDisabled}
                  className={primaryButtonClassName}
                >
                  {proceedLabel}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {showProceed ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-soft bg-bg-surface/95 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-sm sm:hidden">
          <button
            type="button"
            onClick={onProceed}
            disabled={proceedDisabled}
            className={`${primaryButtonClassName} h-[52px] w-full`}
          >
            {proceedLabel}
          </button>
        </div>
      ) : null}
    </>
  );
}
