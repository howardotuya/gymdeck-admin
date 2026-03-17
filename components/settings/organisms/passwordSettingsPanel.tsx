import type { ChangeEventHandler, FormEventHandler } from "react"
import { SettingsField } from "@/components/settings/atoms"
import type { PasswordFormValues } from "@/components/settings/types"

type PasswordSettingsPanelProps = {
  onInputChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  values: PasswordFormValues
}

export function PasswordSettingsPanel({
  onInputChange,
  onSubmit,
  values,
}: PasswordSettingsPanelProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <header>
        <h2 className="text-[16px] leading-[1.5] font-medium text-text-primary">
          Set a new password
        </h2>
      </header>

      <div className="space-y-6">
        <div className="space-y-6">
          <SettingsField
            id="settings-current-password"
            name="currentPassword"
            type="password"
            label="Current Password"
            value={values.currentPassword}
            autoComplete="current-password"
            onChange={onInputChange}
          />

          <SettingsField
            id="settings-new-password"
            name="newPassword"
            type="password"
            label="New Password"
            value={values.newPassword}
            autoComplete="new-password"
            onChange={onInputChange}
          />

          <SettingsField
            id="settings-confirm-new-password"
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
            value={values.confirmNewPassword}
            autoComplete="new-password"
            onChange={onInputChange}
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-[49px] items-center justify-center rounded-full bg-brand-primary px-6 text-[14px] font-medium leading-normal text-text-inverse transition-colors hover:bg-brand-primary-hover"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}
