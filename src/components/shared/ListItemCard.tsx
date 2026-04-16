"use client";

import Link from "next/link";
import { MapPin, IceCreamCone, Star, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ListItem } from "@/types/models";

interface ListItemCardProps {
  item: ListItem;
  isOwner: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
}

export function ListItemCard({
  item,
  isOwner,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ListItemCardProps) {
  const renderContent = () => {
    if (item.item_type === "location" && item.location) {
      const loc = item.location;
      return (
        <Link href={`/location/${loc.slug}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#F46B8F] shrink-0" />
            <span className="font-semibold text-sm truncate">{loc.name}</span>
          </div>
          <p className="text-xs text-muted-foreground ml-5">
            {loc.city}, {loc.state}
          </p>
          {loc.avg_rating > 0 && (
            <div className="flex items-center gap-0.5 ml-5 mt-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                {Number(loc.avg_rating).toFixed(1)}
              </span>
            </div>
          )}
        </Link>
      );
    }

    if (item.item_type === "flavor" && item.flavor) {
      const flav = item.flavor;
      return (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <IceCreamCone className="size-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-sm truncate">{flav.name}</span>
          </div>
          {flav.brand && (
            <p className="text-xs text-muted-foreground ml-5">
              by {flav.brand.name}
            </p>
          )}
          {flav.avg_rating > 0 && (
            <div className="flex items-center gap-0.5 ml-5 mt-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                {Number(flav.avg_rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      );
    }

    if (item.item_type === "brand" && item.brand) {
      const brand = item.brand;
      return (
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm truncate">{brand.name}</span>
          {brand.avg_rating > 0 && (
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">
                {Number(brand.avg_rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 min-w-0">
        <span className="text-sm text-muted-foreground">Unknown item</span>
      </div>
    );
  };

  return (
    <Card className="gap-0 py-0 overflow-hidden">
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-2">
          {renderContent()}
          {isOwner && (
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                aria-label="Move up"
              >
                <ChevronUp className="size-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={isLast}
                className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                aria-label="Move down"
              >
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded hover:bg-red-50 transition-colors shrink-0"
              aria-label="Remove from list"
            >
              <Trash2 className="size-4 text-red-400" />
            </button>
          )}
        </div>
        {item.note && (
          <p className="text-xs text-muted-foreground mt-1.5 italic">
            {item.note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
