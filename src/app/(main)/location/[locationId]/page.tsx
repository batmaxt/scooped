"use client";

import { use, useCallback, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Star,
  MapPin,
  Globe,
  Instagram,
  Phone,
  ChevronRight,
  Loader2,
  Share2,
  Navigation,
  ExternalLink,
  IceCreamCone,
  Clock,
  ListPlus,
  Store,
  Settings,
  BellRing,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddToListSheet } from "@/components/shared/AddToListSheet";
import { AddAlertSheet } from "@/components/shared/AddAlertSheet";
import { ReportSightingSheet } from "@/components/shared/ReportSightingSheet";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchLocationBySlug,
  fetchLocationFlavors,
  fetchLocationCheckins,
} from "@/queries/locations";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
  farmers_market: "Farmers Market",
  restaurant: "Restaurant",
  food_truck: "Food Truck",
};

const TYPE_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  scoop_shop: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    gradient: "from-pink-500 to-rose-400",
  },
  supermarket: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    gradient: "from-blue-500 to-cyan-400",
  },
  farmers_market: {
    bg: "bg-green-100",
    text: "text-green-700",
    gradient: "from-green-500 to-emerald-400",
  },
  restaurant: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    gradient: "from-orange-500 to-amber-400",
  },
  food_truck: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    gradient: "from-purple-500 to-violet-400",
  },
};

const TYPE_EMOJI: Record<string, string> = {
  scoop_shop: "\uD83C\uDF68",
  supermarket: "\uD83D\uDED2",
  farmers_market: "\uD83C\uDF3D",
  restaurant: "\uD83C\uDF7D\uFE0F",
  food_truck: "\uD83D\uDE9A",
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  return "over a year ago";
}

function getDirectionsUrl(location: {
  address_line1: string;
  city: string;
  state: string;
  zip?: string;
}): string {
  const address = `${location.address_line1}, ${location.city}, ${location.state}${location.zip ? ` ${location.zip}` : ""}`;
  const encoded = encodeURIComponent(address);
  // Use Apple Maps on iOS/macOS, Google Maps otherwise
  const isApple =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  return isApple
    ? `https://maps.apple.com/?daddr=${encoded}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

export default function LocationDetailPage({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const { locationId } = use(params);
  const { user } = useAuth();
  const [addToListOpen, setAddToListOpen] = useState(false);
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [sightingOpen, setSightingOpen] = useState(false);

  const { data: location, isLoading } = useQuery({
    queryKey: ["location", locationId],
    queryFn: () => fetchLocationBySlug(locationId),
  });

  const { data: flavors = [] } = useQuery({
    queryKey: ["location-flavors", location?.id],
    queryFn: () => fetchLocationFlavors(location!.id),
    enabled: !!location?.id,
  });

  const { data: checkins = [] } = useQuery({
    queryKey: ["location-checkins", location?.id],
    queryFn: () => fetchLocationCheckins(location!.id),
    enabled: !!location?.id,
  });

  const handleShare = useCallback(async () => {
    if (!location) return;
    const shareData = {
      title: location.name,
      text: `Check out ${location.name} on Scooped!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // User cancelled or share failed silently
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white dark:bg-background animate-in fade-in duration-200">
        <Skeleton className="h-48 w-full" />
        <div className="px-4 py-5 space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-3 pt-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="size-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-4" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <EmptyState
        icon={MapPin}
        iconColor="text-neutral-400"
        bgColor="bg-neutral-100"
        title="We couldn't find that spot"
        description="It may have melted away..."
        className="min-h-[60vh]"
        action={
          <Link href="/discover">
            <Button variant="outline" className="mt-2">
              Back to map
            </Button>
          </Link>
        }
      />
    );
  }

  const typeColors = TYPE_COLORS[location.location_type] || TYPE_COLORS.scoop_shop;
  const typeEmoji = TYPE_EMOJI[location.location_type] || "\uD83C\uDF68";

  const lastCheckin =
    checkins.length > 0
      ? (checkins[0] as Record<string, unknown>)
      : null;

  return (
    <div className="min-h-dvh bg-white dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-card/95 backdrop-blur-sm border-b dark:border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/discover" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold truncate flex-1">{location.name}</h1>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 transition-colors"
            aria-label="Share location"
          >
            <Share2 className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Gradient Hero Section */}
      <div
        className={`bg-gradient-to-br ${typeColors.gradient} px-4 pt-6 pb-5 text-white`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm"
            >
              <span>{typeEmoji}</span>
              {TYPE_LABELS[location.location_type] || location.location_type}
            </span>
            {location.is_claimed && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                Verified
              </span>
            )}
          </div>
          <span className="text-4xl drop-shadow-md">{"\uD83C\uDF68"}</span>
        </div>

        <h2 className="text-2xl font-bold mb-1 drop-shadow-sm">
          {location.name}
        </h2>

        <div className="flex items-center gap-1.5 text-white/80 mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm">
            {location.address_line1}, {location.city}, {location.state}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {location.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-bold">
                {Number(location.avg_rating).toFixed(1)}
              </span>
              <span className="text-sm text-white/70">
                ({location.total_ratings})
              </span>
            </div>
          )}
          <span className="text-sm text-white/70">
            {location.total_checkins} check-in
            {location.total_checkins !== 1 ? "s" : ""}
          </span>
          {lastCheckin && typeof lastCheckin.created_at === "string" && (
            <div className="flex items-center gap-1 text-sm text-white/70">
              <Clock className="w-3.5 h-3.5" />
              <span>Last visited {timeAgo(lastCheckin.created_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 flex gap-3">
        <Link
          href={`/checkin/new?location=${location.id}`}
          className="flex-1"
        >
          <Button variant="brand-gradient" className="w-full h-12 text-base rounded-xl gap-2">
            <IceCreamCone className="w-5 h-5" />
            Check In Here
          </Button>
        </Link>
        {user && (
          <Button
            variant="outline"
            className="h-12 px-4 rounded-xl border-neutral-200"
            onClick={() => setAddToListOpen(true)}
          >
            <ListPlus className="w-5 h-5" />
          </Button>
        )}
        {user && (
          <Button
            variant="outline"
            className="h-12 px-4 rounded-xl border-neutral-200"
            onClick={() => setAddAlertOpen(true)}
          >
            <BellRing className="w-5 h-5" />
          </Button>
        )}
        {user && (
          <Button
            variant="outline"
            className="h-12 px-4 rounded-xl border-neutral-200"
            onClick={() => setSightingOpen(true)}
            title="Report a flavor sighting"
          >
            <Eye className="w-5 h-5" />
          </Button>
        )}
        <a
          href={getDirectionsUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="h-12 px-4 rounded-xl border-neutral-200"
          >
            <Navigation className="w-5 h-5" />
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="flavors" className="px-4">
        <TabsList className="w-full">
          <TabsTrigger value="flavors" className="flex-1">
            Flavors
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1">
            Info
          </TabsTrigger>
        </TabsList>

        {/* Flavors Tab */}
        <TabsContent value="flavors" className="mt-4 space-y-2 pb-8">
          {flavors.length > 0 ? (
            <>
              <p className="text-sm text-neutral-500 mb-3">
                {flavors.length} flavor{flavors.length !== 1 ? "s" : ""}{" "}
                available
              </p>
              {flavors.map((item: Record<string, unknown>) => {
                const locRating = Number(item.location_flavor_avg_rating) || 0;
                const locRatingCount = Number(item.location_flavor_total_ratings) || 0;
                return (
                  <Card key={item.availability_id as string}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h4 className="font-medium">
                          {(item.flavor_name as string) || "Unknown Flavor"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {!!item.brand_name && (
                            <span className="text-xs text-neutral-500">
                              {item.brand_name as string}
                            </span>
                          )}
                          <FreshnessBadge
                            lastConfirmedAt={(item.last_confirmed_at as string) || null}
                            source={item.source as string}
                          />
                          {locRating > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">
                                {locRating.toFixed(1)}
                              </span>
                              {locRatingCount > 0 && (
                                <span className="text-xs text-neutral-400">
                                  ({locRatingCount})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300" />
                    </CardContent>
                  </Card>
                );
              })}
            </>
          ) : (
            <EmptyState
              icon={IceCreamCone}
              iconColor="text-pink-300"
              bgColor="bg-pink-50"
              title="No flavors scooped yet"
              description="Be the first to check in and let everyone know what's in the freezer!"
            />
          )}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-4 pb-8">
          {checkins.length > 0 ? (
            <div className="space-y-3">
              {checkins.map((checkin: Record<string, unknown>) => {
                const profile = checkin.profile as Record<
                  string,
                  unknown
                > | null;
                const flavor = checkin.flavor as Record<
                  string,
                  unknown
                > | null;
                return (
                  <Card key={checkin.id as string}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {(profile?.display_name as string) ||
                              (profile?.username as string) ||
                              "Anonymous"}
                          </span>
                          {Number(checkin.flavor_rating) > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">
                                {Number(checkin.flavor_rating)}
                              </span>
                            </div>
                          )}
                        </div>
                        {typeof checkin.created_at === "string" && (
                          <span className="text-xs text-neutral-400">
                            {timeAgo(checkin.created_at)}
                          </span>
                        )}
                      </div>
                      {flavor && (
                        <p className="text-sm text-neutral-500">
                          {flavor.name as string}
                        </p>
                      )}
                      {typeof checkin.notes === "string" && checkin.notes && (
                        <p className="text-sm mt-1">{checkin.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              iconColor="text-blue-300"
              bgColor="bg-blue-50"
              title="No reviews yet"
              description="Every scoop has a story. Check in and share your experience!"
            />
          )}
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="mt-4 space-y-4 pb-8">
          <div className="space-y-3">
            {/* Address with directions link */}
            <a
              href={getDirectionsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 -mx-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-neutral-500">
                  {location.address_line1}
                  {location.address_line2 && `, ${location.address_line2}`}
                  <br />
                  {location.city}, {location.state} {location.zip}
                </p>
              </div>
              <Navigation className="w-4 h-4 text-neutral-300 mt-0.5 shrink-0 group-hover:text-neutral-500 transition-colors" />
            </a>

            {/* Phone - clickable tel link */}
            {location.phone && (
              <a
                href={`tel:${location.phone}`}
                className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors"
              >
                <Phone className="w-5 h-5 text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-neutral-500">{location.phone}</p>
                </div>
              </a>
            )}

            {/* Website - clickable external link */}
            {location.website && (
              <a
                href={
                  location.website.startsWith("http")
                    ? location.website
                    : `https://${location.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors group"
              >
                <Globe className="w-5 h-5 text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-neutral-500 truncate">
                    {location.website}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-300 shrink-0 group-hover:text-neutral-500 transition-colors" />
              </a>
            )}

            {/* Instagram - clickable link */}
            {location.instagram && (
              <a
                href={`https://instagram.com/${location.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 -mx-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700 transition-colors group"
              >
                <Instagram className="w-5 h-5 text-neutral-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="text-sm text-neutral-500">
                    @{location.instagram}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-300 shrink-0 group-hover:text-neutral-500 transition-colors" />
              </a>
            )}
            {/* Business Claim / Manage */}
            {user && !location.is_claimed && (
              <Link href={`/claim?location=${location.slug}`}>
                <Button
                  variant="outline"
                  className="w-full mt-4 h-11 rounded-xl gap-2 border-neutral-200"
                >
                  <Store className="w-4 h-4" />
                  Claim this business
                </Button>
              </Link>
            )}
            {user && location.is_claimed && location.claimed_by === user.id && (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="w-full mt-4 h-11 rounded-xl gap-2 border-neutral-200"
                >
                  <Settings className="w-4 h-4" />
                  Manage Business
                </Button>
              </Link>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {user && location && (
        <AddToListSheet
          open={addToListOpen}
          onOpenChange={setAddToListOpen}
          itemType="location"
          itemId={location.id}
        />
      )}
      {user && location && (
        <AddAlertSheet
          open={addAlertOpen}
          onOpenChange={setAddAlertOpen}
          defaultTab="location"
          defaultTargetId={location.id}
          defaultTargetName={location.name}
        />
      )}
      {user && location && (
        <ReportSightingSheet
          open={sightingOpen}
          onOpenChange={setSightingOpen}
          locationId={location.id}
          locationName={location.name}
        />
      )}
    </div>
  );
}
