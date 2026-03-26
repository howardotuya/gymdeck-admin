"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  PageHeader,
  SetupStepper,
  SetupTopbar,
} from "@/components/ui";
import { useModalStore } from "@/stores/useModalStore";
import { createBranchFormState } from "./data";
import {
  AssignedStaffStep,
  BranchProfileStep,
  BranchReadinessPanel,
  BranchSelectionPanel,
  BranchSummaryPanel,
  ClassesAvailableStep,
  createStaffId,
  getBranchLabel,
  OpeningHoursStep,
  PlansAvailableStep,
  PreviewStep,
  type BranchFormUpdateField,
  type BranchFormUpdateHour,
  type BranchFormUpdateStaffMember,
  type BranchFormUpdateSelection,
  dangerActionClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps";
import type { BranchDetail, BranchEditableStaffMember, BranchFormState } from "./types";

type BranchFormPageProps = {
  mode: "create" | "edit";
  branch?: BranchDetail;
};

const branchCreationSteps = [
  { id: "branch-profile", label: "Branch profile" },
  { id: "opening-hours", label: "Opening hours" },
  { id: "assigned-staff", label: "Assigned staff" },
  { id: "plans-available", label: "Plans available" },
  { id: "classes-available", label: "Classes available" },
  { id: "preview", label: "Preview" },
] as const;

function EditBranchForm({
  branch,
  formState,
  handleSubmit,
  onAddStaffMember,
  onDeactivateBranch,
  removeStaffMember,
  updateField,
  updateHour,
  updateStaffMember,
  toggleSelection,
}: {
  branch?: BranchDetail;
  formState: BranchFormState;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAddStaffMember: () => void;
  onDeactivateBranch: () => void;
  removeStaffMember: (memberId: string) => void;
  updateField: BranchFormUpdateField;
  updateHour: BranchFormUpdateHour;
  updateStaffMember: BranchFormUpdateStaffMember;
  toggleSelection: BranchFormUpdateSelection;
}) {
  const branchLabel = getBranchLabel(formState, branch, true);

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        eyebrow="Edit branch"
        title={`Edit ${branchLabel}`}
        description="Use a full-page workflow for operational edits so managers can review profile details, staff ownership, and branch setup without losing context."
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          {
            label: branch?.name ?? "Branch",
            href: branch ? `/branches/${branch.id}` : "/branches",
          },
          { label: "Edit" },
        ]}
        action={
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Link
              href={branch ? `/branches/${branch.id}` : "/branches"}
              className={secondaryActionClassName}
            >
              View branch
            </Link>
            <button
              type="button"
              onClick={onDeactivateBranch}
              disabled={formState.status === "Inactive"}
              className={dangerActionClassName}
            >
              {formState.status === "Inactive" ? "Branch inactive" : "Deactivate branch"}
            </button>
            <button form="branch-form" type="submit" className={primaryActionClassName}>
              Save changes
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
          <BranchProfileStep formState={formState} updateField={updateField} />
          <OpeningHoursStep formState={formState} updateHour={updateHour} />
          <AssignedStaffStep
            formState={formState}
            onAddStaffMember={onAddStaffMember}
            removeStaffMember={removeStaffMember}
            updateStaffMember={updateStaffMember}
          />
          <PlansAvailableStep formState={formState} toggleSelection={toggleSelection} />
          <ClassesAvailableStep formState={formState} toggleSelection={toggleSelection} />
        </form>

        <div className="space-y-4">
          <BranchSummaryPanel formState={formState} />
          <BranchReadinessPanel branch={branch} isEditMode />
          <BranchSelectionPanel formState={formState} />
        </div>
      </div>
    </div>
  );
}

export function BranchFormPage({ mode, branch }: BranchFormPageProps) {
  const isEditMode = mode === "edit";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<BranchFormState>(() => createBranchFormState(branch));
  const openModal = useModalStore((state) => state.openModal);

  const stepParam = searchParams.get("step");
  const parsedStepParam = stepParam ? Number.parseInt(stepParam, 10) : 1;
  const activeStepNumber =
    Number.isFinite(parsedStepParam) && parsedStepParam > 0
      ? Math.min(parsedStepParam, branchCreationSteps.length)
      : 1;
  const activeStepIndex = activeStepNumber - 1;
  const activeStep = branchCreationSteps[activeStepIndex];
  const activeStepId = activeStep.id;
  const branchLabel = getBranchLabel(formState, branch, isEditMode);

  const updateField: BranchFormUpdateField = (key, value) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const updateHour: BranchFormUpdateHour = (hourId, patch) => {
    setFormState((currentState) => ({
      ...currentState,
      openingHours: currentState.openingHours.map((item) =>
        item.id === hourId ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addStaffMember = () => {
    const nextStaffMember: BranchEditableStaffMember = {
      id: createStaffId(),
      name: "",
      role: "Branch Manager",
      shift: "",
      status: "Primary owner",
    };

    setFormState((currentState) => ({
      ...currentState,
      staff: [...currentState.staff, nextStaffMember],
    }));
  };

  const updateStaffMember: BranchFormUpdateStaffMember = (memberId, patch) => {
    setFormState((currentState) => ({
      ...currentState,
      staff: currentState.staff.map((member) =>
        member.id === memberId ? { ...member, ...patch } : member,
      ),
    }));
  };

  const removeStaffMember = (memberId: string) => {
    setFormState((currentState) => ({
      ...currentState,
      staff: currentState.staff.filter((member) => member.id !== memberId),
    }));
  };

  const toggleSelection: BranchFormUpdateSelection = (key, name) => {
    setFormState((currentState) => {
      const selections = currentState[key];
      const nextSelections = selections.includes(name)
        ? selections.filter((item) => item !== name)
        : [...selections, name];

      return {
        ...currentState,
        [key]: nextSelections,
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(
      isEditMode
        ? `${branchLabel} changes are staged for review.`
        : `${branchLabel} is ready for review before activation.`,
    );
  };

  const buildStepUrl = (stepNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(stepNumber));
    return `${pathname}?${params.toString()}`;
  };

  const goToStep = (stepNumber: number, history: "push" | "replace" = "push") => {
    const nextStepNumber = Math.min(Math.max(stepNumber, 1), branchCreationSteps.length);
    const nextUrl = buildStepUrl(nextStepNumber);

    if (history === "replace") {
      router.replace(nextUrl, { scroll: false });
      return;
    }

    router.push(nextUrl, { scroll: false });
  };

  useEffect(() => {
    if (
      isEditMode ||
      (stepParam && parsedStepParam === activeStepNumber)
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(activeStepNumber));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    activeStepNumber,
    isEditMode,
    parsedStepParam,
    pathname,
    router,
    searchParams,
    stepParam,
  ]);

  const handleStepClick = (stepId: string) => {
    const stepIndex = branchCreationSteps.findIndex((step) => step.id === stepId);

    if (stepIndex === -1) {
      return;
    }

    goToStep(stepIndex + 1);
  };

  const handleCreateBack = () => {
    if (activeStepNumber > 1) {
      goToStep(activeStepNumber - 1);
      return;
    }

    router.push("/branches");
  };

  const handleCreateProceed = () => {
    const nextStep = branchCreationSteps[activeStepIndex + 1];

    if (nextStep) {
      goToStep(activeStepIndex + 2);
      return;
    }

    const formElement = document.getElementById("branch-form") as HTMLFormElement | null;
    formElement?.requestSubmit();
  };

  const handleDeactivateBranch = () => {
    openModal("deactivateBranch", {
      branchName: branchLabel,
      onConfirm: () => {
        updateField("status", "Inactive");
        toast.success(`${branchLabel} has been moved out of active operations.`);
      },
    });
  };

  if (isEditMode) {
    return (
      <EditBranchForm
        branch={branch}
        formState={formState}
        handleSubmit={handleSubmit}
        onAddStaffMember={addStaffMember}
        onDeactivateBranch={handleDeactivateBranch}
        removeStaffMember={removeStaffMember}
        updateField={updateField}
        updateHour={updateHour}
        updateStaffMember={updateStaffMember}
        toggleSelection={toggleSelection}
      />
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          onBack={handleCreateBack}
          cancelHref="/branches"
          backLabel={activeStepNumber === 1 ? "Back to branches" : "Back"}
          proceedLabel={
            activeStepNumber === branchCreationSteps.length ? "Create branch" : "Proceed"
          }
          onProceed={handleCreateProceed}
        />

        <SetupStepper
          steps={branchCreationSteps}
          activeStepId={activeStepId}
          onStepClick={handleStepClick}
          ariaLabel="Branch creation steps"
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <form id="branch-form" onSubmit={handleSubmit}>
          {activeStepId === "branch-profile" ? (
            <BranchProfileStep formState={formState} updateField={updateField} />
          ) : null}

          {activeStepId === "opening-hours" ? (
            <OpeningHoursStep formState={formState} updateHour={updateHour} />
          ) : null}

          {activeStepId === "assigned-staff" ? (
            <AssignedStaffStep
              formState={formState}
              onAddStaffMember={addStaffMember}
              removeStaffMember={removeStaffMember}
              updateStaffMember={updateStaffMember}
            />
          ) : null}

          {activeStepId === "plans-available" ? (
            <PlansAvailableStep formState={formState} toggleSelection={toggleSelection} />
          ) : null}

          {activeStepId === "classes-available" ? (
            <ClassesAvailableStep formState={formState} toggleSelection={toggleSelection} />
          ) : null}

          {activeStepId === "preview" ? <PreviewStep formState={formState} /> : null}
        </form>
      </div>
    </div>
  );
}
