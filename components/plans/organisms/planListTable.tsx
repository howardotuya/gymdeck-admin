"use client";

import { useMemo } from "react";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import { extractCurrencyValue, type PlanCardItem } from "../data";
import { PlanMobileCard } from "../molecules/planMobileCard";

type PlanListTableProps = {
  plans: PlanCardItem[];
  onAddPlan?: () => void;
  onEditPlan?: (plan: PlanCardItem) => void;
  onDeactivatePlan?: (plan: PlanCardItem) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

const planColumns: CustomTableColumn<PlanCardItem>[] = [
  {
    id: "plan",
    header: "Plan",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (plan) => plan.name,
    cell: (plan) => (
      <div>
        <p className="font-medium text-text-primary">{plan.name}</p>
      </div>
    ),
  },
  {
    id: "type",
    header: "Type",
    sortable: true,
    sortAccessor: (plan) => plan.type,
    cell: (plan) => (
      <div>
        <p className="font-medium text-text-primary">{plan.type}</p>
      </div>
    ),
  },
  {
    id: "price",
    header: "Price",
    align: "right",
    sortable: true,
    sortAccessor: (plan) => extractCurrencyValue(plan.price),
    cell: (plan) => (
      <div className="text-right">
        <p className="font-medium text-text-primary">{plan.price}</p>
      </div>
    ),
  },
  // {
  //   id: "branchScope",
  //   header: "Branch Scope",
  //   sortable: true,
  //   sortAccessor: (plan) => plan.branchScope,
  //   accessorKey: "branchScope",
  //   className: "leading-[1.6] text-text-secondary",
  // },
  // {
  //   id: "subscribers",
  //   header: "Subscribers",
  //   align: "right",
  //   sortable: true,
  //   sortAccessor: (plan) => extractLeadingNumber(plan.subscribers),
  //   accessorKey: "subscribers",
  //   className: "font-medium",
  // },
  // {
  //   id: "revenue",
  //   header: "Revenue",
  //   align: "right",
  //   sortable: true,
  //   sortAccessor: (plan) => extractCurrencyValue(plan.revenue),
  //   accessorKey: "revenue",
  //   className: "font-medium",
  // },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (plan) => plan.status,
    cell: (plan) => <StatusBadge label={plan.status} tone={plan.statusTone} />,
  },
];

function PlanToolbarActions() {
  return (
    <>
      <TableControlButton>Export pricing</TableControlButton>
      <TableControlButton>
        Filter By
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

export function PlanListTable({
  plans,
  onAddPlan,
  onEditPlan,
  onDeactivatePlan,
  title = "Plan catalogue",
  searchPlaceholder = "Search plans",
  tableCaption,
  className,
}: PlanListTableProps) {
  const planActions = useMemo<CustomTableAction<PlanCardItem>[]>(() => {
    const actions: CustomTableAction<PlanCardItem>[] = [];

    if (onEditPlan) {
      actions.push({
        label: "Edit",
        onSelect: (plan) => onEditPlan(plan),
      });
    }

    if (onDeactivatePlan) {
      actions.push({
        label: "Deactivate",
        tone: "danger",
        hidden: (plan) => plan.status === "Inactive",
        onSelect: (plan) => onDeactivatePlan(plan),
      });
    }

    return actions;
  }, [onDeactivatePlan, onEditPlan]);

  return (
    <CustomTable
      title={title}
      data={plans}
      columns={planColumns}
      rowActions={planActions}
      getRowId={(plan) => plan.id}
      getRowLabel={(plan) => plan.name}
      getSearchText={(plan) =>
        [
          plan.id,
          plan.name,
          plan.type,
          plan.status,
          plan.price,
          plan.cadence,
          plan.branchScope,
          plan.subscribers,
          plan.revenue,
          plan.access,
          plan.features.join(" "),
          plan.note,
          plan.lastUpdated,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of pricing products, access model, subscriber coverage, revenue contribution, and plan status.`
      }
      headerAction={
        <TableControlButton variant="primary" onClick={onAddPlan}>
          Add plan
        </TableControlButton>
      }
      toolbarActions={<PlanToolbarActions />}
      renderMobileCard={(plan, { actionsMenu }) => (
        <PlanMobileCard plan={plan} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No plans found"
      emptyStateDescription="Add a pricing product or adjust your search to populate this catalog."
      itemLabel="plans"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
