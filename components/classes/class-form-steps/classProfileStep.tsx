import { FormSectionCard, ImageUploadField } from "@/components/ui";
import {
  categoryOptions,
  Field,
  formatOptions,
  inputClassName,
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
            onSelect={onImageChange}
            onRemove={onImageRemove}
          />
        </div>

        <Field id="class-name" label="Class name">
          <input
            id="class-name"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
            placeholder="HIIT Burn"
          />
        </Field>

        <Field id="class-category" label="Category">
          <select
            id="class-category"
            value={formState.category}
            onChange={(event) =>
              updateField("category", event.target.value as ClassFormState["category"])
            }
            className={inputClassName}
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field id="class-format" label="Format">
          <select
            id="class-format"
            value={formState.format}
            onChange={(event) =>
              updateField("format", event.target.value as ClassFormState["format"])
            }
            className={inputClassName}
          >
            {formatOptions.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </Field>

        <Field id="class-level" label="Level">
          <select
            id="class-level"
            value={formState.level}
            onChange={(event) =>
              updateField("level", event.target.value as ClassFormState["level"])
            }
            className={inputClassName}
          >
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field id="class-branch" label="Branch">
          <select
            id="class-branch"
            value={formState.branch}
            onChange={(event) => updateField("branch", event.target.value)}
            className={inputClassName}
          >
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </Field>

        <Field id="class-instructor" label="Lead instructor">
          <select
            id="class-instructor"
            value={formState.instructor}
            onChange={(event) => updateField("instructor", event.target.value)}
            className={inputClassName}
          >
            {instructorOptions.map((instructor) => (
              <option key={instructor} value={instructor}>
                {instructor}
              </option>
            ))}
          </select>
        </Field>

        <Field id="class-room" label="Studio or room">
          <input
            id="class-room"
            value={formState.room}
            onChange={(event) => updateField("room", event.target.value)}
            className={inputClassName}
            placeholder="Studio A"
          />
        </Field>

        <Field id="class-duration" label="Duration (mins)">
          <input
            id="class-duration"
            type="number"
            min="15"
            step="5"
            value={formState.durationMinutes}
            onChange={(event) => updateField("durationMinutes", event.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>
    </FormSectionCard>
  );
}
