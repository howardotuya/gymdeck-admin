import clsx from "clsx";
import { getSubmodulePermissionIds, type PermissionSubmoduleDefinition } from "../../data";
import { PermissionActionButton } from "../atoms/permissionActionButton";

type PermissionSubmoduleCardProps = {
  moduleId: string;
  submodule: PermissionSubmoduleDefinition;
  selectedPermissions: string[];
  readOnly?: boolean;
  onToggleSubmodule: (
    moduleId: string,
    permissionIds: string[],
    nextChecked: boolean,
  ) => void;
  onTogglePermission: (moduleId: string, permissionId: string) => void;
};

export function PermissionSubmoduleCard({
  moduleId,
  submodule,
  selectedPermissions,
  readOnly = false,
  onToggleSubmodule,
  onTogglePermission,
}: PermissionSubmoduleCardProps) {
  const submodulePermissionIds = getSubmodulePermissionIds(submodule);
  const allSelected =
    submodulePermissionIds.length > 0 &&
    submodulePermissionIds.every((permissionId) =>
      selectedPermissions.includes(permissionId),
    );

  return (
    <section className="rounded-[24px] border border-border-soft bg-bg-control/45 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[640px]">
          <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-text-primary">
            {submodule.label}
          </h3>
        </div>

        {readOnly ? null : (
          <div className="flex flex-wrap items-center gap-2">
            <PermissionActionButton
              onClick={() =>
                onToggleSubmodule(moduleId, submodulePermissionIds, !allSelected)
              }
            >
              {allSelected ? "Clear section" : "Select all in section"}
            </PermissionActionButton>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        {submodule.features.map((feature) => {
          const checked = selectedPermissions.includes(feature.id);

          return (
            <label
              key={feature.id}
              className={clsx(
                "flex items-start gap-3 rounded-[20px] border px-4 py-4 transition-colors",
                checked
                  ? "border-border-brand bg-bg-brand-soft/45"
                  : "border-border-soft bg-bg-surface hover:border-border-strong hover:bg-bg-control",
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={readOnly}
                onChange={() => onTogglePermission(moduleId, feature.id)}
                className="mt-1 h-4 w-4 rounded border border-border-strong"
              />
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-text-primary">
                  {feature.label}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
