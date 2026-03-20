import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type TabButtonProps = {
  active?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function TabButton({ active = false, className, ...props }: TabButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "border-b-2 px-[4px] pb-[17px] pt-px text-[14px] leading-[20px] whitespace-nowrap transition-colors md:text-[16px]",
        active
          ? "border-text-brand font-medium text-text-brand"
          : "border-transparent text-text-support hover:text-text-primary",
        className
      )}
      {...props}
    />
  );
}
