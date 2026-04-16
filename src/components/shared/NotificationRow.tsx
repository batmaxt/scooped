"use client";

import Link from "next/link";
import { Heart, MessageCircle, UserPlus, Award, Store, BellRing } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getRelativeTime, getInitials } from "@/lib/utils";
import type { AppNotification } from "@/types/models";

const ICON_MAP: Record<string, React.ElementType> = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  badge: Award,
  claim: Store,
  alert: BellRing,
};

const ICON_COLOR_MAP: Record<string, string> = {
  follow: "text-blue-500",
  like: "text-[#F46B8F]",
  comment: "text-amber-500",
  badge: "text-[#5D4037]",
  claim: "text-green-500",
  alert: "text-orange-500",
};

interface NotificationRowProps {
  notification: AppNotification;
  onTap?: () => void;
}

export function NotificationRow({ notification, onTap }: NotificationRowProps) {
  const Icon = ICON_MAP[notification.type];
  const iconColor = ICON_COLOR_MAP[notification.type];
  const actor = notification.actor;
  const actorName = actor?.display_name || actor?.username || "Someone";

  let message: React.ReactNode;
  let href: string = "/home";

  switch (notification.type) {
    case "follow":
      message = (
        <>
          <span className="font-semibold">{actorName}</span> started following
          you
        </>
      );
      href = `/profile/${actor?.username || ""}`;
      break;
    case "like":
      message = (
        <>
          <span className="font-semibold">{actorName}</span> liked your check-in
        </>
      );
      href = "/home";
      break;
    case "comment":
      message = (
        <>
          <span className="font-semibold">{actorName}</span> commented on your
          check-in
        </>
      );
      href = "/home";
      break;
    case "badge":
      message = (
        <>
          You earned the{" "}
          <span className="font-semibold">
            {notification.badge?.name || "a"}
          </span>{" "}
          badge!
        </>
      );
      href = "/profile";
      break;
    case "claim":
      message = (
        <>
          <span className="font-semibold">{actorName}</span> submitted a
          business claim
        </>
      );
      href = "/admin/claims";
      break;
    case "alert": {
      const flavorName = notification.flavor?.name || "A flavor";
      const locationName = notification.location?.name || "a location";
      message = (
        <>
          <span className="font-semibold">{flavorName}</span> is now available
          at <span className="font-semibold">{locationName}</span>!
        </>
      );
      href = notification.location?.slug
        ? `/location/${notification.location.slug}`
        : "/alerts";
      break;
    }
  }

  return (
    <Link
      href={href}
      onClick={onTap}
      className={`flex items-start gap-3 px-4 py-3.5 transition-colors ${
        notification.is_read
          ? "bg-card"
          : "bg-[#FFF3EE]/50 dark:bg-[#332520]/20"
      } hover:bg-neutral-50 dark:hover:bg-white/[0.04]`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="size-10">
          {actor?.avatar_url && (
            <AvatarImage
              src={actor.avatar_url}
              alt={actorName}
            />
          )}
          <AvatarFallback className="bg-gradient-to-br from-[#F46B8F] to-[#F2B45A] text-white text-xs font-bold">
            {notification.type === "badge"
              ? "🏆"
              : notification.type === "alert"
                ? "🍦"
                : getInitials(actor?.display_name, actor?.username)}
          </AvatarFallback>
        </Avatar>
        <div
          className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-card ring-1 ring-border flex items-center justify-center"
        >
          <Icon className={`size-3 ${iconColor}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {getRelativeTime(notification.created_at)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.is_read && (
        <div className="size-2.5 rounded-full bg-[#F46B8F] shrink-0 mt-2" />
      )}
    </Link>
  );
}
