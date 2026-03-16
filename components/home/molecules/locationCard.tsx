import { DirectionsButton } from "@/components/home/molecules/directionsButton";
import type { GymLocation } from "@/components/home/types";

type LocationCardProps = {
  location: GymLocation;
};

const MAPS_BASE_URL = "https://www.google.com/maps";

function getMapEmbedUrl(location: GymLocation, mapsApiKey?: string) {
  const coordinates = `${location.latitude},${location.longitude}`;

  if (mapsApiKey) {
    const params = new URLSearchParams({
      key: mapsApiKey,
      q: coordinates,
      zoom: "15",
    });

    return `${MAPS_BASE_URL}/embed/v1/place?${params.toString()}`;
  }

  const params = new URLSearchParams({
    q: `${location.name}, ${location.address}`,
    output: "embed",
  });

  return `${MAPS_BASE_URL}?${params.toString()}`;
}

function getDirectionsUrl(location: GymLocation) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${location.latitude},${location.longitude}`,
    travelmode: "driving",
  });

  if (location.placeId) {
    params.set("destination_place_id", location.placeId);
  }

  return `${MAPS_BASE_URL}/dir/?${params.toString()}`;
}

export function LocationCard({ location }: LocationCardProps) {
  const mapsApiKey =
    process.env.MAP_API ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.GOOGLE_MAPS_API_KEY;

  const mapEmbedUrl = getMapEmbedUrl(location, mapsApiKey);
  const directionsUrl = getDirectionsUrl(location);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-[20px] leading-[1.4] font-semibold text-text-primary">Location & Directions</h4>
        <p className="text-[14px] leading-[1.4] text-text-support">{location.address}</p>
      </div>
      <div className="relative h-[275px] overflow-hidden rounded-[16px] bg-bg-muted">
        <iframe
          title={`${location.name} map`}
          src={mapEmbedUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <DirectionsButton className="w-full" href={directionsUrl} />
    </div>
  );
}
