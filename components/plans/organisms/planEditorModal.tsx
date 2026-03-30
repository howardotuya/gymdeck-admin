"use client";

import clsx from "clsx";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { branches } from "@/components/branches/data";
import { Modal } from "@/components/modals/modal";
import { Input, Select, type SelectOption } from "@/components/ui";
import { formFieldClassName } from "@/components/ui/fieldStyles";
import type { PlanEditorModalPayload } from "@/stores/useModalStore";
import {
  createPlanEditorValues,
  planAccessOptions,
  planBranchAccessScopeOptions,
  planStatusOptions,
  planTypeOptions,
  type PlanEditorValues,
} from "../data";

type PlanEditorModalProps = {
  payload: PlanEditorModalPayload;
  onClose: () => void;
};

const inputClassName = formFieldClassName;
function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </span>
      {children}
    </label>
  );
}

export function PlanEditorModal({ payload, onClose }: PlanEditorModalProps) {
  const planStatusSelectOptions: SelectOption[] = planStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));
  const planTypeSelectOptions: SelectOption[] = planTypeOptions.map((type) => ({
    value: type,
    label: type,
  }));
  const planAccessSelectOptions: SelectOption[] = planAccessOptions.map((access) => ({
    value: access,
    label: access,
  }));
  const planBranchCoverageSelectOptions: SelectOption[] = planBranchAccessScopeOptions.map(
    (scope) => ({
      value: scope,
      label: scope,
    }),
  );
  const { mode, plan, onSubmit } = payload;
  const [formState, setFormState] = useState<PlanEditorValues>(() =>
    createPlanEditorValues(plan ?? undefined),
  );

  const isEditMode = mode === "edit";
  const submitLabel = isEditMode ? "Save changes" : "Add plan";

  const updateField = <TKey extends keyof PlanEditorValues>(
    key: TKey,
    value: PlanEditorValues[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = formState.name.trim();
    const normalizedNote = formState.note.trim();
    const normalizedSelectedBranches = formState.selectedBranches
      .map((branchName) => branchName.trim())
      .filter(Boolean);

    if (
      !normalizedName ||
      formState.priceAmount <= 0 ||
      (formState.branchAccessScope === "Selected branches" &&
        normalizedSelectedBranches.length === 0)
    ) {
      return;
    }

    onSubmit({
      ...formState,
      name: normalizedName,
      selectedBranches: normalizedSelectedBranches,
      note: normalizedNote,
    });
    onClose();
  };

  const toggleBranchSelection = (branchName: string) => {
    setFormState((currentState) => {
      const nextSelection = currentState.selectedBranches.includes(branchName)
        ? currentState.selectedBranches.filter((item) => item !== branchName)
        : [...currentState.selectedBranches, branchName];

      return {
        ...currentState,
        selectedBranches: nextSelection,
      };
    });
  };

  return (
    <Modal
      title={isEditMode ? `Edit ${plan?.name ?? "plan"}` : "Add plan"}
      onClose={onClose}
      panelClassName="max-w-[720px]"
      bodyClassName="mt-6 space-y-6"
    >
      <form id="plan-editor-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="plan-name" label="Plan name">
            <Input
              id="plan-name"
              data-autofocus="true"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClassName}
              placeholder="Monthly Premium"
            />
          </Field>

          <Field id="plan-status" label="Status">
            <Select
              id="plan-status"
              options={planStatusSelectOptions}
              value={formState.status}
              onChange={(value) => updateField("status", value as PlanEditorValues["status"])}
            />
          </Field>

          <Field id="plan-type" label="Type">
            <Select
              id="plan-type"
              options={planTypeSelectOptions}
              value={formState.type}
              onChange={(value) => updateField("type", value as PlanEditorValues["type"])}
            />
          </Field>

          <Field id="plan-access" label="Access">
            <Select
              id="plan-access"
              options={planAccessSelectOptions}
              value={formState.access}
              onChange={(value) => updateField("access", value as PlanEditorValues["access"])}
            />
          </Field>

          <Field id="plan-branch-coverage" label="Branch coverage">
            <Select
              id="plan-branch-coverage"
              options={planBranchCoverageSelectOptions}
              value={formState.branchAccessScope}
              onChange={(value) =>
                updateField("branchAccessScope", value as PlanEditorValues["branchAccessScope"])
              }
            />
          </Field>

          <Field id="plan-price" label="Price (NGN)">
            <Input
              id="plan-price"
              type="number"
              min="0"
              step="100"
              value={formState.priceAmount || ""}
              onChange={(event) =>
                updateField("priceAmount", Number(event.target.value) || 0)
              }
              className={inputClassName}
              placeholder="45000"
            />
          </Field>

          {formState.branchAccessScope === "Selected branches" ? (
            <div className="md:col-span-2">
              <Field id="plan-selected-branches" label="Eligible branches">
                <div
                  id="plan-selected-branches"
                  className="grid gap-3 rounded-[20px] border border-border-soft bg-bg-muted p-3 md:grid-cols-2"
                >
                  {branches.map((branch) => {
                    const isSelected = formState.selectedBranches.includes(branch.name);

                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => toggleBranchSelection(branch.name)}
                        className={clsx(
                          "flex items-start gap-3 rounded-[18px] border px-4 py-4 text-left transition-colors",
                          isSelected
                            ? "border-border-brand bg-bg-brand-soft/45"
                            : "border-border-soft bg-bg-surface hover:border-border-strong",
                        )}
                      >
                        <span
                          className={clsx(
                            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                            isSelected
                              ? "bg-bg-surface text-text-brand"
                              : "border border-border-strong text-text-secondary",
                          )}
                        >
                          {isSelected ? "✓" : "+"}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-text-primary">
                            {branch.name}
                          </p>
                          <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                            Members on this plan can check in at this branch.
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          ) : null}

          <div className="md:col-span-2">
            <Field id="plan-note" label="Operational note">
              <Input
                as="textarea"
                id="plan-note"
                value={formState.note}
                onChange={(event) => updateField("note", event.target.value)}
                placeholder="Summarize what staff should know about this plan."
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="plan-editor-form"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
