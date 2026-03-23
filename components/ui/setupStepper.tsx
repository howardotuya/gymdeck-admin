import clsx from "clsx";

export type SetupStep = {
  id: string;
  label: string;
};

type SetupStepperProps = {
  steps: readonly SetupStep[];
  activeStepId: string;
  onStepClick: (stepId: string) => void;
  ariaLabel?: string;
};

export function SetupStepper({
  steps,
  activeStepId,
  onStepClick,
  ariaLabel = "Setup steps",
}: SetupStepperProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStepId);

  return (
    <section
      className={clsx(
        "-mx-4 border-b border-border-soft bg-bg-surface px-4 py-5 sm:-mx-6 sm:px-5 lg:-mx-5 lg:px-5",
        "sticky w-full",
      )}
    >
      <ol
        className="flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-0"
        aria-label={ariaLabel}
      >
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isComplete = index < activeIndex;
          const isLast = index === steps.length - 1;
          const isFirst = index === 0;
          const alignmentClass = isFirst
            ? "md:items-start md:text-left"
            : isLast
              ? "md:items-end md:text-right"
              : "md:items-start md:text-left";

          return (
            <li key={step.id} className={clsx("min-w-0", !isLast && "md:flex-1")}>
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                aria-current={isActive ? "step" : undefined}
                className={clsx(
                  "group flex min-w-0 flex-col gap-3 text-left",
                  isLast ? "w-auto" : "w-full",
                  alignmentClass,
                )}
              >
                <div className="flex w-full items-center gap-3">
                  <span
                    className={clsx(
                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[14px] font-semibold transition-colors",
                      isActive
                        ? "border-brand-primary bg-brand-primary text-text-inverse shadow-[var(--shadow-control)]"
                        : isComplete
                          ? "border-border-brand bg-bg-brand-soft text-text-brand"
                          : "border-border-soft bg-bg-surface text-text-subtle group-hover:border-border-strong group-hover:text-text-secondary",
                    )}
                  >
                    {index + 1}
                  </span>

                  {isLast ? null : (
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "hidden h-px flex-1 md:block",
                        isComplete ? "bg-brand-primary" : "bg-border-soft",
                      )}
                    />
                  )}
                </div>

                <span
                  className={clsx(
                    "min-w-0 text-[14px] font-medium leading-[1.45] text-balance transition-colors",
                    isActive
                      ? "text-text-primary"
                      : isComplete
                        ? "text-text-secondary"
                        : "text-text-subtle group-hover:text-text-support",
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
