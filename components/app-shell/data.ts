export type NavIconName =
  | "dashboard"
  | "branches"
  | "members"
  | "bookings"
  | "classes"
  | "plans"
  | "payments"
  | "gymProfile"
  | "gallery"
  | "amenities"
  | "reviews"
  | "notifications"
  | "staff"
  | "activity"
  | "settings"
  | "support";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type AdminPageMeta = {
  title: string;
  description: string;
  group: string;
};

export const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: "dashboard" },
      { href: "/branches", label: "Branches", icon: "branches" },
      { href: "/members", label: "Members", icon: "members" },
      { href: "/bookings", label: "Bookings", icon: "bookings" },
      { href: "/classes", label: "Classes", icon: "classes" },
      { href: "/plans", label: "Pricing and plans", icon: "plans" },
      { href: "/payments", label: "Transactions", icon: "payments" },
    ],
  },
];

export const sidebarUtilityItems: NavItem[] = [
  { href: "/support", label: "Help & Support", icon: "support" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export const workspaceSummary = {
  name: "GymDeck HQ",
  description: "Multi-branch operations workspace for owners, managers, and front desk staff.",
  activeBranch: "Victoria Island",
  branchCount: "4 live branches",
};

export const workspaceBranches = [
  { name: "Victoria Island", detail: "Primary branch", active: true },
  { name: "Lekki Phase 1", detail: "Peak evening traffic", active: false },
  { name: "Ikeja Central", detail: "Strong walk-in sales", active: false },
  { name: "Yaba Studio", detail: "Class-heavy location", active: false },
] as const;

const settingsHubPaths = new Set([
  "settings",
  "gym-profile",
  "gallery",
  "amenities-rules",
  "reviews",
  "notifications",
  "staff-roles",
  "activity-log",
]);

export const pageMetaByPath: Record<string, AdminPageMeta> = {
  "/": {
    title: "Dashboard",
    description: "Monitor members, check-ins, bookings, revenue, and staff alerts from one operational view.",
    group: "Main",
  },
  "/branches": {
    title: "Branches",
    description: "Manage locations, staff coverage, opening hours, and branch availability.",
    group: "Main",
  },
  "/members": {
    title: "Members",
    description: "Track memberships, last visits, plan status, payment history, and access actions.",
    group: "Main",
  },
  "/bookings": {
    title: "Bookings",
    description: "Review gym access bookings, class reservations, no-shows, and check-in states.",
    group: "Main",
  },
  "/classes": {
    title: "Classes",
    description: "Manage instructors, schedules, capacity rules, waitlists, and session performance.",
    group: "Main",
  },
  "/plans": {
    title: "Pricing and plans",
    description: "Create and control pricing plans, session packs, subscriptions, and access rules.",
    group: "Main",
  },
  "/payments": {
    title: "Transactions",
    description: "Track transaction volume, refunds, payment states, and invoice activity in one ledger.",
    group: "Main",
  },
  "/gym-profile": {
    title: "Gym Profile",
    description: "Edit the public identity, contact details, address, opening hours, and visibility settings.",
    group: "Settings",
  },
  "/gallery": {
    title: "Gallery",
    description: "Upload, reorder, and curate media used across the public gym profile and hero sections.",
    group: "Settings",
  },
  "/amenities-rules": {
    title: "Amenities & Rules",
    description: "Maintain amenity lists, house rules, etiquette notes, and later icon mapping.",
    group: "Settings",
  },
  "/reviews": {
    title: "Reviews",
    description: "Monitor ratings, public feedback, responses, and moderation workflows.",
    group: "Settings",
  },
  "/notifications": {
    title: "Notifications",
    description: "Control email, push, and future messaging templates for operational communication.",
    group: "Settings",
  },
  "/staff-roles": {
    title: "Staff & Roles",
    description: "Invite staff, assign branch access, define permissions, and manage role restrictions.",
    group: "Settings",
  },
  "/activity-log": {
    title: "Activity Log",
    description: "Audit pricing changes, booking edits, staff actions, and module activity by timestamp.",
    group: "Settings",
  },
  "/settings": {
    title: "Settings",
    description: "Manage core admin preferences, teams, and gym setup from one lean settings workspace.",
    group: "Settings",
  },
  "/support": {
    title: "Help & Support",
    description: "Access admin help, operational guidance, and platform support pathways.",
    group: "Settings",
  },
};

export function getPageMeta(pathname: string): AdminPageMeta {
  if (pathname === "/branches/new") {
    return {
      title: "Add Branch",
      description: "Create a branch profile, assign staff, configure hours, and choose plans and classes.",
      group: "Main",
    };
  }

  if (pathname.startsWith("/branches/") && pathname.endsWith("/edit")) {
    return {
      title: "Edit Branch",
      description: "Update branch profile, staff ownership, opening hours, and product coverage.",
      group: "Main",
    };
  }

  if (pathname.startsWith("/branches/")) {
    return {
      title: "Branch Details",
      description: "Review profile, opening hours, assigned staff, plans, and available classes for a branch.",
      group: "Main",
    };
  }

  const directMatch = pageMetaByPath[pathname];

  if (directMatch) {
    return directMatch;
  }

  const [firstSegment] = pathname.split("/").filter(Boolean);

  if (!firstSegment) {
    return pageMetaByPath["/"];
  }

  return getSectionMeta(firstSegment);
}

export function isKnownSection(section: string) {
  return Object.prototype.hasOwnProperty.call(pageMetaByPath, `/${section}`);
}

export function isSettingsHubPath(pathname: string) {
  const [firstSegment] = pathname.split("/").filter(Boolean);

  return Boolean(firstSegment && settingsHubPaths.has(firstSegment));
}

export function getSectionMeta(section: string): AdminPageMeta {
  const fallbackTitle = section
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    pageMetaByPath[`/${section}`] ?? {
      title: fallbackTitle,
      description: "This module is part of the GymDeck admin rollout.",
      group: "System",
    }
  );
}
