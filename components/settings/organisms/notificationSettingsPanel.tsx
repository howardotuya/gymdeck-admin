import {
  NOTIFICATION_PREFERENCES_DESCRIPTION,
  NOTIFICATION_PREFERENCES_GROUP_TITLE,
  NOTIFICATION_PREFERENCES_TITLE,
} from "@/components/settings/data"
import { NotificationPreferenceRow } from "@/components/settings/molecules"
import type {
  NotificationChannel,
  NotificationPreference,
} from "@/components/settings/types"

type NotificationSettingsPanelProps = {
  onToggle: (preferenceId: string, channel: NotificationChannel) => void
  preferences: NotificationPreference[]
}

export function NotificationSettingsPanel({
  onToggle,
  preferences,
}: NotificationSettingsPanelProps) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-[16px] leading-[1.5] font-medium text-text-emphasis">
          {NOTIFICATION_PREFERENCES_TITLE}
        </h2>
        <p className="text-[13px] leading-[1.5] text-text-secondary">
          {NOTIFICATION_PREFERENCES_DESCRIPTION}
        </p>
      </header>

      <div className="space-y-[10px] md:rounded-[8px] md:border md:border-[#EAEFF2] md:bg-bg-surface md:p-[15px] md:shadow-[0_1px_2px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.10)]">
        <div className="space-y-[10px] md:flex md:items-center md:justify-between md:gap-6 md:space-y-0 md:pb-4">
          <h3 className="text-[14px] leading-[1.5] font-medium text-text-emphasis md:shrink-0">
            {NOTIFICATION_PREFERENCES_GROUP_TITLE}
          </h3>

          <div className="ml-auto flex items-center gap-5 md:gap-10">
            <span className="w-14 text-center text-[13px] leading-[1.5] font-medium text-text-emphasis">
              In-App
            </span>
            <span className="w-14 text-center text-[13px] leading-[1.5] font-medium text-text-emphasis">
              Email
            </span>
          </div>
        </div>

        <div className="border-t border-[#EAEFF2] pt-5 md:pt-5">
          <div className="space-y-5">
            {preferences.map((preference) => (
              <NotificationPreferenceRow
                key={preference.id}
                preference={preference}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
