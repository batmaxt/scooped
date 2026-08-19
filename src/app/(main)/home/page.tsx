"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Search,
  Bell,
  LogIn,
  Loader2,
  Users,
  IceCreamCone,
  Star,
  MapPin,
  Sparkles,
  Map,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedCard } from "@/components/shared/FeedCard";
import { DemoButton } from "@/components/shared/DemoButton";
import { CommentSheet } from "@/components/shared/CommentSheet";
import { UserRow } from "@/components/shared/UserRow";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLocation } from "@/hooks/useLocation";
import { fetchFeed, searchUsers } from "@/queries/social";
import { fetchLikedCheckinIds } from "@/queries/interactions";
import { fetchUnreadCount } from "@/queries/notifications";
import { fetchNearbyLocations, fetchFeaturedLocation } from "@/queries/locations";
import { fetchTrendingFlavors } from "@/queries/checkins";
import type { FeedItem, Profile, Location, Flavor } from "@/types/models";

const PAGE_SIZE = 20;
const DEFAULT_LAT = 40.748;
const DEFAULT_LNG = -73.985;

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return miles < 0.1 ? "Nearby" : `${miles.toFixed(1)} mi`;
}

import { flavorColor, flavorImage } from "@/lib/flavor-utils";

const SHOP_IMAGES = [
  "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=800&q=80",  // ice cream shop display case
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",  // ice cream cones
  "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",  // colorful scoops
  "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80",  // single cone
  "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?auto=format&fit=crop&w=800&q=80",  // ice cream close up
  "https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=800&q=80",  // ice cream variety
];

function shopImage(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SHOP_IMAGES[Math.abs(hash) % SHOP_IMAGES.length];
}


// ---------------------------------------------------------------------------
// Not logged in
// ---------------------------------------------------------------------------

const TEASER_FLAVORS = [
  "Salted Caramel",
  "Mint Chip",
  "Strawberry Cheesecake",
  "Pistachio",
  "Cookies & Cream",
  "Mango Sorbet",
];

function NotLoggedIn() {
  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-20">
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
          Scooped now
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Your next favorite scoop is nearby
        </h1>
      </div>
      <div className="px-5 pb-7">
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to discover trending flavors, track your scoops, and get alerts
          when your favorites appear nearby.
        </p>
        <Link href="/login">
          <Button size="lg" variant="brand" className="w-full gap-2">
            <LogIn className="size-4" />
            Sign In or Sign Up
          </Button>
        </Link>
        <DemoButton className="mt-3" />
      </div>

      {/* Product teaser — what you get inside */}
      <div className="pb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC]">
            🍨 Trending this week
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-hide">
          {TEASER_FLAVORS.map((name) => (
            <div
              key={name}
              className="shrink-0 w-[132px] bg-white dark:bg-card rounded-2xl p-4 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5"
            >
              <div
                className="size-11 rounded-full mb-3 overflow-hidden"
                style={{ backgroundColor: flavorColor(name) }}
              >
                <img
                  src={flavorImage(name)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] leading-snug line-clamp-2">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature bullets */}
      <div className="px-5 space-y-2.5">
        {[
          {
            emoji: "📍",
            title: "1,300+ scoop spots mapped",
            sub: "Shops and freezer aisles, all on one map",
          },
          {
            emoji: "📸",
            title: "Scan any menu board",
            sub: "We read the flavors so you don't have to type",
          },
          {
            emoji: "🔔",
            title: "Flavor alerts",
            sub: "Know the moment your favorite shows up nearby",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3.5 bg-white dark:bg-card rounded-2xl px-4 py-3.5 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5"
          >
            <span className="text-2xl" aria-hidden>
              {f.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">
                {f.title}
              </p>
              <p className="text-xs text-muted-foreground">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// User search overlay
// ---------------------------------------------------------------------------

function UserSearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query),
    enabled: query.trim().length >= 2,
  });

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-background animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10 rounded-full"
            autoFocus
          />
        </div>
        <button type="button" onClick={onClose} className="text-sm font-medium text-muted-foreground">
          Cancel
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
        {query.trim().length < 2 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Type at least 2 characters to search</p>
          </div>
        ) : isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="size-6 animate-spin text-neutral-400" />
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          results.map((profile: Profile) => <UserRow key={profile.id} profile={profile} />)
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flavor card (horizontal scroll)
// ---------------------------------------------------------------------------

function FlavorCard({ flavor }: { flavor: Flavor }) {
  return (
    <div className="shrink-0 w-[160px] bg-white dark:bg-card rounded-2xl p-4 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
      <div className="size-12 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: flavorColor(flavor.name) }}>
        <img
          src={flavorImage(flavor.name)}
          alt={flavor.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] leading-snug line-clamp-2">
        {flavor.name}
      </p>
      {flavor.brand && (
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{flavor.brand.name}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shop card (nearby scoop shops — horizontal scroll)
// ---------------------------------------------------------------------------

function ShopCard({ location }: { location: Location }) {
  return (
    <Link href={`/location/${location.slug}`} className="block">
      <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 overflow-hidden">
        <div className="h-36 overflow-hidden">
          <img
            src={shopImage(location.name)}
            alt={location.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3.5 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">{location.name}</p>
            <p className="text-xs text-muted-foreground">
              Shop &middot; {location.city}
            </p>
          </div>
          {(location.distance_meters ?? 0) > 0 && (
            <span className="text-xs font-semibold text-[#F46B8F] shrink-0 ml-2">
              {formatDistance(location.distance_meters!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Store row (retail locations)
// ---------------------------------------------------------------------------

function StoreRow({ location }: { location: Location }) {
  return (
    <Link href={`/location/${location.slug}`}>
      <div className="flex items-center gap-3.5 bg-white dark:bg-card rounded-2xl px-4 py-3.5 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
        <div className="flex items-center justify-center size-10 rounded-full bg-[#E8F5E2] dark:bg-emerald-900/20">
          <ShoppingCart className="size-4 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">{location.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {location.city}
            {(location.distance_meters ?? 0) > 0 && ` \u00B7 ${formatDistance(location.distance_meters!)}`}
          </p>
        </div>
        <ArrowRight className="size-4 text-neutral-400 shrink-0" />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Home Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { position } = useLocation();
  const [compactFeed] = useLocalStorage("scooped:compactFeed", false);
  const [showSearch, setShowSearch] = useState(false);

  const lat = position?.latitude ?? DEFAULT_LAT;
  const lng = position?.longitude ?? DEFAULT_LNG;

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotifications", user?.id],
    queryFn: () => fetchUnreadCount(user!.id),
    enabled: !!user,
    refetchInterval: 30000,
  });

  const { data: featured } = useQuery({
    queryKey: ["featuredLocation", lat, lng],
    queryFn: () => fetchFeaturedLocation(lat, lng),
    staleTime: 30 * 60 * 1000,
  });

  const { data: trendingFlavors = [] } = useQuery({
    queryKey: ["trendingFlavors"],
    queryFn: () => fetchTrendingFlavors(10),
    staleTime: 30 * 60 * 1000,
  });

  const { data: nearbyShops = [] } = useQuery({
    queryKey: ["nearbyShops", lat, lng],
    queryFn: () => fetchNearbyLocations(lat, lng, 800000, ["scoop_shop"]),
    staleTime: 30 * 60 * 1000,
  });

  const { data: nearbyStores = [] } = useQuery({
    queryKey: ["nearbyStores", lat, lng],
    queryFn: () => fetchNearbyLocations(lat, lng, 800000, ["supermarket"]),
    staleTime: 30 * 60 * 1000,
  });

  // Feed
  const [commentCheckinId, setCommentCheckinId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: feedLoading,
  } = useInfiniteQuery({
    queryKey: ["feed", user?.id],
    queryFn: ({ pageParam }) => fetchFeed(user!.id, PAGE_SIZE, pageParam ?? null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.created_at ?? undefined;
    },
    enabled: !!user,
  });

  const allItems: FeedItem[] = data?.pages.flat() ?? [];
  const checkinIds = allItems.map((item) => item.id);

  const { data: likedSet = new Set<string>() } = useQuery({
    queryKey: ["likedCheckins", user?.id, checkinIds.join(",")],
    queryFn: () => fetchLikedCheckinIds(user!.id, checkinIds),
    enabled: !!user && checkinIds.length > 0,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (authLoading) {
    return (
      <div className="p-5 space-y-4 bg-[#FFF7ED] dark:bg-background min-h-dvh">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full rounded-full" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user) return <NotLoggedIn />;

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F]">
          Scooped now
        </p>
        <Link href="/alerts" className="relative p-2 -mr-2 text-[#2E1F1B] dark:text-[#F5E6DC]">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#C4364A] text-white text-[10px] font-bold leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Hero */}
      <div className="px-5 pb-4">
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Your next favorite scoop is nearby
        </h1>
      </div>

      {/* Search bar → navigates to /search */}
      <div className="px-5 pb-5 animate-fade-in-up" style={{ animationDelay: "0s" }}>
        <Link href="/search">
          <div className="flex items-center gap-3 bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 rounded-full h-12 px-4">
            <Search className="size-4 text-neutral-400" />
            <span className="text-sm text-muted-foreground">Search flavors, brands, and scoop spots</span>
          </div>
        </Link>
      </div>

      {/* Featured Creamery */}
      {featured && (
        <div className="px-5 pb-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <Link href={`/location/${featured.slug}`}>
            <div className="relative bg-gradient-to-br from-[#F46B8F] via-[#C4364A] to-[#C4364A] rounded-2xl p-5 overflow-hidden min-h-[200px]">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80 flex items-center gap-1 mb-2">
                <Star className="size-3.5 fill-white/80" />
                Featured Creamery
              </p>
              <h2 className="text-2xl font-bold font-heading text-white leading-snug mb-2 max-w-[65%]">
                {featured.name}
              </h2>
              <p className="text-sm text-white/80 leading-relaxed max-w-[60%] line-clamp-3 mb-4">
                {featured.city}&apos;s beloved creamery with creative flavors and a
                retro-whimsical shop vibe.
              </p>
              <div className="flex gap-2">
                {featured.avg_rating > 0 && (
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-white">
                    <Star className="size-3 fill-white" /> {Number(featured.avg_rating).toFixed(1)}
                  </span>
                )}
                {(featured.distance_meters ?? 0) > 0 && (
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-white">
                    <MapPin className="size-3" /> {formatDistance(featured.distance_meters!)}
                  </span>
                )}
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 size-24 rounded-full border-2 border-white/20 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1514849302-984523450cf4?auto=format&fit=crop&w=200&q=80"
                  alt={featured.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Trending this week banner */}
      <div className="px-5 pb-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <Link href="/search">
          <div className="flex items-center gap-3.5 bg-white dark:bg-card rounded-2xl px-4 py-3.5 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">Trending this week</p>
              <p className="text-xs text-muted-foreground">See the most scooped flavors in NYC</p>
            </div>
            <ArrowRight className="size-4 text-neutral-400" />
          </div>
        </Link>
      </div>

      {/* Trending flavors */}
      {trendingFlavors.length > 0 && (
        <div className="pb-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-1.5">
              🍨 Trending flavors
            </h2>
            <Link href="/flavor-catalog" className="text-xs font-semibold text-[#F46B8F]">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-hide">
            {trendingFlavors.map((flavor) => (
              <Link key={flavor.id} href={`/flavor/${flavor.slug}`}>
                <FlavorCard flavor={flavor} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Map + Check in action cards */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-5 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/discover">
          <div className="bg-white dark:bg-card rounded-2xl p-4 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
            <Map className="size-6 text-[#2E1F1B] dark:text-[#F5E6DC] mb-2.5" />
            <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">Map</p>
            <p className="text-xs text-muted-foreground mt-0.5">See scoop spots around you</p>
          </div>
        </Link>
        <Link href="/checkin/new">
          <div className="bg-white dark:bg-card rounded-2xl p-4 border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5">
            <Sparkles className="size-6 text-[#F2B45A] mb-2.5" />
            <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">Check in</p>
            <p className="text-xs text-muted-foreground mt-0.5">Rate a flavor and post your scoop</p>
          </div>
        </Link>
      </div>

      {/* Scoop shops nearby */}
      {nearbyShops.length > 0 && (
        <div className="pb-5 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-1.5">
              🏠 Scoop shops nearby
            </h2>
            <Link href="/discover" className="text-xs font-semibold text-[#F46B8F]">Open map</Link>
          </div>
          <div className="flex gap-3.5 overflow-x-auto px-5 pb-1 scrollbar-hide">
            {nearbyShops.slice(0, 6).map((shop) => (
              <div key={shop.id} className="shrink-0 w-[260px]">
                <ShopCard location={shop} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retail pint hunt banner */}
      {nearbyStores.length > 0 && (
        <div className="px-5 pb-5 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Link href="/discover">
            <div className="flex items-center gap-3.5 bg-[#E8F5E2] dark:bg-emerald-900/15 rounded-2xl px-4 py-3.5 border border-emerald-200/40 dark:border-emerald-800/20">
              <div className="flex items-center justify-center size-10 rounded-full bg-white/60 dark:bg-emerald-900/30">
                <ShoppingCart className="size-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">Retail pint hunt</p>
                <p className="text-xs text-muted-foreground">Find rare flavors at stores near you</p>
              </div>
              <ArrowRight className="size-4 text-neutral-400" />
            </div>
          </Link>
        </div>
      )}

      {/* In stores now */}
      {nearbyStores.length > 0 && (
        <div className="pb-5">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-1.5">
              🛒 In stores now
            </h2>
            <Link href="/discover" className="text-xs font-semibold text-[#F46B8F]">See all</Link>
          </div>
          <div className="px-5 space-y-2.5">
            {nearbyStores.slice(0, 3).map((store) => (
              <StoreRow key={store.id} location={store} />
            ))}
          </div>
        </div>
      )}

      {/* Friends are scooping (feed) */}
      <div className="pb-4">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-lg font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] flex items-center gap-1.5">
            👋 Friends are scooping
          </h2>
        </div>
        <div className="px-5 space-y-3">
          {feedLoading ? (
            Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))
          ) : allItems.length === 0 ? (
            <div className="bg-[#FFF5E6] dark:bg-amber-900/10 rounded-2xl p-5 text-center border border-amber-200/40 dark:border-amber-800/20">
              <Users className="size-8 text-[#F2B45A] mx-auto mb-2" />
              <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] mb-1">Your feed is empty</p>
              <p className="text-xs text-muted-foreground mb-3">Follow ice cream lovers to see their scoops here</p>
              <Link href="/discover">
                <Button size="sm" variant="outline" className="gap-1.5 border-[rgba(93,64,55,0.12)] text-[#C4364A] hover:bg-[#FFF3EE]">
                  <IceCreamCone className="size-3.5" /> Discover
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {allItems.map((item) => (
                <FeedCard
                  key={item.id}
                  item={item}
                  isLiked={likedSet.has(item.id)}
                  onCommentTap={() => setCommentCheckinId(item.id)}
                  compact={compactFeed}
                />
              ))}
              <div ref={observerRef} className="h-1" />
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-neutral-400" />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSearch && <UserSearchOverlay onClose={() => setShowSearch(false)} />}

      <CommentSheet
        checkinId={commentCheckinId}
        open={!!commentCheckinId}
        onOpenChange={(open) => { if (!open) setCommentCheckinId(null); }}
      />
    </div>
  );
}
