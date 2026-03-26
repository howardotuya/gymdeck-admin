"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SetupTopbar, StatusBadge } from "@/components/ui";
import {
  getModulePermissionIds,
  permissionModules,
  type RoleDetailRecord,
} from "./data";
import { EmployeeListTable } from "./employeeListTable";
import { PermissionsSetupStep } from "./role-form";

type RoleDetailPageProps = {
  detail: RoleDetailRecord;
};

type RoleDetailTab = "employees" | "permissions";

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>
      <div className="mt-2 text-[15px] leading-[1.6] text-text-primary">
        {value}
      </div>
    </div>
  );
}

function DetailTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${
        active
          ? "border-text-brand text-text-brand"
          : "border-transparent text-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}

export function RoleDetailPage({ detail }: RoleDetailPageProps) {
  const [activeTab, setActiveTab] = useState<RoleDetailTab>("employees");
  const [activeModuleId, setActiveModuleId] = useState(
    detail.permissionModules[0]?.id ?? "",
  );
  const [permissionSearch, setPermissionSearch] = useState("");
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { role, employees, permissionCount } = detail;
  const totalPermissionCount = useMemo(
    () =>
      permissionModules.reduce(
        (total, module) => total + getModulePermissionIds(module).length,
        0,
      ),
    [],
  );
  const visibleBranches = showAllBranches
    ? role.selectedBranches
    : role.selectedBranches.slice(0, 3);
  const hiddenBranchCount = Math.max(role.selectedBranches.length - 3, 0);
  const shouldCollapseBranches = role.selectedBranches.length > 3;
  const collapsedDescription =
    role.description.length > 180
      ? `${role.description.slice(0, 180).trimEnd()}...`
      : role.description;
  const shouldCollapseDescription = role.description.length > 180;

  const summaryItems = useMemo(
    () => [
      { label: "Team", value: role.team },
      { label: "Role name", value: role.name },
      {
        label: "Employees assigned",
        value: role.employeeCount.toLocaleString(),
      },
      { label: "Date created", value: role.createdAt },
    ],
    [role],
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          backHref="/staff-roles?tab=roles"
          backLabel="Back to roles"
          showCancel={false}
          showProceed={false}
        />
      </div>

      <div className="mx-auto w-full max-w-[1120px] space-y-6">
        <section className="rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
              Role details
            </p>
            <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
              {role.name}
            </h3>
          </div>

          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
            {summaryItems.map((item) => (
              <DetailRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
            <DetailRow
              label="Status"
              value={<StatusBadge label={role.status} tone={role.tone} />}
            />
            <div className="md:col-span-2 xl:col-span-3">
              <DetailRow
                label="Branch scope"
                value={
                  <div className="space-y-2">
                    <p className="text-[15px] leading-[1.8] text-text-primary">
                      {visibleBranches.join(", ")}
                      {!showAllBranches && hiddenBranchCount > 0
                        ? ` +${hiddenBranchCount} other${
                            hiddenBranchCount === 1 ? "" : "s"
                          }`
                        : ""}
                    </p>
                    {shouldCollapseBranches ? (
                      <button
                        type="button"
                        onClick={() =>
                          setShowAllBranches((current) => !current)
                        }
                        className="text-[13px] font-semibold text-text-brand transition-colors hover:text-text-primary"
                      >
                        {showAllBranches ? "Show less" : "Show more"}
                      </button>
                    ) : null}
                  </div>
                }
              />
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <DetailRow
                label="Role description"
                value={
                  <div className="space-y-2">
                    <p className="max-w-[880px] text-[15px] leading-[1.8] text-text-primary">
                      {showFullDescription || !shouldCollapseDescription
                        ? role.description
                        : collapsedDescription}
                    </p>
                    {shouldCollapseDescription ? (
                      <button
                        type="button"
                        onClick={() =>
                          setShowFullDescription((current) => !current)
                        }
                        className="text-[13px] font-semibold text-text-brand transition-colors hover:text-text-primary"
                      >
                        {showFullDescription ? "Show less" : "Show more"}
                      </button>
                    ) : null}
                  </div>
                }
              />
            </div>
          </div>
        </section>

        <div className="border-b border-border-soft">
          <div className="flex items-center gap-2 overflow-x-auto">
            <DetailTabButton
              label="Employees"
              active={activeTab === "employees"}
              onClick={() => setActiveTab("employees")}
            />
            <DetailTabButton
              label="Permissions"
              active={activeTab === "permissions"}
              onClick={() => setActiveTab("permissions")}
            />
          </div>
        </div>

        {activeTab === "employees" ? (
          <EmployeeListTable
            employees={employees}
            title={null}
            description={null}
            headerAction={null}
            toolbarActions={null}
            searchPlaceholder="Search employees on this role"
          />
        ) : (
          <div className="space-y-4">
            <section className="rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                Permissions
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
                {permissionCount.toLocaleString()}/
                {totalPermissionCount.toLocaleString()} permissions enabled
              </h3>
            </section>

            <PermissionsSetupStep
              activeModuleId={activeModuleId}
              permissionSearch={permissionSearch}
              permissions={role.permissions}
              readOnly
              onPermissionSearchChange={setPermissionSearch}
              onSelectModule={setActiveModuleId}
              onToggleModule={() => {}}
              onToggleSubmodule={() => {}}
              onTogglePermission={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
