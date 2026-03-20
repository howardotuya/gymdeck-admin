export type SettingsTabId = "profile" | "password" | "notifications"

export type SettingsTab = {
  id: SettingsTabId
  label: string
}

export type ProfileFormValues = {
  firstName: string
  lastName: string
  email: string
}

export type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type NotificationChannel = "inApp" | "email"

export type NotificationPreference = {
  description: string
  email: boolean
  id: string
  inApp: boolean
  title: string
}
