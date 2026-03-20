import clsx from "clsx";
import { StarFillIcon } from "@/components/icons";

type RatingStarsProps = {
  value?: number;
  max?: number;
  className?: string;
  iconClassName?: string;
};

export function RatingStars({
  className,
  iconClassName,
  max = 5,
  value = 5,
}: RatingStarsProps) {
  return (
    <div className={clsx("inline-flex items-center gap-1", className)} aria-hidden="true">
      {Array.from({ length: max }, (_, index) => {
        const active = index < value;
        return (
          <StarFillIcon
            key={index}
            className={clsx(
              "size-4",
              active ? "text-text-brand" : "text-border-divider",
              iconClassName
            )}
          />
        );
      })}
    </div>
  );
}
