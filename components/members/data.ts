import type { StatusTone } from "@/components/ui";

export type MemberStatusTone = StatusTone;
export type MemberStatus = "Active" | "Expiring" | "Paused" | "Suspended";

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

export function getMemberTone(status: MemberStatus): MemberStatusTone {
  if (status === "Active") {
    return "success";
  }

  if (status === "Expiring") {
    return "warning";
  }

  if (status === "Suspended") {
    return "danger";
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
    status: "Paused",
    tone: getMemberTone("Paused"),
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
    status: "Suspended",
    tone: getMemberTone("Suspended"),
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

export function getMemberOverview(rows: MemberRow[]) {
  const activeCount = rows.filter((member) => member.status === "Active").length;
  const expiringCount = rows.filter((member) => member.status === "Expiring").length;
  const inactiveCount = rows.filter(
    (member) => member.status === "Paused" || member.status === "Suspended",
  ).length;
  const classesBooked = rows.reduce((total, member) => total + member.classesBooked, 0);
  const recentVisits = rows.filter(
    (member) => member.lastVisit.includes("Today") || member.lastVisit.includes("Yesterday"),
  ).length;

  return [
    {
      label: "Active members",
      value: activeCount.toLocaleString(),
      detail: `${recentVisits} checked in today or yesterday`,
    },
    {
      label: "Renewal watch",
      value: expiringCount.toLocaleString(),
      detail: "Members nearing renewal and requiring follow-up",
    },
    {
      label: "Paused or suspended",
      value: inactiveCount.toLocaleString(),
      detail: "Members currently unavailable for entry or class booking",
    },
    {
      label: "Classes booked",
      value: classesBooked.toLocaleString(),
      detail: `Across ${rows.length.toLocaleString()} member records in this roster`,
    },
  ];
}
