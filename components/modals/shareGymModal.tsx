"use client";

import { FileCopyLineIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { ShareGymModalPayload } from "@/stores/useModalStore";

type ShareGymModalProps = {
  payload: ShareGymModalPayload;
  onClose: () => void;
};

type ShareActionId = "copy" | "email" | "messages" | "whatsapp" | "messenger" | "facebook";

type ShareOption = {
  id: ShareActionId;
  label: string;
};

const SHARE_OPTIONS: ShareOption[] = [
  { id: "copy", label: "Copy link" },
  { id: "email", label: "Email" },
  { id: "messages", label: "Messages" },
  { id: "whatsapp", label: "Whatsapp" },
  { id: "messenger", label: "Messenger" },
  { id: "facebook", label: "Facebook" },
];

function openExternalShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ShareGymModal({ onClose, payload }: ShareGymModalProps) {
  const shareText = `${payload.gymName} - ${payload.shareUrl}`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedShareUrl = encodeURIComponent(payload.shareUrl);

  const handleShareAction = async (actionId: ShareActionId) => {
    if (actionId === "copy") {
      try {
        await navigator.clipboard.writeText(payload.shareUrl);
      } catch {
        // No-op: clipboard access can fail on insecure contexts.
      }
      onClose();
      return;
    }

    if (actionId === "email") {
      window.open(
        `mailto:?subject=${encodeURIComponent(payload.gymName)}&body=${encodedShareText}`,
        "_self",
      );
      onClose();
      return;
    }

    if (actionId === "messages") {
      window.open(`sms:?&body=${encodedShareText}`, "_self");
      onClose();
      return;
    }

    if (actionId === "whatsapp") {
      openExternalShare(`https://wa.me/?text=${encodedShareText}`);
      onClose();
      return;
    }

    if (actionId === "messenger") {
      openExternalShare(`https://m.me/?text=${encodedShareText}`);
      onClose();
      return;
    }

    openExternalShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`);
    onClose();
  };

  return (
    <Modal title="Share this gym" onClose={onClose}>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {SHARE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              void handleShareAction(option.id);
            }}
            className="inline-flex items-center gap-2 rounded-[8px] bg-bg-muted px-4 py-3 text-left transition-colors hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
          >
            <FileCopyLineIcon className="size-6 text-text-support" />
            <span className="text-[14px] leading-[1.4] font-semibold text-text-support">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
