import {
  ACTIVE_MEMBERSHIPS,
  BOOKED_CLASSES,
  BOOKED_TABS,
} from "@/components/dashboard/data";
import {
  ActiveMembershipsSection,
  BookedClassesSection,
  DashboardTopNavigation,
} from "@/components/dashboard/organisms";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <DashboardTopNavigation activeNavId="my-passes" />

      <main className="w-full overflow-hidden bg-bg-surface px-4 py-6 md:rounded-[24px] md:px-16 md:py-10 lg:px-24 xl:px-[278px]">
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 md:gap-6">
            <header>
              <h1 className="text-[24px] md:text-[32px] leading-[1.4] font-semibold">
                My Passes
              </h1>
            </header>
            <ActiveMembershipsSection memberships={ACTIVE_MEMBERSHIPS} />
          </div>
          <BookedClassesSection tabs={BOOKED_TABS} classes={BOOKED_CLASSES} />
        </section>
      </main>
    </div>
  );
}
