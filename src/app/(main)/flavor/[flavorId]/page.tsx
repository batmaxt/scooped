"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, IceCreamCone, Star, Info } from "lucide-react";
import { fetchFlavorBySlug } from "@/queries/flavors";
import { flavorColor, CATEGORY_LABELS } from "@/lib/flavor-utils";

export default function FlavorDetailPage() {
  const params = useParams();
  const slug = params.flavorId as string;

  const { data: flavor, isLoading } = useQuery({
    queryKey: ["flavor", slug],
    queryFn: () => fetchFlavorBySlug(slug),
    staleTime: 30 * 60 * 1000,
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
  const categoryLabel = flavor.category ? CATEGORY_LABELS[flavor.category] || flavor.category : null;

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
          className="size-24 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: color + "22" }}
        >
          <IceCreamCone className="size-12" style={{ color }} />
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

      {/* Disclaimer */}
      <div className="px-5">
        <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4 flex items-start gap-3">
          <Info className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {flavor.brand
              ? `This flavor is part of ${flavor.brand.name}'s catalog. Availability varies by location.`
              : "This is a popular ice cream flavor available at many shops. Availability varies by location."}
          </p>
        </div>
      </div>
    </div>
  );
}
