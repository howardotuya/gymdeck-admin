"use client";

import clsx from "clsx";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import {
  FormSectionCard,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import {
  branchClassOptions,
  branchPlanOptions,
  branchStatusOptions,
  createBranchFormState,
  staffRoleOptions,
  staffStatusOptions,
} from "./data";
import type { BranchDetail, BranchEditableStaffMember, BranchFormState, BranchStatus } from "./types";

type BranchFormPageProps = {
  mode: "create" | "edit";
  branch?: BranchDetail;
};

const primaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover";
const secondaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong";
const dangerActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-[#fecdca] bg-bg-danger-soft px-4 text-[14px] font-semibold text-text-danger transition-colors hover:border-[#fda29b] disabled:cursor-not-allowed disabled:opacity-60";
const inputClassName =
  "h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";
const textAreaClassName =
  "min-h-[112px] w-full rounded-xl border border-border-soft bg-bg-input px-4 py-3 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

function createStaffId() {
  return `staff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

function SelectionCard({
  checked,
  label,
  detail,
  onChange,
}: {
  checked: boolean;
  label: string;
  detail: string;
  onChange: () => void;
}) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer gap-3 rounded-[20px] border px-4 py-4 transition-colors",
        checked
          ? "border-border-brand bg-bg-brand-soft/45"
          : "border-border-soft bg-bg-muted hover:border-border-strong",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border border-border-strong"
      />
      <div>
        <p className="text-[14px] font-semibold text-text-primary">{label}</p>
        <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">{detail}</p>
      </div>
    </label>
  );
}

export function BranchFormPage({ mode, branch }: BranchFormPageProps) {
  const isEditMode = mode === "edit";
  const [formState, setFormState] = useState<BranchFormState>(() => createBranchFormState(branch));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const openModal = useModalStore((state) => state.openModal);

  const selectedPlans = branchPlanOptions.filter((plan) => formState.plans.includes(plan.name));
  const selectedClasses = branchClassOptions.filter((gymClass) =>
    formState.classes.includes(gymClass.name),
  );
  const openDays = formState.openingHours.filter((item) => item.isOpen).length;
  const branchLabel = formState.name.trim() || (isEditMode ? branch?.name ?? "Branch" : "New branch");

  const updateField = <
    TKey extends Exclude<keyof BranchFormState, "openingHours" | "staff" | "plans" | "classes">,
  >(
    key: TKey,
    value: BranchFormState[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const updateHour = (
    hourId: string,
    patch: Partial<BranchFormState["openingHours"][number]>,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      openingHours: currentState.openingHours.map((item) =>
        item.id === hourId ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addStaffMember = () => {
    const nextStaffMember: BranchEditableStaffMember = {
      id: createStaffId(),
      name: "",
      role: staffRoleOptions[0],
      shift: "",
      status: staffStatusOptions[0],
    };

    setFormState((currentState) => ({
      ...currentState,
      staff: [...currentState.staff, nextStaffMember],
    }));
  };

  const updateStaffMember = (memberId: string, patch: Partial<BranchEditableStaffMember>) => {
    setFormState((currentState) => ({
      ...currentState,
      staff: currentState.staff.map((member) =>
        member.id === memberId ? { ...member, ...patch } : member,
      ),
    }));
  };

  const removeStaffMember = (memberId: string) => {
    setFormState((currentState) => ({
      ...currentState,
      staff: currentState.staff.filter((member) => member.id !== memberId),
    }));
  };

  const toggleSelection = (key: "plans" | "classes", name: string) => {
    setFormState((currentState) => {
      const selections = currentState[key];
      const nextSelections = selections.includes(name)
        ? selections.filter((item) => item !== name)
        : [...selections, name];

      return {
        ...currentState,
        [key]: nextSelections,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(
      isEditMode
        ? `${branchLabel} changes are staged for review.`
        : `${branchLabel} is ready for review before activation.`,
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
        <PageHeader
          eyebrow={isEditMode ? "Edit branch" : "Add branch"}
          title={isEditMode ? `Edit ${branchLabel}` : "Add branch"}
          description={
            isEditMode
              ? "Use a full-page workflow for operational edits so managers can review profile details, staff ownership, and branch setup without losing context."
              : "Build a branch from the same operational sections used in the detail view: profile, opening hours, assigned staff, plans, and classes."
          }
          breadcrumbs={
            isEditMode
              ? [
                  { label: "Branches", href: "/branches" },
                  { label: branch?.name ?? "Branch", href: branch ? `/branches/${branch.id}` : "/branches" },
                  { label: "Edit" },
                ]
              : [{ label: "Branches", href: "/branches" }, { label: "Add branch" }]
          }
          action={
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <Link
                href={isEditMode && branch ? `/branches/${branch.id}` : "/branches"}
                className={secondaryActionClassName}
              >
                {isEditMode ? "View branch" : "Back to branches"}
              </Link>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() =>
                    openModal("deactivateBranch", {
                      branchName: branchLabel,
                      onConfirm: () => {
                        updateField("status", "Inactive");
                        setFeedbackMessage(
                          `${branchLabel} has been moved out of active operations.`,
                        );
                      },
                    })
                  }
                  disabled={formState.status === "Inactive"}
                  className={dangerActionClassName}
                >
                  {formState.status === "Inactive" ? "Branch inactive" : "Deactivate branch"}
                </button>
              ) : null}
              <button form="branch-form" type="submit" className={primaryActionClassName}>
                {isEditMode ? "Save changes" : "Create branch"}
              </button>
            </div>
          }
        />

        {feedbackMessage ? (
          <div className="rounded-[24px] border border-border-brand bg-bg-brand-soft/55 px-5 py-4">
            <p className="text-[14px] leading-[1.65] text-text-primary">{feedbackMessage}</p>
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
          <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
            <FormSectionCard
              title="Branch profile"
              description="Set the core identity and contact details staff use during branch operations."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="branch-name" label="Branch name">
                  <input
                    id="branch-name"
                    value={formState.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={inputClassName}
                    placeholder="Victoria Island"
                  />
                </Field>

                <Field id="branch-status" label="Status">
                  <select
                    id="branch-status"
                    value={formState.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as BranchStatus)
                    }
                    className={inputClassName}
                  >
                    {branchStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="branch-manager" label="Manager">
                  <input
                    id="branch-manager"
                    value={formState.manager}
                    onChange={(event) => updateField("manager", event.target.value)}
                    className={inputClassName}
                    placeholder="Adaeze Cole"
                  />
                </Field>

                <Field id="branch-phone" label="Phone">
                  <input
                    id="branch-phone"
                    value={formState.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className={inputClassName}
                    placeholder="+234 800 000 0000"
                  />
                </Field>

                <Field id="branch-email" label="Email">
                  <input
                    id="branch-email"
                    type="email"
                    value={formState.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={inputClassName}
                    placeholder="branch@gymdeck.com"
                  />
                </Field>

                <Field id="branch-tags" label="Tags">
                  <input
                    id="branch-tags"
                    value={formState.tags}
                    onChange={(event) => updateField("tags", event.target.value)}
                    className={inputClassName}
                    placeholder="Flagship, Parking, Recovery zone"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field id="branch-address" label="Address">
                    <input
                      id="branch-address"
                      value={formState.address}
                      onChange={(event) => updateField("address", event.target.value)}
                      className={inputClassName}
                      placeholder="12 Admiralty Way, Victoria Island, Lagos"
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field id="branch-note" label="Operational note">
                    <textarea
                      id="branch-note"
                      value={formState.note}
                      onChange={(event) => updateField("note", event.target.value)}
                      className={textAreaClassName}
                      placeholder="Summarize the main operations note staff should keep in mind."
                    />
                  </Field>
                </div>
              </div>
            </FormSectionCard>

            <FormSectionCard
              title="Opening hours"
              description="Keep daily operating hours explicit so branch staff can scan them at a glance."
            >
              <div className="space-y-3">
                {formState.openingHours.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_140px_140px] md:items-center">
                      <div>
                        <p className="text-[14px] font-semibold text-text-primary">{item.day}</p>
                        <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-text-secondary">
                          <input
                            type="checkbox"
                            checked={item.isOpen}
                            onChange={(event) => updateHour(item.id, { isOpen: event.target.checked })}
                            className="h-4 w-4 rounded border border-border-strong"
                          />
                          Open for staff operations
                        </label>
                      </div>

                      <p className="text-[13px] leading-[1.65] text-text-secondary">
                        Set operating hours for front desk coverage, check-ins, and class access.
                      </p>

                      <Field id={`${item.id}-open`} label="Open">
                        <input
                          id={`${item.id}-open`}
                          type="time"
                          value={item.openTime}
                          disabled={!item.isOpen}
                          onChange={(event) => updateHour(item.id, { openTime: event.target.value })}
                          className={clsx(inputClassName, !item.isOpen && "opacity-50")}
                        />
                      </Field>

                      <Field id={`${item.id}-close`} label="Close">
                        <input
                          id={`${item.id}-close`}
                          type="time"
                          value={item.closeTime}
                          disabled={!item.isOpen}
                          onChange={(event) => updateHour(item.id, { closeTime: event.target.value })}
                          className={clsx(inputClassName, !item.isOpen && "opacity-50")}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </FormSectionCard>

            <FormSectionCard
              title="Assigned staff"
              description="Attach the lead contacts responsible for branch operations, shift coverage, and local escalation."
              action={
                <button type="button" onClick={addStaffMember} className={secondaryActionClassName}>
                  Add staff member
                </button>
              }
            >
              {formState.staff.length ? (
                <div className="space-y-3">
                  {formState.staff.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field id={`${member.id}-name`} label="Name">
                          <input
                            id={`${member.id}-name`}
                            value={member.name}
                            onChange={(event) =>
                              updateStaffMember(member.id, { name: event.target.value })
                            }
                            className={inputClassName}
                            placeholder="Staff member name"
                          />
                        </Field>

                        <Field id={`${member.id}-role`} label="Role">
                          <select
                            id={`${member.id}-role`}
                            value={member.role}
                            onChange={(event) =>
                              updateStaffMember(member.id, { role: event.target.value })
                            }
                            className={inputClassName}
                          >
                            {staffRoleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field id={`${member.id}-shift`} label="Shift or scope">
                          <input
                            id={`${member.id}-shift`}
                            value={member.shift}
                            onChange={(event) =>
                              updateStaffMember(member.id, { shift: event.target.value })
                            }
                            className={inputClassName}
                            placeholder="Morning peak coverage"
                          />
                        </Field>

                        <Field id={`${member.id}-status`} label="Assignment label">
                          <select
                            id={`${member.id}-status`}
                            value={member.status}
                            onChange={(event) =>
                              updateStaffMember(member.id, { status: event.target.value })
                            }
                            className={inputClassName}
                          >
                            {staffStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeStaffMember(member.id)}
                          className="text-[13px] font-semibold text-text-danger"
                        >
                          Remove staff member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-6">
                  <p className="text-[14px] font-semibold text-text-primary">
                    No staff leads added yet
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                    Add the branch manager, operations lead, or front desk contacts responsible for
                    this location.
                  </p>
                </div>
              )}
            </FormSectionCard>

            <FormSectionCard
              title="Plans available"
              description="Select the membership or access products that should be available at this location."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {branchPlanOptions.map((plan) => (
                  <SelectionCard
                    key={plan.id}
                    checked={formState.plans.includes(plan.name)}
                    label={plan.name}
                    detail={plan.detail}
                    onChange={() => toggleSelection("plans", plan.name)}
                  />
                ))}
              </div>
            </FormSectionCard>

            <FormSectionCard
              title="Classes available"
              description="Select the recurring class types the branch should offer."
            >
              <div className="grid gap-3 md:grid-cols-2">
                {branchClassOptions.map((gymClass) => (
                  <SelectionCard
                    key={gymClass.id}
                    checked={formState.classes.includes(gymClass.name)}
                    label={gymClass.name}
                    detail={gymClass.detail}
                    onChange={() => toggleSelection("classes", gymClass.name)}
                  />
                ))}
              </div>
            </FormSectionCard>
          </form>

          <div className="space-y-4">
            <Panel
              eyebrow="Preview"
              title="Branch summary"
              description="Quick scan before publishing branch changes."
              action={<StatusBadge label={formState.status} tone={formState.status === "Inactive" ? "danger" : formState.status === "Watch" ? "warning" : formState.status === "Live" ? "success" : "neutral"} />}
            >
              <p className="text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
                {branchLabel}
              </p>
              <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                {formState.address || "Branch address will appear here once it is filled in."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Open days
                  </p>
                  <p className="mt-2 text-[18px] font-semibold text-text-primary">{openDays}</p>
                </div>
                <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Staff leads
                  </p>
                  <p className="mt-2 text-[18px] font-semibold text-text-primary">
                    {formState.staff.length}
                  </p>
                </div>
                <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Plans
                  </p>
                  <p className="mt-2 text-[18px] font-semibold text-text-primary">
                    {selectedPlans.length}
                  </p>
                </div>
                <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Classes
                  </p>
                  <p className="mt-2 text-[18px] font-semibold text-text-primary">
                    {selectedClasses.length}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel
              eyebrow="Readiness"
              title={isEditMode ? "Current branch health" : "Launch checklist"}
              description={
                isEditMode
                  ? "Keep the existing branch context visible while edits are being reviewed."
                  : "Use this checklist to keep the add-branch workflow operational instead of purely administrative."
              }
            >
              <div className="space-y-3">
                {isEditMode && branch ? (
                  <>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Members
                      </p>
                      <p className="mt-2 text-[18px] font-semibold text-text-primary">
                        {branch.members.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Occupancy
                      </p>
                      <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                        {branch.occupancy}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                        Current note
                      </p>
                      <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                        {branch.note}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[14px] leading-[1.65] text-text-secondary">
                        Confirm a manager and at least one front desk or operations lead before the
                        branch goes live.
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[14px] leading-[1.65] text-text-secondary">
                        Keep branch hours aligned with class schedules so front desk coverage does
                        not fall behind the calendar.
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                      <p className="text-[14px] leading-[1.65] text-text-secondary">
                        Assign at least one plan and one class so the branch detail screen is not
                        empty on launch.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Panel>

            <Panel
              eyebrow="Selection"
              title="Current setup"
              description="What will be visible on the branch detail surface once this configuration is published."
            >
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Plans selected
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                    {selectedPlans.length
                      ? selectedPlans.map((plan) => plan.name).join(", ")
                      : "No plans selected yet."}
                  </p>
                </div>
                <div className="border-t border-border-soft pt-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                    Classes selected
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                    {selectedClasses.length
                      ? selectedClasses.map((gymClass) => gymClass.name).join(", ")
                      : "No classes selected yet."}
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
    </div>
  );
}
