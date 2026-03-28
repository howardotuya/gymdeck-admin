import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getFinanceRecordById,
  TransactionDetailPage,
} from "@/components/payments";

type TransactionDetailRouteProps = {
  params: Promise<{
    transactionId: string;
  }>;
};

export async function generateMetadata({
  params,
}: TransactionDetailRouteProps): Promise<Metadata> {
  const { transactionId } = await params;
  const record = getFinanceRecordById(transactionId);

  return {
    title: record
      ? `${record.item.id} | ${record.kind === "payout" ? "Payouts" : "Transactions"}`
      : "Transaction Details",
  };
}

export default async function TransactionDetailRoute({
  params,
}: TransactionDetailRouteProps) {
  const { transactionId } = await params;
  const record = getFinanceRecordById(transactionId);

  if (!record) {
    notFound();
  }

  return <TransactionDetailPage record={record} />;
}
