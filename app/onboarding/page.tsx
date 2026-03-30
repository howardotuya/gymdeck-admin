import { OnboardingPage } from "@/components/onboarding";

export default function OnboardingRoute() {
  return <OnboardingPage mapApiKey={process.env.MAP_API ?? ""} />;
}
