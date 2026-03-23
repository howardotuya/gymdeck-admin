import type { KeyboardEvent } from "react";
import type { ReactNode } from "react";
import { TableControlButton } from "../atoms/tableControlButton";
import { TableSearchField } from "../atoms/tableSearchField";

type CustomTableToolbarProps = {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  actions?: ReactNode;
  showTopBorder?: boolean;
};

export function CustomTableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
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

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
