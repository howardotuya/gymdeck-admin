"use client";

import { useMemo, useState } from "react";
import { OverviewCard } from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import {
  buildPlanCardItem,
  buildPlanId,
  getPlanOverview,
  getPlanStatusTone,
  plans,
  type PlanCardItem,
} from "./data";
import { PlanListTable } from "./organisms/planListTable";

export function PlansPage() {
  const [planRows, setPlanRows] = useState<PlanCardItem[]>(plans);
  const openModal = useModalStore((state) => state.openModal);
  const overview = useMemo(() => getPlanOverview(planRows), [planRows]);

  const handleCreatePlan = () => {
    openModal("planEditor", {
      mode: "create",
      onSubmit: (values) => {
        setPlanRows((currentRows) => [
          buildPlanCardItem(values, {
            id: buildPlanId(currentRows),
            lastUpdated: "Added today by Membership Ops",
          }),
          ...currentRows,
        ]);
      },
    });
  };

  const handleEditPlan = (plan: PlanCardItem) => {
    openModal("planEditor", {
      mode: "edit",
      plan,
      onSubmit: (values) => {
        setPlanRows((currentRows) =>
          currentRows.map((row) =>
            row.id === plan.id
              ? buildPlanCardItem(values, {
                  id: row.id,
                  subscribers: row.subscribers,
                  revenue: row.revenue,
                  lastUpdated: "Updated today by Membership Ops",
                  previousPlan: row,
                })
              : row,
          ),
        );
      },
    });
  };

  const handleDeactivatePlan = (plan: PlanCardItem) => {
    openModal("deactivatePlan", {
      plan,
      onConfirm: () => {
        setPlanRows((currentRows) =>
          currentRows.map((row) =>
            row.id === plan.id
              ? {
                  ...row,
                  status: "Inactive",
                  statusTone: getPlanStatusTone("Inactive"),
                  lastUpdated: "Deactivated today by Membership Ops",
                }
              : row,
          ),
        );
      },
    });
  };

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <PlanListTable
        plans={planRows}
        onAddPlan={handleCreatePlan}
        onEditPlan={handleEditPlan}
        onDeactivatePlan={handleDeactivatePlan}
      />
    </div>
  );
}
