"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllBadges, fetchUserBadges } from "@/queries/badges";
import type { Badge, UserBadge } from "@/types/models";

const CATEGORY_LABELS: Record<string, string> = {
  checkins: "Check-ins",
  flavors: "Flavors",
  locations: "Locations",
  social: "Social",
  special: "Special",
};

const CATEGORY_COLORS: Record<string, string> = {
  checkins: "from-pink-400 to-pink-500",
  flavors: "from-amber-400 to-amber-500",
  locations: "from-blue-400 to-blue-500",
  social: "from-violet-400 to-violet-500",
  special: "from-emerald-400 to-emerald-500",
};

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
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {grouped[category].map((badge) => {
              const earned = earnedIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                    earned
                      ? "bg-white border-neutral-200 shadow-sm"
                      : "bg-neutral-50 border-neutral-100 opacity-50"
                  }`}
                >
                  <div
                    className={`size-12 rounded-full flex items-center justify-center ${
                      earned
                        ? `bg-gradient-to-br ${CATEGORY_COLORS[category] || "from-neutral-400 to-neutral-500"} text-white shadow-md`
                        : "bg-neutral-200 text-neutral-400"
                    }`}
                  >
                    {earned ? (
                      <Award className="size-6" />
                    ) : (
                      <Lock className="size-5" />
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium text-center leading-tight ${
                      earned ? "text-foreground" : "text-muted-foreground"
                    }`}
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
