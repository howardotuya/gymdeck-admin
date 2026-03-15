export type HomeTabId = "overview" | "schedule" | "pricing" | "reviews";

export type HomeTab = {
  id: HomeTabId;
  label: string;
};

export type Amenity = {
  id: string;
  label: string;
};

export type RuleItem = {
  id: string;
  title: string;
  details?: string;
  expanded?: boolean;
};

export type ClassDay = {
  id: string;
  weekday: string;
  dayNumber: number;
  isActive?: boolean;
};

export type ClassCategory = {
  id: string;
  label: string;
  isActive?: boolean;
};

export type ClassSession = {
  id: string;
  badge: string;
  title: string;
  schedule: string;
  location: string;
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  suffix: string;
  features: string[];
  featured?: boolean;
};

export type Review = {
  id: string;
  author: string;
  title: string;
  text: string;
  postedAt: string;
};

export type RatingDistribution = {
  stars: number;
  widthPercent: number;
};
