import type {
  Amenity,
  ClassCategory,
  ClassSession,
  GymLocation,
  HomeTab,
  Plan,
  RatingDistribution,
  Review,
  RuleItem,
} from "./types";

export const HOME_TABS: HomeTab[] = [
  { id: "overview", label: "Overview" },
  { id: "schedule", label: "Schedule & Classes" },
  { id: "pricing", label: "Pricing" },
  { id: "reviews", label: "Reviews" },
];

export const GYM_NAME = "FitZone Multipurpose Gym";
export const GYM_RATING = "4.8";
export const GYM_REVIEW_COUNT = 129;
export const GYM_IMAGE = "/assets/temp-gym-image.jpg";
export const GYM_LOCATION: GymLocation = {
  name: GYM_NAME,
  address: "Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  latitude: 6.4314,
  longitude: 3.4549,
};

export const GALLERY_IMAGES = [
  GYM_IMAGE,
  GYM_IMAGE,
  GYM_IMAGE,
  GYM_IMAGE,
  GYM_IMAGE,
];

export const OVERVIEW_COPY =
  "Discover nearby gyms and fitness studios effortlessly. Input your location to explore a variety of options, from weightlifting to yoga. Find the perfect workout environment that suits your needs and helps you achieve your fitness goals. Join a community of like-minded individuals and embark on a journey to a healthier lifestyle. Start your search now and unlock a world of fitness opportunities near you.";

export const AMENITIES: Amenity[] = [
  { id: "free-wifi-1", label: "Free Wi-Fi" },
  { id: "locker-rooms", label: "Secure Locker Rooms" },
  { id: "free-wifi-2", label: "Free Wi-Fi" },
  { id: "free-wifi-3", label: "Free Wi-Fi" },
  { id: "free-wifi-4", label: "Free Wi-Fi" },
  { id: "free-wifi-5", label: "Free Wi-Fi" },
];

export const RULES: RuleItem[] = [
  { id: "rule-1", title: "Wipe Down Equipment", details: OVERVIEW_COPY, expanded: true },
  { id: "rule-2", title: "Wipe Down Equipment" },
  { id: "rule-3", title: "Wipe Down Equipment" },
  { id: "rule-4", title: "Wipe Down Equipment" },
];

export const CLASS_CATEGORIES: ClassCategory[] = [
  { id: "all", label: "All Classes", isActive: true },
  { id: "yoga", label: "Yoga" },
  { id: "hiit", label: "HIIT" },
  { id: "cycling", label: "Cycling" },
  { id: "dance", label: "Dance" },
  { id: "pilates", label: "Pilates" },
  { id: "crossfit", label: "CrossFit" },
];

export const CLASS_SESSIONS: ClassSession[] = [
  {
    id: "session-1",
    badge: "Exclusive Class",
    title: "Zumba’s Yoga Sesh",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
    location: "FitZone Multipurpose Gym",
  },
  {
    id: "session-2",
    badge: "General Class",
    title: "Zumba’s Yoga Sesh",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
    location: "FitZone Multipurpose Gym",
  },
  {
    id: "session-3",
    badge: "General Class",
    title: "Zumba’s Yoga Sesh",
    schedule: "Friday, Dec 05 | 6:30 - 7:30 AM",
    location: "FitZone Multipurpose Gym",
  },
];

const DEFAULT_CANCELLATION_POLICY =
  "Cancel at least 24 hours before your next billing cycle to avoid renewal charges.";
const DEFAULT_REFUND_TERMS =
  "Refunds are only available within 24 hours of purchase if no session has been used.";

export const DESKTOP_PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Subscription",
    price: "NGN 15,000",
    suffix: "/month",
    featured: true,
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "Access to all gym facilities and equipment, locker access, and Wi-Fi.",
      cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
      refundTerms: DEFAULT_REFUND_TERMS,
      validityPeriod: "Your membership is valid for 30 days and renews monthly.",
    },
  },
  {
    id: "session-pack",
    name: "Session Pack",
    price: "NGN 36,000",
    suffix: "for 6 sessions",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "Six sessions with full access to gym facilities, locker, and Wi-Fi.",
      cancellationPolicy: "Session packs can be canceled before the first session is used.",
      refundTerms:
        "Unused session packs are refundable within 24 hours of purchase. Used sessions are non-refundable.",
      validityPeriod: "All 6 sessions must be used within 45 days of purchase.",
    },
  },
  {
    id: "single-visit",
    name: "Single Visit Pass",
    price: "NGN 8,000",
    suffix: "per visit",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "One-day access to all gym facilities and equipment.",
      cancellationPolicy: "Single visit passes can be canceled up to 2 hours before check-in.",
      refundTerms: "Single visit passes are refundable only if unused.",
      validityPeriod: "Valid for one check-in on the selected visit date.",
    },
  },
];

export const MOBILE_PLANS: Plan[] = [
  {
    id: "weekly-1",
    name: "1 Week Pass",
    price: "NGN 30,000",
    suffix: "",
    featured: true,
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "Unlimited access for 7 days, including gym facilities and locker access.",
      cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
      refundTerms: DEFAULT_REFUND_TERMS,
      validityPeriod: "Valid for 7 consecutive days from your first check-in.",
    },
  },
  {
    id: "weekly-2",
    name: "1 Week Pass",
    price: "NGN 30,000",
    suffix: "",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "Unlimited access for 7 days, including gym facilities and locker access.",
      cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
      refundTerms: DEFAULT_REFUND_TERMS,
      validityPeriod: "Valid for 7 consecutive days from your first check-in.",
    },
  },
  {
    id: "weekly-3",
    name: "1 Week Pass",
    price: "NGN 30,000",
    suffix: "",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
    reviewDetails: {
      included: "Unlimited access for 7 days, including gym facilities and locker access.",
      cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
      refundTerms: DEFAULT_REFUND_TERMS,
      validityPeriod: "Valid for 7 consecutive days from your first check-in.",
    },
  },
];

export const REVIEWS: Review[] = [
  {
    id: "review-1",
    title: "Gym Time",
    author: "Jane W.",
    postedAt: "3 days ago",
    text: "I've been a member for over a year and I love it here. The trainers are top-notch, and they offer a variety of classes to fit any schedule. Plus, the community is super supportive!",
  },
  {
    id: "review-2",
    title: "Great Atmosphere",
    author: "Jane W.",
    postedAt: "3 days ago",
    text: "I've been a member for over a year and I love it here. The trainers are top-notch, and they offer a variety of classes to fit any schedule. Plus, the community is super supportive!",
  },
  {
    id: "review-3",
    title: "Gym Time",
    author: "Jane W.",
    postedAt: "3 days ago",
    text: "I've been a member for over a year and I love it here. The trainers are top-notch, and they offer a variety of classes to fit any schedule. Plus, the community is super supportive!",
  },
  {
    id: "review-4",
    title: "Gym Time",
    author: "Jane W.",
    postedAt: "3 days ago",
    text: "I've been a member for over a year and I love it here. The trainers are top-notch, and they offer a variety of classes to fit any schedule. Plus, the community is super supportive!",
  },
];

export const REVIEW_DISTRIBUTION: RatingDistribution[] = [
  { stars: 5, widthPercent: 90.99 },
  { stars: 4, widthPercent: 65.32 },
  { stars: 3, widthPercent: 0 },
  { stars: 2, widthPercent: 0 },
  { stars: 1, widthPercent: 0 },
];
