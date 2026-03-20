import { MoreVerticalIcon } from "@/components/icons";
import type { CustomTableAction } from "../types";

type CustomTableActionMenuProps<T> = {
  row: T;
  rowLabel?: string;
  actions: CustomTableAction<T>[];
};

export function CustomTableActionMenu<T>({
  row,
  rowLabel = "row",
  actions,
}: CustomTableActionMenuProps<T>) {
  const visibleActions = actions.filter((action) => (action.hidden ? !action.hidden(row) : true));

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <details className="relative inline-block">
      <summary
        aria-label={`Open actions for ${rowLabel}`}
        className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-transparent text-text-support transition-colors hover:bg-bg-action-soft hover:text-text-primary [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only">{`Open actions for ${rowLabel}`}</span>
        <MoreVerticalIcon size={18} />
      </summary>
      <div className="absolute right-0 top-[calc(100%+8px)] z-10 w-[176px] rounded-[16px] border border-border-soft bg-bg-surface p-2 shadow-[var(--shadow-control)]">
        {visibleActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`block w-full rounded-full px-3 py-2.5 text-left text-[14px] font-medium transition-colors hover:bg-bg-action-soft ${
              action.tone === "danger"
                ? "text-text-danger"
                : "text-text-support hover:text-text-primary"
            }`}
            onClick={(event) => {
              action.onSelect?.(row);
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </details>
  );
}
