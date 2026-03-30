import { FormSectionCard, ImageUploadField, Input, Select, type SelectOption } from "@/components/ui";
import {
  categoryOptions,
  Field,
  formatOptions,
  levelOptions,
  type ClassFormState,
  type ClassFormUpdateField,
} from "./shared";

type ClassProfileStepProps = {
  branchOptions: string[];
  formState: ClassFormState;
  imageError: string | null;
  instructorOptions: string[];
  onImageChange: (file: File) => void;
  onImageRemove: () => void;
  updateField: ClassFormUpdateField;
};

export function ClassProfileStep({
  branchOptions,
  formState,
  imageError,
  instructorOptions,
  onImageChange,
  onImageRemove,
  updateField,
}: ClassProfileStepProps) {
  const categorySelectOptions: SelectOption[] = categoryOptions.map((category) => ({
    value: category,
    label: category,
  }));
  const formatSelectOptions: SelectOption[] = formatOptions.map((format) => ({
    value: format,
    label: format,
  }));
  const levelSelectOptions: SelectOption[] = levelOptions.map((level) => ({
    value: level,
    label: level,
  }));
  const branchSelectOptions: SelectOption[] = branchOptions.map((branch) => ({
    value: branch,
    label: branch,
  }));
  const instructorSelectOptions: SelectOption[] = instructorOptions.map((instructor) => ({
    value: instructor,
    label: instructor,
  }));

  return (
    <FormSectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <ImageUploadField
            id="class-image"
            label="Class image"
            required
            previewHeight={293}
            error={imageError}
            fileName={formState.imageName}
            previewUrl={formState.imagePreviewUrl}
            previewLabel="Class cover image"
            emptyStateTitle="Upload class image"
            emptyStateDescription="Drag and drop a JPG, PNG, or WebP image here, or click to browse. This image will appear on the class profile and booking surfaces."
            onSelect={onImageChange}
            onRemove={onImageRemove}
          />
        </div>

        <Field id="class-name" label="Class name">
          <Input
            id="class-name"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="HIIT Burn"
          />
        </Field>

        <Field id="class-category" label="Category">
          <Select
            id="class-category"
            options={categorySelectOptions}
            value={formState.category}
            onChange={(value) => updateField("category", value as ClassFormState["category"])}
          />
        </Field>

        <Field id="class-format" label="Format">
          <Select
            id="class-format"
            options={formatSelectOptions}
            value={formState.format}
            onChange={(value) => updateField("format", value as ClassFormState["format"])}
          />
        </Field>

        <Field id="class-level" label="Level">
          <Select
            id="class-level"
            options={levelSelectOptions}
            value={formState.level}
            onChange={(value) => updateField("level", value as ClassFormState["level"])}
          />
        </Field>

        <Field id="class-branch" label="Branch">
          <Select
            id="class-branch"
            options={branchSelectOptions}
            value={formState.branch}
            onChange={(value) => updateField("branch", value as string)}
          />
        </Field>

        <Field id="class-instructor" label="Lead instructor">
          <Select
            id="class-instructor"
            options={instructorSelectOptions}
            value={formState.instructor}
            onChange={(value) => updateField("instructor", value as string)}
          />
        </Field>

        <Field id="class-room" label="Studio or room">
          <Input
            id="class-room"
            value={formState.room}
            onChange={(event) => updateField("room", event.target.value)}
            placeholder="Studio A"
          />
        </Field>

        <Field id="class-duration" label="Duration (mins)">
          <Input
            id="class-duration"
            type="number"
            min="15"
            step="5"
            value={formState.durationMinutes}
            onChange={(event) => updateField("durationMinutes", event.target.value)}
          />
        </Field>
      </div>
    </FormSectionCard>
  );
}
