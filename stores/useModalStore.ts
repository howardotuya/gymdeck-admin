"use client";

import { create } from "zustand";
import type { PlanCardItem, PlanEditorValues } from "@/components/plans/data";

export type ShareGymModalPayload = {
  gymName: string;
  shareUrl: string;
};

export type LeaveReviewModalPayload = {
  gymName: string;
};

export type PlanReviewDetails = {
  included: string;
  cancellationPolicy: string;
  refundTerms: string;
  validityPeriod: string;
};

export type PlanConfirmationModalPayload = {
  gymName: string;
  planName: string;
  planPriceLabel: string;
  reviewDetails: PlanReviewDetails;
};

export type BookingPassModalPayload = {
  bookingId: string;
  gymName: string;
};

export type GymAccessRequiredModalPayload = Record<string, never>;

export type ClassBookingConfirmedModalPayload = {
  classTitle: string;
  schedule: string;
  location: string;
  about: string;
  pricePerSeatLabel: string;
};

export type JoinClassModalPayload = {
  sessionId: string;
  classTitle: string;
  schedule: string;
  location: string;
  about: string;
  pricePerSeatLabel: string;
  reservationDate: string;
  reservationTime: string;
  bookingType: string;
  confirmAmountLabel: string;
  cancellationPolicyBlurb: string;
};

export type RenewMembershipModalPayload = {
  membershipTitle: string;
  gymName: string;
  renewalPriceLabel: string;
  renewalPriceSuffix: string;
  currentExpiry: string;
  newExpiry: string;
  imageSrc: string;
};

export type ManageMembershipModalPayload = {
  membershipId: string;
  gymName: string;
  facilityName: string;
  imageSrc: string;
  distanceLabel: string;
  ratingLabel: string;
  scheduleLabel: string;
  addressLabel: string;
  directionsUrl: string;
  phoneLabel: string;
  phoneNumber: string;
  cancellationPolicy: string;
};

export type CancelMembershipModalPayload = {
  gymName: string;
};

export type PlanEditorModalPayload = {
  mode: "create" | "edit";
  plan?: PlanCardItem | null;
  onSubmit: (values: PlanEditorValues) => void;
};

export type DeactivatePlanModalPayload = {
  plan?: PlanCardItem | null;
  onConfirm: () => void;
};

export type DeactivateBranchModalPayload = {
  branchName: string;
  onConfirm: () => void;
};

export type ModalPayloadMap = {
  shareGym: ShareGymModalPayload;
  leaveReview: LeaveReviewModalPayload;
  planConfirmation: PlanConfirmationModalPayload;
  bookingPass: BookingPassModalPayload;
  gymAccessRequired: GymAccessRequiredModalPayload;
  classBookingConfirmed: ClassBookingConfirmedModalPayload;
  joinClass: JoinClassModalPayload;
  renewMembership: RenewMembershipModalPayload;
  manageMembership: ManageMembershipModalPayload;
  cancelMembership: CancelMembershipModalPayload;
  planEditor: PlanEditorModalPayload;
  deactivatePlan: DeactivatePlanModalPayload;
  deactivateBranch: DeactivateBranchModalPayload;
};

export type ModalType = keyof ModalPayloadMap;

type ModalInstanceMap = {
  [T in ModalType]: {
    id: string;
    type: T;
    payload: ModalPayloadMap[T];
  };
};

export type ModalInstance = ModalInstanceMap[ModalType];

type ModalStore = {
  stack: ModalInstance[];
  openModal: <T extends ModalType>(type: T, payload: ModalPayloadMap[T]) => string;
  closeModal: (id?: string) => void;
  closeAll: () => void;
};

function createModalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `modal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useModalStore = create<ModalStore>((set) => ({
  stack: [],
  openModal: (type, payload) => {
    const id = createModalId();
    const nextModal = { id, type, payload } as ModalInstance;

    set((state) => ({
      stack: [...state.stack, nextModal],
    }));

    return id;
  },
  closeModal: (id) => {
    set((state) => {
      if (!id) {
        return { stack: state.stack.slice(0, -1) };
      }

      return { stack: state.stack.filter((modal) => modal.id !== id) };
    });
  },
  closeAll: () => set({ stack: [] }),
}));
