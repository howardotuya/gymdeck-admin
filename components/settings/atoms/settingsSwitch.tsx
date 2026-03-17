import clsx from "clsx"

type SettingsSwitchProps = {
  checked: boolean
  label: string
  onCheckedChange: () => void
}

export function SettingsSwitch({
  checked,
  label,
  onCheckedChange,
}: SettingsSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onCheckedChange}
      className={clsx(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-[12px] p-[2px] transition-[background-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/40 focus-visible:ring-offset-2 motion-reduce:transition-none",
        checked ? "bg-text-brand" : "bg-border-divider",
      )}
    >
      <span
        className="pointer-events-none block size-4 rounded-full bg-bg-surface shadow-[var(--shadow-control)] transition-[translate] duration-200 ease-out motion-reduce:transition-none"
        style={{ translate: checked ? "16px" : "0" }}
      />
    </button>
  )
}
