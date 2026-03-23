import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type TableControlButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function TableControlButton({
  children,
  variant = "secondary",
  className,
  type = "button",
  ...props
}: TableControlButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex h-[49px] items-center justify-center gap-2 rounded-full border px-5 text-[14px] font-medium transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "border-transparent bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
          : "border-border-soft bg-bg-surface text-text-support hover:border-border-strong hover:bg-bg-muted hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
