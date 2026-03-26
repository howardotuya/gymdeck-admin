import type {
  BranchClassAssignment,
  BranchDetail,
  BranchPlanAssignment,
  BranchPublicListingViewModel,
  BranchScheduledSession,
} from "./types";
import { branches, getBranchBySlug, getBranchPublicListingViewModel } from "./data";

export type PublicBranchTabId = "overview" | "schedule" | "pricing" | "reviews";

export type PublicBranchPageData = BranchPublicListingViewModel & {
  headline: string;
  coordinates?: BranchDetail["identity"]["coordinates"];
  socialLinks: BranchDetail["socialLinks"];
  featuredPlan?: BranchPlanAssignment;
  visiblePlans: BranchPlanAssignment[];
  visibleClasses: BranchClassAssignment[];
  sessions: BranchScheduledSession[];
  sessionsByWeekday: Array<{
    weekday: string;
    sessions: BranchScheduledSession[];
  }>;
  externalReviewLinks: BranchDetail["reputation"]["externalReviewLinks"];
  isDiscoverable: boolean;
};

const weekdayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function sortByDisplayOrder<TItem extends { displayOrder?: number }>(items: TItem[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER));
}

function sortSessions(sessions: BranchScheduledSession[]) {
  return [...sessions].sort((a, b) => {
    const weekdayComparison = weekdayOrder.indexOf(a.weekday as (typeof weekdayOrder)[number]) -
      weekdayOrder.indexOf(b.weekday as (typeof weekdayOrder)[number]);

    if (weekdayComparison !== 0) {
      return weekdayComparison;
    }

    return a.startTime.localeCompare(b.startTime);
  });
}

export function getPublicBranchPageDataBySlug(slug: string): PublicBranchPageData | null {
  const branch = getBranchBySlug(slug);
  const listing = getBranchPublicListingViewModel(
    branch?.id ?? "",
  );

  if (!branch || !listing) {
    return null;
  }

  const visiblePlans = sortByDisplayOrder(
    branch.commerce.plans.filter((plan) => plan.visible !== false),
  );
  const visibleClasses = sortByDisplayOrder(
    branch.programming.classTypes.filter((gymClass) => gymClass.visible !== false),
  );
  const sessions = sortSessions(branch.programming.sessions);

  return {
    ...listing,
    headline: branch.publicProfile.headline,
    coordinates: branch.identity.coordinates,
    socialLinks: { ...branch.socialLinks },
    featuredPlan:
      visiblePlans.find((plan) => plan.featured) ??
      visiblePlans.find((plan) => plan.id === branch.commerce.preferredPlanId) ??
      visiblePlans[0],
    visiblePlans,
    visibleClasses,
    sessions,
    sessionsByWeekday: weekdayOrder.map((weekday) => ({
      weekday,
      sessions: sessions.filter((session) => session.weekday === weekday),
    })),
    externalReviewLinks: branch.reputation.externalReviewLinks.map((item) => ({ ...item })),
    isDiscoverable: branch.publishing.isDiscoverable,
  };
}

export function getPublicBranchesIndex() {
  return branches
    .map((branch) => getBranchPublicListingViewModel(branch.id))
    .filter((item): item is BranchPublicListingViewModel => Boolean(item))
    .map((listing) => getPublicBranchPageDataBySlug(listing.slug))
    .filter((item): item is PublicBranchPageData => Boolean(item))
    .filter((branch) => branch.isDiscoverable);
}
