"use client";

import { IceCreamCone, ShoppingCart, Store, UtensilsCrossed, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationType } from "@/types/models";

const ICON_MAP: Record<LocationType, typeof IceCreamCone> = {
  scoop_shop: IceCreamCone,
  supermarket: ShoppingCart,
  farmers_market: Store,
  restaurant: UtensilsCrossed,
  food_truck: Truck,
};

const COLOR_MAP: Record<LocationType, string> = {
  scoop_shop: "bg-pink-500",
  supermarket: "bg-sky-400",
  farmers_market: "bg-emerald-400",
  restaurant: "bg-amber-400",
  food_truck: "bg-violet-400",
};

interface LocationMarkerProps {
  locationType: LocationType;
  isSelected?: boolean;
}

export function LocationMarker({ locationType, isSelected }: LocationMarkerProps) {
  const Icon = ICON_MAP[locationType] || IceCreamCone;
  const color = COLOR_MAP[locationType] || "bg-pink-400";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full ring-2 ring-white/90 dark:ring-neutral-800 transition-all duration-200 cursor-pointer",
        color,
        isSelected
          ? "w-12 h-12 elevation-brand animate-marker-pulse"
          : "w-9 h-9 shadow-md hover:w-10 hover:h-10"
      )}
    >
      <Icon className={cn("text-white transition-all duration-200", isSelected ? "w-5.5 h-5.5" : "w-4.5 h-4.5")} />
    </div>
  );
}
