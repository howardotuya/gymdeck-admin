"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import type { RoleRow } from "./data";
import { RoleNameCell, StaffMobileCard } from "./molecules";

function RoleToolbarActions() {
  return (
    <>
      <TableControlButton>
        Filter by
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

type RoleListTableProps = {
  roles: RoleRow[];
  onDuplicate?: (role: RoleRow) => void;
  onDeactivate?: (role: RoleRow) => void;
  onReactivate?: (role: RoleRow) => void;
};

export function RoleListTable({
  roles,
  onDeactivate,
  onDuplicate,
  onReactivate,
}: RoleListTableProps) {
  const roleColumns = useMemo<CustomTableColumn<RoleRow>[]>(
    () => [
      {
        id: "name",
        header: "Role name",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (role) => role.name,
        cell: (role) => <RoleNameCell role={role} />,
      },
      {
        id: "branchScope",
        header: "Branch scope",
        accessorKey: "branchScopeLabel",
        sortable: true,
      },
      {
        id: "employeeCount",
        header: "Employees",
        accessorKey: "employeeCount",
        sortable: true,
      },
      {
        id: "createdAt",
        header: "Date created",
        accessorKey: "createdAt",
        sortable: true,
        className: "text-text-secondary",
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortAccessor: (role) => role.status,
        cell: (role) => <StatusBadge label={role.status} tone={role.tone} />,
      },
    ],
    [],
  );

  const rowActions = useMemo<CustomTableAction<RoleRow>[]>(
    () => [
      {
        label: "Edit role",
      },
      {
        label: "Duplicate role",
        onSelect: (role) => onDuplicate?.(role),
      },
      {
        label: "Deactivate role",
        tone: "danger",
        hidden: (role) => role.status === "Inactive",
        onSelect: (role) => onDeactivate?.(role),
      },
      {
        label: "Reactivate role",
        hidden: (role) => role.status === "Active",
        onSelect: (role) => onReactivate?.(role),
      },
    ],
    [onDeactivate, onDuplicate, onReactivate],
  );

  return (
    <CustomTable
      title="Roles"
      description="Reusable permission bundles with branch-aware access and clear employee coverage."
      data={roles}
      columns={roleColumns}
      rowActions={rowActions}
      getRowId={(role) => role.id}
      getRowLabel={(role) => role.name}
      getSearchText={(role) =>
        [role.name, role.team, role.branchScopeLabel, role.createdAt, role.status].join(" ")
      }
      searchPlaceholder="Search roles"
      headerAction={
        <Link href="/staff-roles/roles/new" className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover">
          Add new role
        </Link>
      }
      toolbarActions={<RoleToolbarActions />}
      renderMobileCard={(role, { actionsMenu }) => (
        <StaffMobileCard
          title={role.name}
          subtitle={role.branchScopeLabel}
          status={{ label: role.status, tone: role.tone }}
          metadata={[
            { label: "Employees", value: role.employeeCount.toLocaleString() },
            { label: "Created", value: role.createdAt },
          ]}
          actionsMenu={actionsMenu}
        />
      )}
      emptyStateTitle="No roles found"
      emptyStateDescription="Create a role to assign branch-scoped access and permission coverage."
      itemLabel="roles"
      initialPageSize={5}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}
