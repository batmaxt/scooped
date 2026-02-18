"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationRow } from "@/components/shared/NotificationRow";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "@/queries/notifications";

export default function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
  } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user,
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllAsRead(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
    },
  });

  const hasUnread = notifications?.some((n) => !n.is_read);

  const handleTapNotification = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId).then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
      });
    }
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-background pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-pink-50 via-white to-amber-50/40 dark:from-rose-950/20 dark:via-background dark:to-background backdrop-blur-md border-b border-pink-100/50 dark:border-white/5">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h1 className="text-base font-semibold">Notifications</h1>
          </div>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-pink-500 hover:text-pink-600 gap-1"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
            >
              {markAllMutation.isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-5 mb-4">
            <Bell className="size-8 text-neutral-300 dark:text-neutral-600" />
          </div>
          <h3 className="font-semibold mb-1">No notifications yet</h3>
          <p className="text-sm text-muted-foreground max-w-[240px]">
            When people follow you, like or comment on your check-ins,
            you&apos;ll see it here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onTap={() =>
                handleTapNotification(notification.id, notification.is_read)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
