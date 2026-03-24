import type { StatusTone } from "@/components/ui";

export type StaffTabId = "employees" | "roles";

export type EmployeeStatus = "Active" | "Inactive" | "Invited" | "Deactivated";
export type RoleStatus = "Active" | "Inactive";
export type BranchScope = "All branches" | "Selected branches" | "Primary branch only";

export type EmployeeRow = {
  id: string;
  name: string;
  initials: string;
  employeeCode: string;
  role: string;
  team: string;
  branch: string;
  email: string;
  phone: string;
  status: EmployeeStatus;
  tone: StatusTone;
};

export type RoleRow = {
  id: string;
  name: string;
  team: string;
  branchScopeLabel: string;
  employeeCount: number;
  createdAt: string;
  status: RoleStatus;
  tone: StatusTone;
};

export type EmployeeFormState = {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  alternatePhone: string;
  branch: string;
};

export type PermissionModuleDefinition = {
  id: string;
  label: string;
  actions: string[];
};

export type RoleFormState = {
  name: string;
  description: string;
  team: string;
  reportsTo: string;
  branchScope: BranchScope;
  primaryBranch: string;
  selectedBranches: string[];
  permissions: Record<string, string[]>;
};

export const staffTabs: Array<{ id: StaffTabId; label: string }> = [
  { id: "employees", label: "Employees" },
  { id: "roles", label: "Roles" },
];

export const branchOptions = [
  "Victoria Island",
  "Lekki Phase 1",
  "Ikeja Central",
  "Yaba Studio",
] as const;

export const teamOptions = [
  "Operations",
  "Front Desk",
  "Coaching",
  "Classes",
  "Finance",
] as const;

export const roleOptions = [
  "General Manager",
  "Branch Manager",
  "Front Desk",
  "Coach",
  "Instructor",
  "Finance Admin",
] as const;

export const reportToOptions = [
  "Owner",
  "General Manager",
  "Branch Manager",
] as const;

export const permissionModules: PermissionModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    actions: ["View"],
  },
  {
    id: "members",
    label: "Members",
    actions: ["View", "Create", "Edit", "Deactivate"],
  },
  {
    id: "bookings",
    label: "Bookings",
    actions: ["View", "Create", "Edit", "Cancel"],
  },
  {
    id: "classes",
    label: "Classes",
    actions: ["View", "Create", "Edit", "Manage attendance"],
  },
  {
    id: "plans",
    label: "Passes and plans",
    actions: ["View", "Create", "Edit", "Deactivate"],
  },
  {
    id: "payments",
    label: "Payments",
    actions: ["View", "Export", "Refund", "Approve"],
  },
  {
    id: "branches",
    label: "Branches",
    actions: ["View", "Edit"],
  },
  {
    id: "staff",
    label: "Staff",
    actions: ["View", "Invite", "Edit roles", "Deactivate"],
  },
];

function getEmployeeTone(status: EmployeeStatus): StatusTone {
  if (status === "Active") {
    return "success";
  }

  if (status === "Invited") {
    return "brand";
  }

  return "neutral";
}

function getRoleTone(status: RoleStatus): StatusTone {
  return status === "Active" ? "success" : "neutral";
}

export const employees: EmployeeRow[] = [
  {
    id: "EMP-2014",
    name: "Damilola Nnadi",
    initials: "DN",
    employeeCode: "GD-2014",
    role: "General Manager",
    team: "Operations",
    branch: "Victoria Island",
    email: "damilola@gymdeck.app",
    phone: "+234 803 204 4402",
    status: "Active",
    tone: getEmployeeTone("Active"),
  },
  {
    id: "EMP-2012",
    name: "Uche Briggs",
    initials: "UB",
    employeeCode: "GD-2012",
    role: "Branch Manager",
    team: "Operations",
    branch: "Lekki Phase 1",
    email: "uche@gymdeck.app",
    phone: "+234 805 880 4012",
    status: "Active",
    tone: getEmployeeTone("Active"),
  },
  {
    id: "EMP-2007",
    name: "Korede Ajayi",
    initials: "KA",
    employeeCode: "GD-2007",
    role: "Coach",
    team: "Coaching",
    branch: "Victoria Island",
    email: "korede.ajayi@mail.com",
    phone: "+234 813 118 7720",
    status: "Invited",
    tone: getEmployeeTone("Invited"),
  },
  {
    id: "EMP-1998",
    name: "Mariam Hassan",
    initials: "MH",
    employeeCode: "GD-1998",
    role: "Instructor",
    team: "Classes",
    branch: "Yaba Studio",
    email: "mariam@gymdeck.app",
    phone: "+234 802 994 1108",
    status: "Inactive",
    tone: getEmployeeTone("Inactive"),
  },
  {
    id: "EMP-1975",
    name: "Femi Ojo",
    initials: "FO",
    employeeCode: "GD-1975",
    role: "Front Desk",
    team: "Front Desk",
    branch: "Ikeja Central",
    email: "femi.ojo@mail.com",
    phone: "+234 809 550 0182",
    status: "Deactivated",
    tone: getEmployeeTone("Deactivated"),
  },
];

export const roles: RoleRow[] = [
  {
    id: "ROLE-101",
    name: "General Manager",
    team: "Operations",
    branchScopeLabel: "All branches",
    employeeCount: 1,
    createdAt: "Mar 22, 2026",
    status: "Active",
    tone: getRoleTone("Active"),
  },
  {
    id: "ROLE-102",
    name: "Branch Manager",
    team: "Operations",
    branchScopeLabel: "Multiple branches (3)",
    employeeCount: 3,
    createdAt: "Mar 18, 2026",
    status: "Active",
    tone: getRoleTone("Active"),
  },
  {
    id: "ROLE-103",
    name: "Coach",
    team: "Coaching",
    branchScopeLabel: "Victoria Island",
    employeeCount: 8,
    createdAt: "Mar 12, 2026",
    status: "Active",
    tone: getRoleTone("Active"),
  },
  {
    id: "ROLE-104",
    name: "Finance Admin",
    team: "Finance",
    branchScopeLabel: "All branches",
    employeeCount: 2,
    createdAt: "Feb 28, 2026",
    status: "Inactive",
    tone: getRoleTone("Inactive"),
  },
];

export function getStaffTab(tab?: string | null): StaffTabId {
  return tab === "roles" ? "roles" : "employees";
}

export function getEmployeeOverview(rows: EmployeeRow[]) {
  const activeCount = rows.filter((row) => row.status === "Active").length;
  const inactiveCount = rows.filter((row) => row.status === "Inactive").length;
  const invitedCount = rows.filter((row) => row.status === "Invited").length;
  const deactivatedCount = rows.filter((row) => row.status === "Deactivated").length;

  return [
    { label: "Active employees", value: activeCount.toLocaleString() },
    { label: "Inactive employees", value: inactiveCount.toLocaleString() },
    { label: "Invited employees", value: invitedCount.toLocaleString() },
    { label: "Deactivated employees", value: deactivatedCount.toLocaleString() },
  ];
}

export function getRoleOverview(rows: RoleRow[]) {
  const activeCount = rows.filter((row) => row.status === "Active").length;
  const inactiveCount = rows.filter((row) => row.status === "Inactive").length;

  return [
    { label: "Active roles", value: activeCount.toLocaleString() },
    { label: "Inactive roles", value: inactiveCount.toLocaleString() },
  ];
}

export function getEmployeeById(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId);
}

export function createEmployeeFormState(employee?: EmployeeRow): EmployeeFormState {
  const [firstName = "", ...lastNameParts] = employee?.name.split(" ") ?? [];

  return {
    firstName,
    lastName: lastNameParts.join(" "),
    role: employee?.role ?? roleOptions[0],
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
    alternatePhone: "",
    branch: employee?.branch ?? branchOptions[0],
  };
}

export function createRoleFormState(): RoleFormState {
  const permissions = permissionModules.reduce<Record<string, string[]>>((accumulator, module) => {
    accumulator[module.id] = [];
    return accumulator;
  }, {});

  return {
    name: "",
    description: "",
    team: teamOptions[0],
    reportsTo: reportToOptions[0],
    branchScope: "Selected branches",
    primaryBranch: branchOptions[0],
    selectedBranches: [branchOptions[0]],
    permissions,
  };
}
