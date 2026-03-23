import type { StatusTone } from "@/components/ui";

export type PaymentTone = StatusTone;

export type TransactionMemberDetails = {
  memberId: string;
  email: string;
  phone: string;
  status: string;
  tone: PaymentTone;
  branch: string;
  joinedOn: string;
  nextRenewal: string;
  note: string;
};

export type TransactionPlanDetails = {
  planId: string;
  category: string;
  billingCycle: string;
  accessWindow: string;
  branchCoverage: string;
  renewalType: string;
  price: string;
  note: string;
};

export type TransactionRecordDetails = {
  gatewayReference: string;
  receiptNumber: string;
  settledAt: string;
  processedBy: string;
  ledgerSource: string;
  note: string;
};

export type TransactionItem = {
  id: string;
  member: string;
  initials: string;
  plan: string;
  branch: string;
  amount: string;
  method: string;
  status: string;
  statusTone: PaymentTone;
  date: string;
  time: string;
  invoiceState: string;
  invoiceTone: PaymentTone;
  memberDetails: TransactionMemberDetails;
  planDetails: TransactionPlanDetails;
  transactionDetails: TransactionRecordDetails;
};

export const paymentOverview = [
  {
    label: "Total revenue",
    value: "NGN 24.8M",
    detail: "Gross collections across subscriptions, packs, and walk-ins this month",
    tone: "brand" as const,
  },
  {
    label: "Successful payments",
    value: "1,148",
    detail: "Card and transfer conversions remain stable across all branches",
    tone: "success" as const,
  },
  {
    label: "Failed payments",
    value: "42",
    detail: "Most are renewal retries and incomplete front desk payment attempts",
    tone: "warning" as const,
  },
  {
    label: "Refund count",
    value: "9",
    detail: "Role-restricted finance interventions over the last 30 days",
    tone: "danger" as const,
  },
];

export const transactions: TransactionItem[] = [
  {
    id: "TX-1008",
    member: "Howard Otuya",
    initials: "HO",
    plan: "Monthly Premium",
    branch: "Victoria Island",
    amount: "NGN 45,000",
    method: "Card",
    status: "Successful",
    statusTone: "success",
    date: "Mar 20, 2026",
    time: "9:14 AM",
    invoiceState: "Invoice sent",
    invoiceTone: "brand",
    memberDetails: {
      memberId: "MBR-2041",
      email: "howard.otuya@gymdeck.africa",
      phone: "+234 803 100 2401",
      status: "Active",
      tone: "success",
      branch: "Victoria Island",
      joinedOn: "Jul 12, 2025",
      nextRenewal: "Apr 20, 2026",
      note: "High-retention member who renews digitally and books early-morning strength sessions.",
    },
    planDetails: {
      planId: "PLN-301",
      category: "Membership subscription",
      billingCycle: "Monthly",
      accessWindow: "Unlimited floor access + 4 recovery suite sessions",
      branchCoverage: "All Lagos clubs",
      renewalType: "Auto-renew",
      price: "NGN 45,000",
      note: "Premium tier is the best summary to surface in the table only as secondary context, not a full-width column.",
    },
    transactionDetails: {
      gatewayReference: "PSTK-7H38QK0L2",
      receiptNumber: "RCP-2026-031408",
      settledAt: "Mar 20, 2026 9:18 AM",
      processedBy: "Self-service checkout",
      ledgerSource: "Web renewal",
      note: "Payment cleared on first attempt and instantly reopened premium access for all mapped branches.",
    },
  },
  {
    id: "TX-1007",
    member: "Amaka Nnaji",
    initials: "AN",
    plan: "6 Session Pack",
    branch: "Yaba Studio",
    amount: "NGN 36,000",
    method: "Transfer",
    status: "Successful",
    statusTone: "success",
    date: "Mar 20, 2026",
    time: "8:42 AM",
    invoiceState: "Receipt ready",
    invoiceTone: "brand",
    memberDetails: {
      memberId: "MBR-1988",
      email: "amaka.nnaji@gymdeck.africa",
      phone: "+234 809 441 1902",
      status: "Active",
      tone: "success",
      branch: "Yaba Studio",
      joinedOn: "Nov 03, 2025",
      nextRenewal: "Pack-based access",
      note: "Usually buys class bundles before weekend cycles and checks in through front desk confirmation.",
    },
    planDetails: {
      planId: "PK-118",
      category: "Session pack",
      billingCycle: "One-time purchase",
      accessWindow: "6 instructor-led sessions within 45 days",
      branchCoverage: "Yaba Studio only",
      renewalType: "Manual repurchase",
      price: "NGN 36,000",
      note: "Pack access is consumed across multiple bookings, so the detail page needs to preserve plan context separate from payment metadata.",
    },
    transactionDetails: {
      gatewayReference: "TRF-91KX8M22",
      receiptNumber: "RCP-2026-031407",
      settledAt: "Mar 20, 2026 8:55 AM",
      processedBy: "Front desk confirmation",
      ledgerSource: "Bank transfer upload",
      note: "Transfer was matched manually after teller confirmation and the receipt was generated from the admin flow.",
    },
  },
  {
    id: "TX-1006",
    member: "David Okoro",
    initials: "DO",
    plan: "Monthly Standard",
    branch: "Lekki Phase 1",
    amount: "NGN 28,000",
    method: "Card",
    status: "Failed",
    statusTone: "warning",
    date: "Mar 20, 2026",
    time: "8:10 AM",
    invoiceState: "Retry queued",
    invoiceTone: "warning",
    memberDetails: {
      memberId: "MBR-1774",
      email: "david.okoro@gymdeck.africa",
      phone: "+234 816 220 0804",
      status: "Grace period",
      tone: "warning",
      branch: "Lekki Phase 1",
      joinedOn: "May 19, 2025",
      nextRenewal: "Awaiting successful retry",
      note: "Member access is temporarily held in grace period pending a successful renewal charge.",
    },
    planDetails: {
      planId: "PLN-211",
      category: "Membership subscription",
      billingCycle: "Monthly",
      accessWindow: "Unlimited gym floor access",
      branchCoverage: "Lekki Phase 1 + partner weekend access",
      renewalType: "Auto-renew with retries",
      price: "NGN 28,000",
      note: "Retry rules are attached to the plan contract, so finance needs this plan context when reviewing failures.",
    },
    transactionDetails: {
      gatewayReference: "PSTK-FAILED-11A2",
      receiptNumber: "RCP-2026-031406",
      settledAt: "Not settled",
      processedBy: "Auto-renewal job",
      ledgerSource: "Scheduled renewal",
      note: "Issuer declined the first attempt. The next retry is queued for the afternoon window and member access remains soft-blocked.",
    },
  },
  {
    id: "TX-1005",
    member: "Musa Ibrahim",
    initials: "MI",
    plan: "Single Visit",
    branch: "Ikeja Central",
    amount: "NGN 8,000",
    method: "POS",
    status: "Successful",
    statusTone: "success",
    date: "Mar 19, 2026",
    time: "7:32 PM",
    invoiceState: "Receipt printed",
    invoiceTone: "neutral",
    memberDetails: {
      memberId: "GST-4408",
      email: "musa.ibrahim@gymdeck.africa",
      phone: "+234 812 600 7781",
      status: "Guest",
      tone: "neutral",
      branch: "Ikeja Central",
      joinedOn: "Mar 19, 2026",
      nextRenewal: "No renewal scheduled",
      note: "Walk-in guest who converted at the front desk during an evening traffic spike.",
    },
    planDetails: {
      planId: "VIS-021",
      category: "Walk-in access",
      billingCycle: "Single use",
      accessWindow: "One gym entry before closing",
      branchCoverage: "Ikeja Central only",
      renewalType: "Manual repurchase",
      price: "NGN 8,000",
      note: "Single visits are operationally simple, so the table only needs enough context to identify the customer before opening the detail page.",
    },
    transactionDetails: {
      gatewayReference: "POS-IKJ-2210",
      receiptNumber: "RCP-2026-031405",
      settledAt: "Mar 19, 2026 7:37 PM",
      processedBy: "Front desk POS",
      ledgerSource: "Onsite checkout",
      note: "Printed receipt was issued immediately and the guest profile stays lightweight unless the person converts to a recurring plan.",
    },
  },
  {
    id: "TX-1004",
    member: "Tobi Akin",
    initials: "TA",
    plan: "Monthly Premium",
    branch: "Victoria Island",
    amount: "NGN 45,000",
    method: "Card",
    status: "Refunded",
    statusTone: "danger",
    date: "Mar 19, 2026",
    time: "3:27 PM",
    invoiceState: "Refund processed",
    invoiceTone: "danger",
    memberDetails: {
      memberId: "MBR-1660",
      email: "tobi.akin@gymdeck.africa",
      phone: "+234 805 870 4413",
      status: "Paused",
      tone: "warning",
      branch: "Victoria Island",
      joinedOn: "Feb 04, 2025",
      nextRenewal: "On hold",
      note: "Account was paused after a relocation request, which triggered the refund from finance.",
    },
    planDetails: {
      planId: "PLN-301",
      category: "Membership subscription",
      billingCycle: "Monthly",
      accessWindow: "Unlimited floor access + 4 recovery suite sessions",
      branchCoverage: "All Lagos clubs",
      renewalType: "Auto-renew",
      price: "NGN 45,000",
      note: "Premium plan terms stayed intact even though this specific charge was refunded for customer support reasons.",
    },
    transactionDetails: {
      gatewayReference: "PSTK-RFD-2204",
      receiptNumber: "RCP-2026-031404",
      settledAt: "Mar 19, 2026 3:40 PM",
      processedBy: "Finance admin",
      ledgerSource: "Support refund",
      note: "Full refund was approved after duplicate billing was confirmed and plan access was reversed the same afternoon.",
    },
  },
  {
    id: "TX-1003",
    member: "Kemi Obasi",
    initials: "KO",
    plan: "Monthly Standard",
    branch: "Lekki Phase 1",
    amount: "NGN 28,000",
    method: "Card",
    status: "Pending",
    statusTone: "brand",
    date: "Mar 19, 2026",
    time: "11:02 AM",
    invoiceState: "Awaiting capture",
    invoiceTone: "brand",
    memberDetails: {
      memberId: "MBR-2022",
      email: "kemi.obasi@gymdeck.africa",
      phone: "+234 814 762 1020",
      status: "Pending activation",
      tone: "brand",
      branch: "Lekki Phase 1",
      joinedOn: "Mar 19, 2026",
      nextRenewal: "Starts after capture",
      note: "New member signup is waiting for capture confirmation before access credentials are issued.",
    },
    planDetails: {
      planId: "PLN-211",
      category: "Membership subscription",
      billingCycle: "Monthly",
      accessWindow: "Unlimited gym floor access",
      branchCoverage: "Lekki Phase 1 + partner weekend access",
      renewalType: "Auto-renew after activation",
      price: "NGN 28,000",
      note: "The plan is standard, but the detail page still needs to show the activation rule because payment is not yet fully captured.",
    },
    transactionDetails: {
      gatewayReference: "PSTK-PEND-8301",
      receiptNumber: "RCP-2026-031403",
      settledAt: "Awaiting settlement",
      processedBy: "Self-service checkout",
      ledgerSource: "New signup",
      note: "Authorization succeeded, but the capture callback has not completed. Operations should avoid granting access until settlement lands.",
    },
  },
];

export function getTransactionById(transactionId: string) {
  return transactions.find((transaction) => transaction.id === transactionId);
}
