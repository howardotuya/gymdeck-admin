"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { CustomTableActionMenu } from "../molecules/customTableActionMenu";
import { CustomTablePagination } from "../molecules/customTablePagination";
import { CustomTableToolbar } from "../molecules/customTableToolbar";
import type {
  CustomTableAction,
  CustomTableColumn,
  CustomTableMobileCardRenderProps,
  CustomTableSortableValue,
} from "../types";

type CustomTableProps<T> = {
  title?: string;
  description?: string;
  data: T[];
  columns: CustomTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  getSearchText?: (row: T) => string;
  searchPlaceholder?: string;
  caption?: string;
  headerAction?: ReactNode;
  toolbarActions?: ReactNode;
  rowActions?: CustomTableAction<T>[];
  rowActionsColumnLabel?: string;
  renderMobileCard?: (row: T, props: CustomTableMobileCardRenderProps) => ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  itemLabel?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  stickyHeader?: boolean;
  className?: string;
};

function resolvePrimitiveValue(value: unknown) {
  if (value === null || value === undefined) {
    return "--";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : "--";
  }

  return String(value);
}

function getColumnValue<T>(row: T, column: CustomTableColumn<T>) {
  if (column.cell) {
    return column.cell(row);
  }

  if (column.accessorFn) {
    return resolvePrimitiveValue(column.accessorFn(row));
  }

  if (column.accessorKey) {
    return resolvePrimitiveValue(row[column.accessorKey]);
  }

  return "--";
}

function normalizeSortValue(value: unknown): CustomTableSortableValue {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  return String(value);
}

function getColumnSortValue<T>(row: T, column: CustomTableColumn<T>): CustomTableSortableValue {
  if (column.sortAccessor) {
    return column.sortAccessor(row);
  }

  if (column.accessorFn) {
    return normalizeSortValue(column.accessorFn(row));
  }

  if (column.accessorKey) {
    return normalizeSortValue(row[column.accessorKey]);
  }

  return undefined;
}

function compareSortValues(
  left: CustomTableSortableValue,
  right: CustomTableSortableValue,
) {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (left instanceof Date || right instanceof Date) {
    return new Date(left).getTime() - new Date(right).getTime();
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getSearchTextFromColumns<T>(row: T, columns: CustomTableColumn<T>[]) {
  return columns
    .map((column) => {
      if (column.accessorFn) {
        return String(column.accessorFn(row) ?? "");
      }

      if (column.accessorKey) {
        return String(row[column.accessorKey] ?? "");
      }

      return "";
    })
    .join(" ")
    .toLowerCase();
}

function getAlignmentClass(align: CustomTableColumn<unknown>["align"]) {
  if (align === "right") {
    return "text-right";
  }

  if (align === "center") {
    return "text-center";
  }

  return "text-left";
}

function getActionMenuPlacement(rowIndex: number, totalRows: number) {
  return rowIndex >= Math.max(totalRows - 2, 0) ? "top" : "bottom";
}

export function CustomTable<T>({
  title,
  description,
  data,
  columns,
  getRowId,
  getRowLabel,
  getSearchText,
  searchPlaceholder,
  caption,
  headerAction,
  toolbarActions,
  rowActions,
  rowActionsColumnLabel,
  renderMobileCard,
  emptyStateTitle = `No ${title?.toLowerCase() ?? "records"} found`,
  emptyStateDescription = "Adjust your search or filters to populate this table.",
  itemLabel = "rows",
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  stickyHeader = true,
  className,
}: CustomTableProps<T>) {
  const [draftQuery, setDraftQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortState, setSortState] = useState<{
    columnId: string;
    direction: "asc" | "desc";
  } | null>(null);

  const normalizedPageSizeOptions = useMemo(() => {
    const options = new Set(pageSizeOptions);
    options.add(initialPageSize);
    return Array.from(options).sort((left, right) => left - right);
  }, [initialPageSize, pageSizeOptions]);

  const filteredRows = useMemo(() => {
    if (!appliedQuery.trim()) {
      return data;
    }

    const query = appliedQuery.trim().toLowerCase();

    return data.filter((row) => {
      const haystack = getSearchText
        ? getSearchText(row).toLowerCase()
        : getSearchTextFromColumns(row, columns);

      return haystack.includes(query);
    });
  }, [appliedQuery, columns, data, getSearchText]);

  const sortedRows = useMemo(() => {
    if (!sortState) {
      return filteredRows;
    }

    const activeColumn = columns.find((column) => column.id === sortState.columnId);

    if (!activeColumn) {
      return filteredRows;
    }

    const sorted = [...filteredRows].sort((leftRow, rightRow) =>
      compareSortValues(
        getColumnSortValue(leftRow, activeColumn),
        getColumnSortValue(rightRow, activeColumn),
      ),
    );

    return sortState.direction === "asc" ? sorted : sorted.reverse();
  }, [columns, filteredRows, sortState]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  useEffect(() => {
    if (currentPage <= totalPages) {
      return;
    }

    setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, sortedRows]);

  const hasRowActions = Boolean(rowActions && rowActions.length > 0);
  const hasToolbar = Boolean(searchPlaceholder || toolbarActions);
  const hasHeaderSection = Boolean(title || description || headerAction);
  const resolvedCaption =
    caption ??
    `${
      title && title.trim().length > 0 ? title : "Operational table"
    }. Paginated operational table with searchable rows and quick actions.`;

  const handleColumnSort = (column: CustomTableColumn<T>) => {
    if (!column.sortable) {
      return;
    }

    setSortState((currentSort) => {
      if (!currentSort || currentSort.columnId !== column.id) {
        return { columnId: column.id, direction: "asc" };
      }

      if (currentSort.direction === "asc") {
        return { columnId: column.id, direction: "desc" };
      }

      return null;
    });
  };

  return (
    <section
      className={clsx(
        "overflow-hidden rounded-[24px] border border-border-soft bg-bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {hasHeaderSection ? (
        <div className="flex flex-col gap-4 px-6 py-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[720px]">
            {title ? (
              <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-text-primary">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">{description}</p>
            ) : null}
          </div>

          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </div>
      ) : null}

      {hasToolbar ? (
        <CustomTableToolbar
          searchPlaceholder={searchPlaceholder}
          searchValue={draftQuery}
          onSearchValueChange={setDraftQuery}
          onSearchSubmit={() => {
            setAppliedQuery(draftQuery.trim());
            setCurrentPage(1);
          }}
          actions={toolbarActions}
          showTopBorder={hasHeaderSection}
        />
      ) : null}

      <div className={clsx(hasToolbar && hasHeaderSection && "border-t border-border-soft")}>
        {sortedRows.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-[15px] font-semibold text-text-primary">{emptyStateTitle}</p>
            <p className="mt-2 text-[14px] text-text-secondary">{emptyStateDescription}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 px-4 py-4 sm:px-6 xl:hidden">
              {paginatedRows.map((row, rowIndex) => {
                const actionMenuPlacement = getActionMenuPlacement(
                  rowIndex,
                  paginatedRows.length,
                );
                const actionsMenu = hasRowActions ? (
                  <CustomTableActionMenu
                    row={row}
                    rowLabel={getRowLabel?.(row)}
                    actions={rowActions ?? []}
                    placement={actionMenuPlacement}
                  />
                ) : null;

                if (renderMobileCard) {
                  return (
                    <div key={getRowId(row)}>
                      {renderMobileCard(row, {
                        actionsMenu,
                      })}
                    </div>
                  );
                }

                return (
                  <article
                    key={getRowId(row)}
                    className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-[15px] font-semibold text-text-primary">
                          {getColumnValue(row, columns[0])}
                        </p>
                      </div>
                      {actionsMenu}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {columns.slice(1).map((column) => (
                        <div key={column.id}>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                            {column.header}
                          </p>
                          <div className="mt-1 text-[14px] text-text-primary">
                            {getColumnValue(row, column)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="min-w-full border-separate border-spacing-0">
                <caption className="sr-only">{resolvedCaption}</caption>
                <thead>
                  <tr className="bg-bg-muted text-left">
                    {columns.map((column) => (
                      <th
                        key={column.id}
                        scope="col"
                        aria-sort={
                          !column.sortable
                            ? undefined
                            : sortState?.columnId === column.id
                              ? sortState.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                        }
                        className={clsx(
                          "border-b border-border-soft px-5 py-4 text-[12px] font-medium text-text-secondary",
                          stickyHeader && "sticky top-0 z-[1] bg-bg-muted",
                          getAlignmentClass(column.align),
                          column.headerClassName,
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleColumnSort(column)}
                          disabled={!column.sortable}
                          className={clsx(
                            "inline-flex items-center gap-2",
                            column.align === "right" && "ml-auto",
                            !column.sortable && "cursor-default",
                          )}
                        >
                          <span>{column.header}</span>
                          {column.sortable ? (
                            <span
                              aria-hidden="true"
                              className={clsx(
                                "inline-flex transition-transform",
                                sortState?.columnId === column.id &&
                                  sortState.direction === "desc" &&
                                  "rotate-180",
                              )}
                            >
                              <span
                                className={clsx(
                                  "text-[11px] text-text-subtle",
                                  sortState?.columnId === column.id && "text-text-primary",
                                )}
                              >
                                ▼
                              </span>
                            </span>
                          ) : null}
                        </button>
                      </th>
                    ))}
                    {hasRowActions ? (
                      <th
                        scope="col"
                        className={clsx(
                          "w-[96px] border-b border-border-soft px-5 py-4 text-right text-[12px] font-medium text-text-secondary",
                          stickyHeader && "sticky top-0 z-[1] bg-bg-muted",
                        )}
                      >
                        {rowActionsColumnLabel ? (
                          <span>{rowActionsColumnLabel}</span>
                        ) : (
                          <span className="sr-only">Actions</span>
                        )}
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row, rowIndex) => (
                    <tr key={getRowId(row)} className="transition-colors hover:bg-bg-muted/40">
                      {columns.map((column) => {
                        const cellContent = getColumnValue(row, column);
                        const cellClassName = clsx(
                          "border-b border-border-subtle px-5 py-5 text-[14px] text-text-primary",
                          getAlignmentClass(column.align),
                          column.className,
                        );

                        if (column.isRowHeader) {
                          return (
                            <th key={column.id} scope="row" className={clsx(cellClassName, "font-normal")}>
                              {cellContent}
                            </th>
                          );
                        }

                        return (
                          <td key={column.id} className={cellClassName}>
                            {cellContent}
                          </td>
                        );
                      })}

                      {hasRowActions ? (
                        <td className="border-b border-border-subtle px-5 py-5 text-right">
                          <CustomTableActionMenu
                            row={row}
                            rowLabel={getRowLabel?.(row)}
                            actions={rowActions ?? []}
                            placement={getActionMenuPlacement(rowIndex, paginatedRows.length)}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CustomTablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              pageSizeOptions={normalizedPageSizeOptions}
              totalItems={sortedRows.length}
              itemLabel={itemLabel}
              onPageChange={setCurrentPage}
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>
    </section>
  );
}
