import type { StatusTone } from "@/components/ui";
import type {
  BranchAmenity,
  Branch,
  BranchClassAssignment,
  BranchDetail,
  BranchEditableStaffMember,
  BranchExternalReviewLink,
  BranchFormState,
  BranchGallery,
  BranchGalleryMedia,
  BranchGalleryMediaType,
  BranchOffering,
  BranchOpeningHour,
  BranchPlanAssignment,
  BranchPublicListingViewModel,
  BranchPublicProfile,
  BranchPublishing,
  BranchRatingDistribution,
  BranchReputation,
  BranchReview,
  BranchRuleItem,
  BranchScheduledSession,
  BranchSocialLinks,
  BranchStaffMember,
  BranchStatus,
} from "./types";

type BranchPublishingSeed = {
  requestedDiscoverable?: boolean;
  isDiscoverable?: boolean;
  completenessScore?: number;
  lastPublishedAt?: string;
  pendingChecks?: string[];
};

export const branchStatusOptions: BranchStatus[] = [
  "Live",
  "Watch",
  "Opening soon",
  "Inactive",
];

export const branchCountryOptions = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "South Africa", label: "South Africa" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
] as const;

export const branchStateOptionsByCountry = {
  Nigeria: [
    { value: "Lagos", label: "Lagos" },
    { value: "Abuja", label: "Abuja" },
    { value: "Rivers", label: "Rivers" },
    { value: "Ogun", label: "Ogun" },
    { value: "Oyo", label: "Oyo" },
    { value: "Enugu", label: "Enugu" },
  ],
  Ghana: [
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Western", label: "Western" },
    { value: "Central", label: "Central" },
  ],
  Kenya: [
    { value: "Nairobi", label: "Nairobi" },
    { value: "Mombasa", label: "Mombasa" },
    { value: "Kiambu", label: "Kiambu" },
    { value: "Nakuru", label: "Nakuru" },
  ],
  "South Africa": [
    { value: "Gauteng", label: "Gauteng" },
    { value: "Western Cape", label: "Western Cape" },
    { value: "KwaZulu-Natal", label: "KwaZulu-Natal" },
    { value: "Eastern Cape", label: "Eastern Cape" },
  ],
  "United Kingdom": [
    { value: "England", label: "England" },
    { value: "Scotland", label: "Scotland" },
    { value: "Wales", label: "Wales" },
    { value: "Northern Ireland", label: "Northern Ireland" },
  ],
  "United States": [
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" },
    { value: "Florida", label: "Florida" },
  ],
} as const;

export const staffRoleOptions = [
  "Branch Manager",
  "Operations Lead",
  "Lead Trainer",
  "Trainer",
  "Front Desk Lead",
  "Operations Support",
] as const;

export const staffStatusOptions = [
  "Primary owner",
  "Opening shift",
  "Closing shift",
  "Weekend coverage",
  "Launch support",
] as const;

export const branchPlanOptions: Array<BranchOffering & { priceLabel: string }> = [
  {
    id: "monthly-premium",
    name: "Monthly Premium",
    priceLabel: "NGN 85,000 / month",
    detail: "Unlimited branch access, recovery amenities, and priority booking windows.",
  },
  {
    id: "monthly-standard",
    name: "Monthly Standard",
    priceLabel: "NGN 55,000 / month",
    detail: "Core monthly membership with standard class booking allowances.",
  },
  {
    id: "six-session-pack",
    name: "6 Session Pack",
    priceLabel: "NGN 38,000 / pack",
    detail: "Flexible pass pack for casual members and short-term visitors.",
  },
  {
    id: "single-visit",
    name: "Single Visit",
    priceLabel: "NGN 12,000 / visit",
    detail: "One-day access for walk-ins, trials, and guest referrals.",
  },
  {
    id: "couples-membership",
    name: "Couples Membership",
    priceLabel: "NGN 140,000 / month",
    detail: "Shared membership pricing for paired subscriptions and referrals.",
  },
  {
    id: "corporate-flex",
    name: "Corporate Flex",
    priceLabel: "Custom pricing",
    detail: "Employer-sponsored access with pooled sessions and branch restrictions.",
  },
];

export const branchClassOptions: BranchOffering[] = [
  {
    id: "hiit-burn",
    name: "HIIT Burn",
    detail: "High-intensity conditioning blocks for short, high-turnover sessions.",
  },
  {
    id: "power-yoga",
    name: "Power Yoga",
    detail: "Strength-focused yoga classes that perform well during early evenings.",
  },
  {
    id: "strength-basics",
    name: "Strength Basics",
    detail: "Foundational lifting class for onboarding and technique work.",
  },
  {
    id: "mobility-flow",
    name: "Mobility Flow",
    detail: "Recovery and flexibility block for lunch-hour and off-peak members.",
  },
  {
    id: "spin-express",
    name: "Spin Express",
    detail: "Compact cycling class designed for commute-friendly morning slots.",
  },
  {
    id: "pilates-core",
    name: "Pilates Core",
    detail: "Low-impact studio class with strong retention among premium members.",
  },
  {
    id: "boxing-fundamentals",
    name: "Boxing Fundamentals",
    detail: "Entry-level boxing class for technique, endurance, and group energy.",
  },
];

export const branchAmenityOptions: BranchAmenity[] = [
  "Parking",
  "Locker rooms",
  "Showers",
  "Recovery zone",
  "Steam room",
  "Pool",
  "Pilates studio",
  "Studio room",
  "Open gym",
  "Free Wi-Fi",
  "Female changing room",
].map((label) => ({
  id: getAmenityId(label),
  label,
}));

export const branchAudienceTagOptions = [
  "Strength",
  "Recovery",
  "After-work",
  "Premium",
  "Flexible",
  "Commuter-friendly",
  "Evening peak",
  "Corporate",
  "Lunch-hour",
  "Efficient",
  "Classes-first",
  "Pilates",
  "Yoga",
  "Low-impact",
  "Launch",
  "Pool",
] as const;

export const branchGalleryMediaTypeOptions: Array<{
  value: BranchGalleryMediaType;
  label: string;
}> = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
  { value: "equipment", label: "Equipment" },
  { value: "class", label: "Class" },
  { value: "amenity", label: "Amenity" },
  { value: "team", label: "Team" },
];

const defaultOpeningHours: BranchOpeningHour[] = [
  { id: "monday", day: "Monday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "tuesday", day: "Tuesday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "wednesday", day: "Wednesday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "thursday", day: "Thursday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "friday", day: "Friday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "saturday", day: "Saturday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
  { id: "sunday", day: "Sunday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
];

type BranchLegacyDetail = Branch & {
  openingHours: BranchOpeningHour[];
  staff: BranchStaffMember[];
  plans: BranchOffering[];
  classes: BranchOffering[];
  watchlist: string[];
};

type BranchContentSeed = {
  slug: string;
  identity: {
    shortName?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    timezone?: string;
  };
  publicProfile: BranchPublicProfile;
  gallery: BranchGallery;
  socialLinks: BranchSocialLinks;
  commerce: {
    dropInEnabled: boolean;
    trialEnabled: boolean;
    preferredPlanId?: string;
    plans?: BranchPlanAssignment[];
  };
  programming: {
    scheduleSource: "local" | "central";
    classTypes?: BranchClassAssignment[];
    sessions?: BranchScheduledSession[];
  };
  reputation: BranchReputation;
  publishing: BranchPublishingSeed;
};

function cloneOpeningHours(hours: BranchOpeningHour[]) {
  return hours.map((hour) => ({ ...hour }));
}

function cloneStaff(staff: BranchEditableStaffMember[]) {
  return staff.map((member) => ({ ...member }));
}

function cloneAmenities(items: BranchAmenity[]) {
  return items.map((item) => ({ ...item }));
}

function cloneRules(items: BranchRuleItem[]) {
  return items.map((item) => ({ ...item }));
}

function cloneGalleryMedia(items: BranchGalleryMedia[]) {
  return items.map((item) => ({ ...item }));
}

function cloneSocialLinks(links: BranchSocialLinks) {
  return { ...links };
}

function clonePlanAssignments(items: BranchPlanAssignment[]) {
  return items.map((item) => ({ ...item }));
}

function cloneClassAssignments(items: BranchClassAssignment[]) {
  return items.map((item) => ({ ...item }));
}

function splitBranchAddress(address: string) {
  const [addressLine1 = "", city = "", state = ""] = address
    .split(",")
    .map((part) => part.trim());

  return {
    addressLine1,
    addressLine2: "",
    city,
    state,
    country: "Nigeria",
    postalCode: "",
  };
}

function cloneRatingDistribution(items: BranchRatingDistribution[]) {
  return items.map((item) => ({ ...item }));
}

function cloneReviews(items: BranchReview[]) {
  return items.map((item) => ({ ...item }));
}

function cloneExternalReviewLinks(items: BranchExternalReviewLink[]) {
  return items.map((item) => ({ ...item }));
}

function evaluateBranchPublishing(
  branch: Omit<BranchDetail, "publishing">,
  seed: BranchPublishingSeed,
): BranchPublishing {
  const visiblePlans = branch.commerce.plans.filter((plan) => plan.visible !== false);
  const visibleClasses = branch.programming.classTypes.filter((gymClass) => gymClass.visible !== false);
  const heroMedia = branch.publicProfile.heroMediaId
    ? branch.gallery.media.find((item) => item.id === branch.publicProfile.heroMediaId)
    : null;

  const blockingChecks = [
    !branch.publicProfile.headline.trim()
      ? "Add a branch headline before this listing can go live."
      : null,
    branch.publicProfile.overviewShort.trim().length < 90
      ? "Expand the short overview so discovery cards communicate the branch clearly."
      : null,
    branch.publicProfile.overviewLong.trim().length < 220
      ? "Complete the long overview with stronger branch context and positioning."
      : null,
    branch.gallery.media.length < 4
      ? "Add at least four gallery media items for the public listing."
      : null,
    !heroMedia ? "Set hero media so the branch header has a primary visual." : null,
    visiblePlans.length < 1
      ? "Keep at least one visible plan attached before publishing."
      : null,
    !visiblePlans.some((plan) => plan.featured)
      ? "Select one featured plan for the public pricing surface."
      : null,
    visibleClasses.length < 1
      ? "Keep at least one visible class type on the branch schedule."
      : null,
    branch.programming.sessions.length < 3
      ? "Add at least three public schedule sessions before enabling discovery."
      : null,
    branch.reputation.moderationState === "needs_review"
      ? "Resolve review moderation issues before the listing stays discoverable."
      : null,
  ].filter((item): item is string => Boolean(item));

  const recommendedChecks = [
    branch.publicProfile.amenities.length < 3
      ? "Add more structured amenities to improve filtering and branch differentiation."
      : null,
    branch.publicProfile.rules.filter((rule) => rule.title.trim()).length < 2
      ? "Add at least two branch rules or etiquette notes for the overview tab."
      : null,
    branch.gallery.featuredMediaIds.length < 3
      ? "Select at least three featured gallery items for a fuller media mosaic."
      : null,
    Object.values(branch.socialLinks).filter(Boolean).length < 2
      ? "Attach at least two social or web links to strengthen trust signals."
      : null,
    branch.reputation.reviewCount < 3
      ? "Increase published review coverage to strengthen social proof."
      : null,
  ].filter((item): item is string => Boolean(item));

  const passedChecks =
    10 -
    blockingChecks.length +
    (5 - recommendedChecks.length) * 0.5;
  const completenessScore = Math.max(
    0,
    Math.min(100, Math.round((passedChecks / 12.5) * 100)),
  );
  const requestedDiscoverable = seed.requestedDiscoverable ?? seed.isDiscoverable ?? false;
  const eligibleForDiscovery = blockingChecks.length === 0;
  const isDiscoverable = requestedDiscoverable && eligibleForDiscovery;
  const publishState = isDiscoverable
    ? "published"
    : eligibleForDiscovery
      ? "ready"
      : requestedDiscoverable
        ? "needs_attention"
        : "draft";

  return {
    requestedDiscoverable,
    isDiscoverable,
    eligibleForDiscovery,
    publishState,
    completenessScore,
    lastPublishedAt: seed.lastPublishedAt,
    pendingChecks: blockingChecks,
    recommendedChecks,
  };
}

function pickOfferings(source: BranchOffering[], ids: string[]) {
  return ids
    .map((id) => source.find((item) => item.id === id))
    .filter((item): item is BranchOffering => Boolean(item))
    .map((item) => ({ ...item }));
}

function createPlanAssignments(
  ids: string[],
  featuredPlanId?: string,
  cadenceLabel = "/month",
) {
  return pickOfferings(branchPlanOptions, ids).map((plan, index) => ({
    ...plan,
    featured: plan.id === featuredPlanId,
    cadenceLabel,
    visible: true,
    displayOrder: index + 1,
    priceLabel:
      plan.id === "monthly-premium"
        ? "NGN 32,000"
        : plan.id === "monthly-standard"
          ? "NGN 15,000"
          : plan.id === "six-session-pack"
            ? "NGN 36,000"
            : plan.id === "single-visit"
              ? "NGN 8,000"
              : plan.id === "couples-membership"
                ? "NGN 52,000"
                : "NGN 120,000",
  }));
}

function createClassAssignments(ids: string[]) {
  return pickOfferings(branchClassOptions, ids).map((gymClass, index) => ({
    ...gymClass,
    category: gymClass.name.includes("Yoga")
      ? "Yoga"
      : gymClass.name.includes("Pilates")
        ? "Pilates"
        : gymClass.name.includes("Spin")
          ? "Cycling"
          : gymClass.name.includes("Boxing")
            ? "Combat"
            : "Strength",
    coachHighlight: gymClass.name.includes("Yoga")
      ? "Coach-led mobility and strength flow"
      : gymClass.name.includes("Spin")
        ? "High-energy ride block"
        : gymClass.name.includes("Pilates")
          ? "Precision low-impact coaching"
          : "Floor-led training session",
    visible: true,
    displayOrder: index + 1,
  }));
}

function createScheduledSessions(
  classTypes: BranchClassAssignment[],
  coachPool: string[],
) {
  const sessionTemplates = [
    { weekday: "Monday", startTime: "06:30", endTime: "07:30", capacity: 20, bookingState: "open" as const },
    { weekday: "Wednesday", startTime: "18:00", endTime: "19:00", capacity: 18, bookingState: "waitlist" as const },
    { weekday: "Saturday", startTime: "09:00", endTime: "10:00", capacity: 24, bookingState: "open" as const },
  ];

  return classTypes.slice(0, 3).flatMap((gymClass, classIndex) =>
    sessionTemplates.map((template, templateIndex) => ({
      id: `${gymClass.id}-session-${templateIndex + 1}`,
      classId: gymClass.id,
      title: gymClass.name,
      weekday: template.weekday,
      startTime: template.startTime,
      endTime: template.endTime,
      coach: coachPool[(classIndex + templateIndex) % coachPool.length] ?? "GymDeck Coach",
      capacity: template.capacity,
      bookingState:
        classIndex === 2 && templateIndex === 1 ? "closed" : template.bookingState,
    })),
  );
}

function getAmenityId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getScopedMediaId(branchId: string, mediaId: string) {
  return `${branchId}-${mediaId}`;
}

function createFormMediaLibraryItem(
  media: BranchGalleryMedia,
  branchId: string,
  branchName: string,
) {
  return {
    id: getScopedMediaId(branchId, media.id),
    fileName: media.alt || "Branch image",
    previewUrl: media.url,
    branchId,
    branchName,
  };
}

function getBusinessMediaLibrary() {
  return branchDetails.flatMap((branch) =>
    branch.gallery.media.map((media) =>
      createFormMediaLibraryItem(media, branch.id, branch.name),
    ),
  );
}

export function getBranchTone(status: BranchStatus): StatusTone {
  if (status === "Live") {
    return "success";
  }

  if (status === "Watch") {
    return "warning";
  }

  if (status === "Inactive") {
    return "danger";
  }

  return "neutral";
}

const defaultRuleTitles = [
  "Wipe down equipment after use",
  "Return weights and accessories",
  "Wear appropriate training footwear",
];

const baseGalleryMedia: BranchGalleryMedia[] = [
  {
    id: "hero-floor",
    url: "/assets/branch-gallery/hero-floor.jpg",
    alt: "Wide view of the main training floor",
    type: "interior",
  },
  {
    id: "weights-zone",
    url: "/assets/branch-gallery/weights-zone.jpg",
    alt: "Strength equipment and free-weights zone",
    type: "equipment",
  },
  {
    id: "coaching-session",
    url: "/assets/branch-gallery/coaching-session.jpg",
    alt: "Members during a coached class session",
    type: "class",
  },
  {
    id: "reception",
    url: "/assets/branch-gallery/reception.jpg",
    alt: "Instructor portrait for welcome and team coverage",
    type: "team",
  },
  {
    id: "cardio-row",
    url: "/assets/branch-gallery/cardio-row.jpg",
    alt: "Cardio line-up and mirrored floor",
    type: "interior",
  },
  {
    id: "mobility-flow",
    url: "/assets/branch-gallery/mobility-flow.jpg",
    alt: "Mobility and stretch class in progress",
    type: "class",
  },
  {
    id: "yoga-assist",
    url: "/assets/branch-gallery/yoga-assist.jpg",
    alt: "Instructor-led yoga correction in studio",
    type: "class",
  },
  {
    id: "recovery-stretch",
    url: "/assets/branch-gallery/recovery-stretch.jpg",
    alt: "Close-up recovery stretch session",
    type: "amenity",
  },
  {
    id: "group-fitness",
    url: "/assets/branch-gallery/group-fitness.jpg",
    alt: "Group fitness session in a loft studio",
    type: "class",
  },
  {
    id: "sunlit-mat-room",
    url: "/assets/branch-gallery/sunlit-mat-room.jpg",
    alt: "Sunlit mat room for recovery and flexibility work",
    type: "amenity",
  },
  {
    id: "pilates-circle",
    url: "/assets/branch-gallery/pilates-circle.jpg",
    alt: "Pilates and mobility class in a bright studio",
    type: "class",
  },
];

const branchContentSeedById: Record<string, BranchContentSeed> = {
  vi: {
    slug: "victoria-island",
    identity: {
      shortName: "Victoria Island",
      coordinates: { lat: 6.4314, lng: 3.4549 },
      timezone: "Africa/Lagos",
    },
    publicProfile: {
      headline: "Flagship training club for strength, classes, and recovery in Victoria Island.",
      overviewShort:
        "A premium full-service branch with broad plan coverage, recovery amenities, and strong after-work traffic.",
      overviewLong:
        "Victoria Island is the flagship GymDeck branch designed for members who want a full-service club experience. The location combines open gym access, coached programming, steam-room recovery, and a front desk team optimized for premium conversions, guest visits, and recurring memberships.",
      amenities: ["Steam room", "Parking", "Locker rooms", "Showers", "Recovery zone"].map(
        (label) => ({
          id: getAmenityId(label),
          label,
        }),
      ),
      rules: defaultRuleTitles.map((title, index) => ({
        id: `vi-rule-${index + 1}`,
        title,
        details:
          index === 0
            ? "Cleaning stations are available across the floor to keep peak periods running smoothly."
            : undefined,
        expanded: index === 0,
      })),
      audienceTags: ["Strength", "Recovery", "After-work", "Premium"],
      heroMediaId: "hero-floor",
      coverMediaId: "reception",
    },
    gallery: {
      media: cloneGalleryMedia(baseGalleryMedia),
      featuredMediaIds: ["hero-floor", "weights-zone", "coaching-session", "reception"],
    },
    socialLinks: {
      instagram: "https://instagram.com/gymdeck.vi",
      facebook: "https://facebook.com/gymdeck.vi",
      website: "https://gymdeck.com/branches/victoria-island",
      whatsapp: "https://wa.me/2348013349021",
    },
    commerce: {
      dropInEnabled: true,
      trialEnabled: true,
      preferredPlanId: "monthly-premium",
      plans: createPlanAssignments(
        [
          "monthly-premium",
          "monthly-standard",
          "six-session-pack",
          "single-visit",
          "couples-membership",
          "corporate-flex",
        ],
        "monthly-premium",
      ),
    },
    programming: {
      scheduleSource: "local",
      classTypes: createClassAssignments([
        "hiit-burn",
        "power-yoga",
        "strength-basics",
        "mobility-flow",
        "spin-express",
      ]),
    },
    reputation: {
      ratingAverage: 4.8,
      reviewCount: 129,
      reviewSummary: [
        { stars: 5, widthPercent: 91 },
        { stars: 4, widthPercent: 66 },
        { stars: 3, widthPercent: 18 },
        { stars: 2, widthPercent: 8 },
        { stars: 1, widthPercent: 4 },
      ],
      reviews: [
        {
          id: "vi-review-1",
          title: "Reliable premium experience",
          author: "Jane W.",
          text: "The trainers are sharp, the floor is well managed, and the evening classes stay consistent even during busy weeks.",
          postedAt: "3 days ago",
          rating: 5,
          source: "GymDeck",
          status: "featured",
        },
        {
          id: "vi-review-2",
          title: "Strong class programming",
          author: "Bayo A.",
          text: "Spin and strength classes are usually full for a reason. The branch feels organized and worth the commute.",
          postedAt: "1 week ago",
          rating: 5,
          source: "Google",
          status: "published",
        },
      ],
      externalReviewLinks: [
        { label: "Google reviews", href: "https://maps.google.com/?q=GymDeck+Victoria+Island" },
      ],
      moderationState: "open",
    },
    publishing: {
      isDiscoverable: true,
      completenessScore: 96,
      lastPublishedAt: "2026-03-18T09:00:00Z",
      pendingChecks: [],
    },
  },
  lekki: {
    slug: "lekki-phase-1",
    identity: {
      shortName: "Lekki",
      coordinates: { lat: 6.4316, lng: 3.4652 },
      timezone: "Africa/Lagos",
    },
    publicProfile: {
      headline: "Community-driven club with strong recovery and flexible access options.",
      overviewShort:
        "A high-demand Lekki branch balancing open gym usage with steady class attendance and commuter-friendly access.",
      overviewLong:
        "Lekki Phase 1 serves members who want a practical everyday training club with broad access products and reliable evening usage. Recovery amenities and flexible plans help the branch convert casual users into recurring members while still supporting walk-ins and employer-backed access.",
      amenities: ["Parking", "Recovery zone", "Locker rooms", "Free Wi-Fi"].map((label) => ({
        id: getAmenityId(label),
        label,
      })),
      rules: defaultRuleTitles.map((title, index) => ({
        id: `lekki-rule-${index + 1}`,
        title,
        details:
          index === 1
            ? "Return equipment promptly during evening peaks to reduce congestion around the strength floor."
            : undefined,
        expanded: index === 1,
      })),
      audienceTags: ["Flexible", "Commuter-friendly", "Recovery", "Evening peak"],
      heroMediaId: "hero-floor",
      coverMediaId: "reception",
    },
    gallery: {
      media: cloneGalleryMedia(baseGalleryMedia),
      featuredMediaIds: ["hero-floor", "coaching-session", "reception"],
    },
    socialLinks: {
      instagram: "https://instagram.com/gymdeck.lekki",
      tiktok: "https://tiktok.com/@gymdeck.lekki",
      website: "https://gymdeck.com/branches/lekki-phase-1",
      whatsapp: "https://wa.me/2348039914802",
    },
    commerce: {
      dropInEnabled: true,
      trialEnabled: false,
      preferredPlanId: "monthly-standard",
      plans: createPlanAssignments(
        [
          "monthly-premium",
          "monthly-standard",
          "six-session-pack",
          "single-visit",
          "corporate-flex",
        ],
        "monthly-standard",
      ),
    },
    programming: {
      scheduleSource: "local",
      classTypes: createClassAssignments([
        "hiit-burn",
        "strength-basics",
        "mobility-flow",
        "boxing-fundamentals",
      ]),
    },
    reputation: {
      ratingAverage: 4.6,
      reviewCount: 87,
      reviewSummary: [
        { stars: 5, widthPercent: 82 },
        { stars: 4, widthPercent: 60 },
        { stars: 3, widthPercent: 22 },
        { stars: 2, widthPercent: 12 },
        { stars: 1, widthPercent: 7 },
      ],
      reviews: [
        {
          id: "lekki-review-1",
          title: "Convenient everyday branch",
          author: "Tolu F.",
          text: "Good range of plans and solid evening coverage, though lockers can get busy on Fridays.",
          postedAt: "5 days ago",
          rating: 4,
          source: "Google",
          status: "published",
        },
        {
          id: "lekki-review-2",
          title: "Helpful front desk team",
          author: "Mimi K.",
          text: "The staff are responsive and the recovery area is a real differentiator for this branch.",
          postedAt: "2 weeks ago",
          rating: 5,
          source: "GymDeck",
          status: "featured",
        },
      ],
      externalReviewLinks: [
        { label: "Google reviews", href: "https://maps.google.com/?q=GymDeck+Lekki+Phase+1" },
      ],
      moderationState: "needs_review",
    },
    publishing: {
      isDiscoverable: true,
      completenessScore: 88,
      lastPublishedAt: "2026-03-14T12:00:00Z",
      pendingChecks: ["Review one flagged locker-maintenance complaint"],
    },
  },
  ikeja: {
    slug: "ikeja-central",
    identity: {
      shortName: "Ikeja Central",
      coordinates: { lat: 6.6018, lng: 3.3515 },
      timezone: "Africa/Lagos",
    },
    publicProfile: {
      headline: "High-utility weekday branch for office workers and lunch-hour training.",
      overviewShort:
        "A practical branch with strong lunchtime attendance, corporate conversion potential, and dependable class fill rates.",
      overviewLong:
        "Ikeja Central is built around efficient weekday access for nearby professionals. The location performs best across lunchtime and after-work windows, with a strong mix of open gym members and corporate-backed access products.",
      amenities: ["Studio room", "Open gym", "Locker rooms", "Parking"].map((label) => ({
        id: getAmenityId(label),
        label,
      })),
      rules: defaultRuleTitles.map((title, index) => ({
        id: `ikeja-rule-${index + 1}`,
        title,
        expanded: index === 0,
      })),
      audienceTags: ["Corporate", "Lunch-hour", "Strength", "Efficient"],
      heroMediaId: "hero-floor",
      coverMediaId: "weights-zone",
    },
    gallery: {
      media: cloneGalleryMedia(baseGalleryMedia),
      featuredMediaIds: ["hero-floor", "weights-zone", "coaching-session"],
    },
    socialLinks: {
      instagram: "https://instagram.com/gymdeck.ikeja",
      website: "https://gymdeck.com/branches/ikeja-central",
    },
    commerce: {
      dropInEnabled: true,
      trialEnabled: true,
      preferredPlanId: "corporate-flex",
      plans: createPlanAssignments(
        ["monthly-standard", "six-session-pack", "single-visit", "corporate-flex"],
        "corporate-flex",
      ),
    },
    programming: {
      scheduleSource: "central",
      classTypes: createClassAssignments(["strength-basics", "mobility-flow", "spin-express"]),
    },
    reputation: {
      ratingAverage: 4.5,
      reviewCount: 64,
      reviewSummary: [
        { stars: 5, widthPercent: 79 },
        { stars: 4, widthPercent: 58 },
        { stars: 3, widthPercent: 26 },
        { stars: 2, widthPercent: 10 },
        { stars: 1, widthPercent: 5 },
      ],
      reviews: [
        {
          id: "ikeja-review-1",
          title: "Great for lunch-hour sessions",
          author: "Kunle O.",
          text: "Fast check-in, focused crowd, and enough structure for weekday workouts without wasting time.",
          postedAt: "4 days ago",
          rating: 5,
          source: "Google",
          status: "featured",
        },
      ],
      externalReviewLinks: [
        { label: "Google reviews", href: "https://maps.google.com/?q=GymDeck+Ikeja+Central" },
      ],
      moderationState: "open",
    },
    publishing: {
      isDiscoverable: true,
      completenessScore: 84,
      lastPublishedAt: "2026-03-10T10:30:00Z",
      pendingChecks: ["Add two more branch media items for fuller gallery coverage"],
    },
  },
  yaba: {
    slug: "yaba-studio",
    identity: {
      shortName: "Yaba Studio",
      coordinates: { lat: 6.5095, lng: 3.3711 },
      timezone: "Africa/Lagos",
    },
    publicProfile: {
      headline: "Studio-led branch with strong class retention and lower-impact programming.",
      overviewShort:
        "A classes-first location for yoga, pilates, dance, and members who value guided sessions over open-floor volume.",
      overviewLong:
        "Yaba Studio is positioned as a programming-heavy branch with strong performance in yoga, dance, pilates, and lower-impact formats. It is ideal for members who prefer guided class experiences and more intimate studio scheduling.",
      amenities: ["Studio room", "Female changing room", "Locker rooms", "Free Wi-Fi"].map(
        (label) => ({
          id: getAmenityId(label),
          label,
        }),
      ),
      rules: defaultRuleTitles.map((title, index) => ({
        id: `yaba-rule-${index + 1}`,
        title,
        details:
          index === 2 ? "Indoor studio floors require clean footwear for all guided sessions." : undefined,
        expanded: index === 2,
      })),
      audienceTags: ["Classes-first", "Pilates", "Yoga", "Low-impact"],
      heroMediaId: "coaching-session",
      coverMediaId: "reception",
    },
    gallery: {
      media: cloneGalleryMedia(baseGalleryMedia),
      featuredMediaIds: ["coaching-session", "reception", "hero-floor"],
    },
    socialLinks: {
      instagram: "https://instagram.com/gymdeck.yaba",
      youtube: "https://youtube.com/@gymdeckyaba",
      website: "https://gymdeck.com/branches/yaba-studio",
    },
    commerce: {
      dropInEnabled: true,
      trialEnabled: false,
      preferredPlanId: "monthly-premium",
      plans: createPlanAssignments(
        ["monthly-premium", "monthly-standard", "six-session-pack", "single-visit"],
        "monthly-premium",
      ),
    },
    programming: {
      scheduleSource: "local",
      classTypes: createClassAssignments([
        "power-yoga",
        "mobility-flow",
        "pilates-core",
        "boxing-fundamentals",
      ]),
    },
    reputation: {
      ratingAverage: 4.7,
      reviewCount: 52,
      reviewSummary: [
        { stars: 5, widthPercent: 88 },
        { stars: 4, widthPercent: 62 },
        { stars: 3, widthPercent: 20 },
        { stars: 2, widthPercent: 6 },
        { stars: 1, widthPercent: 3 },
      ],
      reviews: [
        {
          id: "yaba-review-1",
          title: "Best branch for guided classes",
          author: "Lara E.",
          text: "Pilates and mobility sessions feel intentional here, and the smaller branch format works really well.",
          postedAt: "6 days ago",
          rating: 5,
          source: "GymDeck",
          status: "featured",
        },
      ],
      externalReviewLinks: [],
      moderationState: "open",
    },
    publishing: {
      isDiscoverable: true,
      completenessScore: 86,
      lastPublishedAt: "2026-03-09T08:15:00Z",
      pendingChecks: ["Add more exterior media to strengthen the listing header"],
    },
  },
  ikoyi: {
    slug: "ikoyi-flagship",
    identity: {
      shortName: "Ikoyi Flagship",
      coordinates: { lat: 6.4472, lng: 3.4341 },
      timezone: "Africa/Lagos",
    },
    publicProfile: {
      headline: "Premium launch branch with pool, studio programming, and high-touch onboarding.",
      overviewShort:
        "An opening-soon flagship branch designed for premium memberships, couples access, and polished launch campaigns.",
      overviewLong:
        "Ikoyi Flagship is being prepared as a premium-forward launch branch with elevated amenities, studio programming, and onboarding flows built for new member acquisition. It is not yet fully discoverable because trial access, signage, and launch-readiness details are still being completed.",
      amenities: ["Pool", "Pilates studio", "Locker rooms", "Recovery zone"].map((label) => ({
        id: getAmenityId(label),
        label,
      })),
      rules: defaultRuleTitles.map((title, index) => ({
        id: `ikoyi-rule-${index + 1}`,
        title,
        expanded: index === 0,
      })),
      audienceTags: ["Premium", "Launch", "Pilates", "Pool"],
      heroMediaId: "hero-floor",
      coverMediaId: "coaching-session",
    },
    gallery: {
      media: cloneGalleryMedia(baseGalleryMedia),
      featuredMediaIds: ["hero-floor", "weights-zone"],
    },
    socialLinks: {
      instagram: "https://instagram.com/gymdeck.ikoyi",
      website: "https://gymdeck.com/branches/ikoyi-flagship",
    },
    commerce: {
      dropInEnabled: false,
      trialEnabled: false,
      preferredPlanId: "monthly-premium",
      plans: createPlanAssignments(
        ["monthly-premium", "couples-membership", "corporate-flex"],
        "monthly-premium",
      ),
    },
    programming: {
      scheduleSource: "central",
      classTypes: createClassAssignments(["pilates-core", "power-yoga", "spin-express"]),
    },
    reputation: {
      ratingAverage: 0,
      reviewCount: 0,
      reviewSummary: [
        { stars: 5, widthPercent: 0 },
        { stars: 4, widthPercent: 0 },
        { stars: 3, widthPercent: 0 },
        { stars: 2, widthPercent: 0 },
        { stars: 1, widthPercent: 0 },
      ],
      reviews: [],
      externalReviewLinks: [],
      moderationState: "open",
    },
    publishing: {
      isDiscoverable: false,
      completenessScore: 63,
      lastPublishedAt: undefined,
      pendingChecks: [
        "Set hero media and add at least three more branch photos",
        "Complete launch overview copy review",
        "Enable trial or drop-in policy before public launch",
      ],
    },
  },
};

const branchBaseDetails: BranchLegacyDetail[] = [
  {
    id: "vi",
    name: "Victoria Island",
    address: "12 Admiralty Way, Victoria Island, Lagos",
    manager: "Adaeze Cole",
    phone: "+234 801 334 9021",
    email: "victoriaisland@gymdeck.com",
    status: "Live",
    tone: getBranchTone("Live"),
    members: 824,
    activePlans: 6,
    staffCount: 14,
    classesCount: 28,
    occupancy: "82% average peak occupancy",
    note: "Default branch for online bookings, premium check-ins, and walk-in conversions.",
    tags: ["Flagship", "Parking", "Steam room"],
    openingHours: cloneOpeningHours(defaultOpeningHours),
    staff: [
      {
        id: "adaeze-cole",
        name: "Adaeze Cole",
        role: "Branch Manager",
        shift: "Weekday open to 4:00 PM",
        status: "Primary owner",
        tone: "brand",
      },
      {
        id: "timi-duro",
        name: "Timi Duro",
        role: "Lead Trainer",
        shift: "Morning and after-work peak classes",
        status: "Opening shift",
        tone: "success",
      },
      {
        id: "nkechi-obi",
        name: "Nkechi Obi",
        role: "Front Desk Lead",
        shift: "Membership desk and access issues",
        status: "Closing shift",
        tone: "neutral",
      },
      {
        id: "samuel-bassey",
        name: "Samuel Bassey",
        role: "Operations Support",
        shift: "Floor checks and equipment escalation",
        status: "Weekend coverage",
        tone: "warning",
      },
    ],
    plans: pickOfferings(branchPlanOptions, [
      "monthly-premium",
      "monthly-standard",
      "six-session-pack",
      "single-visit",
      "couples-membership",
      "corporate-flex",
    ]),
    classes: pickOfferings(branchClassOptions, [
      "hiit-burn",
      "power-yoga",
      "strength-basics",
      "mobility-flow",
      "spin-express",
    ]),
    watchlist: [
      "Peak check-ins cluster between 6:00 PM and 8:00 PM on weekdays.",
      "Premium plan upgrades are highest at the front desk after spin sessions.",
      "Reception signage refresh is due before the next campaign rollout.",
    ],
  },
  {
    id: "lekki",
    name: "Lekki Phase 1",
    address: "45 Admiralty Road, Lekki Phase 1, Lagos",
    manager: "Musa Ibrahim",
    phone: "+234 803 991 4802",
    email: "lekki@gymdeck.com",
    status: "Watch",
    tone: getBranchTone("Watch"),
    members: 692,
    activePlans: 5,
    staffCount: 11,
    classesCount: 22,
    occupancy: "74% average peak occupancy",
    note: "Locker maintenance and Friday front desk coverage need follow-up this week.",
    tags: ["Recovery zone", "Parking"],
    openingHours: cloneOpeningHours(defaultOpeningHours),
    staff: [
      {
        id: "musa-ibrahim",
        name: "Musa Ibrahim",
        role: "Branch Manager",
        shift: "Weekday close and weekend escalation",
        status: "Primary owner",
        tone: "brand",
      },
      {
        id: "toju-bello",
        name: "Toju Bello",
        role: "Operations Lead",
        shift: "Facilities and class readiness",
        status: "Opening shift",
        tone: "warning",
      },
      {
        id: "grace-oladipo",
        name: "Grace Oladipo",
        role: "Front Desk Lead",
        shift: "Afternoon and evening check-ins",
        status: "Closing shift",
        tone: "neutral",
      },
    ],
    plans: pickOfferings(branchPlanOptions, [
      "monthly-premium",
      "monthly-standard",
      "six-session-pack",
      "single-visit",
      "corporate-flex",
    ]),
    classes: pickOfferings(branchClassOptions, [
      "hiit-burn",
      "strength-basics",
      "mobility-flow",
      "boxing-fundamentals",
    ]),
    watchlist: [
      "Friday evening front desk coverage still needs one more team member.",
      "Locker maintenance closes at 7:00 PM on Friday and should be communicated to members.",
      "Retention dip is concentrated among single-visit converts.",
    ],
  },
  {
    id: "ikeja",
    name: "Ikeja Central",
    address: "8 Allen Avenue, Ikeja, Lagos",
    manager: "Tomi Ajayi",
    phone: "+234 802 771 3146",
    email: "ikeja@gymdeck.com",
    status: "Live",
    tone: getBranchTone("Live"),
    members: 540,
    activePlans: 4,
    staffCount: 9,
    classesCount: 16,
    occupancy: "68% average peak occupancy",
    note: "Strong weekday lunchtime traffic with reliable class fill rates.",
    tags: ["Open gym", "Studio room"],
    openingHours: cloneOpeningHours(defaultOpeningHours),
    staff: [
      {
        id: "tomi-ajayi",
        name: "Tomi Ajayi",
        role: "Branch Manager",
        shift: "Weekday open to late afternoon",
        status: "Primary owner",
        tone: "brand",
      },
      {
        id: "femi-okafor",
        name: "Femi Okafor",
        role: "Lead Trainer",
        shift: "Lunch and after-work sessions",
        status: "Opening shift",
        tone: "success",
      },
      {
        id: "remi-fadeyi",
        name: "Remi Fadeyi",
        role: "Front Desk Lead",
        shift: "Walk-ins and payment escalations",
        status: "Closing shift",
        tone: "neutral",
      },
    ],
    plans: pickOfferings(branchPlanOptions, [
      "monthly-standard",
      "six-session-pack",
      "single-visit",
      "corporate-flex",
    ]),
    classes: pickOfferings(branchClassOptions, [
      "strength-basics",
      "mobility-flow",
      "spin-express",
    ]),
    watchlist: [
      "Lunch-hour demand is outpacing available class slots on Tuesdays and Thursdays.",
      "Corporate Flex conversion is strongest among nearby office towers.",
    ],
  },
  {
    id: "yaba",
    name: "Yaba Studio",
    address: "27 Herbert Macaulay Way, Yaba, Lagos",
    manager: "Kemi Obasi",
    phone: "+234 809 224 1190",
    email: "yaba@gymdeck.com",
    status: "Live",
    tone: getBranchTone("Live"),
    members: 421,
    activePlans: 4,
    staffCount: 7,
    classesCount: 18,
    occupancy: "61% average peak occupancy",
    note: "Class retention is strongest in yoga, dance, and low-impact sessions.",
    tags: ["Classes-first", "Female changing room"],
    openingHours: [
      { id: "monday", day: "Monday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
      { id: "tuesday", day: "Tuesday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
      { id: "wednesday", day: "Wednesday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
      { id: "thursday", day: "Thursday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
      { id: "friday", day: "Friday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
      { id: "saturday", day: "Saturday", isOpen: true, openTime: "07:00", closeTime: "20:00" },
      { id: "sunday", day: "Sunday", isOpen: false, openTime: "08:00", closeTime: "20:00" },
    ],
    staff: [
      {
        id: "kemi-obasi",
        name: "Kemi Obasi",
        role: "Branch Manager",
        shift: "Weekday close and programming review",
        status: "Primary owner",
        tone: "brand",
      },
      {
        id: "anita-solarin",
        name: "Anita Solarin",
        role: "Lead Trainer",
        shift: "Yoga, dance, and studio scheduling",
        status: "Opening shift",
        tone: "success",
      },
      {
        id: "seun-akande",
        name: "Seun Akande",
        role: "Operations Support",
        shift: "Weekend studio reset",
        status: "Weekend coverage",
        tone: "neutral",
      },
    ],
    plans: pickOfferings(branchPlanOptions, [
      "monthly-premium",
      "monthly-standard",
      "six-session-pack",
      "single-visit",
    ]),
    classes: pickOfferings(branchClassOptions, [
      "power-yoga",
      "mobility-flow",
      "pilates-core",
      "boxing-fundamentals",
    ]),
    watchlist: [
      "Sunday is currently closed, so Saturday demand spikes around midday.",
      "Studio-heavy membership mix makes schedule changes highly visible to members.",
    ],
  },
  {
    id: "ikoyi",
    name: "Ikoyi Flagship",
    address: "6 Bourdillon Road, Ikoyi, Lagos",
    manager: "Lara Kingsley",
    phone: "+234 805 882 6194",
    email: "ikoyi@gymdeck.com",
    status: "Opening soon",
    tone: getBranchTone("Opening soon"),
    members: 0,
    activePlans: 3,
    staffCount: 7,
    classesCount: 12,
    occupancy: "Launch week opens on April 12",
    note: "Hiring, signage, and trial-pass setup are still in progress for launch week.",
    tags: ["Pool", "Pilates studio", "Opening soon"],
    openingHours: [
      { id: "monday", day: "Monday", isOpen: true, openTime: "06:00", closeTime: "22:00" },
      { id: "tuesday", day: "Tuesday", isOpen: true, openTime: "06:00", closeTime: "22:00" },
      { id: "wednesday", day: "Wednesday", isOpen: true, openTime: "06:00", closeTime: "22:00" },
      { id: "thursday", day: "Thursday", isOpen: true, openTime: "06:00", closeTime: "22:00" },
      { id: "friday", day: "Friday", isOpen: true, openTime: "06:00", closeTime: "22:00" },
      { id: "saturday", day: "Saturday", isOpen: true, openTime: "07:00", closeTime: "21:00" },
      { id: "sunday", day: "Sunday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
    ],
    staff: [
      {
        id: "lara-kingsley",
        name: "Lara Kingsley",
        role: "Branch Manager",
        shift: "Launch readiness and opening week escalations",
        status: "Primary owner",
        tone: "brand",
      },
      {
        id: "chinelo-uma",
        name: "Chinelo Uma",
        role: "Operations Lead",
        shift: "Vendor readiness and floor walkthroughs",
        status: "Launch support",
        tone: "warning",
      },
      {
        id: "david-orji",
        name: "David Orji",
        role: "Lead Trainer",
        shift: "Opening class programming and dry runs",
        status: "Launch support",
        tone: "neutral",
      },
    ],
    plans: pickOfferings(branchPlanOptions, [
      "monthly-premium",
      "couples-membership",
      "corporate-flex",
    ]),
    classes: pickOfferings(branchClassOptions, [
      "pilates-core",
      "power-yoga",
      "spin-express",
    ]),
    watchlist: [
      "Trial-pass setup should be confirmed before launch announcements go live.",
      "Branch signage and front-desk merchandising close this week.",
      "Staff enablement still needs one final dry run for access flows.",
    ],
  },
];

const branchDetails: BranchDetail[] = branchBaseDetails.map((branch) => {
  const content = branchContentSeedById[branch.id];
  const classTypes = cloneClassAssignments(content.programming.classTypes ?? []);
  const coachPool = branch.staff.map((member) => member.name);

  const nextBranch: Omit<BranchDetail, "publishing"> = {
    ...branch,
    slug: content.slug,
    identity: {
      name: branch.name,
      shortName: content.identity.shortName,
      slug: content.slug,
      address: branch.address,
      coordinates: content.identity.coordinates,
      phone: branch.phone,
      email: branch.email,
      managerName: branch.manager,
      timezone: content.identity.timezone ?? "Africa/Lagos",
    },
    operations: {
      openingHours: cloneOpeningHours(branch.openingHours),
      staffAssignments: branch.staff.map((member) => ({ ...member })),
      operationalNote: branch.note,
      tags: [...branch.tags],
      watchlist: [...branch.watchlist],
    },
    publicProfile: {
      ...content.publicProfile,
      amenities: cloneAmenities(content.publicProfile.amenities),
      rules: cloneRules(content.publicProfile.rules),
      audienceTags: [...content.publicProfile.audienceTags],
    },
    gallery: {
      media: cloneGalleryMedia(content.gallery.media),
      featuredMediaIds: [...content.gallery.featuredMediaIds],
    },
    socialLinks: cloneSocialLinks(content.socialLinks),
    commerce: {
      plans: clonePlanAssignments(content.commerce.plans ?? []),
      dropInEnabled: content.commerce.dropInEnabled,
      trialEnabled: content.commerce.trialEnabled,
      preferredPlanId: content.commerce.preferredPlanId,
    },
    programming: {
      classTypes,
      scheduleSource: content.programming.scheduleSource,
      sessions:
        content.programming.sessions?.map((session) => ({ ...session })) ??
        createScheduledSessions(classTypes, coachPool),
    },
    reputation: {
      ratingAverage: content.reputation.ratingAverage,
      reviewCount: content.reputation.reviewCount,
      reviewSummary: cloneRatingDistribution(content.reputation.reviewSummary),
      reviews: cloneReviews(content.reputation.reviews),
      externalReviewLinks: cloneExternalReviewLinks(content.reputation.externalReviewLinks),
      moderationState: content.reputation.moderationState,
    },
  };

  return {
    ...nextBranch,
    publishing: evaluateBranchPublishing(nextBranch, content.publishing),
  };
});

export const branches: Branch[] = branchDetails.map((branch) => ({
  id: branch.id,
  name: branch.name,
  address: branch.address,
  manager: branch.manager,
  phone: branch.phone,
  email: branch.email,
  status: branch.status,
  tone: branch.tone,
  members: branch.members,
  activePlans: branch.activePlans,
  staffCount: branch.staffCount,
  classesCount: branch.classesCount,
  occupancy: branch.occupancy,
  note: branch.note,
  tags: [...branch.tags],
}));

export function getBranchById(branchId: string) {
  return branchDetails.find((branch) => branch.id === branchId) ?? null;
}

export function getBranchBySlug(slug: string) {
  return branchDetails.find((branch) => branch.slug === slug) ?? null;
}

export function getBranchPublicProfile(branchId: string) {
  const branch = getBranchById(branchId);

  if (!branch) {
    return null;
  }

  return {
    ...branch.publicProfile,
    amenities: cloneAmenities(branch.publicProfile.amenities),
    rules: cloneRules(branch.publicProfile.rules),
    audienceTags: [...branch.publicProfile.audienceTags],
  };
}

export function getBranchGallery(branchId: string) {
  const branch = getBranchById(branchId);

  if (!branch) {
    return null;
  }

  return {
    media: cloneGalleryMedia(branch.gallery.media),
    featuredMediaIds: [...branch.gallery.featuredMediaIds],
  };
}

export function getBranchReviewsSummary(branchId: string) {
  const branch = getBranchById(branchId);

  if (!branch) {
    return null;
  }

  return {
    ratingAverage: branch.reputation.ratingAverage,
    reviewCount: branch.reputation.reviewCount,
    reviewSummary: cloneRatingDistribution(branch.reputation.reviewSummary),
    reviews: cloneReviews(branch.reputation.reviews),
    moderationState: branch.reputation.moderationState,
    externalReviewLinks: cloneExternalReviewLinks(branch.reputation.externalReviewLinks),
  };
}

export function getBranchPublishingState(branchId: string) {
  const branch = getBranchById(branchId);

  if (!branch) {
    return null;
  }

  return {
    ...branch.publishing,
    pendingChecks: [...branch.publishing.pendingChecks],
    recommendedChecks: [...branch.publishing.recommendedChecks],
  };
}

export function getBranchPublicListingViewModel(branchId: string): BranchPublicListingViewModel | null {
  const branch = getBranchById(branchId);

  if (!branch) {
    return null;
  }

  const featuredGalleryMedia = branch.gallery.featuredMediaIds
    .map((mediaId) => branch.gallery.media.find((item) => item.id === mediaId))
    .filter((item): item is BranchGalleryMedia => Boolean(item));
  const heroImage = branch.publicProfile.heroMediaId
    ? branch.gallery.media.find((item) => item.id === branch.publicProfile.heroMediaId)
    : featuredGalleryMedia[0];

  return {
    id: branch.id,
    slug: branch.slug,
    name: branch.name,
    address: branch.address,
    heroImageUrl: heroImage?.url,
    galleryImages: branch.gallery.media.map((item) => item.url),
    featuredGalleryImageUrls: featuredGalleryMedia.map((item) => item.url),
    overviewShort: branch.publicProfile.overviewShort,
    overviewLong: branch.publicProfile.overviewLong,
    amenities: cloneAmenities(branch.publicProfile.amenities),
    rules: cloneRules(branch.publicProfile.rules),
    plans: clonePlanAssignments(branch.commerce.plans),
    classes: cloneClassAssignments(branch.programming.classTypes),
    socialLinks: cloneSocialLinks(branch.socialLinks),
    reviewAverage: branch.reputation.ratingAverage,
    reviewCount: branch.reputation.reviewCount,
    reviewSummary: cloneRatingDistribution(branch.reputation.reviewSummary),
    reviews: cloneReviews(branch.reputation.reviews),
  };
}

export function getBranchOverview(rows: Branch[]) {
  const liveCount = rows.filter((branch) => branch.status === "Live").length;
  const watchCount = rows.filter((branch) => branch.status === "Watch").length;
  const launchCount = rows.filter((branch) => branch.status === "Opening soon").length;
  const inactiveCount = rows.filter((branch) => branch.status === "Inactive").length;
  const operationalCount = rows.filter(
    (branch) => branch.status === "Live" || branch.status === "Watch",
  ).length;
  const members = rows.reduce((total, branch) => total + branch.members, 0);
  const assignedStaff = rows.reduce((total, branch) => total + branch.staffCount, 0);
  const attentionCount = rows.filter((branch) => branch.tone !== "success").length;

  return [
    {
      label: "Operational branches",
      value: operationalCount.toString(),
      detail: `${liveCount} live, ${watchCount} on watch, ${launchCount} opening soon${inactiveCount ? `, ${inactiveCount} inactive` : ""}`,
    },
    {
      label: "Members across locations",
      value: members.toLocaleString(),
      detail: `Across ${rows.length} configured branch workspaces`,
    },
    {
      label: "Assigned staff",
      value: assignedStaff.toLocaleString(),
      detail: "Coverage planned across branch managers, trainers, and front desk teams",
    },
    {
      label: "Needs attention",
      value: attentionCount.toString(),
      detail: "Tracks watch branches, launch prep, and inactive locations",
    },
  ];
}

export function createBranchFormState(branch?: BranchDetail): BranchFormState {
  const mediaLibrary = getBusinessMediaLibrary();

  if (!branch) {
    return {
      name: "",
      address: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      manager: "",
      phone: "",
      email: "",
      status: "Opening soon",
      note: "",
      tags: "",
      openingHours: cloneOpeningHours(defaultOpeningHours),
      staff: [],
      plans: [],
      classes: [],
      mediaLibrary,
      gallery: [],
      publicOverview: "",
      publicAmenities: [],
      publicRules: [
        {
          id: "public-rule-1",
          title: "",
          details: "",
          expanded: false,
        },
      ],
    };
  }

  const addressParts = splitBranchAddress(branch.address);

  return {
    name: branch.name,
    address: branch.address,
    addressLine1: addressParts.addressLine1,
    addressLine2: addressParts.addressLine2,
    city: addressParts.city,
    state: addressParts.state,
    country: addressParts.country,
    postalCode: addressParts.postalCode,
    manager: branch.manager,
    phone: branch.phone,
    email: branch.email,
    status: branch.status,
    note: branch.note,
    tags: branch.tags.join(", "),
    openingHours: cloneOpeningHours(branch.openingHours),
    staff: cloneStaff(
      branch.staff.map(({ id, name, role, shift, status }) => ({
        id,
        name,
        role,
        shift,
        status,
      })),
    ),
    plans: branch.plans.map((plan) => plan.name),
    classes: branch.classes.map((gymClass) => gymClass.name),
    mediaLibrary,
    gallery: branch.gallery.featuredMediaIds.map((mediaId) => getScopedMediaId(branch.id, mediaId)),
    publicOverview: branch.publicProfile.overviewLong,
    publicAmenities: branch.publicProfile.amenities.map((item) => item.label),
    publicRules: cloneRules(branch.publicProfile.rules),
  };
}
