import type {
  AuditLogEvent,
  CompanyProfileFormState,
  PasswordFormState,
  PayoutAccount,
  PayoutAccountDraft,
  SettingsTab,
  SettingsTabId,
  UserProfileFormState,
} from "./types";

const settingsTabIds = new Set<SettingsTabId>([
  "user-profile",
  "company-profile",
  "payout-management",
  "audit-logs",
]);

export const settingsTabs: SettingsTab[] = [
  {
    id: "user-profile",
    label: "User profile",
    description:
      "Manage personal details, contact details, address information, and password changes from one screen.",
  },
  {
    id: "company-profile",
    label: "Company profile",
    description:
      "Keep business identity, support contact information, address data, and logo details together.",
  },
  {
    id: "payout-management",
    label: "Payout management",
    description:
      "Configure the destination bank account for scheduled withdrawals and review payout activity from one place.",
  },
  {
    id: "audit-logs",
    label: "Audit logs",
    description:
      "Review internal account activity with a focused audit trail shaped around actor, action, target, and time.",
  },
];

export const defaultUserProfileFormState: UserProfileFormState = {
  firstName: "Howard",
  lastName: "Otuya",
  email: "howard@gymdeck.app",
  phone: "+234 803 123 4567",
  country: "Nigeria",
  state: "Lagos",
  city: "Lekki",
  postalCode: "106104",
  addressLine1: "12 Admiralty Way",
  addressLine2: "The Waterside Building",
};

export const defaultPasswordFormState: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const defaultCompanyProfileFormState: CompanyProfileFormState = {
  companyName: "GymDeck Fitness Ltd",
  displayName: "GymDeck",
  legalName: "GymDeck Fitness Limited",
  supportEmail: "support@gymdeck.app",
  supportPhone: "+234 701 222 0045",
  website: "https://gymdeck.app",
  whatsapp: "+234 803 555 1001",
  country: "Nigeria",
  state: "Lagos",
  city: "Victoria Island",
  postalCode: "101241",
  addressLine1: "28 Kofo Abayomi Street",
  addressLine2: "2nd Floor, Civic Towers",
  logoUrl: "/assets/logo.png",
  logoFileName: "logo.png",
};

export const defaultPayoutAccount: PayoutAccount = {
  bankName: "Providus Bank",
  accountNumber: "0123456789",
  accountName: "Howard Otuya",
  currency: "NGN",
  cadence: "Weekly",
  nextPaymentDate: "Apr 02, 2026",
  scopeLabel: "All active branches",
  payoutWindow: "Every Thursday, 6:00 PM WAT",
  lastUpdated: "Mar 26, 2026",
  verificationStatus: "Verified",
};

export const defaultPayoutAccountDraft: PayoutAccountDraft = {
  bankName: "",
  accountNumber: "",
  cadence: "Weekly",
};

export const mockAuditLogEvents: AuditLogEvent[] = [
  {
    id: "evt_01HQ7P0X3J7M",
    timestamp: "2026-03-27T09:14:00+01:00",
    actorName: "Howard Otuya",
    actorEmail: "howard@gymdeck.app",
    action: "Updated company support email",
    category: "company-profile",
    targetLabel: "Support contact settings",
    outcome: "success",
    source: "web",
    country: "Nigeria",
    authMethod: "password",
    ipAddress: "102.90.18.44",
    changedFields: ["supportEmail", "supportPhone"],
    summary:
      "Support contact details were refreshed from the company profile workspace.",
  },
  {
    id: "evt_01HQ7P3Y5K8R",
    timestamp: "2026-03-27T08:46:00+01:00",
    actorName: "Tolu Adebayo",
    actorEmail: "tolu@gymdeck.app",
    action: "Reset admin password",
    category: "user-profile",
    targetLabel: "Tolu Adebayo account",
    outcome: "warning",
    source: "web",
    country: "Nigeria",
    authMethod: "password",
    ipAddress: "102.90.18.51",
    changedFields: ["password"],
    summary:
      "A password reset completed after current-password re-authentication.",
  },
  {
    id: "evt_01HQ7P7Q9B2N",
    timestamp: "2026-03-27T07:58:00+01:00",
    actorName: "System",
    action: "Blocked unsupported email update",
    category: "user-profile",
    targetLabel: "Identity verification guardrail",
    outcome: "failed",
    source: "system",
    country: "Nigeria",
    authMethod: "session",
    summary:
      "An email change request was rejected because the verification flow is not yet configured.",
  },
  {
    id: "evt_01HQ7PB3Q0HZ",
    timestamp: "2026-03-26T18:24:00+01:00",
    actorName: "Ada Nnaji",
    actorEmail: "ada@gymdeck.app",
    action: "Viewed audit event detail",
    category: "audit-logs",
    targetLabel: "Pricing update event",
    branchLabel: "Victoria Island",
    outcome: "success",
    source: "web",
    country: "Nigeria",
    authMethod: "password",
    ipAddress: "102.90.17.12",
    summary:
      "An admin drilled into a historical pricing event from the audit trail.",
  },
  {
    id: "evt_01HQ7PE8N4LM",
    timestamp: "2026-03-26T14:12:00+01:00",
    actorName: "Ifeoma Bello",
    actorEmail: "ifeoma@gymdeck.app",
    action: "Updated public profile visibility",
    category: "company-profile",
    targetLabel: "GymDeck public company profile",
    outcome: "success",
    source: "api",
    country: "Nigeria",
    authMethod: "service token",
    ipAddress: "34.120.44.18",
    changedFields: ["isPublicProfileVisible"],
    summary:
      "Visibility settings were synchronized after the company profile was published.",
  },
];

export function createUserProfileFormState(
  overrides: Partial<UserProfileFormState> = {},
): UserProfileFormState {
  return {
    ...defaultUserProfileFormState,
    ...overrides,
  };
}

export function createPasswordFormState(
  overrides: Partial<PasswordFormState> = {},
): PasswordFormState {
  return {
    ...defaultPasswordFormState,
    ...overrides,
  };
}

export function createCompanyProfileFormState(
  overrides: Partial<CompanyProfileFormState> = {},
): CompanyProfileFormState {
  return {
    ...defaultCompanyProfileFormState,
    ...overrides,
  };
}

export function createPayoutAccount(
  overrides: Partial<PayoutAccount> = {},
): PayoutAccount {
  return {
    ...defaultPayoutAccount,
    ...overrides,
  };
}

export function createPayoutAccountDraft(
  overrides: Partial<PayoutAccountDraft> = {},
): PayoutAccountDraft {
  return {
    ...defaultPayoutAccountDraft,
    ...overrides,
  };
}

export function getSettingsTab(tabParam?: string | null): SettingsTabId {
  if (tabParam && settingsTabIds.has(tabParam as SettingsTabId)) {
    return tabParam as SettingsTabId;
  }

  return "user-profile";
}
