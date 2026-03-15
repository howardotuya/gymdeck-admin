import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ChipButtonProps = {
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ChipButton({ active = false, className, ...props }: ChipButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-[13px] leading-[1.3] transition-colors",
        active
          ? "bg-text-brand text-text-inverse"
          : "bg-bg-muted text-text-support hover:text-text-primary",
        className
      )}
      {...props}
    />
  );
}
