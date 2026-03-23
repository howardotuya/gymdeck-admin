"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { DeactivateBranchModal } from "@/components/branches/organisms/deactivateBranchModal";
import { DeactivatePlanModal } from "@/components/plans/organisms/deactivatePlanModal";
import { PlanEditorModal } from "@/components/plans/organisms/planEditorModal";
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
  const handleClose = () => {
    closeModal(activeModal.id);
  };

  return createPortal(
    <div className="fixed inset-0 z-[120]">
      {activeModal.type === "planEditor" ? (
        <PlanEditorModal key={activeModal.id} payload={activeModal.payload} onClose={handleClose} />
      ) : activeModal.type === "deactivatePlan" ? (
        <DeactivatePlanModal
          key={activeModal.id}
          payload={activeModal.payload}
          onClose={handleClose}
        />
      ) : activeModal.type === "deactivateBranch" ? (
        <DeactivateBranchModal
          key={activeModal.id}
          payload={activeModal.payload}
          onClose={handleClose}
        />
      ) : null}
    </div>,
    document.body,
  );
}
