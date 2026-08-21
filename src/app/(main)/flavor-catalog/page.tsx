"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, IceCreamCone, X, Star, MapPin, LocateFixed } from "lucide-react";
import { fetchNearbyFlavors, type NearbyFlavor } from "@/queries/flavors";
import { searchLocationsByFlavor } from "@/queries/locations";
import { flavorColor, flavorEmoji, CATEGORY_LABELS, INFORMATIVE_CATEGORIES } from "@/lib/flavor-utils";
import { useLocation } from "@/hooks/useLocation";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import type { Flavor } from "@/types/models";

// Format chips are multi-select; Non-Dairy is a separate dietary toggle that
// can combine with any of them (e.g. non-dairy + soft serve).
const FORMAT_FILTERS = [
  { value: "ice_cream", label: "Ice Cream" },
  { value: "classic", label: "Classic" },
  { value: "sorbet", label: "Sorbet" },
  { value: "soft_serve", label: "Soft Serve" },
  { value: "gelato", label: "Gelato" },
];

function isNonDairy(f: Flavor): boolean {
  if (f.category === "non_dairy" || f.category === "dairy_free") return true;
  if (f.category === "sorbet") return true;
  if (f.tags?.some((t) => /vegan|dairy.?free|non.?dairy/i.test(t))) return true;
  return /vegan|dairy.?free|non.?dairy|oat milk|sorbet/i.test(f.name);
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return "right here";
  return `${miles.toFixed(1)} mi`;
}

export default function FlavorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [nonDairyOnly, setNonDairyOnly] = useState(false);
  const { position, isLoading: locating, requestLocation } = useLocation();

  const toggleFormat = useCallback((value: string) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }, []);

  const { data: nearby = [], isLoading } = useQuery({
    queryKey: ["nearbyFlavors", position?.latitude, position?.longitude],
    queryFn: () => fetchNearbyFlavors(position!.latitude, position!.longitude),
    enabled: !!position,
    staleTime: 5 * 60 * 1000,
  });

  // Searching a flavor should point you beyond your zone: closest shops
  // that scoop it, however far. Debounced by react-query's key.
  const trimmedQuery = searchQuery.trim();
  const { data: farSpots = [] } = useQuery({
    queryKey: ["farFlavorSpots", trimmedQuery, position?.latitude, position?.longitude],
    queryFn: () =>
      searchLocationsByFlavor(trimmedQuery, position!.latitude, position!.longitude, 250000),
    enabled: !!position && trimmedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
  // Only shops beyond the 5-mile browse zone belong in "worth the trip"
  const worthTheTrip = farSpots
    .filter((s) => s.location_type === "scoop_shop" && (s.distance_meters ?? 0) > 8047)
    .slice(0, 10);

  const normalize = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const filtered = useMemo(() => {
    const query = normalize(searchQuery);
    return nearby.filter(({ flavor }) => {
      if (selectedFormats.size > 0 && !selectedFormats.has(flavor.category || ""))
        return false;
      if (nonDairyOnly && !isNonDairy(flavor)) return false;
      if (query && !normalize(flavor.name).includes(query)) return false;
      return true;
    });
  }, [nearby, searchQuery, selectedFormats, nonDairyOnly, normalize]);

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Hero */}
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
          Flavors
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Scoopable near you
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every flavor on a menu within 5 miles — and where to get it.
        </p>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nearby flavors..."
            className="w-full h-12 pl-10 pr-10 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm text-[#2E1F1B] dark:text-[#F5E6DC] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#F46B8F]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Dietary toggle + format chips (multi-select, combinable) */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setNonDairyOnly((v) => !v)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              nonDairyOnly
                ? "bg-[#4A9B84] text-white"
                : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border-2 border-[#7CC9B4]"
            }`}
          >
            🌱 Non-Dairy
          </button>
          {FORMAT_FILTERS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => toggleFormat(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFormats.has(cat.value)
                  ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                  : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* No location yet */}
      {!position ? (
        <div className="text-center py-20 px-8">
          <MapPin className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-base font-semibold text-[#2E1F1B] dark:text-[#F5E6DC] mb-1">
            Where are you scooping?
          </p>
          <p className="text-sm text-muted-foreground mb-5">
            Turn on location to see every flavor within 5 miles of you.
          </p>
          <button
            onClick={requestLocation}
            disabled={locating}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C4364A] text-white text-sm font-semibold disabled:opacity-60"
          >
            <LocateFixed className="size-4" />
            {locating ? "Locating..." : "Use my location"}
          </button>
        </div>
      ) : isLoading ? (
        <div className="px-5 space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="text-center py-10 px-8">
              <IceCreamCone className="size-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {nearby.length === 0
                  ? "No mapped flavors within 5 miles yet. Be the first — check in at a shop and put it on the board."
                  : "Nothing within 5 miles matches."}
              </p>
            </div>
          ) : (
            <>
              <div className="px-5 pb-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {filtered.length} flavor{filtered.length !== 1 ? "s" : ""} within 5 miles
                </p>
              </div>
              <div className="px-5 space-y-3">
                {filtered.map((nf) => (
                  <NearbyFlavorCard key={nf.flavor.id} nf={nf} />
                ))}
              </div>
            </>
          )}

          {/* Beyond the zone: a flavor search points you somewhere worth the trip */}
          {trimmedQuery.length >= 2 && worthTheTrip.length > 0 && (
            <div className="mt-2">
              <div className="px-5 pb-3 pt-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  🚗 Worth the trip
                </p>
              </div>
              <div className="px-5 space-y-3">
                {worthTheTrip.map((spot) => (
                  <Link key={spot.id} href={`/location/${spot.slug}`}>
                    <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-3.5 hover:border-[#C4364A]/30 transition-colors mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-12 rounded-xl shrink-0 flex items-center justify-center text-xl"
                          style={{ backgroundColor: flavorColor(spot.matching_flavor_name || "") + "40" }}
                          aria-hidden
                        >
                          {flavorEmoji(spot.matching_flavor_name || "")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[15px] text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
                            {spot.matching_flavor_name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {spot.name} · {spot.city} · {formatDistance(spot.distance_meters ?? 0)}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <FreshnessBadge
                            lastConfirmedAt={spot.last_confirmed_at ?? null}
                            source={spot.availability_source ?? undefined}
                            compact
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NearbyFlavorCard({ nf }: { nf: NearbyFlavor }) {
  const { flavor } = nf;
  const color = flavorColor(flavor.name);
  const categoryLabel =
    flavor.category && INFORMATIVE_CATEGORIES.has(flavor.category)
      ? CATEGORY_LABELS[flavor.category] || flavor.category
      : null;

  return (
    <Link href={`/flavor/${flavor.slug}`}>
      <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-3.5 hover:border-[#C4364A]/30 transition-colors mb-3">
        <div className="flex items-center gap-3">
          <div
            className="size-12 rounded-xl shrink-0 flex items-center justify-center text-xl"
            style={{ backgroundColor: color + "40" }}
            aria-hidden
          >
            {flavorEmoji(flavor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-[15px] text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
                {flavor.name}
              </h3>
              {categoryLabel && (
                <span className="px-1.5 py-0 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30 text-[#C4364A] dark:text-[#F46B8F] text-[9px] font-semibold">
                  {categoryLabel}
                </span>
              )}
              {flavor.avg_rating > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Star className="size-2.5 fill-[#F2B45A] text-[#F2B45A]" />
                  {Number(flavor.avg_rating).toFixed(1)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {nf.nearestLocationName} · {formatDistance(nf.distanceMeters)}
              {nf.shopCount > 1 && ` · +${nf.shopCount - 1} more shop${nf.shopCount > 2 ? "s" : ""}`}
            </p>
          </div>
          <div className="shrink-0">
            <FreshnessBadge lastConfirmedAt={nf.lastConfirmedAt} source={nf.source ?? undefined} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}
