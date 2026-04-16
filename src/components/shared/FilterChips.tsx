"use client";

import { cn } from "@/lib/utils";
import { useMapStore } from "@/stores/mapStore";

const LOCATION_TYPES = [
  { value: "scoop_shop", label: "Scoop Shops" },
  { value: "supermarket", label: "Supermarkets" },
] as const;

export function FilterChips() {
  const { filters, setFilters } = useMapStore();

  const toggleType = (type: string) => {
    const current = filters.locationTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setFilters({ locationTypes: next });
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {LOCATION_TYPES.map(({ value, label }) => {
        const isActive = filters.locationTypes.includes(value);
        return (
          <button
            key={value}
            onClick={() => toggleType(value)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all",
              isActive
                ? "bg-[#C4364A] text-white btn-shadow-cta"
                : "bg-card dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/5"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
