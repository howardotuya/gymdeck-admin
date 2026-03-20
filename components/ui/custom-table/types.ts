import type { ReactNode } from "react";

export type CustomTableSortableValue = string | number | Date | null | undefined;

export type CustomTableColumn<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  sortAccessor?: (row: T) => CustomTableSortableValue;
  sortable?: boolean;
  cell?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  isRowHeader?: boolean;
  className?: string;
  headerClassName?: string;
};

export type CustomTableAction<T> = {
  label: string;
  tone?: "default" | "danger";
  hidden?: (row: T) => boolean;
  onSelect?: (row: T) => void;
};

export type CustomTableMobileCardRenderProps = {
  actionsMenu: ReactNode;
};
