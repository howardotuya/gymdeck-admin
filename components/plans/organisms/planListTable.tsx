"use client";

import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableColumn,
} from "@/components/ui";
import type { PlanCardItem } from "../data";
import { PlanMobileCard } from "../molecules/planMobileCard";

type PlanListTableProps = {
  plans: PlanCardItem[];
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

function extractLeadingNumber(value: string) {
  const match = value.match(/[\d,]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

function extractCurrencyValue(value: string) {
  const match = value.match(/NGN\s*([\d.,]+)\s*([mk])?/i);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  const suffix = match[2]?.toLowerCase();

  if (suffix === "m") {
    return amount * 1_000_000;
  }

  if (suffix === "k") {
    return amount * 1_000;
  }

  return amount;
}

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
        <p className="mt-1 text-[13px] text-text-secondary">{plan.id}</p>
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
        <p className="mt-1 text-[13px] text-text-secondary">{plan.access}</p>
      </div>
    ),
    className: "align-top",
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
        <p className="mt-1 text-[13px] text-text-secondary">{plan.cadence}</p>
      </div>
    ),
  },
  {
    id: "branchScope",
    header: "Branch Scope",
    sortable: true,
    sortAccessor: (plan) => plan.branchScope,
    accessorKey: "branchScope",
    className: "leading-[1.6] text-text-secondary",
  },
  {
    id: "subscribers",
    header: "Subscribers",
    align: "right",
    sortable: true,
    sortAccessor: (plan) => extractLeadingNumber(plan.subscribers),
    accessorKey: "subscribers",
    className: "font-medium",
  },
  {
    id: "revenue",
    header: "Revenue",
    align: "right",
    sortable: true,
    sortAccessor: (plan) => extractCurrencyValue(plan.revenue),
    accessorKey: "revenue",
    className: "font-medium",
  },
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
  title = "Plan catalog",
  description = "Use this catalog to scan pricing, branch coverage, subscriber load, and current plan status without opening a separate detail workspace.",
  searchPlaceholder = "Search plans",
  tableCaption,
  className,
}: PlanListTableProps) {
  return (
    <CustomTable
      title={title}
      description={description}
      data={plans}
      columns={planColumns}
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
        `${title}. Directory of pricing products, access scope, subscriber coverage, revenue contribution, and plan status.`
      }
      headerAction={<TableControlButton variant="primary">Create plan</TableControlButton>}
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
