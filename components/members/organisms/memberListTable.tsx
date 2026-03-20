"use client";

import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import type { MemberRow, MemberStatus } from "../data";
import { MemberIdentity } from "../molecules/memberIdentity";
import { MemberMobileCard } from "../molecules/memberMobileCard";

type MemberListTableProps = {
  members: MemberRow[];
  onUpdateStatus?: (memberId: string, status: MemberStatus) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

const memberColumns: CustomTableColumn<MemberRow>[] = [
  {
    id: "member",
    header: "Member",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (member) => member.name,
    cell: (member) => <MemberIdentity member={member} />,
  },
  {
    id: "contact",
    header: "Contact",
    sortable: true,
    sortAccessor: (member) => member.email,
    cell: (member) => (
      <div className="space-y-1 text-[13px] leading-[1.5] text-text-secondary">
        <p>{member.email}</p>
        <p>{member.phone}</p>
      </div>
    ),
    className: "align-top",
  },
  {
    id: "plan",
    header: "Plan",
    sortable: true,
    sortAccessor: (member) => member.plan,
    cell: (member) => (
      <div>
        <p className="font-medium text-text-primary">{member.plan}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{member.branch}</p>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (member) => member.status,
    cell: (member) => <StatusBadge label={member.status} tone={member.tone} />,
  },
  {
    id: "classesBooked",
    header: "Classes",
    align: "right",
    accessorFn: (member) => member.classesBooked,
    sortable: true,
    className: "font-medium",
  },
  {
    id: "lastVisit",
    header: "Last Visit",
    accessorKey: "lastVisit",
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
];

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
  onUpdateStatus,
  title = "Member roster",
  description = "Use this roster to scan membership health, class demand, renewal risk, and last-visit activity without leaving the list.",
  searchPlaceholder = "Search members",
  tableCaption,
  className,
}: MemberListTableProps) {
  const rowActions: CustomTableAction<MemberRow>[] | undefined = onUpdateStatus
    ? [
        {
          label: "Renew membership",
          hidden: (member) => member.status !== "Expiring",
          onSelect: (member) => onUpdateStatus(member.id, "Active"),
        },
        {
          label: "Resume membership",
          hidden: (member) => member.status !== "Paused",
          onSelect: (member) => onUpdateStatus(member.id, "Active"),
        },
        {
          label: "Restore access",
          hidden: (member) => member.status !== "Suspended",
          onSelect: (member) => onUpdateStatus(member.id, "Active"),
        },
        {
          label: "Pause membership",
          hidden: (member) => member.status === "Paused",
          onSelect: (member) => onUpdateStatus(member.id, "Paused"),
        },
        {
          label: "Suspend access",
          tone: "danger",
          hidden: (member) => member.status === "Suspended",
          onSelect: (member) => onUpdateStatus(member.id, "Suspended"),
        },
      ]
    : undefined;

  return (
    <CustomTable
      title={title}
      description={description}
      data={members}
      columns={memberColumns}
      rowActions={rowActions}
      getRowId={(member) => member.id}
      getRowLabel={(member) => member.name}
      getSearchText={(member) =>
        [
          member.id,
          member.name,
          member.email,
          member.phone,
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
        `${title}. Directory of member identity, contact details, plans, status, class bookings, visits, and expiry dates.`
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
        <MemberMobileCard member={member} actionsMenu={actionsMenu} />
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
