"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin, Star, Navigation } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useMapStore } from "@/stores/mapStore";
import { geocodeForward } from "@/lib/google-maps/geocode";
import type { GeocodeFeature } from "@/lib/google-maps/geocode";
import type { Location, Flavor } from "@/types/models";
import { fetchFlavors } from "@/queries/checkins";
import { flavorColor, flavorEmoji, dedupeFlavorsByName } from "@/lib/flavor-utils";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
};

const TYPE_EMOJIS: Record<string, string> = {
  scoop_shop: "🍦",
  supermarket: "🛒",
};

interface SearchBarProps {
  locations?: Location[];
  onAddressSelect?: (lat: number, lng: number, label: string) => void;
  onFlavorSelect?: (flavorName: string) => void;
}

export function SearchBar({
  locations = [],
  onAddressSelect,
  onFlavorSelect,
}: SearchBarProps) {
  const { filters, setFilters } = useMapStore();
  const [isFocused, setIsFocused] = useState(false);
  const [geocodeResults, setGeocodeResults] = useState<GeocodeFeature[]>([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [flavorResults, setFlavorResults] = useState<Flavor[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const flavorDebounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  function normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const rawQuery = filters.searchQuery.trim();
  const query = normalize(rawQuery);
  const results =
    query.length >= 1
      ? locations
          .filter(
            (loc) =>
              normalize(loc.name).includes(query) ||
              normalize(loc.address_line1).includes(query) ||
              normalize(loc.city).includes(query)
          )
          .slice(0, 8)
      : [];

  const showDropdown = isFocused && query.length >= 1;

  // Debounced geocoding when few location matches
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (rawQuery.length < 3 || !onAddressSelect) {
      setGeocodeResults([]);
      return;
    }

    setGeocodeLoading(true);
    debounceRef.current = setTimeout(async () => {
      const features = await geocodeForward(rawQuery);
      setGeocodeResults(features);
      setGeocodeLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery, onAddressSelect]);

  // Debounced flavor matching (the "what" half of the omnibox)
  useEffect(() => {
    if (flavorDebounceRef.current) clearTimeout(flavorDebounceRef.current);
    if (!onFlavorSelect || rawQuery.length < 2) {
      setFlavorResults([]);
      return;
    }
    flavorDebounceRef.current = setTimeout(async () => {
      const flavors = await fetchFlavors(rawQuery);
      setFlavorResults(dedupeFlavorsByName(flavors).slice(0, 4));
    }, 250);
    return () => {
      if (flavorDebounceRef.current) clearTimeout(flavorDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery, onFlavorSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleAddressClick = (feature: GeocodeFeature) => {
    onAddressSelect?.(feature.latitude, feature.longitude, feature.full_address || feature.name);
    setFilters({ searchQuery: "" });
    setIsFocused(false);
    setGeocodeResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10" />
      <Input
        placeholder="Flavor, shop, or address"
        value={filters.searchQuery}
        onChange={(e) => setFilters({ searchQuery: e.target.value })}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          // Enter picks the top suggestion: address first, then flavor, then shop
          if (geocodeResults.length > 0) {
            handleAddressClick(geocodeResults[0]);
          } else if (onFlavorSelect && flavorResults.length > 0) {
            onFlavorSelect(flavorResults[0].name);
            setFilters({ searchQuery: "" });
            setIsFocused(false);
            setFlavorResults([]);
          } else if (results.length > 0) {
            window.location.href = `/location/${results[0].slug}`;
          }
        }}
        className="pl-10 pr-10 h-11 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-sm"
      />
      {filters.searchQuery && (
        <button
          onClick={() => {
            setFilters({ searchQuery: "" });
            setIsFocused(false);
            setGeocodeResults([]);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl elevation-2 border border-neutral-100 dark:border-neutral-800 overflow-hidden max-h-[60vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Flavor matches — "who's scooping this?" */}
          {onFlavorSelect && flavorResults.length > 0 && (
            <>
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-[#FFF3EE]/60 dark:bg-[#332520]/20">
                <span className="text-xs font-medium text-[#C4364A]">
                  Flavors
                </span>
              </div>
              {flavorResults.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => {
                    onFlavorSelect(flavor.name);
                    setFilters({ searchQuery: "" });
                    setIsFocused(false);
                    setFlavorResults([]);
                  }}
                  className="flex items-center gap-3 px-3 py-3 w-full text-left hover:bg-[#FFF3EE]/50 dark:hover:bg-[#332520]/20 transition-colors border-b border-neutral-50 dark:border-neutral-800 last:border-b-0"
                >
                  <div
                    className="flex items-center justify-center size-8 rounded-full text-base shrink-0"
                    style={{ backgroundColor: flavorColor(flavor.name) }}
                    aria-hidden
                  >
                    {flavorEmoji(flavor.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{flavor.name}</p>
                    <p className="text-xs text-neutral-500">
                      Find shops scooping it
                    </p>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Location name matches */}
          {results.length > 0 && (
            <>
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">
                  {results.length} shop{results.length !== 1 ? "s" : ""}
                </span>
              </div>
              {results.map((location) => (
                <Link
                  key={location.id}
                  href={`/location/${location.slug}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors border-b border-neutral-50 dark:border-neutral-800 last:border-b-0"
                >
                  <span className="text-xl shrink-0" role="img" aria-hidden="true">
                    {TYPE_EMOJIS[location.location_type] || "📍"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {location.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {location.address_line1}, {location.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-0.5">
                    {location.location_type !== "scoop_shop" && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        {TYPE_LABELS[location.location_type] ||
                          location.location_type}
                      </span>
                    )}
                    {location.avg_rating > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-[#F2B45A] text-[#F2B45A]" />
                        <span className="text-xs text-neutral-600">
                          {Number(location.avg_rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </>
          )}

          {/* Address geocode results */}
          {onAddressSelect && (geocodeResults.length > 0 || geocodeLoading) && (
            <>
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-[#F46B8F]" />
                  <span className="text-xs font-medium text-[#F46B8F]">
                    Search near an address
                  </span>
                </div>
              </div>
              {geocodeLoading && geocodeResults.length === 0 && (
                <div className="px-3 py-3 text-xs text-neutral-400 text-center">
                  Finding addresses...
                </div>
              )}
              {geocodeResults.map((feature) => (
                <button
                  key={feature.place_id}
                  onClick={() => handleAddressClick(feature)}
                  className="flex items-center gap-3 px-3 py-3 w-full text-left hover:bg-[#FFF3EE]/50 dark:hover:bg-[#332520]/20 active:bg-[#FFF3EE] transition-colors border-b border-neutral-50 dark:border-neutral-800 last:border-b-0"
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30 shrink-0">
                    <MapPin className="w-4 h-4 text-[#F46B8F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {feature.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {feature.full_address}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF3EE] dark:bg-[#2E1F1B]/30 text-[#2E1F1B] dark:text-[rgba(93,64,55,0.12)] shrink-0">
                    Nearby
                  </span>
                </button>
              ))}
            </>
          )}

          {/* No results at all */}
          {results.length === 0 &&
            geocodeResults.length === 0 &&
            flavorResults.length === 0 &&
            !geocodeLoading && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-neutral-500">Nothing found</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try a flavor, a shop name, or an address
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
