"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SetupStepper, SetupTopbar } from "@/components/ui";
import {
  createRoleFormState,
  getModulePermissionIds,
  permissionModules,
  type RoleRecord,
  type RoleFormState,
} from "./data";
import { PermissionsSetupStep, RoleSetupStep } from "./role-form";

const roleCreationSteps = [
  { id: "role-setup", label: "Role setup" },
  { id: "permissions-setup", label: "Permissions setup" },
] as const;

type RoleStepId = (typeof roleCreationSteps)[number]["id"];

type RoleFormPageProps = {
  mode?: "create" | "edit";
  role?: RoleRecord;
};

function getModuleById(moduleId: string) {
  return permissionModules.find((module) => module.id === moduleId);
}

export function RoleFormPage({
  mode = "create",
  role,
}: RoleFormPageProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const [activeStepId, setActiveStepId] = useState<RoleStepId>("role-setup");
  const [activeModuleId, setActiveModuleId] = useState(permissionModules[0]?.id ?? "");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [formState, setFormState] = useState<RoleFormState>(() =>
    createRoleFormState(role),
  );
  const activeStepIndex = roleCreationSteps.findIndex((step) => step.id === activeStepId);

  const selectedPermissionCount = useMemo(
    () =>
      Object.values(formState.permissions).reduce(
        (total, actions) => total + actions.length,
        0,
      ),
    [formState.permissions],
  );

  const updateField = <TKey extends keyof RoleFormState>(
    key: TKey,
    value: RoleFormState[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const getOrderedModuleSelections = (
    moduleId: string,
    selectedPermissionIds: Set<string>,
  ) => {
    const moduleDefinition = getModuleById(moduleId);

    if (!moduleDefinition) {
      return [];
    }

    return getModulePermissionIds(moduleDefinition).filter((permissionId) =>
      selectedPermissionIds.has(permissionId),
    );
  };

  const togglePermission = (moduleId: string, permissionId: string) => {
    setFormState((currentState) => {
      const nextSelectedPermissions = new Set(
        currentState.permissions[moduleId] ?? [],
      );

      if (nextSelectedPermissions.has(permissionId)) {
        nextSelectedPermissions.delete(permissionId);
      } else {
        nextSelectedPermissions.add(permissionId);
      }

      return {
        ...currentState,
        permissions: {
          ...currentState.permissions,
          [moduleId]: getOrderedModuleSelections(
            moduleId,
            nextSelectedPermissions,
          ),
        },
      };
    });
  };

  const toggleSubmodulePermissions = (
    moduleId: string,
    permissionIds: string[],
    nextChecked: boolean,
  ) => {
    setFormState((currentState) => {
      const nextSelectedPermissions = new Set(
        currentState.permissions[moduleId] ?? [],
      );

      permissionIds.forEach((permissionId) => {
        if (nextChecked) {
          nextSelectedPermissions.add(permissionId);
        } else {
          nextSelectedPermissions.delete(permissionId);
        }
      });

      return {
        ...currentState,
        permissions: {
          ...currentState.permissions,
          [moduleId]: getOrderedModuleSelections(
            moduleId,
            nextSelectedPermissions,
          ),
        },
      };
    });
  };

  const toggleModulePermissions = (moduleId: string, nextChecked: boolean) => {
    const moduleDefinition = getModuleById(moduleId);

    if (!moduleDefinition) {
      return;
    }

    setFormState((currentState) => ({
      ...currentState,
      permissions: {
        ...currentState.permissions,
        [moduleId]: nextChecked ? getModulePermissionIds(moduleDefinition) : [],
      },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(
      isEditMode
        ? `${formState.name || role?.name || "Role"} changes are ready with ${selectedPermissionCount.toLocaleString()} permission selections.`
        : `${formState.name || "New role"} is ready with ${selectedPermissionCount.toLocaleString()} permission selections.`,
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
          proceedLabel={
            activeStepId === "permissions-setup"
              ? isEditMode
                ? "Save changes"
                : "Create role"
              : "Continue"
          }
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

      <div className="w-full">
        <form id="role-form" onSubmit={handleSubmit} className="space-y-4">
          {activeStepId === "role-setup" ? (
            <RoleSetupStep formState={formState} updateField={updateField} />
          ) : (
            <PermissionsSetupStep
              activeModuleId={activeModuleId}
              permissionSearch={permissionSearch}
              permissions={formState.permissions}
              onPermissionSearchChange={setPermissionSearch}
              onSelectModule={setActiveModuleId}
              onToggleModule={toggleModulePermissions}
              onToggleSubmodule={toggleSubmodulePermissions}
              onTogglePermission={togglePermission}
            />
          )}
        </form>
      </div>
    </div>
  );
}
