import type { StatusTone } from "@/components/ui";
import type {
  Branch,
  BranchDetail,
  BranchEditableStaffMember,
  BranchFormState,
  BranchOffering,
  BranchOpeningHour,
  BranchStatus,
} from "./types";

export const branchStatusOptions: BranchStatus[] = [
  "Live",
  "Watch",
  "Opening soon",
  "Inactive",
];

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

export const branchPlanOptions: BranchOffering[] = [
  {
    id: "monthly-premium",
    name: "Monthly Premium",
    detail: "Unlimited branch access, recovery amenities, and priority booking windows.",
  },
  {
    id: "monthly-standard",
    name: "Monthly Standard",
    detail: "Core monthly membership with standard class booking allowances.",
  },
  {
    id: "six-session-pack",
    name: "6 Session Pack",
    detail: "Flexible pass pack for casual members and short-term visitors.",
  },
  {
    id: "single-visit",
    name: "Single Visit",
    detail: "One-day access for walk-ins, trials, and guest referrals.",
  },
  {
    id: "couples-membership",
    name: "Couples Membership",
    detail: "Shared membership pricing for paired subscriptions and referrals.",
  },
  {
    id: "corporate-flex",
    name: "Corporate Flex",
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

const defaultOpeningHours: BranchOpeningHour[] = [
  { id: "monday", day: "Monday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "tuesday", day: "Tuesday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "wednesday", day: "Wednesday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "thursday", day: "Thursday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "friday", day: "Friday", isOpen: true, openTime: "05:30", closeTime: "22:00" },
  { id: "saturday", day: "Saturday", isOpen: true, openTime: "06:00", closeTime: "21:00" },
  { id: "sunday", day: "Sunday", isOpen: true, openTime: "08:00", closeTime: "20:00" },
];

function cloneOpeningHours(hours: BranchOpeningHour[]) {
  return hours.map((hour) => ({ ...hour }));
}

function cloneStaff(staff: BranchEditableStaffMember[]) {
  return staff.map((member) => ({ ...member }));
}

function pickOfferings(source: BranchOffering[], ids: string[]) {
  return ids
    .map((id) => source.find((item) => item.id === id))
    .filter((item): item is BranchOffering => Boolean(item))
    .map((item) => ({ ...item }));
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

const branchDetails: BranchDetail[] = [
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
  if (!branch) {
    return {
      name: "",
      address: "",
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
    };
  }

  return {
    name: branch.name,
    address: branch.address,
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
  };
}
