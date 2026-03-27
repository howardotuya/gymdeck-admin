"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, PhoneField } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
} from "./shared";
import type { PasswordFormState, UserProfileFormState } from "./types";

type UserProfilePanelProps = {
  profile: UserProfileFormState;
  password: PasswordFormState;
};

export function UserProfilePanel({
  profile: initialProfile,
  password: initialPassword,
}: UserProfilePanelProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [password, setPassword] = useState(initialPassword);

  const updateProfileField = <TKey extends keyof UserProfileFormState>(
    key: TKey,
    value: UserProfileFormState[TKey],
  ) => {
    setProfile((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const updatePasswordField = <TKey extends keyof PasswordFormState>(
    key: TKey,
    value: PasswordFormState[TKey],
  ) => {
    setPassword((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Profile updated.");
  };

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Address updated.");
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.currentPassword || !password.newPassword || !password.confirmNewPassword) {
      toast.error("Complete all password fields.");
      return;
    }

    if (password.newPassword !== password.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setPassword(initialPassword);
    toast.success("Password updated.");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleProfileSubmit}>
        <FormSectionCard
          title="Profile"
          action={
            <button type="submit" className={primaryActionClassName}>
              Save changes
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="settings-user-first-name" label="First name">
              <input
                id="settings-user-first-name"
                value={profile.firstName}
                onChange={(event) => updateProfileField("firstName", event.target.value)}
                className={inputClassName}
                autoComplete="given-name"
              />
            </Field>

            <Field id="settings-user-last-name" label="Last name">
              <input
                id="settings-user-last-name"
                value={profile.lastName}
                onChange={(event) => updateProfileField("lastName", event.target.value)}
                className={inputClassName}
                autoComplete="family-name"
              />
            </Field>

            <Field id="settings-user-email" label="Email">
              <input
                id="settings-user-email"
                type="email"
                value={profile.email}
                onChange={(event) => updateProfileField("email", event.target.value)}
                className={inputClassName}
                autoComplete="email"
              />
            </Field>

            <Field id="settings-user-phone" label="Phone">
              <PhoneField
                id="settings-user-phone"
                value={profile.phone}
                onChange={(value) => updateProfileField("phone", value)}
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
            <Field id="settings-user-country" label="Country">
              <input
                id="settings-user-country"
                value={profile.country}
                onChange={(event) => updateProfileField("country", event.target.value)}
                className={inputClassName}
                autoComplete="country-name"
              />
            </Field>

            <Field id="settings-user-state" label="State">
              <input
                id="settings-user-state"
                value={profile.state}
                onChange={(event) => updateProfileField("state", event.target.value)}
                className={inputClassName}
                autoComplete="address-level1"
              />
            </Field>

            <Field id="settings-user-city" label="City">
              <input
                id="settings-user-city"
                value={profile.city}
                onChange={(event) => updateProfileField("city", event.target.value)}
                className={inputClassName}
                autoComplete="address-level2"
              />
            </Field>

            <Field id="settings-user-postal-code" label="Postal code">
              <input
                id="settings-user-postal-code"
                value={profile.postalCode}
                onChange={(event) => updateProfileField("postalCode", event.target.value)}
                className={inputClassName}
                autoComplete="postal-code"
              />
            </Field>

            <Field
              id="settings-user-address-line-1"
              label="Address line 1"
              className="md:col-span-2"
            >
              <input
                id="settings-user-address-line-1"
                value={profile.addressLine1}
                onChange={(event) => updateProfileField("addressLine1", event.target.value)}
                className={inputClassName}
                autoComplete="address-line1"
              />
            </Field>

            <Field
              id="settings-user-address-line-2"
              label="Address line 2"
              className="md:col-span-2"
            >
              <input
                id="settings-user-address-line-2"
                value={profile.addressLine2}
                onChange={(event) => updateProfileField("addressLine2", event.target.value)}
                className={inputClassName}
                autoComplete="address-line2"
              />
            </Field>
          </div>
        </FormSectionCard>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <FormSectionCard
          title="Password"
          action={
            <button type="submit" className={primaryActionClassName}>
              Update password
            </button>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Field id="settings-user-current-password" label="Current password">
              <input
                id="settings-user-current-password"
                type="password"
                value={password.currentPassword}
                onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
                className={inputClassName}
                autoComplete="current-password"
              />
            </Field>

            <Field id="settings-user-new-password" label="New password">
              <input
                id="settings-user-new-password"
                type="password"
                value={password.newPassword}
                onChange={(event) => updatePasswordField("newPassword", event.target.value)}
                className={inputClassName}
                autoComplete="new-password"
              />
            </Field>

            <Field id="settings-user-confirm-password" label="Confirm password">
              <input
                id="settings-user-confirm-password"
                type="password"
                value={password.confirmNewPassword}
                onChange={(event) =>
                  updatePasswordField("confirmNewPassword", event.target.value)
                }
                className={inputClassName}
                autoComplete="new-password"
              />
            </Field>
          </div>
        </FormSectionCard>
      </form>
    </div>
  );
}
