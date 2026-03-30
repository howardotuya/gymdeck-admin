"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, Input, PhoneField, Select, SetupTopbar, type SelectOption } from "@/components/ui";
import {
  branchOptions,
  createEmployeeFormState,
  roleOptions,
  type EmployeeRow,
  type EmployeeFormState,
} from "./data";
import { Field } from "./shared";

const roleSelectOptions: SelectOption[] = roleOptions.map((role) => ({
  value: role,
  label: role,
}));

const branchSelectOptions: SelectOption[] = branchOptions.map((branch) => ({
  value: branch,
  label: branch,
}));

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
    toast.success(
      isEditMode
        ? `${employeeName} changes are ready to save under the ${formState.role} role.`
        : `${employeeName} is ready for invite under the ${formState.role} role.`,
    );
  };

  return (
    <div className="space-y-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:space-y-8 lg:pb-0">
      <SetupTopbar
        backHref="/staff-roles"
        cancelHref="/staff-roles"
        backLabel="Back to employees"
        mobileTitle={isEditMode ? "Edit employee" : "Create employee"}
        proceedLabel={isEditMode ? "Save changes" : "Create employee"}
        onProceed={() => {
          const formElement = document.getElementById(
            "employee-form",
          ) as HTMLFormElement | null;
          formElement?.requestSubmit();
        }}
      />

      <div className="mx-auto w-full max-w-[1120px]">
        <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
          <FormSectionCard title={isEditMode ? "Edit Staff" : "Create a staff"}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field id="firstName" label="First name" required>
                <Input
                  id="firstName"
                  value={formState.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  placeholder="Howard"
                />
              </Field>

              <Field id="lastName" label="Last name" required>
                <Input
                  id="lastName"
                  value={formState.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  placeholder="Otuya"
                />
              </Field>

              <Field id="role" label="Role" required>
                <Select
                  id="role"
                  options={roleSelectOptions}
                  value={formState.role}
                  onChange={(value) => updateField("role", value as string)}
                />
              </Field>

              <Field id="branch" label="Primary branch" required>
                <Select
                  id="branch"
                  options={branchSelectOptions}
                  value={formState.branch}
                  onChange={(value) => updateField("branch", value as string)}
                />
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
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
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
