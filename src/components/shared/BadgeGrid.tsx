"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Lock,
  Sparkles,
  Repeat,
  Flame,
  Trophy,
  Palette,
  Wine,
  Crown,
  Store,
  Compass,
  Map,
  Globe,
  Heart,
  TrendingUp,
  Camera,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllBadges, fetchUserBadges } from "@/queries/badges";
import type { Badge, UserBadge } from "@/types/models";

// ---------------------------------------------------------------------------
// Category labels
// ---------------------------------------------------------------------------

const CATEGORY_LABELS: Record<string, string> = {
  checkins: "Check-ins",
  flavors: "Flavors",
  locations: "Locations",
  social: "Social",
  special: "Special",
};

// ---------------------------------------------------------------------------
// Unique badge config: icon, gradient, tier ring color
// ---------------------------------------------------------------------------

interface BadgeVisual {
  icon: typeof Sparkles;
  gradient: string;       // bg gradient for the circle
  ringColor: string;      // tier ring (bronze / silver / gold / diamond)
  glowColor?: string;     // optional subtle glow for earned state
}

const BADGE_VISUALS: Record<string, BadgeVisual> = {
  // ── Check-ins ──────────────────────────────────
  "first-scoop": {
    icon: Sparkles,
    gradient: "from-pink-400 to-rose-500",
    ringColor: "ring-amber-600/60",          // bronze
    glowColor: "shadow-pink-300/40",
  },
  regular: {
    icon: Repeat,
    gradient: "from-pink-500 to-fuchsia-500",
    ringColor: "ring-neutral-300",           // silver
    glowColor: "shadow-pink-400/30",
  },
  "ice-cream-fanatic": {
    icon: Flame,
    gradient: "from-rose-500 to-orange-500",
    ringColor: "ring-amber-400",             // gold
    glowColor: "shadow-orange-400/40",
  },
  "century-club": {
    icon: Trophy,
    gradient: "from-amber-400 via-yellow-300 to-amber-500",
    ringColor: "ring-sky-300",               // diamond
    glowColor: "shadow-amber-400/50",
  },

  // ── Flavors ────────────────────────────────────
  "flavor-explorer": {
    icon: Palette,
    gradient: "from-amber-400 to-orange-500",
    ringColor: "ring-amber-600/60",          // bronze
    glowColor: "shadow-amber-300/40",
  },
  "flavor-connoisseur": {
    icon: Wine,
    gradient: "from-orange-400 to-red-500",
    ringColor: "ring-amber-400",             // gold
    glowColor: "shadow-orange-400/40",
  },
  "flavor-master": {
    icon: Crown,
    gradient: "from-amber-300 via-yellow-400 to-amber-500",
    ringColor: "ring-sky-300",               // diamond
    glowColor: "shadow-yellow-400/50",
  },

  // ── Locations ──────────────────────────────────
  "shop-hopper": {
    icon: Store,
    gradient: "from-blue-400 to-cyan-500",
    ringColor: "ring-amber-600/60",          // bronze
    glowColor: "shadow-blue-300/40",
  },
  "neighborhood-explorer": {
    icon: Compass,
    gradient: "from-blue-500 to-indigo-500",
    ringColor: "ring-neutral-300",           // silver
    glowColor: "shadow-blue-400/30",
  },
  "nyc-ice-cream-tour": {
    icon: Map,
    gradient: "from-indigo-500 to-purple-500",
    ringColor: "ring-amber-400",             // gold
    glowColor: "shadow-indigo-400/40",
  },
  "globe-trotter": {
    icon: Globe,
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    ringColor: "ring-sky-300",               // diamond
    glowColor: "shadow-cyan-400/50",
  },

  // ── Social ─────────────────────────────────────
  "social-butterfly": {
    icon: Heart,
    gradient: "from-violet-400 to-purple-500",
    ringColor: "ring-neutral-300",           // silver
    glowColor: "shadow-violet-300/40",
  },
  trendsetter: {
    icon: TrendingUp,
    gradient: "from-fuchsia-500 to-violet-600",
    ringColor: "ring-amber-400",             // gold
    glowColor: "shadow-fuchsia-400/40",
  },

  // ── Special ────────────────────────────────────
  photographer: {
    icon: Camera,
    gradient: "from-emerald-400 to-teal-500",
    ringColor: "ring-neutral-300",           // silver
    glowColor: "shadow-emerald-300/40",
  },
  critic: {
    icon: PenLine,
    gradient: "from-teal-500 to-emerald-600",
    ringColor: "ring-amber-400",             // gold
    glowColor: "shadow-teal-400/40",
  },
};

// Fallback visual for unknown slugs
const DEFAULT_VISUAL: BadgeVisual = {
  icon: Sparkles,
  gradient: "from-neutral-400 to-neutral-500",
  ringColor: "ring-neutral-300",
};

function getVisual(slug: string): BadgeVisual {
  return BADGE_VISUALS[slug] || DEFAULT_VISUAL;
}

// ---------------------------------------------------------------------------
// Category section header colors
// ---------------------------------------------------------------------------

const CATEGORY_HEADER_COLORS: Record<string, string> = {
  checkins: "text-pink-500",
  flavors: "text-amber-500",
  locations: "text-blue-500",
  social: "text-violet-500",
  special: "text-emerald-500",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BadgeGridProps {
  userId: string;
}

export function BadgeGrid({ userId }: BadgeGridProps) {
  const { data: allBadges = [], isLoading: loadingBadges } = useQuery({
    queryKey: ["allBadges"],
    queryFn: fetchAllBadges,
    staleTime: 60 * 60 * 1000,
  });

  const { data: userBadges = [], isLoading: loadingUserBadges } = useQuery({
    queryKey: ["userBadges", userId],
    queryFn: () => fetchUserBadges(userId),
    enabled: !!userId,
  });

  if (loadingBadges || loadingUserBadges) {
    return (
      <div className="grid grid-cols-3 gap-3 pt-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-square rounded-2xl" />
        ))}
      </div>
    );
  }

  const earnedIds = new Set(userBadges.map((ub: UserBadge) => ub.badge_id));

  // Group badges by category
  const grouped = allBadges.reduce(
    (acc, badge) => {
      const cat = badge.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(badge);
      return acc;
    },
    {} as Record<string, Badge[]>
  );

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-6 pt-2">
      {/* Progress counter */}
      <div className="text-center">
        <p className="text-2xl font-bold">
          {userBadges.length}
          <span className="text-muted-foreground font-normal text-base">
            {" "}/ {allBadges.length}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">Badges Earned</p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3
            className={cn(
              "text-sm font-semibold mb-3 flex items-center gap-1.5",
              CATEGORY_HEADER_COLORS[category] || "text-muted-foreground"
            )}
          >
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {grouped[category].map((badge) => {
              const earned = earnedIds.has(badge.id);
              const visual = getVisual(badge.slug);
              const Icon = visual.icon;

              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all",
                    earned
                      ? "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 elevation-1"
                      : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 opacity-40"
                  )}
                >
                  <div
                    className={cn(
                      "size-14 rounded-full flex items-center justify-center ring-[3px] transition-all",
                      earned
                        ? `bg-gradient-to-br ${visual.gradient} text-white shadow-lg ${visual.glowColor || ""} ${visual.ringColor}`
                        : "bg-neutral-200 text-neutral-400 ring-neutral-200"
                    )}
                  >
                    {earned ? (
                      <Icon className="size-7" />
                    ) : (
                      <Lock className="size-5" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-semibold text-center leading-tight",
                      earned ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
