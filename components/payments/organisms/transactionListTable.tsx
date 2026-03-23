"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import type { TransactionItem } from "../data";
import { TransactionMobileCard } from "../molecules/transactionMobileCard";

type TransactionListTableProps = {
  transactions: TransactionItem[];
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

function parseTransactionAmount(amount: string) {
  return Number(amount.replace(/[^\d.]/g, ""));
}

function getTransactionSortDate(transaction: TransactionItem) {
  return new Date(`${transaction.date} ${transaction.time}`);
}

const transactionColumns: CustomTableColumn<TransactionItem>[] = [
  {
    id: "member",
    header: "Member",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (transaction) => transaction.member,
    cell: (transaction) => (
      <div>
        <p className="font-semibold text-text-primary">{transaction.member}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-text-secondary">
          <span>{transaction.id}</span>
          <span aria-hidden="true">/</span>
          <span>{transaction.plan}</span>
        </div>
      </div>
    ),
  },
  {
    id: "branch",
    header: "Branch",
    sortable: true,
    accessorKey: "branch",
    className: "text-text-secondary",
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    sortAccessor: (transaction) => parseTransactionAmount(transaction.amount),
    accessorKey: "amount",
    className: "font-medium text-text-primary",
  },
  {
    id: "status",
    header: "Status",
    sortable: true,
    sortAccessor: (transaction) => transaction.status,
    cell: (transaction) => (
      <StatusBadge label={transaction.status} tone={transaction.statusTone} />
    ),
  },
  {
    id: "date",
    header: "Paid at",
    sortable: true,
    sortAccessor: (transaction) => getTransactionSortDate(transaction),
    cell: (transaction) => (
      <p className="font-medium text-text-primary">
        {transaction.date}{" "}
        <span className="text-[13px] text-text-secondary">
          {transaction.time}
        </span>
      </p>
    ),
  },
];

function TransactionToolbarActions() {
  return (
    <>
      <TableControlButton>Export Report</TableControlButton>
      <TableControlButton>
        Filter By
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

export function TransactionListTable({
  transactions,
  title = "Transaction ledger",
  searchPlaceholder = "Search transactions",
  tableCaption,
  className,
}: TransactionListTableProps) {
  const router = useRouter();

  const transactionActions = useMemo<CustomTableAction<TransactionItem>[]>(
    () => [
      {
        label: "View details",
        onSelect: (transaction) => router.push(`/transactions/${transaction.id}`),
      },
    ],
    [router],
  );

  return (
    <CustomTable
      title={title}
      data={transactions}
      columns={transactionColumns}
      rowActions={transactionActions}
      rowActionsColumnLabel="Action"
      getRowId={(transaction) => transaction.id}
      getRowLabel={(transaction) => transaction.id}
      getSearchText={(transaction) =>
        [
          transaction.id,
          transaction.member,
          transaction.plan,
          transaction.branch,
          transaction.amount,
          transaction.status,
          transaction.date,
          transaction.time,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of members, transaction references, branches, amounts, statuses, payment timestamps, and quick access to transaction details.`
      }
      toolbarActions={<TransactionToolbarActions />}
      renderMobileCard={(transaction, { actionsMenu }) => (
        <TransactionMobileCard transaction={transaction} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No transactions found"
      emptyStateDescription="Adjust your search or filters to populate this ledger."
      itemLabel="transactions"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
