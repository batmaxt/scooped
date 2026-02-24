"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Newspaper,
  Search,
  Bell,
  X,
  LogIn,
  Loader2,
  Users,
  IceCreamCone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedCard } from "@/components/shared/FeedCard";
import { CommentSheet } from "@/components/shared/CommentSheet";
import { UserRow } from "@/components/shared/UserRow";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { fetchFeed, searchUsers } from "@/queries/social";
import { fetchLikedCheckinIds } from "@/queries/interactions";
import { fetchUnreadCount } from "@/queries/notifications";
import type { FeedItem, Profile } from "@/types/models";

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Not logged in
// ---------------------------------------------------------------------------

function NotLoggedIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="rounded-full bg-pink-50 dark:bg-rose-900/20 p-5 mb-5">
        <Newspaper className="size-10 text-pink-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Your Feed</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
        Sign in to see check-ins from people you follow, discover new spots,
        and join the conversation.
      </p>
      <Link href="/login">
        <Button
          size="lg"
          variant="brand"
          className="gap-2"
        >
          <LogIn className="size-4" />
          Sign In or Sign Up
        </Button>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty feed
// ---------------------------------------------------------------------------

function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="rounded-full bg-pink-50 dark:bg-rose-900/20 p-5 mb-5">
        <Users className="size-10 text-pink-300" />
      </div>
      <h2 className="text-lg font-bold mb-2">Your feed is empty</h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Follow other ice cream lovers to see their check-ins here. Or check in
        yourself to get started!
      </p>
      <div className="flex gap-3">
        <Link href="/discover">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            <IceCreamCone className="size-4" />
            Discover
          </Button>
        </Link>
        <Link href="/checkin/new">
          <Button
            size="sm"
            variant="brand"
            className="gap-1.5"
          >
            Check In
          </Button>
        </Link>
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
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium text-muted-foreground"
        >
          Cancel
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
        {query.trim().length < 2 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Type at least 2 characters to search
            </p>
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
          results.map((profile: Profile) => (
            <UserRow key={profile.id} profile={profile} />
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Feed Page
// ---------------------------------------------------------------------------

export default function FeedPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [compactFeed] = useLocalStorage("scooped:compactFeed", false);
  const [showSearch, setShowSearch] = useState(false);

  // Unread notification count (polls every 30s)
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotifications", user?.id],
    queryFn: () => fetchUnreadCount(user!.id),
    enabled: !!user,
    refetchInterval: 30000,
  });
  const [commentCheckinId, setCommentCheckinId] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite feed query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: feedLoading,
  } = useInfiniteQuery({
    queryKey: ["feed", user?.id],
    queryFn: ({ pageParam }) =>
      fetchFeed(user!.id, PAGE_SIZE, pageParam ?? null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return lastPage[lastPage.length - 1]?.created_at ?? undefined;
    },
    enabled: !!user,
  });

  const allItems: FeedItem[] = data?.pages.flat() ?? [];
  const checkinIds = allItems.map((item) => item.id);

  // Batch check which items the user has liked
  const { data: likedSet = new Set<string>() } = useQuery({
    queryKey: ["likedCheckins", user?.id, checkinIds.join(",")],
    queryFn: () => fetchLikedCheckinIds(user!.id, checkinIds),
    enabled: !!user && checkinIds.length > 0,
  });

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Auth loading
  if (authLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-full" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-dvh bg-background pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-card/90 backdrop-blur-md border-b border-pink-100/60 dark:border-white/5 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-pink-500">Scooped</h1>
          <div className="flex items-center gap-1">
            <Link
              href="/notifications"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed content */}
      <div className="px-4 py-4 space-y-4">
        {feedLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))
        ) : allItems.length === 0 ? (
          <EmptyFeed />
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

            {/* Infinite scroll sentinel */}
            <div ref={observerRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="size-5 animate-spin text-neutral-400" />
              </div>
            )}
          </>
        )}
      </div>

      {/* User search overlay */}
      {showSearch && <UserSearchOverlay onClose={() => setShowSearch(false)} />}

      {/* Comment sheet */}
      <CommentSheet
        checkinId={commentCheckinId}
        open={!!commentCheckinId}
        onOpenChange={(open) => {
          if (!open) setCommentCheckinId(null);
        }}
      />
    </div>
  );
}
