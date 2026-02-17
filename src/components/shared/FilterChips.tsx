"use client";

import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";
import { MapPin, IceCreamCone } from "lucide-react";

const LOCATION_TYPES = [
  { value: "scoop_shop", label: "Scoop Shops" },
  { value: "supermarket", label: "Supermarkets" },
  { value: "farmers_market", label: "Farmers Markets" },
  { value: "restaurant", label: "Restaurants" },
  { value: "food_truck", label: "Food Trucks" },
] as const;

export function FilterChips() {
  const { filters, setFilters, searchMode, setSearchMode } = useMapStore();

  const toggleType = (type: string) => {
    const current = filters.locationTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFilters({ locationTypes: next });
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {/* Search mode toggle */}
      <div className="flex shrink-0 bg-white/90 rounded-full border border-neutral-200 p-0.5">
        <button
          onClick={() => setSearchMode("locations")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            searchMode === "locations"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          <MapPin className="size-3" />
          Shops
        </button>
        <button
          onClick={() => setSearchMode("flavors")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
            searchMode === "flavors"
              ? "bg-pink-500 text-white"
              : "text-neutral-500 hover:text-neutral-700"
          )}
        >
          <IceCreamCone className="size-3" />
          Find Flavor
        </button>
      </div>

      {/* Location type chips (only in locations mode) */}
      {searchMode === "locations" &&
        LOCATION_TYPES.map(({ value, label }) => {
          const isActive = filters.locationTypes.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "bg-white/90 text-neutral-600 border border-neutral-200"
              )}
            >
              {label}
            </button>
          );
        })}
    </div>
  );
}
