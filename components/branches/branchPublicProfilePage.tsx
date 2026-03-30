"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, Input, Panel, StatusBadge } from "@/components/ui";
import {
  Field,
  SelectionCard,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import {
  branchAmenityOptions,
  branchAudienceTagOptions,
} from "./data";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchAmenity, BranchDetail, BranchRuleItem } from "./types";

type BranchPublicProfilePageProps = {
  branch: BranchDetail;
};

type BranchPublicProfileFormState = {
  headline: string;
  overviewShort: string;
  overviewLong: string;
  amenities: BranchAmenity[];
  rules: BranchRuleItem[];
  audienceTags: string[];
};

function cloneRules(items: BranchRuleItem[]) {
  return items.map((item) => ({ ...item }));
}

function cloneAmenities(items: BranchAmenity[]) {
  return items.map((item) => ({ ...item }));
}

function createRuleId() {
  return `rule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildInitialState(branch: BranchDetail): BranchPublicProfileFormState {
  return {
    headline: branch.publicProfile.headline,
    overviewShort: branch.publicProfile.overviewShort,
    overviewLong: branch.publicProfile.overviewLong,
    amenities: cloneAmenities(branch.publicProfile.amenities),
    rules: cloneRules(branch.publicProfile.rules),
    audienceTags: [...branch.publicProfile.audienceTags],
  };
}

function ArraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

export function BranchPublicProfilePage({ branch }: BranchPublicProfilePageProps) {
  const [formState, setFormState] = useState<BranchPublicProfileFormState>(() =>
    buildInitialState(branch),
  );

  const isDirty = useMemo(() => {
    const initialState = buildInitialState(branch);

    return (
      formState.headline !== initialState.headline ||
      formState.overviewShort !== initialState.overviewShort ||
      formState.overviewLong !== initialState.overviewLong ||
      !ArraysEqual(
        formState.amenities.map((item) => item.id),
        initialState.amenities.map((item) => item.id),
      ) ||
      !ArraysEqual(formState.audienceTags, initialState.audienceTags) ||
      JSON.stringify(formState.rules) !== JSON.stringify(initialState.rules)
    );
  }, [branch, formState]);

  const selectedAmenityIds = useMemo(
    () => new Set(formState.amenities.map((item) => item.id)),
    [formState.amenities],
  );

  const resetForm = () => {
    setFormState(buildInitialState(branch));
  };

  const handleSave = () => {
    toast.success(`${branch.name} public profile changes are staged for review.`);
  };

  const toggleAmenity = (amenity: BranchAmenity) => {
    setFormState((currentState) => ({
      ...currentState,
      amenities: selectedAmenityIds.has(amenity.id)
        ? currentState.amenities.filter((item) => item.id !== amenity.id)
        : [...currentState.amenities, amenity],
    }));
  };

  const toggleAudienceTag = (tag: string) => {
    setFormState((currentState) => ({
      ...currentState,
      audienceTags: currentState.audienceTags.includes(tag)
        ? currentState.audienceTags.filter((item) => item !== tag)
        : [...currentState.audienceTags, tag],
    }));
  };

  const updateRule = (ruleId: string, patch: Partial<BranchRuleItem>) => {
    setFormState((currentState) => ({
      ...currentState,
      rules: currentState.rules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...patch } : rule,
      ),
    }));
  };

  const addRule = () => {
    setFormState((currentState) => ({
      ...currentState,
      rules: [
        ...currentState.rules,
        {
          id: createRuleId(),
          title: "",
          details: "",
          expanded: false,
        },
      ],
    }));
  };

  const removeRule = (ruleId: string) => {
    setFormState((currentState) => ({
      ...currentState,
      rules: currentState.rules.filter((rule) => rule.id !== ruleId),
    }));
  };

  const completenessScore = Math.round(
    [
      formState.headline.trim(),
      formState.overviewShort.trim(),
      formState.overviewLong.trim(),
      formState.amenities.length > 0 ? "yes" : "",
      formState.rules.some((rule) => rule.title.trim()) ? "yes" : "",
      formState.audienceTags.length > 0 ? "yes" : "",
    ].filter(Boolean).length / 6 * 100,
  );

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="public-profile"
      pageLabel="Public profile"
      description="Manage the branch-facing overview, amenities, rules, and audience positioning members will see across discovery surfaces."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={branch.publishing.isDiscoverable ? "Discoverable" : "Draft"}
            tone={branch.publishing.isDiscoverable ? "success" : "neutral"}
          />
          <button
            type="button"
            onClick={resetForm}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={primaryActionClassName}
          >
            Save profile
          </button>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-4">
          <FormSectionCard
            title="Listing copy"
            description="Shape the first impression members get when they discover this branch."
          >
            <div className="grid gap-4">
              <Field id="branch-headline" label="Headline">
                <Input
                  id="branch-headline"
                  value={formState.headline}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      headline: event.target.value,
                    }))
                  }
                  placeholder="High-conviction summary for the branch"
                />
              </Field>

              <Field id="branch-overview-short" label="Short overview">
                <Input
                  as="textarea"
                  id="branch-overview-short"
                  value={formState.overviewShort}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      overviewShort: event.target.value,
                    }))
                  }
                  placeholder="Use 1 to 2 sentences for cards, search, and listing summaries."
                />
              </Field>

              <Field id="branch-overview-long" label="Long overview">
                <Input
                  as="textarea"
                  id="branch-overview-long"
                  value={formState.overviewLong}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      overviewLong: event.target.value,
                    }))
                  }
                  className="min-h-[164px]"
                  placeholder="Describe the branch experience, facilities, audience, and why members choose this location."
                />
              </Field>
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Amenities"
            description="Use structured amenities for filtering and consistent listing display."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {branchAmenityOptions.map((amenity) => (
                <SelectionCard
                  key={amenity.id}
                  checked={selectedAmenityIds.has(amenity.id)}
                  label={amenity.label}
                  detail="Show this amenity on the branch listing and related discovery surfaces."
                  onChange={() => toggleAmenity(amenity)}
                />
              ))}
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Rules and etiquette"
            description="Keep branch guidance structured so members know what to expect before arrival."
            action={
              <button type="button" onClick={addRule} className={secondaryActionClassName}>
                Add rule
              </button>
            }
          >
            <div className="space-y-4">
              {formState.rules.map((rule, index) => (
                <div
                  key={rule.id}
                  className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
                >
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <Field id={`rule-title-${rule.id}`} label={`Rule ${index + 1}`}>
                      <Input
                        id={`rule-title-${rule.id}`}
                        value={rule.title}
                        onChange={(event) => updateRule(rule.id, { title: event.target.value })}
                        placeholder="Wipe down equipment after use"
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

                  <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                    <Field id={`rule-details-${rule.id}`} label="Details">
                      <Input
                        as="textarea"
                        id={`rule-details-${rule.id}`}
                        value={rule.details ?? ""}
                        onChange={(event) =>
                          updateRule(rule.id, { details: event.target.value })
                        }
                        placeholder="Optional supporting context shown when the rule expands."
                      />
                    </Field>

                    <label className="flex items-center gap-3 rounded-[16px] border border-border-soft bg-bg-input px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(rule.expanded)}
                        onChange={(event) =>
                          updateRule(rule.id, { expanded: event.target.checked })
                        }
                        className="h-4 w-4 rounded border border-border-strong"
                      />
                      <span className="text-[14px] font-medium text-text-primary">
                        Expanded by default
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Audience tags"
            description="Position the branch clearly for discovery, targeting, and quick scanning."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {branchAudienceTagOptions.map((tag) => (
                <SelectionCard
                  key={tag}
                  checked={formState.audienceTags.includes(tag)}
                  label={tag}
                  detail="Show this positioning tag on the branch listing where relevant."
                  onChange={() => toggleAudienceTag(tag)}
                />
              ))}
            </div>
          </FormSectionCard>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Profile health"
            title="Completeness"
            description="Quick scan of how ready the public profile is before publishing."
            action={
              <StatusBadge
                label={`${completenessScore}% complete`}
                tone={completenessScore >= 80 ? "success" : completenessScore >= 50 ? "warning" : "neutral"}
              />
            }
          >
            <div className="space-y-3">
              {([
                ["Headline", Boolean(formState.headline.trim())],
                ["Short overview", Boolean(formState.overviewShort.trim())],
                ["Long overview", Boolean(formState.overviewLong.trim())],
                ["Amenities selected", formState.amenities.length > 0],
                ["Rules added", formState.rules.some((rule) => rule.title.trim())],
                ["Audience tags", formState.audienceTags.length > 0],
              ] as Array<[string, boolean]>).map(([label, complete]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3"
                >
                  <p className="text-[14px] font-medium text-text-primary">{label}</p>
                  <StatusBadge
                    label={complete ? "Ready" : "Missing"}
                    tone={complete ? "success" : "warning"}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Live preview"
            title="Public summary"
            description="Approximate content blocks the member-facing branch page will consume."
          >
            <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
              <p className="text-[16px] font-semibold text-text-primary">
                {formState.headline || "Headline will appear here"}
              </p>
              <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
                {formState.overviewShort || "Short overview copy will appear here once added."}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                Audience tags
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {formState.audienceTags.length ? (
                  formState.audienceTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-text-secondary">
                    No audience tags selected yet.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                Amenities
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {formState.amenities.length ? (
                  formState.amenities.map((amenity) => (
                    <span
                      key={amenity.id}
                      className="inline-flex rounded-full bg-bg-surface px-3 py-1.5 text-[12px] font-semibold text-text-secondary"
                    >
                      {amenity.label}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-text-secondary">
                    No amenities selected yet.
                  </span>
                )}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
