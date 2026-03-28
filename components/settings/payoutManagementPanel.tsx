"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Select, FormSectionCard, Modal, StatusBadge } from "@/components/ui";
import type { SelectOption, StatusTone } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./shared";
import type {
  PayoutAccount,
  PayoutAccountDraft,
  PayoutVerificationStatus,
} from "./types";

type PayoutManagementPanelProps = {
  account?: PayoutAccount | null;
};

type ResolvedPayoutAccount = {
  accountName: string;
  verificationStatus: PayoutVerificationStatus;
};

const payoutBankOptions: SelectOption[] = [
  { value: "Access Bank", label: "Access Bank" },
  { value: "First Bank", label: "First Bank" },
  { value: "Guaranty Trust Bank", label: "Guaranty Trust Bank" },
  { value: "Providus Bank", label: "Providus Bank" },
  { value: "United Bank For Africa", label: "United Bank For Africa" },
  { value: "Wema Bank", label: "Wema Bank" },
  { value: "Zenith Bank", label: "Zenith Bank" },
];

const payoutAccountDirectory: Record<string, ResolvedPayoutAccount> = {
  "Providus Bank:0123456789": {
    accountName: "Howard Otuya",
    verificationStatus: "Verified",
  },
  "Access Bank:4455667788": {
    accountName: "GymDeck Reserve Account",
    verificationStatus: "Verified",
  },
  "United Bank For Africa:2138353030": {
    accountName: "OTUYA HOWARD IJEOMA",
    verificationStatus: "Verified",
  },
  "Zenith Bank:9988776655": {
    accountName: "GymDeck Reserve Account",
    verificationStatus: "Pending review",
  },
};

function createDraftFromAccount(account?: PayoutAccount | null): PayoutAccountDraft {
  if (!account) {
    return {
      bankName: "",
      accountNumber: "",
      cadence: "Weekly",
    };
  }

  return {
    bankName: account.bankName,
    accountNumber: account.accountNumber,
    cadence: account.cadence,
  };
}

function normalizeAccountNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function findPayoutAccount(
  bankName: string,
  accountNumber: string,
): ResolvedPayoutAccount | null {
  if (!bankName || accountNumber.length !== 10) {
    return null;
  }

  return payoutAccountDirectory[`${bankName}:${accountNumber}`] ?? null;
}

function getVerificationTone(status: PayoutVerificationStatus): StatusTone {
  return status === "Verified" ? "success" : "warning";
}

function getNextPaymentDate(cadence: PayoutAccountDraft["cadence"]) {
  return cadence === "Weekly" ? "Apr 02, 2026" : "Apr 30, 2026";
}

function EmptyPayoutState({ onAddAccount }: { onAddAccount: () => void }) {
  return (
    <div className="rounded-[20px] border border-dashed border-border-soft bg-bg-muted/40 px-6 py-12 text-center">
      <div className="mx-auto flex size-18 items-center justify-center rounded-full bg-bg-warning-soft text-text-warning">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          className="size-8"
          aria-hidden="true"
        >
          <path d="M12 4v16" />
          <path d="M7 9h7.2a2.8 2.8 0 0 1 0 5.6H9.8a2.8 2.8 0 0 0 0 5.6H17" />
        </svg>
      </div>
      <h4 className="mt-5 text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
        No payout account configured
      </h4>
      <button
        type="button"
        onClick={onAddAccount}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20"
      >
        + Add payout account
      </button>
    </div>
  );
}

export function PayoutManagementPanel({
  account: initialAccount = null,
}: PayoutManagementPanelProps) {
  const [account, setAccount] = useState<PayoutAccount | null>(initialAccount);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draft, setDraft] = useState<PayoutAccountDraft>(
    createDraftFromAccount(initialAccount),
  );
  const [resolvedAccount, setResolvedAccount] = useState<ResolvedPayoutAccount | null>(
    null,
  );
  const [isCheckingAccount, setIsCheckingAccount] = useState(false);
  const [accountLookupFailed, setAccountLookupFailed] = useState(false);
  const lookupTimeoutRef = useRef<number | null>(null);

  const updateDraftField = <TKey extends keyof PayoutAccountDraft>(
    key: TKey,
    value: PayoutAccountDraft[TKey],
  ) => {
    setDraft((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  useEffect(() => {
    return () => {
      if (lookupTimeoutRef.current) {
        window.clearTimeout(lookupTimeoutRef.current);
      }
    };
  }, []);

  const resetLookupState = () => {
    if (lookupTimeoutRef.current) {
      window.clearTimeout(lookupTimeoutRef.current);
      lookupTimeoutRef.current = null;
    }

    setIsCheckingAccount(false);
    setResolvedAccount(null);
    setAccountLookupFailed(false);
  };

  const startLookup = (bankName: string, accountNumber: string) => {
    if (lookupTimeoutRef.current) {
      window.clearTimeout(lookupTimeoutRef.current);
      lookupTimeoutRef.current = null;
    }

    if (!bankName || accountNumber.length !== 10) {
      setIsCheckingAccount(false);
      setResolvedAccount(null);
      setAccountLookupFailed(false);
      return;
    }

    setIsCheckingAccount(true);
    setResolvedAccount(null);
    setAccountLookupFailed(false);

    lookupTimeoutRef.current = window.setTimeout(() => {
      const result = findPayoutAccount(bankName, accountNumber);

      setIsCheckingAccount(false);
      setResolvedAccount(result);
      setAccountLookupFailed(!result);
      lookupTimeoutRef.current = null;
    }, 700);
  };

  const openEditor = () => {
    const nextDraft = createDraftFromAccount(account);

    setDraft(nextDraft);
    startLookup(nextDraft.bankName, nextDraft.accountNumber);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setDraft(createDraftFromAccount(account));
    resetLookupState();
    setIsEditorOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.bankName) {
      toast.error("Select a bank for payouts.");
      return;
    }

    if (draft.accountNumber.length !== 10) {
      toast.error("Enter a valid 10-digit account number.");
      return;
    }

    if (isCheckingAccount) {
      toast.error("Checking account.");
      return;
    }

    if (!resolvedAccount) {
      toast.error("Account not found.");
      return;
    }

    setAccount({
      bankName: draft.bankName,
      accountNumber: draft.accountNumber,
      accountName: resolvedAccount.accountName,
      currency: "NGN",
      cadence: draft.cadence,
      nextPaymentDate: getNextPaymentDate(draft.cadence),
      scopeLabel: "All active branches",
      payoutWindow:
        draft.cadence === "Weekly"
          ? "Every Thursday, 6:00 PM WAT"
          : "Last business day of the month",
      lastUpdated: "Just now",
      verificationStatus: resolvedAccount.verificationStatus,
    });

    resetLookupState();
    setIsEditorOpen(false);
    toast.success(account ? "Payout account updated." : "Payout account added.");
  };

  return (
    <>
      <div className="space-y-4">
        <FormSectionCard
          title="Payout account"
          action={
            <button
              type="button"
              onClick={openEditor}
              className={account ? secondaryActionClassName : primaryActionClassName}
            >
              {account ? "Change account" : "Add payout account"}
            </button>
          }
        >
          {account ? (
            <div className="rounded-[20px] border border-border-soft bg-bg-muted/40 p-5">
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[22px] font-semibold tracking-[-0.04em] text-text-primary">
                      {account.accountName}
                    </p>
                    <StatusBadge
                      label={account.verificationStatus}
                      tone={getVerificationTone(account.verificationStatus)}
                    />
                  </div>
                  <p className="mt-2 text-[14px] text-text-secondary">
                    {account.bankName} • {account.accountNumber}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                    Date of next payment
                  </p>
                  <p className="mt-1 text-[14px] text-text-primary">
                    {account.nextPaymentDate}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                    Cadence
                  </p>
                  <p className="mt-1 text-[14px] text-text-primary">{account.cadence}</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyPayoutState onAddAccount={openEditor} />
          )}
        </FormSectionCard>
      </div>

      {isEditorOpen ? (
        <Modal
          title={account ? "Change payout account" : "Add payout account"}
          onClose={closeEditor}
          panelClassName="max-w-[680px]"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="settings-payout-bank-name" label="Bank name">
                <Select
                  id="settings-payout-bank-name"
                  options={payoutBankOptions}
                  value={draft.bankName}
                  onChange={(value) =>
                    {
                      const nextBankName = Array.isArray(value) ? (value[0] ?? "") : value;

                      updateDraftField("bankName", nextBankName);
                      startLookup(nextBankName, draft.accountNumber);
                    }
                  }
                  placeholder="Choose destination bank"
                  searchPlaceholder="Search banks"
                />
              </Field>

              <Field id="settings-payout-cadence" label="Payout cadence">
                <Select
                  id="settings-payout-cadence"
                  options={[
                    { value: "Weekly", label: "Weekly" },
                    { value: "Monthly", label: "Monthly" },
                  ]}
                  value={draft.cadence}
                  onChange={(value) =>
                    updateDraftField(
                      "cadence",
                      Array.isArray(value)
                        ? ((value[0] ?? "Weekly") as PayoutAccountDraft["cadence"])
                        : (value as PayoutAccountDraft["cadence"]),
                    )
                  }
                />
              </Field>
            </div>

            <Field
              id="settings-payout-account-number"
              label="Bank account number"
            >
              <input
                id="settings-payout-account-number"
                value={draft.accountNumber}
                onChange={(event) => {
                  const nextAccountNumber = normalizeAccountNumber(event.target.value);

                  updateDraftField("accountNumber", nextAccountNumber);
                  startLookup(draft.bankName, nextAccountNumber);
                }}
                className={inputClassName}
                inputMode="numeric"
                autoComplete="off"
                data-autofocus="true"
              />
            </Field>

            {isCheckingAccount ? (
              <div className="flex items-center gap-2 text-[13px] font-medium text-text-secondary">
                <span className="size-2 rounded-full bg-brand-primary animate-pulse" />
                Checking account...
              </div>
            ) : null}

            {!isCheckingAccount && resolvedAccount ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-bg-success-soft px-3 py-1.5 text-[13px] font-semibold text-text-success">
                  {resolvedAccount.accountName}
                </span>
              </div>
            ) : null}

            {!isCheckingAccount && accountLookupFailed ? (
              <p className="text-[13px] font-medium text-text-danger">Account not found.</p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditor}
                className={secondaryActionClassName}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCheckingAccount}
                className={`${primaryActionClassName} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Save account
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
