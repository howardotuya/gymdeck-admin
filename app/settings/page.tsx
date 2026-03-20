import { SettingsPage } from "@/components/settings";

type SettingsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsRoute({ searchParams }: SettingsRouteProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTabParam = resolvedSearchParams?.tab;

  return (
    <SettingsPage
      activeTabParam={Array.isArray(activeTabParam) ? activeTabParam[0] : activeTabParam}
    />
  );
}
