import { FormSectionCard } from "@/components/ui";
import {
  getModulePermissionIds,
  permissionModules,
  type RoleFormState,
} from "../../data";
import { PermissionActionButton } from "../atoms/permissionActionButton";
import { PermissionSearchField } from "../atoms/permissionSearchField";
import { PermissionModuleMenu } from "../molecules/permissionModuleMenu";
import { PermissionResultGroup } from "../molecules/permissionResultGroup";

type PermissionsSetupStepProps = {
  activeModuleId: string;
  permissionSearch: string;
  permissions: RoleFormState["permissions"];
  readOnly?: boolean;
  onPermissionSearchChange: (value: string) => void;
  onSelectModule: (moduleId: string) => void;
  onToggleModule: (moduleId: string, nextChecked: boolean) => void;
  onToggleSubmodule: (
    moduleId: string,
    permissionIds: string[],
    nextChecked: boolean,
  ) => void;
  onTogglePermission: (moduleId: string, permissionId: string) => void;
};

function getModuleById(moduleId: string) {
  return permissionModules.find((module) => module.id === moduleId);
}

export function PermissionsSetupStep({
  activeModuleId,
  permissionSearch,
  permissions,
  readOnly = false,
  onPermissionSearchChange,
  onSelectModule,
  onToggleModule,
  onToggleSubmodule,
  onTogglePermission,
}: PermissionsSetupStepProps) {
  const activeModule =
    getModuleById(activeModuleId) ?? permissionModules[0] ?? null;
  const activeModulePermissionIds = activeModule
    ? getModulePermissionIds(activeModule)
    : [];
  const activeModuleSelectedPermissions = activeModule
    ? permissions[activeModule.id] ?? []
    : [];
  const activeModuleAllSelected =
    activeModulePermissionIds.length > 0 &&
    activeModuleSelectedPermissions.length === activeModulePermissionIds.length;

  const normalizedPermissionSearch = permissionSearch.trim().toLowerCase();
  const hasPermissionSearch = normalizedPermissionSearch.length > 0;

  const permissionSections = hasPermissionSearch
    ? permissionModules.flatMap((module) => {
        const moduleText = `${module.label} ${module.description}`.toLowerCase();
        const moduleMatches = moduleText.includes(normalizedPermissionSearch);
        const matchingSubmodules = module.submodules.filter((submodule) => {
          if (moduleMatches) {
            return true;
          }

          const submoduleText =
            `${submodule.label} ${submodule.description}`.toLowerCase();
          const featureMatch = submodule.features.some((feature) =>
            `${feature.label} ${feature.description}`
              .toLowerCase()
              .includes(normalizedPermissionSearch),
          );

          return submoduleText.includes(normalizedPermissionSearch) || featureMatch;
        });

        return matchingSubmodules.length > 0
          ? [{ module, submodules: matchingSubmodules }]
          : [];
      })
    : activeModule
      ? [{ module: activeModule, submodules: activeModule.submodules }]
      : [];

  return (
    <div className="space-y-4">
      <FormSectionCard className="p-4 sm:p-5">
        <PermissionSearchField
          id="permission-search"
          label="Search all permissions"
          value={permissionSearch}
          onChange={onPermissionSearchChange}
          placeholder="Search modules, sections, and permission actions"
        />
      </FormSectionCard>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(260px,_320px)_minmax(0,_1fr)]">
        <PermissionModuleMenu
          modules={permissionModules}
          activeModuleId={activeModuleId}
          permissions={permissions}
          onSelectModule={onSelectModule}
        />

        <FormSectionCard
          title={hasPermissionSearch ? "Search results" : activeModule?.label ?? "Permissions"}
          action={
            hasPermissionSearch ? (
              <PermissionActionButton onClick={() => onPermissionSearchChange("")}>
                Clear search
              </PermissionActionButton>
            ) : activeModule && !readOnly ? (
              <PermissionActionButton
                onClick={() =>
                  onToggleModule(activeModule.id, !activeModuleAllSelected)
                }
              >
                {activeModuleAllSelected ? "Clear module" : "Select all in module"}
              </PermissionActionButton>
            ) : null
          }
          bodyClassName="space-y-5"
        >
          {permissionSections.length > 0 ? (
            <div className="space-y-4">
              {permissionSections.map(({ module, submodules }) => (
                <PermissionResultGroup
                  key={module.id}
                  module={module}
                  submodules={submodules}
                  selectedPermissions={permissions[module.id] ?? []}
                  searchMode={hasPermissionSearch}
                  onOpenModule={(moduleId) => {
                    onSelectModule(moduleId);
                    onPermissionSearchChange("");
                  }}
                  readOnly={readOnly}
                  onToggleSubmodule={onToggleSubmodule}
                  onTogglePermission={onTogglePermission}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-border-strong bg-bg-control/35 px-6 py-10 text-center">
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-text-primary">
                No matching permissions
              </p>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                Try a different keyword or clear the search to see every
                permission across all modules.
              </p>
              <PermissionActionButton
                onClick={() => onPermissionSearchChange("")}
                className="mt-5"
              >
                Clear search
              </PermissionActionButton>
            </div>
          )}
        </FormSectionCard>
      </div>
    </div>
  );
}
