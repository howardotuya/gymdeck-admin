"use client";

import Image from "next/image";
import clsx from "clsx";
import { useId, useMemo, useState } from "react";
import { GalleryIcon } from "@/components/icons";
import { Select } from "@/components/ui";
import type { BranchFormState } from "../types";

type GallerySetupStepProps = {
  formState: BranchFormState;
  onAddGalleryImage: (files: File[]) => void;
  onToggleGalleryImageSelection: (imageId: string) => void;
};

export function GallerySetupStep({
  formState,
  onAddGalleryImage,
  onToggleGalleryImageSelection,
}: GallerySetupStepProps) {
  const inputId = useId();
  const [branchFilter, setBranchFilter] = useState("all");

  const branchOptions = useMemo(() => {
    const seen = new Set<string>();

    return formState.mediaLibrary.filter((item) => {
      if (seen.has(item.branchId)) {
        return false;
      }

      seen.add(item.branchId);
      return true;
    });
  }, [formState.mediaLibrary]);

  const filteredMedia = useMemo(() => {
    if (branchFilter === "all") {
      return formState.mediaLibrary;
    }

    return formState.mediaLibrary.filter((item) => item.branchId === branchFilter);
  }, [branchFilter, formState.mediaLibrary]);

  return (
    <>
      <input
        id={inputId}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);

          if (!files.length) {
            return;
          }

          onAddGalleryImage(files);
          event.target.value = "";
        }}
      />

      <div className="rounded-[24px] border border-border-soft bg-bg-surface">
        <div className="flex flex-col gap-3 border-b border-border-soft px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-semibold text-text-primary">Media library</p>
            <p className="text-[13px] text-text-secondary">
              All uploaded business media. Filter by branch, then select what belongs in this
              gallery.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              id="branch-gallery-filter"
              options={[
                { value: "all", label: "All branches" },
                ...branchOptions.map((option) => ({
                  value: option.branchId,
                  label: option.branchName,
                })),
              ]}
              value={branchFilter}
              onChange={(value) => setBranchFilter(value as string)}
              className="min-w-[180px]"
            />

            <label
              htmlFor={inputId}
              className="inline-flex h-11 min-w-[144px] items-center justify-center whitespace-nowrap rounded-xl border border-border-soft bg-bg-surface px-4 text-[14px] font-semibold text-text-primary transition-colors hover:bg-bg-muted"
            >
              Upload assets
            </label>
          </div>
        </div>

        <div className="px-5 py-4">
          {filteredMedia.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredMedia.map((image) => {
                const isSelected = formState.gallery.includes(image.id);

                return (
                  <article
                    key={image.id}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => onToggleGalleryImageSelection(image.id)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") {
                        return;
                      }

                      event.preventDefault();
                      onToggleGalleryImageSelection(image.id);
                    }}
                    className={clsx(
                      "cursor-pointer overflow-hidden rounded-[18px] border bg-bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-border-brand focus:ring-offset-2 focus:ring-offset-bg-surface",
                      isSelected ? "border-border-strong" : "border-border-soft",
                    )}
                  >
                    <div className="relative aspect-[4/3] bg-bg-subtle">
                      <Image
                        src={image.previewUrl}
                        alt={image.fileName}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />

                      <label
                        onClick={(event) => event.stopPropagation()}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border-soft bg-bg-surface/90 shadow-sm backdrop-blur-sm"
                        aria-label={`${isSelected ? "Remove" : "Add"} ${image.fileName} ${isSelected ? "from" : "to"} gallery`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => onToggleGalleryImageSelection(image.id)}
                          className="h-4 w-4 accent-brand-primary"
                        />
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-dashed border-border-soft bg-bg-muted px-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-subtle text-text-secondary">
                <GalleryIcon size={28} />
              </span>
              <p className="mt-5 text-[18px] font-semibold text-text-primary">
                No media for this filter
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
