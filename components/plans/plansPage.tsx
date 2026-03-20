import { OverviewCard } from "@/components/ui";
import { getPlanOverview, plans } from "./data";
import { PlanListTable } from "./organisms/planListTable";

export function PlansPage() {
  const overview = getPlanOverview(plans);

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <PlanListTable plans={plans} />
    </div>
  );
}
