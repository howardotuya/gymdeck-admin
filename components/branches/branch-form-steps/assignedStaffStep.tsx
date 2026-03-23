import { FormSectionCard } from "@/components/ui";
import { staffRoleOptions, staffStatusOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  Field,
  inputClassName,
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
                  <input
                    id={`${member.id}-name`}
                    value={member.name}
                    onChange={(event) =>
                      updateStaffMember(member.id, { name: event.target.value })
                    }
                    className={inputClassName}
                    placeholder="Staff member name"
                  />
                </Field>

                <Field id={`${member.id}-role`} label="Role">
                  <select
                    id={`${member.id}-role`}
                    value={member.role}
                    onChange={(event) =>
                      updateStaffMember(member.id, { role: event.target.value })
                    }
                    className={inputClassName}
                  >
                    {staffRoleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id={`${member.id}-shift`} label="Shift or scope">
                  <input
                    id={`${member.id}-shift`}
                    value={member.shift}
                    onChange={(event) =>
                      updateStaffMember(member.id, { shift: event.target.value })
                    }
                    className={inputClassName}
                    placeholder="Morning peak coverage"
                  />
                </Field>

                <Field id={`${member.id}-status`} label="Assignment label">
                  <select
                    id={`${member.id}-status`}
                    value={member.status}
                    onChange={(event) =>
                      updateStaffMember(member.id, { status: event.target.value })
                    }
                    className={inputClassName}
                  >
                    {staffStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
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
