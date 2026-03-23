import { FormSectionCard } from "@/components/ui";
import { PhoneInput } from "react-international-phone";
import type { CSSProperties } from "react";
import { branchStatusOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  inputClassName,
  textAreaClassName,
  type BranchFormUpdateField,
} from "./shared";

type CSSVariableStyles = CSSProperties & Record<`--${string}`, string>;

const branchPhoneInputStyle: CSSVariableStyles = {
  "--react-international-phone-height": "44px",
  "--react-international-phone-background-color": "var(--bg-input)",
  "--react-international-phone-text-color": "var(--text-primary)",
  "--react-international-phone-font-size": "14px",
  "--react-international-phone-border-radius": "12px",
  "--react-international-phone-border-color": "var(--border-soft)",
  "--react-international-phone-country-selector-background-color": "var(--bg-input)",
  "--react-international-phone-country-selector-background-color-hover": "var(--bg-control)",
  "--react-international-phone-country-selector-arrow-color": "var(--text-muted)",
  "--react-international-phone-dropdown-item-background-color": "var(--bg-surface)",
  "--react-international-phone-dropdown-item-text-color": "var(--text-primary)",
  "--react-international-phone-dropdown-item-dial-code-color": "var(--text-secondary)",
  "--react-international-phone-selected-dropdown-item-background-color":
    "var(--bg-brand-soft)",
  "--react-international-phone-selected-dropdown-item-text-color": "var(--text-primary)",
  "--react-international-phone-selected-dropdown-item-dial-code-color": "var(--text-brand)",
  "--react-international-phone-dropdown-shadow": "var(--shadow-panel)",
  "--react-international-phone-dropdown-top": "48px",
};

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
          <PhoneInput
            defaultCountry="ng"
            preferredCountries={["ng", "gh", "ke", "za", "gb", "us"]}
            value={formState.phone}
            onChange={(phone) => updateField("phone", phone)}
            style={branchPhoneInputStyle}
            className="branch-phone-input"
            inputClassName="branch-phone-input__field"
            countrySelectorStyleProps={{
              className: "branch-phone-input__selector",
              buttonClassName: "branch-phone-input__selector-button",
              flagClassName: "branch-phone-input__selector-flag",
              dropdownArrowClassName: "branch-phone-input__selector-arrow",
              dropdownStyleProps: {
                className: "branch-phone-input__dropdown",
                listItemClassName: "branch-phone-input__dropdown-item",
                listItemSelectedClassName: "branch-phone-input__dropdown-item--selected",
                listItemFocusedClassName: "branch-phone-input__dropdown-item--focused",
                listItemCountryNameClassName: "branch-phone-input__dropdown-country",
                listItemDialCodeClassName: "branch-phone-input__dropdown-dial-code",
                preferredListDividerClassName: "branch-phone-input__dropdown-divider",
              },
            }}
            inputProps={{
              id: "branch-phone",
              name: "phone",
              autoComplete: "off",
            }}
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
