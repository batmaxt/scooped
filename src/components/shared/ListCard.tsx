"use client";

import Link from "next/link";
import { Globe, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { List } from "@/types/models";

interface ListCardProps {
  list: List;
}

export function ListCard({ list }: ListCardProps) {
  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="gap-0 py-0 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">{list.name}</h3>
              {list.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {list.description}
                </p>
              )}
            </div>
            {list.is_public ? (
              <Globe className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            ) : (
              <Lock className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {list.item_count} item{list.item_count !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
