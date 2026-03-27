import clsx from "clsx";
import { NavTabs } from "@/components/ui";
import { styles } from "@/constants";
import {
  createCompanyProfileFormState,
  createPasswordFormState,
  createUserProfileFormState,
  getSettingsTab,
  mockAuditLogEvents,
  settingsTabs,
} from "./data";
import { AuditLogsPanel } from "./auditLogsPanel";
import { CompanyProfilePanel } from "./companyProfilePanel";
import { UserProfilePanel } from "./userProfilePanel";
import type { SettingsTabId } from "./types";

function getTabHref(tabId: SettingsTabId) {
  return tabId === "user-profile" ? "/settings" : `/settings?tab=${tabId}`;
}

export function SettingsPage({
  activeTabParam,
}: {
  activeTabParam?: string | null;
}) {
  const activeTab = getSettingsTab(activeTabParam);
  const tabs = settingsTabs.map((tab) => ({
    href: getTabHref(tab.id),
    label: tab.label,
    active: tab.id === activeTab,
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      <NavTabs
        tabs={tabs}
        ariaLabel="Settings tabs"
        className={clsx(
          styles.APP_XSPACING,
          styles.NEGATIVE_APP_XSPACING,
          styles.NEGATIVE_APP_YTSPACING,
        )}
      />

      {activeTab === "user-profile" ? (
        <UserProfilePanel
          profile={createUserProfileFormState()}
          password={createPasswordFormState()}
        />
      ) : null}

      {activeTab === "company-profile" ? (
        <CompanyProfilePanel companyProfile={createCompanyProfileFormState()} />
      ) : null}

      {activeTab === "audit-logs" ? <AuditLogsPanel events={mockAuditLogEvents} /> : null}
    </div>
  );
}
