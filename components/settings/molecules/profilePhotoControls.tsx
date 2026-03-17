"use client"

import Image from "next/image"
import { useId, useRef } from "react"
import { DeleteBin6LineIcon } from "@/components/settings/atoms"

type ProfilePhotoControlsProps = {
  imageSrc: string
  onRemove: () => void
  onUpload: (file: File | null) => void
}

export function ProfilePhotoControls({
  imageSrc,
  onRemove,
  onUpload,
}: ProfilePhotoControlsProps) {
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-[100px] overflow-hidden rounded-full bg-bg-muted">
        <Image
          src={imageSrc}
          alt="Profile"
          width={100}
          height={100}
          className="size-[100px] rounded-full object-cover"
          unoptimized
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[1.4] text-text-secondary">Upload or update your photo</p>

        <div className="mt-4 flex items-center gap-3">
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              onUpload(event.target.files?.[0] ?? null)
              event.currentTarget.value = ""
            }}
          />

          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex h-[41px] items-center justify-center rounded-full bg-bg-muted px-5 text-[14px] font-medium leading-normal text-text-support transition-colors hover:bg-bg-action-soft"
          >
            Upload New
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex size-11 items-center justify-center rounded-full bg-bg-muted text-[#B42318] transition-colors hover:bg-bg-action-soft"
            aria-label="Remove profile photo"
          >
            <DeleteBin6LineIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
