"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { CustomerAddress } from "@/lib/customerAuth";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onAddressResolved: (address: CustomerAddress) => void;
  className?: string;
  placeholder?: string;
  id?: string;
};

declare global {
  interface Window {
    google?: any;
    __p1pMapsPromise?: Promise<void>;
  }
}

function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") return Promise.reject();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__p1pMapsPromise) return window.__p1pMapsPromise;

  window.__p1pMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });

  return window.__p1pMapsPromise;
}

function component(
  components: Array<{ long_name: string; short_name: string; types: string[] }>,
  type: string,
  useShort = false,
) {
  const match = components.find((c) => c.types.includes(type));
  if (!match) return "";
  return useShort ? match.short_name : match.long_name;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressResolved,
  className,
  placeholder = "Start typing your business address",
  id,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || "";

  useEffect(() => {
    if (!apiKey) {
      setMapsError("Address lookup isn’t configured yet.");
      return;
    }
    let cancelled = false;
    void loadGoogleMaps(apiKey)
      .then(() => {
        if (!cancelled) setMapsReady(true);
      })
      .catch(() => {
        if (!cancelled) setMapsError("Could not load address suggestions.");
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["address_components", "formatted_address", "place_id"],
        types: ["address"],
        componentRestrictions: { country: ["us", "ca"] },
      },
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const parts = place?.address_components || [];
      if (!parts.length) return;

      const streetNumber = component(parts, "street_number");
      const route = component(parts, "route");
      const line1 = [streetNumber, route].filter(Boolean).join(" ").trim();
      const city =
        component(parts, "locality") ||
        component(parts, "sublocality") ||
        component(parts, "postal_town");
      const state = component(parts, "administrative_area_level_1", true);
      const postalCode = component(parts, "postal_code");
      const country = component(parts, "country", true) || "US";
      const formatted = place.formatted_address || line1;

      onChange(formatted);
      onAddressResolved({
        line1: line1 || formatted,
        line2: null,
        city,
        state,
        postalCode,
        country,
        formatted,
        placeId: place.place_id || null,
      });
    });

    return () => {
      if (window.google?.maps?.event && listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [mapsReady, onAddressResolved, onChange]);

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none transition focus:border-brand-accent focus:bg-white",
          className,
        )}
      />
      {mapsError ? (
        <p className="mt-1.5 text-xs text-grey-olive">{mapsError}</p>
      ) : (
        <p className="mt-1.5 text-xs text-grey-olive">
          Start typing and choose a suggested address to confirm it.
        </p>
      )}
    </div>
  );
}
