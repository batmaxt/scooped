"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  IceCreamCone,
  Star,
  Search,
  BellRing,
  MapPin,
} from "lucide-react";
import { fetchFlavorBySlug } from "@/queries/flavors";
import { searchLocationsByFlavor } from "@/queries/locations";
import { flavorColor, flavorEmoji, CATEGORY_LABELS, INFORMATIVE_CATEGORIES } from "@/lib/flavor-utils";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { AddAlertSheet } from "@/components/shared/AddAlertSheet";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocation } from "@/hooks/useLocation";

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return "nearby";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export default function FlavorDetailPage() {
  const params = useParams();
  const slug = params.flavorId as string;
  const { user } = useAuth();
  const { position } = useLocation();
  const [alertOpen, setAlertOpen] = useState(false);

  const { data: flavor, isLoading } = useQuery({
    queryKey: ["flavor", slug],
    queryFn: () => fetchFlavorBySlug(slug),
    staleTime: 30 * 60 * 1000,
  });

  const lat = position?.latitude ?? 40.748;
  const lng = position?.longitude ?? -73.985;

  // Where is this flavor confirmed right now?
  const { data: spots = [], isLoading: spotsLoading } = useQuery({
    queryKey: ["flavor-spots", flavor?.name, lat, lng],
    queryFn: () => searchLocationsByFlavor(flavor!.name, lat, lng, 80000),
    enabled: !!flavor?.name,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16">
        <div className="px-5 pt-14 space-y-4">
          <div className="h-8 w-24 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="flex justify-center">
            <div className="size-24 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          </div>
          <div className="h-8 w-48 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-5 w-32 mx-auto bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!flavor) {
    return (
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 flex flex-col items-center justify-center">
        <IceCreamCone className="size-12 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground mb-4">Flavor not found</p>
        <Link
          href="/flavor-catalog"
          className="text-sm font-medium text-[#C4364A] hover:underline"
        >
          Back to catalog
        </Link>
      </div>
    );
  }

  const color = flavorColor(flavor.name);
  const categoryLabel =
    flavor.category && INFORMATIVE_CATEGORIES.has(flavor.category)
      ? CATEGORY_LABELS[flavor.category] || flavor.category
      : null;

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="px-5 pt-14 pb-4">
        <Link
          href="/flavor-catalog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[#2E1F1B] dark:hover:text-[#F5E6DC] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Flavor Catalog
        </Link>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center px-5 pb-6">
        <div
          className="size-24 rounded-full flex items-center justify-center mb-4 text-5xl"
          style={{ backgroundColor: color + "55" }}
          aria-hidden
        >
          {flavorEmoji(flavor.name)}
        </div>

        <h1 className="text-2xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] text-center leading-tight">
          {flavor.name}
        </h1>

        {flavor.brand && (
          <p className="text-sm text-muted-foreground mt-1">
            by{" "}
            <span className="font-medium text-[#2E1F1B] dark:text-[#F5E6DC]">
              {flavor.brand.name}
            </span>
          </p>
        )}

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
          {categoryLabel && (
            <span className="px-3 py-1 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30 text-[#C4364A] dark:text-[#F46B8F] text-xs font-semibold">
              {categoryLabel}
            </span>
          )}
          {flavor.avg_rating > 0 && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30 text-xs font-semibold text-[#2E1F1B] dark:text-[#F5E6DC]">
              <Star className="size-3 fill-[#F2B45A] text-[#F2B45A]" />
              {Number(flavor.avg_rating).toFixed(1)}
              <span className="text-muted-foreground font-normal ml-0.5">
                ({flavor.total_ratings})
              </span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full max-w-sm gap-3 mt-6">
          <Link
            href={`/search?q=${encodeURIComponent(flavor.name)}`}
            className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-[#C4364A] text-white text-sm font-semibold btn-shadow-cta active:scale-[0.98] transition-transform"
          >
            <Search className="size-4" />
            Find it near you
          </Link>
          {user && (
            <button
              onClick={() => setAlertOpen(true)}
              className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.15)] dark:border-white/10 text-sm font-semibold text-[#2E1F1B] dark:text-[#F5E6DC] active:scale-[0.98] transition-transform"
            >
              <BellRing className="size-4" />
              Alert me when it&apos;s nearby
            </button>
          )}
        </div>
      </div>

      {/* Scooped nearby */}
      <div className="px-5 pb-6">
        <h2 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-2 mb-3">
          <MapPin className="size-4 text-[#F46B8F]" />
          Scooped nearby
        </h2>
        {spotsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse"
              />
            ))}
          </div>
        ) : spots.length > 0 ? (
          <div className="space-y-2">
            {spots.slice(0, 5).map((spot) => (
              <Link key={spot.id} href={`/location/${spot.slug}`}>
                <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4 mb-2 press-card">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                        {spot.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {spot.city}
                        </span>
                        <FreshnessBadge
                          lastConfirmedAt={spot.last_confirmed_at}
                          source={spot.availability_source}
                        />
                      </div>
                    </div>
                    {spot.distance_meters > 0 && (
                      <span className="text-xs font-semibold text-[#F46B8F] shrink-0">
                        {formatDistance(spot.distance_meters)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-5 text-center">
            <IceCreamCone className="size-7 text-[#F46B8F]/30 mx-auto mb-2" />
            <p className="text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC]">
              No confirmed spots yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Spot it in the wild? Scan the menu at that shop and you&apos;ll be
              the first to put it on the map.
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {flavor.description && (
        <div className="px-5 pb-6">
          <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4">
            <p className="text-sm text-[#2E1F1B] dark:text-[#F5E6DC] leading-relaxed">
              {flavor.description}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {flavor.tags && flavor.tags.length > 0 && (
        <div className="px-5 pb-6">
          <div className="flex flex-wrap gap-2">
            {flavor.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {user && flavor && (
        <AddAlertSheet
          open={alertOpen}
          onOpenChange={setAlertOpen}
          defaultTab="flavor"
          defaultTargetId={flavor.id}
          defaultTargetName={flavor.name}
        />
      )}
    </div>
  );
}
