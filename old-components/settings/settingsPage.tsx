"use client"

import type { ChangeEvent, KeyboardEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardTopNavigation } from "@/components/dashboard/organisms"
import { SettingsTabButton } from "@/components/settings/atoms"
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  DEFAULT_PASSWORD_FORM_VALUES,
  DEFAULT_PROFILE_FORM_VALUES,
  DEFAULT_PROFILE_IMAGE_SRC,
  SETTINGS_TABS,
} from "@/components/settings/data"
import {
  NotificationSettingsPanel,
  PasswordSettingsPanel,
  ProfileSettingsPanel,
} from "@/components/settings/organisms"
import type {
  NotificationChannel,
  NotificationPreference,
  PasswordFormValues,
  ProfileFormValues,
  SettingsTabId,
} from "@/components/settings/types"

const DEFAULT_TAB: SettingsTabId = "profile"
const SETTINGS_TAB_QUERY_KEY = "tab"
const SETTINGS_TAB_IDS = new Set<SettingsTabId>(SETTINGS_TABS.map((tab) => tab.id))

function getSettingsTabFromUrl(tabParam: string | null): SettingsTabId {
  if (!tabParam || !SETTINGS_TAB_IDS.has(tabParam as SettingsTabId)) {
    return DEFAULT_TAB
  }

  return tabParam as SettingsTabId
}

type SettingsPageProps = {
  activeTabParam?: string | null
}

export function SettingsPage({ activeTabParam }: SettingsPageProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [profileImageSrc, setProfileImageSrc] = useState(DEFAULT_PROFILE_IMAGE_SRC)
  const [values, setValues] = useState<ProfileFormValues>(DEFAULT_PROFILE_FORM_VALUES)
  const [passwordValues, setPasswordValues] =
    useState<PasswordFormValues>(DEFAULT_PASSWORD_FORM_VALUES)
  const [notificationPreferences, setNotificationPreferences] = useState<
    NotificationPreference[]
  >(DEFAULT_NOTIFICATION_PREFERENCES)
  const objectUrlRef = useRef<string | null>(null)
  const tabRefs = useRef<Record<SettingsTabId, HTMLButtonElement | null>>({
    profile: null,
    password: null,
    notifications: null,
  })
  const activeTab = getSettingsTabFromUrl(activeTabParam ?? null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleProfileImageUpload = (file: File | null) => {
    if (!file) {
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const nextObjectUrl = URL.createObjectURL(file)
    objectUrlRef.current = nextObjectUrl
    setProfileImageSrc(nextObjectUrl)
  }

  const handleProfileImageRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    setProfileImageSrc(DEFAULT_PROFILE_IMAGE_SRC)
  }

  const handlePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setPasswordValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleNotificationToggle = (
    preferenceId: string,
    channel: NotificationChannel,
  ) => {
    setNotificationPreferences((currentPreferences) =>
      currentPreferences.map((preference) =>
        preference.id === preferenceId
          ? { ...preference, [channel]: !preference[channel] }
          : preference,
      ),
    )
  }

  const handleTabChange = (tab: SettingsTabId) => {
    if (tab === activeTab) {
      return
    }

    const nextUrl = tab === DEFAULT_TAB ? pathname : `${pathname}?${SETTINGS_TAB_QUERY_KEY}=${tab}`
    router.replace(nextUrl, { scroll: false })
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTabId: SettingsTabId) => {
    const currentIndex = SETTINGS_TABS.findIndex((tab) => tab.id === currentTabId)

    if (currentIndex === -1) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % SETTINGS_TABS.length
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + SETTINGS_TABS.length) % SETTINGS_TABS.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = SETTINGS_TABS.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextTab = SETTINGS_TABS[nextIndex]
    tabRefs.current[nextTab.id]?.focus()
    handleTabChange(nextTab.id)
  }

  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <DashboardTopNavigation activeNavId="discover" />

      <main className="w-full overflow-hidden bg-bg-surface px-4 py-5 md:rounded-[24px] md:px-16 md:py-6 lg:px-24 xl:px-[278px]">
        <section className="max-w-[884px] space-y-8">
          <header>
            <h1 className="text-[24px] leading-[1.4] font-semibold text-text-primary">Account</h1>
          </header>

          <div className="border-b border-border-input">
            <nav
              className="-mb-px flex items-center gap-5 overflow-x-auto"
              aria-label="Account sections"
              role="tablist"
            >
              {SETTINGS_TABS.map((tab) => (
                <SettingsTabButton
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[tab.id] = node
                  }}
                  id={`${tab.id}-tab`}
                  label={tab.label}
                  isActive={tab.id === activeTab}
                  role="tab"
                  aria-selected={tab.id === activeTab}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={tab.id === activeTab ? 0 : -1}
                  onClick={() => handleTabChange(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                />
              ))}
            </nav>
          </div>

          <div
            id={`${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${activeTab}-tab`}
          >
            {activeTab === "profile" ? (
              <ProfileSettingsPanel
                imageSrc={profileImageSrc}
                values={values}
                onInputChange={handleInputChange}
                onImageUpload={handleProfileImageUpload}
                onImageRemove={handleProfileImageRemove}
                onSubmit={(event) => event.preventDefault()}
              />
            ) : activeTab === "password" ? (
              <PasswordSettingsPanel
                values={passwordValues}
                onInputChange={handlePasswordInputChange}
                onSubmit={(event) => event.preventDefault()}
              />
            ) : (
              <NotificationSettingsPanel
                preferences={notificationPreferences}
                onToggle={handleNotificationToggle}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
