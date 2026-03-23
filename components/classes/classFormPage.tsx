"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { SetupStepper, SetupTopbar } from "@/components/ui";
import {
  CapacityBookingStep,
  ClassProfileStep,
  createClassFormState,
  type ClassFormState,
  ScheduleRecurrenceStep,
} from "./class-form-steps";
import { classes } from "./data";

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
] as const;

export function ClassFormPage() {
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
    createClassFormState(branchOptions, instructorOptions),
  );
  const [classProfileError, setClassProfileError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const stepParam = searchParams.get("step");
  const parsedStepParam = stepParam ? Number.parseInt(stepParam, 10) : 1;
  const activeStepNumber =
    Number.isFinite(parsedStepParam) && parsedStepParam > 0
      ? Math.min(parsedStepParam, classCreationSteps.length)
      : 1;
  const activeStepIndex = activeStepNumber - 1;
  const activeStep = classCreationSteps[activeStepIndex];
  const activeStepId = activeStep.id;
  const classLabel = formState.name.trim() || "New class";

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

    setFormState((currentState) => ({
      ...currentState,
      imageFile: file,
      imagePreviewUrl: nextPreviewUrl,
      imageName: file?.name ?? "",
    }));
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

    if (!formState.imageFile) {
      setClassProfileError("Upload one gym picture before creating this class.");
      goToStep(1, "replace");
      return;
    }

    setFeedbackMessage(
      `${classLabel} is ready for review with schedule and capacity configured.`,
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
    if (stepNumber <= 1 || formState.imageFile) {
      setClassProfileError(null);
      return true;
    }

    setClassProfileError("Upload one gym picture before continuing to the next step.");

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
    if (!formState.imagePreviewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(formState.imagePreviewUrl);
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

    router.push("/classes");
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
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          onBack={handleBack}
          cancelHref="/classes"
          backLabel={activeStepNumber === 1 ? "Back to classes" : "Back"}
          proceedLabel={
            activeStepNumber === classCreationSteps.length ? "Create class" : "Proceed"
          }
          onProceed={handleProceed}
        />

        <SetupStepper
          steps={classCreationSteps}
          activeStepId={activeStepId}
          onStepClick={handleStepClick}
          ariaLabel="Class creation steps"
        />
      </div>

      <div className="flex w-full flex-col gap-4">
        {feedbackMessage ? (
          <div className="rounded-[24px] border border-border-brand bg-bg-brand-soft/55 px-5 py-4">
            <p className="text-[14px] leading-[1.65] text-text-primary">{feedbackMessage}</p>
          </div>
        ) : null}

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
        </form>
      </div>
    </div>
  );
}
