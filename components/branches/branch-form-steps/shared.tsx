import clsx from "clsx";
import type { ReactNode } from "react";
import { Panel, StatusBadge, type StatusTone } from "@/components/ui";
import { branchClassOptions, branchPlanOptions } from "../data";
import type {
  BranchDetail,
  BranchEditableStaffMember,
  BranchFormState,
} from "../types";

export const primaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-brand-primary-hover";
export const secondaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong";
export const dangerActionClassName =
  "inline-flex h-11 items-center justify-center rounded-xl border border-[#fecdca] bg-bg-danger-soft px-4 text-[14px] font-semibold text-text-danger transition-colors hover:border-[#fda29b] disabled:cursor-not-allowed disabled:opacity-60";
export const inputClassName =
  "h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";
export const textAreaClassName =
  "min-h-[112px] w-full rounded-xl border border-border-soft bg-bg-input px-4 py-3 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

type BranchFormEditableKey = Exclude<
  keyof BranchFormState,
  "openingHours" | "staff" | "plans" | "classes"
>;

export type BranchFormUpdateField = <TKey extends BranchFormEditableKey>(
  key: TKey,
  value: BranchFormState[TKey],
) => void;

export type BranchFormUpdateHour = (
  hourId: string,
  patch: Partial<BranchFormState["openingHours"][number]>,
) => void;

export type BranchFormUpdateStaffMember = (
  memberId: string,
  patch: Partial<BranchEditableStaffMember>,
) => void;

export type BranchFormUpdateSelection = (
  key: "plans" | "classes",
  name: string,
) => void;

export type BranchFormSetSelections = (
  key: "plans" | "classes",
  selections: string[],
) => void;

export function createStaffId() {
  return `staff-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getBranchLabel(
  formState: BranchFormState,
  branch?: BranchDetail,
  isEditMode = false,
) {
  return formState.name.trim() || (isEditMode ? branch?.name ?? "Branch" : "New branch");
}

function getBranchAddressLabel(formState: BranchFormState) {
  const addressParts = [
    formState.addressLine1,
    formState.addressLine2,
    formState.city,
    formState.state,
    formState.country,
    formState.postalCode,
  ].filter((value) => value.trim());

  if (addressParts.length) {
    return addressParts.join(", ");
  }

  return formState.address;
}

function getStatusTone(status: BranchFormState["status"]): StatusTone {
  if (status === "Inactive") {
    return "danger";
  }

  if (status === "Watch") {
    return "warning";
  }

  if (status === "Live") {
    return "success";
  }

  return "neutral";
}

function getSelectedPlans(formState: BranchFormState) {
  return branchPlanOptions.filter((plan) => formState.plans.includes(plan.name));
}

function getSelectedClasses(formState: BranchFormState) {
  return branchClassOptions.filter((gymClass) => formState.classes.includes(gymClass.name));
}

function getSelectedGalleryMedia(formState: BranchFormState) {
  return formState.gallery
    .map((mediaId) => formState.mediaLibrary.find((item) => item.id === mediaId))
    .filter((item): item is BranchFormState["mediaLibrary"][number] => Boolean(item));
}

export function Field({
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

export function SelectionCard({
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

export function BranchSummaryPanel({ formState }: { formState: BranchFormState }) {
  const branchLabel = getBranchLabel(formState);
  const openDays = formState.openingHours.filter((item) => item.isOpen).length;
  const selectedPlans = getSelectedPlans(formState);
  const selectedClasses = getSelectedClasses(formState);
  const selectedGalleryMedia = getSelectedGalleryMedia(formState);
  const activeRules = formState.publicRules.filter((rule) => rule.title.trim()).length;

  return (
    <Panel
      eyebrow="Preview"
      title="Branch summary"
      description="Quick scan before publishing branch changes."
      action={<StatusBadge label={formState.status} tone={getStatusTone(formState.status)} />}
    >
      <p className="text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
        {branchLabel}
      </p>
      <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
        {getBranchAddressLabel(formState) || "Branch address will appear here once it is filled in."}
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
        <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            Gallery
          </p>
          <p className="mt-2 text-[18px] font-semibold text-text-primary">
            {selectedGalleryMedia.length}
          </p>
        </div>
        <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            Rules
          </p>
          <p className="mt-2 text-[18px] font-semibold text-text-primary">{activeRules}</p>
        </div>
      </div>
    </Panel>
  );
}

export function BranchReadinessPanel({
  branch,
  isEditMode,
}: {
  branch?: BranchDetail;
  isEditMode?: boolean;
}) {
  return (
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
                Confirm a branch manager, opening hours, and contact details before the branch goes
                live.
              </p>
            </div>
            <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
              <p className="text-[14px] leading-[1.65] text-text-secondary">
                Add at least one plan, one class, and one gallery image so the launch surface does
                not feel incomplete.
              </p>
            </div>
            <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
              <p className="text-[14px] leading-[1.65] text-text-secondary">
                Complete the public overview, amenities, and gym rules before requesting review.
              </p>
            </div>
          </>
        )}
      </div>
    </Panel>
  );
}

export function BranchSelectionPanel({ formState }: { formState: BranchFormState }) {
  const selectedPlans = getSelectedPlans(formState);
  const selectedClasses = getSelectedClasses(formState);
  const selectedGalleryMedia = getSelectedGalleryMedia(formState);
  const activeRules = formState.publicRules.filter((rule) => rule.title.trim());

  return (
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
        <div className="border-t border-border-soft pt-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            Gallery images
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            {selectedGalleryMedia.length
              ? selectedGalleryMedia.map((item) => item.fileName).join(", ")
              : "No gallery images added yet."}
          </p>
        </div>
        <div className="border-t border-border-soft pt-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            Public profile
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            {formState.publicOverview.trim()
              ? formState.publicOverview
              : "No public overview added yet."}
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            {formState.publicAmenities.length
              ? `Amenities: ${formState.publicAmenities.join(", ")}`
              : "No amenities selected yet."}
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            {activeRules.length
              ? `Gym Rules & Etiquette: ${activeRules.map((rule) => rule.title).join(", ")}`
              : "No gym rules added yet."}
          </p>
        </div>
      </div>
    </Panel>
  );
}
