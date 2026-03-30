import clsx from "clsx";
import { FormSectionCard, Input, PhoneField, Select } from "@/components/ui";
import {
  branchCountryOptions,
  branchStateOptionsByCountry,
  branchStatusOptions,
} from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  type BranchFormUpdateField,
  type BranchFormUpdateHour,
} from "./shared";

type BranchProfileSetupStepProps = {
  formState: BranchFormState;
  managerOptions: Array<{ value: string; label: string }>;
  updateField: BranchFormUpdateField;
  updateHour: BranchFormUpdateHour;
};

export function BranchProfileSetupStep({
  formState,
  managerOptions,
  updateField,
  updateHour,
}: BranchProfileSetupStepProps) {
  const branchStatusSelectOptions = branchStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));
  const stateOptions =
    branchStateOptionsByCountry[
      formState.country as keyof typeof branchStateOptionsByCountry
    ] ?? [];

  return (
    <div className="space-y-4">
      <FormSectionCard
        title="Branch profile"
        description="Set the core identity, contact details, and staff owner for this branch."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="branch-name" label="Branch name">
            <Input
              id="branch-name"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Victoria Island"
            />
          </Field>

          <Field id="branch-status" label="Status">
            <Select
              id="branch-status"
              options={branchStatusSelectOptions}
              value={formState.status}
              onChange={(value) => updateField("status", value as BranchFormState["status"])}
            />
          </Field>

          <Field id="branch-manager" label="Manager">
            <Select
              id="branch-manager"
              options={[
                { value: "", label: "Select a staff member" },
                ...managerOptions,
              ]}
              value={formState.manager}
              onChange={(value) => updateField("manager", value as string)}
            />
          </Field>

          <Field id="branch-phone" label="Phone">
            <PhoneField
              id="branch-phone"
              name="phone"
              value={formState.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="+234 800 000 0000"
            />
          </Field>

          <Field id="branch-email" label="Email">
            <Input
              id="branch-email"
              type="email"
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="branch@gymdeck.com"
            />
          </Field>

          <Field id="branch-country" label="Country">
            <Select
              id="branch-country"
              value={formState.country}
              onChange={(value) => {
                const nextCountry = value as string;
                const nextStateOptions =
                  branchStateOptionsByCountry[
                    nextCountry as keyof typeof branchStateOptionsByCountry
                  ] ?? [];
                const nextState = nextStateOptions.some(
                  (option) => option.value === formState.state,
                )
                  ? formState.state
                  : "";

                updateField("country", nextCountry);
                updateField("state", nextState);
              }}
              options={branchCountryOptions}
              placeholder="Nigeria"
            />
          </Field>

          <Field id="branch-state" label="State">
            <Select
              id="branch-state"
              value={formState.state}
              onChange={(value) => updateField("state", value as string)}
              options={stateOptions}
              placeholder="Lagos"
            />
          </Field>

          <Field id="branch-city" label="City">
            <Input
              id="branch-city"
              value={formState.city}
              onChange={(event) => updateField("city", event.target.value)}
              placeholder="Victoria Island"
            />
          </Field>

          <Field id="branch-postal-code" label="Postal code">
            <Input
              id="branch-postal-code"
              value={formState.postalCode}
              onChange={(event) => updateField("postalCode", event.target.value)}
              placeholder="101241"
            />
          </Field>

          <div className="md:col-span-2">
            <Field id="branch-address-line-1" label="Address line 1">
              <Input
                id="branch-address-line-1"
                value={formState.addressLine1}
                onChange={(event) => updateField("addressLine1", event.target.value)}
                placeholder="12 Admiralty Way"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field id="branch-address-line-2" label="Address line 2">
              <Input
                id="branch-address-line-2"
                value={formState.addressLine2}
                onChange={(event) => updateField("addressLine2", event.target.value)}
                placeholder="Landmark or suite number"
              />
            </Field>
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard
        title="Opening hours"
        description="Keep daily operating hours explicit so branch staff can scan them at a glance."
      >
        <div className="overflow-hidden rounded-[20px] border border-border-soft bg-bg-muted">
          {formState.openingHours.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 border-b border-border-soft px-4 py-3 last:border-b-0 md:grid-cols-[120px_90px_140px_140px] md:items-center"
            >
              <p className="text-[14px] font-semibold text-text-primary">{item.day}</p>

              <label className="inline-flex items-center gap-2 text-[13px] text-text-secondary">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={(event) => updateHour(item.id, { isOpen: event.target.checked })}
                  className="h-4 w-4 rounded border border-border-strong"
                />
                Open
              </label>

              <Field id={`${item.id}-open`} label="Open">
                <Input
                  id={`${item.id}-open`}
                  type="time"
                  value={item.openTime}
                  disabled={!item.isOpen}
                  onChange={(event) => updateHour(item.id, { openTime: event.target.value })}
                  className={clsx(!item.isOpen && "opacity-50")}
                />
              </Field>

              <Field id={`${item.id}-close`} label="Close">
                <Input
                  id={`${item.id}-close`}
                  type="time"
                  value={item.closeTime}
                  disabled={!item.isOpen}
                  onChange={(event) => updateHour(item.id, { closeTime: event.target.value })}
                  className={clsx(!item.isOpen && "opacity-50")}
                />
              </Field>
            </div>
          ))}
        </div>
      </FormSectionCard>
    </div>
  );
}
