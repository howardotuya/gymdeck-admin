"use client";

import { useState } from "react";
import { ExportIcon, MailIcon } from "@/components/icons";
import { Input } from "@/components/ui";
import { Modal } from "@/components/modals";
import { TableControlButton } from "../atoms/tableControlButton";

type CustomTableExportModalProps = {
  onClose: () => void;
  onExport: (payload: { type: string; email: string }) => void | Promise<void>;
  defaultEmail?: string;
  loading?: boolean;
};

const exportOptions = [
  {
    label: "CSV",
    value: "csv",
  },
];

export function CustomTableExportModal({
  defaultEmail = "",
  loading = false,
  onClose,
  onExport,
}: CustomTableExportModalProps) {
  const [selectedType, setSelectedType] = useState(exportOptions[0].value);
  const [email, setEmail] = useState(defaultEmail);

  return (
    <Modal title="Export" onClose={onClose} panelClassName="max-w-[640px]">
      <div className="space-y-6">
        <label className="block">
          <span className="mb-2 block text-[13px] font-medium text-text-primary">Email</span>
          <span className="relative block">
            <MailIcon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Optional"
              className="pl-11 pr-4"
            />
          </span>
        </label>

        <fieldset>
          <legend className="mb-3 text-[13px] font-medium text-text-primary">Format</legend>
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4 transition-colors hover:bg-bg-muted/50"
              >
                <input
                  type="radio"
                  name="custom-table-export-format"
                  value={option.value}
                  checked={selectedType === option.value}
                  onChange={() => setSelectedType(option.value)}
                  className="mt-1 size-4 border-border-soft text-brand-primary focus:ring-brand-primary/20"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-[14px] font-medium text-text-primary">
                    <ExportIcon size={16} />
                    {option.label}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-3">
          <TableControlButton onClick={onClose}>Cancel</TableControlButton>
          <TableControlButton
            variant="primary"
            disabled={loading}
            onClick={async () => {
              await onExport({
                type: selectedType,
                email: email.trim(),
              });
            }}
          >
            {loading ? "Exporting..." : "Export"}
          </TableControlButton>
        </div>
      </div>
    </Modal>
  );
}
