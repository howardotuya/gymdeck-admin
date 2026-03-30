import clsx from "clsx";
import Link from "next/link";

export type NavTabItem = {
  href: string;
  label: string;
  active?: boolean;
};

type NavTabsProps = {
  tabs: NavTabItem[];
  className?: string;
  ariaLabel?: string;
};

export function NavTabs({ tabs, className, ariaLabel = "Tabs" }: NavTabsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={clsx(
        "scrollbar-hidden overflow-x-auto border-b border-border-soft pt-2",
        className,
      )}
    >
      <div className="flex min-w-max items-center gap-8">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
            className={clsx(
              "inline-flex min-h-12 items-center border-b-2 px-2 pt-1 font-medium tracking-[-0.03em] transition-colors",
              tab.active
                ? "border-text-brand text-text-brand"
                : "border-transparent text-text-secondary hover:text-text-primary",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
