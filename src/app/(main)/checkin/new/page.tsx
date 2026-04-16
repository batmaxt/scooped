"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Search,
  MapPin,
  IceCreamCone,
  Camera,
  X,
  ChevronRight,
  Check,
  Loader2,
  Plus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createCheckin,
  fetchFlavors,
  fetchLocationFlavors,
} from "@/queries/checkins";
import { fetchAllLocations } from "@/queries/locations";
import { checkAndAwardBadges } from "@/queries/badges";
import { uploadCheckinPhoto } from "@/queries/checkinPhotos";
import { ModerationError } from "@/lib/moderation/nsfwCheck";
import { BadgeCelebration } from "@/components/shared/BadgeCelebration";
import type { Location, Flavor, Availability } from "@/types/models";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { key: "location", label: "Where?" },
  { key: "rate", label: "How?" },
  { key: "flavor", label: "What?" },
  { key: "details", label: "Show it!" },
  { key: "review", label: "Post" },
] as const;

const TOTAL_STEPS = STEPS.length;

const SUGGESTED_TAGS = [
  "creamy",
  "rich",
  "refreshing",
  "unique",
  "classic",
  "too sweet",
  "not sweet enough",
  "great texture",
  "huge scoops",
  "good value",
  "must try",
  "seasonal",
  "dairy-free",
  "vegan",
  "kid-friendly",
];

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
};

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex flex-col items-center gap-1.5 relative">
          {/* Connector line */}
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "absolute top-3.5 left-[calc(50%+12px)] h-0.5 transition-colors duration-500",
                i < currentStep ? "bg-[#F46B8F]" : "bg-neutral-200 dark:bg-neutral-700"
              )}
              style={{ width: "calc(100% + 8px)" }}
            />
          )}
          {/* Circle */}
          <div
            className={cn(
              "relative z-10 flex items-center justify-center size-7 rounded-full text-xs font-bold transition-all duration-300",
              i < currentStep
                ? "bg-[#F46B8F] text-white shadow-sm"
                : i === currentStep
                  ? "bg-[#F46B8F] text-white ring-4 ring-[#FFF3EE] dark:ring-[#332520]/30 shadow-md"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
            )}
          >
            {i < currentStep ? (
              <Check className="size-3.5" />
            ) : (
              i + 1
            )}
          </div>
          {/* Label */}
          <span
            className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              i <= currentStep ? "text-[#F46B8F] dark:text-[#F46B8F]" : "text-neutral-400 dark:text-neutral-500"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Location Search
// ---------------------------------------------------------------------------

function StepLocation({
  onSelect,
  preselectedId,
}: {
  onSelect: (location: Location) => void;
  preselectedId?: string | null;
}) {
  const [search, setSearch] = useState("");

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["all-locations"],
    queryFn: fetchAllLocations,
  });

  // Auto-select when we have a preselected location
  useEffect(() => {
    if (preselectedId && locations.length > 0) {
      const match = locations.find((l) => l.id === preselectedId);
      if (match) onSelect(match);
    }
  }, [preselectedId, locations, onSelect]);

  // Normalize text for search: handle &, apostrophes, punctuation
  function normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[''`]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const filtered = locations.filter((loc) => {
    if (!search.trim()) return true;
    const q = normalize(search);
    if (q.length < 2) return true;
    return (
      normalize(loc.name).includes(q) ||
      normalize(loc.city).includes(q) ||
      normalize(loc.address_line1).includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold">Where are you?</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Search for the ice cream spot you visited
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
          autoFocus
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-500">No locations found</p>
          {search && (
            <p className="text-xs text-neutral-400 mt-1">
              Try a different search term
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[55vh] overflow-y-auto no-scrollbar pb-4">
          {filtered.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc)}
              className="w-full text-left"
            >
              <Card className="transition-all hover:shadow-md active:scale-[0.98]">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 shrink-0">
                    <MapPin className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{loc.name}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {loc.address_line1}, {loc.city}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {TYPE_LABELS[loc.location_type] || loc.location_type}
                      </Badge>
                      {loc.avg_rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-[#F2B45A] text-[#F2B45A]" />
                          <span className="text-xs text-neutral-500">
                            {Number(loc.avg_rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Flavor Selection
// ---------------------------------------------------------------------------

function StepFlavor({
  locationId,
  onSelect,
}: {
  locationId: string;
  onSelect: (flavor: {
    id?: string;
    name: string;
    brandId?: string;
    brandName?: string;
  }) => void;
}) {
  const [mode, setMode] = useState<"location" | "search" | "custom">(
    "location"
  );
  const [search, setSearch] = useState("");
  const [customName, setCustomName] = useState("");

  const { data: locationFlavors = [], isLoading: loadingLocal } = useQuery({
    queryKey: ["location-flavors", locationId],
    queryFn: () => fetchLocationFlavors(locationId),
  });

  const { data: allFlavors = [], isLoading: loadingAll } = useQuery({
    queryKey: ["flavors-search", search],
    queryFn: () => fetchFlavors(search),
    enabled: mode === "search" && search.length >= 1,
  });

  return (
    <div className="flex flex-col gap-4 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold">What did you have?</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Pick the flavor you tried, or skip if you just want to rate the
          location
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("location")}
          className={cn(
            "flex-1 text-sm font-medium py-2 px-3 rounded-lg border transition-colors",
            mode === "location"
              ? "bg-[#F46B8F] text-white border-[#F46B8F]"
              : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-[rgba(93,64,55,0.12)] dark:border-neutral-700"
          )}
        >
          At this spot
        </button>
        <button
          type="button"
          onClick={() => setMode("search")}
          className={cn(
            "flex-1 text-sm font-medium py-2 px-3 rounded-lg border transition-colors",
            mode === "search"
              ? "bg-[#F46B8F] text-white border-[#F46B8F]"
              : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-[rgba(93,64,55,0.12)] dark:border-neutral-700"
          )}
        >
          Search all
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={cn(
            "flex-1 text-sm font-medium py-2 px-3 rounded-lg border transition-colors",
            mode === "custom"
              ? "bg-[#F46B8F] text-white border-[#F46B8F]"
              : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-[rgba(93,64,55,0.12)] dark:border-neutral-700"
          )}
        >
          Custom
        </button>
      </div>

      {/* Location flavors */}
      {mode === "location" && (
        <>
          {loadingLocal ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : locationFlavors.length === 0 ? (
            <div className="text-center py-8">
              <IceCreamCone className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">
                No flavors listed for this spot yet
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Try searching all flavors or type a custom one
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pb-4">
              {locationFlavors.map((avail: Availability) => (
                <button
                  key={avail.id}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: avail.flavor?.id,
                      name: avail.flavor?.name || "Unknown",
                      brandId: avail.brand?.id,
                      brandName: avail.brand?.name,
                    })
                  }
                  className="w-full text-left"
                >
                  <Card className="transition-all hover:shadow-md active:scale-[0.98]">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3EE] shrink-0">
                        <IceCreamCone className="w-5 h-5 text-[#F46B8F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {avail.flavor?.name}
                        </p>
                        {avail.brand && (
                          <p className="text-xs text-neutral-500">
                            {avail.brand.name}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Search all flavors */}
      {mode === "search" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search flavors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
              autoFocus
            />
          </div>

          {loadingAll ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
          ) : allFlavors.length === 0 && search.length >= 1 ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500">
                No flavors match &ldquo;{search}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setCustomName(search);
                  setMode("custom");
                }}
                className="text-sm text-neutral-900 font-medium underline mt-2"
              >
                Add it as a custom flavor
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[45vh] overflow-y-auto no-scrollbar pb-4">
              {allFlavors.map((flavor: Flavor) => (
                <button
                  key={flavor.id}
                  type="button"
                  onClick={() =>
                    onSelect({
                      id: flavor.id,
                      name: flavor.name,
                      brandId: flavor.brand?.id,
                      brandName: flavor.brand?.name,
                    })
                  }
                  className="w-full text-left"
                >
                  <Card className="transition-all hover:shadow-md active:scale-[0.98]">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3EE] shrink-0">
                        <IceCreamCone className="w-5 h-5 text-[#F46B8F]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{flavor.name}</p>
                        {flavor.brand && (
                          <p className="text-xs text-neutral-500">
                            {flavor.brand.name}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Custom flavor */}
      {mode === "custom" && (
        <div className="space-y-4">
          <Input
            placeholder="e.g., Salted Caramel Brownie"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="h-11 rounded-xl"
            autoFocus
          />
          <Button
            onClick={() => onSelect({ name: customName.trim() })}
            disabled={!customName.trim()}
            className="w-full h-11 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Use this flavor
          </Button>
        </div>
      )}

      {/* Skip */}
      <button
        type="button"
        onClick={() => onSelect({ name: "" })}
        className="w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all"
      >
        Skip — I just want to rate the location
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Ratings
// ---------------------------------------------------------------------------

function StepRate({
  flavorName,
  ratings,
  onChange,
  onNext,
}: {
  flavorName: string;
  ratings: {
    location: number;
    flavor: number;
    brand: number;
    selection: number;
  };
  onChange: (
    ratings: Record<"location" | "flavor" | "brand" | "selection", number>
  ) => void;
  onNext: () => void;
}) {
  const [showOptional, setShowOptional] = useState(false);

  const update = (key: keyof typeof ratings, val: number) => {
    onChange({ ...ratings, [key]: val });
  };

  const hasRequiredRating = ratings.location > 0;

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold">How was it?</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Rate your experience{flavorName ? ` with ${flavorName}` : ""}
        </p>
      </div>

      <div className="space-y-6">
        <StarRating
          label="Overall location"
          value={ratings.location}
          onChange={(v) => update("location", v)}
          size="lg"
        />

        {flavorName && (
          <StarRating
            label={`Flavor — ${flavorName}`}
            value={ratings.flavor}
            onChange={(v) => update("flavor", v)}
            size="lg"
          />
        )}

        {!showOptional ? (
          <button
            type="button"
            onClick={() => setShowOptional(true)}
            className="text-sm text-neutral-500 underline"
          >
            + Add brand & selection ratings
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <StarRating
              label="Brand quality"
              value={ratings.brand}
              onChange={(v) => update("brand", v)}
              size="md"
            />
            <StarRating
              label="Flavor selection"
              value={ratings.selection}
              onChange={(v) => update("selection", v)}
              size="md"
            />
          </div>
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={!hasRequiredRating}
        className="w-full h-12 rounded-xl text-base mt-2"
      >
        Continue
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Details (notes, tags, photo)
// ---------------------------------------------------------------------------

function StepDetails({
  notes,
  tags,
  photoPreview,
  moderationError,
  onNotesChange,
  onTagsChange,
  onPhotoChange,
  onNext,
}: {
  notes: string;
  tags: string[];
  photoPreview: string | null;
  moderationError?: string | null;
  onNotesChange: (v: string) => void;
  onTagsChange: (v: string[]) => void;
  onPhotoChange: (file: File | null) => void;
  onNext: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    onPhotoChange(file);
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter((t) => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold">Add details</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Optional — add notes, tags, or a photo
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="How was the experience? Any recommendations?"
          rows={4}
          className={cn(
            "w-full min-w-0 rounded-xl border border-input bg-transparent px-3 py-2.5 text-base shadow-xs transition-[color,box-shadow] outline-none",
            "placeholder:text-muted-foreground resize-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "md:text-sm"
          )}
        />
      </div>

      {/* Photo */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Photo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <img
              src={photoPreview}
              alt="Check-in photo preview"
              className="w-full max-h-64 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                onPhotoChange(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:border-[#F46B8F]/40 hover:text-[#F46B8F] dark:hover:border-[#F46B8F]/40 dark:hover:text-[#F46B8F] transition-colors"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm">Add a photo</span>
          </button>
        )}
        <p className="text-xs text-neutral-400">
          JPG, PNG, or WebP — max 10 MB
        </p>
        {moderationError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400">{moderationError}</p>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tags</label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((tag) => {
            const isActive = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95",
                  isActive
                    ? "bg-[#F46B8F] text-white border-[#F46B8F]"
                    : "bg-white dark:bg-neutral-800 text-[#F46B8F] dark:text-[#F46B8F] border-[#FFF3EE] dark:border-[#332520]/30 hover:border-[#F46B8F]/40 dark:hover:border-[#F46B8F]/60"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 rounded-xl text-base mt-2"
      >
        Review check-in
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5: Review & Post
// ---------------------------------------------------------------------------

function StepReview({
  location,
  flavorName,
  brandName,
  ratings,
  notes,
  tags,
  photoPreview,
  isSubmitting,
  onSubmit,
}: {
  location: Location;
  flavorName: string;
  brandName: string;
  ratings: {
    location: number;
    flavor: number;
    brand: number;
    selection: number;
  };
  notes: string;
  tags: string[];
  photoPreview: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < count
            ? "fill-[#F2B45A] text-[#F2B45A]"
            : "fill-transparent text-neutral-200 dark:text-neutral-600"
        )}
      />
    ));

  return (
    <div className="flex flex-col gap-5 p-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold">Review your check-in</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Everything look right? Post when you&apos;re ready.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          {/* Location */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 shrink-0">
              <MapPin className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="font-semibold">{location.name}</p>
              <p className="text-xs text-neutral-500">
                {location.address_line1}, {location.city}
              </p>
            </div>
          </div>

          {/* Flavor */}
          {flavorName && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF3EE] shrink-0">
                <IceCreamCone className="w-5 h-5 text-[#F46B8F]" />
              </div>
              <div>
                <p className="font-medium">{flavorName}</p>
                {brandName && (
                  <p className="text-xs text-neutral-500">{brandName}</p>
                )}
              </div>
            </div>
          )}

          {/* Ratings */}
          <div className="border-t pt-4 space-y-2.5">
            {ratings.location > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Location</span>
                <div className="flex items-center gap-1">
                  {renderStars(ratings.location)}
                </div>
              </div>
            )}
            {ratings.flavor > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Flavor</span>
                <div className="flex items-center gap-1">
                  {renderStars(ratings.flavor)}
                </div>
              </div>
            )}
            {ratings.brand > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Brand</span>
                <div className="flex items-center gap-1">
                  {renderStars(ratings.brand)}
                </div>
              </div>
            )}
            {ratings.selection > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Selection</span>
                <div className="flex items-center gap-1">
                  {renderStars(ratings.selection)}
                </div>
              </div>
            )}
          </div>

          {/* Photo */}
          {photoPreview && (
            <div className="border-t pt-4">
              <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                <img
                  src={photoPreview}
                  alt="Check-in photo"
                  className="w-full max-h-48 object-cover"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div className="border-t pt-4">
              <p className="text-sm text-neutral-600">{notes}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl text-base"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Check-in"
        )}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success State
// ---------------------------------------------------------------------------

function SuccessState({ locationSlug }: { locationSlug: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/location/${locationSlug}`);
    }, 2500);
    return () => clearTimeout(timer);
  }, [router, locationSlug]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      {/* Animated checkmark */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/20 flex items-center justify-center animate-in zoom-in-0 duration-500">
          <Check className="w-10 h-10 text-[#F46B8F] dark:text-[#F46B8F]" strokeWidth={3} />
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-[#F46B8F]/30 dark:border-[#332520] animate-ping opacity-30" />
      </div>

      <h2 className="text-2xl font-bold mb-1">Scooped!</h2>
      <p className="text-neutral-500">
        Your check-in has been posted. Nice taste!
      </p>

      <p className="text-xs text-neutral-400 mt-6">
        Redirecting to the location page...
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

function NewCheckinPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const preselectedLocationId = searchParams.get("location");

  const { user, isLoading: authLoading } = useAuth();

  // Multi-step state
  const [step, setStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedFlavor, setSelectedFlavor] = useState<{
    id?: string;
    name: string;
    brandId?: string;
    brandName?: string;
  } | null>(null);
  const [ratings, setRatings] = useState({
    location: 0,
    flavor: 0,
    brand: 0,
    selection: 0,
  });
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const [newBadgeIds, setNewBadgeIds] = useState<string[]>([]);
  const [moderationError, setModerationError] = useState<string | null>(null);

  // Photo handler — sets file + instant preview via object URL
  const handlePhotoChange = useCallback((file: File | null) => {
    // Revoke previous preview URL to avoid memory leaks
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [photoPreview]);

  // Stable callback for StepLocation
  const handleLocationSelect = useCallback((loc: Location) => {
    setSelectedLocation(loc);
    setStep(1);
  }, []);

  // Mutation
  const checkinMutation = useMutation({
    mutationFn: createCheckin,
    onSuccess: async () => {
      setPosted(true);
      // Invalidate relevant caches
      if (selectedLocation) {
        queryClient.invalidateQueries({
          queryKey: ["location-checkins", selectedLocation.id],
        });
      }
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ["user-checkins", user.id],
        });
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        // Check for new badges
        const awarded = await checkAndAwardBadges(user.id);
        if (awarded.length > 0) {
          setNewBadgeIds(awarded);
        }
      }
    },
  });

  const handleSubmit = async () => {
    if (!user || !selectedLocation) return;
    setModerationError(null);

    let photoUrl: string | null = null;

    // Upload photo first if one was selected
    if (photoFile) {
      try {
        photoUrl = await uploadCheckinPhoto(user.id, photoFile);
      } catch (err) {
        if (err instanceof ModerationError) {
          setModerationError(
            "This photo was flagged as potentially inappropriate. Please choose a different image."
          );
          setStep(3);
          return;
        }
        console.error("Photo upload failed:", err);
        // Continue without photo rather than blocking the check-in
      }
    }

    checkinMutation.mutate({
      user_id: user.id,
      location_id: selectedLocation.id,
      flavor_id: selectedFlavor?.id || null,
      brand_id: selectedFlavor?.brandId || null,
      location_rating: ratings.location || null,
      flavor_rating: ratings.flavor || null,
      brand_rating: ratings.brand || null,
      selection_rating: ratings.selection || null,
      notes: notes.trim() || null,
      tags: tags.length > 0 ? tags : null,
      photo_url: photoUrl,
      is_public: true,
    });
  };

  const goBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  // Success state
  if (posted && selectedLocation) {
    return (
      <div className="min-h-dvh bg-background">
        <SuccessState locationSlug={selectedLocation.slug} />
        {newBadgeIds.length > 0 && (
          <BadgeCelebration
            badgeIds={newBadgeIds}
            onDismiss={() => setNewBadgeIds([])}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-card/95 backdrop-blur-md border-b border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={goBack}
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-[#F46B8F]">New Check-In</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {step + 1} of {TOTAL_STEPS}
          </span>
        </div>
        <ProgressBar currentStep={step} />
      </div>

      {/* Error banner */}
      {checkinMutation.isError && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700">
            Something went wrong. Please try again.
          </p>
          <p className="text-xs text-red-500 mt-0.5">
            {checkinMutation.error?.message}
          </p>
        </div>
      )}

      {/* Steps */}
      {step === 0 && (
        <StepLocation
          onSelect={handleLocationSelect}
          preselectedId={preselectedLocationId}
        />
      )}

      {step === 1 && (
        <StepRate
          flavorName={selectedFlavor?.name || ""}
          ratings={ratings}
          onChange={setRatings}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && selectedLocation && (
        <StepFlavor
          locationId={selectedLocation.id}
          onSelect={(flavor) => {
            setSelectedFlavor(flavor.name ? flavor : null);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <StepDetails
          notes={notes}
          tags={tags}
          photoPreview={photoPreview}
          moderationError={moderationError}
          onNotesChange={setNotes}
          onTagsChange={setTags}
          onPhotoChange={handlePhotoChange}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && selectedLocation && !user && (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="rounded-full bg-[#FFF3EE] p-5 mb-5">
            <IceCreamCone className="w-10 h-10 text-[#F46B8F]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Almost there!</h2>
          <p className="text-sm text-neutral-500 max-w-xs mb-6">
            Sign in or create an account to post your check-in. Your progress is saved — you&apos;ll come right back.
          </p>
          <div className="flex gap-3 w-full max-w-xs">
            <Link href="/login" className="flex-1">
              <Button className="w-full h-11 rounded-xl">Sign In</Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button variant="outline" className="w-full h-11 rounded-xl">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}

      {step === 4 && selectedLocation && user && (
        <StepReview
          location={selectedLocation}
          flavorName={selectedFlavor?.name || ""}
          brandName={selectedFlavor?.brandName || ""}
          ratings={ratings}
          notes={notes}
          tags={tags}
          photoPreview={photoPreview}
          isSubmitting={checkinMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default function NewCheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-dvh">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <NewCheckinPageInner />
    </Suspense>
  );
}
