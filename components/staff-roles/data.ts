import type { StatusTone } from "@/components/ui";

export type StaffTabId = "employees" | "roles";

export type EmployeeStatus = "Active" | "Inactive" | "Invited" | "Deactivated";
export type RoleStatus = "Active" | "Inactive";
export type BranchScope = "All branches" | "Selected branches";

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

export type RoleRecord = RoleRow & {
  description: string;
  selectedBranches: string[];
  permissions: Record<string, string[]>;
};

export type RoleDetailRecord = {
  role: RoleRecord;
  employees: EmployeeRow[];
  permissionModules: Array<{
    id: string;
    label: string;
    description: string;
    submodules: Array<{
      id: string;
      label: string;
      features: string[];
    }>;
  }>;
  permissionCount: number;
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

export type EmployeeDetailRecord = {
  employee: EmployeeRow;
  roleRecord: RoleRecord | null;
  accessibleModules: Array<{
    id: string;
    label: string;
    description: string;
    featureLabels: string[];
  }>;
  branchAccess: string[];
  permissionCount: number;
};

export type PermissionFeatureDefinition = {
  id: string;
  label: string;
  description: string;
};

export type PermissionSubmoduleDefinition = {
  id: string;
  label: string;
  description: string;
  features: PermissionFeatureDefinition[];
};

export type PermissionModuleDefinition = {
  id: string;
  label: string;
  description: string;
  submodules: PermissionSubmoduleDefinition[];
};

export type RoleFormState = {
  name: string;
  description: string;
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
  "Surulere",
  "Ikoyi",
  "Maryland",
  "Ajah",
  "Magodo",
  "Wuse 2",
  "Gwarinpa",
] as const;

export const roleOptions = [
  "General Manager",
  "Branch Manager",
  "Front Desk",
  "Coach",
  "Instructor",
  "Finance Admin",
] as const;

export const permissionModules: PermissionModuleDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview surfaces, branch performance, and quick operational context.",
    submodules: [
      {
        id: "dashboard-overview",
        label: "Overview",
        description: "Core dashboard views used to monitor branch and business performance.",
        features: [
          {
            id: "dashboard.view-overview",
            label: "View performance overview",
            description: "See revenue, attendance, and branch activity snapshots.",
          },
          {
            id: "dashboard.view-branch-cards",
            label: "View branch scorecards",
            description: "Open branch-level health cards and trend summaries.",
          },
        ],
      },
    ],
  },
  {
    id: "members",
    label: "Members",
    description: "Member records, lifecycle controls, and service desk actions.",
    submodules: [
      {
        id: "members-directory",
        label: "Member directory",
        description: "Search and maintain the active member register.",
        features: [
          {
            id: "members.view-directory",
            label: "View member directory",
            description: "Open member lists, profiles, and account snapshots.",
          },
          {
            id: "members.create-member",
            label: "Create member records",
            description: "Register new members and capture their initial details.",
          },
          {
            id: "members.edit-profile",
            label: "Edit member profiles",
            description: "Update contact details, profile data, and notes.",
          },
        ],
      },
      {
        id: "members-lifecycle",
        label: "Lifecycle actions",
        description: "Control member access when status changes are required.",
        features: [
          {
            id: "members.deactivate",
            label: "Deactivate members",
            description: "Suspend or deactivate member accounts when needed.",
          },
        ],
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    description: "Reservations, booking adjustments, and front desk exceptions.",
    submodules: [
      {
        id: "bookings-reservations",
        label: "Reservations",
        description: "Handle day-to-day booking activity across classes and sessions.",
        features: [
          {
            id: "bookings.view",
            label: "View bookings",
            description: "Review current and past booking activity.",
          },
          {
            id: "bookings.create",
            label: "Create bookings",
            description: "Add bookings on behalf of members or walk-ins.",
          },
          {
            id: "bookings.edit",
            label: "Edit bookings",
            description: "Reschedule bookings or correct booking details.",
          },
        ],
      },
      {
        id: "bookings-exceptions",
        label: "Exceptions",
        description: "Resolve booking issues that require a direct override.",
        features: [
          {
            id: "bookings.cancel",
            label: "Cancel bookings",
            description: "Cancel reservations and free up occupied capacity.",
          },
        ],
      },
    ],
  },
  {
    id: "classes",
    label: "Classes",
    description: "Class schedules, delivery setup, and attendance handling.",
    submodules: [
      {
        id: "classes-schedule",
        label: "Schedule management",
        description: "Create and maintain the class catalogue and schedule.",
        features: [
          {
            id: "classes.view",
            label: "View classes",
            description: "Browse the class timetable and schedule details.",
          },
          {
            id: "classes.create",
            label: "Create classes",
            description: "Publish new classes and assign delivery details.",
          },
          {
            id: "classes.edit",
            label: "Edit classes",
            description: "Adjust instructors, capacity, or schedule information.",
          },
        ],
      },
      {
        id: "classes-attendance",
        label: "Attendance",
        description: "Track and manage participation after bookings are confirmed.",
        features: [
          {
            id: "classes.manage-attendance",
            label: "Manage attendance",
            description: "Check members in, mark no-shows, and update attendance.",
          },
        ],
      },
    ],
  },
  {
    id: "plans",
    label: "Passes and plans",
    description: "Membership products, plan maintenance, and pricing exposure.",
    submodules: [
      {
        id: "plans-catalogue",
        label: "Catalogue",
        description: "Manage the pass and plan offering available to members.",
        features: [
          {
            id: "plans.view",
            label: "View passes and plans",
            description: "Review the active product catalogue and pricing setup.",
          },
          {
            id: "plans.create",
            label: "Create passes and plans",
            description: "Add new membership products, passes, or pricing options.",
          },
          {
            id: "plans.edit",
            label: "Edit passes and plans",
            description: "Update product terms, pricing, and member-facing details.",
          },
        ],
      },
      {
        id: "plans-lifecycle",
        label: "Lifecycle controls",
        description: "Retire products that should no longer be sold or renewed.",
        features: [
          {
            id: "plans.deactivate",
            label: "Deactivate passes and plans",
            description: "Disable outdated or retired membership products.",
          },
        ],
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    description: "Transactions, exports, approvals, and post-payment fixes.",
    submodules: [
      {
        id: "payments-transactions",
        label: "Transactions",
        description: "Review completed and in-flight payment activity.",
        features: [
          {
            id: "payments.view",
            label: "View payments",
            description: "See transaction history, status, and payment details.",
          },
          {
            id: "payments.export",
            label: "Export payment records",
            description: "Download transaction exports for reconciliation or reporting.",
          },
        ],
      },
      {
        id: "payments-controls",
        label: "Financial controls",
        description: "Handle adjustments that affect money movement or approval.",
        features: [
          {
            id: "payments.refund",
            label: "Refund payments",
            description: "Issue refunds for eligible member transactions.",
          },
          {
            id: "payments.approve",
            label: "Approve payment actions",
            description: "Approve sensitive payment changes or exception requests.",
          },
        ],
      },
    ],
  },
  {
    id: "branches",
    label: "Branches",
    description: "Gym locations, operational profile, and branch configuration.",
    submodules: [
      {
        id: "branches-directory",
        label: "Branch directory",
        description: "Access branch records, summaries, and operational context.",
        features: [
          {
            id: "branches.view",
            label: "View branches",
            description: "Open branch profiles, operating status, and summaries.",
          },
        ],
      },
      {
        id: "branches-configuration",
        label: "Configuration",
        description: "Update branch-specific operating details and presentation.",
        features: [
          {
            id: "branches.edit",
            label: "Edit branch settings",
            description: "Update branch profile details, settings, and availability.",
          },
        ],
      },
    ],
  },
  {
    id: "staff",
    label: "Staff",
    description: "Employee access, invitations, and role assignment controls.",
    submodules: [
      {
        id: "staff-directory",
        label: "Staff directory",
        description: "Access staff records and create new employee invitations.",
        features: [
          {
            id: "staff.view",
            label: "View staff directory",
            description: "See staff records, assignments, and status details.",
          },
          {
            id: "staff.invite",
            label: "Invite staff",
            description: "Send invitations and create new employee records.",
          },
        ],
      },
      {
        id: "staff-access",
        label: "Access control",
        description: "Manage role scope and remove access when required.",
        features: [
          {
            id: "staff.edit-roles",
            label: "Edit staff roles",
            description: "Change role assignments and permission scope for staff.",
          },
          {
            id: "staff.deactivate",
            label: "Deactivate staff",
            description: "Remove platform access for offboarded or inactive staff.",
          },
        ],
      },
    ],
  },
];

export function getSubmodulePermissionIds(submodule: PermissionSubmoduleDefinition) {
  return submodule.features.map((feature) => feature.id);
}

export function getModulePermissionIds(module: PermissionModuleDefinition) {
  return module.submodules.flatMap((submodule) => getSubmodulePermissionIds(submodule));
}

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

function createEmptyRolePermissions() {
  return permissionModules.reduce<Record<string, string[]>>((accumulator, module) => {
    accumulator[module.id] = [];
    return accumulator;
  }, {});
}

function createRolePermissions(
  selectedPermissions: Record<string, string[]>,
) {
  return {
    ...createEmptyRolePermissions(),
    ...selectedPermissions,
  };
}

const roleRecords: RoleRecord[] = [
  {
    id: "ROLE-101",
    name: "General Manager",
    team: "Operations",
    branchScopeLabel: "All branches",
    employeeCount: 1,
    createdAt: "Mar 22, 2026",
    status: "Active",
    tone: getRoleTone("Active"),
    description: "Oversees branch operations, staff coordination, and key service decisions across the network.",
    selectedBranches: [...branchOptions],
    permissions: createRolePermissions({
      dashboard: getModulePermissionIds(permissionModules[0]),
      members: getModulePermissionIds(permissionModules[1]),
      bookings: getModulePermissionIds(permissionModules[2]),
      classes: getModulePermissionIds(permissionModules[3]),
      plans: getModulePermissionIds(permissionModules[4]),
      payments: getModulePermissionIds(permissionModules[5]),
      branches: getModulePermissionIds(permissionModules[6]),
      staff: getModulePermissionIds(permissionModules[7]),
    }),
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
    description: "Runs day-to-day branch operations, handles member exceptions, and manages local staff coverage.",
    selectedBranches: ["Victoria Island", "Lekki Phase 1", "Ikeja Central"],
    permissions: createRolePermissions({
      dashboard: getModulePermissionIds(permissionModules[0]),
      members: getModulePermissionIds(permissionModules[1]),
      bookings: getModulePermissionIds(permissionModules[2]),
      classes: getModulePermissionIds(permissionModules[3]),
      plans: ["plans.view", "plans.edit"],
      payments: ["payments.view", "payments.refund"],
      branches: ["branches.view"],
      staff: getModulePermissionIds(permissionModules[7]),
    }),
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
    description: "Delivers classes, tracks attendance, and supports member-facing session coordination at a single branch.",
    selectedBranches: ["Victoria Island"],
    permissions: createRolePermissions({
      dashboard: ["dashboard.view-overview"],
      bookings: ["bookings.view"],
      classes: ["classes.view", "classes.manage-attendance"],
    }),
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
    description: "Handles payment review, exports, refunds, and approval-sensitive finance workflows for all branches.",
    selectedBranches: [...branchOptions],
    permissions: createRolePermissions({
      dashboard: ["dashboard.view-overview", "dashboard.view-branch-cards"],
      payments: getModulePermissionIds(permissionModules[5]),
      plans: ["plans.view"],
      members: ["members.view-directory"],
    }),
  },
];

export const roles: RoleRow[] = roleRecords.map((role) => ({
  id: role.id,
  name: role.name,
  team: role.team,
  branchScopeLabel: role.branchScopeLabel,
  employeeCount: role.employeeCount,
  createdAt: role.createdAt,
  status: role.status,
  tone: role.tone,
}));

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

function getRoleByName(roleName: string) {
  return roleRecords.find((role) => role.name === roleName) ?? null;
}

export function getEmployeeDetailById(
  employeeId: string,
): EmployeeDetailRecord | null {
  const employee = getEmployeeById(employeeId);

  if (!employee) {
    return null;
  }

  const roleRecord = getRoleByName(employee.role);
  const accessibleModules = roleRecord
    ? permissionModules.reduce<EmployeeDetailRecord["accessibleModules"]>(
        (accumulator, module) => {
          const selectedPermissionIds = roleRecord.permissions[module.id] ?? [];

          if (!selectedPermissionIds.length) {
            return accumulator;
          }

          const featureLabels = module.submodules.flatMap((submodule) =>
            submodule.features
              .filter((feature) => selectedPermissionIds.includes(feature.id))
              .map((feature) => feature.label),
          );

          accumulator.push({
            id: module.id,
            label: module.label,
            description: module.description,
            featureLabels,
          });

          return accumulator;
        },
        [],
      )
    : [];

  return {
    employee,
    roleRecord,
    accessibleModules,
    branchAccess: roleRecord?.selectedBranches ?? [employee.branch],
    permissionCount: accessibleModules.reduce(
      (total, module) => total + module.featureLabels.length,
      0,
    ),
  };
}

export function getRoleById(roleId: string) {
  return roleRecords.find((role) => role.id === roleId);
}

export function getRoleDetailById(roleId: string): RoleDetailRecord | null {
  const role = getRoleById(roleId);

  if (!role) {
    return null;
  }

  const assignedEmployees = employees.filter(
    (employee) => employee.role === role.name,
  );

  const enabledPermissionModules = permissionModules.reduce<RoleDetailRecord["permissionModules"]>(
    (accumulator, module) => {
      const selectedPermissionIds = role.permissions[module.id] ?? [];

      if (!selectedPermissionIds.length) {
        return accumulator;
      }

      const submodules = module.submodules.reduce<
        RoleDetailRecord["permissionModules"][number]["submodules"]
      >((submoduleAccumulator, submodule) => {
        const features = submodule.features
          .filter((feature) => selectedPermissionIds.includes(feature.id))
          .map((feature) => feature.label);

        if (!features.length) {
          return submoduleAccumulator;
        }

        submoduleAccumulator.push({
          id: submodule.id,
          label: submodule.label,
          features,
        });

        return submoduleAccumulator;
      }, []);

      accumulator.push({
        id: module.id,
        label: module.label,
        description: module.description,
        submodules,
      });

      return accumulator;
    },
    [],
  );

  return {
    role,
    employees: assignedEmployees,
    permissionModules: enabledPermissionModules,
    permissionCount: enabledPermissionModules.reduce(
      (total, module) =>
        total +
        module.submodules.reduce(
          (moduleTotal, submodule) => moduleTotal + submodule.features.length,
          0,
        ),
      0,
    ),
  };
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

export function createRoleFormState(role?: RoleRecord): RoleFormState {
  return {
    name: role?.name ?? "",
    description: role?.description ?? "",
    selectedBranches: role ? [...role.selectedBranches] : [...branchOptions],
    permissions: role
      ? Object.fromEntries(
          Object.entries(role.permissions).map(([moduleId, permissionIds]) => [
            moduleId,
            [...permissionIds],
          ]),
        )
      : createEmptyRolePermissions(),
  };
}
