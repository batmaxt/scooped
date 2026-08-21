"use client";

// First-run taste onboarding: pick your 4 favorite flavors (identity moment,
// à la Letterboxd's Four Favorites), then we connect them to local shops —
// the payoff only Scooped can deliver. No invites, no walls.

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Check, Search, BellRing, MapPin, ArrowRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocation } from "@/hooks/useLocation";
import { fetchAllFlavorsForMatching } from "@/queries/checkins";
import { searchLocationsByFlavor } from "@/queries/locations";
import { createList, addListItem } from "@/queries/lists";
import { createAlert, fetchAlertCount } from "@/queries/alerts";
import {
  flavorColor,
  flavorEmoji,
  dedupeFlavorsByName,
  flavorNameKey,
} from "@/lib/flavor-utils";
import { FreshnessBadge } from "@/components/shared/FreshnessBadge";
import type { Flavor } from "@/types/models";

const MAX_PICKS = 4;

// Crowd-pleasers surface first in the grid; everything else is searchable.
const STARTER_ORDER = [
  "Vanilla", "Chocolate", "Strawberry", "Mint Chocolate Chip",
  "Cookies and Cream", "Salted Caramel", "Pistachio", "Cookie Dough",
  "Coffee", "Butter Pecan", "Rocky Road", "Black Cherry",
  "Birthday Cake", "Mango", "Peanut Butter Cup", "Cotton Candy",
  "Rum Raisin", "Matcha", "Coconut", "Black Raspberry",
  "Lemon", "Banana", "Ube", "Neapolitan",
];

// The "let's get weird" menu — the fringe of the catalog
const WEIRD_ORDER = [
  "Everything Bagel", "Black Sesame", "Pear & Blue Cheese",
  "Arbequina Olive Oil", "Miso Cherry", "Black Coconut Ash",
  "Pineapple Salted Egg Yolk", "Concord Grape Yuzu", "Honey Lavender",
  "Strawberry Honey Balsamic", "Bourbon Brown Butter", "Earl Grey Tea",
  "Thai Iced Tea", "Cornbread", "Avocado", "Goat Cheese Beet Swirl",
  "Sweet Corn", "Hojicha Hazelnut Praline", "Banana Black Sesame",
  "Hong Kong Milk Tea", "Wildberry Lavender", "Powdered Jelly Donut",
  "Salt and Pepper Pinenut", "Ooey Gooey Butter Cake",
];

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  if (miles < 0.1) return "nearby";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { position } = useLocation();
  const [step, setStep] = useState<"pick" | "reveal">("pick");
  const [picks, setPicks] = useState<Flavor[]>([]);
  const [search, setSearch] = useState("");
  const [weirdMode, setWeirdMode] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [saving, setSaving] = useState(false);
  const [alertedIds, setAlertedIds] = useState<Set<string>>(new Set());

  const lat = position?.latitude ?? 40.748;
  const lng = position?.longitude ?? -73.985;

  const { data: allFlavors = [], isLoading } = useQuery({
    queryKey: ["all-flavors-for-onboarding"],
    queryFn: fetchAllFlavorsForMatching,
    staleTime: 30 * 60 * 1000,
  });

  // Deduped, shop-agnostic picker pool
  const pool = useMemo(() => dedupeFlavorsByName(allFlavors), [allFlavors]);

  const gridFlavors = useMemo(() => {
    if (search.trim().length >= 2) {
      const q = search.trim().toLowerCase();
      return pool
        .filter((f) => f.name.toLowerCase().includes(q))
        .slice(0, 24);
    }
    // Curated grid by canonical name — classics, or the weird menu.
    // Shuffling swaps in fresh picks from the wider pool so nobody's limited
    // to the curated set.
    const byKey = new Map(pool.map((f) => [flavorNameKey(f.name), f]));
    const order = weirdMode ? WEIRD_ORDER : STARTER_ORDER;
    const curatedKeys = new Set(order.map(flavorNameKey));
    const curated: Flavor[] = [];
    for (const name of order) {
      const f = byKey.get(flavorNameKey(name));
      if (f) curated.push(f);
    }
    if (shuffleSeed === 0) return curated;

    // Wider pool for shuffles: weird mode favors the fringe (names outside
    // the classic families), classics mode samples everything.
    const CLASSIC_WORDS =
      /vanilla|chocolate|strawberry|caramel|cookie|mint|coffee|banana|lemon|mango|cherry|pistachio|pecan|birthday|fudge|oreo/i;
    const extras = pool.filter((f) => {
      if (curatedKeys.has(flavorNameKey(f.name))) return false;
      return weirdMode ? !CLASSIC_WORDS.test(f.name) : true;
    });
    // Simple shuffle
    const shuffled = [...extras].sort(() => Math.random() - 0.5).slice(0, 24);
    return shuffled.length >= 12 ? shuffled : [...shuffled, ...curated].slice(0, 24);
  }, [pool, search, weirdMode, shuffleSeed]);

  const togglePick = (flavor: Flavor) => {
    setPicks((prev) => {
      const exists = prev.find((p) => p.id === flavor.id);
      if (exists) return prev.filter((p) => p.id !== flavor.id);
      if (prev.length >= MAX_PICKS) return prev;
      return [...prev, flavor];
    });
  };

  // Save favorites as a list, then reveal local matches
  const revealMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        try {
          const list = await createList(user.id, {
            name: "My Favorite Flavors",
            description: "The four that define my taste",
            is_public: true,
          });
          for (const f of picks) {
            await addListItem(list.id, "flavor", f.id);
          }
        } catch {
          // List may already exist from a prior run — the reveal still works
        }
      }
    },
    onSuccess: () => setStep("reveal"),
  });

  const handleAlert = async (flavor: Flavor) => {
    if (!user) return;
    try {
      const count = await fetchAlertCount(user.id);
      if (count >= 3) return; // free-tier cap; fail quietly here
      await createAlert(user.id, "flavor", flavor.id);
      setAlertedIds((prev) => new Set(prev).add(flavor.id));
    } catch {
      // Duplicate alert etc. — treat as done
      setAlertedIds((prev) => new Set(prev).add(flavor.id));
    }
  };

  if (step === "pick") {
    return (
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-28">
        <div className="px-5 pt-14 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
            Welcome to Scooped
          </p>
          <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
            Pick your four favorite flavors
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            They become your taste — and we&apos;ll show you who&apos;s
            scooping them near you.
          </p>
        </div>

        {/* Picked row */}
        <div className="px-5 py-3 flex items-center gap-2">
          {Array.from({ length: MAX_PICKS }, (_, i) => {
            const f = picks[i];
            return f ? (
              <button
                key={f.id}
                onClick={() => togglePick(f)}
                className="relative flex items-center justify-center size-12 rounded-full text-xl elevation-1"
                style={{ backgroundColor: flavorColor(f.name) }}
                aria-label={`Remove ${f.name}`}
              >
                {flavorEmoji(f.name)}
                <span className="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-[#2E1F1B] text-white">
                  <X className="size-2.5" />
                </span>
              </button>
            ) : (
              <div
                key={`empty-${i}`}
                className="size-12 rounded-full border-2 border-dashed border-[rgba(93,64,55,0.2)] dark:border-white/15"
              />
            );
          })}
          <span className="ml-auto text-sm font-semibold text-muted-foreground">
            {picks.length}/{MAX_PICKS}
          </span>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Can't see yours? Search 600+ flavors..."
              className="pl-10 h-11 rounded-full bg-white dark:bg-card"
            />
          </div>
        </div>

        {/* Mode flip + shuffle */}
        {search.trim().length < 2 && (
          <div className="px-5 pb-3 flex gap-2">
            <button
              onClick={() => {
                setWeirdMode((v) => !v);
                setShuffleSeed(0);
              }}
              className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-full text-sm font-bold transition-all active:scale-[0.98] ${
                weirdMode
                  ? "bg-[#2E1F1B] text-white dark:bg-[#FFF3EE] dark:text-[#2E1F1B]"
                  : "bg-gradient-to-r from-[#B79FD4] via-[#F49FB6] to-[#F2B45A] text-[#2E1F1B]"
              }`}
            >
              {weirdMode ? "← Back to the classics" : "🛸 Let's get weird"}
            </button>
            <button
              onClick={() => setShuffleSeed((s) => s + 1)}
              className="shrink-0 h-11 px-4 rounded-full bg-white dark:bg-card border border-[rgba(93,64,55,0.12)] dark:border-white/10 text-sm font-bold text-[#2E1F1B] dark:text-[#F5E6DC] active:scale-[0.98] transition-all"
              aria-label="Shuffle for different flavors"
            >
              🎲 Shuffle
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="px-5 grid grid-cols-2 gap-2.5">
          {weirdMode && search.trim().length < 2 && (
            <button
              onClick={() => {
                setWeirdMode(false);
                setShuffleSeed(0);
              }}
              className="flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left border-2 border-dashed border-[rgba(93,64,55,0.25)] dark:border-white/20 bg-transparent transition-all active:scale-[0.97]"
            >
              <span
                className="flex items-center justify-center size-9 rounded-full text-lg shrink-0 bg-[#FFF3EE] dark:bg-[#332520]/40"
                aria-hidden
              >
                😅
              </span>
              <span className="font-bold text-[13px] text-[#8C6F66] dark:text-[#A8897E] leading-tight flex-1">
                maybe not that weird
              </span>
            </button>
          )}
          {isLoading
            ? Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              ))
            : gridFlavors.map((flavor) => {
                const picked = picks.some((p) => p.id === flavor.id);
                return (
                  <button
                    key={flavor.id}
                    onClick={() => togglePick(flavor)}
                    className={`flex items-center gap-2.5 rounded-2xl px-3 py-3 text-left border-2 transition-all active:scale-[0.97] ${
                      picked
                        ? "border-[#C4364A] bg-[#FFF3EE] dark:bg-[#332520]/30"
                        : "border-transparent bg-white dark:bg-card"
                    }`}
                  >
                    <span
                      className="flex items-center justify-center size-9 rounded-full text-lg shrink-0"
                      style={{ backgroundColor: flavorColor(flavor.name) }}
                      aria-hidden
                    >
                      {flavorEmoji(flavor.name)}
                    </span>
                    <span className="font-bold text-[13px] text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight line-clamp-2 flex-1">
                      {flavor.name}
                    </span>
                    {picked && <Check className="size-4 text-[#C4364A] shrink-0" />}
                  </button>
                );
              })}
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#FFF7ED] via-[#FFF7ED]/95 to-transparent dark:from-background dark:via-background/95">
          <Button
            variant="brand"
            size="lg"
            className="w-full gap-2"
            disabled={picks.length < 1 || revealMutation.isPending}
            onClick={() => revealMutation.mutate()}
          >
            {revealMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                {picks.length < MAX_PICKS
                  ? `Continue with ${picks.length}`
                  : "Show me who's scooping these"}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
          <Link
            href="/home"
            className="block text-center text-sm text-[#8C6F66] dark:text-[#A8897E] mt-3"
          >
            Skip for now
          </Link>
        </div>
      </div>
    );
  }

  // Reveal step
  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-28">
      <div className="px-5 pt-14 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C4364A] mb-1">
          Your taste, mapped
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Here&apos;s who&apos;s scooping your favorites
        </h1>
      </div>

      <div className="px-5 space-y-5">
        {picks.map((flavor) => (
          <FavoriteReveal
            key={flavor.id}
            flavor={flavor}
            lat={lat}
            lng={lng}
            alerted={alertedIds.has(flavor.id)}
            onAlert={() => handleAlert(flavor)}
            canAlert={!!user}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#FFF7ED] via-[#FFF7ED]/95 to-transparent dark:from-background dark:via-background/95">
        <Button
          variant="brand"
          size="lg"
          className="w-full gap-2"
          disabled={saving}
          onClick={() => {
            setSaving(true);
            router.push("/home");
          }}
        >
          Start scooping
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function FavoriteReveal({
  flavor,
  lat,
  lng,
  alerted,
  onAlert,
  canAlert,
}: {
  flavor: Flavor;
  lat: number;
  lng: number;
  alerted: boolean;
  onAlert: () => void;
  canAlert: boolean;
}) {
  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["flavor-spots", flavor.name, lat, lng],
    queryFn: () => searchLocationsByFlavor(flavor.name, lat, lng, 80000),
    staleTime: 5 * 60 * 1000,
  });
  const shopSpots = spots.filter((s) => s.location_type === "scoop_shop");

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-4">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="flex items-center justify-center size-10 rounded-full text-xl shrink-0"
          style={{ backgroundColor: flavorColor(flavor.name) }}
          aria-hidden
        >
          {flavorEmoji(flavor.name)}
        </span>
        <p className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC]">
          {flavor.name}
        </p>
      </div>

      {isLoading ? (
        <div className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      ) : shopSpots.length > 0 ? (
        <div className="space-y-2">
          {shopSpots.slice(0, 2).map((spot) => (
            <Link key={spot.id} href={`/location/${spot.slug}`}>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-[#FFF7ED] dark:bg-[#332520]/20 px-3 py-2.5 mb-1 press-card">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
                    {spot.name}
                  </p>
                  <div className="flex items-center gap-2">
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
                <MapPin className="size-4 text-[#F46B8F] shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex-1">
            No shop has confirmed this near you yet — be the first to know
            when one does.
          </p>
          {canAlert &&
            (alerted ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                <Check className="size-3.5" />
                Radar on
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 shrink-0"
                onClick={onAlert}
              >
                <BellRing className="size-3.5" />
                Alert me
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
