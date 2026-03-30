"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SetupStepper, SetupTopbar } from "@/components/ui";
import {
  CapacityBookingStep,
  ClassProfileStep,
  createClassFormState,
  type ClassFormState,
  ScheduleRecurrenceStep,
  SummaryStep,
} from "./class-form-steps";
import { classes, type ClassRecord } from "./data";

const classCreationSteps = [
  {
    id: "class-profile",
    label: "Class profile",
  },
  {
    id: "schedule-recurrence",
    label: "Schedule",
  },
  {
    id: "capacity-booking",
    label: "Capacity",
  },
  {
    id: "summary",
    label: "Summary",
  },
] as const;

type ClassFormPageProps = {
  mode?: "create" | "edit";
  classItem?: ClassRecord;
};

function isBlobUrl(url: string) {
  return url.startsWith("blob:");
}

function revokeBlobPreviewUrl(url: string) {
  if (isBlobUrl(url)) {
    URL.revokeObjectURL(url);
  }
}

export function ClassFormPage({
  mode = "create",
  classItem,
}: ClassFormPageProps) {
  const isEditMode = mode === "edit";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const branchOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.branch))),
    [],
  );
  const instructorOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.instructor))),
    [],
  );
  const [formState, setFormState] = useState<ClassFormState>(() =>
    createClassFormState(branchOptions, instructorOptions, classItem),
  );
  const [classProfileError, setClassProfileError] = useState<string | null>(null);

  const stepParam = searchParams.get("step");
  const parsedStepParam = stepParam ? Number.parseInt(stepParam, 10) : 1;
  const activeStepNumber =
    Number.isFinite(parsedStepParam) && parsedStepParam > 0
      ? Math.min(parsedStepParam, classCreationSteps.length)
      : 1;
  const activeStepIndex = activeStepNumber - 1;
  const activeStep = classCreationSteps[activeStepIndex];
  const activeStepId = activeStep.id;
  const detailHref = classItem ? `/classes/${classItem.id}` : "/classes";
  const classLabel =
    formState.name.trim() || (isEditMode ? classItem?.name ?? "Class" : "New class");
  const hasClassImage = Boolean(formState.imagePreviewUrl);

  const updateField = <TKey extends keyof ClassFormState>(
    key: TKey,
    value: ClassFormState[TKey],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const updateImage = (file: File | null) => {
    const nextPreviewUrl = file ? URL.createObjectURL(file) : "";

    setFormState((currentState) => {
      revokeBlobPreviewUrl(currentState.imagePreviewUrl);

      return {
        ...currentState,
        imageFile: file,
        imagePreviewUrl: nextPreviewUrl,
        imageName: file?.name ?? "",
      };
    });
    setClassProfileError(null);
  };

  const toggleDay = (day: string) => {
    setFormState((currentState) => ({
      ...currentState,
      selectedDays: currentState.selectedDays.includes(day)
        ? currentState.selectedDays.filter((item) => item !== day)
        : [...currentState.selectedDays, day],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasClassImage) {
      setClassProfileError(
        isEditMode
          ? "Upload one gym picture before saving changes to this class."
          : "Upload one gym picture before creating this class.",
      );
      goToStep(1, "replace");
      return;
    }

    toast.success(
      isEditMode
        ? `${classLabel} has been updated with the reviewed schedule and capacity settings.`
        : `${classLabel} has been created with the reviewed schedule and capacity settings.`,
    );
  };

  const buildStepUrl = (stepNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(stepNumber));
    return `${pathname}?${params.toString()}`;
  };

  const goToStep = (stepNumber: number, history: "push" | "replace" = "push") => {
    const nextStepNumber = Math.min(Math.max(stepNumber, 1), classCreationSteps.length);
    const nextUrl = buildStepUrl(nextStepNumber);

    if (history === "replace") {
      router.replace(nextUrl, { scroll: false });
      return;
    }

    router.push(nextUrl, { scroll: false });
  };

  const canAccessStep = (stepNumber: number) => {
    if (stepNumber <= 1 || hasClassImage) {
      setClassProfileError(null);
      return true;
    }

    setClassProfileError(
      isEditMode
        ? "Upload one gym picture before continuing through the edit flow."
        : "Upload one gym picture before continuing to the next step.",
    );

    if (activeStepId !== "class-profile") {
      goToStep(1, "replace");
    }

    return false;
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

  useEffect(() => {
    return () => {
      revokeBlobPreviewUrl(formState.imagePreviewUrl);
    };
  }, [formState.imagePreviewUrl]);

  const handleStepClick = (stepId: string) => {
    const stepIndex = classCreationSteps.findIndex((step) => step.id === stepId);

    if (stepIndex === -1) {
      return;
    }

    if (!canAccessStep(stepIndex + 1)) {
      return;
    }

    goToStep(stepIndex + 1);
  };

  const handleBack = () => {
    if (activeStepNumber > 1) {
      goToStep(activeStepNumber - 1);
      return;
    }

    router.push(isEditMode ? detailHref : "/classes");
  };

  const handleProceed = () => {
    const nextStep = classCreationSteps[activeStepIndex + 1];

    if (nextStep) {
      if (!canAccessStep(activeStepIndex + 2)) {
        return;
      }

      goToStep(activeStepIndex + 2);
      return;
    }

    if (!canAccessStep(activeStepNumber)) {
      return;
    }

    const formElement = document.getElementById("class-form") as HTMLFormElement | null;
    formElement?.requestSubmit();
  };

  return (
    <div className="space-y-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] lg:space-y-8 lg:pb-0">
      <div className="w-full">
        <SetupTopbar
          onBack={handleBack}
          cancelHref={isEditMode ? detailHref : "/classes"}
          backLabel={
            activeStepNumber === 1 ? (isEditMode ? "Back to class" : "Back to classes") : "Back"
          }
          mobileTitle={activeStep.label}
          mobileMeta={`${activeStepNumber}/${classCreationSteps.length}`}
          mobileProgressCurrent={activeStepNumber}
          mobileProgressTotal={classCreationSteps.length}
          proceedLabel={
            activeStepNumber === classCreationSteps.length
              ? isEditMode
                ? "Save changes"
                : "Create class"
              : "Proceed"
          }
          onProceed={handleProceed}
        />

        <SetupStepper
          steps={classCreationSteps}
          activeStepId={activeStepId}
          onStepClick={handleStepClick}
          ariaLabel={isEditMode ? "Class edit steps" : "Class creation steps"}
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        <form id="class-form" onSubmit={handleSubmit}>
          {activeStepId === "class-profile" ? (
            <ClassProfileStep
              branchOptions={branchOptions}
              formState={formState}
              imageError={classProfileError}
              instructorOptions={instructorOptions}
              onImageChange={(file) => updateImage(file)}
              onImageRemove={() => updateImage(null)}
              updateField={updateField}
            />
          ) : null}

          {activeStepId === "schedule-recurrence" ? (
            <ScheduleRecurrenceStep
              formState={formState}
              toggleDay={toggleDay}
              updateField={updateField}
            />
          ) : null}

          {activeStepId === "capacity-booking" ? (
            <CapacityBookingStep formState={formState} updateField={updateField} />
          ) : null}

          {activeStepId === "summary" ? (
            <SummaryStep formState={formState} mode={mode} />
          ) : null}
        </form>
      </div>
    </div>
  );
}
