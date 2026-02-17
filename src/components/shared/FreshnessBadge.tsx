import { Clock } from "lucide-react";

export type FreshnessLevel = "fresh" | "recent" | "stale" | "unknown";

export function getFreshnessLevel(lastConfirmedAt: string | null): FreshnessLevel {
  if (!lastConfirmedAt) return "unknown";
  const hoursAgo = (Date.now() - new Date(lastConfirmedAt).getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 24) return "fresh";
  if (hoursAgo < 72) return "recent";
  return "stale";
}

const FRESHNESS_CONFIG: Record<FreshnessLevel, { label: string; color: string; bg: string }> = {
  fresh: { label: "Updated today", color: "text-green-600", bg: "bg-green-50" },
  recent: { label: "Updated recently", color: "text-amber-600", bg: "bg-amber-50" },
  stale: { label: "May be outdated", color: "text-neutral-500", bg: "bg-neutral-100" },
  unknown: { label: "Unconfirmed", color: "text-neutral-400", bg: "bg-neutral-50" },
};

export function FreshnessBadge({
  lastConfirmedAt,
  source,
  compact = false,
}: {
  lastConfirmedAt: string | null;
  source?: string;
  compact?: boolean;
}) {
  const level = getFreshnessLevel(lastConfirmedAt);
  const config = FRESHNESS_CONFIG[level];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${config.color}`}>
        <Clock className="size-2.5" />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}
    >
      <Clock className="size-2.5" />
      {config.label}
      {source === "business" && (
        <span className="text-[9px] opacity-70 ml-0.5">by shop</span>
      )}
    </span>
  );
}
