"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { StarFillIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { LeaveReviewModalPayload } from "@/stores/useModalStore";

const FEEDBACK_TAGS = ["Great atmosphere", "Gym time", "Fair Pricing", "Good equipment"];

type LeaveReviewModalProps = {
  payload: LeaveReviewModalPayload;
  onClose: () => void;
};

type RadioGroupStarRatingProps = {
  value: number;
  onChange: (nextValue: number) => void;
  max?: number;
};

function RadioGroupStarRating({ max = 5, onChange, value }: RadioGroupStarRatingProps) {
  const groupName = useId();

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">Rate your experience from 1 to 5 stars</legend>
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Star rating">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const inputId = `${groupName}-${starValue}`;
          const isActive = starValue <= value;

          return (
            <div key={starValue}>
              <input
                id={inputId}
                name={groupName}
                type="radio"
                value={starValue}
                checked={value === starValue}
                onChange={() => {
                  onChange(starValue);
                }}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className="inline-flex cursor-pointer rounded-[8px] p-0.5 transition-transform hover:scale-[1.03] focus-within:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-text-brand/35"
                aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
              >
                <StarFillIcon
                  size={48}
                  color={isActive ? "#FDB022" : "#EAECF0"}
                  className="size-12"
                  aria-hidden="true"
                />
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function LeaveReviewModal({ onClose, payload }: LeaveReviewModalProps) {
  const [rating, setRating] = useState(4);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag],
    );
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Modal
      title={`How was ${payload.gymName}?`}
      onClose={onClose}
      panelClassName="max-w-[505px]"
      bodyClassName="mt-6 space-y-10"
    >
      <div className="space-y-6">
        <p className="text-[16px] leading-[1.5] text-text-support">
          Your feedback will be shared with the gym.
        </p>
        <RadioGroupStarRating value={rating} onChange={setRating} />
      </div>

      <div className="space-y-3">
        <p className="text-[16px] leading-[1.5] font-semibold text-text-support">
          What made your time here worth it?{" "}
          <span className="font-normal text-text-support">(Optional)</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {FEEDBACK_TAGS.map((tag) => {
            const isActive = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  toggleTag(tag);
                }}
                className={clsx(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] leading-[1.5] transition-colors",
                  isActive
                    ? "bg-text-brand text-text-inverse"
                    : "bg-[#f2f4f7] text-text-support hover:bg-[#eaecf0]",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="leave-review-feedback"
          className="block text-[16px] leading-[1.5] font-semibold text-text-support"
        >
          Leave additional feedback <span className="font-normal">(Optional)</span>
        </label>
        <textarea
          id="leave-review-feedback"
          value={feedback}
          onChange={(event) => {
            setFeedback(event.target.value);
          }}
          placeholder="Enter text..."
          className="h-[132px] w-full resize-none rounded-[12px] bg-bg-muted px-4 py-3 text-[14px] leading-[1.4] text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
      >
        Submit
      </button>
    </Modal>
  );
}
