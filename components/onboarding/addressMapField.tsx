"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Input } from "@/components/ui";

type GoogleLatLngLiteral = {
  lat: number;
  lng: number;
};

type GoogleLatLng = {
  lat: () => number;
  lng: () => number;
};

type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  place_id?: string;
  geometry?: {
    location?: GoogleLatLng;
  };
};

type GoogleGeocodeResponse = {
  results?: GooglePlaceResult[];
};

type GoogleMapMouseEvent = {
  latLng?: GoogleLatLng;
};

type GoogleMap = {
  addListener: (eventName: "click", handler: (event: GoogleMapMouseEvent) => void) => void;
  panTo: (position: GoogleLatLng | GoogleLatLngLiteral) => void;
  setZoom: (zoom: number) => void;
};

type GoogleMarker = {
  setPosition: (position: GoogleLatLng | GoogleLatLngLiteral) => void;
};

type GoogleGeocoder = {
  geocode: (request: {
    address?: string;
    location?: GoogleLatLngLiteral;
    placeId?: string;
  }) => Promise<GoogleGeocodeResponse>;
};

type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => void;
  getPlace: () => GooglePlaceResult | undefined;
};

type GoogleMapsWindow = {
  maps?: {
    Map: new (
      element: HTMLElement,
      options: {
        center: GoogleLatLngLiteral;
        zoom: number;
        mapTypeControl: boolean;
        streetViewControl: boolean;
        fullscreenControl: boolean;
      },
    ) => GoogleMap;
    Marker: new (options: {
      map: GoogleMap;
      position: GoogleLatLngLiteral;
    }) => GoogleMarker;
    Geocoder: new () => GoogleGeocoder;
    places?: {
      Autocomplete: new (
        element: HTMLInputElement,
        options: {
          fields: string[];
          componentRestrictions?: {
            country: string;
          };
        },
      ) => GoogleAutocomplete;
    };
    event?: {
      clearInstanceListeners: (instance: unknown) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleMapsWindow;
  }
}

type AddressPatch = {
  locationCountry?: string;
  locationState?: string;
  locationCity?: string;
  locationLga?: string;
  locationHouse?: string;
  locationFormattedAddress?: string;
  locationPlaceId?: string;
  locationLatitude?: number | null;
  locationLongitude?: number | null;
};

type AddressMapFieldProps = {
  apiKey: string;
  countryCode?: string;
  value: string;
  latitude?: number | null;
  longitude?: number | null;
  onSearchChange: (value: string) => void;
  onAddressPick: (patch: AddressPatch) => void;
};

const defaultCenter = {
  lat: 6.5244,
  lng: 3.3792,
};

let googleMapsPromise: Promise<GoogleMapsWindow> | null = null;

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-maps-script");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google ?? {}));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google ?? {});
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function pickComponent(components: GoogleAddressComponent[], types: string[]) {
  return components.find((component) =>
    types.every((type) => component.types.includes(type)),
  );
}

function pickFirstMatchingComponent(
  components: GoogleAddressComponent[],
  types: string[],
) {
  return components.find((component) =>
    types.some((type) => component.types.includes(type)),
  );
}

function getAddressPatchFromPlace(place: GooglePlaceResult): AddressPatch {
  const components = place.address_components ?? [];
  const country = pickComponent(components, ["country"]);
  const state = pickComponent(components, ["administrative_area_level_1"]);
  const city =
    pickFirstMatchingComponent(components, [
      "locality",
      "postal_town",
      "administrative_area_level_3",
      "administrative_area_level_2",
      "sublocality_level_1",
      "sublocality",
    ]) ?? pickComponent(components, ["administrative_area_level_2"]);
  const lgaCandidate = pickFirstMatchingComponent(components, [
    "sublocality_level_1",
    "sublocality",
    "neighborhood",
    "administrative_area_level_3",
    "administrative_area_level_2",
  ]);
  const streetNumber = pickComponent(components, ["street_number"]);
  const route = pickComponent(components, ["route"]);
  const subpremise = pickComponent(components, ["subpremise"]);
  const premise = pickComponent(components, ["premise"]);
  const house = [streetNumber?.long_name, route?.long_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const formattedAddressSegments = (place.formatted_address ?? "")
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const fallbackStreetLine = formattedAddressSegments[0] ?? "";
  const lga =
    lgaCandidate?.long_name &&
    lgaCandidate.long_name !== city?.long_name
      ? lgaCandidate
      : pickFirstMatchingComponent(components, [
          "neighborhood",
          "administrative_area_level_3",
          "administrative_area_level_2",
        ]);

  return {
    locationCountry: country?.long_name,
    locationState: state?.long_name,
    locationCity: city?.long_name,
    locationLga: lga?.long_name,
    locationHouse:
      [subpremise?.long_name, house || premise?.long_name || fallbackStreetLine]
        .filter(Boolean)
        .join(", ")
        .trim() || "",
    locationFormattedAddress: place.formatted_address ?? "",
    locationPlaceId: place.place_id ?? "",
    locationLatitude: place.geometry?.location?.lat?.() ?? null,
    locationLongitude: place.geometry?.location?.lng?.() ?? null,
  };
}

export function AddressMapField({
  apiKey,
  countryCode,
  value,
  latitude,
  longitude,
  onSearchChange,
  onAddressPick,
}: AddressMapFieldProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const geocoderRef = useRef<GoogleGeocoder | null>(null);
  const resolveSearchRequestRef = useRef<
    (request: { address?: string; placeId?: string }) => Promise<void>
  >(async () => {});
  const onSearchChangeRef = useRef(onSearchChange);
  const onAddressPickRef = useRef(onAddressPick);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const missingApiKey = !apiKey;

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
    onAddressPickRef.current = onAddressPick;
  }, [onAddressPick, onSearchChange]);

  const applyPlaceSelection = useCallback((place: GooglePlaceResult) => {
    const position = place.geometry?.location;

    if (position && markerRef.current && mapInstanceRef.current) {
      markerRef.current.setPosition(position);
      mapInstanceRef.current.panTo(position);
      mapInstanceRef.current.setZoom(16);
    }

    const patch = getAddressPatchFromPlace(place);
    onSearchChangeRef.current(patch.locationFormattedAddress ?? place.formatted_address ?? "");
    onAddressPickRef.current(patch);
    setMapError(null);
  }, []);

  const resolveSearchRequest = useCallback(async ({
    address,
    placeId,
  }: {
    address?: string;
    placeId?: string;
  }) => {
    const trimmedAddress = address?.trim() ?? "";

    if ((!trimmedAddress && !placeId) || !geocoderRef.current) {
      return;
    }

    try {
      const response = await geocoderRef.current.geocode(
        placeId ? { placeId } : { address: trimmedAddress },
      );
      const result = response.results?.[0];

      if (!result) {
        setMapError("We couldn't find that address. Try a more specific search or click the map.");
        return;
      }

      applyPlaceSelection(result);
    } catch {
      setMapError("Unable to resolve that address right now.");
    }
  }, [applyPlaceSelection]);

  useEffect(() => {
    resolveSearchRequestRef.current = resolveSearchRequest;
  }, [resolveSearchRequest]);

  const handleSearchKeyDown = async (
    event: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    await resolveSearchRequestRef.current({ address: value });
  };

  useEffect(() => {
    if (missingApiKey) {
      return;
    }

    let isMounted = true;

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (!isMounted || !mapRef.current) {
          return;
        }

        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const marker = new google.maps.Marker({
          map,
          position: defaultCenter,
        });

        const geocoder = new google.maps.Geocoder();
        geocoderRef.current = geocoder;

        map.addListener("click", async (event) => {
          if (!event.latLng) {
            return;
          }

          try {
            const response = await geocoder.geocode({
              location: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              },
            });

            const result = response.results?.[0];

            if (!result) {
              return;
            }

            applyPlaceSelection(result);
          } catch {
            setMapError("Unable to read that point on the map right now.");
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setMapsReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setMapError("Unable to load Google Maps right now.");
        }
      });

    return () => {
      isMounted = false;
      geocoderRef.current = null;
    };
  }, [apiKey, applyPlaceSelection, missingApiKey]);

  useEffect(() => {
    if (!mapsReady || !inputRef.current || !window.google?.maps?.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "formatted_address", "geometry", "place_id"],
      ...(countryCode
        ? {
            componentRestrictions: {
              country: countryCode,
            },
          }
        : {}),
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place) {
        return;
      }

      if (place.geometry?.location) {
        applyPlaceSelection(place);
        return;
      }

      void resolveSearchRequestRef.current({
        placeId: place.place_id,
        address: place.formatted_address ?? inputRef.current?.value ?? "",
      });
    });

    return () => {
      if (window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [applyPlaceSelection, countryCode, mapsReady]);

  useEffect(() => {
    if (
      !mapsReady ||
      latitude == null ||
      longitude == null ||
      !mapInstanceRef.current ||
      !markerRef.current
    ) {
      return;
    }

    const nextPosition = {
      lat: latitude,
      lng: longitude,
    };

    markerRef.current.setPosition(nextPosition);
    mapInstanceRef.current.panTo(nextPosition);
    mapInstanceRef.current.setZoom(16);
  }, [latitude, longitude, mapsReady]);

  return (
    <div className="space-y-3">
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onSearchChange(event.target.value)}
        onKeyDown={handleSearchKeyDown}
        placeholder="Search and pick an address from the map"
      />

      <div className="overflow-hidden rounded-[20px] border border-border-soft bg-bg-page">
        <div ref={mapRef} className="h-[260px] w-full" />
      </div>

      {mapError ? (
        <p className="text-[13px] text-text-secondary">{mapError}</p>
      ) : missingApiKey ? (
        <p className="text-[13px] text-text-secondary">
          Map API key is missing, so map picking is unavailable in this build.
        </p>
      ) : (
        <p className="text-[13px] text-text-secondary">
          Search for the location or click directly on the map to fill the address
          fields.
        </p>
      )}
    </div>
  );
}
