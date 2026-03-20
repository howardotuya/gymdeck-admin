import clsx from "clsx";
import type { ReactNode } from "react";

type TagPillProps = {
  children: ReactNode;
  variant?: "surface" | "purple";
  className?: string;
};

export function TagPill({ children, className, variant = "surface" }: TagPillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-[12px] leading-none font-medium",
        variant === "surface"
          ? "bg-bg-surface text-text-emphasis"
          : "bg-bg-tag-purple text-text-tag-purple",
        className,
      )}
    >
      {children}
    </span>
  );
}
