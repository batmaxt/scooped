"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  IceCreamCone,
  MapPin,
  Star,
  Award,
  List,
  Clock,
  Users,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowButton } from "@/components/shared/FollowButton";
import { BadgeGrid } from "@/components/shared/BadgeGrid";
import { ListsTab } from "@/components/shared/ListsTab";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchProfileByUsername } from "@/queries/social";
import { fetchUserCheckins } from "@/queries/checkins";
import { getRelativeTime, getInitials } from "@/lib/utils";
import type { Profile, Checkin } from "@/types/models";

// ---------------------------------------------------------------------------
// CheckinCard (reused from profile page pattern)
// ---------------------------------------------------------------------------

function CheckinCard({ checkin }: { checkin: Checkin }) {
  const locationName = checkin.location?.name ?? "Unknown Location";
  const cityState = [checkin.location?.city, checkin.location?.state]
    .filter(Boolean)
    .join(", ");
  const flavorName = checkin.flavor?.name;
  const brandName = checkin.brand?.name;
  const primaryRating = checkin.flavor_rating || checkin.location_rating || 0;

  return (
    <Card className="gap-0 py-0 overflow-hidden">
      <CardContent className="px-4 py-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-pink-400 shrink-0" />
              <span className="font-semibold text-sm truncate">
                {locationName}
              </span>
            </div>
            {cityState && (
              <p className="text-xs text-muted-foreground ml-5">{cityState}</p>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Clock className="size-3" />
            {getRelativeTime(checkin.created_at)}
          </span>
        </div>

        {flavorName && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-amber-50 text-amber-700 border border-amber-200"
            >
              <IceCreamCone className="size-3 mr-1" />
              {flavorName}
            </Badge>
            {brandName && (
              <span className="text-xs text-muted-foreground">
                by {brandName}
              </span>
            )}
          </div>
        )}

        {primaryRating > 0 && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i < primaryRating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-neutral-300"
                }`}
              />
            ))}
          </div>
        )}

        {checkin.notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {checkin.notes}
          </p>
        )}

        {checkin.tags && checkin.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {checkin.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Checkins tab
// ---------------------------------------------------------------------------

function CheckinsTab({ userId }: { userId: string }) {
  const {
    data: checkins,
    isLoading,
  } = useQuery({
    queryKey: ["userCheckins", userId],
    queryFn: () => fetchUserCheckins(userId, 50),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!checkins || checkins.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="rounded-full bg-pink-50 p-4 mb-4">
          <IceCreamCone className="size-8 text-pink-300" />
        </div>
        <h3 className="font-semibold mb-1">No check-ins yet</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          This user hasn&apos;t checked in anywhere yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {checkins.map((checkin: Checkin) => (
        <CheckinCard key={checkin.id} checkin={checkin} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat item
// ---------------------------------------------------------------------------

function StatItem({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}) {
  const content = (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-70 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfileByUsername(username),
    enabled: !!username,
  });

  const initials = useMemo(
    () => getInitials(profile?.display_name, profile?.username),
    [profile?.display_name, profile?.username]
  );

  // Redirect to own profile if viewing self
  const isOwnProfile = user?.id === profile?.id;

  if (isLoading) {
    return (
      <div className="px-4 pt-8 pb-4 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="size-6" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-center gap-6">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Users className="size-12 text-neutral-300 mb-4" />
        <h2 className="text-lg font-bold mb-2">User not found</h2>
        <p className="text-sm text-muted-foreground">
          @{username} doesn&apos;t exist.
        </p>
        <Link href="/feed" className="mt-4 text-sm text-pink-500 font-medium">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50/60 via-white to-white pb-20">
      {/* Header */}
      <header className="relative px-4 pt-8 pb-6">
        <Link
          href="/feed"
          className="absolute top-4 left-4 p-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div className="flex flex-col items-center text-center">
          <Avatar className="size-20 ring-4 ring-white shadow-md mb-3">
            {profile.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-amber-300 text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-lg font-bold leading-tight">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>

          {profile.bio && (
            <p className="mt-2 text-sm text-foreground/80 max-w-xs leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <StatItem value={profile.total_checkins} label="Check-ins" />
            <div className="h-8 w-px bg-border" />
            <StatItem
              value={profile.follower_count}
              label="Followers"
              href={`/profile/${profile.username}/followers`}
            />
            <div className="h-8 w-px bg-border" />
            <StatItem
              value={profile.following_count}
              label="Following"
              href={`/profile/${profile.username}/following`}
            />
          </div>

          {/* Follow button (if not own profile) */}
          {!isOwnProfile && (
            <div className="mt-5">
              <FollowButton targetUserId={profile.id} />
            </div>
          )}

          {isOwnProfile && (
            <Link
              href="/profile"
              className="mt-3 text-xs text-pink-500 font-medium"
            >
              Go to your profile
            </Link>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-6">
        <Tabs defaultValue="checkins" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="checkins" className="flex-1 gap-1.5">
              <IceCreamCone className="size-4" />
              Check-ins
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-1 gap-1.5">
              <Award className="size-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex-1 gap-1.5">
              <List className="size-4" />
              Lists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkins">
            <CheckinsTab userId={profile.id} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeGrid userId={profile.id} />
          </TabsContent>

          <TabsContent value="lists">
            <ListsTab userId={profile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
