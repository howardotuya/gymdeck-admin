import clsx from "clsx";
import { FormSectionCard } from "@/components/ui";
import {
  getModulePermissionIds,
  type PermissionModuleDefinition,
} from "../../data";

type PermissionModuleMenuProps = {
  modules: PermissionModuleDefinition[];
  activeModuleId: string;
  permissions: Record<string, string[]>;
  onSelectModule: (moduleId: string) => void;
};

export function PermissionModuleMenu({
  modules,
  activeModuleId,
  permissions,
  onSelectModule,
}: PermissionModuleMenuProps) {
  return (
    <FormSectionCard title="Modules" bodyClassName="space-y-2">
      {modules.map((module) => {
        const modulePermissionIds = getModulePermissionIds(module);
        const selectedCount = permissions[module.id]?.length ?? 0;
        const isActive = activeModuleId === module.id;

        return (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelectModule(module.id)}
            className={clsx(
              "flex w-full items-center justify-between gap-3 rounded-[18px] border px-4 py-3 text-left transition-colors",
              isActive
                ? "border-border-brand bg-bg-brand-soft/70"
                : "border-border-soft bg-bg-surface hover:border-border-strong hover:bg-bg-control",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-text-primary">
                {module.label}
              </span>
            </span>

            <span
              className={clsx(
                "inline-flex min-w-12 shrink-0 items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold",
                isActive
                  ? "bg-bg-surface text-text-brand"
                  : "bg-bg-control text-text-secondary",
              )}
            >
              {selectedCount}/{modulePermissionIds.length}
            </span>
          </button>
        );
      })}
    </FormSectionCard>
  );
}
