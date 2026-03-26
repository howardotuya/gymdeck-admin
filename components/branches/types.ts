import type { StatusTone } from "@/components/ui";

export type BranchStatus = "Live" | "Watch" | "Opening soon" | "Inactive";

export type BranchAmenity = {
  id: string;
  label: string;
};

export type BranchRuleItem = {
  id: string;
  title: string;
  details?: string;
  expanded?: boolean;
};

export type BranchGalleryMediaType =
  | "interior"
  | "exterior"
  | "equipment"
  | "class"
  | "amenity"
  | "team";

export type BranchGalleryMedia = {
  id: string;
  url: string;
  alt: string;
  type: BranchGalleryMediaType;
};

export type BranchSocialLinks = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
  x?: string;
  website?: string;
  whatsapp?: string;
};

export type BranchRatingDistribution = {
  stars: number;
  widthPercent: number;
};

export type BranchReview = {
  id: string;
  title: string;
  author: string;
  text: string;
  postedAt: string;
  rating: number;
  source: "GymDeck" | "Google";
  status: "published" | "flagged" | "featured";
};

export type BranchExternalReviewLink = {
  label: string;
  href: string;
};

export type BranchIdentity = {
  name: string;
  shortName?: string;
  slug: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  managerName: string;
  timezone: string;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  status: BranchStatus;
  tone: StatusTone;
  members: number;
  activePlans: number;
  staffCount: number;
  classesCount: number;
  occupancy: string;
  note: string;
  tags: string[];
};

export type BranchOpeningHour = {
  id: string;
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type BranchStaffMember = {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: string;
  tone: StatusTone;
};

export type BranchEditableStaffMember = {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: string;
};

export type BranchOffering = {
  id: string;
  name: string;
  detail: string;
};

export type BranchOperations = {
  openingHours: BranchOpeningHour[];
  staffAssignments: BranchStaffMember[];
  operationalNote: string;
  tags: string[];
  watchlist: string[];
};

export type BranchPublicProfile = {
  headline: string;
  overviewShort: string;
  overviewLong: string;
  amenities: BranchAmenity[];
  rules: BranchRuleItem[];
  audienceTags: string[];
  heroMediaId?: string;
  coverMediaId?: string;
};

export type BranchGallery = {
  media: BranchGalleryMedia[];
  featuredMediaIds: string[];
};

export type BranchPlanAssignment = BranchOffering & {
  featured?: boolean;
  priceLabel?: string;
  cadenceLabel?: string;
  visible?: boolean;
  displayOrder?: number;
  audienceNote?: string;
};

export type BranchClassAssignment = BranchOffering & {
  category: string;
  coachHighlight?: string;
  visible?: boolean;
  displayOrder?: number;
};

export type BranchScheduledSession = {
  id: string;
  classId: string;
  title: string;
  weekday: string;
  startTime: string;
  endTime: string;
  coach: string;
  capacity: number;
  bookingState: "open" | "waitlist" | "closed";
};

export type BranchCommerce = {
  plans: BranchPlanAssignment[];
  dropInEnabled: boolean;
  trialEnabled: boolean;
  preferredPlanId?: string;
};

export type BranchProgramming = {
  classTypes: BranchClassAssignment[];
  scheduleSource: "local" | "central";
  sessions: BranchScheduledSession[];
};

export type BranchReputation = {
  ratingAverage: number;
  reviewCount: number;
  reviewSummary: BranchRatingDistribution[];
  reviews: BranchReview[];
  externalReviewLinks: BranchExternalReviewLink[];
  moderationState: "open" | "needs_review";
};

export type BranchPublishing = {
  requestedDiscoverable: boolean;
  isDiscoverable: boolean;
  eligibleForDiscovery: boolean;
  publishState: "published" | "ready" | "needs_attention" | "draft";
  completenessScore: number;
  lastPublishedAt?: string;
  pendingChecks: string[];
  recommendedChecks: string[];
};

export type BranchDetail = Branch & {
  slug: string;
  openingHours: BranchOpeningHour[];
  staff: BranchStaffMember[];
  plans: BranchOffering[];
  classes: BranchOffering[];
  watchlist: string[];
  identity: BranchIdentity;
  operations: BranchOperations;
  publicProfile: BranchPublicProfile;
  gallery: BranchGallery;
  socialLinks: BranchSocialLinks;
  commerce: BranchCommerce;
  programming: BranchProgramming;
  reputation: BranchReputation;
  publishing: BranchPublishing;
};

export type BranchPublicListingViewModel = {
  id: string;
  slug: string;
  name: string;
  address: string;
  heroImageUrl?: string;
  galleryImages: string[];
  featuredGalleryImageUrls: string[];
  overviewShort: string;
  overviewLong: string;
  amenities: BranchAmenity[];
  rules: BranchRuleItem[];
  plans: BranchPlanAssignment[];
  classes: BranchClassAssignment[];
  socialLinks: BranchSocialLinks;
  reviewAverage: number;
  reviewCount: number;
  reviewSummary: BranchRatingDistribution[];
  reviews: BranchReview[];
};

export type BranchFormState = {
  name: string;
  address: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  manager: string;
  phone: string;
  email: string;
  status: BranchStatus;
  note: string;
  tags: string;
  openingHours: BranchOpeningHour[];
  staff: BranchEditableStaffMember[];
  plans: string[];
  classes: string[];
  mediaLibrary: Array<{
    id: string;
    fileName: string;
    previewUrl: string;
    branchId: string;
    branchName: string;
  }>;
  gallery: string[];
  publicOverview: string;
  publicAmenities: string[];
  publicRules: BranchRuleItem[];
};
