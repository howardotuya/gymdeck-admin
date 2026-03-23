import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTransactionById,
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
  const transaction = getTransactionById(transactionId);

  return {
    title: transaction ? `${transaction.id} | Transactions` : "Transaction Details",
  };
}

export default async function TransactionDetailRoute({
  params,
}: TransactionDetailRouteProps) {
  const { transactionId } = await params;
  const transaction = getTransactionById(transactionId);

  if (!transaction) {
    notFound();
  }

  return <TransactionDetailPage transaction={transaction} />;
}
