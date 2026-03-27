import type {
  CustomTableColumn,
  CustomTableExportValue,
  CustomTableFilterField,
  CustomTableFilterValues,
} from "./types";

function normalizeDate(value: unknown) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (value == null) {
    return [];
  }

  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
}

function getFilterFieldValue<T>(row: T, field: CustomTableFilterField<T>) {
  if (field.getValue) {
    return field.getValue(row);
  }

  return (row as Record<string, unknown>)[field.id];
}

function valueMatchesDateFilter(value: unknown, filterValue: unknown) {
  const rowDate = normalizeDate(value);
  const selectedDate = normalizeDate(filterValue);

  if (!rowDate || !selectedDate) {
    return false;
  }

  return rowDate.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10);
}

function valueMatchesDateRange(value: unknown, filterValue: unknown) {
  const rowDate = normalizeDate(value);

  if (!rowDate || typeof filterValue !== "object" || filterValue === null) {
    return false;
  }

  const { start, end } = filterValue as { start?: string; end?: string };
  const startDate = start ? normalizeDate(start) : null;
  const endDate = end ? normalizeDate(end) : null;

  if (startDate && rowDate < startDate) {
    return false;
  }

  if (endDate) {
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setHours(23, 59, 59, 999);

    if (rowDate > inclusiveEndDate) {
      return false;
    }
  }

  return true;
}

export function isEmptyFilterValue(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every((entry) => isEmptyFilterValue(entry));
  }

  return false;
}

export function sanitizeFilterValues(values: CustomTableFilterValues | undefined) {
  if (!values) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => !isEmptyFilterValue(value)),
  );
}

export function countActiveFilterValues(values: CustomTableFilterValues | undefined) {
  return Object.keys(sanitizeFilterValues(values)).length;
}

export function rowMatchesFilterField<T>(
  row: T,
  field: CustomTableFilterField<T>,
  filterValue: unknown,
) {
  if (isEmptyFilterValue(filterValue)) {
    return true;
  }

  if (field.matches) {
    return field.matches(row, filterValue);
  }

  const rowValue = getFilterFieldValue(row, field);

  switch (field.type) {
    case "text": {
      const query = String(filterValue).trim().toLowerCase();
      const haystack = Array.isArray(rowValue)
        ? rowValue.join(" ")
        : rowValue == null
          ? ""
          : String(rowValue);

      return haystack.toLowerCase().includes(query);
    }
    case "select":
    case "radio": {
      const selectedValues = normalizeStringArray(filterValue);
      const rowValues = normalizeStringArray(rowValue);

      if (selectedValues.length === 0) {
        return true;
      }

      return rowValues.some((value) => selectedValues.includes(value));
    }
    case "checkbox":
      return Boolean(rowValue) === Boolean(filterValue);
    case "date":
      return valueMatchesDateFilter(rowValue, filterValue);
    case "date-range":
      return valueMatchesDateRange(rowValue, filterValue);
    default:
      return true;
  }
}

export function applyCustomTableFilters<T>(
  rows: T[],
  fields: CustomTableFilterField<T>[] | undefined,
  values: CustomTableFilterValues | undefined,
) {
  const sanitizedValues = sanitizeFilterValues(values);

  if (!fields?.length || Object.keys(sanitizedValues).length === 0) {
    return rows;
  }

  return rows.filter((row) =>
    fields.every((field) => rowMatchesFilterField(row, field, sanitizedValues[field.id])),
  );
}

export function getColumnExportValue<T>(
  row: T,
  column: CustomTableColumn<T>,
  getRowLabel?: (row: T) => string,
): CustomTableExportValue {
  if (column.exportAccessor) {
    return column.exportAccessor(row);
  }

  if (column.accessorFn) {
    return column.accessorFn(row) as CustomTableExportValue;
  }

  if (column.accessorKey) {
    return row[column.accessorKey] as CustomTableExportValue;
  }

  if (column.sortAccessor) {
    return column.sortAccessor(row);
  }

  if (column.isRowHeader && getRowLabel) {
    return getRowLabel(row);
  }

  return (row as Record<string, unknown>)[column.id] as CustomTableExportValue;
}

function serializeExportValue(value: CustomTableExportValue) {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (Array.isArray(value)) {
    return value.join("; ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

function escapeCsvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsvRows<T>(
  rows: T[],
  columns: CustomTableColumn<T>[],
  getRowLabel?: (row: T) => string,
) {
  const header = columns.map((column) => escapeCsvCell(column.header)).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((column) =>
          escapeCsvCell(serializeExportValue(getColumnExportValue(row, column, getRowLabel))),
        )
        .join(","),
    )
    .join("\n");

  return `${header}\n${body}`;
}

function slugifyFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "table-export";
}

export function getDefaultExportFileName(value: string) {
  return slugifyFileName(value);
}

export function downloadRowsAsCsv<T>({
  rows,
  columns,
  fileName,
  getRowLabel,
}: {
  rows: T[];
  columns: CustomTableColumn<T>[];
  fileName: string;
  getRowLabel?: (row: T) => string;
}) {
  const csv = buildCsvRows(rows, columns, getRowLabel);
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();

  window.URL.revokeObjectURL(url);
}
