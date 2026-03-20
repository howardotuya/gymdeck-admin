"use client";

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
    id: "transaction",
    header: "Transaction",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (transaction) => transaction.id,
    cell: (transaction) => (
      <div>
        <p className="font-semibold text-text-primary">{transaction.id}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{transaction.branch}</p>
      </div>
    ),
  },
  {
    id: "member",
    header: "Member",
    sortable: true,
    sortAccessor: (transaction) => transaction.member,
    cell: (transaction) => (
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-bg-muted text-[13px] font-semibold text-text-secondary">
          {transaction.initials}
        </div>
        <div>
          <p className="font-medium text-text-primary">{transaction.member}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{transaction.plan}</p>
        </div>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    align: "right",
    sortable: true,
    sortAccessor: (transaction) => parseTransactionAmount(transaction.amount),
    accessorKey: "amount",
    className: "font-medium",
  },
  {
    id: "method",
    header: "Method",
    sortable: true,
    accessorKey: "method",
    className: "text-text-secondary",
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (transaction) => transaction.status,
    cell: (transaction) => (
      <StatusBadge label={transaction.status} tone={transaction.statusTone} />
    ),
  },
  {
    id: "invoiceState",
    header: "Invoice",
    align: "right",
    sortable: true,
    sortAccessor: (transaction) => transaction.invoiceState,
    cell: (transaction) => (
      <StatusBadge label={transaction.invoiceState} tone={transaction.invoiceTone} />
    ),
  },
  {
    id: "date",
    header: "Date",
    sortable: true,
    sortAccessor: (transaction) => getTransactionSortDate(transaction),
    cell: (transaction) => (
      <div>
        <p className="font-medium text-text-primary">{transaction.date}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{transaction.time}</p>
      </div>
    ),
  },
];

const transactionRowActions: CustomTableAction<TransactionItem>[] = [
  {
    label: "View receipt",
  },
  {
    label: "Download invoice",
  },
  {
    label: "Issue refund",
    tone: "danger",
    hidden: (transaction) =>
      transaction.status === "Refunded" || transaction.status === "Failed",
  },
];

function TransactionToolbarActions() {
  return (
    <>
      <TableControlButton>Download Invoices</TableControlButton>
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
  description = "Use this ledger to scan collections, failed charges, refunds, and invoice states without switching to a separate finance summary view.",
  searchPlaceholder = "Search transactions",
  tableCaption,
  className,
}: TransactionListTableProps) {
  return (
    <CustomTable
      title={title}
      description={description}
      data={transactions}
      columns={transactionColumns}
      rowActions={transactionRowActions}
      getRowId={(transaction) => transaction.id}
      getRowLabel={(transaction) => transaction.id}
      getSearchText={(transaction) =>
        [
          transaction.id,
          transaction.member,
          transaction.plan,
          transaction.branch,
          transaction.amount,
          transaction.method,
          transaction.status,
          transaction.invoiceState,
          transaction.date,
          transaction.time,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of transaction IDs, members, plans, amounts, payment methods, statuses, invoice states, and payment dates.`
      }
      headerAction={<TableControlButton variant="primary">Export Report</TableControlButton>}
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
