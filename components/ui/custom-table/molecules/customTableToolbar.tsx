import type { KeyboardEvent } from "react";
import type { ReactNode } from "react";
import { ExportIcon, FilterIcon, SearchIcon } from "@/components/icons";
import { TableControlButton } from "../atoms/tableControlButton";
import { TableSearchField } from "../atoms/tableSearchField";

type CustomTableToolbarProps = {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  filterButton?: boolean;
  filterCount?: number;
  onFilterClick?: () => void;
  exportButton?: boolean;
  exportCount?: number;
  exportDisabled?: boolean;
  exportLoading?: boolean;
  onExportClick?: () => void;
  actions?: ReactNode;
  showTopBorder?: boolean;
};

export function CustomTableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  filterButton = false,
  filterCount = 0,
  onFilterClick,
  exportButton = false,
  exportCount = 0,
  exportDisabled = false,
  exportLoading = false,
  onExportClick,
  actions,
  showTopBorder = true,
}: CustomTableToolbarProps) {
  const handleSearchEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <div
      className={showTopBorder ? "border-t border-border-soft px-4 py-4 sm:px-6 sm:py-5" : "px-4 py-4 sm:px-6 sm:py-5"}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {searchPlaceholder ? (
          <div
            role="search"
            aria-label={searchPlaceholder}
            className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:items-center lg:max-w-[520px]"
          >
            <TableSearchField
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={onSearchValueChange}
              onEnter={handleSearchEnter}
            />
            <TableControlButton
              variant="primary"
              onClick={onSearchSubmit}
              aria-label="Search table rows"
              className="h-[51px] min-w-[51px] px-0 sm:min-w-[116px] sm:px-5"
            >
              <SearchIcon size={16} />
              <span className="hidden sm:inline">Search</span>
              <span className="sr-only sm:hidden">Search</span>
            </TableControlButton>
          </div>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap gap-2 sm:gap-3">
          {exportButton ? (
            <TableControlButton
              disabled={exportDisabled || exportLoading}
              onClick={onExportClick}
              className="min-w-0 flex-1 px-4 sm:flex-none sm:px-5"
            >
              <ExportIcon size={16} />
              {exportLoading ? (
                <span className="truncate">Exporting...</span>
              ) : (
                <>
                  <span className="truncate">Export</span>
                  {exportCount > 0 ? (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-bg-muted px-2 py-1 text-[12px] font-semibold text-text-primary">
                      {exportCount}
                    </span>
                  ) : null}
                </>
              )}
            </TableControlButton>
          ) : null}

          {filterButton ? (
            <TableControlButton
              onClick={onFilterClick}
              className="min-w-0 flex-1 px-4 sm:flex-none sm:px-5"
            >
              <FilterIcon size={16} />
              <span className="truncate">Filters</span>
              {filterCount > 0 ? (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-bg-brand-soft px-2 py-1 text-[12px] font-semibold text-text-brand">
                  {filterCount}
                </span>
              ) : null}
            </TableControlButton>
          ) : null}

          {actions}
        </div>
      </div>
    </div>
  );
}
