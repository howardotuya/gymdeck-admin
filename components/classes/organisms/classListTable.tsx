"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import type { ClassRecord } from "../data";

type ClassListTableProps = {
  classes: ClassRecord[];
  onViewDetails?: (classItem: ClassRecord) => void;
  onEditClass?: (classItem: ClassRecord) => void;
  onDeactivateClass?: (classItem: ClassRecord) => void;
};

function getLifecycleStatus(classItem: ClassRecord) {
  if (classItem.status === "Inactive" || classItem.status === "Draft") {
    return { label: "Inactive", tone: "neutral" as const };
  }

  return { label: "Active", tone: "success" as const };
}

const classColumns: CustomTableColumn<ClassRecord>[] = [
  {
    id: "name",
    header: "Class",
    accessorKey: "name",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (classItem) => classItem.name,
  },
  {
    id: "instructor",
    header: "Instructor",
    accessorKey: "instructor",
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
    id: "weeklySlots",
    header: "Weekly slots",
    align: "right",
    sortable: true,
    sortAccessor: (classItem) => classItem.activeSchedules,
    accessorFn: (classItem) => `${classItem.activeSchedules} slots`,
    className: "font-medium",
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (classItem) => getLifecycleStatus(classItem).label,
    cell: (classItem) => {
      const lifecycleStatus = getLifecycleStatus(classItem);

      return (
        <StatusBadge
          label={lifecycleStatus.label}
          tone={lifecycleStatus.tone}
        />
      );
    },
  },
];

function ClassToolbarActions() {
  return (
    <>
      <TableControlButton>Export Data</TableControlButton>
      <TableControlButton>
        Filter By
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

export function ClassListTable({
  classes,
  onViewDetails,
  onEditClass,
  onDeactivateClass,
}: ClassListTableProps) {
  const openModal = useModalStore((state) => state.openModal);

  const classActions = useMemo<CustomTableAction<ClassRecord>[]>(
    () => [
      {
        label: "View details",
        onSelect: (classItem) => onViewDetails?.(classItem),
      },
      {
        label: "Edit",
        onSelect: (classItem) => onEditClass?.(classItem),
      },
      {
        label: "Deactivate",
        tone: "danger",
        hidden: (classItem) => getLifecycleStatus(classItem).label === "Inactive",
        onSelect: (classItem) =>
          openModal("deactivateClass", {
            classItem,
            onConfirm: () => onDeactivateClass?.(classItem),
          }),
      },
    ],
    [onDeactivateClass, onEditClass, onViewDetails, openModal],
  );

  return (
    <CustomTable
      title="All classes"
      description="Lean roster of classes with quick actions for detail, editing, and deactivation."
      data={classes}
      columns={classColumns}
      rowActions={classActions}
      getRowId={(classItem) => classItem.id}
      getRowLabel={(classItem) => classItem.name}
      getSearchText={(classItem) =>
        [
          classItem.id,
          classItem.name,
          classItem.instructor,
          classItem.branch,
          classItem.format,
          getLifecycleStatus(classItem).label,
        ].join(" ")
      }
      searchPlaceholder="Search classes"
      caption="Class roster. Directory of classes, instructors, branches, weekly slot counts, status, and row actions."
      headerAction={
        <Link
          href="/classes/new"
          className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
        >
          Create class
        </Link>
      }
      toolbarActions={<ClassToolbarActions />}
      emptyStateTitle="No classes found"
      emptyStateDescription="Create a class or adjust your search to populate this roster."
      itemLabel="classes"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
    />
  );
}
