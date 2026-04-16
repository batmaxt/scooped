"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FollowButton } from "./FollowButton";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types/models";

interface UserRowProps {
  profile: Profile;
  showFollowButton?: boolean;
}

export function UserRow({ profile, showFollowButton = true }: UserRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link
        href={`/profile/${profile.username}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar className="size-10 shrink-0">
          {profile.avatar_url && (
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
            />
          )}
          <AvatarFallback className="bg-gradient-to-br from-[#F46B8F] to-[#F2B45A] text-white text-sm font-bold">
            {getInitials(profile.display_name, profile.username)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">
            {profile.display_name || profile.username}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            @{profile.username}
          </p>
        </div>
      </Link>
      {showFollowButton && <FollowButton targetUserId={profile.id} />}
    </div>
  );
}
