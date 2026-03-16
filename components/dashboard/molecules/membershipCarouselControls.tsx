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
            ? "bg-[#6475E9] text-text-inverse hover:opacity-90"
            : "bg-bg-icon-soft text-[#6475E9] hover:bg-bg-subtle",
        ].join(" ")}
      >
        <ArrowRightSLineIcon
          className={[
            "size-5 rotate-180",
            canGoPrevious ? "text-text-inverse" : "text-[#6475E9]",
          ].join(" ")}
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
            ? "bg-[#6475E9] text-text-inverse hover:opacity-90"
            : "bg-bg-icon-soft text-[#6475E9] hover:bg-bg-subtle",
        ].join(" ")}
      >
        <ArrowRightSLineIcon
          className={["size-5", canGoNext ? "text-text-inverse" : "text-[#6475E9]"].join(" ")}
        />
      </button>
    </div>
  );
}
