"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { styles } from "@/constants";
import { NavTabs, OverviewCard } from "@/components/ui";
import {
  employees,
  getEmployeeOverview,
  getRoleOverview,
  getStaffTab,
  roles,
  staffTabs,
  type EmployeeRow,
  type RoleRow,
} from "./data";
import { EmployeeListTable } from "./employeeListTable";
import { RoleListTable } from "./roleListTable";

function duplicateRole(role: RoleRow): RoleRow {
  return {
    ...role,
    id: `${role.id}-copy`,
    name: `${role.name} copy`,
    employeeCount: 0,
    createdAt: "Today",
    status: "Active",
    tone: "success",
  };
}

export function StaffRolesPage({
  activeTabParam,
}: {
  activeTabParam?: string | null;
}) {
  const activeTab = getStaffTab(activeTabParam);
  const tabs = staffTabs.map((tab) => ({
    href: tab.id === "employees" ? "/staff-roles" : `/staff-roles?tab=${tab.id}`,
    label: tab.label,
    active: tab.id === activeTab,
  }));

  const [employeeRows, setEmployeeRows] = useState<EmployeeRow[]>(employees);
  const [roleRows, setRoleRows] = useState<RoleRow[]>(roles);
  const overviewCards = useMemo(
    () => (activeTab === "employees" ? getEmployeeOverview(employeeRows) : getRoleOverview(roleRows)),
    [activeTab, employeeRows, roleRows],
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <NavTabs
        tabs={tabs}
        ariaLabel="Staff tabs"
        className={clsx(
          styles.APP_XSPACING,
          styles.NEGATIVE_APP_XSPACING,
          styles.NEGATIVE_APP_YTSPACING,
        )}
      />

      <section className={clsx("grid gap-4", activeTab === "employees" ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2")}>
        {overviewCards.map((item) => (
          <OverviewCard key={item.label} label={item.label} value={item.value} size="hero" />
        ))}
      </section>

      {activeTab === "employees" ? (
        <EmployeeListTable
          employees={employeeRows}
          onDeactivate={(employee) => {
            setEmployeeRows((currentRows) =>
              currentRows.map((row) =>
                row.id === employee.id
                  ? {
                      ...row,
                      status: "Deactivated",
                      tone: "neutral",
                    }
                  : row,
              ),
            );
          }}
          onReactivate={(employee) => {
            setEmployeeRows((currentRows) =>
              currentRows.map((row) =>
                row.id === employee.id
                  ? {
                      ...row,
                      status: "Active",
                      tone: "success",
                    }
                  : row,
              ),
            );
          }}
          onResendInvite={(employee) => {
            setEmployeeRows((currentRows) =>
              currentRows.map((row) =>
                row.id === employee.id
                  ? {
                      ...row,
                      email: row.email,
                    }
                  : row,
              ),
            );
          }}
        />
      ) : (
        <RoleListTable
          roles={roleRows}
          onDuplicate={(role) => {
            setRoleRows((currentRows) => [duplicateRole(role), ...currentRows]);
          }}
          onDeactivate={(role) => {
            setRoleRows((currentRows) =>
              currentRows.map((row) =>
                row.id === role.id
                  ? {
                      ...row,
                      status: "Inactive",
                      tone: "neutral",
                    }
                  : row,
              ),
            );
          }}
          onReactivate={(role) => {
            setRoleRows((currentRows) =>
              currentRows.map((row) =>
                row.id === role.id
                  ? {
                      ...row,
                      status: "Active",
                      tone: "success",
                    }
                  : row,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
