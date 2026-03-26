"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
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
}: SetupTopbarProps) {
  const router = useRouter();

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

  return (
    <div className="-mx-4 sticky top-0 z-20 border-b border-border-soft bg-bg-surface/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-5 lg:-mx-5 lg:px-5">
      <div className="mx-auto flex min-h-[72px] flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
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
  );
}
