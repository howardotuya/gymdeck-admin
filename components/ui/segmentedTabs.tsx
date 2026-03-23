import clsx from "clsx";

export type SegmentedTabItem = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

type SegmentedTabsProps = {
  items: SegmentedTabItem[];
  className?: string;
  ariaLabel?: string;
};

export function SegmentedTabs({
  items,
  className,
  ariaLabel = "Tabs",
}: SegmentedTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        "inline-flex w-fit rounded-full border border-border-soft bg-bg-muted p-1",
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="tab"
          aria-selected={item.active}
          onClick={item.onClick}
          className={clsx(
            "rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
            item.active
              ? "bg-bg-surface text-text-primary shadow-[var(--shadow-card)]"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
