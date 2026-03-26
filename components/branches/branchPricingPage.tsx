"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail, BranchPlanAssignment } from "./types";

type BranchPricingPageProps = {
  branch: BranchDetail;
};

function clonePlans(items: BranchPlanAssignment[]) {
  return items.map((item) => ({ ...item }));
}

function sortPlans(items: BranchPlanAssignment[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function BranchPricingPage({ branch }: BranchPricingPageProps) {
  const [plans, setPlans] = useState<BranchPlanAssignment[]>(() =>
    sortPlans(clonePlans(branch.commerce.plans)),
  );
  const [dropInEnabled, setDropInEnabled] = useState(branch.commerce.dropInEnabled);
  const [trialEnabled, setTrialEnabled] = useState(branch.commerce.trialEnabled);

  const isDirty = useMemo(
    () =>
      JSON.stringify(plans) !== JSON.stringify(sortPlans(branch.commerce.plans)) ||
      dropInEnabled !== branch.commerce.dropInEnabled ||
      trialEnabled !== branch.commerce.trialEnabled,
    [branch.commerce.dropInEnabled, branch.commerce.plans, branch.commerce.trialEnabled, dropInEnabled, plans, trialEnabled],
  );

  const visiblePlans = plans.filter((plan) => plan.visible !== false);
  const featuredPlan = plans.find((plan) => plan.featured);

  const resetChanges = () => {
    setPlans(sortPlans(clonePlans(branch.commerce.plans)));
    setDropInEnabled(branch.commerce.dropInEnabled);
    setTrialEnabled(branch.commerce.trialEnabled);
  };

  const handleSave = () => {
    toast.success(`${branch.name} pricing changes are staged for review.`);
  };

  const updatePlan = (planId: string, patch: Partial<BranchPlanAssignment>) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)),
    );
  };

  const setFeaturedPlan = (planId: string) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) => ({
        ...plan,
        featured: plan.id === planId,
      })),
    );
  };

  const movePlan = (planId: string, direction: "up" | "down") => {
    setPlans((currentPlans) => {
      const currentIndex = currentPlans.findIndex((plan) => plan.id === planId);

      if (currentIndex < 0) {
        return currentPlans;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= currentPlans.length) {
        return currentPlans;
      }

      const nextPlans = [...currentPlans];
      const [movedPlan] = nextPlans.splice(currentIndex, 1);
      nextPlans.splice(targetIndex, 0, movedPlan);

      return nextPlans.map((plan, index) => ({
        ...plan,
        displayOrder: index + 1,
      }));
    });
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="pricing"
      pageLabel="Pricing"
      description="Control which plans are publicly visible, which offer leads conversion, and how branch-specific pricing is presented."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={`${visiblePlans.length} visible plans`}
            tone={visiblePlans.length ? "success" : "warning"}
          />
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button type="button" onClick={handleSave} className={primaryActionClassName}>
            Save pricing
          </button>
        </div>
      }
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
          detail="Primary conversion card across branch surfaces"
        />
        <OverviewCard
          label="Drop-in"
          value={dropInEnabled ? "Enabled" : "Hidden"}
          detail="Controls one-off branch access messaging"
        />
        <OverviewCard
          label="Trial"
          value={trialEnabled ? "Enabled" : "Hidden"}
          detail="Controls trial conversion availability"
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Access controls"
            title="Branch pricing settings"
            description="These switches affect what members can discover before they land on a specific plan."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <input
                  type="checkbox"
                  checked={dropInEnabled}
                  onChange={(event) => setDropInEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border border-border-strong"
                />
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">Enable drop-in access</p>
                  <p className="mt-1 text-[13px] text-text-secondary">Show one-off access on public pricing surfaces.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <input
                  type="checkbox"
                  checked={trialEnabled}
                  onChange={(event) => setTrialEnabled(event.target.checked)}
                  className="h-4 w-4 rounded border border-border-strong"
                />
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">Enable trial messaging</p>
                  <p className="mt-1 text-[13px] text-text-secondary">Surface trial pathways when the branch supports them.</p>
                </div>
              </label>
            </div>
          </Panel>

          <Panel
            eyebrow="Plan stack"
            title="Visible pricing"
            description="Order plans the way members should see them, and choose one featured offer for conversion."
          >
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={plan.featured ? "Featured" : "Standard"}
                      tone={plan.featured ? "brand" : "neutral"}
                    />
                    <StatusBadge
                      label={plan.visible === false ? "Hidden" : "Visible"}
                      tone={plan.visible === false ? "warning" : "success"}
                    />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
                    <Field id={`plan-name-${plan.id}`} label="Plan">
                      <input
                        id={`plan-name-${plan.id}`}
                        value={plan.name}
                        onChange={(event) => updatePlan(plan.id, { name: event.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field id={`plan-price-${plan.id}`} label="Price label">
                      <input
                        id={`plan-price-${plan.id}`}
                        value={plan.priceLabel ?? ""}
                        onChange={(event) => updatePlan(plan.id, { priceLabel: event.target.value })}
                        className={inputClassName}
                        placeholder="NGN 15,000"
                      />
                    </Field>
                    <Field id={`plan-cadence-${plan.id}`} label="Cadence">
                      <input
                        id={`plan-cadence-${plan.id}`}
                        value={plan.cadenceLabel ?? ""}
                        onChange={(event) => updatePlan(plan.id, { cadenceLabel: event.target.value })}
                        className={inputClassName}
                        placeholder="/month"
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field id={`plan-note-${plan.id}`} label="Audience note">
                      <input
                        id={`plan-note-${plan.id}`}
                        value={plan.audienceNote ?? ""}
                        onChange={(event) => updatePlan(plan.id, { audienceNote: event.target.value })}
                        className={inputClassName}
                        placeholder="Best for high-frequency members or premium access seekers."
                      />
                    </Field>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setFeaturedPlan(plan.id)}
                      className={clsx(
                        secondaryActionClassName,
                        plan.featured && "border-border-brand text-text-brand",
                      )}
                    >
                      {plan.featured ? "Featured plan" : "Set featured"}
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePlan(plan.id, { visible: plan.visible === false })}
                      className={secondaryActionClassName}
                    >
                      {plan.visible === false ? "Show plan" : "Hide plan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlan(plan.id, "up")}
                      className={secondaryActionClassName}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => movePlan(plan.id, "down")}
                      className={secondaryActionClassName}
                    >
                      Move down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Preview"
            title="Public pricing summary"
            description="Approximate how the pricing surface will look once these settings are published."
          >
            <div className="space-y-3">
              {visiblePlans.length ? (
                sortPlans(visiblePlans).map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[15px] font-semibold text-text-primary">{plan.name}</p>
                      {plan.featured ? <StatusBadge label="Featured" tone="brand" /> : null}
                    </div>
                    <p className="mt-2 text-[14px] font-semibold text-text-primary">
                      {plan.priceLabel ?? "Price not set"}
                      <span className="ml-1 text-[12px] font-normal text-text-secondary">
                        {plan.cadenceLabel ?? ""}
                      </span>
                    </p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                      {plan.audienceNote || plan.detail}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                  No pricing plans are currently visible for this branch.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
