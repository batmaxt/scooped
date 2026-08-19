"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MapPin, Star, ChevronRight, ChevronDown, Loader2, X, Navigation, Map as MapIcon, Store } from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { MapBottomSheet } from "@/components/map/MapBottomSheet";
import { SearchBar } from "@/components/shared/SearchBar";
import { useLocation } from "@/hooks/useLocation";
import { useMapStore } from "@/stores/mapStore";
import { fetchNearbyLocations } from "@/queries/locations";
import { Badge } from "@/components/ui/badge";
import type { Location } from "@/types/models";
import { monogramGradient } from "@/lib/location-utils";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Shop",
  supermarket: "Market",
};

const TYPE_COLORS: Record<string, string> = {
  scoop_shop: "bg-[#FFF3EE] text-[#C4364A] dark:bg-[#332520]/30 dark:text-[#F46B8F]",
  supermarket: "bg-[#FFF3EE] text-[#2E1F1B] dark:bg-[#2A1E1A]/30 dark:text-[#A8897E]",
};

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "scoop_shop", label: "Shops" },
  { key: "supermarket", label: "Supermarkets" },
];

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return "nearby";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

interface SearchCenter {
  lat: number;
  lng: number;
  label: string;
}

// A display item is either a single location or a collapsed chain group
type DisplayItem =
  | { type: "location"; location: Location }
  | { type: "chain_group"; chainName: string; closest: Location; others: Location[] };

export default function DiscoverPage() {
  const { position } = useLocation();
  const { filters, setSelectedLocationId } = useMapStore();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchCenter, setSearchCenter] = useState<SearchCenter | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());

  const activeLat = searchCenter?.lat ?? position?.latitude ?? 40.748;
  const activeLng = searchCenter?.lng ?? position?.longitude ?? -73.985;

  const filterTypes = typeFilter === "all" ? undefined : [typeFilter];

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["nearby-locations", activeLat, activeLng, filterTypes],
    queryFn: () =>
      fetchNearbyLocations(activeLat, activeLng, 800000, filterTypes),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const normalize = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const filteredLocations = useMemo(() => {
    if (!filters.searchQuery) return locations;
    const query = normalize(filters.searchQuery);
    if (query.length < 1) return locations;
    return locations.filter(
      (loc) =>
        normalize(loc.name).includes(query) ||
        normalize(loc.address_line1).includes(query) ||
        normalize(loc.city).includes(query)
    );
  }, [locations, filters.searchQuery, normalize]);

  // Auto-detect chains: any base name with 5+ locations gets grouped.
  // Also respects explicit chain_name from DB.
  const displayItems = useMemo<DisplayItem[]>(() => {
    const MIN_GROUP_SIZE = 5;

    // Extract base name by stripping location suffixes like "- Syosset"
    const getGroupKey = (loc: Location): string => {
      if (loc.is_chain && loc.chain_name) return loc.chain_name;
      return loc.name
        .replace(/\s+[-–—]\s*[A-Z][a-zA-Z\s.']+$/, "")
        .replace(/\s*\([^)]+\)\s*$/, "")
        .trim();
    };

    // First pass: count occurrences of each base name
    const groupCounts = new Map<string, number>();
    for (const loc of filteredLocations) {
      const key = getGroupKey(loc);
      groupCounts.set(key, (groupCounts.get(key) || 0) + 1);
    }

    // Second pass: build groups for names with 5+ locations
    const chainGroups = new Map<string, Location[]>();
    for (const loc of filteredLocations) {
      const key = getGroupKey(loc);
      if ((loc.is_chain && loc.chain_name) || (groupCounts.get(key) || 0) >= MIN_GROUP_SIZE) {
        const groupName = loc.is_chain && loc.chain_name ? loc.chain_name : key;
        const group = chainGroups.get(groupName) || [];
        group.push(loc);
        chainGroups.set(groupName, group);
      }
    }

    // Build combined list preserving distance order
    const items: DisplayItem[] = [];
    const usedChains = new Set<string>();

    for (const loc of filteredLocations) {
      const key = getGroupKey(loc);
      const groupName = loc.is_chain && loc.chain_name ? loc.chain_name : key;
      const isGrouped = chainGroups.has(groupName);

      if (isGrouped) {
        if (usedChains.has(groupName)) continue;
        usedChains.add(groupName);
        const group = chainGroups.get(groupName)!;
        if (group.length === 1) {
          items.push({ type: "location", location: group[0] });
        } else {
          items.push({
            type: "chain_group",
            chainName: groupName,
            closest: group[0],
            others: group.slice(1),
          });
        }
      } else {
        items.push({ type: "location", location: loc });
      }
    }

    return items;
  }, [filteredLocations]);

  const toggleChainExpand = useCallback((chainName: string) => {
    setExpandedChains((prev) => {
      const next = new Set(prev);
      if (next.has(chainName)) next.delete(chainName);
      else next.add(chainName);
      return next;
    });
  }, []);

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

  const handleAddressSelect = useCallback(
    (lat: number, lng: number, label: string) => {
      setSearchCenter({ lat, lng, label });
      setSelectedLocation(null);
      setSelectedLocationId(null);
    },
    [setSelectedLocationId]
  );

  const clearSearchCenter = useCallback(() => {
    setSearchCenter(null);
  }, []);

  // WebGL detection
  const webglSupported = useMemo(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  }, []);

  // Total unique locations count (expanding chain groups)
  const totalCount = useMemo(() => {
    return displayItems.reduce((sum, item) => {
      if (item.type === "location") return sum + 1;
      return sum + 1 + item.others.length;
    }, 0);
  }, [displayItems]);

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Hero */}
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F] mb-1">
          Discover
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Scoop spots near you
        </h1>
      </div>

      {/* Search + Map toggle */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar locations={locations} onAddressSelect={handleAddressSelect} />
          </div>
          {webglSupported && (
            <button
              onClick={() => setShowMap(!showMap)}
              className={`shrink-0 size-12 rounded-full flex items-center justify-center border transition-colors ${
                showMap
                  ? "bg-[#C4364A] text-white border-[#C4364A]"
                  : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border-[rgba(93,64,55,0.12)] dark:border-white/10"
              }`}
            >
              <MapIcon className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* "Near: [address]" pill */}
      {searchCenter && (
        <div className="px-5 mb-3">
          <div className="flex items-center gap-2 bg-[#FFF3EE] dark:bg-[#332520]/30 rounded-full px-4 py-2.5">
            <Navigation className="size-3.5 text-[#F46B8F] shrink-0" />
            <span className="text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] truncate flex-1">
              Near: {searchCenter.label}
            </span>
            <button
              onClick={clearSearchCenter}
              className="p-1 rounded-full hover:bg-[#C4364A]/10 text-[#F46B8F] shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTypeFilter(opt.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                typeFilter === opt.key
                  ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                  : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/10"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map (collapsible) */}
      {showMap && webglSupported && (
        <div className="px-5 mb-4">
          <div
            className="relative rounded-2xl overflow-hidden border-2 border-[rgba(93,64,55,0.12)] dark:border-white/5/50"
            style={{ height: "240px" }}
          >
            <MapView
              locations={filteredLocations}
              onMarkerClick={handleMarkerClick}
              userPosition={
                searchCenter
                  ? { latitude: searchCenter.lat, longitude: searchCenter.lng }
                  : position
              }
            />
            {isLoading && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-[#2E1F1B]" />
                <span className="text-xs font-medium text-neutral-600">Loading...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Count */}
      <div className="px-5 pb-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {totalCount} spot{totalCount !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Location list */}
      <div className="px-5 space-y-3">
        {isLoading && !locations.length ? (
          Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
            />
          ))
        ) : (
          displayItems.map((item, index) => {
            if (item.type === "location") {
              return (
                <LocationCard
                  key={item.location.id}
                  location={item.location}
                  index={index}
                />
              );
            }
            // Chain group
            const isExpanded = expandedChains.has(item.chainName);
            return (
              <div key={`chain-${item.chainName}`} className="space-y-2">
                <LocationCard
                  location={item.closest}
                  index={index}
                  chainBadge={
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleChainExpand(item.chainName);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0E6FF] dark:bg-purple-900/30 text-[#7C3AED] dark:text-purple-300 text-[10px] font-semibold shrink-0 hover:bg-[#E4D4FF] transition-colors"
                    >
                      <Store className="size-2.5" />
                      +{item.others.length} nearby
                      <ChevronDown
                        className={`size-2.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  }
                />
                {isExpanded &&
                  item.others.map((loc, i) => (
                    <div key={loc.id} className="ml-4">
                      <LocationCard location={loc} index={index + i + 1} isChainChild />
                    </div>
                  ))}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom sheet for selected marker */}
      {selectedLocation && (
        <MapBottomSheet
          location={selectedLocation}
          onClose={handleCloseSheet}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Location Card component
// ---------------------------------------------------------------------------

function LocationCard({
  location,
  index,
  chainBadge,
  isChainChild,
}: {
  location: Location;
  index: number;
  chainBadge?: React.ReactNode;
  isChainChild?: boolean;
}) {
  return (
    <Link
      href={`/location/${location.slug}`}
      className="block animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
    >
      <div
        className={`bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4 hover:border-[#C4364A]/30 transition-colors ${
          isChainChild ? "opacity-90" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="size-12 rounded-xl overflow-hidden shrink-0">
            {location.photo_url ? (
              <img
                src={location.photo_url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${monogramGradient(location.name)[0]}, ${monogramGradient(location.name)[1]})`,
                }}
              >
                <span className="text-lg font-bold font-heading text-white/90 select-none">
                  {location.name[0]}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {location.location_type !== "scoop_shop" && (
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0 shrink-0 ${TYPE_COLORS[location.location_type] || ""}`}
                >
                  {TYPE_LABELS[location.location_type] || location.location_type}
                </Badge>
              )}
              {location.is_chain && !chainBadge && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full bg-[#F0E6FF] dark:bg-purple-900/30 text-[#7C3AED] dark:text-purple-300 text-[10px] font-semibold shrink-0">
                  Chain
                </span>
              )}
              {chainBadge}
              <h3 className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                {location.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{location.city}</span>
              {(location.distance_meters ?? 0) > 0 && (
                <span className="shrink-0 ml-1">
                  · {formatDistance(location.distance_meters!)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {location.avg_rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F2B45A] text-[#F2B45A]" />
                <span className="text-xs font-semibold">
                  {Number(location.avg_rating).toFixed(1)}
                </span>
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-neutral-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
