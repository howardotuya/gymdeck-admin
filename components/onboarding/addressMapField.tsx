"use client";

import { useEffect, useRef, useState } from "react";

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
    location: GoogleLatLngLiteral;
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

function getAddressPatchFromPlace(place: GooglePlaceResult): AddressPatch {
  const components = place.address_components ?? [];
  const country = pickComponent(components, ["country"]);
  const state = pickComponent(components, ["administrative_area_level_1"]);
  const city =
    pickComponent(components, ["locality"]) ??
    pickComponent(components, ["postal_town"]) ??
    pickComponent(components, ["administrative_area_level_2"]);
  const lga =
    pickComponent(components, ["administrative_area_level_2"]) ??
    pickComponent(components, ["sublocality_level_1"]) ??
    pickComponent(components, ["neighborhood"]);
  const streetNumber = pickComponent(components, ["street_number"]);
  const route = pickComponent(components, ["route"]);
  const premise = pickComponent(components, ["premise"]);
  const house = [streetNumber?.long_name, route?.long_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    locationCountry: country?.long_name,
    locationState: state?.long_name,
    locationCity: city?.long_name,
    locationLga: lga?.long_name,
    locationHouse: house || premise?.long_name || "",
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
  onSearchChange,
  onAddressPick,
}: AddressMapFieldProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const markerRef = useRef<GoogleMarker | null>(null);
  const mapInstanceRef = useRef<GoogleMap | null>(null);
  const onSearchChangeRef = useRef(onSearchChange);
  const onAddressPickRef = useRef(onAddressPick);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const missingApiKey = !apiKey;

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
    onAddressPickRef.current = onAddressPick;
  }, [onAddressPick, onSearchChange]);

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

        map.addListener("click", async (event) => {
          if (!event.latLng) {
            return;
          }

          marker.setPosition(event.latLng);
          map.panTo(event.latLng);

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

          onSearchChangeRef.current(result.formatted_address ?? "");
          onAddressPickRef.current(getAddressPatchFromPlace(result));
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
    };
  }, [apiKey, missingApiKey]);

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

      if (!place?.geometry?.location || !mapInstanceRef.current || !markerRef.current) {
        return;
      }

      markerRef.current.setPosition(place.geometry.location);
      mapInstanceRef.current.panTo(place.geometry.location);
      mapInstanceRef.current.setZoom(16);
      onSearchChangeRef.current(place.formatted_address ?? "");
      onAddressPickRef.current(getAddressPatchFromPlace(place));
    });

    return () => {
      if (window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [countryCode, mapsReady, onAddressPick, onSearchChange]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search and pick an address from the map"
        className="h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]"
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
