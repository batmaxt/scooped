"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Store,
  IceCreamCone,
  Star,
  ClipboardList,
  ExternalLink,
  Clock,
  RefreshCw,
  Loader2,
  LogIn,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchClaimedLocation,
  fetchBusinessAvailability,
  confirmAllFlavors,
  unclaimLocation,
} from "@/queries/business";
import { getRelativeTime } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
};

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------

export default function BusinessDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showUnclaimConfirm, setShowUnclaimConfirm] = useState(false);

  const { data: location, isLoading: locationLoading } = useQuery({
    queryKey: ["claimed-location", user?.id],
    queryFn: () => fetchClaimedLocation(user!.id),
    enabled: !!user,
  });

  const { data: availability = [] } = useQuery({
    queryKey: ["business-availability", location?.id],
    queryFn: () => fetchBusinessAvailability(location!.id),
    enabled: !!location?.id,
  });

  const activeFlavors = availability.filter((a) => a.is_available).length;
  const totalFlavors = availability.length;

  // Find the most recent confirmed_at across all availability entries
  const lastUpdated = availability.reduce<string | null>((latest, a) => {
    if (!a.last_confirmed_at) return latest;
    if (!latest) return a.last_confirmed_at;
    return a.last_confirmed_at > latest ? a.last_confirmed_at : latest;
  }, null);

  const confirmAllMutation = useMutation({
    mutationFn: () => confirmAllFlavors(location!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-availability", location?.id],
      });
    },
  });

  const unclaimMutation = useMutation({
    mutationFn: () => unclaimLocation(location!.id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claimed-location"] });
      setShowUnclaimConfirm(false);
      router.push("/discover");
    },
  });

  // Auth loading
  if (authLoading || locationLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
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
        <h2 className="text-xl font-bold mb-2">Business Dashboard</h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          Sign in to manage your ice cream shop.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            variant="brand"
            className="gap-2"
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
          You haven&apos;t claimed a business yet. Visit a location page and tap
          &quot;Claim this business&quot; to get started.
        </p>
        <Link href="/discover">
          <Button variant="outline">Browse Locations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link
            href="/home"
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold">Business Dashboard</h1>
        </div>
      </header>

      <div className="px-4 py-5 space-y-4">
        {/* Location card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gradient-to-br from-pink-500 to-rose-400 p-3 shrink-0">
                <IceCreamCone className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg truncate">
                    {location.name}
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-600 shrink-0">
                    Verified
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {TYPE_LABELS[location.location_type] || location.location_type}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {location.address_line1}, {location.city}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <IceCreamCone className="size-5 text-pink-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{activeFlavors}</p>
              <p className="text-xs text-muted-foreground">
                Active Flavor{activeFlavors !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <ClipboardList className="size-5 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{location.total_checkins}</p>
              <p className="text-xs text-muted-foreground">Check-ins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Star className="size-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold">
                {location.avg_rating > 0
                  ? Number(location.avg_rating).toFixed(1)
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <Clock className="size-5 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold truncate">
                {lastUpdated ? getRelativeTime(lastUpdated) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Last Updated</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick action: What's in your case today? */}
        {activeFlavors > 0 && (
          <Button
            variant="outline"
            className="w-full h-12 text-base rounded-xl border-green-200 text-green-700 hover:bg-green-50 font-semibold gap-2"
            disabled={confirmAllMutation.isPending}
            onClick={() => confirmAllMutation.mutate()}
          >
            {confirmAllMutation.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <RefreshCw className="size-5" />
            )}
            {confirmAllMutation.isPending
              ? "Confirming..."
              : "Same flavors today? Confirm all"}
          </Button>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/flavors" className="block">
            <Button variant="brand-gradient" className="w-full h-12 text-base rounded-xl gap-2">
              <IceCreamCone className="size-5" />
              Manage Flavors
              {totalFlavors > 0 && (
                <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {totalFlavors}
                </span>
              )}
            </Button>
          </Link>

          <Link href={`/location/${location.slug}`} className="block">
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2"
            >
              <ExternalLink className="size-4" />
              View Public Page
            </Button>
          </Link>

          {/* Unclaim */}
          {!showUnclaimConfirm ? (
            <Button
              variant="ghost"
              className="w-full h-11 rounded-xl gap-2 text-muted-foreground hover:text-red-600 hover:bg-red-50"
              onClick={() => setShowUnclaimConfirm(true)}
            >
              <ShieldOff className="size-4" />
              Remove Business Claim
            </Button>
          ) : (
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium text-red-800">
                  Are you sure? This will remove your ownership of{" "}
                  <strong>{location.name}</strong>. You&apos;ll lose access to
                  the dashboard and flavor management.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUnclaimConfirm(false)}
                    disabled={unclaimMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => unclaimMutation.mutate()}
                    disabled={unclaimMutation.isPending}
                  >
                    {unclaimMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Yes, Remove Claim"
                    )}
                  </Button>
                </div>
                {unclaimMutation.isError && (
                  <p className="text-xs text-red-600">
                    Something went wrong. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
