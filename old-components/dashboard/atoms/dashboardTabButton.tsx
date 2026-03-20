import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type DashboardTabButtonProps = {
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function DashboardTabButton({
  active = false,
  className,
  ...props
}: DashboardTabButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "border-b-2 px-1 pb-[17px] pt-px text-[14px] leading-5 whitespace-nowrap transition-colors md:text-[16px]",
        active
          ? "border-text-brand font-medium text-text-brand"
          : "border-transparent text-text-secondary hover:text-text-primary",
        className,
      )}
      {...props}
    />
  );
}
