"use client";

import clsx from "clsx";
import { CheckIcon } from "@/components/icons";
import { GYM_NAME } from "@/components/home/data";
import { SectionHeading } from "@/components/home/atoms";
import type { Plan } from "@/components/home/types";
import { useModalStore } from "@/stores/useModalStore";

type PricingSectionProps = {
  desktopPlans: Plan[];
  mobilePlans: Plan[];
};

type PlanCardProps = {
  plan: Plan;
  onSelectPlan: (plan: Plan) => void;
};

function MobilePlanCard({ onSelectPlan, plan }: PlanCardProps) {
  return (
    <article className="overflow-hidden rounded-[16px] bg-bg-muted p-1">
      <div className="space-y-3 px-5 py-4">
        <p className="text-center text-[16px] leading-[1.4] font-medium tracking-[-0.02em] text-[#160041]">
          {plan.name}
        </p>
        <p className="text-center text-[32px] leading-[1.2] font-semibold tracking-[-0.04em] text-[#160041]">
          {plan.price}
          {plan.suffix ? (
            <span className="ml-1 text-[14px] leading-[1.4] font-normal tracking-normal">
              {plan.suffix}
            </span>
          ) : null}
        </p>
      </div>

      <div className="rounded-[20px] bg-bg-surface p-8">
        <ul className="space-y-4">
          {plan.features.map((feature) => (
            <li
              key={`${plan.id}-${feature}`}
              className="inline-flex items-center gap-2 text-[14px] leading-[1.4] tracking-[-0.02em] text-text-secondary"
            >
              <CheckIcon className="size-5 text-[#7aa9fb]" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            onSelectPlan(plan);
          }}
          className={clsx(
            "mt-8 inline-flex h-[51px] w-full items-center justify-center rounded-full px-[10px] text-[14px] font-medium leading-[1.4] transition-colors",
            plan.featured
              ? "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
              : "bg-bg-muted text-text-support hover:text-text-primary",
          )}
        >
          Select Plan
        </button>
      </div>
    </article>
  );
}

function DesktopPlanCard({ onSelectPlan, plan }: PlanCardProps) {
  return (
    <article className="flex min-h-[384px] flex-1 flex-col gap-1 overflow-hidden rounded-[16px] bg-bg-muted p-1">
      <div className="space-y-3 px-5 py-4">
        <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.02em] text-[#160041]">
          {plan.name}
        </p>
        <p className="text-[32px] leading-[1.2] font-semibold tracking-[-0.04em] text-[#160041]">
          {plan.price}
          {plan.suffix ? (
            <span className="ml-1 text-[14px] leading-[1.4] font-normal tracking-normal">
              {plan.suffix}
            </span>
          ) : null}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between rounded-[20px] bg-bg-surface p-8">
        <ul className="space-y-4">
          {plan.features.map((feature) => (
            <li
              key={`${plan.id}-${feature}`}
              className="inline-flex items-center gap-2 text-[14px] leading-[1.4] tracking-[-0.02em] text-text-secondary"
            >
              <CheckIcon className="size-5 text-[#7aa9fb]" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            onSelectPlan(plan);
          }}
          className={clsx(
            "mt-8 inline-flex h-[51px] w-full items-center justify-center rounded-full px-[10px] text-[14px] font-medium leading-[1.4] transition-colors",
            plan.featured
              ? "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
              : "bg-bg-muted text-text-support hover:text-text-primary",
          )}
        >
          Select Plan
        </button>
      </div>
    </article>
  );
}

export function PricingSection({
  desktopPlans,
  mobilePlans,
}: PricingSectionProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleSelectPlan = (plan: Plan) => {
    openModal("planConfirmation", {
      gymName: GYM_NAME,
      planName: plan.name,
      planPriceLabel: `${plan.price}${plan.suffix ? ` ${plan.suffix}` : ""}`,
      reviewDetails: plan.reviewDetails,
    });
  };

  return (
    <section className="space-y-8">
      <SectionHeading
        title="Choose Your Plan"
        description="Select the plan that best fits your fitness goals and schedule"
        className="space-y-4 md:space-y-3"
      />

      <div className="hidden rounded-[24px] border-2 border-[#faf7ff] bg-bg-surface p-1 md:block">
        <div className="flex items-stretch gap-1">
          {desktopPlans.map((plan) => (
            <DesktopPlanCard
              key={plan.id}
              plan={plan}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-[24px] border-2 border-[#faf7ff] bg-bg-surface p-1 md:hidden">
        {mobilePlans.map((plan) => (
          <MobilePlanCard
            key={plan.id}
            plan={plan}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
    </section>
  );
}
