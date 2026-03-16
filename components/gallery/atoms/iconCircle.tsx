import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type IconCircleProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

export function IconCircle({ children, className, ...props }: IconCircleProps) {
  return (
    <span
      className={clsx(
        "inline-flex size-9 items-center justify-center rounded-full bg-bg-action-soft text-text-support",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
