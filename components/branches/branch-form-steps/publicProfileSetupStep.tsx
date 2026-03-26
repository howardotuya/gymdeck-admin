import { useState } from "react";
import clsx from "clsx";
import { FormSectionCard } from "@/components/ui";
import { branchAmenityOptions } from "../data";
import type { BranchFormState, BranchRuleItem } from "../types";
import {
  Field,
  inputClassName,
  secondaryActionClassName,
  textAreaClassName,
  type BranchFormUpdateField,
} from "./shared";

type PublicProfileSetupStepProps = {
  formState: BranchFormState;
  updateField: BranchFormUpdateField;
  addRule: (seed?: Partial<BranchRuleItem>) => void;
  addCustomAmenity: (amenityLabel: string) => void;
  removeRule: (ruleId: string) => void;
  toggleAmenity: (amenityLabel: string) => void;
  updateRule: (ruleId: string, patch: Partial<BranchRuleItem>) => void;
};

const sectionLabelClassName =
  "text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle";

const ruleStarterTemplates: Array<Pick<BranchRuleItem, "title" | "details" | "expanded">> = [
  {
    title: "Wipe down equipment",
    details: "Clean benches, mats, and touchpoints after use so the floor stays ready for the next member.",
    expanded: true,
  },
  {
    title: "Re-rack weights",
    details: "Return dumbbells, barbells, and plates to their marked positions before moving to the next station.",
    expanded: false,
  },
  {
    title: "Share equipment during peak hours",
    details: "Limit station hold times and allow work-ins when the floor is busy in the mornings and evenings.",
    expanded: false,
  },
  {
    title: "Use indoor training shoes",
    details: "Wear clean indoor footwear to protect flooring and reduce dirt across studio and strength areas.",
    expanded: false,
  },
];

export function PublicProfileSetupStep({
  formState,
  updateField,
  addRule,
  addCustomAmenity,
  removeRule,
  toggleAmenity,
  updateRule,
}: PublicProfileSetupStepProps) {
  const [customAmenity, setCustomAmenity] = useState("");
  const baseAmenityLabels = new Set(branchAmenityOptions.map((amenity) => amenity.label));
  const customAmenities = formState.publicAmenities.filter((label) => !baseAmenityLabels.has(label));
  const activeRuleCount = formState.publicRules.filter((rule) => rule.title.trim()).length;

  const handleAddCustomAmenity = () => {
    const nextAmenity = customAmenity.trim();

    if (!nextAmenity) {
      return;
    }

    addCustomAmenity(nextAmenity);
    setCustomAmenity("");
  };

  return (
    <div className="space-y-4">
      <FormSectionCard
        title="Public profile"
        description="Set the overview members will see before they visit this branch."
      >
        <Field id="branch-public-overview" label="Overview">
          <textarea
            id="branch-public-overview"
            value={formState.publicOverview}
            onChange={(event) => updateField("publicOverview", event.target.value)}
            className={textAreaClassName}
            placeholder="Describe the branch experience, training focus, and what members should expect."
          />
        </Field>
      </FormSectionCard>

      <FormSectionCard
        title="Amenities"
        description="Choose what members will see in the overview section and keep the final list easy to scan."
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className={sectionLabelClassName}>Selected amenities</p>
                <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                  These appear as the member-facing amenity list on the overview page.
                </p>
              </div>
              <span className="inline-flex h-fit rounded-full bg-bg-brand-soft px-3 py-1 text-[12px] font-semibold text-text-brand">
                {formState.publicAmenities.length} selected
              </span>
            </div>

            {formState.publicAmenities.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {formState.publicAmenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center justify-between gap-3 rounded-[16px] border border-border-soft bg-bg-surface px-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-bg-brand-soft text-[12px] font-semibold text-text-brand">
                        ✓
                      </span>
                      <span className="truncate text-[14px] font-medium text-text-primary">
                        {amenity}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className="shrink-0 text-[13px] font-semibold text-text-secondary transition-colors hover:text-text-primary"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[18px] border border-dashed border-border-strong px-4 py-6">
                <p className="text-[14px] font-semibold text-text-primary">
                  No amenities selected yet
                </p>
                <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                  Pick the facilities members should see immediately when they view this branch.
                </p>
              </div>
            )}

            <div className="mt-5 border-t border-border-soft pt-4">
              <p className={sectionLabelClassName}>Add custom amenity</p>
              <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                Use this for facilities that are unique to this branch and not already listed.
              </p>
              <form
                className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleAddCustomAmenity();
                }}
              >
                <input
                  id="branch-custom-amenity"
                  value={customAmenity}
                  onChange={(event) => setCustomAmenity(event.target.value)}
                  className={inputClassName}
                  placeholder="Cold plunge pool"
                />
                <button
                  type="submit"
                  className={secondaryActionClassName}
                  disabled={!customAmenity.trim()}
                >
                  Add custom
                </button>
              </form>

              {customAmenities.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {customAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-surface px-3 py-1.5 text-[12px] font-semibold text-text-primary transition-colors hover:border-border-strong"
                    >
                      {amenity}
                      <span className="text-text-secondary">×</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={sectionLabelClassName}>Amenity picker</p>
                <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                  Toggle the facilities you want to surface in public overview.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {branchAmenityOptions.map((amenity) => {
                const isSelected = formState.publicAmenities.includes(amenity.label);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.label)}
                    className={clsx(
                      "flex items-start gap-3 rounded-[18px] border px-4 py-4 text-left transition-colors",
                      isSelected
                        ? "border-border-brand bg-bg-brand-soft/45"
                        : "border-border-soft bg-bg-muted hover:border-border-strong",
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
                        {amenity.label}
                      </p>
                      <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                        {isSelected
                          ? "Included in the branch overview."
                          : "Tap to add this amenity to the public profile."}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard
        title="Gym Rules & Etiquette"
        description="Write short, member-facing guidance that will appear as expandable rules on the overview page."
      >
        <div className="space-y-4">
          <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className={sectionLabelClassName}>Rule starter kit</p>
                <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                  Start from a common house rule or add an empty rule if you want to write one from scratch.
                </p>
              </div>
              <span className="inline-flex h-fit rounded-full bg-bg-brand-soft px-3 py-1 text-[12px] font-semibold text-text-brand">
                {activeRuleCount} prepared
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {ruleStarterTemplates.map((template) => (
                <button
                  key={template.title}
                  type="button"
                  onClick={() => addRule(template)}
                  className="inline-flex items-center rounded-full border border-border-soft bg-bg-surface px-3 py-2 text-[13px] font-semibold text-text-primary transition-colors hover:border-border-strong"
                >
                  {template.title}
                </button>
              ))}
              <button type="button" onClick={() => addRule()} className={secondaryActionClassName}>
                Add empty rule
              </button>
            </div>
          </div>

          {formState.publicRules.length ? (
            formState.publicRules.map((rule, index) => (
              <div
                key={rule.id}
                className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className={sectionLabelClassName}>Rule {index + 1}</p>
                    <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                      {rule.title.trim()
                        ? `Shown to members as "${rule.title.trim()}".`
                        : "Add a short headline members can scan quickly."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex h-10 items-center gap-2 rounded-full border border-border-soft bg-bg-muted px-4 text-[13px] font-semibold text-text-primary">
                      <input
                        type="checkbox"
                        checked={Boolean(rule.expanded)}
                        onChange={(event) =>
                          updateRule(rule.id, { expanded: event.target.checked })
                        }
                        className="h-4 w-4 rounded border border-border-strong"
                      />
                      Expanded first
                    </label>
                    <button
                      type="button"
                      onClick={() => removeRule(rule.id)}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border-soft px-4 text-[13px] font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <Field id={`public-rule-title-${rule.id}`} label="Headline">
                    <input
                      id={`public-rule-title-${rule.id}`}
                      value={rule.title}
                      onChange={(event) => updateRule(rule.id, { title: event.target.value })}
                      className={inputClassName}
                      placeholder="Wipe down equipment"
                    />
                  </Field>

                  <Field id={`public-rule-detail-${rule.id}`} label="Details">
                    <textarea
                      id={`public-rule-detail-${rule.id}`}
                      value={rule.details ?? ""}
                      onChange={(event) => updateRule(rule.id, { details: event.target.value })}
                      className={textAreaClassName}
                      placeholder="Explain the rule in one or two short sentences so members know what to do."
                    />
                  </Field>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-6">
              <p className="text-[14px] font-semibold text-text-primary">No rules added yet</p>
              <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                Add at least one etiquette note for members.
              </p>
            </div>
          )}
        </div>
      </FormSectionCard>
    </div>
  );
}
