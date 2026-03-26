"use client";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { Panel } from "@/components/ui";
import { branchClassOptions, branchPlanOptions } from "../data";
import type { BranchFormState } from "../types";

type PreviewStepProps = {
  formState: BranchFormState;
  onReorderGallery: (nextGalleryOrder: string[]) => void;
};

type PreviewTabId =
  | "branch-profile"
  | "plans-and-classes"
  | "gallery"
  | "public-profile";

const previewTabs: Array<{ id: PreviewTabId; label: string }> = [
  { id: "branch-profile", label: "Branch profile" },
  { id: "plans-and-classes", label: "Plans and classes" },
  { id: "gallery", label: "Gallery" },
  { id: "public-profile", label: "Public profile" },
];

const sectionLabelClassName =
  "text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle";

function getBranchLabel(formState: BranchFormState) {
  return formState.name.trim() || "New branch";
}

function getBranchAddressLabel(formState: BranchFormState) {
  const addressParts = [
    formState.addressLine1,
    formState.addressLine2,
    formState.city,
    formState.state,
    formState.country,
    formState.postalCode,
  ].filter((value) => value.trim());

  if (addressParts.length) {
    return addressParts.join(", ");
  }

  return formState.address.trim();
}

function getSelectedPlans(formState: BranchFormState) {
  return branchPlanOptions.filter((plan) => formState.plans.includes(plan.name));
}

function getSelectedClasses(formState: BranchFormState) {
  return branchClassOptions.filter((gymClass) => formState.classes.includes(gymClass.name));
}

function getSelectedGalleryMedia(formState: BranchFormState) {
  return formState.gallery
    .map((mediaId) => formState.mediaLibrary.find((item) => item.id === mediaId))
    .filter((item): item is BranchFormState["mediaLibrary"][number] => Boolean(item));
}

function formatOpeningHour(hour: BranchFormState["openingHours"][number]) {
  if (!hour.isOpen) {
    return "Closed";
  }

  return `${hour.openTime} - ${hour.closeTime}`;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
      <p className={sectionLabelClassName}>{label}</p>
      <p className="mt-2 text-[14px] leading-[1.65] text-text-primary">{value}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-[720px]">
        <p className={sectionLabelClassName}>{eyebrow}</p>
        <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">{description}</p>
      </div>
      {badge ? (
        <span className="inline-flex h-fit rounded-full bg-bg-brand-soft px-3 py-1 text-[12px] font-semibold text-text-brand">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] border border-dashed border-border-strong px-4 py-6">
      <p className="text-[14px] font-semibold text-text-primary">{title}</p>
      <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">{description}</p>
    </div>
  );
}

function SortableGalleryImage({
  id,
  index,
  previewUrl,
  alt,
}: {
  id: string;
  index: number;
  previewUrl: string;
  alt: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={clsx(isDragging && "z-10")}
    >
      <button
        type="button"
        aria-label="Drag to reorder gallery image"
        className={clsx(
          "group relative block w-full cursor-grab overflow-hidden rounded-[20px] border border-border-soft bg-bg-muted text-left transition-shadow active:cursor-grabbing",
          isDragging && "shadow-[0_16px_40px_rgba(15,23,42,0.18)]",
        )}
        {...attributes}
        {...listeners}
      >
        <div className="relative aspect-[4/3] w-full bg-bg-subtle">
          <span className="absolute left-3 top-3 z-10 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-bg-surface/90 px-3 text-[13px] font-semibold text-text-primary shadow-[0_6px_20px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            {index}
          </span>
          <Image
            src={previewUrl}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        </div>
      </button>
    </li>
  );
}

function SortableGalleryList({
  items,
  onReorder,
}: {
  items: Array<{
    id: string;
    previewUrl: string;
    alt: string;
  }>;
  onReorder: (nextGalleryOrder: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(arrayMove(items.map((item) => item.id), oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <ul className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item, index) => (
            <SortableGalleryImage
              key={item.id}
              id={item.id}
              index={index + 1}
              previewUrl={item.previewUrl}
              alt={item.alt}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function PreviewTabPanel({
  formState,
  activeTab,
  onReorderGallery,
}: {
  formState: BranchFormState;
  activeTab: PreviewTabId;
  onReorderGallery: (nextGalleryOrder: string[]) => void;
}) {
  const branchLabel = getBranchLabel(formState);
  const branchAddressLabel = getBranchAddressLabel(formState);
  const selectedPlans = getSelectedPlans(formState);
  const selectedClasses = getSelectedClasses(formState);
  const selectedGalleryMedia = getSelectedGalleryMedia(formState);
  const activeRules = formState.publicRules.filter((rule) => rule.title.trim());

  if (activeTab === "branch-profile") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Step 1"
          title="Branch profile"
          description="Review the branch identity, owner assignment, and operating schedule before launch."
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Branch name" value={branchLabel} />
          <DetailItem
            label="Manager"
            value={formState.manager.trim() || "No manager selected yet."}
          />
          <DetailItem label="Status" value={formState.status} />
          <DetailItem label="Phone" value={formState.phone.trim() || "No phone added yet."} />
          <DetailItem label="Email" value={formState.email.trim() || "No email added yet."} />
          <DetailItem
            label="Location"
            value={[formState.city, formState.state, formState.country]
              .filter((value) => value.trim())
              .join(", ") || "No location details added yet."}
          />
        </div>

        <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
          <p className={sectionLabelClassName}>Address</p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-primary">
            {branchAddressLabel || "Branch address will appear here once it is filled in."}
          </p>
        </div>

        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className={sectionLabelClassName}>Opening hours</p>
            <p className="text-[13px] font-medium text-text-secondary">
              {formState.openingHours.filter((item) => item.isOpen).length} days open
            </p>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {formState.openingHours.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-semibold text-text-primary">{item.day}</p>
                  <span
                    className={clsx(
                      "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      item.isOpen
                        ? "bg-bg-brand-soft text-text-brand"
                        : "bg-bg-surface text-text-secondary",
                    )}
                  >
                    {item.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
                  {formatOpeningHour(item)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "plans-and-classes") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Step 2"
          title="Plans and classes"
          description="Review the launch mix of membership products and recurring programming for this branch."
        />

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className={sectionLabelClassName}>Plans</p>
              <span className="text-[13px] font-medium text-text-secondary">
                {selectedPlans.length} selected
              </span>
            </div>
            {selectedPlans.length ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {selectedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-semibold text-text-primary">{plan.name}</p>
                      <span className="shrink-0 rounded-full bg-bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-brand">
                        {plan.priceLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                      {plan.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState
                  title="No plans selected"
                  description="Add at least one membership plan so members can see what this branch supports."
                />
              </div>
            )}
          </div>

          <div className="border-t border-border-soft pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className={sectionLabelClassName}>Classes</p>
              <span className="text-[13px] font-medium text-text-secondary">
                {selectedClasses.length} selected
              </span>
            </div>
            {selectedClasses.length ? (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {selectedClasses.map((gymClass) => (
                  <div
                    key={gymClass.id}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <p className="text-[14px] font-semibold text-text-primary">{gymClass.name}</p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                      {gymClass.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3">
                <EmptyState
                  title="No classes selected"
                  description="Select at least one recurring class type so the branch programming does not look empty."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "gallery") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Step 3"
          title="Gallery"
          description="Review the media assets that will appear on the branch profile once the setup is published."
          badge={`${selectedGalleryMedia.length} selected`}
        />

        <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
          <p className={sectionLabelClassName}>Display order</p>
          <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
            Drag images to set the order they appear on the public branch profile.
          </p>
        </div>

        {selectedGalleryMedia.length ? (
          <SortableGalleryList
            items={selectedGalleryMedia.map((image) => ({
              id: image.id,
              previewUrl: image.previewUrl,
              alt: image.fileName,
            }))}
            onReorder={onReorderGallery}
          />
        ) : (
          <EmptyState
            title="No gallery media selected"
            description="Pick at least one image from the media library so the public branch page has visual context."
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Step 4"
        title="Public profile"
        description="Review the overview, amenities, and member-facing rules before requesting review."
      />

      <div className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4">
        <p className={sectionLabelClassName}>Overview</p>
        <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
          {formState.publicOverview.trim()
            ? formState.publicOverview
            : "No public overview added yet."}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className={sectionLabelClassName}>Amenities</p>
          <span className="text-[13px] font-medium text-text-secondary">
            {formState.publicAmenities.length} selected
          </span>
        </div>
        {formState.publicAmenities.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {formState.publicAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex rounded-full bg-bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-text-brand"
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="No amenities selected"
              description="Choose the amenities that should be visible on the branch public profile."
            />
          </div>
        )}
      </div>

      <div className="border-t border-border-soft pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className={sectionLabelClassName}>Gym rules & etiquette</p>
          <span className="text-[13px] font-medium text-text-secondary">
            {activeRules.length} active
          </span>
        </div>
        {activeRules.length ? (
          <div className="mt-3 space-y-3">
            {activeRules.map((rule, index) => (
              <div
                key={rule.id}
                className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
              >
                <p className="text-[14px] font-semibold text-text-primary">
                  {index + 1}. {rule.title}
                </p>
                <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                  {rule.details?.trim() || "No supporting details added for this rule."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="No rules added"
              description="Add at least one branch rule so members know what to expect before arrival."
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function PreviewStep({ formState, onReorderGallery }: PreviewStepProps) {
  const [activeTab, setActiveTab] = useState<PreviewTabId>("branch-profile");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary">
          Summary
        </h2>
        <p className="mt-2 max-w-[880px] text-[14px] leading-[1.65] text-text-secondary">
          This summary shows the choices you&apos;ve made so far. Use the tabs to review each setup
          step and confirm the branch is ready before you create it.
        </p>
      </div>

      <Panel bodyClassName="space-y-6">
        <div className="overflow-x-auto border-b border-border-soft">
          <div className="flex min-w-max items-center gap-6">
            {previewTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "border-b-2 pb-3 pt-1 text-[14px] font-medium tracking-[-0.02em] transition-colors",
                  activeTab === tab.id
                    ? "border-text-brand text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-border-soft bg-bg-surface px-5 py-5">
          <PreviewTabPanel
            activeTab={activeTab}
            formState={formState}
            onReorderGallery={onReorderGallery}
          />
        </div>
      </Panel>
    </div>
  );
}
