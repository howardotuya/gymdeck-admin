import { ChevronDownIcon } from "@/components/icons";
import { TablePaginationButton } from "../atoms/tablePaginationButton";

type CustomTablePaginationProps = {
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

function buildPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  const orderedPages = Array.from(pages).sort((left, right) => left - right);
  const items: Array<number | string> = [];

  orderedPages.forEach((page, index) => {
    items.push(page);
    const nextPage = orderedPages[index + 1];

    if (nextPage && nextPage - page > 1) {
      items.push(`ellipsis-${page}`);
    }
  });

  return items;
}

export function CustomTablePagination({
  currentPage,
  pageSize,
  pageSizeOptions,
  totalItems,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: CustomTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <div className="border-t border-border-soft px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <p className="text-[13px] text-text-secondary">
            {`Showing ${startItem}-${endItem} of ${totalItems} ${itemLabel}`}
          </p>

          <label className="flex items-center gap-2 text-[13px] text-text-secondary">
            Rows
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-10 rounded-full border border-border-soft bg-bg-surface px-4 text-[13px] text-text-primary outline-none transition-[background-color,border-color,box-shadow] hover:border-border-strong hover:bg-bg-muted focus:border-border-strong focus:ring-2 focus:ring-text-brand/20"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <nav
          aria-label={`${itemLabel} pagination`}
          className="flex flex-wrap items-center gap-2 lg:justify-end"
        >
          <TablePaginationButton
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronDownIcon size={16} className="rotate-90" />
          </TablePaginationButton>

          {pageItems.map((item) =>
            typeof item === "string" ? (
              <span
                key={item}
                className="inline-flex h-11 min-w-11 items-center justify-center text-[13px] text-text-subtle"
              >
                ...
              </span>
            ) : (
              <TablePaginationButton
                key={item}
                active={item === currentPage}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`Go to page ${item}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </TablePaginationButton>
            ),
          )}

          <TablePaginationButton
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronDownIcon size={16} className="-rotate-90" />
          </TablePaginationButton>
        </nav>
      </div>
    </div>
  );
}
