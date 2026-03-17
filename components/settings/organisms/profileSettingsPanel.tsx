import type { ChangeEventHandler, FormEventHandler } from "react"
import { SettingsField } from "@/components/settings/atoms"
import { ProfilePhotoControls } from "@/components/settings/molecules"
import type { ProfileFormValues } from "@/components/settings/types"

type ProfileSettingsPanelProps = {
  imageSrc: string
  onImageRemove: () => void
  onImageUpload: (file: File | null) => void
  onInputChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  values: ProfileFormValues
}

export function ProfileSettingsPanel({
  imageSrc,
  onImageRemove,
  onImageUpload,
  onInputChange,
  onSubmit,
  values,
}: ProfileSettingsPanelProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 md:space-y-10">
      <ProfilePhotoControls
        imageSrc={imageSrc}
        onUpload={onImageUpload}
        onRemove={onImageRemove}
      />

      <div className="border-t border-border-input" />

      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsField
            id="settings-first-name"
            name="firstName"
            label="First name"
            value={values.firstName}
            autoComplete="given-name"
            onChange={onInputChange}
          />
          <SettingsField
            id="settings-last-name"
            name="lastName"
            label="Last name"
            value={values.lastName}
            autoComplete="family-name"
            onChange={onInputChange}
          />
        </div>

        <SettingsField
          id="settings-email"
          name="email"
          type="email"
          label="Email"
          value={values.email}
          autoComplete="email"
          onChange={onInputChange}
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-[49px] items-center justify-center rounded-full bg-brand-primary px-6 text-[14px] font-medium leading-normal text-text-inverse transition-colors hover:bg-brand-primary-hover"
      >
        Save Changes
      </button>
    </form>
  )
}
