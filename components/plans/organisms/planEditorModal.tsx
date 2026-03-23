"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { PlanEditorModalPayload } from "@/stores/useModalStore";
import {
  createPlanEditorValues,
  planAccessOptions,
  planStatusOptions,
  planTypeOptions,
  type PlanEditorValues,
} from "../data";

type PlanEditorModalProps = {
  payload: PlanEditorModalPayload;
  onClose: () => void;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";
const selectClassName = inputClassName;
const textAreaClassName =
  "min-h-[112px] w-full rounded-xl border border-border-soft bg-bg-input px-4 py-3 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

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

    if (!normalizedName || formState.priceAmount <= 0) {
      return;
    }

    onSubmit({
      ...formState,
      name: normalizedName,
      note: normalizedNote,
    });
    onClose();
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
            <input
              id="plan-name"
              data-autofocus="true"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClassName}
              placeholder="Monthly Premium"
            />
          </Field>

          <Field id="plan-status" label="Status">
            <select
              id="plan-status"
              value={formState.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as PlanEditorValues["status"],
                )
              }
              className={selectClassName}
            >
              {planStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>

          <Field id="plan-type" label="Type">
            <select
              id="plan-type"
              value={formState.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value as PlanEditorValues["type"],
                )
              }
              className={selectClassName}
            >
              {planTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field id="plan-access" label="Access">
            <select
              id="plan-access"
              value={formState.access}
              onChange={(event) =>
                updateField(
                  "access",
                  event.target.value as PlanEditorValues["access"],
                )
              }
              className={selectClassName}
            >
              {planAccessOptions.map((access) => (
                <option key={access} value={access}>
                  {access}
                </option>
              ))}
            </select>
          </Field>

          <Field id="plan-price" label="Price (NGN)">
            <input
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

          <div className="md:col-span-2">
            <Field id="plan-note" label="Operational note">
              <textarea
                id="plan-note"
                value={formState.note}
                onChange={(event) => updateField("note", event.target.value)}
                className={textAreaClassName}
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
