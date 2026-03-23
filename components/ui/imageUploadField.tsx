"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { CloseIcon, GalleryIcon } from "@/components/icons";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  fileName?: string;
  previewUrl?: string;
  required?: boolean;
  previewHeight?: number;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploadField({
  id,
  label,
  hint,
  error,
  fileName,
  previewUrl,
  required = false,
  previewHeight = 240,
  onSelect,
  onRemove,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const helperMessage = localError ?? error;
  const uploadHeightStyle = { height: `${previewHeight}px` };

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const validateAndSelectFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const isSupportedImage =
      acceptedImageTypes.includes(file.type) ||
      /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isSupportedImage) {
      setLocalError("Use a JPG, PNG, or WebP image.");
      return;
    }

    setLocalError(null);
    onSelect(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndSelectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openPicker();
  };

  const handleRemove = () => {
    setLocalError(null);
    onRemove();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            {label}
            {required ? <span className="ml-1 text-text-danger">*</span> : null}
          </p>
          {hint ? (
            <p className="mt-2 max-w-[640px] text-[13px] leading-[1.65] text-text-secondary">
              {hint}
            </p>
          ) : null}
        </div>
      </div>

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => validateAndSelectFile(event.target.files?.[0] ?? null)}
      />

      <div
        className={clsx(
          "overflow-hidden rounded-[24px] border border-dashed bg-bg-muted transition-colors",
          isDragging
            ? "border-border-brand bg-bg-brand-soft/45"
            : "border-border-soft",
          helperMessage ? "border-[rgba(180,35,24,0.28)]" : undefined,
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative bg-bg-subtle" style={uploadHeightStyle}>
            <Image
              src={previewUrl}
              alt={fileName ? `${fileName} preview` : "Class image preview"}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-[rgba(15,23,42,0.82)] to-transparent px-4 py-4">
              <div>
                <p className="text-[14px] font-semibold text-text-inverse">
                  Class cover image
                </p>
                <p className="mt-1 text-[12px] text-white/80">
                  {fileName ?? "One gym image selected"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/10 text-text-inverse transition-colors hover:bg-white/18"
                aria-label="Remove selected image"
              >
                <CloseIcon size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={handleKeyDown}
            className="flex cursor-pointer flex-col items-center justify-center gap-4 px-6 py-8 text-center outline-none"
            style={uploadHeightStyle}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-brand-soft text-text-brand">
              <GalleryIcon size={24} />
            </span>

            <div className="space-y-2">
              <p className="text-[15px] font-semibold text-text-primary">
                Upload one gym image
              </p>
              <p className="max-w-[460px] text-[13px] leading-[1.7] text-text-secondary">
                Drag and drop a JPG, PNG, or WebP image here, or click to browse.
                This image will appear on the class profile and booking surfaces.
              </p>
            </div>
          </div>
        )}
      </div>

      {helperMessage ? (
        <p className="text-[12px] font-medium text-text-danger">{helperMessage}</p>
      ) : null}
    </div>
  );
}
