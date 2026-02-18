"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
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
import { fetchAllBadges } from "@/queries/badges";
import type { Badge } from "@/types/models";

// ---------------------------------------------------------------------------
// Unique badge visuals (mirrored from BadgeGrid)
// ---------------------------------------------------------------------------

interface BadgeVisual {
  icon: typeof Sparkles;
  gradient: string;
  ringColor: string;
}

const BADGE_VISUALS: Record<string, BadgeVisual> = {
  "first-scoop":          { icon: Sparkles,   gradient: "from-pink-400 to-rose-500",                   ringColor: "ring-amber-600/60" },
  regular:                { icon: Repeat,     gradient: "from-pink-500 to-fuchsia-500",                ringColor: "ring-neutral-300" },
  "ice-cream-fanatic":    { icon: Flame,      gradient: "from-rose-500 to-orange-500",                 ringColor: "ring-amber-400" },
  "century-club":         { icon: Trophy,     gradient: "from-amber-400 via-yellow-300 to-amber-500",  ringColor: "ring-sky-300" },
  "flavor-explorer":      { icon: Palette,    gradient: "from-amber-400 to-orange-500",                ringColor: "ring-amber-600/60" },
  "flavor-connoisseur":   { icon: Wine,       gradient: "from-orange-400 to-red-500",                  ringColor: "ring-amber-400" },
  "flavor-master":        { icon: Crown,      gradient: "from-amber-300 via-yellow-400 to-amber-500",  ringColor: "ring-sky-300" },
  "shop-hopper":          { icon: Store,      gradient: "from-blue-400 to-cyan-500",                   ringColor: "ring-amber-600/60" },
  "neighborhood-explorer":{ icon: Compass,    gradient: "from-blue-500 to-indigo-500",                 ringColor: "ring-neutral-300" },
  "nyc-ice-cream-tour":   { icon: Map,        gradient: "from-indigo-500 to-purple-500",               ringColor: "ring-amber-400" },
  "globe-trotter":        { icon: Globe,      gradient: "from-cyan-400 via-blue-500 to-indigo-600",    ringColor: "ring-sky-300" },
  "social-butterfly":     { icon: Heart,      gradient: "from-violet-400 to-purple-500",               ringColor: "ring-neutral-300" },
  trendsetter:            { icon: TrendingUp, gradient: "from-fuchsia-500 to-violet-600",              ringColor: "ring-amber-400" },
  photographer:           { icon: Camera,     gradient: "from-emerald-400 to-teal-500",                ringColor: "ring-neutral-300" },
  critic:                 { icon: PenLine,    gradient: "from-teal-500 to-emerald-600",                ringColor: "ring-amber-400" },
};

const DEFAULT_VISUAL: BadgeVisual = {
  icon: Sparkles,
  gradient: "from-neutral-400 to-neutral-500",
  ringColor: "ring-neutral-300",
};

function getVisual(slug: string): BadgeVisual {
  return BADGE_VISUALS[slug] || DEFAULT_VISUAL;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BadgeCelebrationProps {
  badgeIds: string[];
  onDismiss: () => void;
}

export function BadgeCelebration({ badgeIds, onDismiss }: BadgeCelebrationProps) {
  const [visible, setVisible] = useState(true);

  const { data: allBadges = [] } = useQuery({
    queryKey: ["allBadges"],
    queryFn: fetchAllBadges,
    staleTime: 60 * 60 * 1000,
  });

  const newBadges = allBadges.filter((b: Badge) => badgeIds.includes(b.id));

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible || newBadges.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 animate-in fade-in duration-300">
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              backgroundColor: ["#ec4899", "#f59e0b", "#8b5cf6", "#3b82f6", "#10b981"][
                i % 5
              ],
              animation: `confetti-fall ${1.5 + Math.random() * 2}s ease-in forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Badge card */}
      <div className="relative bg-white rounded-3xl p-8 mx-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Badge Earned!
          </p>

          {newBadges.map((badge: Badge) => {
            const visual = getVisual(badge.slug);
            const Icon = visual.icon;

            return (
              <div key={badge.id} className="flex flex-col items-center mb-4">
                <div
                  className={`size-24 rounded-full flex items-center justify-center bg-gradient-to-br ${visual.gradient} text-white shadow-lg ring-4 ${visual.ringColor} mb-4 animate-in zoom-in-0 duration-700`}
                >
                  <Icon className="size-12" />
                </div>
                <h2 className="text-xl font-bold">{badge.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
