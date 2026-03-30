import { Input, Select, FormSectionCard, type SelectOption } from "@/components/ui";
import { branchOptions, type RoleFormState } from "../../data";
import { Field } from "../../shared";

const branchSelectOptions: SelectOption[] = branchOptions.map((branch) => ({
  value: branch,
  label: branch,
}));

type UpdateRoleField = <TKey extends keyof RoleFormState>(
  key: TKey,
  value: RoleFormState[TKey],
) => void;

type RoleSetupStepProps = {
  formState: RoleFormState;
  updateField: UpdateRoleField;
};

export function RoleSetupStep({
  formState,
  updateField,
}: RoleSetupStepProps) {
  return (
    <FormSectionCard
      title="Role setup"
      description="Define the role structure first, including branch access, so permission decisions stay grounded in the actual operating context."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="role-name" label="Role name" required>
          <Input
            id="role-name"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Branch Manager"
          />
        </Field>

        <div className="md:col-span-2">
          <Field id="description" label="Role description">
            <Input
              as="textarea"
              id="description"
              value={formState.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Describe how this role operates across branches and who it supports."
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field id="assign-branches" label="Assign branches" required>
            <Select
              id="assign-branches"
              value={formState.selectedBranches}
              onChange={(selectedBranches) =>
                updateField(
                  "selectedBranches",
                  Array.isArray(selectedBranches)
                    ? selectedBranches
                    : selectedBranches
                      ? [selectedBranches]
                      : [],
                )
              }
              options={branchSelectOptions}
              multiple
              allOptionLabel="All branches"
              placeholder="Select one or more branches"
              searchPlaceholder="Search branches"
            />
          </Field>
        </div>
      </div>
    </FormSectionCard>
  );
}
