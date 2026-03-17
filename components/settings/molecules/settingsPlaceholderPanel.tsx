type SettingsPlaceholderPanelProps = {
  description: string
  title: string
}

export function SettingsPlaceholderPanel({
  description,
  title,
}: SettingsPlaceholderPanelProps) {
  return (
    <section className="rounded-[24px] border border-border-input bg-bg-muted px-6 py-8 md:px-8 md:py-10">
      <div className="max-w-[420px] space-y-2">
        <h2 className="text-[20px] leading-[1.4] font-semibold text-text-primary">{title}</h2>
        <p className="text-[14px] leading-[1.4] text-text-secondary">{description}</p>
      </div>
    </section>
  )
}
