"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import type { Branch } from "../types";
import { BranchIdentity } from "../molecules/branchIdentity";
import { BranchMobileCard } from "../molecules/branchMobileCard";

type BranchListTableProps = {
  branches: Branch[];
  onDeactivate?: (branchId: string) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

const branchColumns: CustomTableColumn<Branch>[] = [
  {
    id: "name",
    header: "Branch Name",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (branch) => branch.name,
    cell: (branch) => <BranchIdentity branch={branch} />,
  },
  {
    id: "address",
    header: "Address",
    accessorKey: "address",
    sortable: true,
    className: "leading-[1.6] text-text-secondary",
  },
  {
    id: "manager",
    header: "Manager",
    accessorKey: "manager",
    sortable: true,
  },
  {
    id: "members",
    header: "Members",
    align: "right",
    accessorFn: (branch) => branch.members.toLocaleString(),
    sortAccessor: (branch) => branch.members,
    sortable: true,
    className: "font-medium",
  },
  {
    id: "staffCount",
    header: "Staff",
    align: "right",
    accessorFn: (branch) => branch.staffCount,
    sortable: true,
    className: "font-medium",
  },
  {
    id: "activePlans",
    header: "Plans",
    align: "right",
    accessorFn: (branch) => branch.activePlans,
    sortable: true,
    className: "font-medium",
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (branch) => branch.status,
    accessorKey: "status",
    cell: (branch) => <StatusBadge label={branch.status} tone={branch.tone} />,
  },
];

function BranchToolbarActions() {
  return (
    <>
      <TableControlButton>Export Data</TableControlButton>
      <TableControlButton>
        Filter By
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

export function BranchListTable({
  branches,
  onDeactivate,
  title = "Branch list",
  searchPlaceholder = "Search branches",
  tableCaption,
  className,
}: BranchListTableProps) {
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);

  const branchActions = useMemo<CustomTableAction<Branch>[]>(
    () => [
      {
        label: "View details",
        onSelect: (branch) => router.push(`/branches/${branch.id}`),
      },
      {
        label: "Edit",
        onSelect: (branch) => router.push(`/branches/${branch.id}/edit`),
      },
      {
        label: "Deactivate",
        tone: "danger",
        hidden: (branch) => branch.status === "Inactive",
        onSelect: (branch) =>
          openModal("deactivateBranch", {
            branchName: branch.name,
            onConfirm: () => {
              onDeactivate?.(branch.id);
            },
          }),
      },
    ],
    [onDeactivate, openModal, router],
  );

  return (
    <CustomTable
      title={title}
      data={branches}
      columns={branchColumns}
      rowActions={branchActions}
      getRowId={(branch) => branch.id}
      getRowLabel={(branch) => branch.name}
      getSearchText={(branch) =>
        [
          branch.name,
          branch.address,
          branch.manager,
          branch.phone,
          branch.email,
          branch.status,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of branch addresses, managers, member counts, staffing levels, plans, and operational status.`
      }
      headerAction={
        <Link
          href="/branches/new"
          className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
        >
          Add branch
        </Link>
      }
      toolbarActions={<BranchToolbarActions />}
      renderMobileCard={(branch, { actionsMenu }) => (
        <BranchMobileCard branch={branch} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No branches found"
      emptyStateDescription="Add a branch or adjust your search to populate this directory."
      itemLabel="branches"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
