import clsx from "clsx";
import { Map2LineIcon } from "@/components/icons";

type DirectionsButtonProps = {
  className?: string;
  compact?: boolean;
};

export function DirectionsButton({ className, compact = false }: DirectionsButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        compact
          ? "inline-flex items-center justify-center gap-[6px] rounded-full px-3 py-[6px] text-[14px] font-semibold leading-[1.4] text-text-support transition-colors"
          : "inline-flex h-[51px] items-center justify-center gap-2 rounded-full bg-bg-muted px-[10px] text-[14px] font-medium leading-[1.4] text-text-support transition-colors hover:bg-bg-subtle",
        className
      )}
    >
      <Map2LineIcon className="size-5 text-text-support" />
      Get Directions
    </button>
  );
}
