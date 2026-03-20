import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react"

type SettingsFieldProps = {
  autoComplete?: string
  id: string
  label: string
  name: string
  onChange: ChangeEventHandler<HTMLInputElement>
  type?: HTMLInputTypeAttribute
  value: string
}

export function SettingsField({
  autoComplete,
  id,
  label,
  name,
  onChange,
  type = "text",
  value,
}: SettingsFieldProps) {
  return (
    <label htmlFor={id} className="flex w-full flex-col gap-2">
      <span className="text-[12px] font-medium leading-normal text-text-secondary">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        className="h-11 w-full rounded-full bg-bg-muted px-4 text-[14px] leading-[1.4] text-text-support placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text-brand/30"
      />
    </label>
  )
}
