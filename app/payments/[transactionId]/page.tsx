import { redirect } from "next/navigation";

type LegacyTransactionDetailRouteProps = {
  params: Promise<{
    transactionId: string;
  }>;
};

export default async function LegacyTransactionDetailRoute({
  params,
}: LegacyTransactionDetailRouteProps) {
  const { transactionId } = await params;

  redirect(`/transactions/${transactionId}`);
}
