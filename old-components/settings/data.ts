import type {
  NotificationPreference,
  PasswordFormValues,
  ProfileFormValues,
  SettingsTab,
  SettingsTabId,
} from "@/components/settings/types"

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile" },
  { id: "password", label: "Password" },
  { id: "notifications", label: "Notifications" },
]

export const DEFAULT_PROFILE_FORM_VALUES: ProfileFormValues = {
  firstName: "John",
  lastName: "Smith",
  email: "jsmith.john@gmail.com",
}

export const DEFAULT_PROFILE_IMAGE_SRC = "/assets/temp-gym-profile-image.png"

export const DEFAULT_PASSWORD_FORM_VALUES: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
}

export const NOTIFICATION_PREFERENCES_TITLE = "Notification Preferences"
export const NOTIFICATION_PREFERENCES_DESCRIPTION =
  "Control which notifications you receive and how you receive them"
export const NOTIFICATION_PREFERENCES_GROUP_TITLE = "Email Notifications"

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  {
    id: "system-updates",
    title: "System Updates",
    description:
      "Get notified about new features, system maintenance, and other platform updates",
    inApp: true,
    email: true,
  },
  {
    id: "billing-alerts",
    title: "Billing Alerts",
    description:
      "Receive notifications about subscription changes, payment issues, or subscriptions approaching limits",
    inApp: true,
    email: true,
  },
]

export const SETTINGS_PLACEHOLDER_COPY: Record<
  Exclude<SettingsTabId, "profile">,
  { title: string; description: string }
> = {
  password: {
    title: "Password settings",
    description:
      "This tab is scaffolded and ready for the matching Figma state when that design is provided.",
  },
  notifications: {
    title: "Notification settings",
    description:
      "This tab is scaffolded and ready for the matching Figma state when that design is provided.",
  },
}
