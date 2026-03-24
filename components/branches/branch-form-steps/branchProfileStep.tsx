import { FormSectionCard, PhoneField } from "@/components/ui";
import { branchStatusOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  inputClassName,
  textAreaClassName,
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
  return (
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
              updateField("status", event.target.value as BranchFormState["status"])
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
          <PhoneField
            id="branch-phone"
            name="phone"
            value={formState.phone}
            onChange={(value) => updateField("phone", value)}
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
  );
}
