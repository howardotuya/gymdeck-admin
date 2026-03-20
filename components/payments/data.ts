import type { StatusTone } from "@/components/ui";

export type PaymentTone = StatusTone;

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
  },
];
