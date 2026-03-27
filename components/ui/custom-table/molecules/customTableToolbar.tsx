import type { KeyboardEvent } from "react";
import type { ReactNode } from "react";
import { ExportIcon, FilterIcon } from "@/components/icons";
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
    <div className={showTopBorder ? "border-t border-border-soft px-6 py-5" : "px-6 py-5"}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {searchPlaceholder ? (
          <div
            role="search"
            aria-label={searchPlaceholder}
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-[520px]"
          >
            <TableSearchField
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={onSearchValueChange}
              onEnter={handleSearchEnter}
            />
            <TableControlButton variant="secondary" onClick={onSearchSubmit}>
              Search
            </TableControlButton>
          </div>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap gap-3">
          {exportButton ? (
            <TableControlButton disabled={exportDisabled || exportLoading} onClick={onExportClick}>
              <ExportIcon size={16} />
              {exportLoading
                ? "Exporting..."
                : `Export Data${exportCount > 0 ? ` (${exportCount})` : ""}`}
            </TableControlButton>
          ) : null}

          {filterButton ? (
            <TableControlButton onClick={onFilterClick}>
              {filterCount > 0 ? null : <FilterIcon size={16} />}
              {filterCount > 0 ? `(${filterCount}) Filters` : "Filter By"}
            </TableControlButton>
          ) : null}

          {actions}
        </div>
      </div>
    </div>
  );
}
