import type { StatusTone } from "@/components/ui";

export type MemberStatusTone = StatusTone;
export type MemberStatus = "Active" | "Expiring" | "Inactive";

export type MemberRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  plan: string;
  branch: string;
  status: MemberStatus;
  tone: MemberStatusTone;
  classesBooked: number;
  lastVisit: string;
  expiryDate: string;
  joinedDate: string;
};

export const memberStatusOptions: MemberStatus[] = ["Active", "Expiring", "Inactive"];

export function getMemberTone(status: MemberStatus): MemberStatusTone {
  if (status === "Active") {
    return "success";
  }

  if (status === "Expiring") {
    return "warning";
  }

  return "neutral";
}

export const members: MemberRow[] = [
  {
    id: "MB-1042",
    name: "Howard Otuya",
    initials: "HO",
    email: "howard@gymdeck.app",
    phone: "+234 803 111 9021",
    plan: "Monthly Premium",
    branch: "Victoria Island",
    status: "Active",
    tone: getMemberTone("Active"),
    classesBooked: 12,
    lastVisit: "Today, 8:14 AM",
    expiryDate: "Mar 31, 2026",
    joinedDate: "Jan 09, 2026",
  },
  {
    id: "MB-1034",
    name: "Amaka Nnaji",
    initials: "AN",
    email: "amaka.nnaji@mail.com",
    phone: "+234 806 224 1180",
    plan: "6 Session Pack",
    branch: "Lekki Phase 1",
    status: "Expiring",
    tone: getMemberTone("Expiring"),
    classesBooked: 4,
    lastVisit: "Yesterday",
    expiryDate: "Mar 23, 2026",
    joinedDate: "Feb 17, 2026",
  },
  {
    id: "MB-1028",
    name: "Tobi Adebayo",
    initials: "TA",
    email: "tobi@adebayo.co",
    phone: "+234 809 552 8711",
    plan: "Monthly Standard",
    branch: "Ikeja Central",
    status: "Active",
    tone: getMemberTone("Active"),
    classesBooked: 7,
    lastVisit: "Today, 6:02 AM",
    expiryDate: "Apr 05, 2026",
    joinedDate: "Dec 14, 2025",
  },
  {
    id: "MB-1019",
    name: "Lara Kingsley",
    initials: "LK",
    email: "lara.kingsley@mail.com",
    phone: "+234 802 993 1440",
    plan: "Single Visit",
    branch: "Victoria Island",
    status: "Inactive",
    tone: getMemberTone("Inactive"),
    classesBooked: 0,
    lastVisit: "Mar 10, 2026",
    expiryDate: "Mar 20, 2026",
    joinedDate: "Mar 10, 2026",
  },
  {
    id: "MB-1007",
    name: "Chidi Nkem",
    initials: "CN",
    email: "chidi.nkem@mail.com",
    phone: "+234 807 447 9102",
    plan: "Monthly Premium",
    branch: "Yaba Studio",
    status: "Inactive",
    tone: getMemberTone("Inactive"),
    classesBooked: 2,
    lastVisit: "Mar 03, 2026",
    expiryDate: "Apr 01, 2026",
    joinedDate: "Nov 22, 2025",
  },
  {
    id: "MB-0998",
    name: "Kemi Obasi",
    initials: "KO",
    email: "kemi@studio.ng",
    phone: "+234 813 118 4412",
    plan: "Monthly Standard",
    branch: "Yaba Studio",
    status: "Active",
    tone: getMemberTone("Active"),
    classesBooked: 9,
    lastVisit: "Today, 7:45 AM",
    expiryDate: "Apr 08, 2026",
    joinedDate: "Oct 03, 2025",
  },
];

const memberOverviewReferenceDate = new Date("2026-03-22T00:00:00");

function getDaysUntilExpiry(expiryDate: string) {
  const expiryTime = new Date(expiryDate).getTime();

  if (Number.isNaN(expiryTime)) {
    return null;
  }

  return Math.ceil((expiryTime - memberOverviewReferenceDate.getTime()) / 86_400_000);
}

export function getMemberOverview(rows: MemberRow[]) {
  const activeCount = rows.filter((member) => member.status === "Active").length;
  const inactiveCount = rows.filter((member) => member.status === "Inactive").length;
  const expiringSoonCount = rows.filter((member) => {
    if (member.status === "Inactive") {
      return false;
    }

    const daysUntilExpiry = getDaysUntilExpiry(member.expiryDate);

    return daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }).length;

  return [
    {
      label: "Active members",
      value: activeCount.toLocaleString(),
    },
    {
      label: "Inactive members",
      value: inactiveCount.toLocaleString(),
    },
    {
      label: "7 days to expiry members",
      value: expiringSoonCount.toLocaleString(),
    },
  ];
}
