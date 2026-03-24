"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { EmployeeRow, RoleRow } from "./data";

export function EmployeeIdentity({ employee }: { employee: EmployeeRow }) {
  return employee.name;
}

export function RoleNameCell({ role }: { role: RoleRow }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-text-primary">{role.name}</p>
    </div>
  );
}

export function StaffMobileCard({
  title,
  subtitle,
  status,
  metadata,
  actionsMenu,
}: {
  title: string;
  subtitle: string;
  status: { label: string; tone: Parameters<typeof StatusBadge>[0]["tone"] };
  metadata: Array<{ label: string; value: ReactNode }>;
  actionsMenu?: ReactNode;
}) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-text-primary">
            {title}
          </p>
          <p className="mt-1 truncate text-[13px] text-text-secondary">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={status.label} tone={status.tone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {metadata.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
              {item.label}
            </p>
            <div
              className={clsx(
                "mt-1 text-[14px] text-text-primary",
                typeof item.value === "string" &&
                  item.value.length > 32 &&
                  "break-words",
              )}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
