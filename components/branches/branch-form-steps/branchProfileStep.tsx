import { FormSectionCard, Input, PhoneField, Select, type SelectOption } from "@/components/ui";
import { branchStatusOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  type BranchFormUpdateField,
} from "./shared";

type BranchProfileStepProps = {
  formState: BranchFormState;
  updateField: BranchFormUpdateField;
};

export function BranchProfileStep({
  formState,
  updateField,
}: BranchProfileStepProps) {
  const branchStatusSelectOptions: SelectOption[] = branchStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <FormSectionCard
      title="Branch profile"
      description="Set the core identity and contact details staff use during branch operations."
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
          <Input
            id="branch-manager"
            value={formState.manager}
            onChange={(event) => updateField("manager", event.target.value)}
            placeholder="Adaeze Cole"
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

        <Field id="branch-tags" label="Tags">
          <Input
            id="branch-tags"
            value={formState.tags}
            onChange={(event) => updateField("tags", event.target.value)}
            placeholder="Flagship, Parking, Recovery zone"
          />
        </Field>

        <div className="md:col-span-2">
          <Field id="branch-address" label="Address">
            <Input
              id="branch-address"
              value={formState.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder="12 Admiralty Way, Victoria Island, Lagos"
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field id="branch-note" label="Operational note">
            <Input
              as="textarea"
              id="branch-note"
              value={formState.note}
              onChange={(event) => updateField("note", event.target.value)}
              placeholder="Summarize the main operations note staff should keep in mind."
            />
          </Field>
        </div>
      </div>
    </FormSectionCard>
  );
}
