import type { StatusTone } from "@/components/ui";

export type PlanTone = StatusTone;
export const planTypeOptions = ["Daily visit", "Session", "Monthly", "Yearly"] as const;
export const planAccessOptions = ["All-day access", "Single visit"] as const;
export const planStatusOptions = ["Active", "Draft", "Inactive"] as const;

export type PlanType = (typeof planTypeOptions)[number];
export type PlanAccess = (typeof planAccessOptions)[number];
export type PlanStatus = (typeof planStatusOptions)[number];

export type PlanEditorValues = {
  name: string;
  type: PlanType;
  access: PlanAccess;
  status: PlanStatus;
  priceAmount: number;
  note: string;
};

export type PlanCardItem = {
  id: string;
  name: string;
  type: PlanType;
  typeTone: PlanTone;
  status: PlanStatus;
  statusTone: PlanTone;
  price: string;
  cadence: string;
  branchScope: string;
  subscribers: string;
  revenue: string;
  access: PlanAccess;
  lastUpdated: string;
  features: string[];
  note: string;
};

export function extractLeadingNumber(value: string) {
  const match = value.match(/[\d,]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

export function extractCurrencyValue(value: string) {
  const match = value.match(/NGN\s*([\d.,]+)\s*([mk])?/i);

  if (!match) {
    return 0;
  }

  const amount = Number(match[1].replace(/,/g, ""));
  const suffix = match[2]?.toLowerCase();

  if (suffix === "m") {
    return amount * 1_000_000;
  }

  if (suffix === "k") {
    return amount * 1_000;
  }

  return amount;
}

export function formatPlanPrice(value: number) {
  return `NGN ${value.toLocaleString()}`;
}

function getDefaultPlanCadence(type: PlanType) {
  switch (type) {
    case "Daily visit":
      return "Same day • one-day validity";
    case "Session":
      return "6 sessions • 45 days";
    case "Yearly":
      return "365 days • recurring";
    case "Monthly":
    default:
      return "30 days • recurring";
  }
}

export function getPlanTypeTone(type: PlanType): PlanTone {
  switch (type) {
    case "Monthly":
    case "Yearly":
      return "brand";
    case "Session":
      return "success";
    case "Daily visit":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getPlanStatusTone(status: PlanStatus): PlanTone {
  switch (status) {
    case "Active":
      return "success";
    case "Draft":
      return "warning";
    case "Inactive":
      return "neutral";
    default:
      return "neutral";
  }
}

export function createPlanEditorValues(plan?: PlanCardItem): PlanEditorValues {
  if (!plan) {
    return {
      name: "",
      type: "Monthly",
      access: "All-day access",
      status: "Active",
      priceAmount: 0,
      note: "",
    };
  }

  return {
    name: plan.name,
    type: plan.type,
    access: plan.access,
    status: plan.status,
    priceAmount: extractCurrencyValue(plan.price),
    note: plan.note,
  };
}

export function buildPlanId(rows: PlanCardItem[]) {
  const maxId = rows.reduce((highestId, row) => {
    const match = row.id.match(/(\d+)$/);
    const parsed = match ? Number(match[1]) : 0;
    return Math.max(highestId, parsed);
  }, 100);

  return `PL-${(maxId + 1).toString().padStart(3, "0")}`;
}

type BuildPlanCardOptions = {
  id: string;
  subscribers?: string;
  revenue?: string;
  lastUpdated?: string;
  features?: string[];
  previousPlan?: PlanCardItem;
};

export function buildPlanCardItem(
  values: PlanEditorValues,
  {
    id,
    subscribers = "0 active subscribers",
    revenue = "Awaiting sales",
    lastUpdated = "Updated today by Membership Ops",
    features,
    previousPlan,
  }: BuildPlanCardOptions,
): PlanCardItem {
  const cadence =
    previousPlan && previousPlan.type === values.type
      ? previousPlan.cadence
      : getDefaultPlanCadence(values.type);
  const branchScope = previousPlan?.branchScope.trim() || "All branches";

  return {
    id,
    name: values.name.trim(),
    type: values.type,
    typeTone: getPlanTypeTone(values.type),
    status: values.status,
    statusTone: getPlanStatusTone(values.status),
    price: formatPlanPrice(values.priceAmount),
    cadence,
    branchScope,
    subscribers,
    revenue,
    access: values.access,
    lastUpdated,
    features:
      features ??
      [
        `${values.type} plan`,
        values.access,
        cadence,
        branchScope,
      ],
    note: values.note.trim(),
  };
}

export const planOverview = [
  {
    label: "Live plans",
    value: "14",
    detail: "Subscriptions, packs, and access products live across four branches",
    tone: "brand" as const,
  },
  {
    label: "Active subscribers",
    value: "1,284",
    detail: "742 monthly, 418 session pack, and 124 single-visit members",
    tone: "success" as const,
  },
  {
    label: "Recurring run-rate",
    value: "NGN 18.4M",
    detail: "Projected monthly recurring revenue from active subscription plans",
    tone: "success" as const,
  },
  {
    label: "Plans under review",
    value: "3",
    detail: "Low uptake, branch mismatch, or incomplete promo configuration",
    tone: "warning" as const,
  },
];

export const planFilters = {
  status: ["All status", "Active", "Draft", "Inactive"],
  type: ["All types", ...planTypeOptions],
  branch: [
    "All branches",
    "Victoria Island",
    "Lekki Phase 1",
    "Ikeja Central",
    "Yaba Studio",
  ],
};

export const planSegments = ["Active", "Draft", "Inactive"] as const;

export const pricingAttention = [
  {
    title: "Draft plan missing rules",
    detail: "Ladies Morning Promo still needs branch restriction and visibility dates before launch.",
    tone: "warning" as const,
  },
  {
    title: "Coverage gap",
    detail: "Ikeja Central does not yet have a premium plan that bundles class access.",
    tone: "danger" as const,
  },
  {
    title: "Low uptake",
    detail: "Weekend Warrior is flat over the last 30 days and may need a pricing review.",
    tone: "neutral" as const,
  },
];

export const plans: PlanCardItem[] = [
  {
    id: "PL-101",
    name: "Monthly Premium",
    type: "Monthly",
    typeTone: getPlanTypeTone("Monthly"),
    status: "Active",
    statusTone: getPlanStatusTone("Active"),
    price: "NGN 45,000",
    cadence: "30 days • recurring",
    branchScope: "Victoria Island + Lekki Phase 1",
    subscribers: "328 active subscribers",
    revenue: "NGN 14.8M / quarter",
    access: "All-day access",
    lastUpdated: "Updated 2 days ago by Jane D.",
    features: ["All-day gym access", "8 class credits", "Locker access", "Peak-hour access"],
    note: "High-retention flagship plan with strong evening demand and low churn.",
  },
  {
    id: "PL-102",
    name: "Monthly Standard",
    type: "Monthly",
    typeTone: getPlanTypeTone("Monthly"),
    status: "Active",
    statusTone: getPlanStatusTone("Active"),
    price: "NGN 28,000",
    cadence: "30 days • recurring",
    branchScope: "All branches",
    subscribers: "414 active subscribers",
    revenue: "NGN 11.6M / quarter",
    access: "All-day access",
    lastUpdated: "Updated 6 days ago by Musa K.",
    features: ["All-day gym access", "Locker access", "Branch switching", "Off-peak guest pass"],
    note: "Best-volume plan with consistent renewals and broad branch coverage.",
  },
  {
    id: "PL-103",
    name: "Annual Unlimited",
    type: "Yearly",
    typeTone: getPlanTypeTone("Yearly"),
    status: "Active",
    statusTone: getPlanStatusTone("Active"),
    price: "NGN 420,000",
    cadence: "365 days • recurring",
    branchScope: "All branches",
    subscribers: "92 active subscribers",
    revenue: "NGN 8.8M / quarter",
    access: "All-day access",
    lastUpdated: "Updated 3 days ago by Membership Ops",
    features: ["All-day gym access", "Best annual value", "Priority renewals", "Locker access"],
    note: "Annual product for members who prefer discounted long-term commitment.",
  },
  {
    id: "PL-104",
    name: "6 Session Pack",
    type: "Session",
    typeTone: getPlanTypeTone("Session"),
    status: "Active",
    statusTone: getPlanStatusTone("Active"),
    price: "NGN 36,000",
    cadence: "6 sessions • 45 days",
    branchScope: "Victoria Island + Yaba Studio",
    subscribers: "186 active subscribers",
    revenue: "NGN 4.1M / quarter",
    access: "Single visit",
    lastUpdated: "Updated yesterday by Howard O.",
    features: ["Flexible session usage", "Single-visit redemption", "Class booking enabled", "QR check-in"],
    note: "Useful entry plan for new members and short-term usage patterns.",
  },
  {
    id: "PL-105",
    name: "Day Pass",
    type: "Daily visit",
    typeTone: getPlanTypeTone("Daily visit"),
    status: "Active",
    statusTone: getPlanStatusTone("Active"),
    price: "NGN 8,000",
    cadence: "Same day • one-day validity",
    branchScope: "All branches",
    subscribers: "124 recent purchasers",
    revenue: "NGN 1.9M / quarter",
    access: "All-day access",
    lastUpdated: "Updated 11 days ago by Front Desk Ops",
    features: ["Same-day access", "All-day entry", "Front desk sale", "No auto-renew"],
    note: "Operational product for walk-ins and overflow demand at the desk.",
  },
  {
    id: "PL-106",
    name: "Ladies Morning Promo",
    type: "Monthly",
    typeTone: getPlanTypeTone("Monthly"),
    status: "Draft",
    statusTone: getPlanStatusTone("Draft"),
    price: "NGN 20,000",
    cadence: "30 days • weekday mornings",
    branchScope: "Victoria Island only",
    subscribers: "0 subscribers",
    revenue: "Awaiting launch",
    access: "All-day access",
    lastUpdated: "Draft updated today by Product Ops",
    features: ["Morning-only access", "Promo window", "Limited branch scope", "Campaign code support"],
    note: "Needs launch dates and branch restriction review before going live.",
  },
  {
    id: "PL-107",
    name: "Weekend Warrior",
    type: "Session",
    typeTone: getPlanTypeTone("Session"),
    status: "Inactive",
    statusTone: getPlanStatusTone("Inactive"),
    price: "NGN 22,000",
    cadence: "4 sessions • 30 days",
    branchScope: "Lekki Phase 1 + Ikeja Central",
    subscribers: "11 active subscribers",
    revenue: "NGN 420k / quarter",
    access: "Single visit",
    lastUpdated: "Deactivated 4 days ago by Jane D.",
    features: ["Weekend access", "Mobile booking", "Branch-specific pricing", "No weekday entry"],
    note: "Legacy plan retired from sale while the remaining subscribers run off naturally.",
  },
];

export const selectedPlan = {
  ...plans[0],
  description:
    "Premium recurring membership positioned as the highest-value plan for members who need daily gym access plus a controlled class allowance.",
  overview: [
    { label: "Price", value: "NGN 45,000" },
    { label: "Validity", value: "30 days recurring" },
    { label: "Branches", value: "2 branches" },
    { label: "Subscribers", value: "328 active" },
  ],
  subscriberMix: [
    { title: "Renewal rate", meta: "81% of expiring members renewed in the last 30 days" },
    { title: "Front desk upgrades", meta: "24 members upgraded from Monthly Standard this month" },
    { title: "Class-heavy usage", meta: "Average of 6.2 class bookings used per active member" },
  ],
  performance: [
    { title: "Revenue trend", meta: "Up 8.4% month-over-month after class bundle refresh" },
    { title: "Churn watch", meta: "19 members expire in the next 7 days and need renewal prompts" },
    { title: "Branch split", meta: "62% Victoria Island • 38% Lekki Phase 1" },
  ],
  editorSections: [
    {
      title: "Basic info",
      items: [
        "Plan name is used in storefront, receipts, and staff lookup.",
        "Type is Monthly and remains visible to all eligible branches.",
        "Internal owner is Membership Ops for pricing and renewal changes.",
      ],
    },
    {
      title: "Pricing",
      items: [
        "Base price is NGN 45,000 charged in NGN.",
        "Plan is tax-inclusive at checkout and refund-restricted after first use.",
        "Auto-renewal is enabled with card retry rules handled in payments.",
      ],
    },
    {
      title: "Validity period",
      items: [
        "Membership starts immediately after payment confirmation.",
        "Billing window is every 30 days with a 2-day grace period for renewal.",
        "Renewal reminders trigger 7 days and 2 days before expiry.",
      ],
    },
    {
      title: "Session rules",
      items: [
        "Includes 8 class credits per billing cycle.",
        "Unused class credits do not roll over.",
        "Waitlist promotion is allowed when class access credit is available.",
      ],
    },
    {
      title: "Access rules",
      items: [
        "All-day gym access including peak hours.",
        "Branch switching is allowed across Victoria Island and Lekki Phase 1.",
        "Manual suspension is available from member profile or front desk.",
      ],
    },
    {
      title: "Amenities included",
      items: [
        "Locker access",
        "Towel allocation",
        "Priority booking for premium studio slots",
      ],
    },
    {
      title: "Terms and cancellation",
      items: [
        "Cancellation request requires 48-hour notice before next renewal date.",
        "No pro-rated refund after first check-in or class use.",
        "Charge disputes route to finance and owner roles only.",
      ],
    },
    {
      title: "Visibility",
      items: [
        "Visible on public listing and app checkout.",
        "Front desk can assign manually during onboarding.",
        "Promo overrides are disabled to protect premium pricing.",
      ],
    },
  ],
  watchlist: [
    "Class-heavy members are consuming credits faster after the HIIT timetable expansion.",
    "Lekki branch has room to grow this plan if class inventory improves.",
    "Any pricing change here should be coordinated with payment receipt messaging.",
  ],
};

export function getPlanOverview(rows: PlanCardItem[]) {
  const activeCount = rows.filter((plan) => plan.status === "Active").length;
  const draftCount = rows.filter((plan) => plan.status === "Draft").length;
  const inactiveCount = rows.filter((plan) => plan.status === "Inactive").length;

  return [
    {
      label: "Active",
      value: activeCount.toString(),
      detail: `${activeCount} plan${activeCount === 1 ? "" : "s"} currently live in the catalog`,
    },
    {
      label: "Draft",
      value: draftCount.toString(),
      detail: `${draftCount} plan${draftCount === 1 ? "" : "s"} waiting for launch or review`,
    },
    {
      label: "Inactive",
      value: inactiveCount.toString(),
      detail: `${inactiveCount} retired plan${inactiveCount === 1 ? "" : "s"} still kept for reference`,
    },
  ];
}
