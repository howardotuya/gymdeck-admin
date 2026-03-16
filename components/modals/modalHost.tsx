"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BookingPassModal } from "@/components/modals/bookingPassModal";
import { GymAccessRequiredModal } from "@/components/modals/gymAccessRequiredModal";
import { JoinClassModal } from "@/components/modals/joinClassModal";
import { LeaveReviewModal } from "@/components/modals/leaveReviewModal";
import { PlanConfirmationModal } from "@/components/modals/planConfirmationModal";
import { ShareGymModal } from "@/components/modals/shareGymModal";
import { useModalStore } from "@/stores/useModalStore";

export function ModalHost() {
  const stack = useModalStore((state) => state.stack);
  const closeModal = useModalStore((state) => state.closeModal);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (stack.length > 0) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stack.length]);

  if (typeof window === "undefined" || stack.length === 0) {
    return null;
  }

  const activeModal = stack[stack.length - 1];

  return createPortal(
    <div className="fixed inset-0 z-[120]">
      {activeModal.type === "shareGym" ? (
        <ShareGymModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : activeModal.type === "leaveReview" ? (
        <LeaveReviewModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : activeModal.type === "planConfirmation" ? (
        <PlanConfirmationModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : activeModal.type === "bookingPass" ? (
        <BookingPassModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : activeModal.type === "gymAccessRequired" ? (
        <GymAccessRequiredModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : activeModal.type === "joinClass" ? (
        <JoinClassModal
          payload={activeModal.payload}
          onClose={() => {
            closeModal(activeModal.id);
          }}
        />
      ) : null}
    </div>,
    document.body,
  );
}
