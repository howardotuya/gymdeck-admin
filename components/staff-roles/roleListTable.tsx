"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  CustomTable,
  StatusBadge,
  type CustomTableAction,
  type CustomTableColumn,
  type CustomTableFilterField,
} from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import type { RoleRow } from "./data";
import { RoleNameCell, StaffMobileCard } from "./molecules";

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
  const router = useRouter();
  const openModal = useModalStore((state) => state.openModal);
  const roleColumns = useMemo<CustomTableColumn<RoleRow>[]>(
    () => [
      {
        id: "name",
        header: "Role name",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (role) => role.name,
        exportAccessor: (role) => role.name,
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
  const filterFields = useMemo<CustomTableFilterField<RoleRow>[]>(
    () => [
      {
        id: "status",
        type: "select",
        label: "Status",
        options: Array.from(new Set(roles.map((role) => role.status)))
          .sort((left, right) => left.localeCompare(right))
          .map((status) => ({
            label: status,
            value: status,
          })),
        placeholder: "Select role status",
      },
      {
        id: "branchScopeLabel",
        type: "select",
        label: "Branch scope",
        options: Array.from(new Set(roles.map((role) => role.branchScopeLabel)))
          .sort((left, right) => left.localeCompare(right))
          .map((branchScope) => ({
            label: branchScope,
            value: branchScope,
          })),
        placeholder: "Select branch scope",
      },
    ],
    [roles],
  );

  const rowActions = useMemo<CustomTableAction<RoleRow>[]>(
    () => [
      {
        label: "View details",
        onSelect: (role) => {
          router.push(`/staff-roles/roles/${role.id}`);
        },
      },
      {
        label: "Edit role",
        onSelect: (role) => {
          router.push(`/staff-roles/roles/${role.id}/edit`);
        },
      },
      {
        label: "Duplicate role",
        onSelect: (role) => onDuplicate?.(role),
      },
      {
        label: "Deactivate role",
        tone: "danger",
        hidden: (role) => role.status === "Inactive",
        onSelect: (role) =>
          openModal("deactivateRole", {
            role,
            onConfirm: () => onDeactivate?.(role),
          }),
      },
      {
        label: "Reactivate role",
        hidden: (role) => role.status === "Active",
        onSelect: (role) => onReactivate?.(role),
      },
    ],
    [onDeactivate, onDuplicate, onReactivate, openModal, router],
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
      filterFields={filterFields}
      exportDataBtn
      exportFileName="role-directory"
      queryParamPrefix="roles"
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
