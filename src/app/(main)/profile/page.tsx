"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  IceCreamCone,
  MapPin,
  Star,
  Settings,
  Pencil,
  Award,
  List,
  Clock,
  LogIn,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserCheckins } from "@/queries/checkins";
import { updateProfile } from "@/queries/social";
import { BadgeGrid } from "@/components/shared/BadgeGrid";
import { ListsTab } from "@/components/shared/ListsTab";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getRelativeTime, getInitials } from "@/lib/utils";
import type { Checkin } from "@/types/models";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-neutral-300"
          }`}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Logged-out prompt
// ---------------------------------------------------------------------------

function LoggedOutPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="rounded-full bg-pink-50 p-5 mb-5">
        <IceCreamCone className="size-10 text-pink-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Track Your Ice Cream Journey</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Sign in to check in at your favorite shops, rate flavors, earn badges,
        and build your scooping profile.
      </p>
      <Link href="/login">
        <Button size="lg" className="gap-2 bg-pink-500 hover:bg-pink-600 text-white">
          <LogIn className="size-4" />
          Sign In or Sign Up
        </Button>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function ProfileSkeleton() {
  return (
    <div className="px-4 pt-8 pb-4 space-y-6 animate-in fade-in">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex justify-center gap-6">
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-12 w-20" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Check-in card
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

        {primaryRating > 0 && <StarRatingDisplay rating={primaryRating} />}

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
  const { data: checkins, isLoading, isError } = useQuery({
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

  if (isError) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Something went wrong loading your check-ins. Please try again.
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
        <p className="text-sm text-muted-foreground max-w-[240px] mb-4">
          Visit a shop and check in to start building your ice cream history!
        </p>
        <Link href="/discover">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            <MapPin className="size-3.5" />
            Discover Shops
          </Button>
        </Link>
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
// Edit profile sheet
// ---------------------------------------------------------------------------

function EditProfileSheet({
  open,
  onOpenChange,
  currentDisplayName,
  currentBio,
  currentFavoriteFlavor,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDisplayName: string;
  currentBio: string;
  currentFavoriteFlavor: string;
  userId: string;
}) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [bio, setBio] = useState(currentBio);
  const [favoriteFlavor, setFavoriteFlavor] = useState(currentFavoriteFlavor);
  const { refreshProfile } = useAuth();

  const mutation = useMutation({
    mutationFn: () =>
      updateProfile(userId, {
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        favorite_flavor: favoriteFlavor.trim() || undefined,
      }),
    onSuccess: async () => {
      await refreshProfile();
      onOpenChange(false);
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your ice cream journey"
              maxLength={160}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favoriteFlavor">Favorite Flavor</Label>
            <Input
              id="favoriteFlavor"
              value={favoriteFlavor}
              onChange={(e) => setFavoriteFlavor(e.target.value)}
              placeholder="e.g., Pistachio"
            />
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
          >
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
          {mutation.isError && (
            <p className="text-xs text-red-500 text-center">
              Failed to save. Please try again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
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
// Main profile page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const initials = useMemo(
    () => getInitials(profile?.display_name, profile?.username),
    [profile?.display_name, profile?.username]
  );

  if (isLoading) return <ProfileSkeleton />;
  if (!user || !profile) return <LoggedOutPrompt />;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-pink-50/60 via-white to-white">
      {/* Header */}
      <header className="relative px-4 pt-8 pb-6">
        <div className="absolute top-4 right-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="size-5 text-muted-foreground" />
            </Button>
          </Link>
        </div>

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

          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-5 gap-1.5 border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-3.5" />
            Edit Profile
          </Button>
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
            <CheckinsTab userId={user.id} />
          </TabsContent>

          <TabsContent value="badges">
            <BadgeGrid userId={user.id} />
          </TabsContent>

          <TabsContent value="lists">
            <ListsTab userId={user.id} isOwnProfile />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit profile sheet */}
      <EditProfileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        currentDisplayName={profile.display_name || ""}
        currentBio={profile.bio || ""}
        currentFavoriteFlavor={profile.favorite_flavor || ""}
        userId={user.id}
      />
    </div>
  );
}
