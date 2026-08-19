"use client";

import { IceCreamCone, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocationType } from "@/types/models";

const ICON_MAP: Record<LocationType, typeof IceCreamCone> = {
  scoop_shop: IceCreamCone,
  supermarket: ShoppingCart,
};

const COLOR_MAP: Record<LocationType, string> = {
  scoop_shop: "bg-[#F46B8F]",
  supermarket: "bg-sky-400",
};

interface LocationMarkerProps {
  locationType: LocationType;
  isSelected?: boolean;
}

export function LocationMarker({ locationType, isSelected }: LocationMarkerProps) {
  const Icon = ICON_MAP[locationType] || IceCreamCone;
  const color = COLOR_MAP[locationType] || "bg-[#F46B8F]";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full ring-2 ring-white/90 dark:ring-neutral-800 transition-all duration-200 cursor-pointer",
        color,
        isSelected
          ? "w-9 h-9 elevation-brand animate-marker-pulse"
          : "w-5.5 h-5.5 shadow-md hover:w-6.5 hover:h-6.5"
      )}
    >
      <Icon className={cn("text-white transition-all duration-200", isSelected ? "w-4.5 h-4.5" : "w-3 h-3")} />
    </div>
  );
}
