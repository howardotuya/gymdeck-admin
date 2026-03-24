"use client";

import { PhoneInput } from "react-international-phone";
import type { CSSProperties } from "react";

type CSSVariableStyles = CSSProperties & Record<`--${string}`, string>;

const phoneFieldStyle: CSSVariableStyles = {
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
  "--react-international-phone-selected-dropdown-item-background-color": "var(--bg-brand-soft)",
  "--react-international-phone-selected-dropdown-item-text-color": "var(--text-primary)",
  "--react-international-phone-selected-dropdown-item-dial-code-color": "var(--text-brand)",
  "--react-international-phone-dropdown-shadow": "var(--shadow-panel)",
  "--react-international-phone-dropdown-top": "48px",
};

type PhoneFieldProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  defaultCountry?: string;
  preferredCountries?: string[];
};

export function PhoneField({
  id,
  name,
  value,
  onChange,
  placeholder = "+234 800 000 0000",
  autoComplete = "off",
  defaultCountry = "ng",
  preferredCountries = ["ng", "gh", "ke", "za", "gb", "us"],
}: PhoneFieldProps) {
  return (
    <div className="ui-phone-field">
      <PhoneInput
        defaultCountry={defaultCountry}
        preferredCountries={preferredCountries}
        value={value}
        onChange={onChange}
        style={phoneFieldStyle}
        className="ui-phone-input"
        inputClassName="ui-phone-input__field"
        countrySelectorStyleProps={{
          className: "ui-phone-input__selector",
          buttonClassName: "ui-phone-input__selector-button",
          flagClassName: "ui-phone-input__selector-flag",
          dropdownArrowClassName: "ui-phone-input__selector-arrow",
          dropdownStyleProps: {
            className: "ui-phone-input__dropdown",
            listItemClassName: "ui-phone-input__dropdown-item",
            listItemSelectedClassName: "ui-phone-input__dropdown-item--selected",
            listItemFocusedClassName: "ui-phone-input__dropdown-item--focused",
            listItemCountryNameClassName: "ui-phone-input__dropdown-country",
            listItemDialCodeClassName: "ui-phone-input__dropdown-dial-code",
            preferredListDividerClassName: "ui-phone-input__dropdown-divider",
          },
        }}
        inputProps={{
          id,
          name,
          autoComplete,
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
