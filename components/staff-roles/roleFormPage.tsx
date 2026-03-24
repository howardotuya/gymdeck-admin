"use client";

import clsx from "clsx";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormSectionCard, Panel, SetupStepper, SetupTopbar } from "@/components/ui";
import {
  branchOptions,
  createRoleFormState,
  permissionModules,
  reportToOptions,
  teamOptions,
  type BranchScope,
  type RoleFormState,
} from "./data";
import {
  Field,
  SelectionPill,
  inputClassName,
  secondaryActionClassName,
  textAreaClassName,
} from "./shared";

const roleCreationSteps = [
  { id: "role-setup", label: "Role setup" },
  { id: "permissions-setup", label: "Permissions setup" },
] as const;

type RoleStepId = (typeof roleCreationSteps)[number]["id"];

const branchScopeOptions: BranchScope[] = [
  "All branches",
  "Selected branches",
  "Primary branch only",
];

export function RoleFormPage() {
  const router = useRouter();
  const [activeStepId, setActiveStepId] = useState<RoleStepId>("role-setup");
  const [formState, setFormState] = useState<RoleFormState>(() => createRoleFormState());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const activeStepIndex = roleCreationSteps.findIndex((step) => step.id === activeStepId);

  const updateField = <TKey extends keyof RoleFormState>(
    key: TKey,
    value: RoleFormState[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const selectedPermissionCount = useMemo(
    () =>
      Object.values(formState.permissions).reduce(
        (total, actions) => total + actions.length,
        0,
      ),
    [formState.permissions],
  );

  const toggleBranch = (branch: string) => {
    setFormState((currentState) => ({
      ...currentState,
      selectedBranches: currentState.selectedBranches.includes(branch)
        ? currentState.selectedBranches.filter((item) => item !== branch)
        : [...currentState.selectedBranches, branch],
    }));
  };

  const togglePermission = (moduleId: string, action: string) => {
    setFormState((currentState) => {
      const currentActions = currentState.permissions[moduleId] ?? [];
      const nextActions = currentActions.includes(action)
        ? currentActions.filter((item) => item !== action)
        : [...currentActions, action];

      return {
        ...currentState,
        permissions: {
          ...currentState.permissions,
          [moduleId]: nextActions,
        },
      };
    });
  };

  const toggleModulePermissions = (moduleId: string, nextChecked: boolean) => {
    const moduleDefinition = permissionModules.find((item) => item.id === moduleId);

    if (!moduleDefinition) {
      return;
    }

    setFormState((currentState) => ({
      ...currentState,
      permissions: {
        ...currentState.permissions,
        [moduleId]: nextChecked ? [...moduleDefinition.actions] : [],
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(
      `${formState.name || "New role"} is ready with ${selectedPermissionCount.toLocaleString()} permission selections.`,
    );
  };

  const handleProceed = () => {
    if (activeStepIndex < roleCreationSteps.length - 1) {
      setActiveStepId(roleCreationSteps[activeStepIndex + 1].id);
      return;
    }

    const formElement = document.getElementById("role-form") as HTMLFormElement | null;
    formElement?.requestSubmit();
  };

  const handleBack = () => {
    if (activeStepIndex > 0) {
      setActiveStepId(roleCreationSteps[activeStepIndex - 1].id);
      return;
    }

    router.push("/staff-roles?tab=roles");
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          backHref="/staff-roles?tab=roles"
          cancelHref="/staff-roles?tab=roles"
          backLabel={activeStepId === "role-setup" ? "Back to roles" : "Back"}
          proceedLabel={activeStepId === "permissions-setup" ? "Create role" : "Continue"}
          onBack={handleBack}
          onProceed={handleProceed}
        />
        <SetupStepper
          steps={roleCreationSteps}
          activeStepId={activeStepId}
          onStepClick={(stepId) => setActiveStepId(stepId as RoleStepId)}
          ariaLabel="Role creation steps"
        />
      </div>

      {feedbackMessage ? (
        <div className="rounded-[24px] border border-border-brand bg-bg-brand-soft/55 px-5 py-4">
          <p className="text-[14px] leading-[1.65] text-text-primary">{feedbackMessage}</p>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <form id="role-form" onSubmit={handleSubmit} className="space-y-4">
          {activeStepId === "role-setup" ? (
            <FormSectionCard
              title="Role setup"
              description="Define the role structure first, including branch access model, so permission decisions stay grounded in the actual operating context."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="role-name" label="Role name" required>
                  <input
                    id="role-name"
                    value={formState.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={inputClassName}
                    placeholder="Branch Manager"
                  />
                </Field>

                <Field id="team" label="Team" required>
                  <select
                    id="team"
                    value={formState.team}
                    onChange={(event) => updateField("team", event.target.value)}
                    className={inputClassName}
                  >
                    {teamOptions.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field id="description" label="Role description">
                    <textarea
                      id="description"
                      value={formState.description}
                      onChange={(event) => updateField("description", event.target.value)}
                      className={textAreaClassName}
                      placeholder="Describe how this role operates across branches and who it supports."
                    />
                  </Field>
                </div>

                <Field id="reports-to" label="Reports to">
                  <select
                    id="reports-to"
                    value={formState.reportsTo}
                    onChange={(event) => updateField("reportsTo", event.target.value)}
                    className={inputClassName}
                  >
                    {reportToOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="primary-branch" label="Primary branch">
                  <select
                    id="primary-branch"
                    value={formState.primaryBranch}
                    onChange={(event) => updateField("primaryBranch", event.target.value)}
                    className={inputClassName}
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <div className="space-y-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                      Branch scope
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {branchScopeOptions.map((option) => (
                        <SelectionPill
                          key={option}
                          checked={formState.branchScope === option}
                          label={option}
                          onToggle={() => updateField("branchScope", option)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {formState.branchScope === "Selected branches" ? (
                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Assign branches
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {branchOptions.map((branch) => {
                          const checked = formState.selectedBranches.includes(branch);

                          return (
                            <label
                              key={branch}
                              className={clsx(
                                "flex items-center gap-3 rounded-[18px] border px-4 py-4 transition-colors",
                                checked
                                  ? "border-border-brand bg-bg-brand-soft/45"
                                  : "border-border-soft bg-bg-surface hover:border-border-strong",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleBranch(branch)}
                                className="h-4 w-4 rounded border border-border-strong"
                              />
                              <span className="text-[14px] font-medium text-text-primary">
                                {branch}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </FormSectionCard>
          ) : (
            <div className="space-y-4">
              {permissionModules.map((module) => {
                const selectedActions = formState.permissions[module.id] ?? [];
                const allSelected = selectedActions.length === module.actions.length;

                return (
                  <FormSectionCard
                    key={module.id}
                    title={module.label}
                    description="Keep module access explicit and scoped to meaningful actions."
                    action={
                      <button
                        type="button"
                        onClick={() => toggleModulePermissions(module.id, !allSelected)}
                        className={secondaryActionClassName}
                      >
                        {allSelected ? "Clear all" : "Select all"}
                      </button>
                    }
                  >
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {module.actions.map((action) => {
                        const checked = selectedActions.includes(action);

                        return (
                          <label
                            key={action}
                            className={clsx(
                              "flex items-center gap-3 rounded-[18px] border px-4 py-4 transition-colors",
                              checked
                                ? "border-border-brand bg-bg-brand-soft/45"
                                : "border-border-soft bg-bg-surface hover:border-border-strong",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(module.id, action)}
                              className="h-4 w-4 rounded border border-border-strong"
                            />
                            <span className="text-[14px] font-medium text-text-primary">{action}</span>
                          </label>
                        );
                      })}
                    </div>
                  </FormSectionCard>
                );
              })}
            </div>
          )}
        </form>

        <div className="space-y-4">
          <Panel
            eyebrow="Preview"
            title="Role summary"
            description="Carry the structural context forward while permissions are being configured."
          >
            <div className="space-y-3">
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Role
                </p>
                <p className="mt-2 text-[18px] font-semibold text-text-primary">
                  {formState.name || "New role"}
                </p>
              </div>
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Branch scope
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {formState.branchScope}
                </p>
              </div>
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Permission count
                </p>
                <p className="mt-2 text-[16px] font-semibold text-text-primary">
                  {selectedPermissionCount.toLocaleString()}
                </p>
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="Guidance"
            title="Role creation notes"
            description="Keep branch setup and permissions separate so the user is making one type of decision at a time."
          >
            <div className="space-y-3">
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4 text-[14px] leading-[1.65] text-text-secondary">
                Step 1 owns branch assignment. Employees should inherit branch-aware access from the role.
              </div>
              <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4 text-[14px] leading-[1.65] text-text-secondary">
                Step 2 groups permissions by module so the matrix stays readable and scalable.
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
