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
  scoop_shop: "bg-pink-300",
  supermarket: "bg-sky-300",
  farmers_market: "bg-emerald-300",
  restaurant: "bg-amber-300",
  food_truck: "bg-violet-300",
};

interface LocationMarkerProps {
  locationType: LocationType;
  isSelected?: boolean;
}

export function LocationMarker({ locationType, isSelected }: LocationMarkerProps) {
  const Icon = ICON_MAP[locationType] || IceCreamCone;
  const color = COLOR_MAP[locationType] || "bg-pink-500";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full shadow-md transition-transform cursor-pointer",
        color,
        isSelected ? "w-10 h-10 scale-110" : "w-8 h-8"
      )}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}
