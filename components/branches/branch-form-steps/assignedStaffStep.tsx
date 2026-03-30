import { FormSectionCard, Input, Select, type SelectOption } from "@/components/ui";
import { staffRoleOptions, staffStatusOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  secondaryActionClassName,
  type BranchFormUpdateStaffMember,
} from "./shared";

type AssignedStaffStepProps = {
  formState: BranchFormState;
  onAddStaffMember: () => void;
  removeStaffMember: (memberId: string) => void;
  updateStaffMember: BranchFormUpdateStaffMember;
};

export function AssignedStaffStep({
  formState,
  onAddStaffMember,
  removeStaffMember,
  updateStaffMember,
}: AssignedStaffStepProps) {
  const staffRoleSelectOptions: SelectOption[] = staffRoleOptions.map((role) => ({
    value: role,
    label: role,
  }));
  const staffStatusSelectOptions: SelectOption[] = staffStatusOptions.map((status) => ({
    value: status,
    label: status,
  }));

  return (
    <FormSectionCard
      title="Assigned staff"
      description="Attach the lead contacts responsible for branch operations, shift coverage, and local escalation."
      action={
        <button
          type="button"
          onClick={onAddStaffMember}
          className={secondaryActionClassName}
        >
          Add staff member
        </button>
      }
    >
      {formState.staff.length ? (
        <div className="space-y-3">
          {formState.staff.map((member) => (
            <div
              key={member.id}
              className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field id={`${member.id}-name`} label="Name">
                  <Input
                    id={`${member.id}-name`}
                    value={member.name}
                    onChange={(event) =>
                      updateStaffMember(member.id, { name: event.target.value })
                    }
                    placeholder="Staff member name"
                  />
                </Field>

                <Field id={`${member.id}-role`} label="Role">
                  <Select
                    id={`${member.id}-role`}
                    options={staffRoleSelectOptions}
                    value={member.role}
                    onChange={(value) =>
                      updateStaffMember(member.id, { role: value as string })
                    }
                  />
                </Field>

                <Field id={`${member.id}-shift`} label="Shift or scope">
                  <Input
                    id={`${member.id}-shift`}
                    value={member.shift}
                    onChange={(event) =>
                      updateStaffMember(member.id, { shift: event.target.value })
                    }
                    placeholder="Morning peak coverage"
                  />
                </Field>

                <Field id={`${member.id}-status`} label="Assignment label">
                  <Select
                    id={`${member.id}-status`}
                    options={staffStatusSelectOptions}
                    value={member.status}
                    onChange={(value) =>
                      updateStaffMember(member.id, { status: value as string })
                    }
                  />
                </Field>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeStaffMember(member.id)}
                  className="text-[13px] font-semibold text-text-danger"
                >
                  Remove staff member
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-6">
          <p className="text-[14px] font-semibold text-text-primary">
            No staff leads added yet
          </p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            Add the branch manager, operations lead, or front desk contacts responsible for this
            location.
          </p>
        </div>
      )}
    </FormSectionCard>
  );
}
