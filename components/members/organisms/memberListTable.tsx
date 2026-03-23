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
import type { MemberRow } from "../data";
import { MemberIdentity } from "../molecules/memberIdentity";
import { MemberMobileCard } from "../molecules/memberMobileCard";

type MemberListTableProps = {
  members: MemberRow[];
  onViewMember?: (member: MemberRow) => void;
  onDeactivateMember?: (member: MemberRow) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

function MemberToolbarActions() {
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

export function MemberListTable({
  members,
  onViewMember,
  onDeactivateMember,
  title = "Member roster",
  description,
  searchPlaceholder = "Search members",
  tableCaption,
  className,
}: MemberListTableProps) {
  const memberColumns = useMemo<CustomTableColumn<MemberRow>[]>(
    () => [
      {
        id: "member",
        header: "Name",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (member) => member.name,
        cell: (member) => <MemberIdentity member={member} />,
      },
      {
        id: "plan",
        header: "Plan",
        accessorKey: "plan",
        sortable: true,
      },
      {
        id: "branch",
        header: "Branch",
        accessorKey: "branch",
        sortable: true,
        className: "text-text-secondary",
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortAccessor: (member) => member.status,
        cell: (member) => <StatusBadge label={member.status} tone={member.tone} />,
      },
      {
        id: "lastVisit",
        header: "Last Visit",
        accessorKey: "lastVisit",
        sortable: true,
        className: "text-text-secondary",
      },
      {
        id: "expiryDate",
        header: "Expiry Date",
        sortable: true,
        sortAccessor: (member) => new Date(member.expiryDate),
        accessorKey: "expiryDate",
        className: "text-text-secondary",
      },
    ],
    [],
  );

  const memberActions = useMemo<CustomTableAction<MemberRow>[]>(
    () => [
      {
        label: "View details",
        onSelect: (member) => onViewMember?.(member),
      },
      {
        label: "Deactivate member",
        tone: "danger",
        hidden: (member) => member.status === "Inactive",
        onSelect: (member) => onDeactivateMember?.(member),
      },
    ],
    [onDeactivateMember, onViewMember],
  );

  return (
    <CustomTable
      title={title}
      description={description}
      data={members}
      columns={memberColumns}
      rowActions={memberActions}
      getRowId={(member) => member.id}
      getRowLabel={(member) => member.name}
      getSearchText={(member) =>
        [
          member.id,
          member.name,
          member.email,
          member.plan,
          member.branch,
          member.status,
          member.lastVisit,
          member.expiryDate,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of member names, plans, branches, status, last visits, expiry dates, and member actions.`
      }
      headerAction={
        <button
          type="button"
          className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
        >
          Add member
        </button>
      }
      toolbarActions={<MemberToolbarActions />}
      renderMobileCard={(member, { actionsMenu }) => (
        <MemberMobileCard
          member={member}
          actionsMenu={actionsMenu}
        />
      )}
      emptyStateTitle="No members found"
      emptyStateDescription="Add a member or adjust your search to populate this roster."
      itemLabel="members"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
