"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CustomTable,
  StatusBadge,
  type CustomTableAction,
  type CustomTableColumn,
  type CustomTableFilterField,
} from "@/components/ui";
import type { PayoutItem } from "../data";
import { PayoutMobileCard } from "../molecules/payoutMobileCard";

type PayoutListTableProps = {
  payouts: PayoutItem[];
  title?: string;
  searchPlaceholder?: string;
  className?: string;
};

function parseCurrency(amount: string) {
  return Number(amount.replace(/[^\d.]/g, ""));
}

function getPayoutSortDate(payout: PayoutItem) {
  return new Date(payout.requestedDate);
}

export function PayoutListTable({
  payouts,
  title = "Withdrawals",
  searchPlaceholder = "Search withdrawals",
  className,
}: PayoutListTableProps) {
  const router = useRouter();

  const payoutColumns = useMemo<CustomTableColumn<PayoutItem>[]>(
    () => [
      {
        id: "withdrawal",
        header: "Withdrawal",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (payout) => payout.withdrawal,
        exportAccessor: (payout) => payout.withdrawal,
        cell: (payout) => (
          <div>
            <p className="font-semibold text-text-primary">{payout.withdrawal}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-text-secondary">
              <span>{payout.id}</span>
              <span aria-hidden="true">/</span>
              <span>{payout.cadence}</span>
            </div>
          </div>
        ),
      },
      {
        id: "account",
        header: "Account",
        sortable: true,
        sortAccessor: (payout) => payout.beneficiaryDetails.accountName,
        cell: (payout) => (
          <div>
            <p className="text-text-primary">{payout.beneficiaryDetails.accountName}</p>
            <p className="mt-1 text-[13px] text-text-secondary">
              {payout.beneficiaryDetails.bankName}
            </p>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        align: "right",
        sortable: true,
        sortAccessor: (payout) => parseCurrency(payout.amount),
        accessorKey: "amount",
        className: "font-medium text-text-primary",
      },
      {
        id: "requestedDate",
        header: "Requested",
        sortable: true,
        sortAccessor: (payout) => getPayoutSortDate(payout),
        accessorKey: "requestedDate",
        className: "text-text-secondary",
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortAccessor: (payout) => payout.status,
        cell: (payout) => <StatusBadge label={payout.status} tone={payout.statusTone} />,
      },
    ],
    [],
  );

  const filterFields = useMemo<CustomTableFilterField<PayoutItem>[]>(
    () => [
      {
        id: "status",
        type: "select",
        label: "Status",
        options: Array.from(new Set(payouts.map((payout) => payout.status))).map((value) => ({
          label: value,
          value,
        })),
        placeholder: "Select withdrawal status",
      },
      {
        id: "cadence",
        type: "select",
        label: "Cadence",
        options: Array.from(new Set(payouts.map((payout) => payout.cadence))).map(
          (value) => ({
            label: value,
            value,
          }),
        ),
        placeholder: "Select cadence",
      },
    ],
    [payouts],
  );

  const payoutActions = useMemo<CustomTableAction<PayoutItem>[]>(
    () => [
      {
        label: "View details",
        onSelect: (payout) => router.push(`/transactions/${payout.id}`),
      },
    ],
    [router],
  );

  return (
    <CustomTable
      title={title}
      data={payouts}
      columns={payoutColumns}
      rowActions={payoutActions}
      rowActionsColumnLabel="Action"
      getRowId={(payout) => payout.id}
      getRowLabel={(payout) => payout.id}
      getSearchText={(payout) =>
        [
          payout.id,
          payout.withdrawal,
          payout.cadence,
          payout.amount,
          payout.status,
          payout.requestedDate,
          payout.settlementDetails.reference,
          payout.beneficiaryDetails.accountName,
          payout.beneficiaryDetails.bankName,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={`${title}. Directory of weekly and monthly withdrawals, destination accounts, request dates, statuses, and quick withdrawal detail access.`}
      filterFields={filterFields}
      exportDataBtn
      exportFileName="withdrawals"
      queryParamPrefix="payouts"
      renderMobileCard={(payout, { actionsMenu }) => (
        <PayoutMobileCard payout={payout} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No withdrawals found"
      emptyStateDescription="Adjust your search or filters to populate the withdrawal list."
      itemLabel="withdrawals"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
