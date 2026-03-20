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
        "inline-flex h-[49px] items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
          : "bg-bg-muted text-text-support hover:bg-bg-action-soft hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
