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
import { StatusBadge } from "@/components/ui";
import {
  getSettingsTab,
  settingsCardsByTab,
  settingsTabIntro,
  settingsTabs,
  type SettingsCard,
  type SettingsCardIcon,
} from "./data";

const iconMap: Record<SettingsCardIcon, React.ComponentType<{ size?: number; className?: string }>> = {
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
    <Link href={card.href} className="text-[14px] font-semibold text-text-brand">
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
        <p className="mt-3 text-[14px] leading-[1.65] text-text-secondary">{card.description}</p>
      </div>

      <div className="border-t border-border-soft px-6 py-5">{action}</div>
    </article>
  );
}

export function SettingsPage({ activeTabParam }: { activeTabParam?: string | null }) {
  const activeTab = getSettingsTab(activeTabParam);
  const activeTabMeta = settingsTabs.find((tab) => tab.id === activeTab) ?? settingsTabs[0];
  const activeCards = settingsCardsByTab[activeTab];
  const intro = settingsTabIntro[activeTab];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="max-w-[760px]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
          Settings workspace
        </p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.04em] text-text-primary">
          Keep the sidebar lean and move deep configuration here
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
          Main operations stay in the primary navigation. Team administration and gym setup now sit
          behind one tabbed settings workspace, following the MOS-style pattern without pushing the
          branch selector to the bottom.
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-[248px_minmax(0,1fr)]">
        <div className="space-y-3">
          {settingsTabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <Link
                key={tab.id}
                href={getTabHref(tab.id)}
                className={clsx(
                  "block rounded-[20px] border px-4 py-4 transition-all",
                  active
                    ? "border-transparent bg-bg-brand-strong text-text-inverse shadow-[var(--shadow-card)]"
                    : "border-border-soft bg-bg-surface text-text-primary hover:border-border-strong hover:bg-bg-muted",
                )}
              >
                <p className="text-[18px] font-semibold tracking-[-0.03em]">{tab.label}</p>
                <p
                  className={clsx(
                    "mt-2 text-[13px] leading-[1.55]",
                    active ? "text-text-inverse/80" : "text-text-secondary",
                  )}
                >
                  {tab.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          <section className="rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[720px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  {activeTabMeta.label}
                </p>
                <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-text-primary">
                  {intro.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
                  {intro.description}
                </p>
              </div>
              <StatusBadge label={`${activeCards.length} modules`} tone="brand" />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {activeCards.map((card) => (
              <SettingsCard key={card.title} card={card} />
            ))}
          </section>
        </div>
      </section>
    </div>
  );
}
