"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin, Star, ChevronRight, IceCreamCone } from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { MapBottomSheet } from "@/components/map/MapBottomSheet";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterChips } from "@/components/shared/FilterChips";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { useLocation } from "@/hooks/useLocation";
import { useMapStore } from "@/stores/mapStore";
import { fetchNearbyLocations, searchLocationsByFlavor } from "@/queries/locations";
import type { FlavorSearchResult } from "@/queries/locations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Location } from "@/types/models";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
  farmers_market: "Farmers Market",
  restaurant: "Restaurant",
  food_truck: "Food Truck",
};

const TYPE_COLORS: Record<string, string> = {
  scoop_shop: "bg-pink-100 text-pink-700",
  supermarket: "bg-blue-100 text-blue-700",
  farmers_market: "bg-green-100 text-green-700",
  restaurant: "bg-orange-100 text-orange-700",
  food_truck: "bg-purple-100 text-purple-700",
};

export default function DiscoverPage() {
  const { position } = useLocation();
  const { filters, setSelectedLocationId, searchMode } = useMapStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Default to NYC center if no GPS position yet
  const searchLat = position?.latitude ?? 40.748;
  const searchLng = position?.longitude ?? -73.985;

  // ---- Location search (default mode) ----
  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["nearby-locations", searchLat, searchLng, filters.locationTypes],
    queryFn: () =>
      fetchNearbyLocations(
        searchLat,
        searchLng,
        80000,
        filters.locationTypes.length > 0 ? filters.locationTypes : undefined
      ),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: searchMode === "locations",
  });

  // ---- Flavor search mode ----
  const flavorQuery = filters.searchQuery.trim();
  const { data: flavorResults = [], isLoading: flavorLoading } = useQuery({
    queryKey: ["flavor-search-locations", flavorQuery, searchLat, searchLng],
    queryFn: () =>
      searchLocationsByFlavor(flavorQuery, searchLat, searchLng, 80000),
    enabled: searchMode === "flavors" && flavorQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  // Normalize text for search: strip punctuation, normalize & ↔ "and"
  const normalize = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  // Client-side search filter for location mode
  const filteredLocations = useMemo(() => {
    if (!filters.searchQuery) return locations;

    const query = normalize(filters.searchQuery);
    if (query.length < 2) return locations;
    return locations.filter(
      (loc) =>
        normalize(loc.name).includes(query) ||
        normalize(loc.address_line1).includes(query) ||
        normalize(loc.city).includes(query)
    );
  }, [locations, filters.searchQuery, normalize]);

  // Convert flavor results to Location objects for the map
  const flavorLocationsForMap = useMemo((): Location[] => {
    return flavorResults.map((r: FlavorSearchResult) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      location_type: r.location_type,
      address_line1: r.address_line1,
      city: r.city,
      state: r.state,
      zip: r.zip,
      phone: r.phone,
      website: r.website,
      instagram: r.instagram,
      hours: r.hours,
      photo_url: r.photo_url,
      avg_rating: r.avg_rating,
      total_ratings: r.total_ratings,
      total_checkins: r.total_checkins,
      is_claimed: r.is_claimed,
      latitude: r.latitude,
      longitude: r.longitude,
      distance_meters: r.distance_meters,
      is_active: true,
    })) as Location[];
  }, [flavorResults]);

  const isLoading = searchMode === "locations" ? locationsLoading : flavorLoading;
  const displayLocations = searchMode === "locations" ? filteredLocations : flavorLocationsForMap;

  // Build a map from location ID → flavor info for the bottom sheet
  const flavorInfoMap = useMemo(() => {
    const map = new Map<string, { flavorName: string; brandName: string | null; lastConfirmedAt: string | null; source: string }>();
    for (const r of flavorResults) {
      map.set(r.id, {
        flavorName: r.matching_flavor_name,
        brandName: r.matching_brand_name,
        lastConfirmedAt: r.last_confirmed_at,
        source: r.availability_source,
      });
    }
    return map;
  }, [flavorResults]);

  const handleMarkerClick = useCallback(
    (location: Location) => {
      setSelectedLocation(location);
      setSelectedLocationId(location.id);
    },
    [setSelectedLocationId]
  );

  const handleCloseSheet = useCallback(() => {
    setSelectedLocation(null);
    setSelectedLocationId(null);
  }, [setSelectedLocationId]);

  // Detect WebGL support on mount
  const webglSupported = useMemo(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }, []);

  // If no WebGL, show list view
  if (!webglSupported) {
    return (
      <div className="min-h-dvh bg-white dark:bg-background pb-20">
        {/* Search + Filters */}
        <div className="sticky top-0 z-30 bg-white dark:bg-background p-4 space-y-2 border-b dark:border-white/5">
          <SearchBar locations={locations} />
          <FilterChips />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4" />
            <span className="text-sm text-neutral-500">
              {searchMode === "flavors" ? "Searching for flavors..." : "Loading 250+ ice cream spots..."}
            </span>
          </div>
        )}

        {/* Results */}
        <div className="p-4 space-y-2">
          {searchMode === "flavors" && flavorQuery.length < 2 ? (
            <div className="text-center py-16">
              <IceCreamCone className="w-10 h-10 text-pink-300 mx-auto mb-3" />
              <p className="font-medium text-neutral-600">Search for a flavor</p>
              <p className="text-sm text-neutral-400 mt-1">
                Type a flavor or brand name to find nearby shops
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-neutral-500 mb-3">
                {displayLocations.length} location{displayLocations.length !== 1 ? "s" : ""}{" "}
                {searchMode === "flavors" ? "found" : "nearby"}
              </p>
              {displayLocations.map((location) => {
                const flavorInfo = flavorInfoMap.get(location.id);
                return (
                  <Link key={location.id} href={`/location/${location.slug}`}>
                    <Card className="hover:bg-neutral-50 transition-colors">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">{location.name}</h3>
                            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[location.location_type] || ""}`}>
                              {TYPE_LABELS[location.location_type] || location.location_type}
                            </Badge>
                          </div>
                          {flavorInfo && (
                            <div className="flex items-center gap-2 mb-1">
                              <IceCreamCone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                              <span className="text-sm text-pink-600 font-medium truncate">
                                {flavorInfo.flavorName}
                                {flavorInfo.brandName && ` by ${flavorInfo.brandName}`}
                              </span>
                              <FreshnessBadge
                                lastConfirmedAt={flavorInfo.lastConfirmedAt}
                                source={flavorInfo.source}
                                compact
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm text-neutral-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">
                              {location.address_line1}, {location.city}
                            </span>
                          </div>
                          {location.avg_rating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{Number(location.avg_rating).toFixed(1)}</span>
                              <span className="text-xs text-neutral-400">({location.total_ratings})</span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 ml-2" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-dvh w-full">
      {/* Map */}
      <MapView
        locations={displayLocations}
        onMarkerClick={handleMarkerClick}
        userPosition={position}
      />

      {/* Search + Filters overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] space-y-2">
        <SearchBar locations={locations} />
        <FilterChips />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full px-5 py-2.5 elevation-2 flex items-center gap-2.5 animate-in fade-in duration-200">
          <div className="size-4 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-neutral-600">
            {searchMode === "flavors" ? "Searching flavors..." : "Loading locations..."}
          </span>
        </div>
      )}

      {/* Flavor search prompt (no query yet) */}
      {searchMode === "flavors" && flavorQuery.length < 2 && !selectedLocation && (
        <div className="absolute top-32 left-4 right-4 z-30 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-2xl elevation-3 border border-pink-100/50 dark:border-white/5 p-6 text-center animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-gradient-to-br from-pink-100 to-amber-100 dark:from-rose-800/25 dark:to-amber-800/20 mb-3">
            <IceCreamCone className="w-7 h-7 text-pink-500" />
          </div>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">Find a flavor near you</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            Type a flavor or brand name above to see which shops carry it
          </p>
        </div>
      )}

      {/* Flavor results count */}
      {searchMode === "flavors" && flavorQuery.length >= 2 && flavorResults.length > 0 && !selectedLocation && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-5 py-2.5 elevation-brand animate-in fade-in zoom-in-95 duration-200">
          <span className="text-sm font-semibold">
            {flavorResults.length} shop{flavorResults.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* Location preview bottom sheet */}
      {selectedLocation && (
        <MapBottomSheet
          location={selectedLocation}
          onClose={handleCloseSheet}
          flavorMatch={flavorInfoMap.get(selectedLocation.id)}
        />
      )}
    </div>
  );
}
