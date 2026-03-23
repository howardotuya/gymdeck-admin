import clsx from "clsx";
import Link from "next/link";
import {
  ActivityIcon,
  AmenitiesIcon,
  BranchesIcon,
  GalleryIcon,
  GymProfileIcon,
  MembersIcon,
  NotificationsIcon,
  ReviewsIcon,
  StaffIcon,
  SupportIcon,
} from "@/components/icons";
import { NavTabs, StatusBadge } from "@/components/ui";
import {
  getSettingsTab,
  settingsCardsByTab,
  settingsTabs,
  type SettingsCard,
  type SettingsCardIcon,
} from "./data";
import { styles } from "@/constants";

const iconMap: Record<
  SettingsCardIcon,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  activity: ActivityIcon,
  amenities: AmenitiesIcon,
  branches: BranchesIcon,
  gallery: GalleryIcon,
  gymProfile: GymProfileIcon,
  members: MembersIcon,
  notifications: NotificationsIcon,
  reviews: ReviewsIcon,
  staff: StaffIcon,
  support: SupportIcon,
};

function getTabHref(tabId: string) {
  return tabId === "main" ? "/settings" : `/settings?tab=${tabId}`;
}

function SettingsCard({ card }: { card: SettingsCard }) {
  const Icon = iconMap[card.icon];
  const action = card.href ? (
    <Link
      href={card.href}
      className="text-[14px] font-semibold text-text-brand"
    >
      {card.ctaLabel}
    </Link>
  ) : (
    <button type="button" className="text-[14px] font-semibold text-text-brand">
      {card.ctaLabel}
    </button>
  );

  return (
    <article className="flex min-h-[232px] flex-col justify-between rounded-[24px] border border-border-soft bg-bg-surface shadow-[var(--shadow-card)]">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-muted text-text-secondary">
            <Icon size={18} />
          </span>
          <StatusBadge label={card.badge} tone={card.tone} />
        </div>

        <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
          {card.title}
        </h3>
        <p className="mt-3 text-[14px] leading-[1.65] text-text-secondary">
          {card.description}
        </p>
      </div>

      <div className="border-t border-border-soft px-6 py-5">{action}</div>
    </article>
  );
}

export function SettingsPage({
  activeTabParam,
}: {
  activeTabParam?: string | null;
}) {
  const activeTab = getSettingsTab(activeTabParam);
  const activeCards = settingsCardsByTab[activeTab];
  const tabs = settingsTabs.map((tab) => ({
    href: getTabHref(tab.id),
    label: tab.label,
    active: tab.id === activeTab,
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-4">
        <NavTabs
          tabs={tabs}
          ariaLabel="Settings tabs"
          className={clsx(
            styles.APP_XSPACING,
            styles.NEGATIVE_APP_XSPACING,
            styles.NEGATIVE_APP_YTSPACING,
          )}
        />

        <section className="grid gap-4 md:grid-cols-2">
          {activeCards.map((card) => (
            <SettingsCard key={card.title} card={card} />
          ))}
        </section>
      </div>
    </div>
  );
}
