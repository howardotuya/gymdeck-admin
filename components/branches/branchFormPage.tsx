"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { employees } from "@/components/staff-roles/data";
import { SetupStepper, SetupTopbar } from "@/components/ui";
import { createBranchFormState } from "./data";
import {
  BranchProfileSetupStep,
  ProgramsSetupStep,
  GallerySetupStep,
  PreviewStep,
  PublicProfileSetupStep,
  getBranchLabel,
  type BranchFormSetSelections,
  type BranchFormUpdateField,
  type BranchFormUpdateHour,
  type BranchFormUpdateSelection,
} from "./branch-form-steps";
import type { BranchDetail, BranchFormState } from "./types";

type BranchFormPageProps = {
  mode: "create" | "edit";
  branch?: BranchDetail;
};

const branchCreationSteps = [
  { id: "branch-profile", label: "Branch profile" },
  { id: "plans-and-classes", label: "Plans and classes" },
  { id: "gallery", label: "Gallery" },
  { id: "public-profile", label: "Public profile" },
  { id: "preview", label: "Preview" },
] as const;

export function BranchFormPage({ mode, branch }: BranchFormPageProps) {
  const isEditMode = mode === "edit";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState<BranchFormState>(() => createBranchFormState(branch));

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
  const detailHref = branch ? `/branches/${branch.id}` : "/branches";
  const managerOptions = employees
    .filter((employee) => employee.status !== "Deactivated")
    .map((employee) => ({
      value: employee.name,
      label: `${employee.name} · ${employee.role}`,
    }));

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

  const setSelections: BranchFormSetSelections = (key, selections) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: selections,
    }));
  };

  const addGalleryImage = (files: File[]) => {
    if (!files.length) {
      return;
    }

    const currentBranchName = formState.name.trim() || branch?.name || "Current branch";
    const currentBranchId = branch?.id ?? "current-branch";

    setFormState((currentState) => ({
      ...currentState,
      mediaLibrary: [
        ...currentState.mediaLibrary,
        ...files.map((file) => ({
          id: `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
          branchId: currentBranchId,
          branchName: currentBranchName,
        })),
      ],
    }));

    toast.success(
      `${files.length} media asset${files.length === 1 ? "" : "s"} uploaded to the library.`,
    );
  };

  const toggleGalleryImageSelection = (imageId: string) => {
    setFormState((currentState) => ({
      ...currentState,
      gallery: currentState.gallery.includes(imageId)
        ? currentState.gallery.filter((item) => item !== imageId)
        : [...currentState.gallery, imageId],
    }));
  };

  const reorderGallerySelection = (nextGalleryOrder: string[]) => {
    setFormState((currentState) => ({
      ...currentState,
      gallery: nextGalleryOrder,
    }));
  };

  const toggleAmenity = (amenityLabel: string) => {
    setFormState((currentState) => ({
      ...currentState,
      publicAmenities: currentState.publicAmenities.includes(amenityLabel)
        ? currentState.publicAmenities.filter((item) => item !== amenityLabel)
        : [...currentState.publicAmenities, amenityLabel],
    }));
  };

  const addCustomAmenity = (amenityLabel: string) => {
    setFormState((currentState) => {
      if (currentState.publicAmenities.includes(amenityLabel)) {
        return currentState;
      }

      return {
        ...currentState,
        publicAmenities: [...currentState.publicAmenities, amenityLabel],
      };
    });
  };

  const addPublicRule = (seed?: Partial<BranchFormState["publicRules"][number]>) => {
    setFormState((currentState) => {
      const firstBlankRule = currentState.publicRules.find(
        (rule) => !rule.title.trim() && !(rule.details ?? "").trim(),
      );

      if (seed && firstBlankRule) {
        return {
          ...currentState,
          publicRules: currentState.publicRules.map((rule) =>
            rule.id === firstBlankRule.id ? { ...rule, ...seed } : rule,
          ),
        };
      }

      return {
        ...currentState,
        publicRules: [
          ...currentState.publicRules,
          {
            id: `public-rule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: seed?.title ?? "",
            details: seed?.details ?? "",
            expanded: seed?.expanded ?? false,
          },
        ],
      };
    });
  };

  const updatePublicRule = (ruleId: string, patch: Partial<BranchFormState["publicRules"][number]>) => {
    setFormState((currentState) => ({
      ...currentState,
      publicRules: currentState.publicRules.map((rule) =>
        rule.id === ruleId ? { ...rule, ...patch } : rule,
      ),
    }));
  };

  const removePublicRule = (ruleId: string) => {
    setFormState((currentState) => ({
      ...currentState,
      publicRules: currentState.publicRules.filter((rule) => rule.id !== ruleId),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(
      isEditMode
        ? `${branchLabel} has been updated with the reviewed branch setup.`
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
    if (!stepParam || parsedStepParam !== activeStepNumber) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", String(activeStepNumber));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [
    activeStepNumber,
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

  const handleBack = () => {
    if (activeStepNumber > 1) {
      goToStep(activeStepNumber - 1);
      return;
    }

    router.push(isEditMode ? detailHref : "/branches");
  };

  const handleProceed = () => {
    const nextStep = branchCreationSteps[activeStepIndex + 1];

    if (nextStep) {
      goToStep(activeStepIndex + 2);
      return;
    }

    const formElement = document.getElementById("branch-form") as HTMLFormElement | null;
    formElement?.requestSubmit();
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          onBack={handleBack}
          cancelHref={isEditMode ? detailHref : "/branches"}
          backLabel={
            activeStepNumber === 1 ? (isEditMode ? "Back to branch" : "Back to branches") : "Back"
          }
          proceedLabel={
            activeStepNumber === branchCreationSteps.length
              ? isEditMode
                ? "Save changes"
                : "Create branch"
              : "Proceed"
          }
          onProceed={handleProceed}
        />

        <SetupStepper
          steps={branchCreationSteps}
          activeStepId={activeStepId}
          onStepClick={handleStepClick}
          ariaLabel={isEditMode ? "Branch edit steps" : "Branch creation steps"}
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <form id="branch-form" onSubmit={handleSubmit}>
          {activeStepId === "branch-profile" ? (
            <BranchProfileSetupStep
              formState={formState}
              managerOptions={managerOptions}
              updateField={updateField}
              updateHour={updateHour}
            />
          ) : null}

          {activeStepId === "plans-and-classes" ? (
            <ProgramsSetupStep
              formState={formState}
              setSelections={setSelections}
              toggleSelection={toggleSelection}
            />
          ) : null}

          {activeStepId === "gallery" ? (
            <GallerySetupStep
              formState={formState}
              onAddGalleryImage={addGalleryImage}
              onToggleGalleryImageSelection={toggleGalleryImageSelection}
            />
          ) : null}

          {activeStepId === "public-profile" ? (
            <PublicProfileSetupStep
              formState={formState}
              updateField={updateField}
              addRule={addPublicRule}
              addCustomAmenity={addCustomAmenity}
              removeRule={removePublicRule}
              toggleAmenity={toggleAmenity}
              updateRule={updatePublicRule}
            />
          ) : null}

          {activeStepId === "preview" ? (
            <PreviewStep
              formState={formState}
              mode={mode}
              onReorderGallery={reorderGallerySelection}
            />
          ) : null}
        </form>
      </div>
    </div>
  );
}
