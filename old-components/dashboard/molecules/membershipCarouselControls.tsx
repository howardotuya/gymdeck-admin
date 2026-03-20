import { ArrowRightSLineIcon } from "@/components/icons";

type MembershipCarouselControlsProps = {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

export function MembershipCarouselControls({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
}: MembershipCarouselControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous membership"
        className={[
          "inline-flex size-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed",
          canGoPrevious
            ? "bg-bg-membership-nav-next text-text-membership-nav-next hover:opacity-90"
            : "bg-bg-icon-soft text-text-brand hover:bg-bg-subtle",
        ].join(" ")}
      >
        <ArrowRightSLineIcon
          className="size-5 rotate-180"
          color="currentColor"
        />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next membership"
        className={[
          "inline-flex size-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed",
          canGoNext
            ? "bg-bg-membership-nav-next text-text-membership-nav-next hover:opacity-90"
            : "bg-bg-icon-soft text-text-brand hover:bg-bg-subtle",
        ].join(" ")}
      >
        <ArrowRightSLineIcon className="size-5" color="currentColor" />
      </button>
    </div>
  );
}
