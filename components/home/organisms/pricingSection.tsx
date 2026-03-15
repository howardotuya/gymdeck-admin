import clsx from "clsx";
import { CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/home/atoms";
import type { Plan } from "@/components/home/types";

type PricingSectionProps = {
  desktopPlans: Plan[];
  mobilePlans: Plan[];
};

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className="rounded-[16px] border border-border-soft bg-bg-surface p-4">
      <p className="text-[18px] leading-[1.3] font-medium text-text-primary">{plan.name}</p>
      <p className="mt-2 text-[50px] leading-[1.05] font-semibold text-text-primary">
        {plan.price}
        {plan.suffix ? (
          <span className="ml-1 text-[14px] leading-[1.4] font-normal text-text-support">{plan.suffix}</span>
        ) : null}
      </p>

      <ul className="mt-4 space-y-3 rounded-[12px] bg-bg-muted p-4">
        {plan.features.map((feature) => (
          <li
            key={`${plan.id}-${feature}`}
            className="inline-flex items-center gap-2 text-[14px] leading-[1.4] text-text-support"
          >
            <CheckIcon className="size-4 text-text-brand" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={clsx(
          "mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-full text-[14px] font-medium leading-[1.4] transition-colors",
          plan.featured
            ? "bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
            : "bg-bg-muted text-text-support hover:text-text-primary"
        )}
      >
        Select Plan
      </button>
    </article>
  );
}

export function PricingSection({ desktopPlans, mobilePlans }: PricingSectionProps) {
  return (
    <section className="space-y-8">
      <SectionHeading
        title="Choose Your Plan"
        description="Select the plan that best fits your fitness goals and schedule"
      />

      <div className="hidden gap-3 md:grid md:grid-cols-3">
        {desktopPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="space-y-4 md:hidden">
        {mobilePlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
