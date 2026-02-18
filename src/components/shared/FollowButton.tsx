"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";
import { followUser, unfollowUser, checkIfFollowing } from "@/queries/social";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  className?: string;
}

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isFollowing = false, isLoading } = useQuery({
    queryKey: ["isFollowing", user?.id, targetUserId],
    queryFn: () => checkIfFollowing(user!.id, targetUserId),
    enabled: !!user && user.id !== targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: () => followUser(user!.id, targetUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFollowing", user!.id, targetUserId],
      });
      queryClient.setQueryData(
        ["isFollowing", user!.id, targetUserId],
        true
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", user!.id, targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(user!.id, targetUserId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["isFollowing", user!.id, targetUserId],
      });
      queryClient.setQueryData(
        ["isFollowing", user!.id, targetUserId],
        false
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", user!.id, targetUserId],
      });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  if (!user || user.id === targetUserId) return null;

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className={className}>
        <Loader2 className="size-4 animate-spin" />
      </Button>
    );
  }

  if (isFollowing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => unfollowMutation.mutate()}
        disabled={isPending}
        className={className}
      >
        <UserMinus className="size-4 mr-1" />
        Following
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={() => followMutation.mutate()}
      disabled={isPending}
      variant="brand"
      className={className || ""}
    >
      <UserPlus className="size-4 mr-1" />
      Follow
    </Button>
  );
}
