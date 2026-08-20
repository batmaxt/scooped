"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  IceCreamCone,
  MapPin,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { useLocation } from "@/hooks/useLocation";
import { searchLocationsByFlavor } from "@/queries/locations";
import type { FlavorSearchResult } from "@/queries/locations";
import { fetchFlavors } from "@/queries/checkins";
import { flavorColor, flavorEmoji } from "@/lib/flavor-utils";
import { geocodeForward } from "@/lib/google-maps/geocode";
import type { GeocodeFeature } from "@/lib/google-maps/geocode";
import { Badge } from "@/components/ui/badge";

interface SearchCenter {
  lat: number;
  lng: number;
  label: string;
}

// "Near: current location / any address" control — the missing half of the
// core question: "what's scooping near HERE?"
function NearPicker({
  center,
  onChange,
}: {
  center: SearchCenter | null;
  onChange: (c: SearchCenter | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeFeature[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (addressQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSuggestions(await geocodeForward(addressQuery));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [addressQuery]);

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-xs font-semibold text-[#2E1F1B] dark:text-[#F5E6DC]"
        >
          <MapPin className="size-3.5 text-[#C4364A]" />
          Near: {center ? center.label : "Current location"}
        </button>
        {center && (
          <button
            onClick={() => onChange(null)}
            className="p-1 text-neutral-400 hover:text-neutral-600"
            aria-label="Reset to current location"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#C4364A] z-10" />
      <Input
        placeholder="Enter an address, town, or zip..."
        value={addressQuery}
        onChange={(e) => setAddressQuery(e.target.value)}
        autoFocus
        className="pl-10 pr-10 h-11 rounded-full bg-white dark:bg-card border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm"
      />
      <button
        onClick={() => {
          setEditing(false);
          setAddressQuery("");
          setSuggestions([]);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 z-10"
        aria-label="Cancel address entry"
      >
        <X className="size-4" />
      </button>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-2xl elevation-2 border border-neutral-100 dark:border-neutral-800 overflow-hidden z-50">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              onClick={() => {
                onChange({ lat: s.latitude, lng: s.longitude, label: s.name });
                setEditing(false);
                setAddressQuery("");
                setSuggestions([]);
              }}
              className="flex items-center gap-3 px-3 py-3 w-full text-left hover:bg-[#FFF3EE]/50 dark:hover:bg-[#332520]/20 border-b border-neutral-50 dark:border-neutral-800 last:border-b-0"
            >
              <MapPin className="size-4 text-[#F46B8F] shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{s.name}</p>
                <p className="text-xs text-neutral-500 truncate">
                  {s.full_address}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const SUGGESTIONS = [
  "pistachio",
  "ube",
  "black sesame",
  "salted caramel",
  "mint chip",
  "non-dairy",
  "cookie dough",
  "mango sorbet",
  "matcha",
  "cherry",
];

const FLAVOR_THUMBS = [
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=200&q=80",
];

function flavorThumb(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FLAVOR_THUMBS[Math.abs(hash) % FLAVOR_THUMBS.length];
}

const LOCATION_THUMBS: Record<string, string> = {
  scoop_shop: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=200&q=80",
  supermarket: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=200&q=80",
};

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Shop",
  supermarket: "Market",
};

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return "nearby";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [center, setCenter] = useState<SearchCenter | null>(null);
  const { position } = useLocation();

  const searchLat = center?.lat ?? position?.latitude ?? 40.748;
  const searchLng = center?.lng ?? position?.longitude ?? -73.985;

  const trimmed = query.trim();
  const { data: allResults = [], isLoading } = useQuery({
    queryKey: ["flavor-search", trimmed, searchLat, searchLng],
    queryFn: () => searchLocationsByFlavor(trimmed, searchLat, searchLng, 80000),
    enabled: trimmed.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
  // Supermarkets are dormant until Phase 3 — scoop shops only
  const results = allResults.filter((r) => r.location_type === "scoop_shop");

  // Catalog fallback: when no shop has confirmed this flavor nearby, show
  // matching catalog flavors so search never dead-ends.
  const { data: catalogMatches = [] } = useQuery({
    queryKey: ["catalog-fallback", trimmed],
    queryFn: () => fetchFlavors(trimmed),
    enabled: trimmed.length >= 2 && !isLoading && results.length === 0,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Hero */}
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
          Search
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Search for any flavor
        </h1>
      </div>

      {/* Search input */}
      <div className="px-5 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10" />
          <Input
            placeholder="Try pistachio, ube, salted caramel..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 pr-10 h-12 rounded-full bg-white dark:bg-card border-[rgba(93,64,55,0.12)] dark:border-white/10 text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 z-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-3">
          <NearPicker center={center} onChange={setCenter} />
        </div>
      </div>

      {/* Suggestion pills (when no query) */}
      {!trimmed && (
        <div className="px-5 pb-5">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, index) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#F46B8F] bg-[#FFF7ED] dark:bg-[#2A1E1A]/20 border border-[rgba(93,64,55,0.12)] dark:border-white/5 hover:bg-[#FFF3EE] dark:hover:bg-[#332520]/30 transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-5 space-y-3">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-[#F2B45A] mb-3" />
            <span className="text-sm text-muted-foreground">
              Searching for &ldquo;{trimmed}&rdquo;...
            </span>
          </div>
        )}

        {!isLoading && trimmed.length >= 2 && results.length === 0 && (
          <>
            <div className="flex flex-col items-center justify-center pt-10 pb-6 text-center">
              <div className="rounded-full bg-[#FFF3EE] dark:bg-[#2A1E1A]/30 p-4 mb-4">
                <IceCreamCone className="size-8 text-[#F2B45A]" />
              </div>
              <p className="font-semibold text-[#2E1F1B] dark:text-[#F5E6DC]">
                No shops have confirmed this one nearby yet
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Spot it in the wild? Scan the menu and put it on the map.
              </p>
            </div>

            {catalogMatches.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  In the flavor catalog
                </p>
                {catalogMatches.slice(0, 6).map((flavor) => (
                  <Link
                    key={flavor.id}
                    href={`/flavor/${flavor.slug}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-3.5 hover:border-[#F46B8F]/30 transition-colors">
                      <div
                        className="flex items-center justify-center size-10 rounded-full text-lg shrink-0"
                        style={{ backgroundColor: flavorColor(flavor.name) }}
                        aria-hidden
                      >
                        {flavorEmoji(flavor.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                          {flavor.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {flavor.brand
                            ? flavor.brand.name
                            : "Tap to set an alert for when it appears nearby"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && results.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((result: FlavorSearchResult) => (
              <Link
                key={`${result.id}-${result.matching_flavor_name}`}
                href={`/location/${result.slug}`}
                className="block"
              >
                <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4 hover:border-[#F46B8F]/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Image
                      src={flavorThumb(result.matching_flavor_name)}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover shrink-0"
                      unoptimized
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <IceCreamCone className="size-4 text-[#F46B8F] shrink-0" />
                        <h3 className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                          {result.matching_flavor_name}
                        </h3>
                      </div>
                      {result.matching_brand_name && (
                        <p className="text-sm text-[#F46B8F] font-medium ml-6">
                          by {result.matching_brand_name}
                        </p>
                      )}
                    </div>
                    <FreshnessBadge
                      lastConfirmedAt={result.last_confirmed_at}
                      source={result.availability_source}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#FFF3EE] dark:border-white/5">
                    <Image
                      src={LOCATION_THUMBS[result.location_type] || LOCATION_THUMBS.scoop_shop}
                      alt=""
                      width={28}
                      height={28}
                      className="size-7 rounded-full object-cover shrink-0"
                      unoptimized
                    />
                    {result.location_type !== "scoop_shop" && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0.5 bg-[#FFF3EE] dark:bg-[#2A1E1A]/30 text-[#2E1F1B] dark:text-[#A8897E] shrink-0"
                      >
                        {TYPE_LABELS[result.location_type] || result.location_type}
                      </Badge>
                    )}
                    {result.is_chain && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#F0E6FF] dark:bg-purple-900/30 text-[#7C3AED] dark:text-purple-300 text-[10px] font-semibold shrink-0">
                        Chain
                      </span>
                    )}
                    <span className="font-medium text-sm truncate">{result.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-auto flex items-center gap-1">
                      <MapPin className="size-3" />
                      {formatDistance(result.distance_meters)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Empty state CTA card (when no query) */}
        {!trimmed && (
          <div className="bg-[#FFF5E6] dark:bg-amber-900/10 rounded-2xl p-6 text-center border border-amber-200/40 dark:border-amber-800/20">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#FFF0D4] dark:bg-amber-900/20 mx-auto mb-3">
              <Sparkles className="size-6 text-[#F2B45A]" />
            </div>
            <p className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC] mb-1">
              Search for any flavor or brand
            </p>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Find flavors at scoop shops and retail stores near you &mdash; or discover
              something new.
            </p>
            <Link
              href="/flavor-catalog"
              className="inline-block mt-3 text-sm font-semibold text-[#C4364A] hover:underline"
            >
              Browse the full flavor catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
