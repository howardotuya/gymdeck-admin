import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type GalleryActionButtonProps = {
  icon: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function GalleryActionButton({
  children,
  className,
  icon,
  type = "button",
  ...props
}: GalleryActionButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center gap-2 text-[14px] leading-[1.4] text-text-secondary transition-colors hover:text-text-primary",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
