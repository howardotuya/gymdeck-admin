export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
};

export type MembershipCard = {
  id: string;
  badge: string;
  title: string;
  gymName: string;
  validUntil: string;
  renewedUntil: string;
  renewalPriceLabel: string;
  classesRemaining: string;
  progressPercent: number;
  imageSrc: string;
};

export type BookedTabId = "upcoming" | "past" | "cancelling";

export type BookedTab = {
  id: BookedTabId;
  label: string;
};

export type BookedClass = {
  id: string;
  status: BookedTabId;
  badge: string;
  spotsLeft: string;
  title: string;
  category: string;
  location: string;
  schedule: string;
};

export type MembershipHistoryStatus = "active" | "completed";

export type MembershipHistoryRecord = {
  id: string;
  gym: string;
  plan: string;
  period: string;
  cost: string;
  status: MembershipHistoryStatus;
};
