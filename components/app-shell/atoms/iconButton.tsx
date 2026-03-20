import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ className, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={clsx(
        "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border-soft bg-bg-surface text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
