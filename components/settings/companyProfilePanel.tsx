"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, ImageUploadField, PhoneField } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
} from "./shared";
import type { CompanyProfileFormState } from "./types";

type CompanyProfilePanelProps = {
  companyProfile: CompanyProfileFormState;
};

function getAssetFileName(assetUrl?: string) {
  if (!assetUrl) {
    return undefined;
  }

  const [pathWithoutQuery] = assetUrl.split("?");
  const segments = pathWithoutQuery.split("/");

  return segments.at(-1) || undefined;
}

export function CompanyProfilePanel({
  companyProfile: initialCompanyProfile,
}: CompanyProfilePanelProps) {
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);
  const generatedLogoUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (generatedLogoUrlRef.current) {
        URL.revokeObjectURL(generatedLogoUrlRef.current);
      }
    };
  }, []);

  const updateField = <TKey extends keyof CompanyProfileFormState>(
    key: TKey,
    value: CompanyProfileFormState[TKey],
  ) => {
    setCompanyProfile((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const clearGeneratedLogoPreview = () => {
    if (!generatedLogoUrlRef.current) {
      return;
    }

    URL.revokeObjectURL(generatedLogoUrlRef.current);
    generatedLogoUrlRef.current = null;
  };

  const handleLogoSelect = (file: File) => {
    clearGeneratedLogoPreview();

    const previewUrl = URL.createObjectURL(file);
    generatedLogoUrlRef.current = previewUrl;

    setCompanyProfile((currentState) => ({
      ...currentState,
      logoUrl: previewUrl,
      logoFileName: file.name,
    }));
  };

  const handleLogoRemove = () => {
    clearGeneratedLogoPreview();

    setCompanyProfile((currentState) => ({
      ...currentState,
      logoUrl: undefined,
      logoFileName: undefined,
    }));
  };

  const handleIdentitySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Company identity updated.");
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Company contact updated.");
  };

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Company address updated.");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleIdentitySubmit}>
        <FormSectionCard
          title="Identity"
          action={
            <button type="submit" className={primaryActionClassName}>
              Save changes
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="settings-company-name" label="Company name">
              <input
                id="settings-company-name"
                value={companyProfile.companyName}
                onChange={(event) => updateField("companyName", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-company-display-name" label="Display name">
              <input
                id="settings-company-display-name"
                value={companyProfile.displayName}
                onChange={(event) => updateField("displayName", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field
              id="settings-company-legal-name"
              label="Legal name"
              className="md:col-span-2"
            >
              <input
                id="settings-company-legal-name"
                value={companyProfile.legalName}
                onChange={(event) => updateField("legalName", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <div className="md:col-span-2">
              <ImageUploadField
                id="settings-company-logo-asset"
                label="Logo asset"
                hint="Upload the company logo used across the admin workspace and profile surfaces."
                fileName={
                  companyProfile.logoFileName ?? getAssetFileName(companyProfile.logoUrl)
                }
                previewUrl={companyProfile.logoUrl}
                previewLabel="Company logo"
                previewObjectFit="contain"
                previewHeight={220}
                emptyStateTitle="Upload company logo"
                emptyStateDescription="Drag and drop a JPG, PNG, or WebP logo here, or click to browse. The selected file will be used anywhere the company logo appears."
                onSelect={handleLogoSelect}
                onRemove={handleLogoRemove}
              />
            </div>
          </div>
        </FormSectionCard>
      </form>

      <form onSubmit={handleContactSubmit}>
        <FormSectionCard
          title="Contact"
          action={
            <button type="submit" className={primaryActionClassName}>
              Save contact
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="settings-company-support-email" label="Support email">
              <input
                id="settings-company-support-email"
                type="email"
                value={companyProfile.supportEmail}
                onChange={(event) => updateField("supportEmail", event.target.value)}
                className={inputClassName}
                autoComplete="email"
              />
            </Field>

            <Field id="settings-company-support-phone" label="Support phone">
              <PhoneField
                id="settings-company-support-phone"
                value={companyProfile.supportPhone}
                onChange={(value) => updateField("supportPhone", value)}
                autoComplete="tel"
              />
            </Field>

            <Field id="settings-company-website" label="Website">
              <input
                id="settings-company-website"
                type="url"
                value={companyProfile.website}
                onChange={(event) => updateField("website", event.target.value)}
                className={inputClassName}
                autoComplete="url"
              />
            </Field>

            <Field id="settings-company-whatsapp" label="WhatsApp">
              <PhoneField
                id="settings-company-whatsapp"
                value={companyProfile.whatsapp}
                onChange={(value) => updateField("whatsapp", value)}
                autoComplete="tel"
              />
            </Field>
          </div>
        </FormSectionCard>
      </form>

      <form onSubmit={handleAddressSubmit}>
        <FormSectionCard
          title="Address"
          action={
            <button type="submit" className={primaryActionClassName}>
              Save address
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="settings-company-country" label="Country">
              <input
                id="settings-company-country"
                value={companyProfile.country}
                onChange={(event) => updateField("country", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-company-state" label="State">
              <input
                id="settings-company-state"
                value={companyProfile.state}
                onChange={(event) => updateField("state", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-company-city" label="City">
              <input
                id="settings-company-city"
                value={companyProfile.city}
                onChange={(event) => updateField("city", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-company-postal-code" label="Postal code">
              <input
                id="settings-company-postal-code"
                value={companyProfile.postalCode}
                onChange={(event) => updateField("postalCode", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field
              id="settings-company-address-line-1"
              label="Address line 1"
              className="md:col-span-2"
            >
              <input
                id="settings-company-address-line-1"
                value={companyProfile.addressLine1}
                onChange={(event) => updateField("addressLine1", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field
              id="settings-company-address-line-2"
              label="Address line 2"
              className="md:col-span-2"
            >
              <input
                id="settings-company-address-line-2"
                value={companyProfile.addressLine2}
                onChange={(event) => updateField("addressLine2", event.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>
        </FormSectionCard>
      </form>
    </div>
  );
}
