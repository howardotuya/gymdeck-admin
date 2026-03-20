import clsx from "clsx";
import { TabButton } from "@/components/home/atoms";
import type { HomeTab, HomeTabId } from "@/components/home/types";

type GymTabsProps = {
  tabs: HomeTab[];
  activeTab: HomeTabId;
  onTabChange: (tab: HomeTabId) => void;
  className?: string;
};

export function GymTabs({ activeTab, className, onTabChange, tabs }: GymTabsProps) {
  return (
    <div
      className={clsx(
        "overflow-x-auto border-b border-border-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div className="inline-flex min-w-max items-center gap-5">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
            aria-current={tab.id === activeTab ? "page" : undefined}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  );
}
