import type { StatusTone } from "@/components/ui";

export type SettingsTabId = "main" | "teams" | "gym-setup";

export type SettingsCardIcon =
  | "branches"
  | "notifications"
  | "staff"
  | "support"
  | "activity"
  | "members"
  | "gymProfile"
  | "gallery"
  | "amenities"
  | "reviews";

export type SettingsCard = {
  title: string;
  description: string;
  badge: string;
  tone: StatusTone;
  ctaLabel: string;
  href?: string;
  icon: SettingsCardIcon;
};

export const settingsTabs = [
  {
    id: "main" as const,
    label: "Main",
    description: "Core admin preferences, workspace defaults, and support pathways.",
  },
  {
    id: "teams" as const,
    label: "Teams",
    description: "Staff roles, activity, branch access, and team control modules.",
  },
  {
    id: "gym-setup" as const,
    label: "Gym Setup",
    description: "Public-facing gym details, media, rules, reviews, and notifications.",
  },
];

export const settingsTabIntro: Record<
  SettingsTabId,
  { title: string; description: string }
> = {
  main: {
    title: "Keep global admin controls in one place",
    description:
      "Main settings houses the cross-cutting controls that do not belong in day-to-day operations navigation. The sidebar stays lean while important configuration still remains easy to reach.",
  },
  teams: {
    title: "Team administration now lives inside Settings",
    description:
      "Team modules are grouped here so role changes, branch access, and audit history feel like part of one permission-management workflow instead of scattered navigation items.",
  },
  "gym-setup": {
    title: "Gym setup modules are grouped under one configuration workspace",
    description:
      "Public profile, gallery, amenities, reviews, and messaging now sit under one tabbed settings surface so operational navigation can stay focused on live workflows.",
  },
};

export const settingsCardsByTab: Record<SettingsTabId, SettingsCard[]> = {
  main: [
    {
      title: "Workspace defaults",
      description:
        "Review branch coverage, default operating branch context, and location-wide workspace behavior.",
      badge: "4 live branches",
      tone: "brand",
      ctaLabel: "View details",
      href: "/branches",
      icon: "branches",
    },
    {
      title: "Notifications center",
      description:
        "Configure which operational messages run by default and who receives internal alerts.",
      badge: "14 active templates",
      tone: "success",
      ctaLabel: "View details",
      href: "/notifications",
      icon: "notifications",
    },
    {
      title: "Access overview",
      description:
        "Inspect permission ownership, branch scope, and which roles can take restricted actions.",
      badge: "5 live roles",
      tone: "warning",
      ctaLabel: "View details",
      href: "/staff-roles",
      icon: "staff",
    },
    {
      title: "Help and support",
      description:
        "Open support guidance, escalation pathways, and admin documentation from the same settings hub.",
      badge: "Support ready",
      tone: "neutral",
      ctaLabel: "View details",
      href: "/support",
      icon: "support",
    },
  ],
  teams: [
    {
      title: "Staff & Roles",
      description:
        "Create roles, control branch access, and manage who can handle refunds, check-ins, and pricing updates.",
      badge: "Role control",
      tone: "brand",
      ctaLabel: "View details",
      href: "/staff-roles",
      icon: "staff",
    },
    {
      title: "Activity Log",
      description:
        "Track role changes, booking edits, pricing updates, and other internal staff activity over time.",
      badge: "24h history",
      tone: "warning",
      ctaLabel: "View details",
      href: "/activity-log",
      icon: "activity",
    },
    {
      title: "Branch access",
      description:
        "Review which staff can operate across multiple locations and where branch restrictions still need cleanup.",
      badge: "Multi-branch",
      tone: "success",
      ctaLabel: "View details",
      href: "/staff-roles",
      icon: "branches",
    },
    {
      title: "Team onboarding",
      description:
        "Handle invite flows, pending access requests, and onboarding checkpoints for new managers or front desk staff.",
      badge: "2 pending invites",
      tone: "neutral",
      ctaLabel: "View details",
      href: "/staff-roles",
      icon: "members",
    },
  ],
  "gym-setup": [
    {
      title: "Gym Profile",
      description:
        "Manage public identity, opening hours, contact details, location data, and visibility controls.",
      badge: "Public profile",
      tone: "brand",
      ctaLabel: "View details",
      href: "/gym-profile",
      icon: "gymProfile",
    },
    {
      title: "Gallery",
      description:
        "Upload, reorder, and curate the media shown across the listing and storefront surfaces.",
      badge: "Media curation",
      tone: "success",
      ctaLabel: "View details",
      href: "/gallery",
      icon: "gallery",
    },
    {
      title: "Amenities & Rules",
      description:
        "Control facility amenities, etiquette notes, and public guidance members see before they arrive.",
      badge: "Facility rules",
      tone: "warning",
      ctaLabel: "View details",
      href: "/amenities-rules",
      icon: "amenities",
    },
    {
      title: "Reviews",
      description:
        "Monitor review health, public sentiment, and moderation workflows from a single settings hub.",
      badge: "Reputation",
      tone: "neutral",
      ctaLabel: "View details",
      href: "/reviews",
      icon: "reviews",
    },
    {
      title: "Notifications",
      description:
        "Adjust booking, class, expiry, and receipt messaging without leaving the setup workspace.",
      badge: "Messaging",
      tone: "brand",
      ctaLabel: "View details",
      href: "/notifications",
      icon: "notifications",
    },
  ],
};

export function getSettingsTab(tabParam?: string | null): SettingsTabId {
  if (tabParam === "teams" || tabParam === "gym-setup") {
    return tabParam;
  }

  return "main";
}
