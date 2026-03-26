import { useState } from "react";
import { FormSectionCard } from "@/components/ui";
import { branchAmenityOptions } from "../data";
import type { BranchFormState, BranchRuleItem } from "../types";
import {
  Field,
  SelectionCard,
  inputClassName,
  secondaryActionClassName,
  textAreaClassName,
  type BranchFormUpdateField,
} from "./shared";

type PublicProfileSetupStepProps = {
  formState: BranchFormState;
  updateField: BranchFormUpdateField;
  addRule: () => void;
  addCustomAmenity: (amenityLabel: string) => void;
  removeRule: (ruleId: string) => void;
  toggleAmenity: (amenityLabel: string) => void;
  updateRule: (ruleId: string, patch: Partial<BranchRuleItem>) => void;
};

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
        description="Select the amenities you want surfaced on the branch public profile."
        action={
          <button
            type="button"
            onClick={() => {
              const nextAmenity = customAmenity.trim();

              if (!nextAmenity) {
                return;
              }

              addCustomAmenity(nextAmenity);
              setCustomAmenity("");
            }}
            className={secondaryActionClassName}
          >
            Add custom amenity
          </button>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <Field id="branch-custom-amenity" label="Custom amenity">
              <input
                id="branch-custom-amenity"
                value={customAmenity}
                onChange={(event) => setCustomAmenity(event.target.value)}
                className={inputClassName}
                placeholder="Cold plunge pool"
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                const nextAmenity = customAmenity.trim();

                if (!nextAmenity) {
                  return;
                }

                addCustomAmenity(nextAmenity);
                setCustomAmenity("");
              }}
              className="mt-[30px] inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
            >
              Save amenity
            </button>
          </div>

          {customAmenities.length ? (
            <div className="flex flex-wrap gap-2">
              {customAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className="inline-flex items-center rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand"
                >
                  {amenity}
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {branchAmenityOptions.map((amenity) => (
              <SelectionCard
                key={amenity.id}
                checked={formState.publicAmenities.includes(amenity.label)}
                label={amenity.label}
                detail="Show this amenity on the branch profile."
                onChange={() => toggleAmenity(amenity.label)}
              />
            ))}
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard
        title="Gym Rules & Etiquette"
        description="Add the branch-specific rules members should see before arrival."
        action={
          <button type="button" onClick={addRule} className={secondaryActionClassName}>
            Add rule
          </button>
        }
      >
        <div className="space-y-4">
          {formState.publicRules.length ? (
            formState.publicRules.map((rule, index) => (
              <div
                key={rule.id}
                className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                  <Field id={`public-rule-title-${rule.id}`} label={`Rule ${index + 1}`}>
                    <input
                      id={`public-rule-title-${rule.id}`}
                      value={rule.title}
                      onChange={(event) => updateRule(rule.id, { title: event.target.value })}
                      className={inputClassName}
                      placeholder="Re-rack weights after use"
                    />
                  </Field>

                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    className="mt-[30px] inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4">
                  <Field id={`public-rule-detail-${rule.id}`} label="Details">
                    <textarea
                      id={`public-rule-detail-${rule.id}`}
                      value={rule.details ?? ""}
                      onChange={(event) => updateRule(rule.id, { details: event.target.value })}
                      className={textAreaClassName}
                      placeholder="Optional extra context for members."
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
