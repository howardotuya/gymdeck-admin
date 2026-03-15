import type {
  Amenity,
  ClassCategory,
  ClassDay,
  ClassSession,
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

export const SCHEDULE_RANGE = "Nov 9 - Nov 15";

export const CLASS_DAYS: ClassDay[] = [
  { id: "wed", weekday: "Wed", dayNumber: 17 },
  { id: "sat", weekday: "Sat", dayNumber: 20 },
  { id: "fri", weekday: "Fri", dayNumber: 19, isActive: true },
  { id: "thu", weekday: "Thu", dayNumber: 18 },
  { id: "tue", weekday: "Tue", dayNumber: 16 },
  { id: "sun", weekday: "Sun", dayNumber: 21 },
  { id: "mon", weekday: "Mon", dayNumber: 15 },
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

export const DESKTOP_PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly Subscription",
    price: "₦15,000",
    suffix: "/month",
    featured: true,
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
  },
  {
    id: "session-pack",
    name: "Session Pack",
    price: "₦36,000",
    suffix: "for 6 sessions",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
  },
  {
    id: "single-visit",
    name: "Single Visit Pass",
    price: "₦8,000",
    suffix: "per visit",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
  },
];

export const MOBILE_PLANS: Plan[] = [
  {
    id: "weekly-1",
    name: "1 Week Pass",
    price: "₦30,000",
    suffix: "",
    featured: true,
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
  },
  {
    id: "weekly-2",
    name: "1 Week Pass",
    price: "₦30,000",
    suffix: "",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
  },
  {
    id: "weekly-3",
    name: "1 Week Pass",
    price: "₦30,000",
    suffix: "",
    features: ["Access to all equipment", "Locker Included", "Wifi Access"],
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
  { stars: 5, widthPercent: 92 },
  { stars: 4, widthPercent: 62 },
  { stars: 3, widthPercent: 0 },
  { stars: 2, widthPercent: 0 },
  { stars: 1, widthPercent: 0 },
];
