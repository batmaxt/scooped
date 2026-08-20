"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, IceCreamCone, X, Star } from "lucide-react";
import { fetchAllFlavorsGroupedByBrand, fetchAllBrands } from "@/queries/flavors";
import { flavorColor, flavorEmoji, CATEGORY_LABELS, INFORMATIVE_CATEGORIES } from "@/lib/flavor-utils";
import type { Flavor, Brand } from "@/types/models";

const CATEGORY_FILTERS = [
  { value: null, label: "All" },
  { value: "ice_cream", label: "Ice Cream" },
  { value: "classic", label: "Classic" },
  { value: "sorbet", label: "Sorbet" },
  { value: "soft_serve", label: "Soft Serve" },
  { value: "italian_ice", label: "Italian Ice" },
  { value: "gelato", label: "Gelato" },
  { value: "non_dairy", label: "Non-Dairy" },
  { value: "frozen_treat", label: "Frozen Treat" },
];

export default function FlavorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["allFlavorsGrouped"],
    queryFn: fetchAllFlavorsGroupedByBrand,
    staleTime: 30 * 60 * 1000,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["allBrands"],
    queryFn: fetchAllBrands,
    staleTime: 30 * 60 * 1000,
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

  const filteredGroups = useMemo(() => {
    const query = normalize(searchQuery);
    return groups
      .filter((g) => !selectedBrandId || g.brand?.id === selectedBrandId)
      .map((g) => ({
        ...g,
        flavors: g.flavors.filter((f) => {
          if (selectedCategory && f.category !== selectedCategory) return false;
          if (query && !normalize(f.name).includes(query)) return false;
          return true;
        }),
      }))
      .filter((g) => g.flavors.length > 0);
  }, [groups, searchQuery, selectedBrandId, selectedCategory, normalize]);

  const totalFiltered = filteredGroups.reduce((s, g) => s + g.flavors.length, 0);

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Hero */}
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
          Flavor Catalog
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Every scoop, every brand
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse the flavors each brand is known for.
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
            placeholder="Search flavors..."
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

      {/* Category chips */}
      <div className="px-5 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.value ?? "all"}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.value ? null : cat.value
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                  : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand chips */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedBrandId(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedBrandId
                ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/10"
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrandId(selectedBrandId === brand.id ? null : brand.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedBrandId === brand.id
                  ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                  : "bg-white dark:bg-card text-[#2E1F1B] dark:text-[#F5E6DC] border border-[rgba(93,64,55,0.12)] dark:border-white/10"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-5 pb-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {totalFiltered} flavor{totalFiltered !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Flavor list */}
      <div className="px-5 space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <div key={i}>
              <div className="h-6 w-40 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mb-3" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }, (_, j) => (
                  <div key={j} className="h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
                ))}
              </div>
            </div>
          ))
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16">
            <IceCreamCone className="size-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No flavors found</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.brand?.id || "generic"}>
              {/* Brand header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: flavorColor(group.brand?.name || "Classic") }}
                >
                  {(group.brand?.name || "C")[0]}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                    {group.brand?.name || "Classic Favorites"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground">
                    Known for {group.flavors.length} flavor{group.flavors.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Flavor grid */}
              <div className="grid grid-cols-2 gap-3">
                {group.flavors.map((flavor) => (
                  <FlavorCard key={flavor.id} flavor={flavor} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FlavorCard({ flavor }: { flavor: Flavor }) {
  const color = flavorColor(flavor.name);
  const categoryLabel =
    flavor.category && INFORMATIVE_CATEGORIES.has(flavor.category)
      ? CATEGORY_LABELS[flavor.category] || flavor.category
      : null;

  return (
    <Link href={`/flavor/${flavor.slug}`}>
      <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-3 hover:border-[#C4364A]/30 transition-colors h-full">
        <div className="flex items-start gap-2.5">
          <div
            className="size-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
            style={{ backgroundColor: color + "40" }}
            aria-hidden
          >
            {flavorEmoji(flavor.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[13px] text-[#2E1F1B] dark:text-[#F5E6DC] line-clamp-3 leading-tight">
              {flavor.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
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
          </div>
        </div>
      </div>
    </Link>
  );
}
