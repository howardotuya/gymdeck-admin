import type { ReactNode } from "react";

export type CustomTableSortableValue = string | number | Date | null | undefined;
export type CustomTableExportValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | string[];

export type CustomTableFilterOption = {
  label: string;
  value: string;
  sublabel?: string;
};

type CustomTableBaseFilterField<T> = {
  id: string;
  label: string;
  getValue?: (row: T) => unknown;
  matches?: (row: T, value: unknown) => boolean;
};

export type CustomTableTextFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "text";
  placeholder?: string;
};

export type CustomTableSelectFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "select";
  options: CustomTableFilterOption[];
  multiple?: boolean;
  placeholder?: string;
  allOptionLabel?: string;
};

export type CustomTableCheckboxFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "checkbox";
  description?: string;
};

export type CustomTableRadioFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "radio";
  options: CustomTableFilterOption[];
};

export type CustomTableDateFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "date";
};

export type CustomTableDateRangeValue = {
  start?: string;
  end?: string;
};

export type CustomTableDateRangeFilterField<T> = CustomTableBaseFilterField<T> & {
  type: "date-range";
  startLabel?: string;
  endLabel?: string;
};

export type CustomTableFilterField<T> =
  | CustomTableTextFilterField<T>
  | CustomTableSelectFilterField<T>
  | CustomTableCheckboxFilterField<T>
  | CustomTableRadioFilterField<T>
  | CustomTableDateFilterField<T>
  | CustomTableDateRangeFilterField<T>;

export type CustomTableFilterValues = Record<string, unknown>;

export type CustomTableColumn<T> = {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => unknown;
  sortAccessor?: (row: T) => CustomTableSortableValue;
  exportAccessor?: (row: T) => CustomTableExportValue;
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

export type CustomTableExportRequest<T> = {
  type: string;
  email: string;
  rows: T[];
  columns: CustomTableColumn<T>[];
  fileName: string;
};
