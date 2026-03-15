"use client";

import { useMemo, useState } from "react";
import {
  AMENITIES,
  CLASS_CATEGORIES,
  CLASS_DAYS,
  CLASS_SESSIONS,
  DESKTOP_PLANS,
  GALLERY_IMAGES,
  GYM_NAME,
  GYM_RATING,
  GYM_REVIEW_COUNT,
  HOME_TABS,
  MOBILE_PLANS,
  OVERVIEW_COPY,
  REVIEW_DISTRIBUTION,
  REVIEWS,
  RULES,
  SCHEDULE_RANGE,
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
import type { HomeTabId } from "@/components/home/types";

const DEFAULT_TAB: HomeTabId = "overview";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTabId>(DEFAULT_TAB);

  const content = useMemo(() => {
    if (activeTab === "schedule") {
      return (
        <ScheduleClassesSection
          days={CLASS_DAYS}
          categories={CLASS_CATEGORIES}
          sessions={CLASS_SESSIONS}
          weekRange={SCHEDULE_RANGE}
        />
      );
    }

    if (activeTab === "pricing") {
      return <PricingSection desktopPlans={DESKTOP_PLANS} mobilePlans={MOBILE_PLANS} />;
    }

    if (activeTab === "reviews") {
      return (
        <ReviewsSection
          distribution={REVIEW_DISTRIBUTION}
          overallRating="4.7"
          overallReviewCount={GYM_REVIEW_COUNT}
          reviews={REVIEWS}
        />
      );
    }

    return <OverviewSection amenities={AMENITIES} overviewText={OVERVIEW_COPY} rules={RULES} />;
  }, [activeTab]);

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
                <GymTabs tabs={HOME_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
              </header>

              {content}
            </div>

            <aside className="hidden space-y-8 md:sticky md:top-[104px] md:block">
              <PriceCard price={desktopPrice} suffix="/month" />
              <LocationCard />
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
