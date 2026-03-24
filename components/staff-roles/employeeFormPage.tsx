"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { FormSectionCard, PhoneField, SetupTopbar } from "@/components/ui";
import {
  branchOptions,
  createEmployeeFormState,
  roleOptions,
  type EmployeeRow,
  type EmployeeFormState,
} from "./data";
import { Field, inputClassName } from "./shared";

type EmployeeFormPageProps = {
  mode?: "create" | "edit";
  employee?: EmployeeRow;
};

export function EmployeeFormPage({
  mode = "create",
  employee,
}: EmployeeFormPageProps) {
  const isEditMode = mode === "edit";
  const [formState, setFormState] = useState<EmployeeFormState>(() =>
    createEmployeeFormState(employee),
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const employeeName =
    `${formState.firstName} ${formState.lastName}`.trim() ||
    employee?.name ||
    "Employee";

  const updateField = <TKey extends keyof EmployeeFormState>(
    key: TKey,
    value: EmployeeFormState[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(
      isEditMode
        ? `${employeeName} changes are ready to save under the ${formState.role} role.`
        : `${employeeName} is ready for invite under the ${formState.role} role.`,
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <SetupTopbar
        backHref="/staff-roles"
        cancelHref="/staff-roles"
        backLabel="Back to employees"
        proceedLabel={isEditMode ? "Save changes" : "Create employee"}
        onProceed={() => {
          const formElement = document.getElementById(
            "employee-form",
          ) as HTMLFormElement | null;
          formElement?.requestSubmit();
        }}
      />

      {feedbackMessage ? (
        <div className="rounded-[24px] border border-border-brand bg-bg-brand-soft/55 px-5 py-4">
          <p className="text-[14px] leading-[1.65] text-text-primary">
            {feedbackMessage}
          </p>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1120px]">
        <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
          <FormSectionCard title={isEditMode ? "Edit Staff" : "Create a staff"}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="firstName" label="First name" required>
                <input
                  id="firstName"
                  value={formState.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Howard"
                />
              </Field>

              <Field id="lastName" label="Last name" required>
                <input
                  id="lastName"
                  value={formState.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Otuya"
                />
              </Field>

              <Field id="role" label="Role" required>
                <select
                  id="role"
                  value={formState.role}
                  onChange={(event) => updateField("role", event.target.value)}
                  className={inputClassName}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="branch" label="Primary branch" required>
                <select
                  id="branch"
                  value={formState.branch}
                  onChange={(event) =>
                    updateField("branch", event.target.value)
                  }
                  className={inputClassName}
                >
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="phone" label="Phone number" required>
                <PhoneField
                  id="phone"
                  value={formState.phone}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="+234 803 000 0000"
                />
              </Field>

              <Field id="alternatePhone" label="Alternate phone number">
                <PhoneField
                  id="alternatePhone"
                  value={formState.alternatePhone}
                  onChange={(value) => updateField("alternatePhone", value)}
                  placeholder="+234 805 000 0000"
                />
              </Field>

              <div className="md:col-span-2">
                <Field id="email" label="Email address">
                  <input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className={inputClassName}
                    placeholder="name@gymdeck.app"
                  />
                </Field>
              </div>
            </div>
          </FormSectionCard>
        </form>
      </div>
    </div>
  );
}
