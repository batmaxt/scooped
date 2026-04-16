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
    <Card className="gap-0 py-0 overflow-hidden press-card border-0 elevation-2 gradient-border">
      {/* Colored accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#F46B8F] via-[#F2B45A] to-[#2E1F1B] dark:from-[#F46B8F]/60 dark:via-[#A8897E]/40 dark:to-[#2E1F1B]/30" />
      <CardContent className="px-4 py-4 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-2.5">
          <Link href={`/profile/${item.profile_username}`}>
            <Avatar className="size-10 ring-2 ring-[rgba(93,64,55,0.12)] dark:ring-[#332520]/30">
              {item.profile_avatar_url && (
                <AvatarImage
                  src={item.profile_avatar_url}
                  alt={item.profile_display_name || item.profile_username}
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-[#F46B8F] via-[#F2B45A] to-[#2E1F1B] text-white text-xs font-bold">
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
          className="flex items-center gap-1.5 bg-gradient-to-r from-[#FFF3EE]/60 to-[#FFF3EE]/40 dark:from-white/[0.04] dark:to-white/[0.02] rounded-lg px-2.5 py-1.5 -mx-1 hover:from-[#FFF3EE] hover:to-[#FFF3EE] dark:hover:from-white/[0.07] dark:hover:to-white/[0.05] transition-colors"
        >
          <MapPin className="size-3.5 text-[#F46B8F] shrink-0" />
          <span className="font-medium text-sm truncate">
            {item.location_name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {item.location_city}
          </span>
        </Link>

        {/* Photo — prominent, full-bleed */}
        {!compact && item.photo_url && (
          <div className="rounded-2xl overflow-hidden -mx-1">
            <img
              src={item.photo_url}
              alt="Check-in photo"
              loading="lazy"
              className="w-full max-h-80 object-cover"
            />
          </div>
        )}

        {/* Rating + timestamp row */}
        {primaryRating > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${
                    i < primaryRating
                      ? "fill-[#F2B45A] text-[#F2B45A]"
                      : "fill-none text-neutral-300 dark:text-neutral-600"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Flavor + brand — pink pills */}
        {item.flavor_name && (
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-[#FFF3EE] to-[#FFF3EE] dark:from-[#332520]/20 dark:to-[#332520]/15 text-[#C4364A] dark:text-[#F46B8F] border border-[rgba(93,64,55,0.12)] dark:border-[#C4364A]/30 rounded-full px-3 shadow-sm"
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

        {/* Actions: Melts + Comments */}
        <div className="flex items-center gap-5 pt-2 border-t border-[#FFF3EE]/40 dark:border-[#332520]/20">
          <button
            type="button"
            onClick={handleLikeToggle}
            disabled={!user}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#F46B8F] transition-colors disabled:opacity-50"
          >
            <Heart
              className={`size-4 transition-colors ${
                optimisticLiked
                  ? "fill-[#F46B8F] text-[#F46B8F] animate-heart-pop"
                  : ""
              }`}
            />
            <span className={optimisticLiked ? "text-[#F46B8F] font-medium" : ""}>
              {optimisticLikeCount > 0 ? `${optimisticLikeCount} Melts` : "Melt"}
            </span>
          </button>
          <button
            type="button"
            onClick={onCommentTap}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#F46B8F] transition-colors"
          >
            <MessageCircle className="size-4" />
            <span>
              {item.comment_count > 0 ? `${item.comment_count} Comments` : "Comment"}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
