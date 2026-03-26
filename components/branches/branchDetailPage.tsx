"use client";

import clsx from "clsx";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail } from "./types";

type BranchDetailPageProps = {
  branch: BranchDetail;
};

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-[1.6] text-text-primary">{value}</p>
    </div>
  );
}

function OfferingList({
  items,
  emptyLabel,
}: {
  items: Array<{ id: string; name: string; detail: string }>;
  emptyLabel: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
        >
          <p className="text-[15px] font-semibold text-text-primary">{item.name}</p>
          <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

export function BranchDetailPage({ branch }: BranchDetailPageProps) {
  const branchState = branch;
  const isInactive = branchState.status === "Inactive";
  const publishingBlockers = branchState.publishing.pendingChecks.length;
  const reviewNeedsAttention = branchState.reputation.moderationState === "needs_review";
  const primaryPlan =
    branchState.commerce.plans.find((plan) => plan.id === branchState.commerce.preferredPlanId) ??
    branchState.commerce.plans[0];

  return (
    <BranchWorkspaceLayout branch={branchState} activeSection="overview">
      {isInactive ? (
        <div className="rounded-[24px] border border-[#fecdca] bg-bg-danger-soft px-5 py-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-danger">
            Branch inactive
          </p>
          <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
            This location has been removed from active operations for the current session. Reopen
            it from the edit flow when branch staffing, plans, and routing are ready again.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Publishing"
          value={`${branchState.publishing.completenessScore}%`}
          detail={
            branchState.publishing.isDiscoverable
              ? "Branch is discoverable"
              : "Branch is hidden from discovery"
          }
        />
        <OverviewCard
          label="Reputation"
          value={
            branchState.reputation.reviewCount
              ? branchState.reputation.ratingAverage.toFixed(1)
              : "No reviews"
          }
          detail={
            branchState.reputation.reviewCount
              ? `${branchState.reputation.reviewCount} tracked reviews`
              : "No public reviews synced yet"
          }
        />
        <OverviewCard
          label="Primary plan"
          value={primaryPlan?.name ?? "Not set"}
          detail={
            primaryPlan
              ? primaryPlan.detail
              : "No featured plan has been selected yet"
          }
        />
        <OverviewCard
          label="Gallery"
          value={branchState.gallery.media.length.toString()}
          detail={`${branchState.gallery.featuredMediaIds.length} featured media selected`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_420px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Workspace"
            title="Branch overview"
            description="Operational state and public readiness in one summary."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Live state
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {branchState.status}
                </p>
                <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                  {branchState.occupancy}
                </p>
              </div>

              <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Review state
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {reviewNeedsAttention ? "Needs review" : "Healthy"}
                </p>
                <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                  {branchState.reputation.reviewCount
                    ? `${branchState.reputation.reviewCount} reviews across tracked sources`
                    : "No review volume yet"}
                </p>
              </div>

              <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Publishing blockers
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {publishingBlockers}
                </p>
                <p className="mt-1 text-[13px] leading-[1.6] text-text-secondary">
                  {publishingBlockers
                    ? "Items still need review before this branch is fully ready"
                    : "No active publishing blockers"}
                </p>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="Profile"
            title="Branch profile"
            description="Core identity and contact details staff use to route members, plans, and day-to-day issues."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <DetailRow label="Address" value={branchState.address} />
              <DetailRow label="Manager" value={branchState.manager} />
              <DetailRow label="Phone" value={branchState.phone} />
              <DetailRow label="Email" value={branchState.email} />
            </div>

            <div className="mt-5 rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                Operational note
              </p>
              <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
                {branchState.note}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {branchState.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Public profile"
            title="Listing summary"
            description="Branch-facing content already attached to this location for member discovery surfaces."
          >
            <p className="text-[16px] font-semibold text-text-primary">
              {branchState.publicProfile.headline}
            </p>
            <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
              {branchState.publicProfile.overviewShort}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {branchState.publicProfile.audienceTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-bg-muted px-3 py-1.5 text-[12px] font-semibold text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Hours"
            title="Opening hours"
            description="Daily staff-facing hours for check-ins, classes, and branch support."
          >
            <div className="space-y-3">
              {branchState.openingHours.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{item.day}</p>
                    <p className="mt-1 text-[12px] text-text-secondary">
                      {item.isOpen ? "Staffed opening hours" : "Closed"}
                    </p>
                  </div>
                  <p
                    className={clsx(
                      "text-[14px] font-medium",
                      item.isOpen ? "text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {item.isOpen
                      ? `${formatTime(item.openTime)} - ${formatTime(item.closeTime)}`
                      : "Closed"}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Staff"
            title="Assigned staff"
            description="Lead staff contacts attached to this branch for operations, training, and front desk coverage."
          >
            <div className="space-y-3">
              {branchState.staff.map((member) => (
                <div
                  key={member.id}
                  className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-text-primary">{member.name}</p>
                      <p className="mt-1 text-[13px] text-text-secondary">{member.role}</p>
                    </div>
                    <StatusBadge label={member.status} tone={member.tone} />
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.65] text-text-secondary">
                    {member.shift}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Publishing"
            title="Readiness"
            description="Tracks whether the branch has enough content to support a polished public listing."
          >
            <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
              <p className="text-[15px] font-semibold text-text-primary">
                {branchState.publishing.isDiscoverable ? "Discoverable" : "Hidden from discovery"}
              </p>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                {branchState.publishing.lastPublishedAt
                  ? `Last published ${new Date(branchState.publishing.lastPublishedAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}.`
                  : "This branch has not been published yet."}
              </p>
            </div>

            <div className="mt-3 space-y-3">
              {branchState.publishing.pendingChecks.length ? (
                branchState.publishing.pendingChecks.map((check) => (
                  <div
                    key={check}
                    className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3 text-[13px] leading-[1.6] text-text-secondary"
                  >
                    {check}
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3 text-[13px] leading-[1.6] text-text-secondary">
                  This branch currently has no publishing blockers.
                </div>
              )}
            </div>
          </Panel>

          <Panel
            eyebrow="Plans"
            title="Plans available"
            description="Membership and access products currently configured for this branch."
          >
            <OfferingList
              items={branchState.plans}
              emptyLabel="No plans have been assigned to this branch yet."
            />
          </Panel>

          <Panel
            eyebrow="Classes"
            title="Classes available"
            description="Recurring class types configured for this location."
          >
            <OfferingList
              items={branchState.classes}
              emptyLabel="No classes are currently configured for this branch."
            />
          </Panel>

          <Panel
            eyebrow="Social"
            title="Linked channels"
            description="Current public link endpoints associated with this branch."
          >
            <div className="space-y-3">
              {Object.entries(branchState.socialLinks).length ? (
                Object.entries(branchState.socialLinks).map(([platform, href]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3"
                  >
                    <p className="text-[14px] font-semibold capitalize text-text-primary">
                      {platform}
                    </p>
                    <p className="truncate text-[13px] text-text-secondary">{href}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                  No social links have been assigned to this branch yet.
                </div>
              )}
            </div>
          </Panel>

          <Panel
            eyebrow="Ops"
            title="Operational notes"
            description="Keep attention points visible without burying them inside the edit workflow."
          >
            <div className="space-y-3">
              {branchState.watchlist.map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                >
                  <p className="text-[13px] leading-[1.65] text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </BranchWorkspaceLayout>
  );
}
