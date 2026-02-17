"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  User,
  LogOut,
  Ruler,
  Map,
  LayoutList,
  Bell,
  UserPlus,
  Heart,
  IceCreamCone,
  Info,
  FileText,
  Shield,
  Loader2,
  Pencil,
  Store,
  ShieldCheck,
  BellRing,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { updateProfile, updateNotificationPrefs } from "@/queries/social";
import { fetchClaimedLocation, fetchAllClaims } from "@/queries/business";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Edit Profile Sheet (inline — same as profile page)
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
// Setting row components
// ---------------------------------------------------------------------------

function SettingRow({
  icon: Icon,
  label,
  description,
  onClick,
  rightElement,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-neutral-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center size-9 rounded-lg bg-neutral-100 shrink-0">
        <Icon className="size-4.5 text-neutral-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {rightElement ?? (onClick ? <ChevronRight className="size-4 text-neutral-400 shrink-0" /> : null)}
    </Wrapper>
  );
}

function SettingToggle({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 w-full px-4 py-3.5">
      <div className="flex items-center justify-center size-9 rounded-lg bg-neutral-100 shrink-0">
        <Icon className="size-4.5 text-neutral-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${disabled ? "text-muted-foreground" : "text-foreground"}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="px-4 pt-6 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Main settings page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const searchParams = useSearchParams();
  const [editOpen, setEditOpen] = useState(false);

  // Display preferences (localStorage)
  const [useMiles, setUseMiles] = useLocalStorage("scooped:useMiles", true);
  const [compactFeed, setCompactFeed] = useLocalStorage("scooped:compactFeed", false);
  const [satelliteMap, setSatelliteMap] = useLocalStorage("scooped:satelliteMap", false);

  const ADMIN_ID = "ed1906c8-2e71-4b6c-ac4a-8af4466edc1c";
  const isAdmin = user?.id === ADMIN_ID;

  // Business claim check
  const { data: claimedLocation } = useQuery({
    queryKey: ["claimed-location", user?.id],
    queryFn: () => fetchClaimedLocation(user!.id),
    enabled: !!user,
  });

  // Admin: pending claims count
  const { data: pendingClaims = [] } = useQuery({
    queryKey: ["admin-claims", "pending"],
    queryFn: () => fetchAllClaims("pending"),
    enabled: isAdmin,
  });

  // Notification preference mutations
  const notifPrefMutation = useMutation({
    mutationFn: (prefs: {
      notify_new_followers?: boolean;
      notify_likes_comments?: boolean;
      notify_flavor_alerts?: boolean;
    }) => updateNotificationPrefs(user!.id, prefs),
    onSuccess: () => refreshProfile(),
  });

  const handleNotifToggle = (
    key: "notify_new_followers" | "notify_likes_comments" | "notify_flavor_alerts",
    value: boolean
  ) => {
    notifPrefMutation.mutate({ [key]: value });
  };

  return (
    <div className="min-h-dvh bg-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link
            href="/profile"
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold">Settings</h1>
        </div>
      </header>

      {/* Account */}
      <SectionHeader title="Account" />
      <div className="divide-y divide-neutral-100">
        <SettingRow
          icon={Pencil}
          label="Edit Profile"
          description="Name, bio, favorite flavor"
          onClick={() => setEditOpen(true)}
        />
        {claimedLocation && (
          <SettingRow
            icon={Store}
            label="Business Dashboard"
            description={claimedLocation.name}
            onClick={() => { window.location.href = "/dashboard"; }}
          />
        )}
        <SettingRow
          icon={LogOut}
          label="Sign Out"
          description={profile?.username ? `@${profile.username}` : undefined}
          onClick={async () => {
            await signOut();
            window.location.href = "/login";
          }}
        />
      </div>

      {/* Admin (only visible to admin user) */}
      {isAdmin && (
        <>
          <SectionHeader title="Admin" />
          <div className="divide-y divide-neutral-100">
            <SettingRow
              icon={ShieldCheck}
              label="Review Claims"
              description={
                pendingClaims.length > 0
                  ? `${pendingClaims.length} pending`
                  : "No pending claims"
              }
              onClick={() => { window.location.href = "/admin/claims"; }}
              rightElement={
                pendingClaims.length > 0 ? (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-pink-500 text-white text-xs font-bold">
                    {pendingClaims.length}
                  </span>
                ) : undefined
              }
            />
          </div>
        </>
      )}

      {/* Display */}
      <SectionHeader title="Display" />
      <div className="divide-y divide-neutral-100">
        <SettingToggle
          icon={Ruler}
          label="Use Miles"
          description="Show distances in miles instead of kilometers"
          checked={useMiles}
          onCheckedChange={setUseMiles}
        />
        <SettingToggle
          icon={Map}
          label="Satellite Map"
          description="Use satellite imagery on the discover map"
          checked={satelliteMap}
          onCheckedChange={setSatelliteMap}
        />
        <SettingToggle
          icon={LayoutList}
          label="Compact Feed"
          description="Hide notes and tags in feed for faster scrolling"
          checked={compactFeed}
          onCheckedChange={setCompactFeed}
        />
      </div>

      {/* Notifications */}
      <SectionHeader title="Notifications" />
      <div className="divide-y divide-neutral-100">
        <SettingToggle
          icon={Bell}
          label="Push Notifications"
          description="Coming soon"
          checked={false}
          onCheckedChange={() => {}}
          disabled
        />
        <SettingToggle
          icon={UserPlus}
          label="New Followers"
          description="Get notified when someone follows you"
          checked={profile?.notify_new_followers ?? true}
          onCheckedChange={(v) => handleNotifToggle("notify_new_followers", v)}
        />
        <SettingToggle
          icon={Heart}
          label="Likes & Comments"
          description="Get notified when someone likes or comments"
          checked={profile?.notify_likes_comments ?? true}
          onCheckedChange={(v) => handleNotifToggle("notify_likes_comments", v)}
        />
        <SettingToggle
          icon={IceCreamCone}
          label="Flavor Alerts"
          description="Get notified when tracked flavors appear at shops"
          checked={profile?.notify_flavor_alerts ?? true}
          onCheckedChange={(v) => handleNotifToggle("notify_flavor_alerts", v)}
        />
        <SettingRow
          icon={BellRing}
          label="Manage Alerts"
          description="View and edit your flavor alerts"
          onClick={() => { window.location.href = "/alerts"; }}
        />
      </div>

      {/* About */}
      <SectionHeader title="About" />
      <div className="divide-y divide-neutral-100">
        <SettingRow
          icon={Info}
          label="Version"
          rightElement={
            <span className="text-xs text-muted-foreground">1.0.0-beta</span>
          }
        />
        <SettingRow
          icon={FileText}
          label="Privacy Policy"
          onClick={() => {}}
        />
        <SettingRow
          icon={Shield}
          label="Terms of Service"
          onClick={() => {}}
        />
      </div>

      {/* Edit Profile Sheet */}
      {user && profile && (
        <EditProfileSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          currentDisplayName={profile.display_name || ""}
          currentBio={profile.bio || ""}
          currentFavoriteFlavor={profile.favorite_flavor || ""}
          userId={user.id}
        />
      )}
    </div>
  );
}
