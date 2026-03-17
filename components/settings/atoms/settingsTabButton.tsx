import clsx from "clsx"
import type { ButtonHTMLAttributes } from "react"
import { forwardRef } from "react"

type SettingsTabButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive: boolean
  label: string
}

export const SettingsTabButton = forwardRef<HTMLButtonElement, SettingsTabButtonProps>(
  ({ className, isActive, label, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "inline-flex h-10 items-center justify-center border-b-2 px-1 pb-[17px] pt-px text-[14px] font-medium leading-5 whitespace-nowrap transition-colors md:text-[16px]",
          isActive
            ? "border-text-brand text-text-brand"
            : "border-transparent text-text-secondary hover:text-text-primary",
          className,
        )}
        {...props}
      >
        {label}
      </button>
    )
  },
)

SettingsTabButton.displayName = "SettingsTabButton"
