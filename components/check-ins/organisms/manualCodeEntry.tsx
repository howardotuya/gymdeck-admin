import { Input } from "@/components/ui";

type ManualCodeEntryProps = {
  code: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
};

export function ManualCodeEntry({
  code,
  disabled = false,
  isSubmitting = false,
  onCodeChange,
  onSubmit,
}: ManualCodeEntryProps) {
  const normalizedCode = code.trim();

  return (
    <section className="rounded-[22px] border border-border-soft bg-bg-surface px-5 py-5">
      <div>
        <h3 className="text-[16px] font-semibold text-text-primary">Manual code entry</h3>
        <p className="mt-1 text-[14px] text-text-secondary">
          Use this when camera access is blocked or the QR label is damaged.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Check-in code</span>
          <Input
            type="text"
            value={code}
            onChange={(event) => onCodeChange(event.target.value.toUpperCase())}
            placeholder="Enter membership or booking code"
            className="h-12 rounded-[16px] bg-bg-muted"
          />
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isSubmitting || normalizedCode.length === 0}
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Validating..." : "Validate code"}
        </button>
      </div>
    </section>
  );
}
