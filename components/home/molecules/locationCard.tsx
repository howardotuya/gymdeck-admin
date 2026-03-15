import Image from "next/image";
import { DirectionsButton } from "@/components/home/molecules/directionsButton";

export function LocationCard() {
  return (
    <div className="space-y-4">
      <h4 className="text-[20px] leading-[1.4] font-semibold text-text-primary">Location & Directions</h4>
      <div className="relative h-[275px] overflow-hidden rounded-[16px] bg-bg-muted">
        <Image
          src="/assets/background.jpg"
          alt="Gym location map"
          fill
          className="object-cover grayscale opacity-45"
        />
      </div>
      <DirectionsButton className="w-full" />
    </div>
  );
}
