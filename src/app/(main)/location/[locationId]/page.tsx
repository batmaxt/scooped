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
  Camera,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AddToListSheet } from "@/components/shared/AddToListSheet";
import { AddAlertSheet } from "@/components/shared/AddAlertSheet";
import { ReportSightingSheet } from "@/components/shared/ReportSightingSheet";
import { ScanMenuSheet } from "@/components/shared/ScanMenuSheet";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchLocationBySlug,
  fetchLocationFlavors,
  fetchLocationCheckins,
} from "@/queries/locations";
import { fetchMenuPhotos, type MenuPhoto } from "@/queries/menuPhotos";

const TYPE_LABELS: Record<string, string> = {
  scoop_shop: "Scoop Shop",
  supermarket: "Supermarket",
};

const TYPE_COLORS: Record<string, { gradient: string; badge: string }> = {
  scoop_shop: {
    gradient: "from-[#F46B8F] to-[#C4364A]",
    badge: "bg-[#FFF3EE] text-[#F46B8F]",
  },
  supermarket: {
    gradient: "from-[#F2B45A] to-[#D4A030]",
    badge: "bg-[#FFF3EE] text-[#2E1F1B]",
  },
};

const LOCATION_HERO_IMAGES: Record<string, string> = {
  scoop_shop: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=1200&q=80",
  supermarket: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
};

const TYPE_EMOJI: Record<string, string> = {
  scoop_shop: "\uD83C\uDF68",
  supermarket: "\uD83D\uDED2",
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
  const [scanMenuOpen, setScanMenuOpen] = useState(false);

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

  const { data: menuPhotos = [] } = useQuery({
    queryKey: ["menu-photos", location?.id],
    queryFn: () => fetchMenuPhotos(location!.id),
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
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background animate-in fade-in duration-200">
        <Skeleton className="h-48 w-full" />
        <div className="px-5 py-5 space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-3 pt-2">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-10 flex-1 rounded-xl" />
            ))}
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
  const isShop = location.location_type === "scoop_shop";

  const lastCheckin =
    checkins.length > 0
      ? (checkins[0] as Record<string, unknown>)
      : null;

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#FFF7ED]/95 dark:bg-background/95 backdrop-blur-sm border-b border-[rgba(93,64,55,0.12)]/30 dark:border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/discover" className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-[#2E1F1B] dark:text-[#F5E6DC]" />
          </Link>
          <h1 className="font-semibold truncate flex-1 text-[#2E1F1B] dark:text-[#F5E6DC]">
            {location.name}
          </h1>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 rounded-full hover:bg-[#FFF3EE] dark:hover:bg-neutral-800 transition-colors"
            aria-label="Share location"
          >
            <Share2 className="w-5 h-5 text-[#2E1F1B] dark:text-[#F5E6DC]" />
          </button>
        </div>
      </div>

      {/* Hero gradient */}
      <div className="relative overflow-hidden">
        <img
          src={LOCATION_HERO_IMAGES[location.location_type] || LOCATION_HERO_IMAGES.scoop_shop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className={`relative bg-gradient-to-br ${typeColors.gradient} px-5 pt-6 pb-6 text-white`}>
        <div className="flex items-start justify-between mb-3">
          {location.location_type !== "scoop_shop" ? (
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs font-medium gap-1.5">
              <span>{typeEmoji}</span>
              {TYPE_LABELS[location.location_type] || location.location_type}
            </Badge>
          ) : (
            <span />
          )}
          {location.is_claimed && (
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
              Verified
            </Badge>
          )}
        </div>

        <h2 className="text-2xl font-bold font-heading mb-1 drop-shadow-sm">
          {location.name}
        </h2>

        <div className="flex items-center gap-1.5 text-white/80 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm">
            {location.city}, {location.state}
          </span>
        </div>

        {/* Stat pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {location.avg_rating > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              {Number(location.avg_rating).toFixed(1)}
            </span>
          )}
          {location.total_checkins > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm">
              {location.total_checkins} check-in{location.total_checkins !== 1 ? "s" : ""}
            </span>
          )}
          {lastCheckin && typeof lastCheckin.created_at === "string" && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(lastCheckin.created_at)}
            </span>
          )}
        </div>
      </div>
      </div>

      {/* Share + Save row */}
      <div className="px-5 py-4 flex gap-3">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors"
        >
          <Share2 className="size-4" />
          Share
        </button>
        {user && (
          <button
            onClick={() => setAddToListOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors"
          >
            <Bookmark className="size-4" />
            Save
          </button>
        )}
      </div>

      {/* Content sections */}
      <div className="px-5 space-y-5">
        {/* Flavors section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-2">
              <IceCreamCone className="size-4 text-[#F46B8F]" />
              {isShop ? "Flavors here now" : "Pints spotted here"}
            </h3>
            {flavors.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {flavors.length} item{flavors.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {flavors.length > 0 ? (
            <div className="space-y-2">
              {flavors.map((item: Record<string, unknown>) => {
                const locRating = Number(item.location_flavor_avg_rating) || 0;
                return (
                  <div
                    key={item.availability_id as string}
                    className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                          {(item.flavor_name as string) || "Unknown Flavor"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {!!item.brand_name && (
                            <span className="text-xs text-muted-foreground">
                              {item.brand_name as string}
                            </span>
                          )}
                          <FreshnessBadge
                            lastConfirmedAt={(item.last_confirmed_at as string) || null}
                            source={item.source as string}
                          />
                        </div>
                      </div>
                      {locRating > 0 && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-[#F2B45A] text-[#F2B45A]" />
                          <span className="text-sm font-semibold">
                            {locRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-6 text-center">
              <IceCreamCone className="size-8 text-[#F46B8F]/30 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC]">
                No flavors scooped yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Be the first to put {isShop ? "this menu" : "this freezer"} on
                the map.
              </p>
              {user && (
                <Button
                  variant="brand"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setScanMenuOpen(true)}
                >
                  <Camera className="size-3.5" />
                  {isShop ? "Scan the menu" : "Scan the freezer"}
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Scan menu / freezer card */}
        {user && (
          <button
            onClick={() => setScanMenuOpen(true)}
            className="w-full bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-5 text-left hover:border-[#F46B8F]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30">
                <Camera className="size-6 text-[#F46B8F]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC]">
                  {isShop ? "Scan the menu" : "Scan the freezer"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Take a photo and we&apos;ll extract flavors automatically
                </p>
              </div>
              <ChevronRight className="size-4 text-neutral-300 shrink-0" />
            </div>
          </button>
        )}

        {/* Menu photos gallery */}
        {menuPhotos.length > 0 && (
          <section>
            <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-2 mb-3">
              <Camera className="size-4 text-[#F46B8F]" />
              Menu Photos
              <span className="text-xs font-normal text-muted-foreground ml-auto">
                {menuPhotos.length} photo{menuPhotos.length !== 1 ? "s" : ""}
              </span>
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              {menuPhotos.map((photo: MenuPhoto) => (
                <div key={photo.id} className="shrink-0 w-48">
                  <img
                    src={photo.photo_url}
                    alt="Menu board"
                    className="w-48 h-36 object-cover rounded-xl border border-[rgba(93,64,55,0.12)] dark:border-white/10"
                  />
                  <div className="mt-1.5 px-0.5">
                    <p className="text-[10px] text-muted-foreground">
                      {photo.profile?.display_name || photo.profile?.username || "User"} &middot;{" "}
                      {timeAgo(photo.created_at)}
                    </p>
                    {photo.new_flavors_added > 0 && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        +{photo.new_flavors_added} new flavor{photo.new_flavors_added !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location / Directions section */}
        <section>
          <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-2 mb-3">
            <MapPin className="size-4 text-[#F2B45A]" />
            Location
          </h3>
          <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4">
            <p className="text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">
              {location.address_line1}
              {location.address_line2 && `, ${location.address_line2}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {location.city}, {location.state} {location.zip}
            </p>

            {/* Contact info */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#FFF3EE] dark:border-white/5">
              {location.phone && (
                <a
                  href={`tel:${location.phone}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#F46B8F]"
                >
                  <Phone className="size-3.5" />
                  {location.phone}
                </a>
              )}
              {location.website && (
                <a
                  href={
                    location.website.startsWith("http")
                      ? location.website
                      : `https://${location.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#F46B8F]"
                >
                  <Globe className="size-3.5" />
                  Website
                  <ExternalLink className="size-2.5" />
                </a>
              )}
              {location.instagram && (
                <a
                  href={`https://instagram.com/${location.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#F46B8F]"
                >
                  <Instagram className="size-3.5" />
                  @{location.instagram}
                </a>
              )}
            </div>

            <a
              href={getDirectionsUrl(location)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#2E1F1B] dark:bg-[#FFF3EE] text-white dark:text-[#2E1F1B] text-sm font-semibold hover:bg-[#3A1C1A] transition-colors"
            >
              <Navigation className="size-4" />
              Directions
            </a>
          </div>
        </section>

        {/* Check-in CTA */}
        <Link href={`/checkin/new?location=${location.id}`} className="block">
          <div className="bg-gradient-to-br from-[#F46B8F] to-[#C4364A] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-12 rounded-full bg-white/20">
                <IceCreamCone className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold">
                  {isShop ? "Post a fresh scoop moment" : "Report a pint sighting"}
                </p>
                <p className="text-sm text-white/80 mt-0.5">
                  Check in and share what you found
                </p>
              </div>
              <ChevronRight className="size-5 text-white/60 shrink-0" />
            </div>
          </div>
        </Link>

        {/* Quick actions row (alert, sighting) */}
        {user && (
          <div className="flex gap-3">
            <button
              onClick={() => setAddAlertOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors"
            >
              <BellRing className="size-4" />
              Set Alert
            </button>
            <button
              onClick={() => setSightingOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors"
            >
              <Eye className="size-4" />
              Report Sighting
            </button>
          </div>
        )}

        {/* Top scoop notes (reviews) */}
        {checkins.length > 0 && (
          <section>
            <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-2 mb-3">
              <MessageCircle className="size-4 text-[#F2B45A]" />
              Top scoop notes
            </h3>
            <div className="space-y-2">
              {checkins.slice(0, 5).map((checkin: Record<string, unknown>) => {
                const profile = checkin.profile as Record<string, unknown> | null;
                const flavor = checkin.flavor as Record<string, unknown> | null;
                return (
                  <div
                    key={checkin.id as string}
                    className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#2E1F1B] dark:text-[#F5E6DC]">
                          {(profile?.display_name as string) ||
                            (profile?.username as string) ||
                            "Anonymous"}
                        </span>
                        {Number(checkin.flavor_rating) > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#F2B45A] text-[#F2B45A]" />
                            <span className="text-xs font-medium">
                              {Number(checkin.flavor_rating)}
                            </span>
                          </div>
                        )}
                      </div>
                      {typeof checkin.created_at === "string" && (
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(checkin.created_at)}
                        </span>
                      )}
                    </div>
                    {flavor && (
                      <p className="text-xs text-[#F46B8F] font-medium">
                        {flavor.name as string}
                      </p>
                    )}
                    {typeof checkin.notes === "string" && checkin.notes && (
                      <p className="text-sm text-[#2E1F1B] dark:text-[#F5E6DC]/80 mt-1">
                        {checkin.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Business claim/manage */}
        {user && !location.is_claimed && (
          <Link href={`/claim?location=${location.slug}`}>
            <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors">
              <Store className="size-4" />
              Claim this business
            </button>
          </Link>
        )}
        {user && location.is_claimed && location.claimed_by === user.id && (
          <Link href="/dashboard">
            <button className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-medium text-[#2E1F1B] dark:text-[#F5E6DC] hover:bg-[#FFF3EE] transition-colors">
              <Settings className="size-4" />
              Manage Business
            </button>
          </Link>
        )}
      </div>

      {/* Bottom sheets */}
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
      {user && location && (
        <ScanMenuSheet
          open={scanMenuOpen}
          onOpenChange={setScanMenuOpen}
          locationId={location.id}
          locationName={location.name}
        />
      )}
    </div>
  );
}
