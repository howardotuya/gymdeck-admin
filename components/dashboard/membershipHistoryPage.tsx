import { MEMBERSHIP_HISTORY_ROWS } from "@/components/dashboard/data";
import { MembershipHistoryBreadcrumb } from "@/components/dashboard/molecules";
import {
  DashboardTopNavigation,
  MembershipHistorySection,
} from "@/components/dashboard/organisms";

const MEMBERSHIP_HISTORY_BREADCRUMB = [
  { label: "My Passes" },
  { label: "Membership History", active: true },
];

export function MembershipHistoryPage() {
  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <DashboardTopNavigation activeNavId="my-passes" />

      <main className="w-full overflow-hidden bg-bg-surface px-4 py-5 md:rounded-[24px] md:px-16 md:py-10 lg:px-24 xl:px-[278px]">
        <section className="flex flex-col gap-6 md:gap-10">
          <MembershipHistoryBreadcrumb items={MEMBERSHIP_HISTORY_BREADCRUMB} />
          <MembershipHistorySection memberships={MEMBERSHIP_HISTORY_ROWS} />
        </section>
      </main>
    </div>
  );
}
