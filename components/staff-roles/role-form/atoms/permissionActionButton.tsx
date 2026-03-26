import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const permissionActionButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-full border border-border-soft bg-bg-control px-4 text-[13px] font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";

type PermissionActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PermissionActionButton({
  children,
  className,
  type = "button",
  ...props
}: PermissionActionButtonProps) {
  return (
    <button
      type={type}
      className={clsx(permissionActionButtonClassName, className)}
      {...props}
    >
      {children}
    </button>
  );
}
