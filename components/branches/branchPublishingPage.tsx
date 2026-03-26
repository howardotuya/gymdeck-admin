"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import {
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail } from "./types";

type BranchPublishingPageProps = {
  branch: BranchDetail;
};

function getPublishTone(branch: BranchDetail) {
  if (branch.publishing.isDiscoverable) {
    return "success" as const;
  }

  if (branch.publishing.eligibleForDiscovery) {
    return "brand" as const;
  }

  if (branch.publishing.requestedDiscoverable) {
    return "warning" as const;
  }

  return "neutral" as const;
}

function getPublishLabel(branch: BranchDetail) {
  if (branch.publishing.isDiscoverable) {
    return "Published";
  }

  if (branch.publishing.eligibleForDiscovery) {
    return "Ready to publish";
  }

  if (branch.publishing.requestedDiscoverable) {
    return "Needs attention";
  }

  return "Draft";
}

export function BranchPublishingPage({ branch }: BranchPublishingPageProps) {
  const [requestedDiscoverable, setRequestedDiscoverable] = useState(
    branch.publishing.requestedDiscoverable,
  );

  const isDirty = requestedDiscoverable !== branch.publishing.requestedDiscoverable;
  const wouldBePublished = requestedDiscoverable && branch.publishing.eligibleForDiscovery;
  const nextStateLabel = useMemo(() => {
    if (wouldBePublished) {
      return "Published";
    }

    if (requestedDiscoverable && !branch.publishing.eligibleForDiscovery) {
      return "Requested, but blocked";
    }

    if (branch.publishing.eligibleForDiscovery) {
      return "Draft, but ready";
    }

    return "Draft";
  }, [branch.publishing.eligibleForDiscovery, requestedDiscoverable, wouldBePublished]);

  const handleSave = () => {
    if (requestedDiscoverable && !branch.publishing.eligibleForDiscovery) {
      toast.error("Resolve blocking publishing checks before enabling discovery.");
      return;
    }

    toast.success(`${branch.name} publishing controls are staged for review.`);
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="publishing"
      pageLabel="Publishing"
      description="Control whether this branch can go live, inspect blocking checks, and review how complete the public listing is before discovery is enabled."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge label={getPublishLabel(branch)} tone={getPublishTone(branch)} />
          <button
            type="button"
            onClick={() => setRequestedDiscoverable(branch.publishing.requestedDiscoverable)}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button type="button" onClick={handleSave} className={primaryActionClassName}>
            Save publishing
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Completeness"
          value={`${branch.publishing.completenessScore}%`}
          detail="Computed from public content, pricing, schedule, and moderation checks"
        />
        <OverviewCard
          label="Blocking checks"
          value={branch.publishing.pendingChecks.length.toString()}
          detail="Items that stop this branch from going live"
        />
        <OverviewCard
          label="Recommended"
          value={branch.publishing.recommendedChecks.length.toString()}
          detail="Improvements that strengthen the listing but do not block publishing"
        />
        <OverviewCard
          label="Next state"
          value={nextStateLabel}
          detail={
            requestedDiscoverable
              ? "Requested for discovery once readiness allows it"
              : "Not currently requested for discovery"
          }
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Go live"
            title="Discovery controls"
            description="A branch is only public when discovery is requested and all blocking checks are clear."
          >
            <label className="flex items-start gap-3 rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
              <input
                type="checkbox"
                checked={requestedDiscoverable}
                onChange={(event) => setRequestedDiscoverable(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border border-border-strong"
              />
              <div>
                <p className="text-[15px] font-semibold text-text-primary">
                  Request discovery for this branch
                </p>
                <p className="mt-1 text-[13px] leading-[1.65] text-text-secondary">
                  Discovery only activates when all blocking checks are resolved. This separates operator intent from actual publishing eligibility.
                </p>
              </div>
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Requested state
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {requestedDiscoverable ? "Discovery requested" : "Discovery disabled"}
                </p>
              </div>

              <div className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Effective state
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {wouldBePublished ? "Would publish" : branch.publishing.isDiscoverable ? "Published" : "Not public"}
                </p>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="Blocking checks"
            title="Must-fix items"
            description="These items prevent the branch from being discoverable."
          >
            <div className="space-y-3">
              {branch.publishing.pendingChecks.length ? (
                branch.publishing.pendingChecks.map((check) => (
                  <div
                    key={check}
                    className="rounded-[18px] border border-[#fecdca] bg-bg-danger-soft px-4 py-3 text-[13px] leading-[1.6] text-text-secondary"
                  >
                    {check}
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3 text-[13px] leading-[1.6] text-text-secondary">
                  No blocking checks remain. This branch is eligible for discovery.
                </div>
              )}
            </div>
          </Panel>

          <Panel
            eyebrow="Recommended"
            title="Quality improvements"
            description="These checks improve conversion quality but do not stop publishing."
          >
            <div className="space-y-3">
              {branch.publishing.recommendedChecks.length ? (
                branch.publishing.recommendedChecks.map((check) => (
                  <div
                    key={check}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3 text-[13px] leading-[1.6] text-text-secondary"
                  >
                    {check}
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-border-soft bg-bg-surface px-4 py-3 text-[13px] leading-[1.6] text-text-secondary">
                  No quality improvements are currently recommended for this branch.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Status"
            title="Publishing summary"
            description="This mirrors what the public route will enforce."
          >
            <div className="space-y-3">
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Current state
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {getPublishLabel(branch)}
                </p>
              </div>

              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Discoverability
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {branch.publishing.isDiscoverable ? "Visible in discovery" : "Not visible in discovery"}
                </p>
              </div>

              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Eligibility
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {branch.publishing.eligibleForDiscovery ? "Eligible" : "Blocked"}
                </p>
              </div>

              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Last published
                </p>
                <p className="mt-2 text-[15px] font-semibold text-text-primary">
                  {branch.publishing.lastPublishedAt
                    ? new Date(branch.publishing.lastPublishedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Never published"}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
