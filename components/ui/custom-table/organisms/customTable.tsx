"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomTableExportModal } from "../molecules/customTableExportModal";
import { CustomTableActionMenu } from "../molecules/customTableActionMenu";
import { CustomTableFilterSidebar } from "../molecules/customTableFilterSidebar";
import { CustomTablePagination } from "../molecules/customTablePagination";
import { CustomTableToolbar } from "../molecules/customTableToolbar";
import type {
  CustomTableAction,
  CustomTableColumn,
  CustomTableExportRequest,
  CustomTableFilterField,
  CustomTableFilterValues,
  CustomTableMobileCardRenderProps,
  CustomTableSortableValue,
} from "../types";
import {
  applyCustomTableFilters,
  countActiveFilterValues,
  downloadRowsAsCsv,
  getDefaultExportFileName,
  sanitizeFilterValues,
} from "../utils";

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
  filterFields?: CustomTableFilterField<T>[];
  onFilterChange?: (values: CustomTableFilterValues) => void;
  onFilter?: (values: CustomTableFilterValues) => void;
  onClearFilter?: () => void;
  currentFilterValues?: CustomTableFilterValues;
  exportDataBtn?: boolean;
  onExport?: (payload: CustomTableExportRequest<T>) => void | Promise<void>;
  exportLoading?: boolean;
  exportEmail?: string;
  exportFileName?: string;
  queryParamPrefix?: string;
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

function compareSortValues(left: CustomTableSortableValue, right: CustomTableSortableValue) {
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

      if (column.sortAccessor) {
        return String(column.sortAccessor(row) ?? "");
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

function toQuerySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "table";
}

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseFilterValues(value: string | null): CustomTableFilterValues {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return sanitizeFilterValues(parsed as CustomTableFilterValues);
  } catch {
    return {};
  }
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
  filterFields,
  onFilterChange,
  onFilter,
  onClearFilter,
  currentFilterValues,
  exportDataBtn = false,
  onExport,
  exportLoading = false,
  exportEmail = "",
  exportFileName,
  queryParamPrefix,
}: CustomTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftQuery, setDraftQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortState, setSortState] = useState<{
    columnId: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [internalAppliedFilters, setInternalAppliedFilters] = useState<CustomTableFilterValues>(
    sanitizeFilterValues(currentFilterValues),
  );
  const [draftFilterValues, setDraftFilterValues] = useState<CustomTableFilterValues>(
    sanitizeFilterValues(currentFilterValues),
  );

  const resolvedAppliedFilterValues = useMemo(
    () =>
      currentFilterValues !== undefined
        ? sanitizeFilterValues(currentFilterValues)
        : internalAppliedFilters,
    [currentFilterValues, internalAppliedFilters],
  );

  const activeFilterCount = useMemo(
    () => countActiveFilterValues(resolvedAppliedFilterValues),
    [resolvedAppliedFilterValues],
  );

  useEffect(() => {
    if (currentFilterValues === undefined) {
      return;
    }

    const sanitized = sanitizeFilterValues(currentFilterValues);
    setInternalAppliedFilters(sanitized);
    setDraftFilterValues(sanitized);
  }, [currentFilterValues]);

  const normalizedPageSizeOptions = useMemo(() => {
    const options = new Set(pageSizeOptions);
    options.add(initialPageSize);
    return Array.from(options).sort((left, right) => left - right);
  }, [initialPageSize, pageSizeOptions]);

  const resolvedQueryParamPrefix = useMemo(
    () => toQuerySegment(queryParamPrefix ?? title ?? itemLabel ?? "table"),
    [itemLabel, queryParamPrefix, title],
  );

  const queryParams = useMemo(
    () => ({
      page: `${resolvedQueryParamPrefix}-page`,
      pageSize: `${resolvedQueryParamPrefix}-page-size`,
      search: `${resolvedQueryParamPrefix}-search`,
      filters: `${resolvedQueryParamPrefix}-filters`,
    }),
    [resolvedQueryParamPrefix],
  );

  const searchParamValue = searchParams.get(queryParams.search) ?? "";
  const filtersParamValue = searchParams.get(queryParams.filters);
  const pageParamValue = searchParams.get(queryParams.page);
  const pageSizeParamValue = searchParams.get(queryParams.pageSize);
  const parsedUrlFilters = useMemo(() => parseFilterValues(filtersParamValue), [filtersParamValue]);
  const parsedUrlPage = useMemo(() => parsePositiveInteger(pageParamValue, 1), [pageParamValue]);
  const parsedUrlPageSize = useMemo(() => {
    const parsed = parsePositiveInteger(pageSizeParamValue, initialPageSize);
    return normalizedPageSizeOptions.includes(parsed) ? parsed : initialPageSize;
  }, [initialPageSize, normalizedPageSizeOptions, pageSizeParamValue]);

  useEffect(() => {
    setDraftQuery(searchParamValue);
    setAppliedQuery(searchParamValue);
  }, [searchParamValue]);

  useEffect(() => {
    setCurrentPage(parsedUrlPage);
  }, [parsedUrlPage]);

  useEffect(() => {
    setPageSize(parsedUrlPageSize);
  }, [parsedUrlPageSize]);

  useEffect(() => {
    if (currentFilterValues !== undefined) {
      return;
    }

    setInternalAppliedFilters(parsedUrlFilters);
    setDraftFilterValues(parsedUrlFilters);
  }, [currentFilterValues, parsedUrlFilters]);

  const filteredByControlsRows = useMemo(
    () => applyCustomTableFilters(data, filterFields, resolvedAppliedFilterValues),
    [data, filterFields, resolvedAppliedFilterValues],
  );

  const filteredRows = useMemo(() => {
    if (!appliedQuery.trim()) {
      return filteredByControlsRows;
    }

    const query = appliedQuery.trim().toLowerCase();

    return filteredByControlsRows.filter((row) => {
      const haystack = getSearchText
        ? getSearchText(row).toLowerCase()
        : getSearchTextFromColumns(row, columns);

      return haystack.includes(query);
    });
  }, [appliedQuery, columns, filteredByControlsRows, getSearchText]);

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

  const updateUrlState = useCallback(
    ({
      page,
      pageSize: nextPageSize,
      search,
      filters,
    }: {
      page?: number | null;
      pageSize?: number | null;
      search?: string | null;
      filters?: CustomTableFilterValues | null;
    }) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (page !== undefined) {
        if (!page || page <= 1) {
          nextParams.delete(queryParams.page);
        } else {
          nextParams.set(queryParams.page, String(page));
        }
      }

      if (nextPageSize !== undefined) {
        if (!nextPageSize || nextPageSize === initialPageSize) {
          nextParams.delete(queryParams.pageSize);
        } else {
          nextParams.set(queryParams.pageSize, String(nextPageSize));
        }
      }

      if (search !== undefined) {
        if (!search || search.trim().length === 0) {
          nextParams.delete(queryParams.search);
        } else {
          nextParams.set(queryParams.search, search.trim());
        }
      }

      if (filters !== undefined) {
        const sanitizedFilters = sanitizeFilterValues(filters ?? undefined);

        if (Object.keys(sanitizedFilters).length === 0) {
          nextParams.delete(queryParams.filters);
        } else {
          nextParams.set(queryParams.filters, JSON.stringify(sanitizedFilters));
        }
      }

      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [initialPageSize, pathname, queryParams, router, searchParams],
  );

  useEffect(() => {
    if (currentPage <= totalPages) {
      return;
    }

    setCurrentPage(totalPages);
    updateUrlState({ page: totalPages });
  }, [currentPage, totalPages, updateUrlState]);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, sortedRows]);

  const hasRowActions = Boolean(rowActions && rowActions.length > 0);
  const hasToolbar = Boolean(
    searchPlaceholder || toolbarActions || filterFields?.length || exportDataBtn,
  );
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

  const handleFilterDraftChange = (nextValues: CustomTableFilterValues) => {
    const sanitized = sanitizeFilterValues(nextValues);
    setDraftFilterValues(sanitized);
    onFilterChange?.(sanitized);
  };

  const handleApplyFilters = () => {
    const sanitized = sanitizeFilterValues(draftFilterValues);

    if (currentFilterValues === undefined) {
      setInternalAppliedFilters(sanitized);
    }

    onFilter?.(sanitized);
    setCurrentPage(1);
    setFilterSidebarOpen(false);
    updateUrlState({
      filters: sanitized,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setDraftFilterValues({});

    if (currentFilterValues === undefined) {
      setInternalAppliedFilters({});
    }

    onFilterChange?.({});
    onClearFilter?.();
    setCurrentPage(1);
    setFilterSidebarOpen(false);
    updateUrlState({
      filters: null,
      page: 1,
    });
  };

  const handleExport = async ({ type, email }: { type: string; email: string }) => {
    const fileName = getDefaultExportFileName(exportFileName ?? title ?? itemLabel);

    if (onExport) {
      await onExport({
        type,
        email,
        rows: sortedRows,
        columns,
        fileName,
      });
    } else {
      downloadRowsAsCsv({
        rows: sortedRows,
        columns,
        fileName,
        getRowLabel,
      });
    }

    setExportModalOpen(false);
  };

  return (
    <>
      <section
        className={clsx(
          "relative overflow-visible rounded-[20px] border border-border-soft bg-bg-surface shadow-[var(--shadow-card)] sm:rounded-[24px]",
          className,
        )}
      >
        {hasHeaderSection ? (
          <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between">
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

            {headerAction ? <div className="w-full lg:w-auto lg:shrink-0">{headerAction}</div> : null}
          </div>
        ) : null}

        {hasToolbar ? (
          <CustomTableToolbar
            searchPlaceholder={searchPlaceholder}
            searchValue={draftQuery}
            onSearchValueChange={setDraftQuery}
            onSearchSubmit={() => {
              const nextQuery = draftQuery.trim();
              setAppliedQuery(nextQuery);
              setCurrentPage(1);
              updateUrlState({
                search: nextQuery,
                page: 1,
              });
            }}
            filterButton={Boolean(filterFields?.length)}
            filterCount={activeFilterCount}
            onFilterClick={() => {
              setDraftFilterValues(resolvedAppliedFilterValues);
              setFilterSidebarOpen(true);
            }}
            exportButton={exportDataBtn}
            exportCount={sortedRows.length}
            exportDisabled={sortedRows.length === 0}
            exportLoading={exportLoading}
            onExportClick={() => setExportModalOpen(true)}
            actions={toolbarActions}
            showTopBorder={hasHeaderSection}
          />
        ) : null}

        <div className={clsx(hasToolbar && "border-t border-border-soft")}>
          {sortedRows.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6 sm:py-14">
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

              <div className="hidden overflow-x-auto overflow-y-visible xl:block">
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
                              <th
                                key={column.id}
                                scope="row"
                                className={clsx(cellClassName, "font-normal")}
                              >
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
                onPageChange={(nextPage) => {
                  setCurrentPage(nextPage);
                  updateUrlState({ page: nextPage });
                }}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setCurrentPage(1);
                  updateUrlState({
                    pageSize: nextPageSize,
                    page: 1,
                  });
                }}
              />
            </>
          )}
        </div>
      </section>

      {filterFields?.length ? (
        <CustomTableFilterSidebar
          open={filterSidebarOpen}
          fields={filterFields}
          values={draftFilterValues}
          onChange={handleFilterDraftChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setFilterSidebarOpen(false)}
        />
      ) : null}

      {exportDataBtn && exportModalOpen ? (
        <CustomTableExportModal
          defaultEmail={exportEmail}
          loading={exportLoading}
          onClose={() => setExportModalOpen(false)}
          onExport={handleExport}
        />
      ) : null}
    </>
  );
}
