"use client";

import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type {
  BranchClassAssignment,
  BranchDetail,
  BranchPlanAssignment,
  BranchScheduledSession,
} from "./types";

type BranchPlansAndClassesPageProps = {
  branch: BranchDetail;
};

function sortPlans(items: BranchPlanAssignment[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function sortClasses(items: BranchClassAssignment[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function getSessionCountForClass(
  sessions: BranchScheduledSession[],
  classId: string,
) {
  return sessions.filter((session) => session.classId === classId).length;
}

export function BranchPlansAndClassesPage({
  branch,
}: BranchPlansAndClassesPageProps) {
  const visiblePlans = sortPlans(branch.commerce.plans).filter((plan) => plan.visible !== false);
  const visibleClasses = sortClasses(branch.programming.classTypes).filter(
    (gymClass) => gymClass.visible !== false,
  );
  const featuredPlan =
    branch.commerce.plans.find((plan) => plan.featured) ??
    branch.commerce.plans.find((plan) => plan.id === branch.commerce.preferredPlanId);
  const openSessions = branch.programming.sessions.filter(
    (session) => session.bookingState === "open",
  ).length;

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="plans-and-classes"
      pageLabel="Plans and classes"
      description="Review the commercial offers, class categories, and public timetable attached to this branch."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Visible plans"
          value={visiblePlans.length.toString()}
          detail="Plans currently eligible for public display"
        />
        <OverviewCard
          label="Featured plan"
          value={featuredPlan?.name ?? "Not set"}
          detail="Primary branch conversion offer"
        />
        <OverviewCard
          label="Visible classes"
          value={visibleClasses.length.toString()}
          detail="Formats currently shown on the branch schedule"
        />
        <OverviewCard
          label="Open sessions"
          value={openSessions.toString()}
          detail={`${branch.programming.sessions.length} sessions on the current timetable`}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Plans"
            title="Membership offers"
            description="Plans configured for this branch, including their public visibility and conversion priority."
          >
            <div className="space-y-4">
              {sortPlans(branch.commerce.plans).map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {plan.featured ? (
                      <StatusBadge label="Featured" tone="brand" />
                    ) : null}
                    <StatusBadge
                      label={plan.visible === false ? "Hidden" : "Visible"}
                      tone={plan.visible === false ? "warning" : "success"}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-text-primary">
                        {plan.name}
                      </p>
                      <p className="mt-2 text-[14px] font-semibold text-text-primary">
                        {plan.priceLabel ?? "Price not set"}
                        {plan.cadenceLabel ? (
                          <span className="ml-1 text-[12px] font-normal text-text-secondary">
                            {plan.cadenceLabel}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.65] text-text-secondary">
                    {plan.audienceNote || plan.detail}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Classes"
            title="Program mix"
            description="Class categories and their visibility across the branch timetable."
          >
            <div className="space-y-4">
              {sortClasses(branch.programming.classTypes).map((gymClass) => (
                <article
                  key={gymClass.id}
                  className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={gymClass.category} tone="neutral" />
                    <StatusBadge
                      label={gymClass.visible === false ? "Hidden" : "Visible"}
                      tone={gymClass.visible === false ? "warning" : "success"}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-text-primary">
                        {gymClass.name}
                      </p>
                      <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                        {gymClass.coachHighlight || gymClass.detail}
                      </p>
                    </div>
                    <StatusBadge
                      label={`${getSessionCountForClass(
                        branch.programming.sessions,
                        gymClass.id,
                      )} sessions`}
                      tone="brand"
                    />
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Commercial"
            title="Offer settings"
            description="Branch-level switches that affect how plans and access paths are surfaced."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3">
                <p className="text-[14px] font-medium text-text-primary">Drop-in access</p>
                <StatusBadge
                  label={branch.commerce.dropInEnabled ? "Enabled" : "Hidden"}
                  tone={branch.commerce.dropInEnabled ? "success" : "neutral"}
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3">
                <p className="text-[14px] font-medium text-text-primary">Trial messaging</p>
                <StatusBadge
                  label={branch.commerce.trialEnabled ? "Enabled" : "Hidden"}
                  tone={branch.commerce.trialEnabled ? "success" : "neutral"}
                />
              </div>
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Preferred plan
                </p>
                <p className="mt-2 text-[14px] font-medium text-text-primary">
                  {featuredPlan?.name ?? "No preferred plan selected"}
                </p>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="Timetable"
            title="Schedule summary"
            description="High-level timetable configuration for this branch."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3">
                <p className="text-[14px] font-medium text-text-primary">Schedule source</p>
                <StatusBadge
                  label={
                    branch.programming.scheduleSource === "local"
                      ? "Local schedule"
                      : "Central schedule"
                  }
                  tone={branch.programming.scheduleSource === "local" ? "brand" : "neutral"}
                />
              </div>

              {branch.programming.sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-text-primary">
                      {session.title}
                    </p>
                    <StatusBadge
                      label={session.bookingState}
                      tone={
                        session.bookingState === "open"
                          ? "success"
                          : session.bookingState === "waitlist"
                            ? "warning"
                            : "neutral"
                      }
                    />
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                    {session.weekday} • {session.startTime} - {session.endTime}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.65] text-text-secondary">
                    {session.coach} • Capacity {session.capacity}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
