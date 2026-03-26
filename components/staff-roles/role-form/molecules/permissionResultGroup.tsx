import type {
  PermissionModuleDefinition,
  PermissionSubmoduleDefinition,
} from "../../data";
import { PermissionActionButton } from "../atoms/permissionActionButton";
import { PermissionSubmoduleCard } from "./permissionSubmoduleCard";

type PermissionResultGroupProps = {
  module: PermissionModuleDefinition;
  submodules: PermissionSubmoduleDefinition[];
  selectedPermissions: string[];
  searchMode: boolean;
  readOnly?: boolean;
  onOpenModule: (moduleId: string) => void;
  onToggleSubmodule: (
    moduleId: string,
    permissionIds: string[],
    nextChecked: boolean,
  ) => void;
  onTogglePermission: (moduleId: string, permissionId: string) => void;
};

export function PermissionResultGroup({
  module,
  submodules,
  selectedPermissions,
  searchMode,
  readOnly = false,
  onOpenModule,
  onToggleSubmodule,
  onTogglePermission,
}: PermissionResultGroupProps) {
  return (
    <div className="space-y-4">
      {searchMode ? (
        <div className="flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-text-primary">
            {module.label}
          </h3>
          {readOnly ? null : (
            <PermissionActionButton onClick={() => onOpenModule(module.id)}>
              Open module
            </PermissionActionButton>
          )}
        </div>
      ) : null}

      {submodules.map((submodule) => (
        <PermissionSubmoduleCard
          key={submodule.id}
          moduleId={module.id}
          submodule={submodule}
          selectedPermissions={selectedPermissions}
          readOnly={readOnly}
          onToggleSubmodule={onToggleSubmodule}
          onTogglePermission={onTogglePermission}
        />
      ))}
    </div>
  );
}
