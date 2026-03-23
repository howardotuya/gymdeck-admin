"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { OverviewCard, PageHeader, Panel, StatusBadge } from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import { getBranchTone } from "./data";
import type { BranchDetail } from "./types";

type BranchDetailPageProps = {
  branch: BranchDetail;
};

const secondaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong";
const dangerActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-[#fecdca] bg-bg-danger-soft px-4 text-[14px] font-semibold text-text-danger transition-colors hover:border-[#fda29b] disabled:cursor-not-allowed disabled:opacity-60";

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
  items: BranchDetail["plans"];
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
  const [branchState, setBranchState] = useState(branch);
  const openModal = useModalStore((state) => state.openModal);
  const isInactive = branchState.status === "Inactive";

  return (
    <div className="space-y-6 lg:space-y-8">
        <PageHeader
          eyebrow="Branch detail"
          title={branchState.name}
          description="Review the live operating profile, opening hours, staff ownership, and the program mix running at this location."
          breadcrumbs={[
            { label: "Branches", href: "/branches" },
            { label: branchState.name },
          ]}
          action={
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <StatusBadge label={branchState.status} tone={branchState.tone} />
              <Link href={`/branches/${branchState.id}/edit`} className={secondaryActionClassName}>
                Edit branch
              </Link>
              <button
                type="button"
                onClick={() =>
                  openModal("deactivateBranch", {
                    branchName: branchState.name,
                    onConfirm: () => {
                      setBranchState((currentBranch) => ({
                        ...currentBranch,
                        status: "Inactive",
                        tone: getBranchTone("Inactive"),
                      }));
                    },
                  })
                }
                disabled={isInactive}
                className={dangerActionClassName}
              >
                {isInactive ? "Branch inactive" : "Deactivate branch"}
              </button>
            </div>
          }
        />

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
            label="Members"
            value={branchState.members.toLocaleString()}
            detail={branchState.occupancy}
          />
          <OverviewCard
            label="Assigned staff"
            value={branchState.staffCount.toString()}
            detail={`${branchState.staff.length} lead contacts shown below`}
          />
          <OverviewCard
            label="Active plans"
            value={branchState.activePlans.toString()}
            detail={`${branchState.plans.length} plans highlighted in this branch setup`}
          />
          <OverviewCard
            label="Weekly classes"
            value={branchState.classesCount.toString()}
            detail={`${branchState.classes.length} recurring class types are configured`}
          />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_420px]">
          <div className="space-y-4">
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
                <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">{branchState.note}</p>
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
    </div>
  );
}
