"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  IceCreamCone,
  Tag,
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoButton } from "@/components/shared/DemoButton";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  fetchUserAlerts,
  toggleAlert,
  deleteAlert,
} from "@/queries/alerts";
import { AddAlertSheet } from "@/components/shared/AddAlertSheet";
import type { Alert } from "@/types/models";

const TYPE_ICONS: Record<string, React.ElementType> = {
  flavor: IceCreamCone,
  brand: Tag,
  location: MapPin,
};

const ACCENT_COLORS: Record<string, string> = {
  flavor: "bg-[#C4364A]",
  brand: "bg-[#F2B45A]",
  location: "bg-[#7C5CBF]",
};

// ---------------------------------------------------------------------------
// Alert Row
// ---------------------------------------------------------------------------

function AlertRow({
  alert,
  onToggle,
  onDelete,
}: {
  alert: Alert;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = TYPE_ICONS[alert.alert_type] || BellRing;
  const accentColor = ACCENT_COLORS[alert.alert_type] || "bg-[#7C5CBF]";

  const name =
    alert.alert_type === "flavor"
      ? alert.flavor?.name
      : alert.alert_type === "brand"
        ? alert.brand?.name
        : alert.location?.name;

  const subtitle =
    alert.alert_type === "location" && alert.location
      ? `${alert.location.city}, ${alert.location.state}`
      : alert.alert_type === "brand"
        ? "Brand alert"
        : alert.alert_type === "flavor"
          ? "Flavor alert"
          : undefined;

  return (
    <div className="flex bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 overflow-hidden">
      {/* Accent bar */}
      <div className={`w-1.5 ${accentColor} shrink-0`} />

      <div className="flex items-center gap-3 p-4 flex-1 min-w-0">
        <div className="flex items-center justify-center size-10 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30 shrink-0">
          <Icon className="size-5 text-[#F46B8F]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC] truncate">
            {name || "Unknown"}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
          <p className="text-[11px] text-[#F46B8F] font-medium mt-0.5">
            {alert.is_active ? "Watching for updates" : "Paused"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={alert.is_active}
            onCheckedChange={(checked) => onToggle(alert.id, checked)}
          />
          <button
            type="button"
            onClick={() => onDelete(alert.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Alerts Page
// ---------------------------------------------------------------------------

export default function AlertsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["user-alerts", user?.id],
    queryFn: () => fetchUserAlerts(user!.id),
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleAlert(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alert-count"] });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background p-5 pt-14 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16">
        <div className="px-5 pt-14 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F] mb-1">
            Alerts
          </p>
          <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
            Stay on top of your cravings
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="rounded-full bg-[#FFF3EE] dark:bg-[#332520]/20 p-5 mb-5">
            <BellRing className="size-10 text-[#F46B8F]" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs mb-8">
            Sign in to set up alerts for your favorite flavors.
          </p>
          <Link href="/login">
            <Button size="lg" variant="brand" className="gap-2">
              <LogIn className="size-4" />
              Sign In
            </Button>
          </Link>
          <DemoButton className="mt-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FFF7ED] dark:bg-background pb-16 animate-in fade-in duration-200">
      {/* Hero */}
      <div className="px-5 pt-14 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F46B8F] mb-1">
          Alerts
        </p>
        <h1 className="text-3xl font-bold font-heading text-[#2E1F1B] dark:text-[#F5E6DC] leading-tight">
          Stay on top of your cravings
        </h1>
      </div>

      <div className="px-5 pt-3 space-y-4">
        {/* Hero card */}
        <div className="bg-gradient-to-br from-[#2E1F1B] to-[#5D4037] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-white/15 shrink-0">
              <Bell className="size-5 text-white" />
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              Flavor alerts are watching the city for you. We&apos;ll notify you
              when your favorites show up nearby.
            </p>
          </div>
        </div>

        {/* Add a flavor alert CTA */}
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full bg-white dark:bg-card rounded-2xl border border-[rgba(93,64,55,0.12)]/60 dark:border-white/5 p-5 text-left hover:border-[#F46B8F]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#FFF3EE] dark:bg-[#332520]/30">
              <Plus className="size-6 text-[#F46B8F]" />
            </div>
            <div>
              <p className="font-bold text-[#2E1F1B] dark:text-[#F5E6DC]">
                Watch a flavor
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get notified when it&apos;s spotted near you
              </p>
            </div>
          </div>
        </button>

        {/* Alerts list */}
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-5 mb-4">
              <BellRing className="size-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <h3 className="font-semibold text-[#2E1F1B] dark:text-[#F5E6DC] mb-1">
              No alerts yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tap &ldquo;Watch a flavor&rdquo; above to get started.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {alerts.length} active alert{alerts.length !== 1 ? "s" : ""}
            </p>
            {alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                onToggle={(id, active) =>
                  toggleMutation.mutate({ id, active })
                }
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </>
        )}

        {/* Smart alert suggestion card */}
        {alerts.length > 0 && (
          <div className="bg-[#FFF3EE] dark:bg-amber-900/10 rounded-2xl p-5 border border-[rgba(93,64,55,0.12)]/40 dark:border-white/5/20">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-[#FFF3EE] dark:bg-amber-900/20 shrink-0">
                <Sparkles className="size-5 text-[#F2B45A]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#2E1F1B] dark:text-[#F5E6DC]">
                  Smart alert idea
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Based on your check-ins, you might enjoy setting an alert for
                  seasonal flavors near your favorite shops.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mutation status */}
        {(toggleMutation.isPending || deleteMutation.isPending) && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg z-50">
            <Loader2 className="size-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      <AddAlertSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
