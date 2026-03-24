"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import type { EmployeeRow } from "./data";
import { EmployeeIdentity, StaffMobileCard } from "./molecules";

function EmployeeToolbarActions() {
  return (
    <>
      <TableControlButton>Export</TableControlButton>
      <TableControlButton>
        Filter by
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

type EmployeeListTableProps = {
  employees: EmployeeRow[];
  onDeactivate?: (employee: EmployeeRow) => void;
  onReactivate?: (employee: EmployeeRow) => void;
  onResendInvite?: (employee: EmployeeRow) => void;
};

export function EmployeeListTable({
  employees,
  onDeactivate,
  onReactivate,
  onResendInvite,
}: EmployeeListTableProps) {
  const router = useRouter();

  const employeeColumns = useMemo<CustomTableColumn<EmployeeRow>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (employee) => employee.name,
        cell: (employee) => <EmployeeIdentity employee={employee} />,
      },
      {
        id: "employeeCode",
        header: "Employee code",
        accessorKey: "employeeCode",
        sortable: true,
      },
      {
        id: "role",
        header: "Role",
        accessorKey: "role",
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
        sortAccessor: (employee) => employee.status,
        cell: (employee) => <StatusBadge label={employee.status} tone={employee.tone} />,
      },
    ],
    [],
  );

  const rowActions = useMemo<CustomTableAction<EmployeeRow>[]>(
    () => [
      {
        label: "Edit employee",
        onSelect: (employee) => {
          router.push(`/staff-roles/employees/${employee.id}/edit`);
        },
      },
      {
        label: "Resend invite",
        hidden: (employee) => employee.status !== "Invited",
        onSelect: (employee) => onResendInvite?.(employee),
      },
      {
        label: "Deactivate employee",
        tone: "danger",
        hidden: (employee) => employee.status === "Deactivated",
        onSelect: (employee) => onDeactivate?.(employee),
      },
      {
        label: "Reactivate employee",
        hidden: (employee) => employee.status === "Active",
        onSelect: (employee) => onReactivate?.(employee),
      },
    ],
    [onDeactivate, onReactivate, onResendInvite, router],
  );

  return (
    <CustomTable
      title="Employees"
      description="Directory of staff records, access roles, branch assignment, and current employment state."
      data={employees}
      columns={employeeColumns}
      rowActions={rowActions}
      getRowId={(employee) => employee.id}
      getRowLabel={(employee) => employee.name}
      getSearchText={(employee) =>
        [
          employee.name,
          employee.employeeCode,
          employee.role,
          employee.team,
          employee.branch,
          employee.email,
          employee.phone,
          employee.status,
        ].join(" ")
      }
      searchPlaceholder="Search employees"
      headerAction={
        <Link href="/staff-roles/employees/new" className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover">
          Add employee
        </Link>
      }
      toolbarActions={<EmployeeToolbarActions />}
      renderMobileCard={(employee, { actionsMenu }) => (
        <StaffMobileCard
          title={employee.name}
          subtitle={`${employee.role} · ${employee.branch}`}
          status={{ label: employee.status, tone: employee.tone }}
          metadata={[
            { label: "Code", value: employee.employeeCode },
            { label: "Team", value: employee.team },
            { label: "Branch", value: employee.branch },
          ]}
          actionsMenu={actionsMenu}
        />
      )}
      emptyStateTitle="No employees found"
      emptyStateDescription="Add an employee or adjust your search to populate this staff directory."
      itemLabel="employees"
      initialPageSize={5}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}
