import type {
  BookedClass,
  BookedTab,
  DashboardNavItem,
  MembershipCard,
  MembershipHistoryRecord,
} from "@/components/dashboard/types";

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: "discover", label: "Discover", href: "/" },
  { id: "my-passes", label: "My Passes", href: "/dashboard" },
];

export const DASHBOARD_SEARCH_PLACEHOLDER = "Search gyms, locations...";
export const DASHBOARD_LOCATION_LABEL = "Victoria Island, Lagos";

export const MEMBERSHIP_HISTORY_LABEL = "View Membership History";

export const ACTIVE_MEMBERSHIPS: MembershipCard[] = [
  {
    id: "membership-1",
    badge: "MEMBERSHIP",
    title: "Premium Monthly Pass",
    gymName: "FitZone Victoria Island",
    validUntil: "March 31, 2024",
    renewedUntil: "April 30, 2025",
    renewalPriceLabel: "NGN 36,000",
    classesRemaining: "12 of 20",
    progressPercent: 55.4,
    imageSrc: "/assets/temp-gym-image.jpg",
  },
  {
    id: "membership-2",
    badge: "MEMBERSHIP",
    title: "Premium Monthly Pass",
    gymName: "FitZone Victoria Island",
    validUntil: "March 31, 2024",
    renewedUntil: "April 30, 2025",
    renewalPriceLabel: "NGN 36,000",
    classesRemaining: "12 of 20",
    progressPercent: 55.4,
    imageSrc: "/assets/temp-gym-image.jpg",
  },
  {
    id: "membership-3",
    badge: "MEMBERSHIP",
    title: "Premium Monthly Pass",
    gymName: "FitZone Victoria Island",
    validUntil: "March 31, 2024",
    renewedUntil: "April 30, 2025",
    renewalPriceLabel: "NGN 36,000",
    classesRemaining: "12 of 20",
    progressPercent: 55.4,
    imageSrc: "/assets/temp-gym-image.jpg",
  },
];

export const BOOKED_TABS: BookedTab[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelling", label: "Cancelling" },
];

export const BOOKED_CLASSES: BookedClass[] = [
  {
    id: "booked-class-1",
    status: "upcoming",
    badge: "CLASS",
    spotsLeft: "3 spots left",
    title: "Zumba’s Yoga Sesh",
    category: "Yoga Class",
    location: "FitZone Multipurpose Gym",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
  },
  {
    id: "booked-class-2",
    status: "upcoming",
    badge: "CLASS",
    spotsLeft: "3 spots left",
    title: "Zumba’s Yoga Sesh",
    category: "Yoga Class",
    location: "FitZone Multipurpose Gym",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
  },
  {
    id: "booked-class-3",
    status: "upcoming",
    badge: "CLASS",
    spotsLeft: "3 spots left",
    title: "Zumba’s Yoga Sesh",
    category: "Yoga Class",
    location: "FitZone Multipurpose Gym",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
  },
  {
    id: "booked-class-4",
    status: "past",
    badge: "CLASS",
    spotsLeft: "Completed",
    title: "HIIT Strength Burst",
    category: "HIIT Class",
    location: "FitZone Multipurpose Gym",
    schedule: "Tuesday, Nov 26 | 7:30 - 8:30 AM",
  },
];

export const MEMBERSHIP_HISTORY_ROWS: MembershipHistoryRecord[] = [
  {
    id: "membership-history-1",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "active",
  },
  {
    id: "membership-history-2",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "completed",
  },
  {
    id: "membership-history-3",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "completed",
  },
  {
    id: "membership-history-4",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "completed",
  },
  {
    id: "membership-history-5",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "completed",
  },
  {
    id: "membership-history-6",
    gym: "FitZone Victoria Island",
    plan: "Premium Monthly Pass",
    period: "Jan 01, 2024 - Jan 21, 2024",
    cost: "NGN 32,000",
    status: "completed",
  },
];
