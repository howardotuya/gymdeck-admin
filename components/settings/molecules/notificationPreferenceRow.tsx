import { SettingsSwitch } from "@/components/settings/atoms"
import type {
  NotificationChannel,
  NotificationPreference,
} from "@/components/settings/types"

type NotificationPreferenceRowProps = {
  onToggle: (preferenceId: string, channel: NotificationChannel) => void
  preference: NotificationPreference
}

export function NotificationPreferenceRow({
  onToggle,
  preference,
}: NotificationPreferenceRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_56px] items-start gap-x-5 md:gap-x-10">
      <div className="min-w-0 space-y-1">
        <h3 className="text-[13px] leading-[1.5] font-medium text-text-emphasis">
          {preference.title}
        </h3>
        <p className="text-[13px] leading-[1.5] text-text-secondary">
          {preference.description}
        </p>
      </div>

      <div className="justify-self-end pt-0.5">
        <SettingsSwitch
          checked={preference.inApp}
          label={`Toggle in-app notifications for ${preference.title}`}
          onCheckedChange={() => onToggle(preference.id, "inApp")}
        />
      </div>

      <div className="justify-self-end pt-0.5">
        <SettingsSwitch
          checked={preference.email}
          label={`Toggle email notifications for ${preference.title}`}
          onCheckedChange={() => onToggle(preference.id, "email")}
        />
      </div>
    </div>
  )
}
