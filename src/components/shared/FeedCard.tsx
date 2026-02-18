"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  MessageCircle,
  MapPin,
  IceCreamCone,
  Star,
  Clock,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { likeCheckin, unlikeCheckin } from "@/queries/interactions";
import { getRelativeTime, getInitials } from "@/lib/utils";
import type { FeedItem } from "@/types/models";

interface FeedCardProps {
  item: FeedItem;
  isLiked: boolean;
  onCommentTap: () => void;
  compact?: boolean;
}

export function FeedCard({ item, isLiked: initialLiked, onCommentTap, compact }: FeedCardProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState(initialLiked);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(item.like_count);

  const likeMutation = useMutation({
    mutationFn: () => likeCheckin(user!.id, item.id),
    onMutate: () => {
      setOptimisticLiked(true);
      setOptimisticLikeCount((c) => c + 1);
    },
    onError: () => {
      setOptimisticLiked(false);
      setOptimisticLikeCount((c) => c - 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeCheckin(user!.id, item.id),
    onMutate: () => {
      setOptimisticLiked(false);
      setOptimisticLikeCount((c) => Math.max(c - 1, 0));
    },
    onError: () => {
      setOptimisticLiked(true);
      setOptimisticLikeCount((c) => c + 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const handleLikeToggle = () => {
    if (!user) return;
    if (optimisticLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const primaryRating = item.flavor_rating || item.location_rating || 0;

  return (
    <Card className="gap-0 py-0 overflow-hidden press-card border-0 elevation-2">
      {/* Colored accent bar */}
      <div className="h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 dark:from-rose-400/60 dark:via-pink-400/40 dark:to-amber-400/30" />
      <CardContent className="px-4 py-4 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-2.5">
          <Link href={`/profile/${item.profile_username}`}>
            <Avatar className="size-10 ring-2 ring-pink-100 dark:ring-rose-800/30">
              {item.profile_avatar_url && (
                <AvatarImage
                  src={item.profile_avatar_url}
                  alt={item.profile_display_name || item.profile_username}
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-amber-300 text-white text-xs font-bold">
                {getInitials(item.profile_display_name, item.profile_username)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${item.profile_username}`}
              className="font-semibold text-sm hover:underline"
            >
              {item.profile_display_name || item.profile_username}
            </Link>
            <p className="text-xs text-muted-foreground">
              @{item.profile_username}
            </p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Clock className="size-3" />
            {getRelativeTime(item.created_at)}
          </span>
        </div>

        {/* Location */}
        <Link
          href={`/location/${item.location_slug}`}
          className="flex items-center gap-1.5 bg-pink-50/60 dark:bg-white/[0.04] rounded-lg px-2.5 py-1.5 -mx-1 hover:bg-pink-50 dark:hover:bg-white/[0.07] transition-colors"
        >
          <MapPin className="size-3.5 text-pink-400 shrink-0" />
          <span className="font-medium text-sm truncate">
            {item.location_name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {item.location_city}
          </span>
        </Link>

        {/* Flavor + brand */}
        {item.flavor_name && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-amber-50 dark:bg-amber-900/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30"
            >
              <IceCreamCone className="size-3 mr-1" />
              {item.flavor_name}
            </Badge>
            {item.brand_name && (
              <span className="text-xs text-muted-foreground">
                by {item.brand_name}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
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

        {/* Photo */}
        {!compact && item.photo_url && (
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 -mx-1">
            <img
              src={item.photo_url}
              alt="Check-in photo"
              loading="lazy"
              className="w-full max-h-72 object-cover"
            />
          </div>
        )}

        {/* Notes */}
        {!compact && item.notes && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.notes}
          </p>
        )}

        {/* Tags */}
        {!compact && item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions: like + comment */}
        <div className="flex items-center gap-4 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={!user}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-pink-500 transition-colors disabled:opacity-50"
          >
            <Heart
              className={`size-4 transition-colors ${
                optimisticLiked
                  ? "fill-pink-500 text-pink-500 animate-heart-pop"
                  : ""
              }`}
            />
            {optimisticLikeCount > 0 && (
              <span>{optimisticLikeCount}</span>
            )}
          </button>
          <button
            type="button"
            onClick={onCommentTap}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="size-4" />
            {item.comment_count > 0 && (
              <span>{item.comment_count}</span>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
