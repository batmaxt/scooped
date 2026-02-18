"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BellRing,
  IceCreamCone,
  Tag,
  MapPin,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
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

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  flavor: { bg: "bg-pink-50", text: "text-pink-600" },
  brand: { bg: "bg-blue-50", text: "text-blue-600" },
  location: { bg: "bg-green-50", text: "text-green-600" },
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
  const colors = TYPE_COLORS[alert.alert_type] || TYPE_COLORS.flavor;

  const name =
    alert.alert_type === "flavor"
      ? alert.flavor?.name
      : alert.alert_type === "brand"
        ? alert.brand?.name
        : alert.location?.name;

  const subtitle =
    alert.alert_type === "flavor" && alert.flavor
      ? undefined
      : alert.alert_type === "location" && alert.location
        ? `${alert.location.city}, ${alert.location.state}`
        : undefined;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center size-10 rounded-full ${colors.bg} shrink-0`}
          >
            <Icon className={`size-5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold truncate">
                {name || "Unknown"}
              </p>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} capitalize`}
              >
                {alert.alert_type}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={alert.is_active}
              onCheckedChange={(checked) => onToggle(alert.id, checked)}
            />
            <button
              type="button"
              onClick={() => onDelete(alert.id)}
              className="p-2.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Alerts Page
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

  // Auth loading
  if (authLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-14 w-full" />
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="rounded-full bg-orange-50 p-5 mb-5">
          <BellRing className="size-10 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Flavor Alerts</h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-8">
          Sign in to set up alerts for your favorite flavors.
        </p>
        <Link href="/login">
          <Button
            size="lg"
            variant="brand"
            className="gap-2"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-neutral-50 dark:bg-background pb-20 animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-orange-50 via-white to-amber-50/40 dark:from-amber-950/15 dark:via-background dark:to-background backdrop-blur-md border-b border-orange-100/50 dark:border-white/5">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link
            href="/settings"
            className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Flavor Alerts</h1>
        </div>
      </header>

      <div className="px-4 py-5 space-y-4">
        {/* Info card */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <BellRing className="size-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">How alerts work</p>
              <p className="text-xs text-muted-foreground mt-1">
                Get notified when a business adds your favorite flavor, brand,
                or updates a specific location.
              </p>
            </div>
          </div>
        </div>

        {/* Alerts list */}
        {isLoading ? (
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-neutral-100 dark:bg-neutral-800 p-5 mb-4">
              <BellRing className="size-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <h3 className="font-semibold mb-1">No alerts yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Set up alerts to get notified when your favorite flavors appear at
              shops near you.
            </p>
            <Button
              onClick={() => setSheetOpen(true)}
              variant="brand"
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Your First Alert
            </Button>
          </div>
        ) : (
          <>
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

            {/* Add alert button */}
            <Button
              onClick={() => setSheetOpen(true)}
              variant="brand-gradient"
              className="w-full h-12 text-base rounded-xl gap-2"
            >
              <Plus className="size-5" />
              Add Alert
            </Button>
          </>
        )}

        {/* Mutation status */}
        {(toggleMutation.isPending || deleteMutation.isPending) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <Loader2 className="size-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Add Alert Sheet */}
      <AddAlertSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
