export type SettingsTabId =
  | "user-profile"
  | "company-profile"
  | "payout-management"
  | "audit-logs";

export type SettingsTab = {
  id: SettingsTabId;
  label: string;
  description: string;
};

export type UserProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
};

export type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type CompanyProfileFormState = {
  companyName: string;
  displayName: string;
  legalName: string;
  supportEmail: string;
  supportPhone: string;
  website: string;
  whatsapp: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  logoUrl?: string;
  logoFileName?: string;
};

export type PayoutCadence = "Weekly" | "Monthly";

export type PayoutVerificationStatus = "Verified" | "Pending review";

export type PayoutAccount = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  cadence: PayoutCadence;
  nextPaymentDate: string;
  scopeLabel: string;
  payoutWindow: string;
  lastUpdated: string;
  verificationStatus: PayoutVerificationStatus;
};

export type PayoutAccountDraft = {
  bankName: string;
  accountNumber: string;
  cadence: PayoutCadence;
};

export type AuditLogEvent = {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail?: string;
  action: string;
  category: string;
  targetLabel: string;
  branchLabel?: string;
  outcome: "success" | "warning" | "failed";
  source: "web" | "api" | "system";
  country?: string;
  authMethod?: string;
  ipAddress?: string;
  changedFields?: string[];
  summary: string;
};
