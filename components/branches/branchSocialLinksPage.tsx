"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, Panel, StatusBadge } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail, BranchSocialLinks } from "./types";

type BranchSocialLinksPageProps = {
  branch: BranchDetail;
};

type SocialPlatformConfig = {
  key: keyof BranchSocialLinks;
  label: string;
  placeholder: string;
  hint: string;
  requiredPrefix?: string[];
};

const socialPlatformConfig: SocialPlatformConfig[] = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/gymdeck.branch",
    hint: "Use the public Instagram profile for this branch.",
    requiredPrefix: ["instagram.com", "www.instagram.com"],
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@gymdeck.branch",
    hint: "Use the public TikTok profile if the branch has one.",
    requiredPrefix: ["tiktok.com", "www.tiktok.com"],
  },
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/gymdeck.branch",
    hint: "Use the most relevant Facebook business page for the branch.",
    requiredPrefix: ["facebook.com", "www.facebook.com"],
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@gymdeckbranch",
    hint: "Use the channel that members should visit for branch media or content.",
    requiredPrefix: ["youtube.com", "www.youtube.com"],
  },
  {
    key: "x",
    label: "X",
    placeholder: "https://x.com/gymdeckbranch",
    hint: "Use the branch X profile if the branch manages one separately.",
    requiredPrefix: ["x.com", "www.x.com", "twitter.com", "www.twitter.com"],
  },
  {
    key: "website",
    label: "Website",
    placeholder: "https://gymdeck.com/branches/victoria-island",
    hint: "Use the branch landing page or official website destination.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/2348012345678",
    hint: "Use a branch-owned WhatsApp entry point for enquiries or conversion.",
    requiredPrefix: ["wa.me", "api.whatsapp.com", "www.whatsapp.com", "whatsapp.com"],
  },
];

function cloneSocialLinks(links: BranchSocialLinks): BranchSocialLinks {
  return { ...links };
}

function normalizeUrl(value: string) {
  return value.trim();
}

function validateSocialLink(value: string, platform: SocialPlatformConfig) {
  const normalizedValue = normalizeUrl(value);

  if (!normalizedValue) {
    return "";
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalizedValue);
  } catch {
    return "Enter a valid absolute URL.";
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return "Use an http or https URL.";
  }

  if (
    platform.requiredPrefix &&
    !platform.requiredPrefix.some(
      (host) =>
        parsedUrl.hostname === host ||
        parsedUrl.hostname.endsWith(`.${host}`),
    )
  ) {
    return `Use a ${platform.label} URL for this field.`;
  }

  return "";
}

export function BranchSocialLinksPage({ branch }: BranchSocialLinksPageProps) {
  const [formState, setFormState] = useState<BranchSocialLinks>(() =>
    cloneSocialLinks(branch.socialLinks),
  );

  const errors = useMemo(() => {
    return socialPlatformConfig.reduce<Record<string, string>>((accumulator, platform) => {
      const nextError = validateSocialLink(formState[platform.key] ?? "", platform);

      if (nextError) {
        accumulator[platform.key] = nextError;
      }

      return accumulator;
    }, {});
  }, [formState]);

  const activeLinks = useMemo(
    () => socialPlatformConfig.filter((platform) => Boolean(formState[platform.key]?.trim())),
    [formState],
  );

  const isDirty = useMemo(() => {
    return JSON.stringify(formState) !== JSON.stringify(branch.socialLinks);
  }, [branch.socialLinks, formState]);

  const isValid = Object.keys(errors).length === 0;

  const resetChanges = () => {
    setFormState(cloneSocialLinks(branch.socialLinks));
  };

  const handleSave = () => {
    if (!isValid) {
      toast.error("Resolve invalid social links before saving.");
      return;
    }

    toast.success(`${branch.name} social links are staged for review.`);
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="branch-profile"
      pageLabel="Social links"
      description="Manage validated social destinations, branch websites, and WhatsApp entry points for public discovery surfaces."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={isValid ? "Links valid" : "Needs fixes"}
            tone={isValid ? "success" : "warning"}
          />
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={primaryActionClassName}
          >
            Save social links
          </button>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-4">
          <FormSectionCard
            title="Branch destinations"
            description="Use one canonical public link per platform so discovery surfaces stay clean and trustworthy."
          >
            <div className="grid gap-4">
              {socialPlatformConfig.map((platform) => (
                <Field key={platform.key} id={`social-${platform.key}`} label={platform.label}>
                  <div className="space-y-2">
                    <input
                      id={`social-${platform.key}`}
                      value={formState[platform.key] ?? ""}
                      onChange={(event) =>
                        setFormState((currentState) => ({
                          ...currentState,
                          [platform.key]: event.target.value,
                        }))
                      }
                      className={clsx(
                        inputClassName,
                        errors[platform.key] ? "border-[#fda29b] focus:ring-[rgba(180,35,24,0.12)]" : "",
                      )}
                      placeholder={platform.placeholder}
                    />
                    <p className="text-[13px] leading-[1.65] text-text-secondary">
                      {platform.hint}
                    </p>
                    {errors[platform.key] ? (
                      <p className="text-[12px] font-medium text-text-danger">
                        {errors[platform.key]}
                      </p>
                    ) : null}
                  </div>
                </Field>
              ))}
            </div>
          </FormSectionCard>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Link health"
            title="Coverage"
            description="Quick scan of how complete and valid the branch link footprint is."
          >
            <div className="space-y-3">
              {[
                ["Active links", activeLinks.length.toString()],
                ["Valid links", (activeLinks.length - Object.keys(errors).length).toString()],
                ["Needs fixes", Object.keys(errors).length.toString()],
                ["Missing platforms", (socialPlatformConfig.length - activeLinks.length).toString()],
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
            eyebrow="Live summary"
            title="Current destinations"
            description="Preview which external destinations members can reach from this branch."
          >
            <div className="space-y-3">
              {activeLinks.length ? (
                activeLinks.map((platform) => (
                  <div
                    key={platform.key}
                    className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[14px] font-semibold text-text-primary">
                        {platform.label}
                      </p>
                      <StatusBadge
                        label={errors[platform.key] ? "Fix" : "Ready"}
                        tone={errors[platform.key] ? "warning" : "success"}
                      />
                    </div>
                    <p className="mt-2 break-all text-[13px] leading-[1.65] text-text-secondary">
                      {formState[platform.key]}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-border-strong px-4 py-5 text-[14px] text-text-secondary">
                  No social or website destinations have been assigned to this branch yet.
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
