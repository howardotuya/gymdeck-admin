import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type TablePaginationButtonProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function TablePaginationButton({
  children,
  active = false,
  className,
  type = "button",
  ...props
}: TablePaginationButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-[13px] font-medium transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30 disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-transparent bg-brand-primary text-text-inverse"
          : "border-border-soft bg-bg-surface text-text-support hover:border-border-strong hover:bg-bg-muted hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
