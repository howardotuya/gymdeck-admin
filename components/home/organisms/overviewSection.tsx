import clsx from "clsx";
import { ArrowDownSLineIcon, CheckIcon } from "@/components/icons";
import { SectionHeading } from "@/components/home/atoms";
import type { Amenity, RuleItem } from "@/components/home/types";

type OverviewSectionProps = {
  overviewText: string;
  amenities: Amenity[];
  rules: RuleItem[];
};

export function OverviewSection({ amenities, overviewText, rules }: OverviewSectionProps) {
  return (
    <section className="space-y-10">
      <SectionHeading title="Overview" description={overviewText} />

      <div className="space-y-4">
        <h4 className="text-[18px] leading-[1.4] font-semibold text-text-primary">Amenities</h4>
        <ul className="grid gap-4 sm:grid-cols-2">
          {amenities.map((amenity) => (
            <li
              key={amenity.id}
              className="inline-flex items-center gap-2 text-[14px] leading-[1.5] text-text-support md:text-[16px]"
            >
              <CheckIcon className="size-4 text-text-brand" />
              {amenity.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="text-[18px] leading-[1.4] font-semibold text-text-primary">Gym Rules & Etiquette</h4>
        <div className="space-y-3">
          {rules.map((rule) => (
            <article key={rule.id} className="rounded-[16px] bg-bg-muted p-6">
              <button
                type="button"
                className="flex w-full items-center justify-between text-left text-[16px] leading-[1.5] font-medium text-text-support"
              >
                {rule.title}
                <ArrowDownSLineIcon
                  className={clsx("size-4 text-text-support transition-transform", rule.expanded ? "rotate-180" : "")}
                />
              </button>

              {rule.expanded && rule.details ? (
                <p className="mt-3 rounded-[12px] bg-bg-surface p-4 text-[14px] leading-[1.5] text-text-secondary">
                  {rule.details}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
