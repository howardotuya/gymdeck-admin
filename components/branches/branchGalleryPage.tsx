"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  FormSectionCard,
  ImageUploadField,
  Panel,
  StatusBadge,
} from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { branchGalleryMediaTypeOptions } from "./data";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type {
  BranchDetail,
  BranchGalleryMedia,
  BranchGalleryMediaType,
} from "./types";

type BranchGalleryPageProps = {
  branch: BranchDetail;
};

type PendingUploadState = {
  fileName: string;
  previewUrl: string;
  alt: string;
  type: BranchGalleryMediaType;
};

function cloneGallery(items: BranchGalleryMedia[]) {
  return items.map((item) => ({ ...item }));
}

function createMediaId() {
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BranchGalleryPage({ branch }: BranchGalleryPageProps) {
  const [mediaItems, setMediaItems] = useState<BranchGalleryMedia[]>(() =>
    cloneGallery(branch.gallery.media),
  );
  const [featuredMediaIds, setFeaturedMediaIds] = useState<string[]>(() => [
    ...branch.gallery.featuredMediaIds,
  ]);
  const [heroMediaId, setHeroMediaId] = useState(branch.publicProfile.heroMediaId ?? "");
  const [pendingUpload, setPendingUpload] = useState<PendingUploadState | null>(null);

  useEffect(() => {
    return () => {
      if (pendingUpload?.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pendingUpload.previewUrl);
      }
    };
  }, [pendingUpload]);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(mediaItems) !== JSON.stringify(branch.gallery.media) ||
      JSON.stringify(featuredMediaIds) !== JSON.stringify(branch.gallery.featuredMediaIds) ||
      heroMediaId !== (branch.publicProfile.heroMediaId ?? "") ||
      Boolean(pendingUpload)
    );
  }, [branch.gallery.featuredMediaIds, branch.gallery.media, branch.publicProfile.heroMediaId, featuredMediaIds, heroMediaId, mediaItems, pendingUpload]);

  const heroMedia =
    mediaItems.find((item) => item.id === heroMediaId) ??
    mediaItems.find((item) => item.id === featuredMediaIds[0]) ??
    mediaItems[0];

  const resetChanges = () => {
    if (pendingUpload?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }

    setMediaItems(cloneGallery(branch.gallery.media));
    setFeaturedMediaIds([...branch.gallery.featuredMediaIds]);
    setHeroMediaId(branch.publicProfile.heroMediaId ?? "");
    setPendingUpload(null);
  };

  const handleStageUpload = (file: File) => {
    if (pendingUpload?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }

    setPendingUpload({
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
      alt: "",
      type: "interior",
    });
  };

  const removePendingUpload = () => {
    if (pendingUpload?.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }

    setPendingUpload(null);
  };

  const addPendingUploadToGallery = () => {
    if (!pendingUpload) {
      return;
    }

    const nextMedia: BranchGalleryMedia = {
      id: createMediaId(),
      url: pendingUpload.previewUrl,
      alt: pendingUpload.alt || `${branch.name} gallery image`,
      type: pendingUpload.type,
    };

    setMediaItems((currentItems) => [...currentItems, nextMedia]);
    setFeaturedMediaIds((currentIds) =>
      currentIds.length < 4 ? [...currentIds, nextMedia.id] : currentIds,
    );
    setHeroMediaId((currentHeroId) => currentHeroId || nextMedia.id);
    setPendingUpload(null);
  };

  const updateMedia = (mediaId: string, patch: Partial<BranchGalleryMedia>) => {
    setMediaItems((currentItems) =>
      currentItems.map((item) => (item.id === mediaId ? { ...item, ...patch } : item)),
    );
  };

  const moveMedia = (mediaId: string, direction: "up" | "down") => {
    setMediaItems((currentItems) => {
      const currentIndex = currentItems.findIndex((item) => item.id === mediaId);

      if (currentIndex < 0) {
        return currentItems;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= currentItems.length) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const [movedItem] = nextItems.splice(currentIndex, 1);
      nextItems.splice(targetIndex, 0, movedItem);
      return nextItems;
    });
  };

  const removeMedia = (mediaId: string) => {
    setMediaItems((currentItems) => currentItems.filter((item) => item.id !== mediaId));
    setFeaturedMediaIds((currentIds) => currentIds.filter((id) => id !== mediaId));
    setHeroMediaId((currentHeroId) => (currentHeroId === mediaId ? "" : currentHeroId));
  };

  const toggleFeatured = (mediaId: string) => {
    setFeaturedMediaIds((currentIds) => {
      if (currentIds.includes(mediaId)) {
        return currentIds.filter((id) => id !== mediaId);
      }

      if (currentIds.length >= 4) {
        toast.error("Keep featured gallery selections to four items.");
        return currentIds;
      }

      return [...currentIds, mediaId];
    });
  };

  const handleSave = () => {
    toast.success(`${branch.name} gallery changes are staged for review.`);
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="gallery"
      pageLabel="Gallery"
      description="Manage hero media, featured gallery slots, and image metadata for member discovery and conversion surfaces."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={`${featuredMediaIds.length}/4 featured`}
            tone={featuredMediaIds.length >= 3 ? "success" : "warning"}
          />
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button type="button" onClick={handleSave} className={primaryActionClassName}>
            Save gallery
          </button>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-4">
          <FormSectionCard
            title="Upload media"
            description="Stage one image at a time, then add it into the branch gallery with the right metadata."
          >
            <div className="space-y-4">
              <ImageUploadField
                id="branch-gallery-upload"
                label="Gallery upload"
                hint="Use JPG, PNG, or WebP images that show the branch clearly across discovery and booking surfaces."
                fileName={pendingUpload?.fileName}
                previewUrl={pendingUpload?.previewUrl}
                previewHeight={280}
                previewLabel="Gallery image"
                emptyStateTitle="Upload gallery image"
                emptyStateDescription="Drag and drop a JPG, PNG, or WebP image here, or click to browse. This image can then be tagged and added to the branch gallery."
                onSelect={handleStageUpload}
                onRemove={removePendingUpload}
              />

              {pendingUpload ? (
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                  <Field id="pending-media-alt" label="Alt text">
                    <input
                      id="pending-media-alt"
                      value={pendingUpload.alt}
                      onChange={(event) =>
                        setPendingUpload((currentState) =>
                          currentState
                            ? { ...currentState, alt: event.target.value }
                            : currentState,
                        )
                      }
                      className={inputClassName}
                      placeholder="Describe what members see in the image"
                    />
                  </Field>

                  <Field id="pending-media-type" label="Media type">
                    <select
                      id="pending-media-type"
                      value={pendingUpload.type}
                      onChange={(event) =>
                        setPendingUpload((currentState) =>
                          currentState
                            ? {
                                ...currentState,
                                type: event.target.value as BranchGalleryMediaType,
                              }
                            : currentState,
                        )
                      }
                      className={inputClassName}
                    >
                      {branchGalleryMediaTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addPendingUploadToGallery}
                  disabled={!pendingUpload}
                  className={clsx(primaryActionClassName, !pendingUpload && "opacity-60")}
                >
                  Add to gallery
                </button>
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Gallery library"
            description="Edit media metadata, control hero selection, and mark featured items used on the listing header."
          >
            <div className="space-y-4">
              {mediaItems.map((item, index) => {
                const isFeatured = featuredMediaIds.includes(item.id);
                const isHero = heroMediaId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                  >
                    <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-bg-surface">
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          unoptimized
                          sizes="220px"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            label={isHero ? "Hero" : "Gallery"}
                            tone={isHero ? "brand" : "neutral"}
                          />
                          <StatusBadge
                            label={isFeatured ? "Featured" : "Standard"}
                            tone={isFeatured ? "success" : "neutral"}
                          />
                          <StatusBadge
                            label={`Slot ${index + 1}`}
                            tone="neutral"
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                          <Field id={`media-alt-${item.id}`} label="Alt text">
                            <input
                              id={`media-alt-${item.id}`}
                              value={item.alt}
                              onChange={(event) =>
                                updateMedia(item.id, { alt: event.target.value })
                              }
                              className={inputClassName}
                              placeholder="Describe the media clearly"
                            />
                          </Field>

                          <Field id={`media-type-${item.id}`} label="Media type">
                            <select
                              id={`media-type-${item.id}`}
                              value={item.type}
                              onChange={(event) =>
                                updateMedia(item.id, {
                                  type: event.target.value as BranchGalleryMediaType,
                                })
                              }
                              className={inputClassName}
                            >
                              {branchGalleryMediaTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setHeroMediaId(item.id)}
                            className={clsx(
                              secondaryActionClassName,
                              isHero && "border-border-brand text-text-brand",
                            )}
                          >
                            {isHero ? "Hero selected" : "Set as hero"}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFeatured(item.id)}
                            className={clsx(
                              secondaryActionClassName,
                              isFeatured && "border-border-brand text-text-brand",
                            )}
                          >
                            {isFeatured ? "Remove featured" : "Mark featured"}
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMedia(item.id, "up")}
                            className={secondaryActionClassName}
                          >
                            Move up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMedia(item.id, "down")}
                            className={secondaryActionClassName}
                          >
                            Move down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMedia(item.id)}
                            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FormSectionCard>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Gallery health"
            title="Coverage"
            description="Quick scan of how complete the visual story is for this branch."
          >
            <div className="space-y-3">
              {[
                ["Total media", mediaItems.length.toString()],
                ["Featured media", featuredMediaIds.length.toString()],
                ["Hero set", heroMedia ? "Yes" : "No"],
                [
                  "Media types used",
                  new Set(mediaItems.map((item) => item.type)).size.toString(),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-3"
                >
                  <p className="text-[14px] font-medium text-text-primary">{label}</p>
                  <p className="text-[14px] font-semibold text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Hero preview"
            title="Listing header media"
            description="The branch detail page will use this image as the main visual anchor."
          >
            {heroMedia ? (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-muted">
                  <Image
                    src={heroMedia.url}
                    alt={heroMedia.alt}
                    fill
                    unoptimized
                    sizes="380px"
                    className="object-cover"
                  />
                </div>
                <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
                  <p className="text-[15px] font-semibold text-text-primary">{heroMedia.alt}</p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                    {branchGalleryMediaTypeOptions.find((option) => option.value === heroMedia.type)?.label} media
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                No hero media selected yet.
              </div>
            )}
          </Panel>

          <Panel
            eyebrow="Publishing"
            title="Featured slot preview"
            description="These images will receive the most prominence in the public branch header."
          >
            <div className="grid grid-cols-2 gap-3">
              {featuredMediaIds.map((mediaId) => {
                const item = mediaItems.find((entry) => entry.id === mediaId);

                if (!item) {
                  return null;
                }

                return (
                  <div
                    key={item.id}
                    className="rounded-[18px] border border-border-soft bg-bg-muted p-2"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[14px] bg-bg-surface">
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        unoptimized
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-2 truncate text-[12px] font-medium text-text-primary">
                      {item.alt}
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
