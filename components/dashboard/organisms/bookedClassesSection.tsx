"use client";

import { useMemo, useState } from "react";
import { DashboardTabButton, TagPill } from "@/components/dashboard/atoms";
import { ClassMetaRow } from "@/components/dashboard/molecules";
import type { BookedClass, BookedTab, BookedTabId } from "@/components/dashboard/types";
import { ArrowDownSLineIcon, ArrowRightSLineIcon, Filter3LineIcon } from "@/components/icons";

type BookedClassesSectionProps = {
  tabs: BookedTab[];
  classes: BookedClass[];
};

export function BookedClassesSection({ classes, tabs }: BookedClassesSectionProps) {
  const [activeTab, setActiveTab] = useState<BookedTabId>(tabs[0]?.id ?? "upcoming");

  const filteredClasses = useMemo(
    () => classes.filter((bookedClass) => bookedClass.status === activeTab),
    [activeTab, classes],
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[20px] leading-[1.4] font-semibold text-text-primary">Booked Classes</h2>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-1 rounded-full bg-bg-control px-4 text-[14px] leading-[1.4] text-text-support transition-colors hover:bg-bg-subtle"
        >
          <Filter3LineIcon className="size-4" />
          Filter by category
          <ArrowDownSLineIcon className="size-4" />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto border-b border-border-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-max items-center gap-5">
            {tabs.map((tab) => (
              <DashboardTabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
              </DashboardTabButton>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((bookedClass) => (
              <article
                key={bookedClass.id}
                className="space-y-6 rounded-2xl border border-border-subtle bg-bg-muted p-5 md:p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3">
                      <TagPill variant="purple">{bookedClass.badge}</TagPill>
                      <p className="text-[12px] leading-none font-medium text-text-secondary">
                        {bookedClass.spotsLeft}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[18px] leading-[1.4] font-semibold text-text-emphasis">
                        {bookedClass.title}
                      </h3>
                      <p className="text-[14px] leading-[1.4] font-medium text-text-secondary">
                        {bookedClass.category}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 self-start text-[14px] leading-none font-semibold text-text-brand transition-colors hover:text-brand-primary"
                  >
                    View Details
                    <ArrowRightSLineIcon className="size-5 text-text-brand" />
                  </button>
                </div>

                <ClassMetaRow location={bookedClass.location} schedule={bookedClass.schedule} />
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-border-soft bg-bg-surface p-8 text-center text-[14px] leading-[1.4] text-text-secondary">
              No classes in this tab yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
