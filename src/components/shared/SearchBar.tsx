"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useMapStore } from "@/stores/mapStore";
import type { Location } from "@/types/models";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
  farmers_market: "Farmers Market",
  restaurant: "Restaurant",
  food_truck: "Food Truck",
};

const TYPE_EMOJIS: Record<string, string> = {
  scoop_shop: "🍦",
  supermarket: "🛒",
  farmers_market: "🌽",
  restaurant: "🍽️",
  food_truck: "🚚",
};

interface SearchBarProps {
  locations?: Location[];
}

export function SearchBar({ locations = [] }: SearchBarProps) {
  const { filters, setFilters, searchMode } = useMapStore();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize text for search: strip punctuation, normalize & ↔ "and"
  function normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")    // & → "and"
      .replace(/[''`]/g, "")     // strip apostrophes/quotes
      .replace(/[^\w\s]/g, " ")  // strip other punctuation
      .replace(/\s+/g, " ")      // collapse whitespace
      .trim();
  }

  // Filter locations based on search query
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
          .slice(0, 8) // Show max 8 results
      : [];

  // Only show location dropdown in locations mode (flavor results come from the page)
  const showDropdown = isFocused && query.length >= 1 && searchMode === "locations";

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

  return (
    <div ref={containerRef} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10" />
      <Input
        placeholder={
          searchMode === "flavors"
            ? "Search for a flavor or brand..."
            : "Search shops by name or location..."
        }
        value={filters.searchQuery}
        onChange={(e) => setFilters({ searchQuery: e.target.value })}
        onFocus={() => setIsFocused(true)}
        className="pl-10 pr-10 h-11 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-sm"
      />
      {filters.searchQuery && (
        <button
          onClick={() => {
            setFilters({ searchQuery: "" });
            setIsFocused(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 z-10"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Search results dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl elevation-2 border border-neutral-100 dark:border-neutral-800 overflow-hidden max-h-[60vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-400">
                  {results.length} result{results.length !== 1 ? "s" : ""}
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
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                      {TYPE_LABELS[location.location_type] ||
                        location.location_type}
                    </span>
                    {location.avg_rating > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-pink-400 text-pink-400" />
                        <span className="text-xs text-neutral-600">
                          {Number(location.avg_rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-neutral-500">No spots found</p>
              <p className="text-xs text-neutral-400 mt-1">
                Try a different name or location
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
