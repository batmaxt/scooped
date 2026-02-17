"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  IceCreamCone,
  Loader2,
  X,
  Store,
  LogIn,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchClaimedLocation,
  fetchBusinessAvailability,
  addFlavorToMenu,
  toggleFlavorAvailability,
  updateFlavorPrice,
  removeFlavorFromMenu,
  confirmAllFlavors,
} from "@/queries/business";
import { getRelativeTime } from "@/lib/utils";
import { fetchFlavors } from "@/queries/checkins";
import type { Availability, Flavor } from "@/types/models";

// ---------------------------------------------------------------------------
// Flavor Row (current menu item)
// ---------------------------------------------------------------------------

function FlavorRow({
  item,
  onToggle,
  onPriceChange,
  onRemove,
}: {
  item: Availability;
  onToggle: (id: string, available: boolean) => void;
  onPriceChange: (id: string, price: number | null) => void;
  onRemove: (id: string) => void;
}) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState(
    item.price ? String(item.price) : ""
  );

  const handlePriceBlur = () => {
    setEditingPrice(false);
    const num = parseFloat(priceValue);
    const newPrice = isNaN(num) || num <= 0 ? null : Math.round(num * 100) / 100;
    if (newPrice !== item.price) {
      onPriceChange(item.id, newPrice);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        item.is_available ? "bg-white" : "bg-neutral-50 opacity-60"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {item.flavor?.name || "Unknown Flavor"}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.brand?.name && (
            <span className="text-xs text-muted-foreground">
              {item.brand.name}
            </span>
          )}
          {item.last_confirmed_at && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Clock className="size-2.5" />
              {getRelativeTime(item.last_confirmed_at)}
            </span>
          )}
          {editingPrice ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">$</span>
              <input
                type="number"
                step="0.01"
                className="w-16 text-xs border rounded px-1 py-0.5"
                value={priceValue}
                onChange={(e) => setPriceValue(e.target.value)}
                onBlur={handlePriceBlur}
                onKeyDown={(e) => e.key === "Enter" && handlePriceBlur()}
                autoFocus
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setEditingPrice(true)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {item.price ? `$${Number(item.price).toFixed(2)}` : "Set price"}
            </button>
          )}
        </div>
      </div>

      <Switch
        checked={item.is_available}
        onCheckedChange={(checked) => onToggle(item.id, checked)}
      />

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add Flavor Sheet
// ---------------------------------------------------------------------------

function AddFlavorSheet({
  open,
  onOpenChange,
  locationId,
  userId,
  existingFlavorIds,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  userId: string;
  existingFlavorIds: Set<string>;
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null);
  const [price, setPrice] = useState("");

  const { data: flavors = [], isLoading } = useQuery({
    queryKey: ["search-flavors", search],
    queryFn: () => fetchFlavors(search),
    enabled: search.trim().length >= 2,
  });

  const addMutation = useMutation({
    mutationFn: () =>
      addFlavorToMenu(
        locationId,
        selectedFlavor!.id,
        selectedFlavor!.brand_id || null,
        userId,
        price ? parseFloat(price) : undefined
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", locationId],
      });
      setSelectedFlavor(null);
      setPrice("");
      setSearch("");
      onOpenChange(false);
    },
  });

  const filteredFlavors = flavors.filter(
    (f) => !existingFlavorIds.has(f.id)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Add Flavor to Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {!selectedFlavor ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  placeholder="Search flavors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-full"
                  autoFocus
                />
              </div>

              {/* Results */}
              <div className="overflow-y-auto max-h-[60vh] -mx-6">
                {search.trim().length < 2 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      Type at least 2 characters to search
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="py-12 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-neutral-400" />
                  </div>
                ) : filteredFlavors.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      {flavors.length > 0
                        ? "All matching flavors are already on your menu"
                        : "No flavors found"}
                    </p>
                  </div>
                ) : (
                  filteredFlavors.map((flavor) => (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor)}
                      className="w-full text-left px-6 py-3 hover:bg-neutral-50 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">{flavor.name}</p>
                        {flavor.brand?.name && (
                          <p className="text-xs text-muted-foreground">
                            {flavor.brand.name}
                          </p>
                        )}
                      </div>
                      <Plus className="size-4 text-neutral-400" />
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected flavor confirmation */}
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-full bg-pink-100 p-2">
                    <IceCreamCone className="size-5 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{selectedFlavor.name}</p>
                    {selectedFlavor.brand?.name && (
                      <p className="text-xs text-muted-foreground">
                        {selectedFlavor.brand.name}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFlavor(null)}
                    className="p-1 text-neutral-400 hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </CardContent>
              </Card>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Price{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 6.50"
                  className="h-11"
                />
              </div>

              {addMutation.isError && (
                <p className="text-sm text-red-500">
                  {addMutation.error?.message || "Failed to add flavor"}
                </p>
              )}

              <Button
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending}
                className="w-full h-12 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold gap-2"
              >
                {addMutation.isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Plus className="size-5" />
                )}
                {addMutation.isPending ? "Adding..." : "Add to Menu"}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Flavor Manager Page
// ---------------------------------------------------------------------------

export default function FlavorManagerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ["claimed-location", user?.id],
    queryFn: () => fetchClaimedLocation(user!.id),
    enabled: !!user,
  });

  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ["business-availability", location?.id],
    queryFn: () => fetchBusinessAvailability(location!.id),
    enabled: !!location?.id,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) =>
      toggleFlavorAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", location?.id],
      });
    },
  });

  const priceMutation = useMutation({
    mutationFn: ({ id, price }: { id: string; price: number | null }) =>
      updateFlavorPrice(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", location?.id],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFlavorFromMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", location?.id],
      });
    },
  });

  const confirmAllMutation = useMutation({
    mutationFn: () => confirmAllFlavors(location!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", location?.id],
      });
    },
  });

  const existingFlavorIds = new Set(availability.map((a) => a.flavor_id));
  const activeFlavors = availability.filter((a) => a.is_available);
  const inactiveFlavors = availability.filter((a) => !a.is_available);

  // Loading
  if (authLoading || locationLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="rounded-full bg-pink-50 p-5 mb-5">
          <Store className="size-10 text-pink-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Manage Flavors</h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          Sign in to manage your menu.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            className="gap-2 bg-pink-500 hover:bg-pink-600 text-white"
          >
            <LogIn className="size-4" />
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // No claimed location
  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="rounded-full bg-neutral-100 p-5 mb-4">
          <Store className="size-8 text-neutral-400" />
        </div>
        <h3 className="font-semibold mb-1">No Claimed Location</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          Claim a business first to manage its flavors.
        </p>
        <Link href="/discover">
          <Button variant="outline">Browse Locations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-base font-semibold">Manage Flavors</h1>
              <p className="text-xs text-muted-foreground">{location.name}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => setAddSheetOpen(true)}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </header>

      {/* Confirm All button */}
      {activeFlavors.length > 0 && !availabilityLoading && (
        <div className="px-4 pt-4">
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl border-green-200 text-green-700 hover:bg-green-50 gap-2 text-sm font-medium"
            disabled={confirmAllMutation.isPending}
            onClick={() => confirmAllMutation.mutate()}
          >
            {confirmAllMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {confirmAllMutation.isPending
              ? "Confirming..."
              : "Confirm All Still Available"}
          </Button>
        </div>
      )}

      {/* Content */}
      {availabilityLoading ? (
        <div className="p-4 space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : availability.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="rounded-full bg-pink-50 p-5 mb-4">
            <IceCreamCone className="size-8 text-pink-300" />
          </div>
          <h3 className="font-semibold mb-1">No flavors on your menu</h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-6">
            Add flavors from our catalog so customers know what&apos;s
            available.
          </p>
          <Button
            className="gap-1.5 bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => setAddSheetOpen(true)}
          >
            <Plus className="size-4" />
            Add First Flavor
          </Button>
        </div>
      ) : (
        <div>
          {/* Active flavors */}
          {activeFlavors.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide bg-neutral-50">
                Available ({activeFlavors.length})
              </p>
              <div className="divide-y divide-neutral-100">
                {activeFlavors.map((item) => (
                  <FlavorRow
                    key={item.id}
                    item={item}
                    onToggle={(id, available) =>
                      toggleMutation.mutate({ id, available })
                    }
                    onPriceChange={(id, price) =>
                      priceMutation.mutate({ id, price })
                    }
                    onRemove={(id) => removeMutation.mutate(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive flavors */}
          {inactiveFlavors.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide bg-neutral-50">
                Unavailable ({inactiveFlavors.length})
              </p>
              <div className="divide-y divide-neutral-100">
                {inactiveFlavors.map((item) => (
                  <FlavorRow
                    key={item.id}
                    item={item}
                    onToggle={(id, available) =>
                      toggleMutation.mutate({ id, available })
                    }
                    onPriceChange={(id, price) =>
                      priceMutation.mutate({ id, price })
                    }
                    onRemove={(id) => removeMutation.mutate(id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add flavor sheet */}
      <AddFlavorSheet
        open={addSheetOpen}
        onOpenChange={setAddSheetOpen}
        locationId={location.id}
        userId={user.id}
        existingFlavorIds={existingFlavorIds}
      />
    </div>
  );
}
