"use client";

import Link from "next/link";
import { Star, MapPin, ChevronRight, X, IceCreamCone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Location } from "@/types/models";

function formatDistance(meters: number, useMiles: boolean): string {
  if (useMiles) {
    const miles = meters / 1609.34;
    return miles < 0.1 ? `${Math.round(meters * 3.281)}ft` : `${miles.toFixed(1)}mi`;
  }
  return meters < 1000
    ? `${Math.round(meters)}m`
    : `${(meters / 1000).toFixed(1)}km`;
}

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
  farmers_market: "Farmers Market",
  restaurant: "Restaurant",
  food_truck: "Food Truck",
};

interface FlavorMatchInfo {
  flavorName: string;
  brandName: string | null;
  lastConfirmedAt: string | null;
  source: string;
}

interface MapBottomSheetProps {
  location: Location;
  onClose: () => void;
  flavorMatch?: FlavorMatchInfo;
}

export function MapBottomSheet({ location, onClose, flavorMatch }: MapBottomSheetProps) {
  const [useMiles] = useLocalStorage("scooped:useMiles", true);

  return (
    <>
      {/* Invisible backdrop — tap anywhere on map to close */}
      <div
        className="absolute inset-0 z-30"
        onClick={onClose}
      />

      {/* Bottom sheet card */}
      <div className="absolute bottom-20 left-4 right-4 z-40 animate-in slide-in-from-bottom-4 duration-300 ease-out">
        <div className="bg-white rounded-2xl elevation-2 border p-4 relative">
          {/* Drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-neutral-200" />
          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>

          <Link
            href={`/location/${location.slug}`}
            className="block active:bg-neutral-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 pr-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {TYPE_LABELS[location.location_type] || location.location_type}
                  </Badge>
                  {location.is_claimed && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      Claimed
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg truncate">{location.name}</h3>
                {flavorMatch && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <IceCreamCone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                    <span className="text-sm text-pink-600 font-medium truncate">
                      {flavorMatch.flavorName}
                      {flavorMatch.brandName && ` by ${flavorMatch.brandName}`}
                    </span>
                    <FreshnessBadge
                      lastConfirmedAt={flavorMatch.lastConfirmedAt}
                      source={flavorMatch.source}
                      compact
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-neutral-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{location.address_line1}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {location.avg_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {location.avg_rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-neutral-400">
                        ({location.total_ratings})
                      </span>
                    </div>
                  )}
                  {location.total_checkins > 0 && (
                    <span className="text-xs text-neutral-400">
                      {location.total_checkins} check-ins
                    </span>
                  )}
                  {location.distance_meters != null && (
                    <span className="text-xs text-neutral-400">
                      {formatDistance(location.distance_meters, useMiles)}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300 mt-1 shrink-0" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
