"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { OverviewCard } from "@/components/ui";
import {
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import type { PublicBranchPageData, PublicBranchTabId } from "./publicBranchSelectors";

type PublicBranchPageProps = {
  branch: PublicBranchPageData;
};

const publicTabs: Array<{ id: PublicBranchTabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "schedule", label: "Schedule & Classes" },
  { id: "pricing", label: "Pricing" },
  { id: "reviews", label: "Reviews" },
];

const mapsBaseUrl = "https://www.google.com/maps";

function getTabFromQuery(value: string | null): PublicBranchTabId {
  if (value === "schedule" || value === "pricing" || value === "reviews") {
    return value;
  }

  return "overview";
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

function getDirectionsUrl(branch: PublicBranchPageData) {
  const params = new URLSearchParams({
    api: "1",
    destination: branch.coordinates
      ? `${branch.coordinates.lat},${branch.coordinates.lng}`
      : branch.address,
    travelmode: "driving",
  });

  return `${mapsBaseUrl}/dir/?${params.toString()}`;
}

function getMapEmbedUrl(branch: PublicBranchPageData) {
  if (branch.coordinates) {
    const params = new URLSearchParams({
      q: `${branch.coordinates.lat},${branch.coordinates.lng}`,
      output: "embed",
    });

    return `${mapsBaseUrl}?${params.toString()}`;
  }

  const params = new URLSearchParams({
    q: `${branch.name}, ${branch.address}`,
    output: "embed",
  });

  return `${mapsBaseUrl}?${params.toString()}`;
}

function splitPrice(priceLabel?: string, cadenceLabel?: string) {
  if (!priceLabel) {
    return {
      amount: "Pricing on request",
      cadence: cadenceLabel ?? "",
    };
  }

  return {
    amount: priceLabel,
    cadence: cadenceLabel ?? "",
  };
}

function buildPlanFeatures(branch: PublicBranchPageData, planName: string) {
  const baseAmenities = branch.amenities.slice(0, 3).map((item) => item.label);

  return [
    `${branch.visibleClasses.length} class formats available`,
    ...baseAmenities,
    `Best for ${planName.toLowerCase()} members`,
  ].slice(0, 4);
}

function PublicTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "border-b-2 px-1 pb-4 text-[15px] transition-colors",
        active
          ? "border-border-brand font-semibold text-text-brand"
          : "border-transparent text-text-secondary hover:text-text-primary",
      )}
    >
      {label}
    </button>
  );
}

function OverviewTab({ branch }: { branch: PublicBranchPageData }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-text-primary">Overview</h3>
        <p className="text-[16px] leading-[1.75] text-text-secondary">{branch.overviewLong}</p>
      </div>

      <div className="space-y-4">
        <h4 className="text-[18px] font-semibold text-text-primary">Amenities</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {branch.amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4 text-[14px] text-text-primary"
            >
              {amenity.label}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[18px] font-semibold text-text-primary">Gym rules & etiquette</h4>
        <div className="space-y-3">
          {branch.rules.map((rule) => (
            <article
              key={rule.id}
              className="rounded-[20px] border border-border-soft bg-bg-muted px-5 py-5"
            >
              <p className="text-[16px] font-semibold text-text-primary">{rule.title}</p>
              {rule.details ? (
                <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">{rule.details}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      {Object.values(branch.socialLinks).some(Boolean) ? (
        <div className="space-y-4">
          <h4 className="text-[18px] font-semibold text-text-primary">Social links</h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(branch.socialLinks)
              .filter(([, value]) => Boolean(value))
              .map(([platform, href]) => (
                <a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={secondaryActionClassName}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ScheduleTab({ branch }: { branch: PublicBranchPageData }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-text-primary">
          Weekly class schedule
        </h3>
        <p className="text-[16px] leading-[1.75] text-text-secondary">
          Browse the current timetable for {branch.name}, grouped by weekday and powered directly from branch programming.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
          All classes
        </span>
        {branch.visibleClasses.map((item) => (
          <span
            key={item.id}
            className="inline-flex rounded-full border border-border-soft bg-bg-muted px-3 py-1.5 text-[12px] font-semibold text-text-secondary"
          >
            {item.name}
          </span>
        ))}
      </div>

      <div className="space-y-5">
        {branch.sessionsByWeekday.map(({ weekday, sessions }) => (
          <section key={weekday} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[18px] font-semibold text-text-primary">{weekday}</h4>
              <p className="text-[13px] text-text-secondary">
                {sessions.length ? `${sessions.length} sessions` : "No sessions"}
              </p>
            </div>

            {sessions.length ? (
              <div className="grid gap-3">
                {sessions.map((session) => (
                  <article
                    key={session.id}
                    className="rounded-[22px] border border-border-soft bg-bg-muted px-5 py-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[16px] font-semibold text-text-primary">{session.title}</p>
                        <p className="mt-1 text-[14px] text-text-secondary">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)} with {session.coach}
                        </p>
                      </div>
                      <span
                        className={clsx(
                          "inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold",
                          session.bookingState === "open" && "bg-bg-brand-soft text-text-brand",
                          session.bookingState === "waitlist" &&
                            "bg-bg-warning-soft text-text-warning",
                          session.bookingState === "closed" && "bg-bg-muted text-text-secondary",
                        )}
                      >
                        {session.bookingState === "open"
                          ? "Open"
                          : session.bookingState === "waitlist"
                            ? "Waitlist"
                            : "Closed"}
                      </span>
                    </div>
                    <p className="mt-3 text-[14px] leading-[1.65] text-text-secondary">
                      Capacity {session.capacity}. {branch.visibleClasses.find((item) => item.id === session.classId)?.coachHighlight ?? "Branch-led coached session."}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-dashed border-border-soft px-4 py-5 text-[14px] text-text-secondary">
                No public sessions are scheduled for {weekday.toLowerCase()} yet.
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}

function PricingTab({ branch }: { branch: PublicBranchPageData }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-text-primary">Choose your plan</h3>
        <p className="text-[16px] leading-[1.75] text-text-secondary">
          Select from branch-visible plans managed in the branch workspace.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {branch.visiblePlans.map((plan) => {
          const price = splitPrice(plan.priceLabel, plan.cadenceLabel);

          return (
            <article
              key={plan.id}
              className="overflow-hidden rounded-[24px] border border-border-soft bg-bg-muted p-1"
            >
              <div className="space-y-3 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[16px] font-semibold text-text-primary">{plan.name}</p>
                  {plan.featured ? (
                    <span className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="text-[32px] font-semibold tracking-[-0.04em] text-text-primary">
                  {price.amount}
                  {price.cadence ? (
                    <span className="ml-1 text-[14px] font-normal tracking-normal text-text-secondary">
                      {price.cadence}
                    </span>
                  ) : null}
                </p>
                <p className="text-[14px] leading-[1.65] text-text-secondary">
                  {plan.audienceNote ?? plan.detail}
                </p>
              </div>

              <div className="rounded-[20px] bg-bg-surface px-5 py-6">
                <ul className="space-y-3">
                  {buildPlanFeatures(branch, plan.name).map((feature) => (
                    <li key={`${plan.id}-${feature}`} className="text-[14px] text-text-secondary">
                      {feature}
                    </li>
                  ))}
                </ul>
                <button type="button" className={clsx(primaryActionClassName, "mt-6 w-full")}>
                  Select plan
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReviewsTab({ branch }: { branch: PublicBranchPageData }) {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[24px] font-semibold tracking-[-0.03em] text-text-primary">Branch reviews</h3>
        <p className="text-[16px] leading-[1.75] text-text-secondary">
          Published review content and distribution powered by branch reputation data.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
        <div className="space-y-3">
          <p className="text-[48px] font-semibold tracking-[-0.05em] text-text-primary">
            {branch.reviewAverage.toFixed(1)}
          </p>
          <p className="text-[14px] text-text-secondary">{branch.reviewCount} reviews</p>
        </div>

        <div className="space-y-2">
          {branch.reviewSummary.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="w-4 text-[14px] text-text-primary">{item.stars}</span>
              <div className="h-2 flex-1 rounded-full bg-bg-muted">
                <div
                  className="h-2 rounded-full bg-brand-primary"
                  style={{ width: `${item.widthPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {branch.externalReviewLinks.length ? (
        <div className="flex flex-wrap gap-3">
          {branch.externalReviewLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={secondaryActionClassName}
            >
              {item.label}
            </a>
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        {branch.reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-[22px] border border-border-soft bg-bg-muted px-5 py-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[18px] font-semibold text-text-primary">{review.title}</p>
                <p className="mt-1 text-[14px] text-text-secondary">
                  {review.author} · {review.postedAt}
                </p>
              </div>
              <span className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
                {review.rating.toFixed(1)} / 5
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-[1.75] text-text-secondary">{review.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Sidebar({ branch }: { branch: PublicBranchPageData }) {
  const featuredPrice = splitPrice(
    branch.featuredPlan?.priceLabel,
    branch.featuredPlan?.cadenceLabel,
  );

  return (
    <aside className="space-y-6 md:sticky md:top-[104px]">
      <div className="rounded-[24px] bg-bg-muted p-5">
        <p className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary">
          {featuredPrice.amount}
          {featuredPrice.cadence ? (
            <span className="ml-1 text-[14px] font-normal tracking-normal text-text-secondary">
              {featuredPrice.cadence}
            </span>
          ) : null}
        </p>
        <button type="button" className={clsx(primaryActionClassName, "mt-5 w-full rounded-full")}>
          See pricing
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-[20px] font-semibold text-text-primary">Location & directions</h4>
          <p className="text-[14px] leading-[1.6] text-text-secondary">{branch.address}</p>
        </div>

        <div className="relative h-[275px] overflow-hidden rounded-[20px] bg-bg-muted">
          <iframe
            title={`${branch.name} map`}
            src={getMapEmbedUrl(branch)}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>

        <a
          href={getDirectionsUrl(branch)}
          target="_blank"
          rel="noreferrer"
          className={clsx(secondaryActionClassName, "w-full rounded-full")}
        >
          Get directions
        </a>
      </div>
    </aside>
  );
}

export function PublicBranchPage({ branch }: PublicBranchPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getTabFromQuery(searchParams.get("tab"));
  const galleryImages = useMemo(
    () => [branch.heroImageUrl, ...branch.featuredGalleryImageUrls, ...branch.galleryImages]
      .filter((item): item is string => Boolean(item))
      .slice(0, 5),
    [branch.featuredGalleryImageUrls, branch.galleryImages, branch.heroImageUrl],
  );

  const setActiveTab = (tab: PublicBranchTabId) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (tab === "overview") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }

    const nextSearch = nextParams.toString();
    router.push(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
  };

  let content = <OverviewTab branch={branch} />;

  if (activeTab === "schedule") {
    content = <ScheduleTab branch={branch} />;
  } else if (activeTab === "pricing") {
    content = <PricingTab branch={branch} />;
  } else if (activeTab === "reviews") {
    content = <ReviewsTab branch={branch} />;
  }

  return (
    <div className="min-h-screen bg-bg-surface text-text-primary">
      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/branches" className={secondaryActionClassName}>
            Back to workspace
          </Link>
          <div className="flex flex-wrap gap-3">
            {Object.values(branch.socialLinks).some(Boolean) ? (
              <span className="inline-flex items-center rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
                {Object.values(branch.socialLinks).filter(Boolean).length} social links
              </span>
            ) : null}
            <span className="inline-flex items-center rounded-full bg-bg-muted px-3 py-1.5 text-[12px] font-semibold text-text-secondary">
              {branch.reviewAverage.toFixed(1)} rating
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-text-primary md:text-[32px]">
              {branch.name}
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.6fr)]">
            {galleryImages[0] ? (
              <div className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-bg-muted md:min-h-[440px]">
                <Image
                  src={galleryImages[0]}
                  alt={`${branch.name} hero media`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 65vw"
                />
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(1, 5).map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="relative min-h-[144px] overflow-hidden rounded-[24px] bg-bg-muted md:min-h-[212px]"
                >
                  <Image
                    src={imageUrl}
                    alt={`${branch.name} gallery ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_380px]">
            <div className="min-w-0 space-y-8">
              <header className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[20px] font-semibold tracking-[-0.03em] text-text-primary md:text-[36px]">
                    {branch.name}
                  </p>
                  <p className="text-[15px] leading-[1.7] text-text-secondary">{branch.headline}</p>
                  <p className="text-[15px] leading-[1.7] text-text-secondary">{branch.overviewShort}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand">
                    {branch.reviewAverage.toFixed(1)} ({branch.reviewCount} reviews)
                  </span>
                  <span className="inline-flex rounded-full bg-bg-muted px-3 py-1.5 text-[12px] font-semibold text-text-secondary">
                    {branch.visiblePlans.length} plans
                  </span>
                  <span className="inline-flex rounded-full bg-bg-muted px-3 py-1.5 text-[12px] font-semibold text-text-secondary">
                    {branch.visibleClasses.length} class types
                  </span>
                </div>

                <div className="flex gap-6 overflow-x-auto border-b border-border-soft">
                  {publicTabs.map((tab) => (
                    <PublicTabButton
                      key={tab.id}
                      label={tab.label}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))}
                </div>
              </header>

              <div className="grid gap-4 md:grid-cols-3">
                <OverviewCard
                  label="Featured plan"
                  value={branch.featuredPlan?.name ?? "Not set"}
                  detail={branch.featuredPlan?.detail ?? "No featured plan is configured yet"}
                />
                <OverviewCard
                  label="Weekly sessions"
                  value={branch.sessions.length.toString()}
                  detail="Visible branch timetable sessions"
                />
                <OverviewCard
                  label="Gallery"
                  value={branch.galleryImages.length.toString()}
                  detail="Images attached to this branch listing"
                />
              </div>

              {content}
            </div>

            <Sidebar branch={branch} />
          </section>
        </div>
      </main>
    </div>
  );
}
