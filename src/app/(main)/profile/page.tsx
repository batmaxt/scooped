"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IceCreamCone,
  MapPin,
  Star,
  Settings,
  Pencil,
  Clock,
  LogIn,
  Loader2,
  Camera,
  Heart,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserCheckins } from "@/queries/checkins";
import { fetchUserLists } from "@/queries/lists";
import { updateProfile, uploadAvatar } from "@/queries/social";
import { ModerationError } from "@/lib/moderation/nsfwCheck";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/shared/DemoButton";
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
import type { Checkin, List } from "@/types/models";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3 ${
            i < rating
              ? "fill-[#F2B45A] text-[#F2B45A]"
              : "fill-none text-neutral-300 dark:text-neutral-600"
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
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16">
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F] mb-1">
          Profile
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Your ice cream journey
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-[#FFF3EE] p-5 mb-5">
          <IceCreamCone className="size-10 text-[#F2B45A]" />
        </div>
        <h2 className="text-xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] mb-2">
          Track Your Ice Cream Journey
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
          Sign in to check in at your favorite shops, rate flavors, earn badges,
          and build your scooping profile.
        </p>
        <Link href="/login">
          <Button size="lg" variant="brand" className="gap-2">
            <LogIn className="size-4" />
            Sign In or Sign Up
          </Button>
        </Link>
        <DemoButton className="mt-3" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function ProfileSkeleton() {
  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background animate-in fade-in">
      <div className="px-5 pt-14 pb-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-3 mt-5 max-w-xs mx-auto">
          <Skeleton className="h-16 flex-1 rounded-2xl" />
          <Skeleton className="h-16 flex-1 rounded-2xl" />
          <Skeleton className="h-16 flex-1 rounded-2xl" />
        </div>
      </div>
      <div className="px-5 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
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
  currentAvatarUrl,
  userId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDisplayName: string;
  currentBio: string;
  currentFavoriteFlavor: string;
  currentAvatarUrl: string;
  userId: string;
}) {
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [bio, setBio] = useState(currentBio);
  const [favoriteFlavor, setFavoriteFlavor] = useState(currentFavoriteFlavor);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshProfile } = useAuth();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        setUploadingAvatar(true);
        avatarUrl = await uploadAvatar(userId, avatarFile);
        setUploadingAvatar(false);
      }
      return updateProfile(userId, {
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        favorite_flavor: favoriteFlavor.trim() || undefined,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      });
    },
    onSuccess: async () => {
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setAvatarFile(null);
      setAvatarPreview(null);
      onOpenChange(false);
    },
    onError: (err) => {
      setUploadingAvatar(false);
      if (err instanceof ModerationError) {
        setAvatarError(
          "This photo was flagged as inappropriate. Please choose a different image."
        );
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    },
  });

  const initials = getInitials(currentDisplayName || "?");
  const displayAvatarUrl = avatarPreview || currentAvatarUrl;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
            >
              <Avatar className="size-20 ring-4 ring-[rgba(93,64,55,0.12)] dark:ring-[#332520]/40">
                {displayAvatarUrl && (
                  <AvatarImage src={displayAvatarUrl} alt="Profile photo" />
                )}
                <AvatarFallback className="bg-gradient-to-br from-[#F46B8F] to-[#F2B45A] text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                <Camera className="size-6 text-white" />
              </div>
            </button>
            <span className="text-xs text-muted-foreground">Tap to change photo</span>
            {avatarError && (
              <span className="text-xs text-destructive font-medium">{avatarError}</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
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
            variant="brand"
            className="w-full"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                {uploadingAvatar ? "Uploading photo..." : "Saving..."}
              </>
            ) : (
              "Save Changes"
            )}
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
// Compact check-in row
// ---------------------------------------------------------------------------

function CompactCheckinRow({ checkin }: { checkin: Checkin }) {
  const locationName = checkin.location?.name ?? "Unknown";
  const flavorName = checkin.flavor?.name;
  const primaryRating = checkin.flavor_rating || checkin.location_rating || 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#FFF3EE]/50 dark:border-white/5 last:border-b-0">
      <div className="flex items-center justify-center size-8 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/20 shrink-0">
        <IceCreamCone className="size-4 text-[#F46B8F]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
          {flavorName || locationName}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{locationName}</span>
          <span className="shrink-0 flex items-center gap-0.5">
            <Clock className="size-2.5" />
            {getRelativeTime(checkin.created_at)}
          </span>
        </div>
      </div>
      {primaryRating > 0 && <StarRatingDisplay rating={primaryRating} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Favorite list card
// ---------------------------------------------------------------------------

function ListCard({ list }: { list: List }) {
  return (
    <Link href={`/list/${list.id}`}>
      <div className="flex items-center gap-3 py-3 border-b border-[#FFF3EE]/50 dark:border-white/5 last:border-b-0 hover:bg-[#FFF3EE]/20 transition-colors rounded-lg px-2 -mx-2">
        <div className="flex items-center justify-center size-8 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/20 shrink-0">
          <Heart className="size-4 text-[#F46B8F]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
            {list.name}
          </p>
          {list.description && (
            <p className="text-xs text-muted-foreground truncate">
              {list.description}
            </p>
          )}
        </div>
        <ChevronRight className="size-4 text-neutral-300 shrink-0" />
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Stat pill (inline)
// ---------------------------------------------------------------------------

function ProfileStatPill({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}) {
  const inner = (
    <div className="flex-1 bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 py-3 px-2 text-center">
      <p className="text-xl font-bold text-[#2E1F1B] dark:text-[#F5E6DC]">
        {value}
      </p>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </p>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="flex-1">
        {inner}
      </Link>
    );
  }
  return inner;
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

  const { data: checkins = [] } = useQuery({
    queryKey: ["userCheckins", user?.id],
    queryFn: () => fetchUserCheckins(user!.id, 10),
    enabled: !!user,
  });

  const { data: lists = [] } = useQuery({
    queryKey: ["userLists", user?.id],
    queryFn: () => fetchUserLists(user!.id),
    enabled: !!user,
  });


  if (isLoading) return <ProfileSkeleton />;
  if (!user || !profile) return <LoggedOutPrompt />;

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F]">
          Profile
        </p>
        <Link href="/settings">
          <button className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
            <Settings className="size-5" />
          </button>
        </Link>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center text-center px-5 pt-4 pb-6">
        <Avatar
          className="size-24 ring-4 ring-transparent shadow-lg mb-3"
          style={{
            background: "linear-gradient(135deg, #F46B8F, #F2B45A, #2E1F1B)",
            padding: "3px",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            {profile.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-[#F46B8F] via-[#F2B45A] to-[#2E1F1B] text-white text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </div>
        </Avatar>

        <p className="text-xs text-muted-foreground">@{profile.username}</p>
        <h2 className="text-2xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight mt-1">
          {profile.display_name || profile.username}
        </h2>

        {profile.bio && (
          <p className="mt-2 text-sm text-foreground/70 max-w-xs leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Stat pills */}
        <div className="flex items-stretch gap-3 mt-5 w-full max-w-xs">
          <ProfileStatPill
            value={profile.total_checkins}
            label="Scoops"
            href={`/profile/${profile.username}`}
          />
          <ProfileStatPill
            value={profile.follower_count}
            label="Followers"
            href={`/profile/${profile.username}/followers`}
          />
          <ProfileStatPill
            value={profile.following_count}
            label="Following"
            href={`/profile/${profile.username}/following`}
          />
        </div>

        {/* Edit profile button */}
        <Button
          variant="brand"
          className="mt-4 w-full max-w-xs gap-1.5 rounded-full h-11"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-3.5" />
          Edit Profile
        </Button>
      </div>

      {/* Content sections */}
      <div className="px-5 space-y-6">
        {/* Favorite lists */}
        {lists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="size-4 text-[#F46B8F]" />
                <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC]">
                  My lists
                </h3>
              </div>
              <Link
                href="/lists"
                className="text-xs font-semibold text-[#F46B8F]"
              >
                See all
              </Link>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 px-4">
              {lists.slice(0, 5).map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        )}

        {/* Recent scoops */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <IceCreamCone className="size-4 text-[#F2B45A]" />
              <h3 className="font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC]">
                Recent scoops
              </h3>
            </div>
          </div>
          {checkins.length === 0 ? (
            <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No check-ins yet. Visit a shop to get started!
              </p>
              <Link href="/discover">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-1.5 border-[rgba(93,64,55,0.12)] text-[#F46B8F] hover:bg-[#FFF3EE]"
                >
                  <MapPin className="size-3.5" />
                  Discover Shops
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 px-4">
              {checkins.slice(0, 8).map((checkin: Checkin) => (
                <CompactCheckinRow key={checkin.id} checkin={checkin} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Edit profile sheet */}
      <EditProfileSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        currentDisplayName={profile.display_name || ""}
        currentBio={profile.bio || ""}
        currentFavoriteFlavor={profile.favorite_flavor || ""}
        currentAvatarUrl={profile.avatar_url || ""}
        userId={user.id}
      />
    </div>
  );
}
