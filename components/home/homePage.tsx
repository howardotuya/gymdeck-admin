"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AMENITIES,
  CLASS_CATEGORIES,
  CLASS_SESSIONS,
  DESKTOP_PLANS,
  GALLERY_IMAGES,
  GYM_NAME,
  GYM_LOCATION,
  GYM_RATING,
  GYM_REVIEW_COUNT,
  HOME_TABS,
  MOBILE_PLANS,
  OVERVIEW_COPY,
  REVIEW_DISTRIBUTION,
  REVIEWS,
  RULES,
} from "@/components/home/data";
import { GymTabs, LocationCard, PriceCard, RatingInline } from "@/components/home/molecules";
import {
  DesktopTopNavigation,
  GymGallery,
  MobileTopNavigation,
  OverviewSection,
  PageActions,
  PricingSection,
  ReviewsSection,
  ScheduleClassesSection,
} from "@/components/home/organisms";
import type { ClassDay, HomeTabId } from "@/components/home/types";

const DEFAULT_TAB: HomeTabId = "overview";
const DAYS_IN_WEEK = 7;
const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
});
const TAB_IDS = new Set<HomeTabId>(HOME_TABS.map((tab) => tab.id));

function getTabFromUrl(tabParam: string | null): HomeTabId {
  if (!tabParam || !TAB_IDS.has(tabParam as HomeTabId)) {
    return DEFAULT_TAB;
  }

  return tabParam as HomeTabId;
}

function normalizeToLocalNoon(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0,
    0,
  );
}

function addLocalDays(baseDate: Date, daysToAdd: number) {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  return normalizeToLocalNoon(nextDate);
}

function getLocalWeekStart(date: Date) {
  const dayOfWeek = date.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % DAYS_IN_WEEK;
  return addLocalDays(date, -daysSinceMonday);
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatWeekRange(startDate: Date, endDate: Date) {
  const startMonth = MONTH_FORMATTER.format(startDate);
  const endMonth = MONTH_FORMATTER.format(endDate);
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

export function HomePage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClassDate, setSelectedClassDate] = useState<Date>(
    () => normalizeToLocalNoon(new Date()),
  );
  const activeTab = getTabFromUrl(searchParams.get("tab"));

  const selectedClassDateKey = getDateKey(selectedClassDate);
  const classWeekStart = getLocalWeekStart(selectedClassDate);
  const classWeekEnd = addLocalDays(classWeekStart, DAYS_IN_WEEK - 1);
  const classWeekRange = formatWeekRange(classWeekStart, classWeekEnd);

  const classDays: ClassDay[] = Array.from({ length: DAYS_IN_WEEK }, (_, dayOffset) => {
    const date = addLocalDays(classWeekStart, dayOffset);
    const dateKey = getDateKey(date);

    return {
      id: dateKey,
      date,
      weekday: WEEKDAY_FORMATTER.format(date),
      dayNumber: date.getDate(),
      isActive: dateKey === selectedClassDateKey,
    };
  });

  const handlePreviousWeek = () => {
    setSelectedClassDate((currentDate) => addLocalDays(currentDate, -DAYS_IN_WEEK));
  };

  const handleNextWeek = () => {
    setSelectedClassDate((currentDate) => addLocalDays(currentDate, DAYS_IN_WEEK));
  };

  const handleDaySelect = (day: ClassDay) => {
    setSelectedClassDate(day.date);
  };

  const handleTabChange = (tab: HomeTabId) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("tab", tab);

    const nextSearch = nextParams.toString();
    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;

    router.push(nextUrl, { scroll: false });
  };

  let content = <OverviewSection amenities={AMENITIES} overviewText={OVERVIEW_COPY} rules={RULES} />;

  if (activeTab === "schedule") {
    content = (
      <ScheduleClassesSection
        categories={CLASS_CATEGORIES}
        days={classDays}
        sessions={CLASS_SESSIONS}
        weekRange={classWeekRange}
        selectedDate={selectedClassDate}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onDaySelect={handleDaySelect}
      />
    );
  } else if (activeTab === "pricing") {
    content = <PricingSection desktopPlans={DESKTOP_PLANS} mobilePlans={MOBILE_PLANS} />;
  } else if (activeTab === "reviews") {
    content = (
      <ReviewsSection
        distribution={REVIEW_DISTRIBUTION}
        overallRating="4.7"
        overallReviewCount={GYM_REVIEW_COUNT}
        reviews={REVIEWS}
      />
    );
  }

  const desktopPrice = activeTab === "pricing" ? "₦15,000" : "₦32,000";

  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <DesktopTopNavigation />
      <MobileTopNavigation />

      <main className="mx-auto w-full max-w-[1440px] pb-24 md:px-6 md:py-6">
        <div className="hidden items-center justify-between pb-6 md:flex">
          <h1 className="text-[24px] leading-[1.4] font-semibold text-text-primary">{GYM_NAME}</h1>
          <PageActions />
        </div>

        <div className="relative z-0">
          <GymGallery images={GALLERY_IMAGES} />
        </div>

        <section className="relative z-10 -mt-[142px] overflow-hidden rounded-t-[24px] bg-bg-surface px-4 pb-8 pt-5 md:mt-8 md:overflow-visible md:rounded-none md:bg-transparent md:px-0 md:pb-0 md:pt-0">
          <div className="grid gap-8 md:grid-cols-[minmax(0,874px)_471px] md:items-start md:gap-8">
            <div className="min-w-0 space-y-8">
              <header className="space-y-6 md:space-y-8">
                <div className="space-y-1 md:space-y-2">
                  <h2 className="text-[20px] leading-[1.4] font-semibold text-text-primary md:text-[32px]">
                    {GYM_NAME}
                  </h2>
                  <RatingInline rating={GYM_RATING} reviewCount={GYM_REVIEW_COUNT} />
                </div>
                <GymTabs tabs={HOME_TABS} activeTab={activeTab} onTabChange={handleTabChange} />
              </header>

              {content}
            </div>

            <aside className="hidden space-y-8 md:sticky md:top-[104px] md:block">
              <PriceCard price={desktopPrice} suffix="/month" />
              <LocationCard location={GYM_LOCATION} />
            </aside>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-soft bg-bg-surface px-3 py-2 md:hidden">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3">
          <p className="text-[20px] leading-[1.4] font-semibold text-text-primary">
            ₦32,000
            <span className="ml-1 text-[12px] leading-[1.4] font-normal text-text-support">/month</span>
          </p>
          <button
            type="button"
            className="inline-flex h-[49px] min-w-[125px] items-center justify-center rounded-full bg-brand-primary px-6 text-[14px] font-medium leading-[1.4] text-text-inverse transition-colors hover:bg-brand-primary-hover"
          >
            See Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
