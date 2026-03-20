import type { StatusTone } from "@/components/ui";

export type PlanTone = StatusTone;

export type PlanCardItem = {
  id: string;
  name: string;
  type: string;
  typeTone: PlanTone;
  status: string;
  statusTone: PlanTone;
  price: string;
  cadence: string;
  branchScope: string;
  subscribers: string;
  revenue: string;
  access: string;
  lastUpdated: string;
  features: string[];
  note: string;
};

function extractLeadingNumber(value: string) {
  const match = value.match(/[\d,]+/);
  return match ? Number(match[0].replace(/,/g, "")) : 0;
}

function extractCurrencyValue(value: string) {
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

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    const amount = value / 1_000_000;
    return `NGN ${amount.toFixed(Number.isInteger(amount) ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    const amount = value / 1_000;
    return `NGN ${amount.toFixed(Number.isInteger(amount) ? 0 : 1)}k`;
  }

  return `NGN ${value.toLocaleString()}`;
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
  status: ["All status", "Active", "Draft", "Paused", "Archived"],
  type: [
    "All types",
    "Monthly subscription",
    "Session pack",
    "Single visit",
    "Promo pass",
  ],
  branch: [
    "All branches",
    "Victoria Island",
    "Lekki Phase 1",
    "Ikeja Central",
    "Yaba Studio",
  ],
};

export const planSegments = ["Active", "Draft", "Archived"] as const;

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
    type: "Monthly subscription",
    typeTone: "brand",
    status: "Active",
    statusTone: "success",
    price: "NGN 45,000",
    cadence: "30 days • recurring",
    branchScope: "Victoria Island + Lekki Phase 1",
    subscribers: "328 active subscribers",
    revenue: "NGN 14.8M / quarter",
    access: "Gym access + 8 classes monthly",
    lastUpdated: "Updated 2 days ago by Jane D.",
    features: ["Full gym access", "8 class credits", "Locker access", "Peak-hour access"],
    note: "High-retention flagship plan with strong evening demand and low churn.",
  },
  {
    id: "PL-102",
    name: "Monthly Standard",
    type: "Monthly subscription",
    typeTone: "brand",
    status: "Active",
    statusTone: "success",
    price: "NGN 28,000",
    cadence: "30 days • recurring",
    branchScope: "All branches",
    subscribers: "414 active subscribers",
    revenue: "NGN 11.6M / quarter",
    access: "Gym access only",
    lastUpdated: "Updated 6 days ago by Musa K.",
    features: ["Full gym access", "Locker access", "Branch switching", "Off-peak guest pass"],
    note: "Best-volume plan with consistent renewals and broad branch coverage.",
  },
  {
    id: "PL-103",
    name: "6 Session Pack",
    type: "Session pack",
    typeTone: "success",
    status: "Active",
    statusTone: "success",
    price: "NGN 36,000",
    cadence: "6 sessions • 45 days",
    branchScope: "Victoria Island + Yaba Studio",
    subscribers: "186 active subscribers",
    revenue: "NGN 4.1M / quarter",
    access: "Gym or class access depending on slot",
    lastUpdated: "Updated yesterday by Howard O.",
    features: ["Flexible session usage", "Class booking enabled", "Shareable with dependents", "QR check-in"],
    note: "Useful entry plan for new members and short-term usage patterns.",
  },
  {
    id: "PL-104",
    name: "Single Visit",
    type: "Single visit",
    typeTone: "neutral",
    status: "Active",
    statusTone: "neutral",
    price: "NGN 8,000",
    cadence: "1 visit • same day",
    branchScope: "All branches",
    subscribers: "124 recent purchasers",
    revenue: "NGN 1.9M / quarter",
    access: "Front desk walk-in access",
    lastUpdated: "Updated 11 days ago by Front Desk Ops",
    features: ["Same-day access", "Front desk sale", "QR validation", "No auto-renew"],
    note: "Operational product for walk-ins and overflow demand at the desk.",
  },
  {
    id: "PL-105",
    name: "Ladies Morning Promo",
    type: "Promo pass",
    typeTone: "warning",
    status: "Draft",
    statusTone: "warning",
    price: "NGN 20,000",
    cadence: "30 days • weekday mornings",
    branchScope: "Victoria Island only",
    subscribers: "0 subscribers",
    revenue: "Awaiting launch",
    access: "Morning gym access + selected low-fill classes",
    lastUpdated: "Draft updated today by Product Ops",
    features: ["Morning-only access", "Promo window", "Limited branch scope", "Campaign code support"],
    note: "Needs launch dates and branch restriction review before going live.",
  },
  {
    id: "PL-106",
    name: "Weekend Warrior",
    type: "Session pack",
    typeTone: "success",
    status: "Paused",
    statusTone: "danger",
    price: "NGN 22,000",
    cadence: "4 sessions • 30 days",
    branchScope: "Lekki Phase 1 + Ikeja Central",
    subscribers: "11 active subscribers",
    revenue: "NGN 420k / quarter",
    access: "Weekend-only gym access",
    lastUpdated: "Paused 4 days ago by Jane D.",
    features: ["Weekend access", "Mobile booking", "Branch-specific pricing", "No weekday entry"],
    note: "Underperforming product currently paused pending repositioning.",
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
        "Type is Monthly subscription and remains visible to all eligible branches.",
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
  const reviewCount = rows.filter((plan) => plan.status !== "Active").length;
  const subscriberCount = rows.reduce(
    (total, plan) => total + extractLeadingNumber(plan.subscribers),
    0,
  );
  const revenueTotal = rows.reduce(
    (total, plan) => total + extractCurrencyValue(plan.revenue),
    0,
  );

  return [
    {
      label: "Active plans",
      value: activeCount.toString(),
      detail:
        reviewCount > 0
          ? `${reviewCount} more plan${reviewCount === 1 ? "" : "s"} in draft or paused state`
          : "All listed plans are currently live",
    },
    {
      label: "Subscribers covered",
      value: subscriberCount.toLocaleString(),
      detail: `Across ${rows.length} pricing products in the current catalog`,
    },
    {
      label: "Quarterly revenue",
      value: formatCompactCurrency(revenueTotal),
      detail: "Projected contribution from the plans listed in this workspace",
    },
    {
      label: "Needs review",
      value: reviewCount.toString(),
      detail:
        reviewCount > 0
          ? "Plans waiting on launch, pricing changes, or activation"
          : "No plans are waiting on review",
    },
  ];
}
