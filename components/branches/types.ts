import type { StatusTone } from "@/components/ui";

export type BranchStatus = "Live" | "Watch" | "Opening soon" | "Inactive";

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

export type BranchDetail = Branch & {
  openingHours: BranchOpeningHour[];
  staff: BranchStaffMember[];
  plans: BranchOffering[];
  classes: BranchOffering[];
  watchlist: string[];
};

export type BranchFormState = {
  name: string;
  address: string;
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
};
